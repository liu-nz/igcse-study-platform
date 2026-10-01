/* One browser-local unfinished quiz per local identity; never exported in backups. */
function quizOwnerKey() {
    if (!currentUser) return null;
    return 'owner:' + encodeURIComponent(currentUser.role === 'guest' ? 'guest:' + currentUser.name : currentUser.email || currentUser.name);
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
    if (!key || !quizState.questions.length || quizState.finished) return;
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
    persistQuizDraft(); saveData(appData);
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
    else startQuizTimer();
});
