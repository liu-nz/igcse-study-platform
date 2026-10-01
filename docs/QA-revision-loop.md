# Revision loop QA — 2026-10-01

Baseline: main 892caa1, following merged PRs #1 (stability/security) and #3 (revision dashboard).

## Passed

- All js/*.js syntax checks with Node 24.
- `node tests/revision-loop.cjs`: mistake retained after correct answer; resolve exclusion; relapse reopening; existing records without new fields; answered-only statistics; minimum five attempts; subject/topic separation; duplicate HTML IDs.
- Isolated headless Google Chrome: deployed Pages returned HTTP 200 and main pages rendered without page errors.
- Local changed files served through browser request routing: dashboard, quiz, mistakes, review, assistant, analytics, materials, papers, flashcards, must-know, key units and settings rendered without page errors at 375/390/430/768px. No document-level horizontal overflow detected.
- Actual clicks: submit incorrect answer, choose vocabulary reason, resolve, inspect resolved filter, reopen, inspect active filter, reload and verify persistence.
- `git diff --check`.

## Limitations / remaining work

- Safari and visual screenshot review not completed; mobile checks are automated viewport/overflow checks, not physical-device testing.
- This PR does not complete the full P0/P1 roadmap. Backup import, interrupted-quiz recovery, command-word learning pages, detailed bilingual exam-writing guidance and SRS Tomorrow/Next 7 Days remain subsequent work.
- Existing local demo accounts are not secure authentication or remote collaboration. No backend or paid dependency introduced.
- Minimum sample means five answer attempts, not five distinct questions; repeated practice can still bias accuracy.
- Prior mistakes already deleted by the old behavior cannot be recovered by this change.

No breaking storage schema: old mistake records remain active by default; new fields are additive. PR #4 merged after Chrome verification on 2026-10-01; actual Safari remains unverified because the available WebKit runtime does not support macOS 13 ARM64.

## Topic filtering follow-up

- Fixed wrong-mode scope replacement: selected subject, topic, difficulty and hot-only filters now intersect with active mistakes. Weak-mode subject/topic matching remains scoped.
- All start modes use the same `getQuizScopeQuestions` helper. Explicit home/mistake-book actions reset stale filters before selecting their intended range.
- Subject changes reset the topic list; topic options show bilingual names where available and counts. Live summary displays available questions. Settings precede mode buttons.
- Chrome actual select/click checks covered 358 subject/topic/mode combinations (sequential and random), plus scoped wrong and weak sessions. Four-width layout checks and persistence flow passed without page errors or document overflow.
- Node regression checks cover subject/topic intersections, explicit topic overrides, focus-only scope, difficulty and hot-only intersections.
