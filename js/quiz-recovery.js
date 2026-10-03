/* One active quiz tab per local identity; unfinished drafts stay in this browser. */
const QUIZ_LOCK_PREFIX = 'igcse:active-quiz:';
const QUIZ_LOCK_TTL = 30000;
const QUIZ_TAB_ID = globalThis.crypto?.randomUUID?.() || Date.now()+'-'+Math.random().toString(36).slice(2);
let activeQuizLock = null;
let quizConflicted = false;
function quizLockKey(owner=quizOwnerKey()){return owner?QUIZ_LOCK_PREFIX+owner:null;}
function readQuizLock(owner=quizOwnerKey()){try{return JSON.parse(localStorage.getItem(quizLockKey(owner))||'null')}catch(_){return null}}
function claimQuizLock(sessionId){
    const key=quizLockKey(), prior=readQuizLock();
    if(!key)return false;
    if(prior&&prior.expiresAt>Date.now()&&prior.tabId!==QUIZ_TAB_ID){showToast('此身份正在另一个标签页刷题。请先在那里完成或暂停。This identity is practising in another tab.');return false;}
    const lock={tabId:QUIZ_TAB_ID,sessionId,expiresAt:Date.now()+QUIZ_LOCK_TTL};
    try{localStorage.setItem(key,JSON.stringify(lock));}catch(_){showToast('无法协调多个标签页，请允许本机存储或关闭其他练习页');return false;}
    if(readQuizLock()?.tabId!==QUIZ_TAB_ID){showToast('另一个标签页已开始练习，请在那里继续。');return false;}
    activeQuizLock=lock;quizConflicted=false;document.getElementById('quiz-conflict-warning')?.classList.add('hidden');return true;
}
function renewQuizLock(){if(!activeQuizLock||quizConflicted)return;const key=quizLockKey(),lock=readQuizLock();if(lock?.tabId!==QUIZ_TAB_ID||lock.sessionId!==activeQuizLock.sessionId){loseQuizLock();return;}activeQuizLock.expiresAt=Date.now()+QUIZ_LOCK_TTL;try{localStorage.setItem(key,JSON.stringify(activeQuizLock));}catch(_){loseQuizLock();}}
function releaseQuizLock(){if(!activeQuizLock)return;const key=quizLockKey(),lock=readQuizLock();if(lock?.tabId===QUIZ_TAB_ID&&lock.sessionId===activeQuizLock.sessionId){try{localStorage.removeItem(key)}catch(_){}}activeQuizLock=null;}
function loseQuizLock(){if(quizConflicted)return;quizConflicted=true;activeQuizLock=null;quizState.startTime=null;clearInterval(quizState.timerInterval);quizState.timerInterval=null;document.getElementById('quiz-conflict-warning')?.classList.remove('hidden');}
function hasOtherActiveQuiz(){const lock=readQuizLock();return Boolean(lock&&lock.expiresAt>Date.now()&&lock.tabId!==QUIZ_TAB_ID);}
window.addEventListener('storage',event=>{
    if(event.key===STORAGE_KEY&&event.newValue&&(!activeQuizLock||quizState.finished)){
        try{const latest=JSON.parse(event.newValue),identity=u=>u?.id|| (u?.role==='guest'?'guest:'+u.name:u?.email||u?.name);if(identity(latest.currentUser)===identity(currentUser)){appData=latest;if(currentPage==='quiz')renderQuizRecovery();}}catch(_){}
    }
    const owner=quizOwnerKey();if(!owner||event.key!==quizLockKey(owner)||!activeQuizLock)return;
    const lock=readQuizLock(owner);if(lock&&lock.expiresAt>Date.now()&&lock.tabId!==QUIZ_TAB_ID)loseQuizLock();
});
function quizOwnerKey() {
    if (!currentUser) return null;
    return 'owner:' + encodeURIComponent(currentUser.id || (currentUser.role === 'guest' ? 'guest:' + currentUser.name : currentUser.email || currentUser.name));
}
function questionRevision(question) {
    return JSON.stringify([question.question, question.options, question.answer]);
}
function validateQuizDraft(draft, bank = QUESTION_BANK) {
    if (!draft || draft.version !== 1 || typeof draft.id !== 'string' || !Array.isArray(draft.questionIds) || !draft.questionIds.length || draft.questionIds.length > 5000 || !Array.isArray(draft.answers) || !Array.isArray(draft.selections) || !Array.isArray(draft.revisions)) return null;
    const questions = draft.questionIds.map(id => bank.find(q => q.id === id));
    if (new Set(draft.questionIds).size !== questions.length || questions.some(q => !q) || draft.answers.length !== questions.length || draft.selections.length !== questions.length || draft.revisions.length !== questions.length) return null;
    if (!Number.isInteger(draft.currentIndex) || draft.currentIndex < 0 || draft.currentIndex >= questions.length || !Number.isFinite(draft.elapsedSeconds) || draft.elapsedSeconds < 0 || draft.elapsedSeconds > 31536000) return null;
    const validOption = (value, i) => value === null || Number.isInteger(value) && value >= 0 && value < questions[i].options.length;
    if (!draft.answers.every(validOption) || !draft.selections.every(validOption) || questions.some((q,i) => draft.revisions[i] !== questionRevision(q))) return null;
    return questions;
}
function getQuizDraft() {
    const key = quizOwnerKey();
    return key ? appData.quizDrafts?.[key] || null : null;
}
function persistQuizDraft() {
    const key = quizOwnerKey();
    if (!key || !quizState.questions.length || quizState.finished || quizConflicted) return;
    appData.quizDrafts ||= {};
    const elapsedSeconds = quizState.startTime ? Math.max(quizState.elapsedSeconds, Math.floor((Date.now()-quizState.startTime)/1000)) : quizState.elapsedSeconds;
    appData.quizDrafts[key] = {
        version:1, id:quizState.id, questionIds:quizState.questions.map(q=>q.id),
        revisions:quizState.questions.map(questionRevision), answers:[...quizState.answers],
        selections:quizState.questions.map((q,i)=>quizState.draftSelections?.[i] ?? null),
        currentIndex:quizState.currentIndex, elapsedSeconds, savedAt:new Date().toISOString(),
    };
}
function pauseQuizSession() {
    if (!quizState.questions.length || quizState.finished) return;
    if (quizState.startTime) quizState.elapsedSeconds = Math.max(quizState.elapsedSeconds, Math.floor((Date.now()-quizState.startTime)/1000));
    quizState.startTime = null;
    clearInterval(quizState.timerInterval); quizState.timerInterval = null;
    if(!quizConflicted){persistQuizDraft();saveData(appData);releaseQuizLock();}
}
function renderQuizRecovery() {
    const panel = document.getElementById('quiz-recovery');
    if (!panel) return;
    const draft = getQuizDraft();
    panel.classList.toggle('hidden',!draft);
    if (!draft) return;
    const valid = Boolean(validateQuizDraft(draft));
    document.getElementById('quiz-resume').disabled = !valid;
    document.getElementById('quiz-recovery-summary').textContent = valid
        ? `第 ${draft.currentIndex+1}/${draft.questionIds.length} 题 · 已提交 ${draft.answers.filter(a=>a!==null).length} 题 · 已用 ${formatTime(draft.elapsedSeconds)}。离开期间不计时。Question ${draft.currentIndex+1}; time away is excluded.`
        : '题库已更新或草稿无效，无法安全恢复这次练习。已保存的学习记录仍保留。Question bank changed or draft invalid; saved progress is retained.';
}
function resumeQuizSession() {
    const draft = getQuizDraft();
    const questions = validateQuizDraft(draft);
    if (!questions) { showToast('无法恢复此草稿，请查看提示'); return; }
    if(!claimQuizLock(draft.id))return;
    clearInterval(quizState.timerInterval);
    quizState = { id:draft.id, questions, answers:[...draft.answers], draftSelections:[...draft.selections], currentIndex:draft.currentIndex, elapsedSeconds:draft.elapsedSeconds, startTime:null, timerInterval:null, selectedOption:null, submitted:false, finished:false };
    document.getElementById('quiz-setup').classList.add('hidden');
    document.getElementById('quiz-result').classList.add('hidden');
    document.getElementById('quiz-playing').classList.remove('hidden');
    document.getElementById('quiz-total').textContent = questions.length;
    startQuizTimer(); renderQuestion();
}
function prepareNewQuiz() {
    if (getQuizDraft() && !confirm('开始新练习会替换本机此身份的未完成练习；已提交的学习记录保留。继续吗？\nReplace this identity’s unfinished quiz? Submitted study progress is retained.')) return false;
    return true;
}
function clearQuizDraft() {
    releaseQuizLock();
    const key = quizOwnerKey();
    if (key && appData.quizDrafts) delete appData.quizDrafts[key];
}
function discardQuizDraft() {
    if (!confirm('放弃这次未完成练习？已提交的错题与 SRS 保留。\nDiscard the unfinished session? Submitted mistake/SRS progress is retained.')) return;
    clearQuizDraft(); saveData(appData); renderQuizRecovery();
}
window.addEventListener('pagehide', () => { if (currentPage === 'quiz') pauseQuizSession(); });
document.addEventListener('visibilitychange', () => {
    if (currentPage !== 'quiz' || quizState.finished || document.getElementById('quiz-playing').classList.contains('hidden')) return;
    if (document.hidden) pauseQuizSession();
    else if(!quizConflicted && currentPage==='quiz' && !document.getElementById('quiz-playing').classList.contains('hidden')) { if(claimQuizLock(quizState.id))startQuizTimer();else loseQuizLock(); }
    else startQuizTimer();
});
