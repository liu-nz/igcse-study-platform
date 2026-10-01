# Local backup and schedule QA — 2026-10-01

Base: main 1b1ae6f (merged PR #4). No framework, backend, paid dependency or remote data storage.

## Behavior / compatibility

- `js/backup.js` isolates validation and merge logic; version 1 exports remain importable. Version 2 uses compact question IDs and explicit study fields.
- Import is preview then merge, with a 5 MB limit; invalid versions, dates, options, numerical ranges, IDs and collection types are rejected before any write.
- Canonical current-bank questions replace untrusted question snapshots. Missing bank IDs are skipped and counted in the preview. Deck and material strings display as literal text. Inline imported deck IDs are replaced with DOM event listeners.
- Accounts, member records and credentials are neither exported nor imported. Existing settings are preserved; portable settings are informational only. Files themselves and in-flight recall sessions are excluded.
- Existing same-ID mistakes, SRS and recall states win conflicts; records/cards merge with deduplication. New quizzes have independent IDs. Identical legacy sessions without an ID deduplicate by date/time/question IDs/answers.
- Daily counters/time use snapshot maxima and deduplicated completed history rather than blindly summing. Separate unfinished-device counters can be undercounted; this is backup migration, not full event synchronization.
- A failed main storage write leaves appData unchanged and rolls back the recall write if it already succeeded. A persistent banner warns when ordinary saving fails. Browser storage rollback can itself fail in an entirely unavailable browser storage environment.
- SRS uses local calendar dates, available-bank entries only, inclusive day-seven horizon, and consistent Learning counts.

## Passed

- All JavaScript syntax checks; duplicate HTML IDs; `git diff --check`.
- `node tests/revision-loop.cjs` and `node tests/local-backup.cjs`.
- Unit coverage: version compatibility, roundtrip, repeated-import idempotence, state conflict preservation, malformed input, secret-field exclusion, preview race, quota failure with recall rollback, year boundary, inclusive day-seven/excluded day-eight.
- Isolated Google Chrome actual download, fresh-device merge, repeated merge, malformed file rejection, hostile text escaping, current-user recall transfer and reload persistence.
- Fixed flex/grid intrinsic sizing that let a long recent-mistake preview widen the entire mobile dashboard. Verified with a deliberately unbroken 60-character preview.
- Main study/settings/review/flashcard pages at 375/390/430/768px: no page errors or document-level horizontal overflow.
- SRS Tomorrow/Next 7 Days values verified with an isolated fixture; mobile screenshots inspected.
- A proposed Actions QA workflow was excluded because the existing push credential lacks workflow scope. The dependency-free checks remain committed and were run locally; no automated PR test workflow is claimed.

## Unverified

Actual Safari and physical mobile devices. WebKit download was attempted but the provided Playwright version rejects macOS 13 ARM64; Chrome QA does not establish Safari compatibility.

Interrupted-quiz recovery, command-word learning pages and resource search/filter enhancements remain future increments.
