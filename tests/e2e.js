const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const url = 'file://' + path.resolve(process.argv[2], 'index.html');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  let posts = []; await ctx.route('**/docs.google.com/**', r => { posts.push(r.request().postData() || ''); r.fulfill({ status: 200, body: '' }); });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  const checks = []; const ok = (name, cond) => checks.push([cond ? 'PASS' : 'FAIL', name]);
  await p.goto(url);
  ok('home shows 6 topics', await p.locator('[data-topic]').count() === 6);
  ok('no horizontal scroll on phone', await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  await p.screenshot({ path: 'shot-home-phone.png' });
  await p.click('[data-topic="stackq"]');
  const Q = await p.evaluate(() => window.TF_QUESTIONS);
  let qn = 0, plan = ['right', 'wrong1', 'wrong2', 'wrong3', 'right'];
  async function currentQ() { const t = await p.locator('.qtext').innerText(); return Q.find(q => q.q === t); }
  async function pick(i) { await p.locator(`.opt[data-i="${i}"] input`).check(); }
  for (const mode of plan) {
    const q = await currentQ(); qn++;
    ok(`q${qn}: commit disabled before answer`, await p.locator('#commit').isDisabled());
    ok(`q${qn}: hint hidden before commit`, await p.locator('#hintBtn').isHidden());
    ok(`q${qn}: solution hidden before commit`, await p.locator('#giveBtn').isHidden());
    const wrongs = [0, 1, 2, 3].filter(i => i !== q.answer);
    await pick(mode === 'right' ? q.answer : wrongs[0]);
    ok(`q${qn}: still disabled without confidence`, await p.locator('#commit').isDisabled());
    await p.locator('#conf label').first().click();
    await p.click('#commit');
    if (mode === 'right') { ok(`q${qn}: correct shown`, await p.locator('.note.good').count() === 1); }
    else {
      ok(`q${qn}: hint1 unlocked after 1 wrong`, await p.locator('#hintBtn').isVisible() && (await p.locator('#hintBtn').innerText()) === 'Show hint 1');
      ok(`q${qn}: solution still locked after 1 wrong`, await p.locator('#giveBtn').isHidden());
      ok(`q${qn}: tried option disabled`, await p.locator(`.opt[data-i="${wrongs[0]}"] input`).isDisabled());
      await p.click('#hintBtn');
      ok(`q${qn}: hint2 locked until another try`, await p.locator('#hintBtn').isHidden());
      if (qn === 2) await p.screenshot({ path: 'shot-question-phone.png', fullPage: true });
      if (mode === 'wrong1') { await pick(q.answer); await p.click('#commit'); ok(`q${qn}: solved after hint`, await p.locator('.note.good').count() === 1); }
      else {
        await pick(wrongs[1]); await p.click('#commit');
        ok(`q${qn}: hint2 + solution unlocked after 2 wrong`, await p.locator('#hintBtn').isVisible() && await p.locator('#giveBtn').isVisible());
        if (mode === 'wrong2') { await p.click('#giveBtn'); }
        else { await pick(wrongs[2]); await p.click('#commit'); }
        ok(`q${qn}: solution shown`, await p.locator('.note.why').count() === 1);
      }
    }
    await p.click('#next');
  }
  // second chance: 3 missed questions
  ok('second chance started', (await p.locator('.qmeta').innerText()).includes('second chance'));
  for (let i = 0; i < 3; i++) {
    const q = await currentQ();
    ok(`second ${i + 1}: no confidence asked`, await p.locator('#conf').count() === 0);
    await pick(i === 0 ? [0, 1, 2, 3].find(x => x !== q.answer) : q.answer);
    await p.click('#commit'); await p.click('#next');
  }
  ok('summary shown', (await p.locator('h1').innerText()).includes('done'));
  const stats = await p.locator('.stat b').allInnerTexts();
  ok('summary numbers 2/5, 1, 2, 2/3: ' + stats.join(' | '), stats.join('|') === '2/5|1|2|2/3');
  await p.screenshot({ path: 'shot-summary-phone.png', fullPage: true });
  const rec = await p.evaluate(() => JSON.parse(localStorage.getItem('thinkfirst.v1')));
  const rows = Object.values(rec.r);
  ok('5 records stored', rows.length === 5);
  ok('records: 2 first-try, 2 shown, 3 retried, 2 recovered', rows.filter(r => r.f).length === 2 && rows.filter(r => r.v).length === 2 && rows.filter(r => r.x >= 0).length === 3 && rows.filter(r => r.x === 1).length === 2);
  ok('quick guesses flagged (automation answers instantly)', rows.every(r => r.g === 1));
  // reload keeps data; report
  await p.reload(); await p.click('nav [data-nav="report"]');
  const rs = await p.locator('.stat b').allInnerTexts();
  ok('report stats: ' + rs.join(' | '), rs[0] === '60%' && rs[1] === '40%' && rs[3] === '67%');
  const code = await p.locator('#code').innerText();
  ok('results code generated', code.startsWith('TF1.'));
  // teacher view on desktop with 2 students (same data, different ids)
  const d = await ctx.newPage(); await d.setViewportSize({ width: 1200, height: 900 });
  await d.goto(url); await d.click('nav [data-nav="teacher"]');
  const code2 = await p.evaluate(() => { const o = JSON.parse(atob(makeCode().slice(4))); o.id = 'other'; return 'TF1.' + btoa(JSON.stringify(o)); });
  await d.fill('#codes', 'from whatsapp: ' + code + '\nand ' + code2 + ' thanks ' + code + ' TF1.garbage!!');
  await d.click('#add');
  const h = await d.locator('#out h2').first().innerText();
  ok('teacher aggregates 2 students, duplicates and junk ignored: ' + h, h.includes('2 students') && h.includes('10 first attempts'));
  ok('teacher table has 5 question rows', await d.locator('#out tbody tr').count() === 5);
  await d.screenshot({ path: 'shot-teacher-desktop.png', fullPage: true });
  await d.click('nav [data-nav="home"]'); await d.screenshot({ path: 'shot-home-desktop.png', fullPage: true });
  ok('8 anonymous rows sent to the class form (5 first, 3 second): ' + posts.length, posts.length === 8 && posts.filter(x => x.includes('|first|')).length === 5 && posts.filter(x => x.includes('|second|')).length === 3);
  ok('no page errors: ' + errs.join('; '), errs.length === 0);
  // data integrity of the bank
  const bad = Q.filter(q => q.options.length !== 4 || q.answer < 0 || q.answer > 3 || !q.h1 || !q.h2 || !q.why);
  ok('30 questions, all well formed, unique ids', Q.length === 30 && bad.length === 0 && new Set(Q.map(q => q.id)).size === 30);
  for (const c of checks) console.log(c[0], c[1]);
  console.log(checks.filter(c => c[0] === 'PASS').length + ' of ' + checks.length + ' passed');
  await b.close();
})();
