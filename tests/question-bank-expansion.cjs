const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const context = vm.createContext({ console });
for (const file of [
    'js/data-flashcards.js', 'js/data-other.js', 'js/data-learning-guides.js', 'js/data-keyunits.js',
    'js/data-q1.js', 'js/data-q2.js', 'js/data-q3.js', 'js/data-focus.js', 'js/data.js', 'js/data-resources.js',
]) vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });

const result = JSON.parse(vm.runInContext(`JSON.stringify({
    questions: QUESTION_BANK,
    added: QUESTIONS_PART3,
    materials: MATERIALS_DATA,
})`, context));
const ids = result.questions.map(question => question.id);
assert.equal(result.questions.length, 337);
assert.equal(new Set(ids).size, ids.length, 'question IDs must be unique');
assert.equal(result.added.length, 120);
for (const question of result.added) {
    assert.ok(question.question && question.questionEn && question.question !== question.questionEn, `${question.id} needs Chinese and English prompts`);
    assert.equal(question.options.length, 4, `${question.id} must have four options`);
    assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length, `${question.id} has a valid answer index`);
    assert.ok(question.explanation && question.explanationEn && question.source.includes('非真题'), `${question.id} needs bilingual guidance and an original-practice label`);
    assert.ok(question.topic && question.topicEn && question.keywords.length, `${question.id} needs a usable topic and exam keyword`);
}
const counts = Object.fromEntries([...new Set(result.questions.map(question => question.subject))].map(subject => [subject, result.questions.filter(question => question.subject === subject).length]));
assert.deepEqual(counts, { ICT: 60, '计算机科学': 60, '英语': 62, '数学': 55, '物理': 25, '化学': 25, '生物': 25, '经济': 25 });
assert.equal(result.materials.length, 48);
assert.equal(new Set(result.materials.map(material => material.id)).size, result.materials.length, 'material IDs must be unique');
const newGuides = result.materials.filter(material => material.id.startsWith('guide-'));
assert.equal(newGuides.length, 8);
for (const guide of newGuides) assert.ok(guide.content && guide.en && guide.tags.length, `${guide.id} must have bilingual content and searchable tags`);

console.log('337 unique questions, 120 bilingual original additions across 8 subjects, 8 new tagged bilingual study guides: passed');
