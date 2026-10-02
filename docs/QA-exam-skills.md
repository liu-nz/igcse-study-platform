# Bilingual exam skills QA — 2026-10-01

Base: main 3f21b53 (PR #6). This increment implements command-word learning and selected-question coaching, not a complete syllabus rewrite.

## Content

- 14 command words, original bilingual teaching examples and 8 original response-choice exercises. Explanations link to Cambridge general command guidance; show-that links to Mathematics 0580 2025–2027 syllabus. Examples are not taken from official papers or marking schemes.
- Correct compare/contrast glossary wording: comparison can concern similarities and/or differences according to the question.
- 20 existing focus-question IDs: five each for ICT, CS, ESL and Maths. Chinese reasoning, English terminology, example wording and pitfalls display after submission and in the mistake book. Unsupported IDs do not receive a generic invented answer.
- Correct the power-rule English explanation to `a x^n -> a n x^(n-1)`.

## Behavior / storage

Wrong command exercises retain review status until two consecutive correct response choices. History remains and an error reopens review. This is practice progress, not exam mastery. Progress is local per identity, included in v2 backups as an optional allowlisted field; existing same-word states win during merge. Unfinished command drills can be restarted, but are not resumed as quiz drafts. An identity change hides another identity's drill state.

## Validation

All JS syntax, duplicate IDs, diff whitespace, existing revision/backup/recovery tests and new exam-skills tests. Coverage includes unique command IDs, valid exercise answer indices, review retention/relapse and guards, correct linkage of all 20 guide IDs with five per subject, and command-progress validation in backups.

Isolated Chrome: sidebar keyboard navigation, search/no-results, expandable cards, wrong exercise persisted across reload, two successful reviews, all 20 coaching renderers, mistake-book coaching, command-progress backup/restore and no runtime errors. Main pages checked at 375/390/430/768px without document overflow; screenshots inspected. Quiz-recovery and existing backup browser regressions repeated.

Actual Safari and physical devices remain unverified. Remaining work includes comprehensive coaching for the rest of the question bank, broader syllabus/marking coverage and more written-response training.

## 2026-10-03 content extension

Added 16 original guides, four per subject (focus IDs 2, 3, 4 and 6), bringing coverage to 36 / nine per subject. Manually checked each guide against its existing question, correct option and explanation. Covered absolute/relative references, COUNTIF/exact lookup, hexadecimal/unsigned values/image size/PC, reading evidence and opinion, fractional indices/quadratics/inequalities/inverse functions. Maths workings retain the actual numeric values and strict inequality. No question IDs, answers or progress schema changed.

Validated all 36 canonical IDs and non-empty coaching fields, JavaScript syntax, duplicate IDs and glossary protections. Chrome exercised all 36 quiz explanations, mistake-book rendering, command-word persistence/backup and widths 375/390/430/768. Safari remains untested.
