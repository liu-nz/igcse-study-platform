/* Local-only portable backups. Import accepts a fixed schema, never accounts or credentials. */
const BACKUP_MAX_BYTES = 5 * 1024 * 1024;
const BACKUP_ARCHIVE_MAX_BYTES = 100 * 1024 * 1024;
const BACKUP_ATTACHMENTS_MAX_BYTES = 90 * 1024 * 1024;
let pendingBackup = null;
let pendingBackupFiles = [];
let backupPreviewVersion = 0;
let backupImporting = false;
const ZIP_CRC_TABLE=(()=>{const table=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?(0xedb88320^(c>>>1)):(c>>>1);table[n]=c>>>0;}return table;})();

function zipCrc32(bytes) {
    let crc = 0xffffffff;
    for (const byte of bytes) crc = ZIP_CRC_TABLE[(crc ^ byte) & 255] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
}
function writeZipHeader(view, offset, signature, values) {
    view.setUint32(offset, signature, true);
    values.forEach(([at, size, value]) => size === 2 ? view.setUint16(offset + at, value, true) : view.setUint32(offset + at, value, true));
}
function createStoredZip(entries) {
    if (entries.length > 5001) throw new Error('备份文件过多；请减少资料后重试 Too many files in backup');
    const encoder = new TextEncoder(), localParts = [], centralParts = [];
    let offset = 0, total = 0;
    for (const entry of entries) {
        const name = encoder.encode(entry.name), bytes = entry.bytes instanceof Uint8Array ? entry.bytes : new Uint8Array(entry.bytes);
        if (!entry.name || !(entry.name==='manifest.json'||/^attachments\/[\w%.-]+--[\w%.-]+$/.test(entry.name)) || name.length > 1000 || bytes.length > BACKUP_ARCHIVE_MAX_BYTES) throw new Error('备份文件无效 Invalid archive entry');
        total += bytes.length;
        if (total > BACKUP_ARCHIVE_MAX_BYTES) throw new Error('完整备份超过 100 MB，请分批处理资料 Full backup exceeds 100 MB');
        const crc = zipCrc32(bytes), local = new Uint8Array(30 + name.length), localView = new DataView(local.buffer);
        writeZipHeader(localView, 0, 0x04034b50, [[4,2,20],[6,2,0x0800],[8,2,0],[10,2,0],[12,2,0],[14,4,crc],[18,4,bytes.length],[22,4,bytes.length],[26,2,name.length],[28,2,0]]);
        local.set(name,30); localParts.push(local,bytes);
        const central = new Uint8Array(46 + name.length), centralView = new DataView(central.buffer);
        writeZipHeader(centralView, 0, 0x02014b50, [[4,2,20],[6,2,20],[8,2,0x0800],[10,2,0],[12,2,0],[14,2,0],[16,4,crc],[20,4,bytes.length],[24,4,bytes.length],[28,2,name.length],[30,2,0],[32,2,0],[34,2,0],[36,2,0],[38,4,0],[42,4,offset]]);
        central.set(name,46); centralParts.push(central); offset += local.length + bytes.length;
    }
    const centralSize = centralParts.reduce((sum,part)=>sum+part.length,0);
    const end = new Uint8Array(22), endView = new DataView(end.buffer);
    writeZipHeader(endView,0,0x06054b50,[[4,2,0],[6,2,0],[8,2,entries.length],[10,2,entries.length],[12,4,centralSize],[16,4,offset],[20,2,0]]);
    const blob = new Blob([...localParts,...centralParts,end],{type:'application/zip'});
    if (blob.size > BACKUP_ARCHIVE_MAX_BYTES) throw new Error('完整备份超过 100 MB，请分批处理资料 Full backup exceeds 100 MB');
    return blob;
}
function readStoredZip(buffer) {
    const bytes = new Uint8Array(buffer), view = new DataView(buffer), decoder = new TextDecoder('utf-8',{fatal:true});
    if (bytes.length < 22 || bytes.length > BACKUP_ARCHIVE_MAX_BYTES) throw new Error('ZIP 备份大小无效 Invalid ZIP backup size');
    let end = -1;
    for (let i=bytes.length-22; i>=Math.max(0,bytes.length-65557); i--) if (view.getUint32(i,true)===0x06054b50) { end=i; break; }
    if (end<0 || view.getUint16(end+4,true)!==0 || view.getUint16(end+6,true)!==0) throw new Error('ZIP 文件损坏或不受支持 Invalid or unsupported ZIP');
    const count=view.getUint16(end+10,true), centralSize=view.getUint32(end+12,true), centralOffset=view.getUint32(end+16,true);
    if (count>5001 || centralOffset+centralSize!==end) throw new Error('ZIP 目录无效 Invalid ZIP directory');
    const entries=new Map(); let pos=centralOffset, total=0;
    for(let i=0;i<count;i++){
        if(pos+46>centralOffset+centralSize||view.getUint32(pos,true)!==0x02014b50)throw new Error('ZIP 目录条目损坏 Corrupt ZIP entry');
        const flags=view.getUint16(pos+8,true),method=view.getUint16(pos+10,true),crc=view.getUint32(pos+16,true),compressed=view.getUint32(pos+20,true),size=view.getUint32(pos+24,true),nameLength=view.getUint16(pos+28,true),extraLength=view.getUint16(pos+30,true),commentLength=view.getUint16(pos+32,true),disk=view.getUint16(pos+34,true),localOffset=view.getUint32(pos+42,true);
        if(flags&1||flags&8||!(flags&0x0800)||method!==0||compressed!==size||size>BACKUP_ARCHIVE_MAX_BYTES||disk!==0)throw new Error('ZIP 必须为本站未压缩格式且不能加密 ZIP must use supported unencrypted format');
        const name=decoder.decode(bytes.subarray(pos+46,pos+46+nameLength)); pos+=46+nameLength+extraLength+commentLength;
        if(entries.has(name)||!(name==='manifest.json'||/^attachments\/[\w%.-]+--[\w%.-]+$/.test(name)))throw new Error('ZIP 含有重复或无效文件名 Duplicate or invalid ZIP path');
        if(localOffset+30>bytes.length||view.getUint32(localOffset,true)!==0x04034b50)throw new Error('ZIP 文件内容损坏 Corrupt ZIP payload');
        const localNameLength=view.getUint16(localOffset+26,true),localExtraLength=view.getUint16(localOffset+28,true),dataStart=localOffset+30+localNameLength+localExtraLength;
        if(view.getUint16(localOffset+6,true)!==flags||view.getUint16(localOffset+8,true)!==method||decoder.decode(bytes.subarray(localOffset+30,localOffset+30+localNameLength))!==name||dataStart+size>centralOffset||view.getUint32(localOffset+14,true)!==crc||view.getUint32(localOffset+18,true)!==size||view.getUint32(localOffset+22,true)!==size)throw new Error('ZIP 文件头与目录不匹配 ZIP header mismatch');
        const content=bytes.slice(dataStart,dataStart+size);
        if(zipCrc32(content)!==crc)throw new Error('ZIP 校验失败，请重新导出 CRC mismatch');
        total+=size;if(total>BACKUP_ARCHIVE_MAX_BYTES)throw new Error('ZIP 内容超过 100 MB ZIP contents exceed 100 MB');
        entries.set(name,content);
    }
    if(pos!==centralOffset+centralSize)throw new Error('ZIP 目录长度无效 Invalid ZIP directory size');
    return entries;
}

