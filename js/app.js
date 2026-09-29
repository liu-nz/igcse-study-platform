/* IGCSE 智能备考平台 - 主应用逻辑 */
const STORAGE_KEY = 'igcse_study_platform';
let appState = { user: null, currentPage: 'dashboard', quiz: null, flashcard: null, settings: { darkMode: false, examDate: '2027-05-15', notifications: true } };

function init() {
  loadState();
  if (appState.user) { showApp(); } else { showLogin(); }
  setupEventListeners();
  updateCountdown();
  setInterval(updateCountdown, 60000);
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) { try { appState = { ...appState, ...JSON.parse(saved) }; } catch(e) { console.error('Load error', e); } }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(appState)); }

function showLogin() {
  document.getElementById('loginPage').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
}
function showApp() {
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('userNameDisplay').textContent = appState.user.name;
  document.getElementById('userRoleDisplay').textContent = appState.user.role === 'owner' ? '所有者' : appState.user.role === 'collab' ? '协作者' : '访客';
  document.getElementById('userAvatar').textContent = appState.user.name.charAt(0).toUpperCase();
  applyDarkMode();
  navigateTo('dashboard');
}

function setupEventListeners() {
  document.querySelectorAll('.login-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.login-form').forEach(f => f.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab + 'Form').classList.add('active');
    });
  });
  document.getElementById('loginBtn').addEventListener('click', handleLogin);
  document.getElementById('guestBtn').addEventListener('click', handleGuest);
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.page));
  });
  document.getElementById('menuToggle').addEventListener('click', toggleSidebar);
  document.getElementById('sidebarOverlay').addEventListener('click', toggleSidebar);
  document.getElementById('darkModeToggle').addEventListener('change', toggleDarkMode);
  document.getElementById('examDateInput').addEventListener('change', (e) => { appState.settings.examDate = e.target.value; saveState(); updateCountdown(); });
  document.getElementById('quizStartBtn').addEventListener('click', startQuiz);
  document.getElementById('quizNextBtn').addEventListener('click', nextQuestion);
  document.getElementById('quizPrevBtn').addEventListener('click', prevQuestion);
  document.getElementById('quizSubmitBtn').addEventListener('click', submitQuiz);
  document.getElementById('quizRetryBtn').addEventListener('click', () => { appState.quiz = null; showQuizSetup(); });
  document.getElementById('quizBackBtn').addEventListener('click', () => navigateTo('quiz'));
  document.getElementById('chatSendBtn').addEventListener('click', sendChatMessage);
  document.getElementById('chatInput').addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } });
  document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => { document.getElementById('chatInput').value = chip.textContent; sendChatMessage(); });
  });
  document.getElementById('flashcardFlipBtn').addEventListener('click', flipFlashcard);
  document.getElementById('flashcardNextBtn').addEventListener('click', nextFlashcard);
  document.getElementById('flashcardPrevBtn').addEventListener('click', prevFlashcard);
  document.getElementById('flashcardBackBtn').addEventListener('click', () => { appState.flashcard = null; showFlashcardDecks(); });
  document.getElementById('materialUploadBtn').addEventListener('click', () => document.getElementById('uploadModal').classList.remove('hidden'));
  document.getElementById('uploadModalClose').addEventListener('click', () => document.getElementById('uploadModal').classList.add('hidden'));
  document.getElementById('copyShareLink').addEventListener('click', copyShareLink);
}

function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (!email || !password) { showToast('请输入邮箱和密码'); return; }
  appState.user = { name: email.split('@')[0], email, role: 'owner' };
  saveState(); showApp(); showToast('登录成功，欢迎回来！');
}
function handleGuest() {
  const code = document.getElementById('guestCode').value.trim();
  if (!code) { showToast('请输入访问密码'); return; }
  appState.user = { name: '访客' + Math.floor(Math.random()*100), email: 'guest@igcse.com', role: 'guest' };
  saveState(); showApp(); showToast('以访客身份进入');
}
function handleLogout() {
  appState.user = null; saveState(); showLogin(); showToast('已退出登录');
}

