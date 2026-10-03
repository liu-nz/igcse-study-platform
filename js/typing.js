/* Device-local recall practice, isolated per login identity. */
let typingData = { words: {}, session: null };
let typingOwner = null;
const typingEl = id => document.getElementById('typing-' + id);
function typingStorageKey() { return 'igcse_typing_v1:' + encodeURIComponent(currentUser?.id || currentUser?.email || currentUser?.name || 'guest'); }
function saveTyping() {
    try { localStorage.setItem(typingOwner, JSON.stringify(typingData)); typingEl('storage-warning').classList.add('hidden'); }
    catch (_) { typingEl('storage-warning').classList.remove('hidden'); }
}
function loadTyping() {
    const key = typingStorageKey();
    if (typingOwner === key) return;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    typingEl('result').classList.add('hidden');
    typingOwner = key;
    typingData = {words:{},session:null};
    try {
        const saved = JSON.parse(localStorage.getItem(key) || 'null');
        if (saved && saved.words && typeof saved.words === 'object' && !Array.isArray(saved.words)) {
            typingData.words = saved.words;
            const s = saved.session;
            if (s && Array.isArray(s.ids) && s.ids.length && s.ids.every(id=>VOCAB_BANK.some(w=>w.id===id)) && Number.isInteger(s.index) && s.index>=0 && s.index<s.ids.length && Array.isArray(s.results) && ['meaning','audio'].includes(s.mode)) typingData.session = s;
        }
    } catch (_) { typingEl('storage-warning').classList.remove('hidden'); }
}
function typingPool() { const subject=typingEl('subject').value;return VOCAB_BANK.filter(w=>subject==='all'||w.subject===subject); }
function normaliseTyping(value) { return value.normalize('NFKC').trim().toLowerCase().replace(/[’‘]/g,"'").replace(/[-‐‑–]/g,' ').replace(/\s+/g,' '); }
function isTypingCorrect(value, word) { return [word.word,...word.alternatives].some(answer=>normaliseTyping(answer)===normaliseTyping(value)); }
function renderTypingSetup() {
    loadTyping();
    if (typingData.session) typingEl('subject').value = typingData.session.subject || 'all';
    else { unlockTyping(); typingEl('empty').classList.remove('hidden'); }
    const pool=typingPool();
    const wrong=pool.filter(w=>typingData.words[w.id]?.wrong);
    const learned=pool.filter(w=>typingData.words[w.id]?.correct>0&&!typingData.words[w.id]?.wrong);
    typingEl('stats').innerHTML = `<div><strong>${pool.length}</strong><span>词库词数</span></div><div><strong>${learned.length}</strong><span>已独立答对</span></div><div><strong>${wrong.length}</strong><span>待巩固</span></div>`;
    typingEl('wrong-start').disabled=!wrong.length;
    typingEl('wrong-list').innerHTML=wrong.length?wrong.map(w=>`<span class="word-chip"><b>${escapeHtml(w.word)}</b> ${escapeHtml(w.meaning)}</span>`).join(''):'<p class="page-desc">这个词库目前没有待巩固词。开始一轮默写检查记忆吧。</p>';
    if (typingData.session) renderTypingWord();
    else if (typeof refreshKeywords === 'function') refreshKeywords(document.getElementById('page-typing'));
}
function startTyping(kind) {
    loadTyping();
    let pool=typingPool();
    if(kind==='wrong')pool=pool.filter(w=>typingData.words[w.id]?.wrong);
    if(!pool.length){showToast('当前词库没有待练习词汇');return;}
    const mode=typingEl('mode').value;
    if(mode==='audio'&& !('speechSynthesis' in window)){showToast('此浏览器不支持听音，请选择看释义默写');return;}
    const count=Number(typingEl('count').value)||pool.length;
    typingData.session={ids:shuffleArray(pool).slice(0,count).map(w=>w.id),index:0,mode,results:[],checked:false,assisted:false,draft:'',subject:typingEl('subject').value};
    saveTyping();typingEl('result').classList.add('hidden');renderTypingWord();
}
function currentTypingWord(){const s=typingData.session;return s?VOCAB_BANK.find(w=>w.id===s.ids[s.index]):null;}
function renderTypingWord(){
    const s=typingData.session,w=currentTypingWord();if(!s||!w)return;
    typingEl('subject').value=s.subject||'all';typingEl('mode').value=s.mode;
    document.querySelectorAll('.typing-controls select, .typing-controls button').forEach(el=>el.disabled=true);
    typingEl('result').classList.add('hidden');
    typingEl('empty').classList.add('hidden');typingEl('session').classList.remove('hidden');
    typingEl('progress').textContent=`${s.index+1} / ${s.ids.length}`;
    typingEl('category').textContent=(typeof VOCAB_LABELS!=='undefined'&&VOCAB_LABELS[w.subject])||FOCUS_LABELS[w.subject]||w.subject;
    typingEl('progress-fill').style.width=`${s.index/s.ids.length*100}%`;
    typingEl('prompt').textContent=s.mode==='audio'?'听发音，输入英文单词或术语':w.meaning;
    typingEl('input').value=s.draft||'';typingEl('input').readOnly=s.checked;
    typingEl('check').classList.toggle('hidden',s.checked);typingEl('next').classList.toggle('hidden',!s.checked);
    typingEl('next').textContent=s.index===s.ids.length-1?'查看本轮结果':'下一词 →';
    typingEl('hint').disabled=s.checked;typingEl('reveal').disabled=s.checked;
    typingEl('listen').disabled=!('speechSynthesis' in window);
    typingEl('hint-text').textContent=s.assisted?'已使用辅助：本词将加入待巩固列表。':'';
    typingEl('feedback').innerHTML=s.checked?typingFeedback(s.results[s.index],w):'';
    // Keep the previous-answer list out of sight while recalling a word.
    document.querySelector('.typing-review').classList.add('hidden');
    if (typeof refreshKeywords === 'function') refreshKeywords(document.getElementById('typing-session'));
    typingEl('input').focus();
}
function hintTyping(){
    const s=typingData.session,w=currentTypingWord();if(!s||s.checked)return;
    s.assisted=true;saveTyping();
    typingEl('hint-text').textContent=`提示：${w.word.split(' ').map(t=>t[0]+' _'.repeat(t.length-1)).join(' / ')}（计入待巩固）`;
    typingEl('input').focus();
}
function speakTypingWord(){
    const s=typingData.session,w=currentTypingWord();if(!s||!w||!('speechSynthesis' in window))return;
    if(s.mode==='meaning'&&!s.checked){s.assisted=true;saveTyping();typingEl('hint-text').textContent='已听取发音提示，本词将加入待巩固。';}
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(w.word);utterance.lang='en-GB';utterance.rate=0.8;
    utterance.onerror=()=>{typingEl('hint-text').textContent='发音不可用，可结束本轮后切换为看释义默写。';};
    window.speechSynthesis.speak(utterance);
}
function typingFeedback(result,w){
    if(!result)return '';
    const label=result.revealed?'已查看答案':result.correct?'独立默写正确':result.spelling?'拼写正确，但使用了提示':'再巩固一下';
    const answer=escapeHtml(w.word);
    const entered=result.input?escapeHtml(result.input):'（未输入）';
    return `<strong class="${result.correct?'typing-correct':'typing-retry'}">${label}</strong><p>正确拼写：<b lang="en">${answer}</b>${w.alternatives.length?' / '+w.alternatives.map(escapeHtml).join(' / '):''}</p><p>你的输入：${entered}</p><p>${escapeHtml(w.meaning)}</p>`;
}
function checkTyping(revealed=false){
    const s=typingData.session,w=currentTypingWord();if(!s||s.checked)return;
    const input=typingEl('input').value;
    if(!revealed&&!input.trim()){typingEl('feedback').textContent='先输入答案，或点击“查看答案”。';typingEl('input').focus();return;}
    const spelling=isTypingCorrect(input,w), correct=spelling&&!revealed&&!s.assisted;
    const result={id:w.id,input,spelling,correct,revealed,assisted:s.assisted};
    s.results.push(result);s.checked=true;s.draft=input;
    const prior=typingData.words[w.id]||{};
    typingData.words[w.id]={attempts:(Number(prior.attempts)||0)+1,correct:(Number(prior.correct)||0)+(correct?1:0),wrong:!correct,lastPractised:new Date().toISOString()};
    saveTyping();renderTypingWord();
}
function nextTyping(){
    const s=typingData.session;if(!s||!s.checked)return;
    if('speechSynthesis' in window)window.speechSynthesis.cancel();
    s.index++;
    if(s.index>=s.ids.length){
        const results=s.results,correct=results.filter(r=>r.correct).length;
        typingData.session=null;saveTyping();unlockTyping();renderTypingSetup();
        typingEl('empty').classList.add('hidden');typingEl('result').classList.remove('hidden');
        typingEl('result').innerHTML=`<h4>本轮完成 🎉</h4><p class="typing-score">${correct} / ${results.length}</p><p>独立答对 ${correct} 个 · 待巩固 ${results.length-correct} 个</p><p class="page-desc">使用提示或查看答案的词不计入独立答对。</p><button class="btn btn-primary" onclick="startTyping('wrong')">重练待巩固词</button>`;
        return;
    }
    s.checked=false;s.assisted=false;s.draft='';saveTyping();renderTypingWord();
}
function unlockTyping(){
    typingEl('session').classList.add('hidden');
    document.querySelectorAll('.typing-controls select, .typing-controls button').forEach(el=>el.disabled=false);
    document.querySelector('.typing-review').classList.remove('hidden');
}
function stopTyping(){
    if('speechSynthesis' in window)window.speechSynthesis.cancel();
    typingData.session=null;saveTyping();unlockTyping();typingEl('empty').classList.remove('hidden');renderTypingSetup();
}
typingEl('form').addEventListener('submit',e=>{e.preventDefault();if(typingData.session?.checked)nextTyping();else checkTyping();});
typingEl('input').addEventListener('input',()=>{if(typingData.session&&!typingData.session.checked){typingData.session.draft=typingEl('input').value;saveTyping();}});