function backupText(value, max = 20000) {
    if (typeof value !== 'string' || value.length > max) throw new Error('备份文本字段无效 Invalid text field');
    return value;
}
function backupNumber(value, max = 100000000) {
    if (!Number.isFinite(value) || value < 0 || value > max) throw new Error('备份数字字段无效 Invalid numeric field');
    return value;
}
function backupDate(value, optional = false) {
    if (optional && (value === null || value === undefined)) return null;
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('备份日期无效 Invalid date');
    const parsed = parseLocalDate(value);
    if (!parsed || formatLocalDate(parsed) !== value) throw new Error('备份日期无效 Invalid date');
    return value;
}
function backupList(value, max = 20000) {
    if (!Array.isArray(value) || value.length > max) throw new Error('备份列表无效 Invalid list');
    return value;
}
function backupObject(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('备份对象无效 Invalid object');
    return value;
}
function backupId(value) {
    if (typeof value !== 'string' || !/^[\p{L}\p{N}_:-]{1,150}$/u.test(value)) throw new Error('备份标识无效 Invalid identifier');
    return value;
}
function backupCard(card) {
    backupObject(card);
    const clean = { front: backupText(card.front), back: backupText(card.back) };
    for (const key of ['frontEn', 'backEn']) if (card[key] !== undefined) clean[key] = backupText(card[key]);
    return clean;
}
function normaliseBackup(raw) {
    backupObject(raw);
    if (![1, 2].includes(raw.version)) throw new Error('不支持此备份版本 Unsupported backup version');
    if (raw.version === 2 && raw.format !== 'igcse-local-backup') throw new Error('不是本站备份 Not an IGCSE backup');
    const bank = new Map(QUESTION_BANK.map(q => [q.id, q]));
    const data = { quizRecords: [], wrongQuestions: [], srsData: {}, flashcards: [], materials: [], dailyStats: {}, typingWords: {}, commandWords: {}, studyTime: backupNumber(raw.studyTime ?? 0), skipped: 0 };
    for (const record of backupList(raw.quizRecords ?? [])) {
        backupObject(record);
        const questions = backupList(record.questions, 5000);
        const answers = backupList(record.answers, 5000);
        if (questions.length !== answers.length) throw new Error('题目与答案数量不一致 Question/answer mismatch');
        const clean = { date: backupDate(record.date), questions: [], answers: [], time: backupNumber(record.time ?? 0) };
        if (record.id !== undefined) clean.id = backupId(record.id);
        questions.forEach((snapshot, i) => {
            backupObject(snapshot);
            const q = bank.get(snapshot.id);
            if (!q) { data.skipped++; return; }
            const answer = answers[i];
            if (answer !== null && (!Number.isInteger(answer) || answer < 0 || answer >= q.options.length)) throw new Error('答案选项无效 Invalid answer');
            clean.questions.push({ ...q }); clean.answers.push(answer);
        });
        clean.total = clean.questions.length;
        clean.correct = clean.questions.filter((q, i) => q.answer === clean.answers[i]).length;
        if (clean.total) data.quizRecords.push(clean);
    }
    for (const mistake of backupList(raw.wrongQuestions ?? [])) {
        backupObject(mistake);
        const q = bank.get(mistake.id);
        if (!q) { data.skipped++; continue; }
        if (mistake.wrongAnswer != null && (!Number.isInteger(mistake.wrongAnswer) || mistake.wrongAnswer < 0 || mistake.wrongAnswer >= q.options.length)) throw new Error('错题答案无效 Invalid mistake answer');
        data.wrongQuestions.push({ ...q, wrongAnswer: mistake.wrongAnswer ?? null, reason: Object.prototype.hasOwnProperty.call(MISTAKE_REASONS, mistake.reason) ? mistake.reason : '', date: backupDate(mistake.date), resolved: mistake.resolved === true, resolvedAt: backupDate(mistake.resolvedAt, true), lastAttempt: backupDate(mistake.lastAttempt, true), correctStreak: backupNumber(mistake.correctStreak ?? 0) });
    }
    for (const [id, state] of Object.entries(backupObject(raw.srsData ?? {}))) {
        if (!bank.has(id)) { data.skipped++; continue; }
        backupObject(state);
        const easeFactor = backupNumber(state.easeFactor, 3);
        if (easeFactor < 1.3) throw new Error('SRS 难度系数无效 Invalid SRS ease');
        data.srsData[id] = { interval: backupNumber(state.interval, 36500), repetitions: backupNumber(state.repetitions), easeFactor, nextReview: backupDate(state.nextReview), lastReview: backupDate(state.lastReview, true) };
    }
    for (const deck of backupList(raw.flashcards ?? [], 1000)) {
        backupObject(deck);
        data.flashcards.push({ id: backupId(deck.id), subject: backupText(deck.subject, 100), name: backupText(deck.name, 300), icon: backupText(deck.icon ?? '🃏', 30), cards: backupList(deck.cards, 10000).map(backupCard) });
    }
    for (const material of backupList(raw.materials ?? [], 5000)) {
        backupObject(material);
        const canonical = MATERIALS_DATA.find(m => m.id === material.id);
        if (canonical) { data.materials.push({ ...canonical }); continue; }
        const clean = { id: backupId(material.id), name: backupText(material.name, 300), subject: backupText(material.subject, 100), type: ['notes','pastpaper','markscheme','summary','other'].includes(material.type) ? material.type : 'other', icon: '📁', localMetadataOnly: true, date: backupDate(material.date), tags: backupList(material.tags ?? [], 50).map(t => backupText(t, 100)) };
        for (const key of ['size','fileName','mimeType','content','en']) if (material[key] !== undefined) clean[key] = backupText(material[key]);
        data.materials.push(clean);
    }
    for (const [date, stats] of Object.entries(backupObject(raw.dailyStats ?? {}))) {
        backupDate(date); backupObject(stats);
        const questions = backupNumber(stats.questions), correct = backupNumber(stats.correct);
        if (correct > questions) throw new Error('每日统计无效 Invalid daily statistics');
        data.dailyStats[date] = { questions, correct };
    }
    const validWords = typeof VOCAB_BANK === 'undefined' ? new Set() : new Set(VOCAB_BANK.map(w => w.id));
    for (const [id, word] of Object.entries(backupObject(raw.typingWords ?? {}))) {
        if (!validWords.has(id)) { data.skipped++; continue; }
        backupObject(word);
        const attempts = backupNumber(word.attempts), correct = backupNumber(word.correct);
        if (correct > attempts) throw new Error('默写统计无效 Invalid recall statistics');
        data.typingWords[id] = { attempts, correct, wrong: word.wrong === true, lastPractised: backupText(word.lastPractised ?? '', 50) };
    }
    const validCommands = new Set(typeof COMMAND_PRACTICE === 'undefined' ? [] : COMMAND_PRACTICE.map(c=>c.word));
    for (const [word, state] of Object.entries(backupObject(raw.commandWords ?? {}))) {
        if (!validCommands.has(word)) { data.skipped++; continue; }
        backupObject(state);
        const attempts=backupNumber(state.attempts), correct=backupNumber(state.correct), correctStreak=backupNumber(state.correctStreak);
        if (correct>attempts || correctStreak>correct) throw new Error('指令词统计无效 Invalid command-word progress');
        data.commandWords[word]={attempts,correct,correctStreak,needsReview:state.needsReview===true,lastPractised:backupDate(state.lastPractised,true)};
    }
    return data;
}
function quizRecordSignature(record) {
    // Legacy records have no session ID; identical legacy snapshots are deduplicated.
    return record.id || JSON.stringify([record.date, record.time, record.questions.map(q => q.id), record.answers]);
}
function mergeBackup(local, incoming) {
    const next = JSON.parse(JSON.stringify(local));
    const records = new Set(next.quizRecords.map(quizRecordSignature));
    incoming.quizRecords.forEach(record => { const key = quizRecordSignature(record); if (!records.has(key)) { next.quizRecords.push(record); records.add(key); } });
    for (const key of ['wrongQuestions','materials']) {
        const ids = new Set(next[key].map(item => item.id));
        incoming[key].forEach(item => { if (!ids.has(item.id)) { next[key].push(item); ids.add(item.id); } });
    }
    for (const [id, state] of Object.entries(incoming.srsData)) if (!Object.prototype.hasOwnProperty.call(next.srsData, id)) next.srsData[id] = state;
    incoming.flashcards.forEach(deck => {
        const target = next.flashcards.find(d => d.id === deck.id);
        if (!target) { next.flashcards.push(deck); return; }
        const cards = new Set(target.cards.map(c => JSON.stringify([c.front,c.back,c.frontEn,c.backEn])));
        deck.cards.forEach(card => { const key = JSON.stringify([card.front,card.back,card.frontEn,card.backEn]); if (!cards.has(key)) { target.cards.push(card); cards.add(key); } });
    });
    const historyDays = {};
    next.quizRecords.forEach(record => {
        const day = historyDays[record.date] ||= {questions:0,correct:0};
        record.answers.forEach((answer,i) => { if (Number.isInteger(answer)) { day.questions++; if (answer === record.questions[i]?.answer) day.correct++; } });
    });
    for (const date of new Set([...Object.keys(next.dailyStats),...Object.keys(incoming.dailyStats),...Object.keys(historyDays)])) {
        const rows = [next.dailyStats[date],incoming.dailyStats[date],historyDays[date]].filter(Boolean);
        // Counters are snapshots, not independent events: never sum them on repeated imports.
        next.dailyStats[date] = {questions:Math.max(...rows.map(s=>s.questions)),correct:Math.max(...rows.map(s=>s.correct))};
    }
    next.studyTime = Math.max(next.studyTime, incoming.studyTime, next.quizRecords.reduce((total,r)=>total+r.time,0));
    const dates = Object.keys(next.dailyStats).filter(d=>next.dailyStats[d].questions>0).sort();
    next.lastStudyDate = dates.at(-1) || null;
    next.streak = 0;
    if (next.lastStudyDate) {
        const cursor = parseLocalDate(next.lastStudyDate);
        while (next.dailyStats[formatLocalDate(cursor)]?.questions > 0) { next.streak++; cursor.setDate(cursor.getDate()-1); }
    }
    return next;
}
function buildBackupPayload() {
    const settings = {};
    for (const key of ['siteName','board','examDate','darkMode','reminder','remindTime','keywords']) settings[key] = appData.settings[key];
    const payload = {format:'igcse-local-backup',version:2,exportedAt:new Date().toISOString(),settings};
    for (const key of ['quizRecords','wrongQuestions','srsData','flashcards','materials','dailyStats','studyTime']) payload[key] = appData[key];
    if (currentUser && typeof commandWordsForOwner === 'function') payload.commandWords = commandWordsForOwner();
    if (currentUser && typeof loadTyping === 'function') { loadTyping(); payload.typingWords = typingData.words; }
    // Normalize the exported study schema too: unexpected account/key fields never travel.
    const clean = normaliseBackup(payload);
    delete clean.skipped;
    clean.quizRecords = clean.quizRecords.map(record => ({...record, questions:record.questions.map(q=>({id:q.id}))}));
    clean.wrongQuestions = clean.wrongQuestions.map(({id,wrongAnswer,reason,date,resolved,resolvedAt,lastAttempt,correctStreak})=>({id,wrongAnswer,reason,date,resolved,resolvedAt,lastAttempt,correctStreak}));
    return {...clean,format:payload.format,version:2,exportedAt:payload.exportedAt,settings};
}
async function createFullBackupBlob() {
    const backup=buildBackupPayload(),attachments=[],entries=[{name:'manifest.json',bytes:new TextEncoder().encode('')}];
    const materials=(appData.materials||[]).filter(m=>!MATERIALS_DATA.some(item=>item.id===m.id));
    let db=null,total=0;
    try {
        db=await openMaterialDB();
        for(const material of materials){
            if(!material.localFileStored)continue;
            const row=await new Promise((resolve,reject)=>{const request=db.transaction('files').objectStore('files').get(String(material.id));request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
            if(!row?.file)throw new Error(`本地附件“${material.name}”缺失，请重新上传后再导出 Missing local attachment: ${material.name}`);
            total+=row.file.size;if(total>BACKUP_ATTACHMENTS_MAX_BYTES)throw new Error('附件合计超过 90 MB；请减少资料后再导出 Attachments exceed 90 MB');
            const path=`attachments/${encodeURIComponent(String(material.id))}--${attachments.length}.bin`;
            const bytes=new Uint8Array(await row.file.arrayBuffer());
            attachments.push({id:String(material.id),fileName:backupText(material.fileName||row.fileName||'attachment',300),mimeType:backupText(material.mimeType||row.file.type||'',300),size:bytes.length,path});
            entries.push({name:path,bytes});
        }
    } finally { db?.close(); }
    const notIncluded=materials.filter(m=>!m.localFileStored).map(m=>({id:m.id,name:m.name,fileName:m.fileName||''}));
    const manifest={format:'igcse-local-bundle',version:1,backup,attachments,notIncluded};
    entries[0].bytes=new TextEncoder().encode(JSON.stringify(manifest));
    return createStoredZip(entries);
}
async function exportFullBackup() {
    const button=document.getElementById('full-backup-export');
    if(button?.disabled)return;
    if(button)button.disabled=true;
    try {
        const blob=await createFullBackupBlob(),url=URL.createObjectURL(blob),a=document.createElement('a');
        a.href=url;a.download=`igcse-full-backup-${getTodayStr()}.zip`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
        showToast('完整备份已导出，包含本机附件 Full backup exported with local attachments');
    } catch(error) { showToast('无法导出完整备份：'+error.message,7000); }
    finally {if(button)button.disabled=false;}
}
function parseFullBackupArchive(buffer) {
    const entries=readStoredZip(buffer),manifestBytes=entries.get('manifest.json');
    if(!manifestBytes)throw new Error('完整备份缺少清单 Full backup manifest is missing');
    const manifest=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(manifestBytes));
    if(manifest?.format!=='igcse-local-bundle'||manifest.version!==1||!Array.isArray(manifest.attachments)||manifest.attachments.length>5000)throw new Error('完整备份格式无效 Invalid full backup manifest');
    const metadataIds=new Map(backupList(manifest.backup?.materials??[],5000).map(m=>[String(m.id),m])),seen=new Set(),files=[];
    let total=0;
    for(const item of manifest.attachments){
        backupObject(item);const id=backupId(item.id),fileName=backupText(item.fileName,300),path=backupText(item.path,1200),meta=metadataIds.get(id),content=entries.get(path);
        if(seen.has(id)||!meta||meta.fileName!==fileName||!content||path!==`attachments/${encodeURIComponent(id)}--${files.length}.bin`||item.size!==content.length)throw new Error('附件与资料索引不匹配 Attachment does not match material metadata');
        seen.add(id);total+=content.length;if(total>BACKUP_ATTACHMENTS_MAX_BYTES)throw new Error('附件合计超过 90 MB Attachments exceed 90 MB');
        files.push({id,fileName,mimeType:backupText(item.mimeType||'',300),file:new Blob([content],{type:item.mimeType||''})});
    }
    if(entries.size!==files.length+1)throw new Error('完整备份中包含未登记文件 Unlisted files in full backup');
    const notIncluded=backupList(manifest.notIncluded??[],5000);
    return {backup:normaliseBackup(manifest.backup),files,notIncluded:notIncluded.length};
}
async function storeImportedAttachments(next,files) {
    if(!files.length)return [];
    const db=await openMaterialDB(),inserted=[],restored=[];
    try {
        await new Promise((resolve,reject)=>{
            const tx=db.transaction('files','readwrite'),store=tx.objectStore('files');
            for(const item of files){
                const request=store.get(item.id);
                request.onsuccess=()=>{
                    const material=next.materials.find(m=>String(m.id)===item.id);
                    if(!material)return;
                    if(!request.result){store.put({id:item.id,file:item.file,fileName:item.fileName});inserted.push(item.id);}
                    restored.push(item.id);
                };
                request.onerror=()=>{try{tx.abort();}catch(_){};};
            }
            tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||Error('无法写入本机附件'));tx.onabort=()=>reject(tx.error||Error('附件导入已取消'));
        });
    } finally {db.close();}
    for(const id of restored){const material=next.materials.find(m=>String(m.id)===id);if(material){material.localFileStored=true;delete material.localMetadataOnly;}}
    return inserted;
}
async function rollbackImportedAttachments(ids) {
    if(!ids.length)return;
    const db=await openMaterialDB();
    try { await new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite'),store=tx.objectStore('files');ids.forEach(id=>store.delete(id));tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);}); }
    finally {db.close();}
}
async function previewBackupImport(file) {
    const generation = ++backupPreviewVersion;
    pendingBackup = null;pendingBackupFiles=[];
    document.getElementById('backup-confirm').disabled = true;
    const preview = document.getElementById('backup-preview');
    if (!file) { preview.textContent = ''; return; }
    try {
        const isZip=/\.zip$/i.test(file.name||'');
        if(isZip&&file.size>BACKUP_ARCHIVE_MAX_BYTES)throw new Error('完整备份超过 100 MB Backup exceeds 100 MB');
        if(!isZip&&file.size>BACKUP_MAX_BYTES)throw new Error('JSON 学习数据备份超过 5 MB，请选择较小备份 JSON backup exceeds 5 MB');
        const full=isZip?parseFullBackupArchive(await file.arrayBuffer()):{backup:normaliseBackup(JSON.parse(await file.text())),files:[],notIncluded:0};
        const incoming=full.backup;
        if (generation !== backupPreviewVersion) return;
        pendingBackup = incoming;pendingBackupFiles=full.files;
        preview.textContent = `可导入：${pendingBackup.quizRecords.length} 组练习、${pendingBackup.wrongQuestions.length} 道错题、${Object.keys(pendingBackup.srsData).length} 条 SRS、${pendingBackup.flashcards.length} 组闪卡、${pendingBackup.materials.length} 条资料索引、${Object.keys(pendingBackup.typingWords).length} 个默写词、${Object.keys(pendingBackup.commandWords).length} 个指令词记录。附件 ${full.files.length} 个${full.notIncluded?`；${full.notIncluded} 条旧资料仅有索引`:''}。跳过已不在词库/题库中的条目：${pendingBackup.skipped}。现有记录保留，重复资料不叠加。`;
        document.getElementById('backup-confirm').disabled = false;
    } catch (error) { if (generation !== backupPreviewVersion) return; pendingBackup = null;pendingBackupFiles=[]; preview.textContent = `无法导入 / Cannot import: ${error.message}`; }
}
async function confirmBackupImport() {
    if (!pendingBackup || !currentUser || backupImporting) return;
    if (currentPage === 'quiz' && quizState.questions.length && !quizState.finished && !document.getElementById('quiz-playing').classList.contains('hidden')) { showToast('请先完成或退出当前练习 Finish or exit your quiz first'); return; }
    backupImporting=true;document.getElementById('backup-confirm').disabled=true;
    const next = mergeBackup(appData, pendingBackup);
    if (typeof quizOwnerKey === 'function') {
        next.commandWordProgress ||= {};
        const words=next.commandWordProgress[quizOwnerKey()] ||= {};
        for (const [word,state] of Object.entries(pendingBackup.commandWords)) if (!Object.prototype.hasOwnProperty.call(words,word)) words[word]=state;
    }
    const typingKey = typeof typingStorageKey === 'function' ? typingStorageKey() : null;
    let oldTyping = null, typingWritten = false, insertedFiles=[];
    try {
        insertedFiles=await storeImportedAttachments(next,pendingBackupFiles);
        if (typingKey && Object.keys(pendingBackup.typingWords).length) {
            oldTyping = localStorage.getItem(typingKey);
            const localTyping = JSON.parse(oldTyping || '{"words":{},"session":null}');
            localTyping.words ||= {};
            for (const [id, word] of Object.entries(pendingBackup.typingWords)) if (!Object.prototype.hasOwnProperty.call(localTyping.words,id)) localTyping.words[id] = word;
            localStorage.setItem(typingKey, JSON.stringify(localTyping)); typingWritten = true;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
        if (typingWritten) { try { if (oldTyping === null) localStorage.removeItem(typingKey); else localStorage.setItem(typingKey,oldTyping); } catch (_) {} }
        try { await rollbackImportedAttachments(insertedFiles); } catch (_) {}
        backupImporting=false;document.getElementById('backup-confirm').disabled=!pendingBackup;
        showToast('无法保存导入数据；请先导出备份并检查浏览器存储空间 Import could not be saved', 6000);
        return;
    }
    backupImporting=false;
    appData = next;
    if (typingKey) typingOwner = null;
    document.getElementById('storage-save-warning')?.classList.add('hidden');
    pendingBackup = null;pendingBackupFiles=[];
    document.getElementById('backup-confirm').disabled = true;
    document.getElementById('backup-file').value = '';
    document.getElementById('backup-preview').textContent = '已合并保存。原有记录、账号与设置保留。Merged and saved; existing records, accounts and settings retained.';
    showToast('备份已合并导入 Backup merged');
}
