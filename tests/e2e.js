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
  ok('Teacher nav button hidden from students', await p.locator('nav [data-nav="teacher"]').isHidden());
  ok('teacher sign in link offered in footer', await p.locator('#tLogin').isVisible());
  await p.screenshot({ path: 'shot-home-phone.png' });
  await p.click('[data-topic="stackq"]');
  const Q = await p.evaluate(() => window.TF_QUESTIONS);
  ok('overall progress starts at 0% and the bar has no motivational shouting', (await p.locator('#ov').innerText()).includes('0% of the quiz') && !(await p.locator('#ov').innerText()).includes('!'));
  let qn = 0, plan =['right', 'wrong1', 'wrong2', 'wrong3', 'right'];
  const V = await p.evaluate(() => Object.values(window.TF_VARIANTS));
  const shownKey = async () => (await p.locator('.qtext').innerText()) + '|' + ((await p.locator('.card > pre').count()) ? (await p.locator('.card > pre').innerText()).trim() : '');
  const keyOf = q => q.q + '|' + (q.code || '').trim();
  async function currentQ() { const k = await shownKey(); return Q.concat(V).find(q => keyOf(q) === k); }
  const mainSeen = new Set();
  async function pick(i) { await p.locator(`.opt[data-i="${i}"] input`).check(); }
  for (const mode of plan) {
    const q = await currentQ(); qn++; mainSeen.add(keyOf(q));
    ok(`q${qn}: commit disabled before answer`, await p.locator('#commit').isDisabled());
    ok(`q${qn}: hint hidden before commit`, await p.locator('#hintBtn').isHidden());
    ok(`q${qn}: solution hidden before commit`, await p.locator('#giveBtn').isHidden());
    const wrongs = [0, 1, 2, 3].filter(i => i !== q.answer);
    await pick(mode === 'right' ? q.answer : wrongs[0]);
    ok(`q${qn}: still disabled without confidence`, await p.locator('#commit').isDisabled());
    await p.locator('#conf label').first().click();
    await p.click('#commit');
    if (mode === 'right') {
      ok(`q${qn}: correct shown`, await p.locator('.note.good').count() === 1);
      if (qn === 1) ok('overall progress moves to 3% once the first question is answered', (await p.locator('#ov').innerText()).includes('3% of the quiz'));
    }
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
    if (qn < 5) await p.click('#next');
  }
  ok('last question offers Try again and Change topic, not a single next button', await p.locator('#retry').isVisible() && await p.locator('#change').isVisible() && await p.locator('#next').count() === 0);
  await p.click('#retry');
  // second chance: 3 missed questions, each shown as a different version
  ok('second chance started', (await p.locator('.qmeta').innerText()).includes('second chance'));
  for (let i = 0; i < 3; i++) {
    const q = await currentQ();
    ok(`second ${i + 1}: a different question from the five already seen`, !!q && !mainSeen.has(await shownKey()));
    ok(`second ${i + 1}: no confidence asked`, await p.locator('#conf').count() === 0);
    await pick(i === 0 ? [0, 1, 2, 3].find(x => x !== q.answer) : q.answer);
    await p.click('#commit'); await p.click('#next');
  }
  ok('summary shown', (await p.locator('h1').innerText()).includes('done'));
  ok('no strength message when solutions were shown in the topic', await p.locator('#career').count() === 0);
  const stats = await p.locator('.stat b').allInnerTexts();
  ok('summary numbers 2/5, 1, 2, 2/3: ' + stats.join(' | '), stats.join('|') === '2/5|1|2|2/3');
  ok('feedback question offered once the topic is finished', await p.locator('[data-fb]').count() === 3);
  await p.screenshot({ path: 'shot-summary-phone.png', fullPage: true });
  await p.click('[data-fb="2"]');
  ok('feedback thanked and buttons removed', await p.locator('[data-fb]').count() === 0 && (await p.locator('#fbCard').innerText()).includes('Thanks'));
  const rec = await p.evaluate(() => JSON.parse(localStorage.getItem('thinkfirst.v1')));
  const rows = Object.values(rec.r);
  ok('5 records stored', rows.length === 5);
  ok('records: 2 first-try, 2 shown, 3 retried, 2 recovered', rows.filter(r => r.f).length === 2 && rows.filter(r => r.v).length === 2 && rows.filter(r => r.x >= 0).length === 3 && rows.filter(r => r.x === 1).length === 2);
  ok('quick guesses flagged (automation answers instantly)', rows.every(r => r.g === 1));
  // reload keeps data; report
  await p.reload(); await p.click('nav [data-nav="report"]');
  const rs = await p.locator('.stat b').allInnerTexts();
  ok('report stats: ' + rs.join(' | '), rs[0] === '60%' && rs[1] === '40%' && rs[3] === '67%');
  ok('no share-with-teacher section or results code on My report', await p.locator('#code').count() === 0 && !(await p.locator('main').innerText()).includes('Share with your teacher') && await p.evaluate(() => typeof makeCode === 'undefined'));
  // teacher view on desktop with 2 students (same data, different ids)
  const d = await ctx.newPage(); await d.setViewportSize({ width: 1200, height: 900 });
  await d.goto(url);
  // teacher sign in: wrong details are refused. The real password is not kept in this public repo,
  // so the test then marks the tab as signed in the same way a correct sign in does.
  await d.click('#tLogin');
  ok('sign in form shown, not the Teacher view', await d.locator('#lf').count() === 1 && await d.locator('#out2').count() === 0);
  await d.fill('#lid', 'mjcet'); await d.fill('#lpw', 'wrong-password'); await d.click('#lgo');
  await d.waitForFunction(() => /not right/.test(document.querySelector('#lmsg').textContent));
  ok('wrong password refused', await d.locator('#out2').count() === 0 && await d.locator('nav [data-nav="teacher"]').isHidden());
  await d.evaluate(() => go('teacher'));
  ok('Teacher view cannot be opened without signing in', await d.locator('#out2').count() === 0 && await d.locator('#lf').count() === 1);
  await d.evaluate(() => sessionStorage.setItem('thinkfirst.teacher', '1')); await d.reload();
  ok('Teacher nav button visible after sign in', await d.locator('nav [data-nav="teacher"]').isVisible() && await d.locator('#tWrap').isHidden());
  await d.click('nav [data-nav="teacher"]');
  ok('Teacher view links to the class sheet and has no results-code box', await d.locator('a[href*="docs.google.com/spreadsheets"]').count() === 1 && await d.locator('textarea').count() === 0 && await d.locator('#out2').count() === 1);
  await d.screenshot({ path: 'shot-teacher-desktop.png', fullPage: true });
  await d.click('nav [data-nav="home"]'); await d.screenshot({ path: 'shot-home-desktop.png', fullPage: true });
  await d.click('nav [data-nav="teacher"]'); await d.click('#out2');
  ok('sign out hides the Teacher view again', await d.locator('nav [data-nav="teacher"]').isHidden() && await d.locator('#tLogin').isVisible());
  // diagrams
  const figs = await d.evaluate(() => { const all = []; for (const q of TF_QUESTIONS) for (const f of [].concat(q.fig || [], q.whyFig || [])) all.push({ id: q.id, alt: !!f.alt, svg: figSvg(f) }); return all; });
  ok('every diagram draws and has alt text: ' + figs.length, figs.length >= 12 && figs.every(f => f.alt && f.svg.startsWith('<svg') && !/NaN|undefined/.test(f.svg)));
  await d.click('[data-topic="graphs"]');
  let gq = await d.evaluate(() => TF_QUESTIONS.find(q => q.q === document.querySelector('.qtext').innerText));
  while (!gq.fig) { await d.locator(`.opt[data-i="${gq.answer}"] input`).check(); await d.locator('#conf label').first().click(); await d.click('#commit'); await d.click('#next'); gq = await d.evaluate(() => TF_QUESTIONS.find(q => q.q === document.querySelector('.qtext').innerText)); }
  ok('graph question shows its diagram before any answer', await d.locator('.card > .fig svg').count() === 1);
  ok('diagram fits a phone-width card', await d.evaluate(() => { const s = document.querySelector('.fig svg'); return s.viewBox.baseVal.width <= 400; }));
  await d.screenshot({ path: 'shot-graph-desktop.png', fullPage: true });
  posts = posts.filter(x => !x.includes('|Graphs|'));
  const kind = k => posts.filter(x => x.includes('|' + k + '|')).length;
  ok('11 anonymous rows sent to the class form (5 first, 3 second, 1 start, 1 finish, 1 feedback): ' + posts.length, posts.length === 11 && kind('first') === 5 && kind('second') === 3 && kind('start') === 1 && kind('finish') === 1 && kind('feedback') === 1);
  ok('every row has 13 fields', posts.every(x => x.split(String.fromCharCode(124)).length === 13));
  // doing the same topic again sends no second start, finish or feedback row
  const before = posts.length;
  await p.click('nav [data-nav="home"]'); await p.click('[data-topic="stackq"]');
  for (let i = 0; i < 5; i++) { const q = await currentQ(); await pick(q.answer); await p.locator('#conf label').first().click(); await p.click('#commit'); await p.click('#next'); }
  ok('repeat of a topic sends no duplicate rows and does not ask for feedback again', posts.length === before && await p.locator('[data-fb]').count() === 0);
  // ---- career strength message, roadmap, green cards ----
  const CARE = await p.evaluate(() => window.TF_CAREERS);
  const TOPIC = await p.evaluate(() => window.TF_TOPICS);
  const L = CARE.topicLetters, nameOf = id => TOPIC.find(t => t.id === id).name;
  const mk = (topic, o = {}) => { const r = {}; Q.filter(q => q.topic === topic).forEach((q, i) => { const hint1 = i === o.hintOne, hint2 = i === o.twoHints; r[q.id] = { a: hint1 || hint2 ? 3 : 1, h: hint2 ? 2 : hint1 ? 1 : 0, v: i === o.shown ? 1 : 0, f: hint1 || hint2 ? 0 : 1, g: 0, c: i === o.guessAt ? 0 : 2, x: -1 }; }); if (o.drop !== undefined) delete r[Q.filter(q => q.topic === topic)[o.drop].id]; return r; };
  const seedPage = async recs => { const c = await b.newContext({ viewport: { width: 390, height: 844 } }); await c.route('**/docs.google.com/**', r => r.fulfill({ status: 200, body: '' })); const pg = await c.newPage(); pg.on('pageerror', e => errs.push(String(e))); await pg.goto(url); await pg.evaluate(r => localStorage.setItem('thinkfirst.v1', JSON.stringify({ id: 'sx', r, l: JSON.parse(JSON.stringify(r)), t: {} })), Object.assign({}, ...recs)); await pg.reload(); return pg; };
  const acedIn = (pg, recs) => pg.evaluate(r => acedTopics(r).map(t => t.id), Object.assign({}, ...recs));
  const pg0 = await seedPage([]);
  ok('aced rule: no solution, at most 1 hint each, no Guessing, all questions finished counts', (await acedIn(pg0, [mk('stackq')])).join() === 'stackq');
  ok('aced rule: a wrong first answer with exactly 1 hint opened still counts', (await acedIn(pg0, [mk('stackq', { hintOne: 2 })])).join() === 'stackq');
  ok('aced rule: one question with the solution shown does not count', (await acedIn(pg0, [mk('stackq', { shown: 1 })])).length === 0);
  ok('aced rule: one question with 2 hints does not count', (await acedIn(pg0, [mk('stackq', { twoHints: 3 })])).length === 0);
  ok('aced rule: one Guessing first answer does not count', (await acedIn(pg0, [mk('stackq', { guessAt: 2 })])).length === 0);
  ok('aced rule: a topic that is not finished does not count', (await acedIn(pg0, [mk('stackq', { drop: 4 })])).length === 0);
  await pg0.click('nav [data-nav="report"]');
  ok('no strength message for a student with no aced topic', await pg0.locator('#career').count() === 0);
  const pgNot = await seedPage([mk('stackq', { shown: 0 })]); await pgNot.click('nav [data-nav="report"]');
  ok('no strength message when the topic was not aced', await pgNot.locator('#career').count() === 0 && await pgNot.locator('#road').count() === 0);
  const pg1 = await seedPage([mk('stackq')]); await pg1.click('nav [data-nav="report"]');
  const one = CARE.combos.B, oneNames = one.roles.join(' or ');
  const t1 = await pg1.locator('#career').innerText();
  ok('one aced topic: exact wording, with each role description', t1.includes('You worked through Stacks and Queues without guessing once. You could be great at ' + oneNames + '.') && one.roles.every(n => t1.includes(n + ': for someone who ' + CARE.roles.find(r => r.name === n).desc)));
  ok('one aced topic: suggestion note shown, roadmap hidden', t1.includes('It is a suggestion, not a prediction.') && await pg1.locator('#road').count() === 0);
  const pg2 = await seedPage([mk('stackq'), mk('lists')]); await pg2.click('nav [data-nav="report"]');
  const t2 = await pg2.locator('#career').innerText();
  ok('two aced topics: both named, roles for that pair', t2.includes('You worked through Stacks and Queues and Linked Lists without guessing once. You could be great at ' + CARE.combos.BC.roles.join(' or ') + '.'));
  ok('two aced topics: roadmap shown and collapsed by default', await pg2.locator('#road').count() === 1 && await pg2.locator('#road').evaluate(e => !e.open) && (await pg2.locator('#road').textContent()).includes('Foundation'));
  const all = ['search', 'stackq', 'lists', 'trees', 'graphs', 'sorthash'];
  const pg6 = await seedPage(all.map(t => mk(t))); await pg6.click('nav [data-nav="report"]');
  const t6 = await pg6.locator('#career').innerText();
  ok('all six aced: every topic named and the roles for ABCDEF shown', t6.includes('You worked through Arrays and Searching, Stacks and Queues, Linked Lists, Trees, Graphs and Sorting and Hashing without guessing once.') && t6.includes('You could be great at ' + CARE.combos.ABCDEF.roles.join(' or ') + '.'));
  // ---- student feedback form: only for students who attempted the quiz ----
  const ctxF = await b.newContext({ viewport: { width: 390, height: 844 } });
  const postsF = []; await ctxF.route('**/docs.google.com/**', r => { postsF.push(r.request().postData() || ''); r.fulfill({ status: 200, body: '' }); });
  const pf = await ctxF.newPage(); pf.on('pageerror', e => errs.push(String(e))); await pf.goto(url);
  const fbLine = 'If you have attempted the quiz, we would value your feedback: five short questions. New visitors can ignore this.';
  ok('every visitor sees the feedback line, a new visitor gets no button', (await pf.locator('#fbNotice').innerText()).includes(fbLine) && await pf.locator('#fbOpen').count() === 0);
  await pf.evaluate(() => go('feedback'));
  ok('a visitor who has not attempted the quiz cannot open the form', await pf.locator('#fbf').count() === 0 && (await pf.locator('main').innerText()).includes('for students who have attempted the quiz'));
  await pf.evaluate(r => localStorage.setItem('thinkfirst.v1', JSON.stringify({ id: 'sf', r, l: JSON.parse(JSON.stringify(r)), t: {} })), mk('stackq')); await pf.reload();
  ok('after attempting, the Give feedback button appears with the same line', await pf.locator('#fbOpen').isVisible() && (await pf.locator('#fbNotice').innerText()).includes(fbLine));
  await pf.click('#fbOpen');
  const FBQ = ['What was the most confusing or frustrating part of using the site?', 'How did having to answer before seeing a hint change how you attempted the questions?', 'When you opened a hint or solution, what did you find helpful or missing?', 'Which question or topic felt unclear, too easy, or too hard, and why?', 'What more would you want to see on the site that would make you use it again?'];
  const shown = await pf.locator('.fbfield span').allInnerTexts();
  ok('the form shows the five questions in order, with no name or email field', shown.length === 5 && FBQ.every((q, i) => shown[i].includes(q)) && await pf.locator('input[type=text], input[type=email], input:not([type])').count() === 0);
  await pf.click('#fbSend');
  ok('an empty form is not sent', postsF.length === 0 && (await pf.locator('#fbMsg').innerText()).length > 0);
  const tas = pf.locator('textarea.fbq'); await tas.nth(0).fill('Too slow | to load\nsecond line'); await tas.nth(2).fill('Hint 2 was clear'); await pf.click('#fbSend');
  const survey = postsF.filter(x => x.includes('|survey|'));
  ok('only the answered questions are sent, one anonymous row each with 13 fields and no pipes inside the text', survey.length === 2 && survey.every(x => x.split(String.fromCharCode(124)).length === 13) && survey[0].includes('|q1|Too slow to load second line|survey|') && survey[1].includes('|q3|Hint 2 was clear|survey|'));
  ok('thank-you shown after sending', (await pf.locator('main').innerText()).includes('Thank you'));
  await pf.reload();
  ok('after sending, the home notice thanks the student and has no button', (await pf.locator('#fbNotice').innerText()).includes('Thank you') && await pf.locator('#fbOpen').count() === 0);
  await pf.evaluate(() => go('feedback'));
  ok('feedback cannot be sent twice', await pf.locator('#fbf').count() === 0 && postsF.filter(x => x.includes('|survey|')).length === 2);
  const firstLine = x =>x.split(String.fromCharCode(10))[0];
  console.log('WORDING one topic :', firstLine(t1));
  console.log('WORDING two topics:', firstLine(t2));
  console.log('WORDING all six   :', firstLine(t6));
  await pg6.screenshot({ path: 'shot-report-career-phone.png', fullPage: true });
  // records saved before this feature (older shape: no latest-try or topic fields) qualify on the next load
  const cOld = await b.newContext({ viewport: { width: 390, height: 844 } }); await cOld.route('**/docs.google.com/**', r => r.fulfill({ status: 200, body: '' }));
  const pgOld = await cOld.newPage(); pgOld.on('pageerror', e => errs.push(String(e))); await pgOld.goto(url);
  await pgOld.evaluate(r => localStorage.setItem('thinkfirst.v1', JSON.stringify({ id: 'old', r })), mk('lists')); await pgOld.reload(); await pgOld.click('nav [data-nav="report"]');
  ok('records saved before the feature qualify on the next load, nothing sent', (await pgOld.locator('#career').innerText()).includes('Linked Lists'));
  // all 63 combinations exist, have 1 or 2 valid roles, and match the written rule
  const keys = Object.keys(CARE.combos), letters = 'ABCDEF';
  const expected = []; for (let m = 1; m < 64; m++) expected.push([...letters].filter((_, i) => m & (1 << i)).join(''));
  const roleNames = CARE.roles.map(r => r.name);
  ok('all 63 combinations exist with 1 or 2 valid roles and valid tracks', keys.length === 63 && expected.every(k => CARE.combos[k]) && keys.every(k => CARE.combos[k].roles.length >= 1 && CARE.combos[k].roles.length <= 2 && CARE.combos[k].roles.every(n => roleNames.includes(n)) && CARE.combos[k].tracks.length >= 1 && CARE.combos[k].tracks.every(t => CARE.tracks[t])));
  const derive = k => { const S = CARE.specs.map((_, j) => [...k].reduce((s, l) => s + CARE.topicWeights[l][j], 0)); const sc = CARE.roles.map((r, i) => ({ r, i, v: r.w.reduce((s, x, j) => s + x * S[j], 0) / r.w.reduce((s, x) => s + x, 0) })).sort((a, b) => b.v - a.v || a.i - b.i); const out = [sc[0]]; if (sc[1].v >= CARE.secondRoleRatio * sc[0].v - 1e-9) out.push(sc[1]); return { roles: out.map(x => x.r.name), tracks: [...new Set(out.map(x => x.r.track))] }; };
  ok('stored combinations match the written rule', expected.every(k => JSON.stringify(derive(k)) === JSON.stringify(CARE.combos[k])));
  // green card only for completed topics
  await pg2.click('nav [data-nav="home"]');
  ok('green card only for the completed topics, with a text label and the report line', await pg2.locator('.topic.done').count() === 2 && await pg2.locator('.topic.done .badge').allInnerTexts().then(a => a.every(x => x === 'Completed')) && (await pg2.locator('.topic.done').first().innerText()).includes('Your report for finishing this topic is ready. Open My report to see our analysis.'));
  const pgPart = await seedPage([mk('stackq', { drop: 4 })]);
  ok('a topic only partly done is not green', await pgPart.locator('.topic.done').count() === 0);
  ok('fresh student has no green card', await pg0.evaluate(() => { go('home'); return document.querySelectorAll('.topic.done').length; }) === 0);
  // message on the topic result screen, using every aced topic so far
  const pgR = await seedPage([mk('lists')]);
  await pgR.click('[data-topic="stackq"]');
  for (let i = 0; i < 5; i++) { const t = await pgR.locator('.qtext').innerText(); const q = Q.find(x => x.q === t); await pgR.locator(`.opt[data-i="${q.answer}"] input`).check(); await pgR.locator('#conf label').first().click(); await pgR.click('#commit'); await pgR.click('#next'); }
  const tr = await pgR.locator('#career').innerText();
  ok('result screen shows the message with every aced topic so far', tr.includes('Stacks and Queues and Linked Lists') && tr.includes('You could be great at ' + CARE.combos.BC.roles.join(' or ')));
  // a repeat with all wrong answers does not remove an earned result
  const pgW = await seedPage([mk('stackq'), mk('lists')]);
  await pgW.click('[data-topic="stackq"]');
  for (let i = 0; i < 5; i++) { const t = await pgW.locator('.qtext').innerText(); const q = Q.find(x => x.q === t); const w = [0, 1, 2, 3].filter(k => k !== q.answer); for (let a = 0; a < 3; a++) { await pgW.locator(`.opt[data-i="${w[a]}"] input`).check(); if (a === 0) await pgW.locator('#conf label').first().click(); await pgW.click('#commit'); } if (i < 4) await pgW.click('#next'); }
  await pgW.click('#change'); await pgW.click('nav [data-nav="report"]');
  ok('repeat with all wrong answers keeps the earned message and roadmap', (await pgW.locator('#career').innerText()).includes('Stacks and Queues') && await pgW.locator('#road').count() === 1);
  ok('the repeat did change the report numbers (think-first now 0%)', (await pgW.locator('.stat b').first().innerText()) !== '100%');
  await p.click('nav [data-nav="report"]');
  const rs2 =await p.locator('.stat b').allInnerTexts();
  ok('a repeat try updates My report (think-first 60% to 100%): ' + rs2.join(' | '), rs2[0] === '100%' && rs2[1] === '100%');
  ok('no Clear my results button', await p.locator('#reset').count() === 0 && !(await p.locator('main').innerText()).includes('Clear my results'));
  const first = await p.evaluate(() => Object.values(JSON.parse(localStorage.getItem('thinkfirst.v1')).r).filter(r => r.f).length);
  ok('first-try records are kept unchanged by the repeat (2 of 5)', first === 2);
  ok('no page errors: ' + errs.join('; '), errs.length === 0);
  // data integrity of the bank
  const bad = Q.filter(q => q.options.length !== 4 || q.answer < 0 || q.answer > 3 || !q.h1 || !q.h2 || !q.why);
  ok('30 questions, all well formed, unique ids', Q.length === 30 && bad.length === 0 && new Set(Q.map(q => q.id)).size === 30);
  const VV = await p.evaluate(() => window.TF_VARIANTS);
  const badV = Q.filter(q => { const v = VV[q.id]; return !v || v.options.length !== 4 || new Set(v.options).size !== 4 || v.answer < 0 || v.answer > 3 || !v.h1 || !v.h2 || !v.why || keyOf(v) === keyOf(q); });
  ok('every question has a different, well formed second-chance version', badV.length === 0 && Object.keys(VV).length === 30);
  const s5 = Q.find(q => q.id === 's5');
  ok('polynomials and powers are written in math style, no caret', s5.q.includes('x³') && s5.q.includes('x²') && !JSON.stringify([Q, Object.values(VV)]).includes('^'));
  // Change topic after a missed question: back to home, finish row sent, no second-chance rows
  const ctx2 = await b.newContext({ viewport: { width: 390, height: 844 } });
  const posts2 = []; await ctx2.route('**/docs.google.com/**', r => { posts2.push(r.request().postData() || ''); r.fulfill({ status: 200, body: '' }); });
  const z = await ctx2.newPage(); await z.goto(url); await z.click('[data-topic="lists"]');
  for (let i = 0; i < 5; i++) {
    const t = await z.locator('.qtext').innerText(); const q = Q.find(x => x.q === t);
    const miss = i === 0; const wrongs = [0, 1, 2, 3].filter(k => k !== q.answer);
    for (let a = 0; a < (miss ? 3 : 1); a++) { await z.locator(`.opt[data-i="${miss ? wrongs[a] : q.answer}"] input`).check(); if (a === 0) await z.locator('#conf label').first().click(); await z.click('#commit'); }
    if (i < 4) await z.click('#next');
  }
  await z.click('#change');
  ok('Change topic returns to the topic list', await z.locator('[data-topic]').count() === 6);
  ok('Change topic still sends the finish row, and no second-chance rows', posts2.filter(x => x.includes('|finish|')).length === 1 && posts2.filter(x => x.includes('|second|')).length === 0);
  ok('home shows overall progress after answering', (await z.locator('#ov').innerText()).includes('17% of the quiz'));
  for (const c of checks) console.log(c[0], c[1]);
  console.log(checks.filter(c => c[0] === 'PASS').length + ' of ' + checks.length + ' passed');
  await b.close();
})();
