const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({console,Date,encodeURIComponent,clearInterval(){},window:{addEventListener(){}},document:{addEventListener(){},getElementById:()=>null},saveData(){},showToast(){}});
vm.runInContext(`let currentUser={email:'a@example.test',name:'A',role:'owner'};const QUESTION_BANK=[{id:'a',question:'One?',options:['yes','no'],answer:0},{id:'b',question:'Two?',options:['a','b'],answer:1}];let appData={quizDrafts:{}};let quizState={id:'quiz-test',questions:QUESTION_BANK,answers:[0,null],draftSelections:[0,1],currentIndex:1,elapsedSeconds:12,startTime:null,finished:false};`,c);
vm.runInContext(fs.readFileSync('js/quiz-recovery.js','utf8'),c);
const run=s=>vm.runInContext(s,c);
run('persistQuizDraft();const saved=getQuizDraft();');
assert.equal(run('validateQuizDraft(saved).length'),2);
assert.equal(run('saved.answers[0]'),0);assert.equal(run('saved.selections[1]'),1);
assert.equal(run('saved.elapsedSeconds'),12);
run("currentUser={name:'B',email:'b@example.test',role:'owner'}");assert.equal(run('getQuizDraft()'),null);
run("currentUser={name:'A',email:'a@example.test',role:'owner'}");assert.equal(run('getQuizDraft().id'),'quiz-test');
for(const mutation of ["x.currentIndex=2","x.answers=[3,null]","x.questionIds=['a','a']","x.questionIds=['a','missing']","x.elapsedSeconds=-1","x.revisions[0]='changed'","x.selections=[0]"]){assert.equal(run(`{const x=JSON.parse(JSON.stringify(saved));${mutation};validateQuizDraft(x)}`),null,mutation)}
run("const changed=QUESTION_BANK.map(q=>({...q,answer:1-q.answer}));");assert.equal(run('validateQuizDraft(saved,changed)'),null);
run('clearQuizDraft()');assert.equal(run('getQuizDraft()'),null);
run("currentUser={name:'G1',email:'guest@temp.com',role:'guest'};const guestKey=quizOwnerKey();currentUser={name:'G2',email:'guest@temp.com',role:'guest'};");assert.equal(run('guestKey===quizOwnerKey()'),false);
console.log('Quiz draft roundtrip, selection preservation, owner isolation, invalid/changed-bank rejection and draft clearing: passed');
