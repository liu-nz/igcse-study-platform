/* ========================================
   IGCSE 智能备考平台 - 主应用逻辑
   ======================================== */

// ========== 全局状态 ==========
let currentUser = null;
let currentPage = 'dashboard';
let quizState = {
    questions: [],
    currentIndex: 0,
    answers: [],
    startTime: null,
    timerInterval: null,
    elapsedSeconds: 0,
    selectedOption: null,
    submitted: false,
};
let flashcardState = {
    deck: null,
    cards: [],
    currentIndex: 0,
    flipped: false,
};
let reviewState = {
    items: [],
    currentIndex: 0,
};

// ========== 数据存储 ==========
const STORAGE_KEY = 'igcse_study_platform';

function loadData() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : getDefaultData();
    } catch (e) {
        return getDefaultData();
    }
}

function saveData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        document.getElementById('storage-save-warning')?.classList.add('hidden');
        return true;
    } catch (error) {
        document.getElementById('storage-save-warning')?.classList.remove('hidden');
        return false;
    }
}

function getDefaultData() {
    return {
        users: [{ email: 'demo@igcse.com', password: '123456', name: 'Demo User', board: 'cie', role: 'owner' }],
        currentUser: null,
        quizRecords: [],
        wrongQuestions: [],
        srsData: {},
        flashcards: JSON.parse(JSON.stringify(FLASHCARD_DECKS)),
        materials: JSON.parse(JSON.stringify(MATERIALS_DATA)),
        settings: {
            siteName: '我的IGCSE备考空间',
            board: 'cie',
            examDate: '2027-05-15',
            darkMode: false,
            reminder: true,
            remindTime: '20:00',
            keywords: true,
        },
        dailyStats: {},
        studyTime: 0,
        streak: 0,
        lastStudyDate: null,
        // 成员登记表 / member registry（谁用什么身份访问过本站）
        members: MEMBERS_DATA.map(m => ({
            id: 'seed:' + m.name,
            name: m.name,
            email: '',
            role: m.role,
            joinDate: m.joinDate,
            lastActive: m.lastActive,
            visits: 0,
            avatarColor: m.avatarColor,
            demo: true,
        })),
        // 每位成员的学习记录：id -> { days: { 'YYYY-MM-DD': {questions, correct, seconds} } }
        memberStats: {},
    };
}

let appData = loadData();

// 兼容旧存档：补齐成员登记表字段，并清理已下线的排行榜快照数据
(function migrateMemberData() {
    const defaults = getDefaultData();
    if (!Array.isArray(appData.members)) appData.members = defaults.members;
    if (!appData.memberStats || typeof appData.memberStats !== 'object') appData.memberStats = {};
    if ('leaderboardHistory' in appData) delete appData.leaderboardHistory;
})();

// ========== 工具函数 ==========
function showToast(message, duration = 2500) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), duration);
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatLocalDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getTodayStr() {
    return formatLocalDate(new Date());
}

function parseLocalDate(dateStr) {
    const [year, month, day] = String(dateStr || '').split('-').map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
}

function getDaysUntil(dateStr) {
    const target = parseLocalDate(dateStr);
    if (!target) return 0;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ========== 登录系统 ==========
document.querySelectorAll('.login-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.login-form').forEach(f => f.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab + '-form').classList.add('active');
    });
});

function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const user = appData.users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        appData.currentUser = user;
        saveData(appData);
        enterApp();
        showToast('登录成功，欢迎回来！');
    } else {
        showToast('邮箱或密码错误');
    }
}

function handleRegister() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const inviteCode = document.getElementById('reg-invite-code').value.trim();
    const board = document.getElementById('reg-board').value;
    if (!name || !email || !password) {
        showToast('请填写完整信息');
        return;
    }
    if (!inviteCode) {
        showToast('请输入邀请码');
        return;
    }
    if (inviteCode !== 'LNZzuishuai666') {
        showToast('邀请码错误，请确认后重试');
        return;
    }
    if (appData.users.find(u => u.email === email)) {
        showToast('该邮箱已注册');
        return;
    }
    const newUser = { email, password, name, board, role: 'collab' };
    appData.users.push(newUser);
    currentUser = newUser;
    appData.currentUser = newUser;
    appData.settings.board = board;
    saveData(appData);
    enterApp();
    showToast('注册成功，欢迎加入！');
}

function handleGuestLogin() {
    const code = document.getElementById('guest-code').value;
    const name = document.getElementById('guest-name').value.trim() || '访客';
    if (code === 'guest123') {
        currentUser = { name, role: 'guest', email: 'guest@temp.com' };
        enterApp();
        showToast('以访客身份进入');
    } else {
        showToast('访问密码错误');
    }
}

function handleLogout() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    currentUser = null;
    appData.currentUser = null;
    saveData(appData);
    currentPage = null;
    applyRolePermissions();
    document.getElementById('app').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
    if (quizState.timerInterval) clearInterval(quizState.timerInterval);
}

function enterApp() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-avatar').textContent = currentUser.name.charAt(0).toUpperCase();
    if (typeof applyKeywordSetting === 'function') applyKeywordSetting();
    document.getElementById('user-role').innerHTML = (ROLE_LABELS[currentUser.role] || '访客 Guest');
    // 按身份显示/隐藏受限页面（访客看不到成员管理）
    applyRolePermissions();
    // 登记本次访问的成员身份
    upsertMember(currentUser);
    saveData(appData);
    document.getElementById('user-board').textContent = appData.settings.board.toUpperCase();
    if (appData.settings.darkMode) document.body.classList.add('dark-mode');
    updateCountdown();
    populateFilters();
    navigateTo('dashboard');
}

// ========== 导航 ==========
function navigateTo(page) {
    // 权限守卫：访客等无权身份不能进入受限页面
    if (!canAccessPage(page)) {
        showToast((PAGE_ACCESS_TIP[page] || '当前身份无权访问该页面。') + ' Members: owners/collaborators only');
        return;
    }
    const quizPlaying = !document.getElementById('quiz-playing')?.classList.contains('hidden');
    const activeQuiz = currentPage === 'quiz' && page !== 'quiz' && quizPlaying && quizState.questions.length > 0 && !quizState.finished;
    if (activeQuiz && !confirm('当前练习还没完成，确定离开吗？已提交题目的错题与复习记录会保留，但本次完整练习不会加入历史。\nLeave this unfinished practice? Submitted answers keep their mistake/review updates, but the full session will not be saved to history.')) {
        return;
    }
    if (currentPage === 'quiz' && page !== 'quiz') { clearInterval(quizState.timerInterval); quizState.timerInterval = null; }
    if (currentPage === 'typing' && page !== 'typing' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    currentPage = page;
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const pageEl = document.getElementById('page-' + page);
    if (pageEl) pageEl.classList.add('active');
    const titles = {
        typing: '打字默写 Recall & Type', dashboard: '首页仪表盘 Dashboard', materials: '资料中心 Materials', quiz: '题库刷题 Practice',
        pastpapers: '历年真题 Past Papers', review: '智能复习 Smart Review', flashcards: '闪卡记忆 Flashcards',
        mustknow: '必考点 Must-Know', keyunits: '重点复习单元 Key Units',
        wrongbook: '错题本 Mistake Book', aichat: '学习助手 Study Assistant', analytics: '学习分析 Analytics',
        members: '成员管理 Members', settings: '设置 Settings'
    };
    document.getElementById('page-title').textContent = titles[page] || '';
    if (window.innerWidth <= 768) closeSidebar();
    renderPage(page);
    refreshKeywords(document.getElementById('page-' + page));
}

// 关键词高亮：调用术语库扫描指定容器内的文本节点
function refreshKeywords(el) {
    try { if (typeof enhanceKeywords === 'function') enhanceKeywords(el || document.body); } catch (e) { /* 术语库未加载时忽略 */ }
}

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.page));
    item.setAttribute('role', 'button');
    item.tabIndex = 0;
    item.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); navigateTo(item.dataset.page); } });
});

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebar-overlay').classList.toggle('show');
}
function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('show');
}

// ========== 页面渲染调度 ==========
function renderPage(page) {
    switch (page) {
        case 'typing': renderTypingSetup(); break;
        case 'dashboard': renderDashboard(); break;
        case 'materials': renderMaterials(); break;
        case 'quiz': resetQuizSetup(); break;
        case 'pastpapers': renderPastPapers(); break;
        case 'review': renderReview(); break;
        case 'flashcards': renderFlashcards(); break;
        case 'mustknow': renderMustKnow(); break;
        case 'keyunits': renderKeyUnits(); break;
        case 'wrongbook': renderWrongBook(); break;
        case 'analytics': renderAnalytics(); break;
        case 'members': canAccessPage('members') ? renderMembers() : renderAccessDenied('members'); break;
        case 'settings': loadSettingsForm(); break;
    }
}

function populateFilters() {
    const subjects = orderedSubjects();
    ['material-subject-filter', 'quiz-subject', 'wrong-filter', 'upload-subject', 'card-subject', 'pp-subject', 'mustknow-subject', 'keyunits-subject'].forEach(id => {
        const sel = document.getElementById(id);
        if (!sel) return;
        const currentVal = sel.value;
        sel.innerHTML = ['upload-subject', 'card-subject'].includes(id) ? '' : '<option value="all">全部科目 All Subjects</option>';
        if (id === 'quiz-subject') sel.innerHTML = '<option value="focus">四科专项（推荐）Four-subject focus</option>' + sel.innerHTML;
        subjects.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s; opt.textContent = FOCUS_LABELS[s] || s;
            sel.appendChild(opt);
        });
        if ([...sel.options].some(o => o.value === currentVal)) sel.value = currentVal;
    });
}

