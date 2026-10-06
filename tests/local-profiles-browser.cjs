const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = process.cwd();
const storageKey = 'igcse_study_platform';
const legacyOwner = email => `owner:${encodeURIComponent(email)}`;
async function openApp(browser, initialData = null, extraStorage = {}) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    if (initialData) await page.addInitScript(({ key, data, extra }) => {
        localStorage.setItem(key, JSON.stringify(data));
        for (const [storageKey, value] of Object.entries(extra)) localStorage.setItem(storageKey, JSON.stringify(value));
    }, { key: storageKey, data: initialData, extra: extraStorage });
    await page.route('https://igcse.test/**', route => {
        const url = new URL(route.request().url());
        const file = path.join(root, url.pathname === '/' ? 'index.html' : url.pathname);
        route.fulfill({ body: fs.readFileSync(file), contentType: file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html' });
    });
    await page.goto('https://igcse.test/');
    return { context, page, errors };
}

(async () => {
    const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, headless: true });
    try {
        const { context, page, errors } = await openApp(browser);
        assert.equal(await page.locator('#reg-email').count(), 0);
        assert.equal(await page.locator('#reg-invite-code').count(), 0);
        assert.equal(await page.locator('#guest-code').count(), 0);
        assert.equal(await page.locator('[data-page="members"]').count(), 0);
        assert.equal(await page.evaluate(() => { const ids = [...document.querySelectorAll('[id]')].map(element => element.id); return ids.length - new Set(ids).size; }), 0);
        for (const width of [375, 390, 430, 768]) {
            await page.setViewportSize({ width, height: 900 });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `login overflow at ${width}px`);
            for (const tab of ['register', 'guest']) {
                await page.locator(`[data-tab="${tab}"]`).click();
                assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${tab} overflow at ${width}px`);
            }
            await page.locator('[data-tab="login"]').click();
        }
        await page.setViewportSize({ width: 1280, height: 900 });

        await page.locator('[data-tab="guest"]').click();
        await page.locator('#guest-name').fill('访客甲');
        await page.getByRole('button', { name: /以访客身份进入/ }).click();
        await page.waitForFunction(() => currentUser?.id === 'guest');
        await page.evaluate(() => { appData.wrongQuestions = [{ id: 'guest-mistake' }]; saveData(appData); });
        await page.locator('.logout-btn').click();

        await page.locator('[data-tab="register"]').click();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'registration should fit at the current mobile width');
        await page.locator('#reg-username').fill('Alice');
        await page.locator('#reg-password').fill('alice-local');
        await page.locator('#reg-board').selectOption('edexcel');
        await page.getByRole('button', { name: /注 册/ }).click();
        await page.waitForFunction(() => currentUser?.username === 'Alice');
        assert.equal(await page.evaluate(() => appData.wrongQuestions.length), 0);
        await page.evaluate(() => {
            appData.wrongQuestions = [{ id: 'alice-mistake' }];
            appData.srsData = { 'alice-card': { interval: 1 } };
            appData.quizDrafts[quizOwnerKey()] = { id: 'alice-draft' };
            localStorage.setItem(typingStorageKey(), JSON.stringify({ words: { 'alice-word': { attempts: 1, correct: 0, wrong: true } }, session: null }));
            saveData(appData);
        });
        await page.locator('.logout-btn').click();

        await page.locator('[data-tab="register"]').click();
        await page.locator('#reg-username').fill('Bob');
        await page.locator('#reg-password').fill('bob-local');
        await page.getByRole('button', { name: /注 册/ }).click();
        await page.waitForFunction(() => currentUser?.username === 'Bob');
        assert.equal(await page.evaluate(() => appData.wrongQuestions.length), 0);
        await page.evaluate(() => navigateTo('typing'));
        assert.deepEqual(await page.evaluate(() => Object.keys(typingData.words)), []);
        await page.evaluate(() => { typingData.words = { 'bob-word': { attempts: 1, correct: 1, wrong: false } }; saveTyping(); navigateTo('dashboard'); });
        await page.evaluate(() => { appData.wrongQuestions = [{ id: 'bob-mistake' }]; saveData(appData); });
        await page.locator('.logout-btn').click();

        await page.locator('[data-tab="login"]').click();
        await page.locator('#login-username').fill('Alice');
        await page.locator('#login-password').fill('alice-local');
        await page.getByRole('button', { name: /登 录/ }).click();
        await page.waitForFunction(() => currentUser?.username === 'Alice');
        assert.deepEqual(await page.evaluate(() => appData.wrongQuestions.map(row => row.id)), ['alice-mistake']);
        assert.equal(await page.evaluate(() => getQuizDraft().id), 'alice-draft');
        assert.equal(await page.evaluate(() => appData.settings.board), 'edexcel');
        await page.evaluate(() => navigateTo('typing'));
        assert.deepEqual(await page.evaluate(() => Object.keys(typingData.words)), ['alice-word']);
        assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('igcse_study_platform')).users.some(user => user.email === '')), false);

        // Simulate an older tab for Alice saving after Bob has already saved in another tab.
        const staleAliceRoot = await page.evaluate(() => JSON.parse(localStorage.getItem('igcse_study_platform')));
        const aliceId = await page.evaluate(() => currentUser.id);
        await page.locator('.logout-btn').click();
        await page.locator('[data-tab="login"]').click();
        await page.locator('#login-username').fill('Bob');
        await page.locator('#login-password').fill('bob-local');
        await page.getByRole('button', { name: /登 录/ }).click();
        await page.waitForFunction(() => currentUser?.username === 'Bob');
        const bobId = await page.evaluate(() => currentUser.id);
        await page.evaluate(() => { appData.wrongQuestions.push({ id: 'bob-latest' }); saveData(appData); });
        await page.evaluate(({ stale, aliceId }) => {
            appData = stale;
            currentUser = appData.users.find(user => user.id === aliceId);
            appData.wrongQuestions.push({ id: 'alice-latest' });
            saveData(appData);
        }, { stale: staleAliceRoot, aliceId });
        assert.deepEqual(
            await page.evaluate(id => JSON.parse(localStorage.getItem('igcse_study_platform')).profiles[id].wrongQuestions.map(row => row.id), bobId),
            ['bob-mistake', 'bob-latest'],
            'a stale tab save must retain another profile’s latest progress',
        );
        await page.locator('.logout-btn').click();
        await page.locator('[data-tab="login"]').click();
        await page.locator('#login-username').fill('Bob');
        await page.locator('#login-password').fill('bob-local');
        await page.getByRole('button', { name: /登 录/ }).click();
        await page.waitForFunction(() => currentUser?.username === 'Bob');
        assert.deepEqual(await page.evaluate(() => appData.wrongQuestions.map(row => row.id)), ['bob-mistake', 'bob-latest']);
        await page.locator('.logout-btn').click();
        await page.locator('[data-tab="guest"]').click();
        await page.locator('#guest-name').fill('另一个访客名');
        await page.getByRole('button', { name: /以访客身份进入/ }).click();
        await page.waitForFunction(() => currentUser?.id === 'guest');
        assert.deepEqual(await page.evaluate(() => appData.wrongQuestions.map(row => row.id)), ['guest-mistake']);
        assert.deepEqual(errors, []);
        await context.close();

        const legacyEmail = 'old@example.test';
        const legacyData = {
            users: [{ email: legacyEmail, password: 'old-pass', name: 'Old student', board: 'edexcel', role: 'owner' }],
            currentUser: { email: legacyEmail, password: 'old-pass', name: 'Old student', board: 'edexcel', role: 'owner' },
            quizRecords: [{ id: 'old-session', questions: [], answers: [], date: '2026-10-01', time: 50 }],
            quizDrafts: { [legacyOwner(legacyEmail)]: { id: 'old-draft', savedAt: '2026-10-01T10:00:00Z' } },
            wrongQuestions: [{ id: 'old-mistake' }], srsData: { 'old-card': { interval: 2 } },
            flashcards: [], materials: [{ id: 'user-material', name: 'Own notes', type: 'notes', subject: '数学', tags: [] }], settings: { board: 'edexcel', keywords: false }, dailyStats: {},
            studyTime: 50, streak: 2, lastStudyDate: '2026-10-01', commandWordProgress: { [legacyOwner(legacyEmail)]: { explain: { attempts: 3 } } },
            members: [{ id: 'keep-member-history' }], memberStats: { keep: { days: {} } },
        };
        const oldTyping = { words: { 'ict:network': { attempts: 4, correct: 2, wrong: true } }, session: null };
        const legacy = await openApp(browser, legacyData, { [`igcse_typing_v1:${encodeURIComponent(legacyEmail)}`]: oldTyping });
        await legacy.page.waitForFunction(() => currentUser?.username === 'old@example.test');
        const migrated = await legacy.page.evaluate(() => JSON.parse(localStorage.getItem('igcse_study_platform')));
        const legacyProfileId = `user:${legacyEmail}`;
        assert.equal(migrated.profilesMigrated, true);
        assert.equal(migrated.currentUser.id, legacyProfileId);
        assert.deepEqual(migrated.wrongQuestions.map(row => row.id), ['old-mistake']);
        assert.equal(migrated.commandWordProgress[`owner:${encodeURIComponent(legacyProfileId)}`].explain.attempts, 3);
        assert.equal(migrated.quizDrafts[`owner:${encodeURIComponent(legacyProfileId)}`].id, 'old-draft');
        assert.equal(migrated.members[0].id, 'keep-member-history');
        assert.ok(migrated.materials.some(material => material.id === 'guide-0580-worked'), 'existing profiles receive newly added built-in guides');
        assert.ok(migrated.materials.some(material => material.id === 'user-material'), 'profile upgrades retain user material metadata');
        assert.deepEqual(await legacy.page.evaluate(id => JSON.parse(localStorage.getItem(`igcse_typing_v1:${encodeURIComponent(id)}`)), legacyProfileId), oldTyping);
        await legacy.context.close();

        const accountA = { email: 'a@example.test', password: 'a', name: 'A', board: 'cie' };
        const accountB = { email: 'b@example.test', password: 'b', name: 'B', board: 'cie' };
        const ambiguousData = { users: [accountA, accountB], currentUser: null, quizRecords: [], quizDrafts: {}, wrongQuestions: [{ id: 'choose-me' }], srsData: {}, flashcards: [], materials: [], settings: { board: 'cie' }, dailyStats: {}, studyTime: 0, streak: 0, lastStudyDate: null };
        const ambiguous = await openApp(browser, ambiguousData);
        await ambiguous.page.locator('#login-username').fill('a@example.test');
        await ambiguous.page.locator('#login-password').fill('a');
        await ambiguous.page.getByRole('button', { name: /登 录/ }).click();
        await ambiguous.page.locator('#legacy-migration').waitFor({ state: 'visible' });
        const targetId = `user:${accountB.email}`;
        await ambiguous.page.locator('#legacy-migration-profile').selectOption(targetId);
        await ambiguous.page.getByRole('button', { name: /迁移并继续/ }).click();
        await ambiguous.page.waitForFunction(() => currentUser?.username === 'a@example.test');
        assert.equal(await ambiguous.page.evaluate(id => appData.profiles[id].wrongQuestions[0].id, targetId), 'choose-me');
        assert.equal(await ambiguous.page.evaluate(() => appData.wrongQuestions.length), 0);
        await ambiguous.context.close();

        const quotaData = { ...legacyData, currentUser: null };
        const quota = await openApp(browser, quotaData);
        const before = await quota.page.evaluate(() => localStorage.getItem('igcse_study_platform'));
        await quota.page.evaluate(() => {
            const original = Storage.prototype.setItem;
            Storage.prototype.setItem = function (key, value) { if (key === 'igcse_study_platform') throw new DOMException('Quota exceeded', 'QuotaExceededError'); return original.call(this, key, value); };
        });
        await quota.page.locator('#login-username').fill(legacyEmail);
        await quota.page.locator('#login-password').fill('old-pass');
        await quota.page.getByRole('button', { name: /登 录/ }).click();
        await quota.page.waitForFunction(() => document.getElementById('toast').textContent.includes('旧进度未迁移'));
        assert.equal(await quota.page.evaluate(() => localStorage.getItem('igcse_study_platform')), before, 'migration failure retains the source data');
        await quota.context.close();

        console.log('Local guest access, username registration, profile isolation, stale-tab profile merge, legacy state/typing migration, ambiguous migration choice and quota rollback: passed');
    } finally {
        await browser.close();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
