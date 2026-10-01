const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({console,document:{addEventListener(){},querySelectorAll:()=>[],getElementById:()=>({textContent:'',disabled:false})}});
const run=s=>vm.runInContext(s,c);
run(fs.readFileSync('js/data-exam-skills.js','utf8'));run(`let appData={};function quizOwnerKey(){return 'test-owner'};function saveData(){};function getTodayStr(){return '2026-10-01'};function escapeHtml(s){return s.replaceAll('<','&lt;').replaceAll('>','&gt;')}`);run(fs.readFileSync('js/exam-skills.js','utf8'));
assert.equal(run('COMMAND_WORDS.length'),14);assert.equal(run('new Set(COMMAND_WORDS.map(c=>c.word)).size'),14);
assert.equal(run('COMMAND_PRACTICE.every(q=>COMMAND_WORDS.some(c=>c.word===q.word)&&q.answer>=0&&q.answer<q.options.length)'),true);
run("recordCommandAttempt('explain',false)");assert.equal(run('commandWordsForOwner().explain.needsReview'),true);
run("recordCommandAttempt('explain',true)");assert.equal(run('commandWordsForOwner().explain.needsReview'),true);
run("recordCommandAttempt('explain',true)");assert.equal(run('commandWordsForOwner().explain.needsReview'),false);
assert.equal(run('commandWordsForOwner().explain.attempts'),3);
run("recordCommandAttempt('explain',false)");assert.equal(run('commandWordsForOwner().explain.needsReview'),true);
// Guards prevent double-counting a checked exercise.
run("commandSession={checked:true,items:COMMAND_PRACTICE,index:0};answerCommandPractice(0)");assert.equal(run('commandWordsForOwner().explain.attempts'),4);
const focus=fs.readFileSync('js/data-focus.js','utf8');run(focus.slice(0,focus.indexOf('const FOCUS_UNIT_ROWS')));
assert.equal(run('Object.keys(EXAM_ANSWER_GUIDES).length'),20);
assert.equal(run('Object.keys(EXAM_ANSWER_GUIDES).every(id=>FOCUS_QUESTIONS.some(q=>q.id===id))'),true);
assert.equal(run('FOCUS_SUBJECTS.every(subject=>Object.keys(EXAM_ANSWER_GUIDES).filter(id=>id.startsWith("focus-"+subject+"-")).length===5)'),true);
assert.equal(run("examAnswerGuideHtml({id:'missing'})"),'');
console.log('Command structure coverage, review retention/relapse, duplicate-answer guard and 20 existing four-subject coaching IDs: passed');