// ========== 首页仪表盘 ==========
function renderDashboard() {
    const records = appData.quizRecords;
    const totalQ = records.reduce((sum, r) => sum + r.total, 0);
    const correctQ = records.reduce((sum, r) => sum + r.correct, 0);
    const accuracy = totalQ > 0 ? Math.round(correctQ / totalQ * 100) : 0;

    document.getElementById('stat-total-questions').textContent = totalQ;
    document.getElementById('stat-accuracy').textContent = accuracy + '%';
    document.getElementById('stat-streak').textContent = appData.streak;
    document.getElementById('stat-time').textContent = Math.floor(appData.studyTime / 60) + 'h';

    // 今日任务
    const dueCount = getDueReviewCount();
    const wrongCount = getActiveMistakes().length;
    renderRevisionHub(dueCount, wrongCount);
    const tasks = [];
    if (dueCount > 0) tasks.push({ text: `智能复习：${dueCount} 道题目待复习<span class="bi-en">Smart review: ${dueCount} questions due</span>`, done: false, action: "navigateTo('review')" });
    if (wrongCount > 0) tasks.push({ text: `错题重练：${wrongCount} 道错题等待攻克<span class="bi-en">Redo ${wrongCount} mistakes</span>`, done: false, action: "navigateTo('wrongbook')" });
    tasks.push({ text: '每日一练：完成 10 道题目<span class="bi-en">Daily practice: finish 10 questions</span>', done: totalQ > 0 && (appData.dailyStats[getTodayStr()]?.questions || 0) >= 10, action: "navigateTo('quiz')" });
    tasks.push({ text: '闪卡复习：复习 10 张闪卡<span class="bi-en">Flashcards: review 10 cards</span>', done: false, action: "navigateTo('flashcards')" });

    const tasksEl = document.getElementById('today-tasks');
    if (tasks.length === 0) {
        tasksEl.innerHTML = '<div class="empty-state">暂无任务，去刷题吧！<span class="bi-en">No tasks yet — go and practise!</span></div>';
    } else {
        tasksEl.innerHTML = tasks.map((t, i) => `
            <div class="task-item" onclick="${t.action}">
                <div class="task-check ${t.done ? 'done' : ''}">${t.done ? '✓' : ''}</div>
                <span class="task-text">${t.text}</span>
            </div>
        `).join('');
    }

    // 最近错题
    const recentWrong = getActiveMistakes().slice(-3).reverse();
    const wrongEl = document.getElementById('recent-wrong');
    if (recentWrong.length === 0) {
        wrongEl.innerHTML = '<div class="empty-state">暂无错题记录<span class="bi-en">No mistakes recorded yet</span></div>';
    } else {
        wrongEl.innerHTML = recentWrong.map(w => {
            const question = String(w.question || '');
            const preview = question.length > 50 ? question.substring(0, 50) + '...' : question;
            return `
            <div class="wrong-item-mini" onclick="navigateTo('wrongbook')">
                <span class="wim-subject">${escapeHtml(w.subject || '')} · ${escapeHtml(w.topic || '')}</span>
                <div class="wim-text">${escapeHtml(preview)}</div>
            </div>
        `;
        }).join('');
    }

    // 徽章
    document.getElementById('review-badge').textContent = dueCount;
    document.getElementById('review-badge').style.display = dueCount > 0 ? 'inline-block' : 'none';
    document.getElementById('wrong-badge').textContent = wrongCount;
    document.getElementById('wrong-badge').style.display = wrongCount > 0 ? 'inline-block' : 'none';

    // 图表
    renderSubjectChart();
    // 学科分类板块
    renderSubjectCards();
}

function renderSubjectChart() {
    const canvas = document.getElementById('subject-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const subjects = [...new Set(QUESTION_BANK.map(q => q.subject))];
    const data = subjects.map(s => {
        const recs = appData.quizRecords.filter(r => r.subject === s || r.questions?.some(q => q.subject === s));
        const total = recs.reduce((sum, r) => sum + (r.total || 0), 0);
        const correct = recs.reduce((sum, r) => sum + (r.correct || 0), 0);
        return total > 0 ? Math.round(correct / total * 100) : 0;
    });

    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, W, H);
    const barW = W / subjects.length * 0.5;
    const gap = W / subjects.length;
    const maxH = H - 40;

    subjects.forEach((s, i) => {
        const h = (data[i] / 100) * maxH;
        const x = i * gap + (gap - barW) / 2;
        const y = H - h - 20;
        const gradient = ctx.createLinearGradient(x, y, x, H - 20);
        gradient.addColorStop(0, '#2980b9');
        gradient.addColorStop(1, '#3498db');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barW, h, [4, 4, 0, 0]);
        ctx.fill();
        ctx.fillStyle = '#2c3e50';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(data[i] + '%', x + barW / 2, y - 6);
        ctx.fillStyle = '#7f8c8d';
        ctx.fillText(s, x + barW / 2, H - 5);
    });
}

function updateCountdown() {
    const days = getDaysUntil(appData.settings.examDate);
    document.getElementById('countdown-days').textContent = days > 0 ? days : 0;
}

// ========== 资料中心 ==========
let materialFilter = 'all';

function filterMaterials(type) {
    materialFilter = type;
    document.querySelectorAll('.material-tab').forEach(t => t.classList.toggle('active', t.dataset.type === type));
    renderMaterials();
}

function renderMaterials() {
    const subjectFilter = document.getElementById('material-subject-filter')?.value || 'all';
    let materials = appData.materials.map(m => m.id === 'mat001' ? MATERIALS_DATA.find(item => item.id === 'mat001') : m);
    if (materialFilter !== 'all') materials = materials.filter(m => m.type === materialFilter);
    if (subjectFilter !== 'all') materials = materials.filter(m => m.subject === subjectFilter);

    const grid = document.getElementById('materials-grid');
    if (materials.length === 0) {
        grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1">暂无资料，点击上方按钮上传<span class="bi-en">No materials yet — use the upload button above.</span></div>';
        return;
    }
    const typeNames = { notes: '讲义笔记', pastpaper: '历年真题', markscheme: '评分标准', summary: '考点总结', other: '其他' };
    grid.innerHTML = materials.map(m => `
        <div class="material-card" onclick="openMaterial('${escapeHtml(String(m.id))}')">
            <div class="material-icon">${escapeHtml(m.icon || '📁')}</div>
            <div class="material-name">${escapeHtml(m.name || '')}</div>
            <div class="material-meta">
                <span class="material-tag">${escapeHtml(m.subject || '')}</span>
                <span class="material-tag">${escapeHtml(typeNames[m.type] || m.type || '')}</span>
                ${(m.tags || []).map(t => `<span class="material-tag">${escapeHtml(t)}</span>`).join('')}
            </div>
            <div class="material-info">
                <span>${escapeHtml(m.size || '')}</span>
                <span>${escapeHtml(m.date || '')}</span>
            </div>
        </div>
    `).join('');
}

