const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({console,document:{addEventListener(){},querySelectorAll:()=>[],getElementById:()=>({textContent:'',disabled:false})}});
const run=s=>vm.runInContext(s,c);
run(fs.readFileSync('js/data-exam-skills.js','utf8'));run(`let appData={};function quizOwnerKey(){return 'test-owner'};function saveData(){};function getTodayStr(){return '2026-10-01'};function escapeHtml(s){return s.replaceAll('<','&lt;').replaceAll('>','&gt;')}`);run(fs.readFileSync('js/exam-skills.js','utf8'));
assert.equal(run('COMMAND_WORDS.length'),14);assert.equal(run('new Set(COMMAND_WORDS.map(c=>c.word)).size'),14);
assert.equal(run('COMMAND_PRACTICE.every(q=>COMMAND_WORDS.some(c=>c.word===q.word)&&q.answer>=0&&q.answer<q.options.length)'),true);
assert.equal(run('new Set(COMMAND_PRACTICE.map(q=>q.word)).size'),14);
assert.equal(run('COMMAND_WORDS.every(c=>COMMAND_PRACTICE.some(q=>q.word===c.word))'),true);
run("recordCommandAttempt('explain',false)");assert.equal(run('commandWordsForOwner().explain.needsReview'),true);
run("recordCommandAttempt('explain',true)");assert.equal(run('commandWordsForOwner().explain.needsReview'),true);
run("recordCommandAttempt('explain',true)");assert.equal(run('commandWordsForOwner().explain.needsReview'),false);
assert.equal(run('commandWordsForOwner().explain.attempts'),3);
run("recordCommandAttempt('explain',false)");assert.equal(run('commandWordsForOwner().explain.needsReview'),true);
// Guards prevent double-counting a checked exercise.
run("commandSession={checked:true,items:COMMAND_PRACTICE,index:0};answerCommandPractice(0)");assert.equal(run('commandWordsForOwner().explain.attempts'),4);
const focus=fs.readFileSync('js/data-focus.js','utf8');run(focus.slice(0,focus.indexOf('const FOCUS_UNIT_ROWS')));
assert.equal(run('Object.keys(EXAM_ANSWER_GUIDES).length'),140);
assert.equal(run('Object.keys(EXAM_ANSWER_GUIDES).filter(id=>id.startsWith("focus-")).length'),80);
assert.equal(run('FOCUS_SUBJECTS.every(subject=>Object.keys(EXAM_ANSWER_GUIDES).filter(id=>id.startsWith("focus-"+subject+"-")).length===20)'),true);
run(fs.readFileSync('js/data-q1.js','utf8'));run(fs.readFileSync('js/data-q2.js','utf8'));run(fs.readFileSync('js/data.js','utf8'));
assert.equal(run('QUESTION_BANK.filter(q=>["p","c"].some(prefix=>q.id.startsWith(prefix)) && EXAM_ANSWER_GUIDES[q.id]).length'),30);
assert.equal(run('Object.keys(EXAM_ANSWER_GUIDES).filter(id=>/^[pc]\\d{3}$/.test(id)).length'),30);
assert.equal(run('Object.keys(EXAM_ANSWER_GUIDES).filter(id=>id.startsWith("p")).every(id=>QUESTION_BANK.some(q=>q.id===id&&q.subjectCode==="0625"))'),true);
assert.equal(run('Object.keys(EXAM_ANSWER_GUIDES).filter(id=>id.startsWith("c")).every(id=>QUESTION_BANK.some(q=>q.id===id&&q.subjectCode==="0620"))'),true);
assert.equal(run('Object.keys(EXAM_ANSWER_GUIDES).filter(id=>id.startsWith("b")).length'),15);
assert.equal(run('Object.keys(EXAM_ANSWER_GUIDES).filter(id=>id.startsWith("b")).every(id=>QUESTION_BANK.some(q=>q.id===id&&q.subjectCode==="0610"))'),true);
assert.equal(run('Object.keys(EXAM_ANSWER_GUIDES).filter(id=>id.startsWith("e")).length'),15);
assert.equal(run('Object.keys(EXAM_ANSWER_GUIDES).filter(id=>id.startsWith("e")).every(id=>QUESTION_BANK.some(q=>q.id===id&&q.subjectCode==="0455"))'),true);
assert.equal(run("examAnswerGuideHtml({id:'missing'})"),'');
console.log('All 14 command words practised, review retention/relapse, duplicate-answer guard and 140 linked coaching guides across focus, Physics, Chemistry, Biology and Economics: passed');

// Every guide must provide usable bilingual coaching, not an empty placeholder.
assert.equal(run('Object.values(EXAM_ANSWER_GUIDES).every(g=>g.keywords.length>=2 && g.keywords.every(k=>/[A-Za-z]/.test(k)) && /[\\u4e00-\\u9fff]/.test(g.reasoning) && g.model.trim().length>0 && /[\\u4e00-\\u9fff]/.test(g.pitfall))'),true);
