const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = process.cwd();
(async () => {
    const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, headless: true });
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.route('https://igcse.test/**', route => {
            const url = new URL(route.request().url());
            const file = path.join(root, url.pathname === '/' ? 'index.html' : url.pathname);
            route.fulfill({ body: fs.readFileSync(file), contentType: file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html' });
        });
        await page.goto('https://igcse.test/');
        await page.locator('[data-tab="guest"]').click();
        await page.getByRole('button', { name: /以访客身份进入/ }).click();
        await page.waitForFunction(() => currentUser?.role === 'guest');
        assert.equal(await page.evaluate(() => QUESTION_BANK.length), 337);

        await page.evaluate(() => navigateTo('quiz'));
        await page.locator('#quiz-subject').selectOption('ICT');
        await page.locator('#quiz-topic').selectOption('电子表格');
        const spreadsheetCount = await page.evaluate(() => getQuizScopeQuestions().length);
        assert.ok(spreadsheetCount >= 8, `ICT spreadsheet topic should include legacy and new questions; found ${spreadsheetCount}`);
        assert.match(await page.locator('#quiz-scope-summary').textContent(), new RegExp(`${spreadsheetCount} 道可选题`));
        await page.locator('#quiz-subject').selectOption('focus');
        assert.ok(await page.evaluate(count => getQuizScopeQuestions().length >= count, spreadsheetCount));

        await page.evaluate(() => navigateTo('materials'));
        assert.equal(await page.locator('.material-card').count(), 48);
        await page.locator('#material-search').fill('trace table');
        assert.equal(await page.locator('.material-card').count(), 1);
        await page.locator('.material-card').getByRole('button', { name: /查看 View/ }).click();
        assert.match(await page.locator('#material-modal-content').innerText(), /Boundary|边界值/);
        await page.locator('#material-modal .modal-close').click();

        for (const width of [375, 390, 430, 768]) {
            await page.setViewportSize({ width, height: 900 });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `overflow at ${width}px`);
        }
        assert.deepEqual(errors, []);
        await context.close();
        console.log('Expanded bank topic filtering, built-in guide search/detail, mobile widths and runtime errors: passed');
    } finally {
        await browser.close();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
