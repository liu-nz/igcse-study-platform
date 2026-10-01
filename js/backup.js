/* Local-only portable backups. Import accepts a fixed schema, never accounts or credentials. */
const BACKUP_MAX_BYTES = 5 * 1024 * 1024;
let pendingBackup = null;
let backupPreviewVersion = 0;

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
    const data = { quizRecords: [], wrongQuestions: [], srsData: {}, flashcards: [], materials: [], dailyStats: {}, typingWords: {}, studyTime: backupNumber(raw.studyTime ?? 0), skipped: 0 };
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
    if (currentUser && typeof loadTyping === 'function') { loadTyping(); payload.typingWords = typingData.words; }
    // Normalize the exported study schema too: unexpected account/key fields never travel.
    const clean = normaliseBackup(payload);
    delete clean.skipped;
    clean.quizRecords = clean.quizRecords.map(record => ({...record, questions:record.questions.map(q=>({id:q.id}))}));
    clean.wrongQuestions = clean.wrongQuestions.map(({id,wrongAnswer,reason,date,resolved,resolvedAt,lastAttempt,correctStreak})=>({id,wrongAnswer,reason,date,resolved,resolvedAt,lastAttempt,correctStreak}));
    return {...clean,format:payload.format,version:2,exportedAt:payload.exportedAt,settings};
}
async function previewBackupImport(file) {
    const generation = ++backupPreviewVersion;
    pendingBackup = null;
    document.getElementById('backup-confirm').disabled = true;
    const preview = document.getElementById('backup-preview');
    if (!file) { preview.textContent = ''; return; }
    try {
        if (file.size > BACKUP_MAX_BYTES) throw new Error('备份超过 5 MB，请选择较小的备份 Backup exceeds 5 MB');
        const incoming = normaliseBackup(JSON.parse(await file.text()));
        if (generation !== backupPreviewVersion) return;
        pendingBackup = incoming;
        preview.textContent = `可导入：${pendingBackup.quizRecords.length} 组练习、${pendingBackup.wrongQuestions.length} 道错题、${Object.keys(pendingBackup.srsData).length} 条 SRS、${pendingBackup.flashcards.length} 组闪卡、${pendingBackup.materials.length} 条资料索引、${Object.keys(pendingBackup.typingWords).length} 个默写词记录。跳过已不在词库/题库中的条目：${pendingBackup.skipped}。现有同题状态与设置保留，重复记录不叠加。文件本体不包含在备份内。`;
        document.getElementById('backup-confirm').disabled = false;
    } catch (error) { if (generation !== backupPreviewVersion) return; pendingBackup = null; preview.textContent = `无法导入 / Cannot import: ${error.message}`; }
}
function confirmBackupImport() {
    if (!pendingBackup || !currentUser) return;
    if (currentPage === 'quiz' && quizState.questions.length && !quizState.finished && !document.getElementById('quiz-playing').classList.contains('hidden')) { showToast('请先完成或退出当前练习 Finish or exit your quiz first'); return; }
    const next = mergeBackup(appData, pendingBackup);
    const typingKey = typeof typingStorageKey === 'function' ? typingStorageKey() : null;
    let oldTyping = null, typingWritten = false;
    try {
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
        showToast('无法保存导入数据；请先导出备份并检查浏览器存储空间 Import could not be saved', 6000);
        return;
    }
    appData = next;
    if (typingKey) typingOwner = null;
    document.getElementById('storage-save-warning')?.classList.add('hidden');
    pendingBackup = null;
    document.getElementById('backup-confirm').disabled = true;
    document.getElementById('backup-file').value = '';
    document.getElementById('backup-preview').textContent = '已合并保存。原有记录、账号与设置保留。Merged and saved; existing records, accounts and settings retained.';
    showToast('备份已合并导入 Backup merged');
}
