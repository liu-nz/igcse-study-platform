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

## 2026-10-03 glossary interaction

Glossary annotations are keyboard-focusable with visible focus rings and an aria-describedby relation to the tooltip while open. Focus opens the definition; Enter/Space toggles it and Escape dismisses it. Click/touch pins the definition, a second activation closes it, and outside clicks/scroll dismiss it. Keyword refresh on navigation or question rendering clears stale tooltips.

Extended tests/glossary-browser.cjs with actual focus, keyboard, click and touch events, ARIA cleanup, refresh dismissal and four widths. Existing protected test-region/whole-word/repeat-scan checks, quiz/command-word integration and all 36 coaching renderers pass in Chrome. Safari and physical-device screen-reader behavior are untested.

## 2026-10-03 materials and paper resources

Materials: client-side IndexedDB stores the selected file (up to 50 MB); localStorage stores its searchable metadata. Search covers name/subject/tags/filename, with exact tag filtering. User entries support rename/tag edit/delete; bundled entries remain read-only. PDF opens in a new tab; other types download. Local backup intentionally excludes binary files. Existing metadata-only uploads receive an explicit re-upload message. Actual browser upload, IndexedDB readback, filter, rename, delete and cleanup passed in Chrome.

Past papers: displayed type is derived from manifest kind (official past paper, official specimen or third-party directory), season labels are correct for Feb/March, May/June, Oct/Nov and specimen, and the fixed 2026-09-30 timestamp was removed. All 60 distinct source/resource URLs in the manifest returned HTTP 200 from curl on 2026-10-03. Cambridge warns its past papers may not reflect the current syllabus; the page now directs learners to check the syllabus before using older papers.

## 2026-10-03 focus answer-coaching extension

Added 16 further guides (four per subject for existing IDs 7, 8, 10 and 11), bringing the four-subject focus set to 52/80, thirteen per subject. Coverage includes database keys and criteria, accessibility alt text, RAM/ROM, parity, public-key encryption, iteration, ESL collocations/conditionals, composite functions, gradients, nth terms and volume ratios. Question IDs, options and canonical answers are unchanged.

The four-subject browser walkthrough now checks each of the 52 explanation renderers plus mistake-book display, review progress, backup and 375/390/430/768px layout.

## 2026-10-03 complete four-subject focus coaching

Added the final 28 guides, IDs 12, 14, 15, 16, 18, 19 and 20 for each subject. All 80 four-subject focus questions now have specific Chinese reasoning, English terminology or worked response, and a pitfall. Content was checked against each question’s existing canonical answer. No question text, options, answers, or study records changed.

## Complete command-word exercise coverage

Added original practice items for Contrast, Identify, Describe, Evaluate, Outline and Suggest. All 14 listed command words now have an answer-shape exercise; each target is distinct and carries a contextual reason. Automated data checks verify every command word has exactly one or more valid exercises.


## 2026-10-03 multi-tab quiz safety

A per-identity localStorage lease allows one active quiz tab, renewed every 10 seconds and expiring after 30 seconds without renewal. Starting or resuming elsewhere is refused while the lease is active. Pausing/completing releases it; an already active tab losing the lease stops its timer, blocks answers and saves, and shows a warning. Idle same-identity tabs refresh persisted state from storage events; while another tab owns an active quiz, writes from the idle tab are refused so they cannot overwrite the running quiz. Browser-tested two shared-context tabs for exclusion, pause/release, draft recovery and state refresh. Hard crashes can delay access by at most the 30-second lease; Safari storage-event behaviour remains untested.

## 2026-10-03 Physics and Chemistry coaching

Added bilingual answer guides to existing Physics 0625 questions p001–p015 and Chemistry 0620 questions c001–c015. Each guide links the canonical question ID and provides Chinese reasoning, English exam terms, an original answer model and a common pitfall; the full coaching total is now 110 of 217 questions. Corrected c003's explanation so low pH is not confused with strong-acid ionisation, and clarified the quantity-supplied/quantity-demanded wording in Economics e013. Existing question IDs and answer indices remain stable.

Automated checks verify the 30 IDs exist in the correct subject bank and each guide has bilingual coaching fields. Browser QA checks quiz and mistake-book rendering for all 30, including the acid-strength distinction, across 375/390/430/768px widths.