function navigateTo(page) {
  appState.currentPage = page;
  document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.page === page));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.getElementById('pageTitle').textContent = getPageTitle(page);
  if (window.innerWidth <= 768) { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebarOverlay').classList.remove('show'); }
  if (page === 'dashboard') renderDashboard();
  if (page === 'materials') renderMaterials();
  if (page === 'quiz') showQuizSetup();
  if (page === 'pastpapers') renderPastPapers();
  if (page === 'review') renderReview();
  if (page === 'flashcards') showFlashcardDecks();
  if (page === 'wrong') renderWrongBook();
  if (page === 'analytics') renderAnalytics();
  if (page === 'members') renderMembers();
  if (page === 'settings') renderSettings();
}
function getPageTitle(page) {
  const titles = { dashboard:'首页仪表盘', materials:'资料中心', quiz:'题库刷题', pastpapers:'历年真题', review:'智能复习', flashcards:'闪卡记忆', wrong:'错题本', chat:'AI问答', analytics:'学习分析', members:'成员管理', settings:'设置' };
  return titles[page] || page;
}
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('show');
}
function toggleDarkMode() {
  appState.settings.darkMode = document.getElementById('darkModeToggle').checked;
  saveState(); applyDarkMode();
}
function applyDarkMode() {
  document.body.classList.toggle('dark-mode', appState.settings.darkMode);
  document.getElementById('darkModeToggle').checked = appState.settings.darkMode;
}
function updateCountdown() {
  const examDate = new Date(appState.settings.examDate);
  const now = new Date();
  const diff = Math.ceil((examDate - now) / (1000*60*60*24));
  document.getElementById('countdownValue').textContent = diff > 0 ? diff : 0;
}