function openMaterial(id) {
    const allMaterials = [...MATERIALS_DATA, ...(appData.materials || [])];
    const m = allMaterials.find(x => x.id === id);
    if (!m) { showToast('资料不存在'); return; }
    const typeNames = { notes: '讲义笔记 Notes', pastpaper: '历年真题 Past Paper', markscheme: '评分标准 Mark Scheme', summary: '考点总结 Summary', other: '其他 Other' };
    document.getElementById('material-modal-title').textContent = m.icon + ' ' + m.name;
    document.getElementById('material-modal-meta').innerHTML = `
        <span class="material-tag">${escapeHtml(m.subject || '')}</span>
        <span class="material-tag">${escapeHtml(typeNames[m.type] || m.type || '')}</span>
        <span class="material-tag">📦 ${escapeHtml(m.size || '')}</span>
        <span class="material-tag">📅 ${escapeHtml(m.date || '')}</span>
        ${(m.tags || []).map(t => `<span class="material-tag">${escapeHtml(t)}</span>`).join('')}
        ${m.fileName ? `<span class="material-tag">📎 ${escapeHtml(m.fileName)}</span>` : ''}
    `;
    const contentEl = document.getElementById('material-modal-content');
    if (m.content) {
        let html = '<pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;line-height:1.8;color:var(--text);margin:0;">' + escapeHtml(m.content) + '</pre>';
        if (m.en) html += '<div class="en-block" style="white-space:pre-wrap;font-size:13px;line-height:1.8;margin-top:14px;">' + escapeHtml(m.en) + '</div>';
        contentEl.innerHTML = html;
    } else {
        contentEl.innerHTML = '<div class="empty-state">该资料暂无详细内容，可在上传资料时添加内容描述。<span class="bi-en">No detailed content yet — add a description when uploading.</span></div>';
    }
    document.getElementById('material-modal').classList.remove('hidden');
    refreshKeywords(contentEl);
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function showUploadModal() {
    document.getElementById('upload-modal').classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

function formatFileSize(bytes) {
    if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function handleMaterialFileSelection(file) {
    const hint = document.getElementById('upload-file-status');
    if (!file) {
        if (hint) hint.textContent = '尚未选择文件 No file selected';
        return;
    }
    if (hint) hint.textContent = `${file.name} · ${formatFileSize(file.size)}`;
    const nameInput = document.getElementById('upload-name');
    if (nameInput && !nameInput.value.trim()) {
        nameInput.value = file.name.replace(/\.[^.]+$/, '');
    }
}

function confirmUpload() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput?.files?.[0];
    const name = document.getElementById('upload-name').value.trim();
    const subject = document.getElementById('upload-subject').value;
    const type = document.getElementById('upload-type').value;
    const tags = document.getElementById('upload-tags').value.split(',').map(t => t.trim()).filter(Boolean);
    if (!file) { showToast('请先选择一个文件 Please select a file first'); return; }
    if (!name) { showToast('请输入资料名称'); return; }

    const allowedExtensions = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'];
    const extension = (file.name.split('.').pop() || '').toLowerCase();
    if (!allowedExtensions.includes(extension)) {
        showToast('不支持该文件类型 Unsupported file type');
        return;
    }

    const icons = { notes: '📖', pastpaper: '📄', markscheme: '✅', summary: '📋', other: '📁' };
    appData.materials.push({
        id: 'mat' + Date.now(),
        name, subject, type, tags,
        icon: icons[type] || '📁',
        size: formatFileSize(file.size),
        fileName: file.name,
        mimeType: file.type || '',
        localMetadataOnly: true,
        date: getTodayStr(),
    });
    saveData(appData);
    closeModal('upload-modal');
    document.getElementById('upload-name').value = '';
    document.getElementById('upload-tags').value = '';
    fileInput.value = '';
    handleMaterialFileSelection(null);
    renderMaterials();
    showToast('资料记录已保存；文件本体暂未上传云端 File metadata saved locally');
}

// ========== 刷题模块 ==========
function resetQuizSetup() {
    clearInterval(quizState.timerInterval);
    quizState.timerInterval = null;
    updateQuizTopics();
    document.getElementById('quiz-setup').classList.remove('hidden');
    document.getElementById('quiz-playing').classList.add('hidden');
    document.getElementById('quiz-result').classList.add('hidden');
}

function startQuiz(mode, topicOverride = null) {
    let questions = getQuizScopeQuestions(topicOverride);
    const count = parseInt(document.getElementById('quiz-count').value);

    if (mode === 'wrong') {
        const wrongIds = getActiveMistakes().map(w => w.id);
        questions = questions.filter(q => wrongIds.includes(q.id));
        if (questions.length === 0) { showToast('当前科目 / 专题范围没有待巩固错题，请调整筛选 No active mistakes in this range'); return; }
    } else if (mode === 'weak') {
        const weakTopics = getWeakTopicStats();
        if (weakTopics.length === 0) { showToast('暂无薄弱点数据'); return; }
        questions = questions.filter(q => weakTopics.some(stat => stat.subject === q.subject && stat.topic === q.topic));
    } else if (mode === 'random') {
        questions = shuffleArray(questions);
    }

    if (questions.length === 0) { showToast('没有符合条件的题目'); return; }
    if (count > 0 && count < questions.length) questions = questions.slice(0, count);

    clearInterval(quizState.timerInterval);
    quizState = {
        questions,
        currentIndex: 0,
        answers: new Array(questions.length).fill(null),
        startTime: Date.now(),
        timerInterval: null,
        elapsedSeconds: 0,
        selectedOption: null,
        submitted: false,
    };

    document.getElementById('quiz-setup').classList.add('hidden');
    document.getElementById('quiz-result').classList.add('hidden');
    document.getElementById('quiz-playing').classList.remove('hidden');
    document.getElementById('quiz-total').textContent = questions.length;

    startQuizTimer();
    renderQuestion();
}

function startQuizTimer() {
    if (!quizState.startTime) quizState.startTime = Date.now() - quizState.elapsedSeconds * 1000;
    const updateTimer = () => {
        quizState.elapsedSeconds = Math.max(0, Math.floor((Date.now() - quizState.startTime) / 1000));
        document.getElementById('quiz-timer').textContent = formatTime(quizState.elapsedSeconds);
    };
    updateTimer();
    if (quizState.timerInterval) clearInterval(quizState.timerInterval);
    quizState.timerInterval = setInterval(updateTimer, 1000);
}

function renderQuestion() {
    const q = quizState.questions[quizState.currentIndex];
    quizState.selectedOption = quizState.answers[quizState.currentIndex];
    quizState.submitted = quizState.answers[quizState.currentIndex] !== null && quizState.answers[quizState.currentIndex] !== undefined;

    document.getElementById('quiz-current').textContent = quizState.currentIndex + 1;
    document.getElementById('quiz-progress-fill').style.width = ((quizState.currentIndex + 1) / quizState.questions.length * 100) + '%';
    document.getElementById('q-subject').textContent = q.subject;
    document.getElementById('q-difficulty').textContent = { easy: '简单', medium: '中等', hard: '困难' }[q.difficulty];
    document.getElementById('q-topic').textContent = q.topic + (q.topicEn ? ' · ' + q.topicEn : '');
    const qTextEl = document.getElementById('question-text');
    qTextEl.textContent = q.question;
    if (q.questionEn && q.questionEn !== q.question) {
        const enP = document.createElement('div');
        enP.className = 'en-block';
        enP.textContent = q.questionEn;
        qTextEl.appendChild(enP);
    }
    document.getElementById('q-source').textContent = q.source || '站内练习 · 非完整真题 In-site practice · not a full past paper';

    // 常考点标记
    const hotBadge = document.getElementById('q-hot');
    if (q.isHot) { hotBadge.classList.remove('hidden'); } else { hotBadge.classList.add('hidden'); }

    // 双语关键词
    const kwEl = document.getElementById('q-keywords');
    if (q.keywords && q.keywords.length > 0) {
        kwEl.innerHTML = q.keywords.map(k => `<span class="kw-chip">${k}</span>`).join('');
        kwEl.classList.remove('hidden');
    } else {
        kwEl.classList.add('hidden');
    }

    const optionsEl = document.getElementById('options-list');
    optionsEl.innerHTML = q.options.map((opt, i) => {
        let cls = 'option-item';
        if (quizState.submitted) {
            cls += ' disabled';
            if (i === q.answer) cls += ' correct';
            if (i === quizState.selectedOption && i !== q.answer) cls += ' wrong';
        } else if (i === quizState.selectedOption) {
            cls += ' selected';
        }
        return `<div class="${cls}" onclick="selectOption(${i})">
            <div class="option-label">${String.fromCharCode(65 + i)}</div>
            <div class="option-text">${optionHtml(opt, q.subject)}</div>
        </div>`;
    }).join('');

    // 结果区
    const resultEl = document.getElementById('question-result');
    if (quizState.submitted) {
        const isCorrect = quizState.selectedOption === q.answer;
        resultEl.classList.remove('hidden');
        document.getElementById('result-header').className = 'result-header ' + (isCorrect ? 'correct' : 'wrong');
        document.getElementById('result-header').textContent = isCorrect ? '✅ 回答正确！ Correct!' : '❌ 回答错误 Incorrect';
        document.getElementById('result-answer').innerHTML = `正确答案 Correct answer：<b>${String.fromCharCode(65 + q.answer)}. ${optionInline(q.options[q.answer], q.subject)}</b>`;
        const expEl = document.getElementById('result-explanation');
        expEl.textContent = '中文思路 Chinese reasoning：' + q.explanation;
        if (q.explanationEn && q.explanationEn !== q.explanation) {
            const enExp = document.createElement('div');
            enExp.className = 'en-block';
            enExp.textContent = '英文解析 / Exam wording：' + q.explanationEn;
            expEl.appendChild(enExp);
        }
    } else {
        resultEl.classList.add('hidden');
    }

    // 按钮
    document.getElementById('btn-prev').classList.toggle('hidden', quizState.currentIndex === 0);
    document.getElementById('btn-submit').classList.toggle('hidden', quizState.submitted);
    document.getElementById('btn-next').classList.toggle('hidden', !quizState.submitted);
    document.getElementById('btn-next').textContent = quizState.currentIndex === quizState.questions.length - 1 ? '查看结果 Results' : '下一题 Next';
    refreshKeywords(document.getElementById('question-card'));
}

function selectOption(index) {
    if (quizState.submitted) return;
    quizState.selectedOption = index;
    document.querySelectorAll('.option-item').forEach((el, i) => {
        el.classList.toggle('selected', i === index);
    });
}

function submitAnswer() {
    if (quizState.submitted) return;
    if (quizState.selectedOption === null) { showToast('请先选择一个答案'); return; }
    quizState.answers[quizState.currentIndex] = quizState.selectedOption;
    quizState.submitted = true;

    const q = quizState.questions[quizState.currentIndex];
    const isCorrect = quizState.selectedOption === q.answer;

    // 记录答题
    const today = getTodayStr();
    if (!appData.dailyStats[today]) appData.dailyStats[today] = { questions: 0, correct: 0 };
    appData.dailyStats[today].questions++;
    if (isCorrect) appData.dailyStats[today].correct++;

    // 更新连续打卡
    if (appData.lastStudyDate !== today) {
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterday = formatLocalDate(yesterdayDate);
        appData.streak = appData.lastStudyDate === yesterday ? appData.streak + 1 : 1;
        appData.lastStudyDate = today;
    }

    // Keep mistakes until the student explicitly resolves them; a relapse reopens them.
    recordMistakeAttempt(q, quizState.selectedOption, today);

    // SRS 更新
    updateSRS(q.id, isCorrect);

    saveData(appData);
    renderQuestion();
}

function prevQuestion() {
    if (quizState.currentIndex > 0) {
        quizState.currentIndex--;
        renderQuestion();
    }
}

function nextQuestion() {
    if (!quizState.submitted) return;
    if (quizState.currentIndex < quizState.questions.length - 1) {
        quizState.currentIndex++;
        renderQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    if (quizState.finished) return;
    quizState.finished = true;
    if (quizState.startTime) {
        quizState.elapsedSeconds = Math.max(0, Math.floor((Date.now() - quizState.startTime) / 1000));
    }
    clearInterval(quizState.timerInterval);
    const correct = quizState.answers.filter((a, i) => a === quizState.questions[i].answer).length;
    const total = quizState.questions.length;
    const percent = Math.round(correct / total * 100);

    document.getElementById('quiz-playing').classList.add('hidden');
    document.getElementById('quiz-result').classList.remove('hidden');

    // 动画圆环
    const circle = document.getElementById('score-circle');
    const circumference = 339.292;
    setTimeout(() => {
        circle.style.strokeDashoffset = circumference * (1 - percent / 100);
    }, 100);

    document.getElementById('result-percent').textContent = percent + '%';
    document.getElementById('result-grade').textContent = percent >= 90 ? 'A*' : percent >= 80 ? 'A' : percent >= 70 ? 'B' : percent >= 60 ? 'C' : percent >= 50 ? 'D' : 'F';
    document.getElementById('result-correct').textContent = correct;
    document.getElementById('result-wrong').textContent = total - correct;
    document.getElementById('result-time').textContent = formatTime(quizState.elapsedSeconds);

    // 保存记录
    appData.quizRecords.push({
        id: 'quiz-' + (globalThis.crypto?.randomUUID?.() || Date.now() + '-' + Math.random().toString(36).slice(2)),
        date: getTodayStr(),
        total, correct,
        time: quizState.elapsedSeconds,
        questions: quizState.questions,
        answers: quizState.answers,
    });
    appData.studyTime += quizState.elapsedSeconds;
    // 计入当前成员的个人学习档案（成员管理页可见）
    recordMemberStudy(total, correct, quizState.elapsedSeconds);
    saveData(appData);
}

function restartQuiz() {
    resetQuizSetup();
}

function reviewWrong() {
    navigateTo('wrongbook');
}

function exitQuiz() {
    if (confirm('确定要退出本次练习吗？已提交题目的错题与复习记录会保留，但本次完整练习不会加入历史。\nExit this practice? Submitted answers keep their mistake/review updates, but the full session will not be saved to history.')) {
        clearInterval(quizState.timerInterval);
        resetQuizSetup();
    }
}

// ========== SRS 间隔重复 ==========
function updateSRS(questionId, correct) {
    if (!appData.srsData[questionId]) {
        appData.srsData[questionId] = { interval: 1, repetitions: 0, easeFactor: 2.5, nextReview: getTodayStr(), lastReview: null };
    }
    const srs = appData.srsData[questionId];
    const today = new Date();
    if (correct) {
        srs.repetitions++;
        if (srs.repetitions === 1) srs.interval = 1;
        else if (srs.repetitions === 2) srs.interval = 3;
        else srs.interval = Math.round(srs.interval * srs.easeFactor);
        srs.easeFactor = Math.min(3.0, srs.easeFactor + 0.1);
    } else {
        srs.repetitions = 0;
        srs.interval = 1;
        srs.easeFactor = Math.max(1.3, srs.easeFactor - 0.2);
    }
    const next = new Date(today);
    next.setDate(next.getDate() + srs.interval);
    srs.nextReview = formatLocalDate(next);
    srs.lastReview = getTodayStr();
}

function getDueReviewCount() {
    const today = getTodayStr();
    return getDueReviewItems().length;
}

function getDueReviewItems() {
    const today = getTodayStr();
    const dueIds = Object.entries(appData.srsData)
        .filter(([id, srs]) => srs.nextReview <= today)
        .map(([id]) => id);
    return QUESTION_BANK.filter(q => dueIds.includes(q.id));
}

// ========== 历年真题 ==========
function renderPastPapers() {
    const subject = document.getElementById('pp-subject').value;
    const year = document.getElementById('pp-year').value;
    const season = document.getElementById('pp-season').value;
    document.getElementById('syllabus-links').innerHTML = FOCUS_SOURCES.map(s => '<a target="_blank" rel="noopener noreferrer" href="'+s.url+'">'+(FOCUS_LABELS[s.subject] || s.subject)+' · '+s.years+' 考纲 ↗</a>').join('');
    const papers = PAPER_RESOURCES.filter(p => (subject === 'all' || p.subject === subject) && (year === 'all' || p.year === year) && (season === 'all' || p.season === season)).sort((a,b)=>Number(b.year)-Number(a.year));
    const list = document.getElementById('pastpapers-list');
    list.innerHTML = papers.length ? papers.map(p => '<article class="pastpaper-item resource-card"><div class="pp-icon">📄</div><div class="pp-info"><div class="pp-title">'+(FOCUS_LABELS[p.subject] || p.subject)+' · '+p.paper+'</div><p class="pp-meta">'+p.year+' · '+(p.season === 'sp' ? '官方样卷 · 非历年真题' : 'May/June')+' · '+p.code+'</p><p class="page-desc">'+p.provider+' · 核对日期 2026-09-30</p><p class="page-desc">'+p.note+'</p><div class="resource-actions">'+p.links.map(l=>'<a class="btn btn-outline btn-sm" target="_blank" rel="noopener noreferrer" href="'+l.url+'">'+l.label+' ↗</a>').join('')+'<a target="_blank" rel="noopener noreferrer" href="'+p.source+'">来源页面 ↗</a></div></div></article>').join('') : '<div class="empty-state">没有匹配的已核对资源。可切换年份或考季查看；其他科目本轮未补充。</div>';
}

// ========== 智能复习 ==========
function renderReview() {
    const dueItems = getDueReviewItems();
    const states = QUESTION_BANK.filter(q => appData.srsData[q.id]).map(q => appData.srsData[q.id]);
    const mastered = states.filter(s => s.interval >= 21).length;
    const learning = states.filter(s => s.interval < 7).length;
    const schedule = getReviewSchedule();
    document.getElementById('review-due-tomorrow').textContent = schedule.tomorrow.length;
    document.getElementById('review-next-seven').textContent = schedule.nextSeven.length;

    document.getElementById('review-due-today').textContent = dueItems.length;
    document.getElementById('review-mastered').textContent = mastered;
    document.getElementById('review-learning').textContent = learning;

    // 复习任务
    const tasksEl = document.getElementById('review-tasks');
    if (dueItems.length === 0) {
        tasksEl.innerHTML = '<div class="empty-state">今日没有需要复习的内容，去学习新知识吧！<span class="bi-en">Nothing due today — go and learn something new!</span></div>';
        document.getElementById('start-review-btn').style.display = 'none';
    } else {
        const bySubject = {};
        dueItems.forEach(q => {
            if (!bySubject[q.subject]) bySubject[q.subject] = [];
            bySubject[q.subject].push(q);
        });
        tasksEl.innerHTML = Object.entries(bySubject).map(([sub, qs]) => `
        <div class="review-task-item">
            <div class="rt-icon">📖</div>
            <div class="rt-info">
                <div class="rt-title">${sub} 复习<span class="bi-en">${sub} review</span></div>
                <div class="rt-meta">${qs.length} 道题目待复习<span class="bi-en">${qs.length} questions due</span></div>
            </div>
                <div class="rt-count">${qs.length}</div>
            </div>
        `).join('');
        document.getElementById('start-review-btn').style.display = 'inline-flex';
    }

    // 记忆状态分布
    const bars = [
        { label: '新题 New', count: QUESTION_BANK.filter(q => !appData.srsData[q.id]).length, color: '#95a5a6' },
        { label: '学习中 Learning', count: states.filter(s => s.interval < 7).length, color: '#e74c3c' },
        { label: '熟悉 Familiar', count: states.filter(s => s.interval >= 7 && s.interval < 21).length, color: '#3498db' },
        { label: '已掌握 Mastered', count: mastered, color: '#27ae60' },
    ];
    const maxCount = Math.max(...bars.map(b => b.count), 1);
    document.getElementById('memory-bars').innerHTML = bars.map(b => `
        <div class="memory-bar-item">
            <span class="mb-label">${b.label}</span>
            <div class="mb-track"><div class="mb-fill" style="width:${b.count / maxCount * 100}%;background:${b.color}"></div></div>
            <span class="mb-count">${b.count}</span>
        </div>
    `).join('');
}

function getReviewSchedule(today = getTodayStr()) {
    const tomorrow = parseLocalDate(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = parseLocalDate(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const items = QUESTION_BANK.filter(q => appData.srsData[q.id]);
    return {
        due: items.filter(q => appData.srsData[q.id].nextReview <= today),
        tomorrow: items.filter(q => appData.srsData[q.id].nextReview === formatLocalDate(tomorrow)),
        nextSeven: items.filter(q => appData.srsData[q.id].nextReview > today && appData.srsData[q.id].nextReview <= formatLocalDate(nextWeek)),
    };
}

function startReviewSession() {
    const dueItems = getDueReviewItems();
    if (dueItems.length === 0) { showToast('没有需要复习的内容'); return; }
    clearInterval(quizState.timerInterval);
    navigateTo('quiz');
    quizState = {
        questions: dueItems,
        currentIndex: 0,
        answers: new Array(dueItems.length).fill(null),
        startTime: Date.now(),
        timerInterval: null,
        elapsedSeconds: 0,
        selectedOption: null,
        submitted: false,
    };
    document.getElementById('page-review').classList.remove('active');
    document.getElementById('page-quiz').classList.add('active');
    document.getElementById('quiz-setup').classList.add('hidden');
    document.getElementById('quiz-result').classList.add('hidden');
    document.getElementById('quiz-playing').classList.remove('hidden');
    document.getElementById('quiz-total').textContent = dueItems.length;
    document.getElementById('page-title').textContent = '智能复习';
    startQuizTimer();
    renderQuestion();
}

// ========== 闪卡 ==========
function renderFlashcards() {
    document.getElementById('flashcard-study').classList.add('hidden');
    document.getElementById('flashcard-decks').classList.remove('hidden');
    document.getElementById('flashcard-decks').innerHTML = appData.flashcards.map(d => `
        <div class="deck-card" data-deck-index="${appData.flashcards.indexOf(d)}">
            <div class="deck-icon">${escapeHtml(d.icon)}</div>
            <div class="deck-name">${escapeHtml(d.name)}</div>
            <div class="deck-count">${d.cards.length} 张卡片 ${d.cards.length} cards</div>
        </div>
    `).join('');
    document.querySelectorAll('[data-deck-index]').forEach(card => card.addEventListener('click', () => startFlashcard(appData.flashcards[Number(card.dataset.deckIndex)].id)));
}

function startFlashcard(deckId) {
    const deck = appData.flashcards.find(d => d.id === deckId);
    if (!deck || deck.cards.length === 0) { showToast('该卡组没有卡片'); return; }
    flashcardState = {
        deck,
        cards: shuffleArray(deck.cards),
        currentIndex: 0,
        flipped: false,
    };
    document.getElementById('flashcard-decks').classList.add('hidden');
    document.getElementById('flashcard-study').classList.remove('hidden');
    document.getElementById('card-total').textContent = flashcardState.cards.length;
    renderFlashcard();
}

function renderFlashcard() {
    const card = flashcardState.cards[flashcardState.currentIndex];
    const frontEl = document.getElementById('card-front');
    const backEl = document.getElementById('card-back');
    frontEl.textContent = card.front;
    backEl.textContent = card.back;
    if (card.frontEn && card.frontEn !== card.front) {
        const ef = document.createElement('span'); ef.className = 'card-back-en'; ef.textContent = card.frontEn; frontEl.appendChild(ef);
    }
    if (card.backEn && card.backEn !== card.back) {
        const eb = document.createElement('span'); eb.className = 'card-back-en'; eb.textContent = card.backEn; backEl.appendChild(eb);
    }
    document.getElementById('card-current').textContent = flashcardState.currentIndex + 1;
    document.getElementById('flashcard').classList.remove('flipped');
    flashcardState.flipped = false;
    refreshKeywords(document.getElementById('flashcard'));
}

function flipCard() {
    flashcardState.flipped = !flashcardState.flipped;
    document.getElementById('flashcard').classList.toggle('flipped');
}

function rateCard(rating) {
    flashcardState.currentIndex++;
    if (flashcardState.currentIndex >= flashcardState.cards.length) {
        showToast('🎉 本组闪卡复习完成！');
        renderFlashcards();
    } else {
        renderFlashcard();
    }
}

function exitFlashcard() {
    renderFlashcards();
}

function showAddCardModal() {
    document.getElementById('addcard-modal').classList.remove('hidden');
}

function saveFlashcard() {
    const subject = document.getElementById('card-subject').value;
    const front = document.getElementById('card-front-input').value.trim();
    const back = document.getElementById('card-back-input').value.trim();
    if (!front || !back) { showToast('请填写正反面内容'); return; }
    let deck = appData.flashcards.find(d => d.subject === subject);
    if (!deck) {
        deck = { id: 'deck_' + Date.now(), subject, name: subject + '闪卡', icon: '🃏', cards: [] };
        appData.flashcards.push(deck);
    }
    deck.cards.push({ front, back });
    saveData(appData);
    closeModal('addcard-modal');
    document.getElementById('card-front-input').value = '';
    document.getElementById('card-back-input').value = '';
    renderFlashcards();
    showToast('闪卡已添加！');
}

function getActiveMistakes() {
    return appData.wrongQuestions.filter(w => !w.resolved);
}

function recordMistakeAttempt(question, answer, date) {
    const correct = answer === question.answer;
    let mistake = appData.wrongQuestions.find(w => w.id === question.id);
    if (!mistake && !correct) {
        mistake = { ...question, reason: '', date, correctStreak: 0 };
        appData.wrongQuestions.push(mistake);
    }
    if (!mistake) return;
    mistake.lastAttempt = date;
    mistake.correctStreak = correct ? (mistake.correctStreak || 0) + 1 : 0;
    if (!correct) {
        mistake.wrongAnswer = answer;
        mistake.resolved = false;
        mistake.resolvedAt = null;
    }
}

function toggleMistakeResolved(index) {
    const mistake = appData.wrongQuestions[index];
    if (!mistake) return;
    mistake.resolved = !mistake.resolved;
    mistake.resolvedAt = mistake.resolved ? getTodayStr() : null;
    saveData(appData);
    renderWrongBook();
}

const MISTAKE_REASONS = {
    concept: '概念不清 Concept', careless: '粗心 Careless',
    calculation: '计算失误 Calculation', misread: '审题错误 Misread',
    vocabulary: '术语不熟 Vocabulary', other: '其他 Other',
};

// ========== 错题本 ==========
function renderWrongBook() {
    const subject = document.getElementById('wrong-filter')?.value || 'all';
    let wrongs = appData.wrongQuestions;
    const status = document.getElementById('wrong-status-filter')?.value || 'active';
    if (status !== 'all') wrongs = wrongs.filter(w => status === 'resolved' ? w.resolved : !w.resolved);
    if (subject !== 'all') wrongs = wrongs.filter(w => w.subject === subject);

    document.getElementById('wrong-total').textContent = getActiveMistakes().length;
    document.getElementById('wrong-concept').textContent = appData.wrongQuestions.filter(w => w.reason === 'concept').length;
    document.getElementById('wrong-careless').textContent = appData.wrongQuestions.filter(w => w.reason === 'careless').length;
    document.getElementById('wrong-unknown').textContent = appData.wrongQuestions.filter(w => w.reason === 'unknown' || !w.reason).length;

    const list = document.getElementById('wrong-list');
    if (wrongs.length === 0) {
        list.innerHTML = '<div class="empty-state">太棒了！没有错题<span class="bi-en">Excellent — no mistakes at all!</span></div>';
        return;
    }
    list.innerHTML = wrongs.map((w, idx) => `
        <div class="wrong-item">
            <div class="wrong-header">
                <span class="q-badge">${escapeHtml(w.subject)}</span>
                <span class="q-badge">${escapeHtml(w.topic)}</span>
                <span class="q-badge">${{easy:'简单 Easy',medium:'中等 Medium',hard:'困难 Hard'}[w.difficulty]}</span>
            </div>
            <div class="wrong-question">${escapeHtml(w.question)}</div>
            <div class="wrong-answer-row">
                <span class="wa-wrong">你的答案 Your answer：${w.wrongAnswer !== null && w.wrongAnswer !== undefined ? String.fromCharCode(65 + w.wrongAnswer) + '. ' + optionInline(w.options[w.wrongAnswer], w.subject) : '未作答 No answer'}</span>
                <span class="wa-correct">正确答案 Correct：${String.fromCharCode(65 + w.answer)}. ${optionInline(w.options[w.answer], w.subject)}</span>
            </div>
            <div class="result-explanation" style="margin-top:8px">解析 Explanation：${escapeHtml(w.explanation)}</div>
            <div class="wrong-reason-select">
                <span style="font-size:12px;color:var(--text-light)">错误原因 Reason：</span>
                ${Object.entries(MISTAKE_REASONS).map(([reason, label]) => `<button class="reason-btn ${w.reason === reason ? 'active' : ''}" onclick="setWrongReasonByIndex(${appData.wrongQuestions.indexOf(w)}, '${reason}')">${label}</button>`).join('')}
            </div>
            <div class="wrong-reason-select">
                <span>${w.resolved ? '已解决 Resolved' : '待巩固 Learning'} · 连续答对 Correct streak: ${Number(w.correctStreak) || 0}</span>
                <button class="btn btn-outline btn-sm" onclick="toggleMistakeResolved(${appData.wrongQuestions.indexOf(w)})">${w.resolved ? '重新加入复习 Reopen' : '标记已解决 Resolve'}</button>
            </div>
        </div>
    `).join('');
}

function setWrongReasonByIndex(index, reason) {
    if (!Object.prototype.hasOwnProperty.call(MISTAKE_REASONS, reason)) return;
    const w = appData.wrongQuestions[index];
    if (w) { w.reason = reason; saveData(appData); renderWrongBook(); }
}

function resetQuizScope() {
    document.getElementById('quiz-subject').value = 'all';
    document.getElementById('quiz-difficulty').value = 'all';
    document.getElementById('quiz-hot-only').checked = false;
    updateQuizTopics(false);
}

function startWrongQuiz() {
    if (getActiveMistakes().length === 0) { showToast('暂无错题'); return; }
    navigateTo('quiz');
    resetQuizScope();
    startQuiz('wrong');
}

// ========== AI 问答 ==========
function handleChatKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
    }
}

function sendSuggestion(text) {
    document.getElementById('chat-input').value = text;
    sendChatMessage();
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    addMessage('user', text);
    input.value = '';

    // 显示打字动画
    const typingId = addTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator(typingId);
        const response = generateAIResponse(text);
        addMessage('ai', response.answer, response.source);
    }, 800 + Math.random() * 800);
}

function addMessage(role, content, source) {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = 'message ' + (role === 'user' ? 'user-message' : 'ai-message');

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = role === 'user' ? '👤' : '🤖';

    const contentEl = document.createElement('div');
    contentEl.className = 'msg-content';
    String(content || '').split('\n').forEach(line => {
        if (!line.trim()) return;
        const p = document.createElement('p');
        p.textContent = line;
        contentEl.appendChild(p);
    });

    if (source) {
        const sourceEl = document.createElement('div');
        sourceEl.className = 'msg-source';
        sourceEl.textContent = '📖 引用来源：' + source;
        contentEl.appendChild(sourceEl);
    }

    div.append(avatar, contentEl);
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function addTypingIndicator() {
    const container = document.getElementById('chat-messages');
    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = 'message ai-message';
    div.innerHTML = `<div class="msg-avatar">🤖</div><div class="msg-content"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return id;
}

function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function generateAIResponse(question) {
    // 关键词匹配知识库
    const q = question.toLowerCase();
    for (const [key, value] of Object.entries(AI_KNOWLEDGE)) {
        if (q.includes(key.toLowerCase())) {
            return value;
        }
    }

    // 基于题目数据的智能回答
    const matchedQuestion = QUESTION_BANK.find(qb =>
        question.includes(qb.topic) || (question.trim().length >= 4 && qb.question.includes(question.trim()))
    );

    if (matchedQuestion) {
        return {
            answer: `关于「${matchedQuestion.topic}」的知识点：\n\n${matchedQuestion.explanation}\n\n这是一个${{easy:'简单',medium:'中等',hard:'困难'}[matchedQuestion.difficulty]}难度的${matchedQuestion.subject}题目考点。建议你多做几道同类型题目巩固。`,
            source: `${matchedQuestion.subject} ${matchedQuestion.subjectCode} 题库`
        };
    }

    // 默认回答
    const subjectMatch = QUESTION_BANK.find(qb => q.includes(qb.subject.toLowerCase()));
    if (subjectMatch) {
        return {
            answer: `这是一个关于${subjectMatch.subject}的好问题！\n\n根据我的知识库，${subjectMatch.subject}科目包含以下主要章节：\n${[...new Set(QUESTION_BANK.filter(x => x.subject === subjectMatch.subject).map(x => x.topic))].join('、')}\n\n你可以具体问我某个章节的知识点，我会给出详细解答。`,
            source: `${subjectMatch.subject} ${subjectMatch.subjectCode} 站内练习目录（非官方考纲）`
        };
    }

    return {
        answer: `感谢你的提问！我是你的 IGCSE 本地学习助手，可以帮你解答各科知识点、讲解题目解题思路。\n\n目前我支持以下科目：数学、物理、化学、生物、经济。\n\n你可以问我类似这样的问题：\n• "解释一下牛顿第二定律"\n• "化学平衡的条件是什么"\n• "如何解二次方程"\n• "需求价格弹性是什么意思"\n\n试试点击下方的推荐问题吧！`,
        source: 'IGCSE 本地学习助手知识库'
    };
}

// ========== 学习分析 ==========
function getWeakTopicStats() {
    const topicStats = {};
    appData.quizRecords.forEach(record => {
        if (!record.questions || !record.answers) return;
        record.questions.forEach((q, i) => {
            if (!q || !q.topic || !Array.isArray(q.options) || !Number.isInteger(record.answers[i]) || record.answers[i] < 0 || record.answers[i] >= q.options.length) return;
            const subject = q.subject || '其他';
            const key = subject + '::' + q.topic;
            if (!topicStats[key]) {
                topicStats[key] = { subject, topic: q.topic, total: 0, correct: 0 };
            }
            topicStats[key].total++;
            if (record.answers[i] === q.answer) topicStats[key].correct++;
        });
    });

    return Object.values(topicStats)
        .map(stat => ({
            ...stat,
            accuracy: stat.total ? Math.round(stat.correct / stat.total * 100) : 0,
        }))
        .filter(stat => stat.total >= 5 && stat.accuracy < 60)
        .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total);
}

function getWeakTopics() {
    return [...new Set(getWeakTopicStats().map(stat => stat.topic))];
}

function renderRevisionHub(dueCount = getDueReviewCount(), wrongCount = getActiveMistakes().length) {
    const dueEl = document.getElementById('revision-due-count');
    const wrongEl = document.getElementById('revision-wrong-count');
    const weakEl = document.getElementById('revision-weak-count');
    const textEl = document.getElementById('revision-priority-text');
    const topicsEl = document.getElementById('revision-weak-topics');
    const startBtn = document.getElementById('revision-start-btn');
    if (!dueEl || !wrongEl || !weakEl || !textEl || !topicsEl || !startBtn) return;

    const weakStats = getWeakTopicStats();
    dueEl.textContent = dueCount;
    wrongEl.textContent = wrongCount;
    weakEl.textContent = weakStats.length;

    if (dueCount > 0) {
        textEl.innerHTML = `先完成 <strong>${dueCount}</strong> 道到期复习，优先巩固快要遗忘的内容。<span class="bi-en">Start with ${dueCount} due SRS item${dueCount === 1 ? '' : 's'} to reinforce memory before it fades.</span>`;
        startBtn.innerHTML = '开始到期复习 <span class="en-inline">Start SRS review</span>';
    } else if (wrongCount > 0) {
        textEl.innerHTML = `今天没有到期复习，建议先重做 <strong>${wrongCount}</strong> 道当前错题。<span class="bi-en">Nothing is due, so redo your ${wrongCount} current mistake${wrongCount === 1 ? '' : 's'} first.</span>`;
        startBtn.innerHTML = '开始错题重练 <span class="en-inline">Redo mistakes</span>';
    } else if (weakStats.length > 0) {
        const weakest = weakStats[0];
        textEl.innerHTML = `建议优先补强 <strong>${escapeHtml(weakest.subject)} · ${escapeHtml(weakest.topic)}</strong>（正确率 ${weakest.accuracy}%）。<span class="bi-en">Focus on your weakest topic first (${weakest.accuracy}% accuracy).</span>`;
        startBtn.innerHTML = '开始薄弱点专项 <span class="en-inline">Practise weak topic</span>';
    } else {
        textEl.innerHTML = '目前没有到期复习、错题或已识别的薄弱专题，适合完成一组 10 题常规练习。<span class="bi-en">No urgent review items found. A 10-question mixed practice set is a good next step.</span>';
        startBtn.innerHTML = '开始 10 题练习 <span class="en-inline">Start 10 questions</span>';
    }

    if (weakStats.length === 0) {
        topicsEl.innerHTML = '<span class="revision-weak-empty">每个科目专题至少完成 5 次作答、正确率低于 60% 才标记为薄弱 <span class="en-inline">Weak: at least 5 attempts per subject/topic and below 60% accuracy.</span></span>';
    } else {
        topicsEl.innerHTML = weakStats.slice(0, 3).map(stat =>
            `<span class="revision-weak-chip">${escapeHtml(stat.subject)} · ${escapeHtml(stat.topic)} · ${stat.total} 次 attempts · ${stat.accuracy}%</span>`
        ).join('');
    }
}

function startWeakTopicPractice() {
    const weakStats = getWeakTopicStats();
    if (weakStats.length === 0) {
        showToast('需要更多练习数据后才能识别薄弱专题');
        navigateTo('quiz');
        return;
    }

    const target = weakStats[0];
    navigateTo('quiz');
    resetQuizScope();
    const subjectSelect = document.getElementById('quiz-subject');
    const topicSelect = document.getElementById('quiz-topic');
    if (subjectSelect && [...subjectSelect.options].some(option => option.value === target.subject)) {
        subjectSelect.value = target.subject;
        updateQuizTopics();
    }
    if (topicSelect && [...topicSelect.options].some(option => option.value === target.topic)) {
        topicSelect.value = target.topic;
    }
    startQuiz('random', target.topic);
}

function startPriorityRevision() {
    const dueCount = getDueReviewCount();
    if (dueCount > 0) {
        startReviewSession();
        return;
    }
    if (getActiveMistakes().length > 0) {
        startWrongQuiz();
        return;
    }
    if (getWeakTopicStats().length > 0) {
        startWeakTopicPractice();
        return;
    }

    navigateTo('quiz');
    const subjectSelect = document.getElementById('quiz-subject');
    const difficultySelect = document.getElementById('quiz-difficulty');
    const countSelect = document.getElementById('quiz-count');
    const hotOnly = document.getElementById('quiz-hot-only');
    if (subjectSelect) subjectSelect.value = 'all';
    updateQuizTopics(false);
    if (difficultySelect) difficultySelect.value = 'all';
    if (countSelect) countSelect.value = '10';
    if (hotOnly) hotOnly.checked = false;
    startQuiz('random');
}

function renderAnalytics() {
    renderTrendChart();
    renderRadarChart();
    renderDifficultyChart();
    renderWeakTopics();
}

function renderTrendChart() {
    const canvas = document.getElementById('trend-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, W, H);

    // 最近7天
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const day = new Date();
        day.setDate(day.getDate() - i);
        const d = formatLocalDate(day);
        days.push({ date: d, count: appData.dailyStats[d]?.questions || 0 });
    }
    const max = Math.max(...days.map(d => d.count), 5);
    const padL = 40, padB = 30, padT = 20;
    const chartW = W - padL - 20, chartH = H - padB - padT;

    // 网格
    ctx.strokeStyle = '#e0e6ed';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padT + chartH * i / 4;
        ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - 20, y); ctx.stroke();
        ctx.fillStyle = '#7f8c8d'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
        ctx.fillText(Math.round(max * (4 - i) / 4), padL - 6, y + 3);
    }

    // 折线
    ctx.strokeStyle = '#2980b9';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    days.forEach((d, i) => {
        const x = padL + chartW * i / 6;
        const y = padT + chartH * (1 - d.count / max);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 渐变填充
    const grad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
    grad.addColorStop(0, 'rgba(41,128,185,0.3)');
    grad.addColorStop(1, 'rgba(41,128,185,0)');
    ctx.fillStyle = grad;
    ctx.lineTo(padL + chartW, padT + chartH);
    ctx.lineTo(padL, padT + chartH);
    ctx.closePath();
    ctx.fill();

    // 数据点和标签
    days.forEach((d, i) => {
        const x = padL + chartW * i / 6;
        const y = padT + chartH * (1 - d.count / max);
        ctx.fillStyle = '#2980b9';
        ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#7f8c8d'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(d.date.substring(5), x, H - 10);
    });
}

function renderRadarChart() {
    const canvas = document.getElementById('radar-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, W, H);

    const subjects = [...new Set(QUESTION_BANK.map(q => q.subject))];
    const cx = W / 2, cy = H / 2, radius = Math.min(W, H) / 2 - 40;
    const n = subjects.length;

    // 网格
    ctx.strokeStyle = '#e0e6ed';
    ctx.lineWidth = 1;
    for (let level = 1; level <= 4; level++) {
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
            const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
            const r = radius * level / 4;
            const x = cx + r * Math.cos(angle), y = cy + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    // 轴线
    for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
        ctx.stroke();
    }

    // 数据
    const data = subjects.map(s => {
        const qs = QUESTION_BANK.filter(q => q.subject === s);
        const correct = qs.filter(q => !appData.wrongQuestions.find(w => w.id === q.id)).length;
        return Math.max(0.3, correct / qs.length);
    });

    ctx.fillStyle = 'rgba(41,128,185,0.3)';
    ctx.strokeStyle = '#2980b9';
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((v, i) => {
        const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
        const r = radius * v;
        const x = cx + r * Math.cos(angle), y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 标签
    ctx.fillStyle = '#2c3e50';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    subjects.forEach((s, i) => {
        const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
        const x = cx + (radius + 20) * Math.cos(angle);
        const y = cy + (radius + 20) * Math.sin(angle);
        ctx.fillText(s, x, y + 4);
    });
}

function renderDifficultyChart() {
    const canvas = document.getElementById('difficulty-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, W, H);

    const diffs = ['简单', '中等', '困难'];
    const diffKeys = ['easy', 'medium', 'hard'];
    const colors = ['#27ae60', '#f39c12', '#e74c3c'];
    const data = diffKeys.map(k => {
        const qs = QUESTION_BANK.filter(q => q.difficulty === k);
        const wrong = qs.filter(q => appData.wrongQuestions.find(w => w.id === q.id)).length;
        return qs.length > 0 ? Math.round((1 - wrong / qs.length) * 100) : 0;
    });

    const barW = W / 3 * 0.4;
    const gap = W / 3;
    const maxH = H - 50;

    diffs.forEach((d, i) => {
        const h = (data[i] / 100) * maxH;
        const x = i * gap + (gap - barW) / 2;
        const y = H - h - 30;
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.roundRect(x, y, barW, h, [4, 4, 0, 0]);
        ctx.fill();
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(data[i] + '%', x + barW / 2, y - 8);
        ctx.fillStyle = '#7f8c8d';
        ctx.font = '12px sans-serif';
        ctx.fillText(d, x + barW / 2, H - 10);
    });
}

function renderWeakTopics() {
    const weak = getWeakTopicStats().slice(0, 6);

    const el = document.getElementById('weak-topics');
    if (weak.length === 0 || appData.quizRecords.length === 0) {
        el.innerHTML = '<div class="empty-state">数据不足，多做一些题再来看看</div>';
        return;
    }
    el.innerHTML = weak.map(w => `
        <div class="weak-topic-item">
            <span class="wt-name">${escapeHtml(w.subject)} · ${escapeHtml(w.topic)} · ${w.total} 次 attempts</span>
            <div class="wt-bar"><div class="wt-fill" style="width:${100 - w.accuracy}%"></div></div>
            <span class="wt-rate">${w.accuracy}%</span>
        </div>
    `).join('');
}

// ========== 成员管理 ==========
// ========== 成员身份与学习档案 ==========
const ROLE_LABELS = { owner: '所有者 Owner', collab: '协作者 Collaborator', guest: '只读访客 Guest' };
const ROLE_DESC = {
    owner: '可管理成员、资料与全部设置 Can manage members, materials and all settings',
    collab: '可刷题、上传资料与共同复习 Can practise, upload and revise together',
    guest: '仅可浏览与练习 Read-only browsing and practice',
};
const AVATAR_COLORS = ['#e74c3c', '#2980b9', '#27ae60', '#f39c12', '#9b59b6', '#16a085', '#34495e', '#d35400'];

// 成员唯一标识：注册用户用邮箱，访客用「访客 + 昵称」
function memberIdOf(user) {
    if (!user) return 'anonymous';
    if (user.role === 'guest') return 'guest:' + (user.name || '访客');
    return (user.email && user.email.trim()) || user.name || 'anonymous';
}

function isOwner() { return !!currentUser && currentUser.role === 'owner'; }

// ========== 页面访问权限 ==========
// 访客账户不可访问成员管理：只有所有者与协作者可以进入
const PAGE_ACCESS = {
    members: ['owner', 'collab'],
};
const PAGE_ACCESS_TIP = {
    members: '成员管理仅所有者与协作者可访问，访客请先注册或登录账号。',
};

function currentRole() { return currentUser ? (currentUser.role || 'guest') : 'guest'; }

function canAccessPage(page) {
    const allowed = PAGE_ACCESS[page];
    if (!allowed) return true;
    return allowed.includes(currentRole());
}

function accessDeniedHtml(page) {
    const tip = PAGE_ACCESS_TIP[page] || '当前身份无权访问该页面。';
    return `<div class="access-denied">
        <span class="access-denied-icon">🔒</span>
        <h4>无权访问<span class="bi-en">Access denied</span></h4>
        <p>${tip}<span class="bi-en">This page is for owners and collaborators only — guests need to register or log in first.</span></p>
    </div>`;
}

// 按当前身份隐藏无权访问的导航项（访客看不到「成员管理」）
function applyRolePermissions() {
    document.querySelectorAll('.nav-item').forEach(item => {
        const ok = canAccessPage(item.dataset.page);
        item.classList.toggle('hidden', !ok);
        if (!ok) {
            item.setAttribute('aria-disabled', 'true');
            item.title = '当前身份无权访问 Not available for your role';
        } else {
            item.removeAttribute('aria-disabled');
            item.removeAttribute('title');
        }
    });
    const denied = document.getElementById('page-members');
    if (denied && !canAccessPage('members')) denied.classList.remove('active');
}

// 登录/注册/访客进入时登记该成员
function upsertMember(user) {
    if (!user) return null;
    const id = memberIdOf(user);
    const role = user.role || 'guest';
    const today = getTodayStr();
    let m = appData.members.find(x => x.id === id);
    if (!m) {
        m = {
            id,
            name: user.name || id,
            email: user.role === 'guest' ? '' : (user.email || ''),
            role,
            joinDate: today,
            lastActive: today,
            visits: 1,
            avatarColor: AVATAR_COLORS[appData.members.filter(x => !x.demo).length % AVATAR_COLORS.length],
            board: user.board || appData.settings.board,
        };
        appData.members.push(m);
    } else {
        m.name = user.name || m.name;
        m.role = role;
        if (user.email && user.role !== 'guest') m.email = user.email;
        if (user.board) m.board = user.board;
        m.lastActive = today;
        m.lastSeenAt = new Date().toISOString();
        m.visits = (m.visits || 0) + 1;
    }
    return m;
}

// 汇总某位成员在指定范围（某天 / 全部）内的学习数据
function memberAggregate(id, date) {
    const s = appData.memberStats[id];
    if (!s || !s.days) return { questions: 0, correct: 0, seconds: 0, accuracy: 0, days: 0 };
    const days = date ? (s.days[date] ? [s.days[date]] : []) : Object.values(s.days);
    let questions = 0, correct = 0, seconds = 0;
    days.forEach(d => { questions += d.questions || 0; correct += d.correct || 0; seconds += d.seconds || 0; });
    return { questions, correct, seconds, accuracy: questions ? Math.round(correct / questions * 100) : 0, days: days.length };
}

// 记录一次练习：题量、正确数、用时（秒）
function recordMemberStudy(questions, correct, seconds) {
    if (!currentUser) return;
    const id = memberIdOf(currentUser);
    const s = appData.memberStats[id] || (appData.memberStats[id] = { days: {}, sessions: 0 });
    const d = getTodayStr();
    s.days[d] = s.days[d] || { questions: 0, correct: 0, seconds: 0 };
    s.days[d].questions += questions;
    s.days[d].correct += correct;
    s.days[d].seconds += seconds;
    s.sessions = (s.sessions || 0) + 1;
    s.lastActiveISO = new Date().toISOString();
    const m = upsertMember(currentUser);
    if (m) m.lastActive = d;
}

function formatShortTime(seconds) {
    const s = Math.max(0, Math.round(seconds || 0));
    if (s < 60) return `${s}s`;
    const h = Math.floor(s / 3600);
    const m = Math.round((s % 3600) / 60);
    return h > 0 ? `${h}h${m}m` : `${m}m`;
}

// ========== 成员列表 ==========
function renderAccessDenied(page) {
    const el = document.getElementById('page-' + page);
    if (!el) return;
    const holder = el.querySelector('.members-list-section') || el;
    const list = document.getElementById('members-list');
    if (list) list.innerHTML = accessDeniedHtml(page);
    const counter = document.getElementById('members-counts');
    if (counter) counter.innerHTML = '';
    const tip = document.getElementById('members-tip');
    if (tip) tip.innerHTML = '';
    refreshKeywords(holder);
}

function renderMembers() {
    const list = document.getElementById('members-list');
    if (!canAccessPage('members')) { renderAccessDenied('members'); return; }
    const owner = isOwner();
    const real = appData.members.filter(m => !m.demo);
    const demo = appData.members.filter(m => m.demo);
    const today = getTodayStr();

    const counts = { owner: 0, collab: 0, guest: 0 };
    real.forEach(m => { counts[m.role] = (counts[m.role] || 0) + 1; });
    const counter = document.getElementById('members-counts');
    if (counter) {
        counter.innerHTML = `
            <div class="lb-stat"><span class="lb-stat-value">${real.length}</span><span class="lb-stat-label">实际成员 Members</span></div>
            <div class="lb-stat"><span class="lb-stat-value">${counts.owner || 0}</span><span class="lb-stat-label">所有者 Owners</span></div>
            <div class="lb-stat"><span class="lb-stat-value">${counts.collab || 0}</span><span class="lb-stat-label">协作者 Collaborators</span></div>
            <div class="lb-stat"><span class="lb-stat-value">${counts.guest || 0}</span><span class="lb-stat-label">访客 Guests</span></div>
        `;
    }
    const tip = document.getElementById('members-tip');
    if (tip) {
        tip.innerHTML = owner
            ? '你是所有者，可以看到每位成员的身份、邮箱与学习情况。<span class="bi-en">You are the owner, so you can see every member role, email and study activity.</span>'
            : '为了保护隐私，邮箱等详细信息仅所有者可见；你仍可看到成员的身份与学习数据。<span class="bi-en">For privacy, contact details are visible to the owner only, but roles and study data are shown to everyone.</span>';
    }

    const rowHtml = m => {
        const agg = memberAggregate(m.id, null);
        const todayAgg = memberAggregate(m.id, today);
        const lastText = m.lastActive === today ? '今天 Today' : (m.lastActive || '从未 Never');
        return `
        <div class="member-item ${m.demo ? 'member-demo' : ''}">
            <div class="member-avatar" style="background:${m.avatarColor}">${escapeHtml(m.name.charAt(0))}</div>
            <div class="member-info">
                <div class="member-name">${escapeHtml(m.name)}${m.demo ? '<em class="lb-me-tag">示例 Demo</em>' : ''}</div>
                <div class="member-meta">
                    加入于 Joined ${escapeHtml(m.joinDate)} · 最后访问 Last seen ${escapeHtml(lastText)} · 访问 ${m.visits || 0} 次 visits
                </div>
                <div class="member-meta">${ROLE_DESC[m.role] || ''}</div>
                ${owner && m.email ? `<div class="member-meta member-email">📧 ${escapeHtml(m.email)}</div>` : ''}
            </div>
            <div class="member-stats">
                <span><b>${formatShortTime(agg.seconds)}</b>总时长 Total</span>
                <span><b>${agg.questions}</b>总题量 Questions</span>
                <span><b>${agg.accuracy}%</b>正确率 Accuracy</span>
                <span><b>${formatShortTime(todayAgg.seconds)}</b>今日 Today</span>
            </div>
            <span class="member-role-badge role-${m.role}">${ROLE_LABELS[m.role] || m.role}</span>
        </div>`;
    };

    list.innerHTML = real.length
        ? real.map(rowHtml).join('') + (demo.length ? `<p class="page-desc" style="margin-top:12px">以下为内置示例成员，未在本机登录过。<span class="bi-en">Built-in demo members that have never signed in on this device.</span></p>` + demo.map(rowHtml).join('') : '')
        : '<div class="empty-state">还没有成员登录记录。把邀请链接或访问密码分享给好友，他们登录后会出现在这里。<span class="bi-en">No sign-ins yet. Share the invite link or access code — members appear here once they log in.</span></div>';
    refreshKeywords(list);
}

function copyInviteLink() {
    const input = document.getElementById('invite-link');
    input.select();
    document.execCommand('copy');
    showToast('邀请链接已复制到剪贴板');
}

function regenerateCode() {
    const code = 'IGCSE' + Math.random().toString(36).substring(2, 6).toUpperCase();
    document.getElementById('access-code').value = code;
    showToast('新访问密码已生成');
}

// ========== 设置 ==========
function loadSettingsForm() {
    document.getElementById('setting-sitename').value = appData.settings.siteName;
    document.getElementById('setting-board').value = appData.settings.board;
    document.getElementById('setting-exam-date').value = appData.settings.examDate;
    document.getElementById('setting-darkmode').checked = appData.settings.darkMode;
    document.getElementById('setting-reminder').checked = appData.settings.reminder;
    document.getElementById('setting-remind-time').value = appData.settings.remindTime;
    const kwSwitch = document.getElementById('setting-keywords');
    if (kwSwitch) kwSwitch.checked = appData.settings.keywords !== false;
    applyKeywordSetting();
}

function applyKeywordSetting() {
    document.body.classList.toggle('no-kw', appData.settings.keywords === false);
}

function toggleKeywordMarks() {
    const enabled = document.getElementById('setting-keywords').checked;
    appData.settings.keywords = enabled;
    applyKeywordSetting();
    saveData(appData);
    showToast(enabled ? '已开启考点关键词高亮 Keyword highlighting on' : '已关闭考点关键词高亮 Keyword highlighting off');
}

function saveSettings() {
    appData.settings.siteName = document.getElementById('setting-sitename').value;
    appData.settings.board = document.getElementById('setting-board').value;
    appData.settings.examDate = document.getElementById('setting-exam-date').value;
    appData.settings.reminder = document.getElementById('setting-reminder').checked;
    appData.settings.remindTime = document.getElementById('setting-remind-time').value;
    const kwSwitch = document.getElementById('setting-keywords');
    if (kwSwitch) appData.settings.keywords = kwSwitch.checked;
    saveData(appData);
    document.getElementById('user-board').textContent = appData.settings.board.toUpperCase();
    updateCountdown();
    showToast('设置已保存');
}

function toggleDarkMode() {
    const enabled = document.getElementById('setting-darkmode').checked;
    appData.settings.darkMode = enabled;
    document.body.classList.toggle('dark-mode', enabled);
    saveData(appData);
}

function checkDailyReminder() {
    if (!currentUser || !appData.settings.reminder || !appData.settings.remindTime) return;
    const now = new Date();
    const currentTime = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    const today = getTodayStr();
    if (currentTime < appData.settings.remindTime || appData.settings.lastReminderDate === today) return;
    appData.settings.lastReminderDate = today;
    saveData(appData);
    showToast('🔔 到复习时间了！Time for your daily revision.', 5000);
}

function showReminderStatus() {
    if (!appData.settings.reminder) {
        showToast('每日提醒当前已关闭 Daily reminder is off');
        return;
    }
    showToast(`🔔 今日提醒：${appData.settings.remindTime}（仅网站打开时生效）`);
}

function exportData() {
    let exportPayload;
    try { exportPayload = buildBackupPayload(); }
    catch (error) { showToast('无法导出：' + error.message, 6000); return; }
    const dataStr = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'igcse-study-data-' + getTodayStr() + '.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    showToast('学习数据已安全导出（不含账号密码）');
}

function resetProgress() {
    if (confirm('确定要重置所有学习记录吗？这将清除做题记录、错题和复习数据，但保留上传的资料。\nReset all study records? This clears your practice records, mistakes and review data, but keeps uploaded materials.')) {
        appData.quizRecords = [];
        appData.wrongQuestions = [];
        appData.srsData = {};
        appData.dailyStats = {};
        appData.studyTime = 0;
        appData.streak = 0;
        appData.lastStudyDate = null;
        appData.memberStats = {};
        saveData(appData);
        showToast('学习记录已重置');
        renderDashboard();
    }
}

// ========== 学科分类板块 ==========
function renderSubjectCards() {
    const container = document.getElementById('subject-cards');
    if (!container) return;
    const subjects = orderedSubjects();
    const subjectInfo = {
        '数学': { icon: '📐', code: '0580', color: '#3498db' },
        '物理': { icon: '⚡', code: '0625', color: '#e74c3c' },
        '化学': { icon: '🧪', code: '0620', color: '#27ae60' },
        '生物': { icon: '🧬', code: '0610', color: '#16a085' },
        '经济': { icon: '📊', code: '0455', color: '#f39c12' },
        '英语': { icon: '📝', code: '0510', color: '#9b59b6' },
        'ICT': { icon: '💻', code: '0417', color: '#2980b9' },
        '计算机科学': { icon: '🖥️', code: '0478', color: '#34495e' },
    };
    container.innerHTML = subjects.map(s => {
        const info = subjectInfo[s] || { icon: '📚', code: '', color: '#7f8c8d' };
        const qCount = QUESTION_BANK.filter(q => q.subject === s).length;
        const hotCount = QUESTION_BANK.filter(q => q.subject === s && q.isHot).length;
        const mkCount = MUST_KNOW_POINTS.filter(m => m.subject === s).length;
        return `
            <div class="subject-card" style="border-left-color:${info.color}" onclick="filterBySubject('${s}')">
                <div class="sc-icon" style="background:${info.color}15">${info.icon}</div>
                <div class="sc-info">
                    <div class="sc-name">${s} <span class="sc-code">${info.code}</span></div>
                    <div class="sc-stats">
                        <span>${qCount} 题 Questions</span>
                        <span class="sc-hot">🔥${hotCount} 常考 Hot</span>
                        <span>⭐${mkCount} 必考点 Must-know</span>
                    </div>
                </div>
                <div class="sc-arrow">→</div>
            </div>
        `;
    }).join('');
}

function filterBySubject(subject) {
    document.getElementById('quiz-subject').value = subject;
    navigateTo('quiz');
}

// ========== 必考点模块 ==========
function renderMustKnow() {
    const subject = document.getElementById('mustknow-subject')?.value || 'all';
    let points = MUST_KNOW_POINTS;
    if (subject !== 'all') points = points.filter(p => p.subject === subject);

    document.getElementById('mk-total').textContent = MUST_KNOW_POINTS.length;
    document.getElementById('mk-hot').textContent = MUST_KNOW_POINTS.filter(p => p.frequency.includes('每年')).length;
    document.getElementById('mk-subjects').textContent = [...new Set(MUST_KNOW_POINTS.map(p => p.subject))].length;

    const list = document.getElementById('mustknow-list');
    if (points.length === 0) {
        list.innerHTML = '<div class="empty-state">该科目暂无必考点<span class="bi-en">No must-know points for this subject yet.</span></div>';
        return;
    }
    const subjectColors = {
        '数学': '#3498db', '物理': '#e74c3c', '化学': '#27ae60', '生物': '#16a085',
        '经济': '#f39c12', '英语': '#9b59b6', 'ICT': '#2980b9', '计算机科学': '#34495e',
    };
    list.innerHTML = points.map(p => {
        const color = subjectColors[p.subject] || '#7f8c8d';
        const isAnnual = p.frequency.includes('每年');
        return `
            <div class="mustknow-card" style="border-top:3px solid ${color}">
                <div class="mk-header">
                    <span class="mk-subject-badge" style="background:${color}">${p.subject} ${p.subjectCode}</span>
                    <span class="mk-frequency ${isAnnual ? 'annual' : ''}">${isAnnual ? '🔥 ' : ''}${p.frequency}</span>
                    <span class="mk-diff">${p.difficulty === 'easy' ? '🟢 简单 Easy' : p.difficulty === 'medium' ? '🟡 中等 Medium' : '🔴 困难 Hard'}</span>
                </div>
                <h4 class="mk-title">${p.title}</h4>
                <div class="mk-content">${p.content}</div>
                ${p.contentEn ? `<div class="mk-content-en">${escapeHtml(p.contentEn)}</div>` : ''}
                <div class="mk-actions">
                    <button class="btn btn-outline btn-sm" onclick="practiceMustKnow('${p.subject}')">✏️ 练相关题目 Practice</button>
                    <button class="btn btn-outline btn-sm" onclick="navigateTo('flashcards')">🃏 复习闪卡 Flashcards</button>
                </div>
            </div>
        `;
    }).join('');
    refreshKeywords(list);
}

function practiceMustKnow(subject) {
    document.getElementById('quiz-subject').value = subject;
    document.getElementById('quiz-hot-only').checked = true;
    navigateTo('quiz');
}

// ========== 重点复习单元模块 ==========
function renderKeyUnits() {
    const subject = document.getElementById('keyunits-subject')?.value || 'all';
    let units = KEY_UNITS;
    if (subject !== 'all') units = units.filter(u => u.subject === subject);

    const list = document.getElementById('keyunits-list');
    if (units.length === 0) {
        list.innerHTML = '<div class="empty-state">该科目暂无重点单元<span class="bi-en">No key units for this subject yet.</span></div>';
        return;
    }
    const subjectColors = {
        '数学': '#3498db', '物理': '#e74c3c', '化学': '#27ae60', '生物': '#16a085',
        '经济': '#f39c12', '英语': '#9b59b6', 'ICT': '#2980b9', '计算机科学': '#34495e',
    };
    list.innerHTML = units.map(u => {
        const color = subjectColors[u.subject] || '#7f8c8d';
        return `
            <div class="keyunit-card" style="border-left:4px solid ${color}">
                <div class="ku-header">
                    <div class="ku-title-row">
                        <span class="ku-subject" style="color:${color}">${u.subject} ${u.subjectCode}</span>
                        <h4 class="ku-title">${u.unit}${u.unitEn ? ' · ' + u.unitEn : ''}</h4>
                    </div>
                    <div class="ku-meta">
                        <span class="ku-importance">${u.importance}</span>
                        <span class="ku-weight">${u.focus ? "考纲见真题资源页" : u.weight}</span>
                    </div>
                </div>
                <div class="ku-body">
                    <div class="ku-section">
                        <span class="ku-section-title">📋 涵盖知识点 Topics (${u.topics.length})</span>
                        <div class="ku-topics">
                            ${u.topics.map(t => `<span class="ku-topic-tag">${t}</span>`).join('')}
                        </div>
                    </div>
                    <div class="ku-section">
                        <span class="ku-section-title">⭐ 核心要点 Key Points (${u.keyPoints.length})</span>
                        <ul class="ku-keypoints">
                            ${u.keyPoints.map(k => `<li>${k}</li>`).join('')}
                        </ul>
                        ${u.keyPointsEn ? `<div class="ku-keypoints-en">${escapeHtml(u.keyPointsEn.join('\n'))}</div>` : ''}
                    </div>
                </div>
                ${u.task ? `<p class="unit-task"><strong>动手练习 Try this：</strong>${u.task}</p>` : ''}
                ${u.taskEn ? `<p class="en-block" style="white-space:pre-line">${escapeHtml(u.taskEn)}</p>` : ''}
                <div class="ku-actions">
                    <button class="btn btn-primary btn-sm" onclick="practiceUnit('${u.subject}', '${u.id}')">✏️ 练习这个单元 Practise this unit</button>
                    <button class="btn btn-outline btn-sm" onclick="viewUnitMustKnow('${u.subject}')">⭐ 查看必考点 Must-know</button>
                </div>
            </div>
        `;
    }).join('');
    refreshKeywords(list);
}

function practiceUnit(subject, unitId) {
    const unit = KEY_UNITS.find(u => u.id === unitId);
    if (unit && unit.topic && !QUESTION_BANK.some(q => q.subject === subject && q.topic === unit.topic)) { navigateTo('pastpapers'); document.getElementById('pp-subject').value = subject; renderPastPapers(); showToast('该单元请使用官方听力、口语或实操资源练习'); return; }
    document.getElementById('quiz-subject').value = subject;
    document.getElementById('quiz-difficulty').value = 'all';
    document.getElementById('quiz-hot-only').checked = false;
    navigateTo('quiz');
    document.getElementById('quiz-topic').value = unit?.topic || 'all';
    startQuiz('random', unit?.topic || 'all');
}

function viewUnitMustKnow(subject) {
    document.getElementById('mustknow-subject').value = subject;
    navigateTo('mustknow');
}

// ========== 初始化 ==========
window.addEventListener('load', () => {
    // 检查是否有已登录用户
    if (appData.currentUser) {
        currentUser = appData.currentUser;
        enterApp();
    }

    // 回车键登录
    document.getElementById('login-password').addEventListener('keydown', e => {
        if (e.key === 'Enter') handleLogin();
    });

    // 上传文件：读取真实文件元数据，并支持拖放选择。
    const fileInput = document.getElementById('file-input');
    const uploadArea = document.getElementById('upload-area');
    if (fileInput) {
        fileInput.addEventListener('change', () => handleMaterialFileSelection(fileInput.files?.[0]));
    }
    if (uploadArea && fileInput) {
        ['dragenter', 'dragover'].forEach(type => uploadArea.addEventListener(type, event => {
            event.preventDefault();
            uploadArea.classList.add('dragging');
        }));
        ['dragleave', 'drop'].forEach(type => uploadArea.addEventListener(type, event => {
            event.preventDefault();
            uploadArea.classList.remove('dragging');
        }));
        uploadArea.addEventListener('drop', event => {
            const files = event.dataTransfer?.files;
            if (!files?.length) return;
            try {
                const transfer = new DataTransfer();
                transfer.items.add(files[0]);
                fileInput.files = transfer.files;
            } catch (e) {
                showToast('请点击上传区域选择文件 Please click to select the file');
                return;
            }
            handleMaterialFileSelection(fileInput.files[0]);
        });
    }

    checkDailyReminder();
    setInterval(checkDailyReminder, 60 * 1000);
});

// 窗口大小变化时重绘图表
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (currentPage === 'dashboard') renderSubjectChart();
        if (currentPage === 'analytics') renderAnalytics();
    }, 200);
});


function orderedSubjects() { return [...FOCUS_SUBJECTS, ...new Set(QUESTION_BANK.map(q=>q.subject))].filter((v,i,a)=>a.indexOf(v)===i); }
function getQuizScopeQuestions(topicOverride = null) {
    const subject = document.getElementById('quiz-subject').value;
    const topic = topicOverride ?? document.getElementById('quiz-topic').value;
    const difficulty = document.getElementById('quiz-difficulty').value;
    const hotOnly = document.getElementById('quiz-hot-only').checked;
    return QUESTION_BANK.filter(q =>
        (subject === 'all' || (subject === 'focus' ? q.focus : q.subject === subject)) &&
        (topic === 'all' || q.topic === topic) &&
        (difficulty === 'all' || q.difficulty === difficulty) &&
        (!hotOnly || q.isHot)
    );
}

function updateQuizScopeSummary() {
    const summary = document.getElementById('quiz-scope-summary');
    if (!summary) return;
    const subject = document.getElementById('quiz-subject').selectedOptions[0]?.textContent || '';
    const topic = document.getElementById('quiz-topic').selectedOptions[0]?.textContent || '';
    const available = getQuizScopeQuestions().length;
    summary.textContent = `${subject} · ${topic} · ${available} 道可选题 Questions available`;
}

function updateQuizTopics(preserveSelection = true) {
    const select = document.getElementById('quiz-topic');
    const subject = document.getElementById('quiz-subject').value;
    const previous = preserveSelection ? select.value : 'all';
    const groups = new Map();
    QUESTION_BANK.filter(q => subject === 'all' || (subject === 'focus' ? q.focus : q.subject === subject)).forEach(q => {
        const group = groups.get(q.topic) || { count: 0, english: q.topicEn || '' };
        group.count++;
        if (!group.english && q.topicEn) group.english = q.topicEn;
        groups.set(q.topic, group);
    });
    select.replaceChildren(new Option('全部专题 All topics', 'all'), ...[...groups].map(([topic, group]) => {
        const english = group.english || (typeof FOCUS_TOPIC_EN !== 'undefined' ? FOCUS_TOPIC_EN[topic] : '') || '';
        return new Option(`${topic}${english ? ' · ' + english : ''} (${group.count} 题)`, topic);
    }));
    if (groups.has(previous)) select.value = previous;
    updateQuizScopeSummary();
}
