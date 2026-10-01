const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const context = vm.createContext({ console, localStorage: { getItem: () => null }, FLASHCARD_DECKS: [], MATERIALS_DATA: [], MEMBERS_DATA: [], document: { addEventListener() {}, querySelectorAll: () => [] }, window: { addEventListener() {} } });
vm.runInContext(fs.readFileSync('js/app.js', 'utf8'), context);
vm.runInContext(`
const q = { id: 'q1', subject: 'Math', topic: 'Shared', options: ['a','b'], answer: 0 };
recordMistakeAttempt(q, 1, '2026-10-01');
recordMistakeAttempt(q, 0, '2026-10-02');
if (getActiveMistakes().length !== 1 || appData.wrongQuestions[0].correctStreak !== 1) throw Error('correct answer must preserve mistake');
appData.wrongQuestions[0].resolved = true;
if (getActiveMistakes().length) throw Error('resolved excluded');
recordMistakeAttempt(q, 1, '2026-10-03');
if (!getActiveMistakes().length || appData.wrongQuestions[0].correctStreak) throw Error('relapse reopens');
appData.quizRecords = [{ questions: Array(5).fill(q), answers: [1,1,1,null,undefined] }];
if (getWeakTopicStats().length) throw Error('unanswered excluded / minimum sample');
appData.quizRecords.push({questions: [q,q,{...q,subject:'ICT'}], answers:[1,0,1]});
const weak = getWeakTopicStats();
if (weak.length !== 1 || weak[0].subject !== 'Math' || weak[0].total !== 5 || weak[0].accuracy !== 20) throw Error('subject/topic aggregation');
`, context);
const controls = {
    'quiz-subject': { value: 'Math' }, 'quiz-topic': { value: 'Algebra' },
    'quiz-difficulty': { value: 'all' }, 'quiz-hot-only': { checked: false },
};
context.document.getElementById = id => controls[id];
vm.runInContext(`
const QUESTION_BANK = [
 {id:'m1',subject:'Math',topic:'Algebra',difficulty:'easy',isHot:true},
 {id:'m2',subject:'Math',topic:'Geometry',difficulty:'hard'},
 {id:'i1',subject:'ICT',topic:'Algebra',difficulty:'easy',focus:true},
];
if (getQuizScopeQuestions().map(q=>q.id).join() !== 'm1') throw Error('subject and topic intersection');
if (getQuizScopeQuestions('Geometry').map(q=>q.id).join() !== 'm2') throw Error('explicit topic override');
document.getElementById('quiz-subject').value='all';
if (getQuizScopeQuestions().length !== 2) throw Error('all subjects selected topic');
document.getElementById('quiz-subject').value='focus';
if (getQuizScopeQuestions()[0].id !== 'i1') throw Error('focus scope');
document.getElementById('quiz-subject').value='Math';
document.getElementById('quiz-difficulty').value='hard';
if (getQuizScopeQuestions().length) throw Error('difficulty intersection');
document.getElementById('quiz-difficulty').value='all';
document.getElementById('quiz-hot-only').checked=true;
if (getQuizScopeQuestions('Geometry').length) throw Error('hot-only intersection');
`, context);
const html = fs.readFileSync('index.html', 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(x => x[1]);
assert.equal(new Set(ids).size, ids.length, 'duplicate HTML IDs');
console.log('Revision persistence, relapse, old-data compatibility, weak-topic samples, subject/topic/difficulty/hot scope and duplicate IDs: passed');