function renderDashboard() {
  const totalQuestions = QUESTION_BANK.length;
  const wrongCount = (appState.wrongBook || []).length;
  const reviewDue = calculateReviewDue();
  document.getElementById('statQuestions').textContent = totalQuestions;
  document.getElementById('statWrong').textContent = wrongCount;
  document.getElementById('statReview').textContent = reviewDue;
  document.getElementById('statMaterials').textContent = MATERIALS_DATA.length;
  renderTaskList();
  renderRecentWrong();
  renderWeeklyChart();
}
function calculateReviewDue() {
  const srs = appState.srsData || {};
  const now = Date.now();
  return Object.values(srs).filter(item => item.nextReview <= now).length;
}
function renderTaskList() {
  const tasks = appState.tasks || [
    { id:1, text:'完成数学代数章节练习', done:false, meta:'10题' },
    { id:2, text:'复习物理力学公式', done:true, meta:'闪卡' },
    { id:3, text:'做一套化学真题', done:false, meta:'45分钟' }
  ];
  const container = document.getElementById('taskList');
  container.innerHTML = tasks.map(t => `<div class="task-item"><div class="task-check ${t.done?'done':''}" onclick="toggleTask(${t.id})">${t.done?'✓':''}</div><span class="task-text">${t.text}</span><span class="task-meta">${t.meta}</span></div>`).join('');
}
function toggleTask(id) {
  if (!appState.tasks) appState.tasks = [];
  const task = appState.tasks.find(t => t.id === id);
  if (task) { task.done = !task.done; saveState(); renderTaskList(); }
}
function renderRecentWrong() {
  const wrong = (appState.wrongBook || []).slice(0, 5);
  const container = document.getElementById('recentWrongList');
  if (wrong.length === 0) { container.innerHTML = '<div class="empty-state">暂无错题，继续加油！</div>'; return; }
  container.innerHTML = wrong.map(w => `<div class="wrong-item-mini"><div class="wim-subject">${w.subject} · ${w.topic}</div><div class="wim-text">${w.question.substring(0,50)}...</div></div>`).join('');
}
function renderWeeklyChart() {
  const canvas = document.getElementById('weeklyChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const data = [12, 19, 8, 15, 22, 10, 18];
  const labels = ['一','二','三','四','五','六','日'];
  const max = Math.max(...data);
  const w = canvas.width = canvas.offsetWidth;
  const h = canvas.height = canvas.offsetHeight;
  ctx.clearRect(0,0,w,h);
  const barW = w / data.length * 0.6;
  const gap = w / data.length * 0.4;
  data.forEach((v,i) => {
    const barH = (v/max) * (h-40);
    const x = i * (barW+gap) + gap/2;
    const y = h - barH - 20;
    const grad = ctx.createLinearGradient(0,y,0,h-20);
    grad.addColorStop(0,'#3498db'); grad.addColorStop(1,'#2980b9');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.roundRect(x,y,barW,barH,4); ctx.fill();
    ctx.fillStyle = '#7f8c8d'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(labels[i], x+barW/2, h-5);
    ctx.fillStyle = '#2c3e50'; ctx.fillText(v, x+barW/2, y-5);
  });
}

function renderMaterials() {
  const filter = document.getElementById('materialFilter') ? document.getElementById('materialFilter').value : 'all';
  let materials = MATERIALS_DATA;
  if (filter !== 'all') materials = materials.filter(m => m.type === filter);
  const container = document.getElementById('materialsGrid');
  container.innerHTML = materials.map(m => `<div class="material-card"><div class="material-icon">${m.icon}</div><div class="material-name">${m.name}</div><div class="material-meta">${m.tags.map(t=>`<span class="material-tag">${t}</span>`).join('')}</div><div class="material-info"><span>${m.subject}</span><span>${m.size}</span></div></div>`).join('');
}

function showQuizSetup() {
  document.getElementById('quizSetup').classList.remove('hidden');
  document.getElementById('quizArea').classList.add('hidden');
  document.getElementById('quizResult').classList.add('hidden');
  const subjects = [...new Set(QUESTION_BANK.map(q=>q.subject))];
  const select = document.getElementById('quizSubject');
  select.innerHTML = '<option value="all">全部科目</option>' + subjects.map(s=>`<option value="${s}">${s}</option>`).join('');
}
function startQuiz() {
  const subject = document.getElementById('quizSubject').value;
  const mode = document.getElementById('quizMode').value;
  const count = parseInt(document.getElementById('quizCount').value);
  let questions = subject === 'all' ? [...QUESTION_BANK] : QUESTION_BANK.filter(q=>q.subject===subject);
  if (mode === 'random') questions.sort(()=>Math.random()-0.5);
  if (mode === 'wrong') { const wrongIds = (appState.wrongBook||[]).map(w=>w.id); questions = questions.filter(q=>wrongIds.includes(q.id)); if(questions.length===0){showToast('暂无错题记录');return;} }
  questions = questions.slice(0, count);
  if (questions.length === 0) { showToast('没有符合条件的题目'); return; }
  appState.quiz = { questions, currentIndex:0, answers:[], startTime:Date.now(), mode };
  saveState();
  document.getElementById('quizSetup').classList.add('hidden');
  document.getElementById('quizArea').classList.remove('hidden');
  renderQuestion();
}
function renderQuestion() {
  const quiz = appState.quiz;
  const q = quiz.questions[quiz.currentIndex];
  document.getElementById('quizProgress').textContent = `第 ${quiz.currentIndex+1} / ${quiz.questions.length} 题`;
  document.getElementById('quizProgressBar').style.width = ((quiz.currentIndex+1)/quiz.questions.length*100)+'%';
  document.getElementById('questionSubject').textContent = q.subject;
  document.getElementById('questionTopic').textContent = q.topic;
  document.getElementById('questionDifficulty').textContent = {easy:'简单',medium:'中等',hard:'困难'}[q.difficulty];
  document.getElementById('questionText').textContent = q.question;
  const optionsHtml = q.options.map((opt,i) => `<div class="option-item" data-index="${i}" onclick="selectOption(${i})">
    <span class="option-label">${String.fromCharCode(65+i)}</span><span class="option-text">${opt}</span></div>`).join('');
  document.getElementById('optionsList').innerHTML = optionsHtml;
  document.getElementById('questionResult').classList.add('hidden');
  document.getElementById('quizPrevBtn').style.display = quiz.currentIndex > 0 ? 'inline-flex' : 'none';
  document.getElementById('quizNextBtn').style.display = quiz.currentIndex < quiz.questions.length-1 ? 'inline-flex' : 'none';
  document.getElementById('quizSubmitBtn').style.display = quiz.currentIndex === quiz.questions.length-1 ? 'inline-flex' : 'none';
}
function selectOption(index) {
  const quiz = appState.quiz;
  if (quiz.answers[quiz.currentIndex] !== undefined) return;
  quiz.answers[quiz.currentIndex] = index;
  const q = quiz.questions[quiz.currentIndex];
  const isCorrect = index === q.answer;
  document.querySelectorAll('.option-item').forEach((el,i) => {
    el.classList.add('disabled');
    if (i === q.answer) el.classList.add('correct');
    if (i === index && !isCorrect) el.classList.add('wrong');
  });
  const resultEl = document.getElementById('questionResult');
  resultEl.classList.remove('hidden');
  resultEl.innerHTML = `<div class="result-header ${isCorrect?'correct':'wrong'}">${isCorrect?'✓ 回答正确！':'✗ 回答错误'}</div>
    <div class="result-answer">正确答案：<strong>${String.fromCharCode(65+q.answer)}. ${q.options[q.answer]}</strong></div>
    <div class="result-explanation"><strong>解析：</strong>${q.explanation}</div>`;
  if (!isCorrect) addToWrongBook(q);
  saveState();
}
function nextQuestion() { if(appState.quiz.currentIndex < appState.quiz.questions.length-1){appState.quiz.currentIndex++;renderQuestion();} }
function prevQuestion() { if(appState.quiz.currentIndex > 0){appState.quiz.currentIndex--;renderQuestion();} }
function submitQuiz() {
  const quiz = appState.quiz;
  const answered = quiz.answers.filter(a=>a!==undefined).length;
  let correct = 0;
  quiz.questions.forEach((q,i)=>{ if(quiz.answers[i]===q.answer) correct++; });
  const score = Math.round(correct/quiz.questions.length*100);
  document.getElementById('quizArea').classList.add('hidden');
  document.getElementById('quizResult').classList.remove('hidden');
  document.getElementById('resultScore').textContent = score;
  document.getElementById('resultCorrect').textContent = correct;
  document.getElementById('resultTotal').textContent = quiz.questions.length;
  document.getElementById('resultAnswered').textContent = answered;
  const circle = document.getElementById('scoreCircle');
  const circumference = 2 * Math.PI * 60;
  const offset = circumference - (score/100)*circumference;
  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = offset;
  circle.style.stroke = score >= 60 ? '#27ae60' : '#e74c3c';
}
function addToWrongBook(q) {
  if (!appState.wrongBook) appState.wrongBook = [];
  if (!appState.wrongBook.find(w=>w.id===q.id)) {
    appState.wrongBook.push({ ...q, wrongCount:1, lastWrong:Date.now() });
  } else {
    const existing = appState.wrongBook.find(w=>w.id===q.id);
    existing.wrongCount++; existing.lastWrong = Date.now();
  }
}

function renderPastPapers() {
  const subject = document.getElementById('ppSubject') ? document.getElementById('ppSubject').value : 'all';
  let papers = PAST_PAPERS;
  if (subject !== 'all') papers = papers.filter(p=>p.subject===subject);
  const container = document.getElementById('pastpapersList');
  container.innerHTML = papers.map(p => `<div class="pastpaper-item">
    <div class="pp-icon">📄</div><div class="pp-info">
    <div class="pp-title">${p.subject} ${p.paper} (${p.variant})</div>
    <div class="pp-meta"><span>📅 ${p.year} ${p.seasonName}</span><span>📝 ${p.questions}题</span><span>⏱ ${p.duration}</span><span>🔖 ${p.code}</span></div></div>
    <button class="btn btn-outline btn-sm" onclick="showToast('真题功能演示：开始 ${p.code}')">开始练习</button></div>`).join('');
}

function renderReview() {
  const srs = appState.srsData || {};
  const now = Date.now();
  const due = Object.values(srs).filter(i=>i.nextReview<=now).length;
  const learning = Object.values(srs).filter(i=>i.interval<7).length;
  const mastered = Object.values(srs).filter(i=>i.interval>=21).length;
  document.getElementById('reviewDue').textContent = due;
  document.getElementById('reviewLearning').textContent = learning;
  document.getElementById('reviewMastered').textContent = mastered;
  const tasksHtml = `<div class="review-task-item"><span class="rt-icon">🔴</span><div class="rt-info"><div class="rt-title">今日待复习题目</div><div class="rt-meta">基于间隔重复算法</div></div><span class="rt-count">${due}</span></div>
    <div class="review-task-item"><span class="rt-icon">🟡</span><div class="rt-info"><div class="rt-title">学习中知识点</div><div class="rt-meta">间隔小于7天</div></div><span class="rt-count">${learning}</span></div>
    <div class="review-task-item"><span class="rt-icon">🟢</span><div class="rt-info"><div class="rt-title">已掌握内容</div><div class="rt-meta">间隔大于21天</div></div><span class="rt-count">${mastered}</span></div>`;
  document.getElementById('reviewTasks').innerHTML = tasksHtml;
  const subjects = [...new Set(QUESTION_BANK.map(q=>q.subject))];
  const barsHtml = subjects.map(s => {
    const total = QUESTION_BANK.filter(q=>q.subject===s).length;
    const masteredCount = Math.floor(total * (0.3 + Math.random()*0.4));
    const pct = Math.round(masteredCount/total*100);
    return `<div class="memory-bar-item"><span class="mb-label">${s}</span><div class="mb-track"><div class="mb-fill" style="width:${pct}%;background:linear-gradient(90deg,#27ae60,#2ecc71)"></div></div><span class="mb-count">${pct}%</span></div>`;
  }).join('');
  document.getElementById('memoryBars').innerHTML = barsHtml;
}

function showFlashcardDecks() {
  document.getElementById('flashcardDecks').classList.remove('hidden');
  document.getElementById('flashcardStudy').classList.add('hidden');
  const container = document.getElementById('flashcardDecksList');
  container.innerHTML = FLASHCARD_DECKS.map(d => `<div class="deck-card" onclick="startFlashcard('${d.id}')">
    <div class="deck-icon">${d.icon}</div><div class="deck-name">${d.name}</div><div class="deck-count">${d.cards.length} 张卡片 · ${d.subject}</div></div>`).join('');
}
function startFlashcard(deckId) {
  const deck = FLASHCARD_DECKS.find(d=>d.id===deckId);
  if (!deck) return;
  appState.flashcard = { deck, currentIndex:0, flipped:false };
  saveState();
  document.getElementById('flashcardDecks').classList.add('hidden');
  document.getElementById('flashcardStudy').classList.remove('hidden');
  renderFlashcard();
}
function renderFlashcard() {
  const fc = appState.flashcard;
  const card = fc.deck.cards[fc.currentIndex];
  document.getElementById('flashcardFront').textContent = card.front;
  document.getElementById('flashcardBack').textContent = card.back;
  document.getElementById('flashcardProgress').textContent = `第 ${fc.currentIndex+1} / ${fc.deck.cards.length} 张`;
  document.getElementById('flashcardElement').classList.toggle('flipped', fc.flipped);
}
function flipFlashcard() { appState.flashcard.flipped = !appState.flashcard.flipped; renderFlashcard(); }
function nextFlashcard() {
  if (appState.flashcard.currentIndex < appState.flashcard.deck.cards.length-1) {
    appState.flashcard.currentIndex++; appState.flashcard.flipped=false; renderFlashcard();
  } else { showToast('已完成本组闪卡！'); }
}
function prevFlashcard() {
  if (appState.flashcard.currentIndex > 0) {
    appState.flashcard.currentIndex--; appState.flashcard.flipped=false; renderFlashcard();
  }
}

function renderWrongBook() {
  const wrong = appState.wrongBook || [];
  document.getElementById('wrongTotal').textContent = wrong.length;
  document.getElementById('wrongToday').textContent = wrong.filter(w=>Date.now()-w.lastWrong<86400000).length;
  const subjects = {};
  wrong.forEach(w=>{ subjects[w.subject]=(subjects[w.subject]||0)+1; });
  document.getElementById('wrongSubjects').textContent = Object.keys(subjects).length;
  document.getElementById('wrongMastered').textContent = wrong.filter(w=>w.wrongCount>=3).length;
  const container = document.getElementById('wrongList');
  if (wrong.length === 0) { container.innerHTML = '<div class="empty-state">暂无错题记录，太棒了！</div>'; return; }
  container.innerHTML = wrong.map(w => `<div class="wrong-item">
    <div class="wrong-header"><span class="q-badge">${w.subject}</span><span class="q-badge">${w.topic}</span><span class="q-badge">错误${w.wrongCount}次</span></div>
    <div class="wrong-question">${w.question}</div>
    <div class="wrong-answer-row"><span class="wa-wrong">你的答案：${w.options[w.answers?w.answers[0]:0]||'未作答'}</span><span class="wa-correct">正确答案：${w.options[w.answer]}</span></div>
    <div class="result-explanation">${w.explanation}</div>
    <div class="wrong-reason-select"><button class="reason-btn" onclick="markWrongMastered('${w.id}')">已掌握，移除</button></div></div>`).join('');
}
function markWrongMastered(id) {
  appState.wrongBook = (appState.wrongBook||[]).filter(w=>w.id!==id);
  saveState(); renderWrongBook(); showToast('已从错题本移除');
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  addChatMessage('user', text);
  input.value = '';
  showTypingIndicator();
  setTimeout(() => {
    hideTypingIndicator();
    const response = generateAIResponse(text);
    addChatMessage('ai', response.answer, response.source);
  }, 800 + Math.random()*1000);
}
function addChatMessage(role, text, source) {
  const container = document.getElementById('chatMessages');
  const isUser = role === 'user';
  const html = `<div class="message ${isUser?'user-message':'ai-message'}">
    <div class="msg-avatar">${isUser?'👤':'🤖'}</div>
    <div class="msg-content">${text.replace(/\n/g,'<br>')}${source?`<div class="msg-source">📚 参考：${source}</div>`:''}</div></div>`;
  container.insertAdjacentHTML('beforeend', html);
  container.scrollTop = container.scrollHeight;
}
function showTypingIndicator() {
  const container = document.getElementById('chatMessages');
  container.insertAdjacentHTML('beforeend', `<div class="message ai-message" id="typingIndicator"><div class="msg-avatar">🤖</div><div class="msg-content"><div class="typing-indicator"><span></span><span></span><span></span></div></div></div>`);
  container.scrollTop = container.scrollHeight;
}
function hideTypingIndicator() { const el=document.getElementById('typingIndicator'); if(el) el.remove(); }
function generateAIResponse(question) {
  const q = question.toLowerCase();
  for (const [key, value] of Object.entries(AI_KNOWLEDGE)) {
    if (q.includes(key.toLowerCase()) || q.includes(key.toLowerCase().replace(/\s/g,''))) return value;
  }
  const subjectKeywords = { '数学':'math','物理':'physics','化学':'chem','生物':'bio','经济':'econ','英语':'esl','ict':'ict','计算机':'cs' };
  let matchedSubject = '综合';
  for (const [kw, sub] of Object.entries(subjectKeywords)) {
    if (q.includes(kw)) { matchedSubject = kw; break; }
  }
  return { answer: `关于「${question}」的解答：\n\n这是一个${matchedSubject}相关的问题。以下是基于IGCSE考纲的要点分析：\n\n1. 核心概念：该问题涉及${matchedSubject}的基础知识点\n2. 解题思路：先理解题目要求，再应用相关公式或原理\n3. 常见考点：此类题目在IGCSE考试中经常出现\n\n建议：结合教材中的相关章节进行复习，并多做练习题巩固。如需更详细的解答，可以上传相关资料或指定具体知识点。`, source: 'IGCSE 智能知识库（综合）' };
}

function renderAnalytics() {
  renderSubjectChart();
  renderAccuracyChart();
  renderWeakTopics();
}
function renderSubjectChart() {
  const canvas = document.getElementById('subjectChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const subjects = [...new Set(QUESTION_BANK.map(q=>q.subject))];
  const data = subjects.map(()=>40+Math.floor(Math.random()*50));
  const w = canvas.width = canvas.offsetWidth;
  const h = canvas.height = canvas.offsetHeight;
  ctx.clearRect(0,0,w,h);
  const barW = w / subjects.length * 0.5;
  const gap = w / subjects.length * 0.5;
  const max = Math.max(...data, 100);
  const colors = ['#3498db','#e74c3c','#27ae60','#f39c12','#9b59b6','#1abc9c','#e67e22','#34495e'];
  data.forEach((v,i) => {
    const barH = (v/max)*(h-50);
    const x = i*(barW+gap)+gap/2;
    const y = h-barH-25;
    ctx.fillStyle = colors[i%colors.length];
    ctx.beginPath(); ctx.roundRect(x,y,barW,barH,4); ctx.fill();
    ctx.fillStyle = '#7f8c8d'; ctx.font='10px sans-serif'; ctx.textAlign='center';
    ctx.fillText(subjects[i].substring(0,2), x+barW/2, h-8);
    ctx.fillStyle = '#2c3e50'; ctx.fillText(v+'%', x+barW/2, y-5);
  });
}
function renderAccuracyChart() {
  const canvas = document.getElementById('accuracyChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.offsetWidth;
  const h = canvas.height = canvas.offsetHeight;
  ctx.clearRect(0,0,w,h);
  const data = [65,72,58,80,75,88,82];
  const max = 100;
  ctx.strokeStyle = '#e0e6ed'; ctx.lineWidth = 1;
  for (let i=0;i<=4;i++) { const y=20+(h-50)*i/4; ctx.beginPath(); ctx.moveTo(30,y); ctx.lineTo(w-10,y); ctx.stroke(); }
  ctx.strokeStyle = '#3498db'; ctx.lineWidth = 2.5; ctx.beginPath();
  data.forEach((v,i) => {
    const x = 30 + (w-50)*i/(data.length-1);
    const y = 20 + (h-50)*(1-v/max);
    if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();
  data.forEach((v,i) => {
    const x = 30 + (w-50)*i/(data.length-1);
    const y = 20 + (h-50)*(1-v/max);
    ctx.fillStyle = '#3498db'; ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill();
  });
}
function renderWeakTopics() {
  const topics = [
    {name:'化学-化学键',rate:35},{name:'物理-电学',rate:42},{name:'数学-几何',rate:48},
    {name:'生物-遗传',rate:52},{name:'经济-弹性',rate:55},{name:'英语-语法',rate:60}
  ];
  document.getElementById('weakTopicsList').innerHTML = topics.map(t => `<div class="weak-topic-item">
    <span class="wt-name">${t.name}</span><div class="wt-bar"><div class="wt-fill" style="width:${t.rate}%"></div></div><span class="wt-rate">${t.rate}%</span></div>`).join('');
}

function renderMembers() {
  const container = document.getElementById('membersList');
  container.innerHTML = MEMBERS_DATA.map(m => `<div class="member-item">
    <div class="member-avatar" style="background:${m.avatarColor}">${m.name.charAt(0)}</div>
    <div class="member-info"><div class="member-name">${m.name}</div><div class="member-meta">加入：${m.joinDate} · 最近活跃：${m.lastActive}</div></div>
    <span class="member-role-badge role-${m.role}">${m.roleName}</span></div>`).join('');
}
function copyShareLink() {
  const link = window.location.href + '?invite=igcse2024';
  navigator.clipboard.writeText(link).then(()=>showToast('邀请链接已复制！')).catch(()=>showToast('复制失败，请手动复制'));
}

function renderSettings() {
  document.getElementById('examDateInput').value = appState.settings.examDate;
  document.getElementById('darkModeToggle').checked = appState.settings.darkMode;
}

function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(()=>toast.remove(), 2500);
}

document.addEventListener('DOMContentLoaded', init);