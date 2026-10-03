# Local backup and schedule QA — 2026-10-01

Base: main 1b1ae6f (merged PR #4). No framework, backend, paid dependency or remote data storage.

## Behavior / compatibility

- `js/backup.js` isolates validation and merge logic; version 1 exports remain importable. Version 2 uses compact question IDs and explicit study fields.
- JSON import is preview then merge, with a 5 MB limit; invalid versions, dates, options, numerical ranges, IDs and collection types are rejected before any write. Full local ZIP bundles are limited to 100 MB total and 90 MB of attachments.
- Canonical current-bank questions replace untrusted question snapshots. Missing bank IDs are skipped and counted in the preview. Deck and material strings display as literal text. Inline imported deck IDs are replaced with DOM event listeners.
- Accounts, member records and credentials are neither exported nor imported. Existing settings are preserved; portable settings are informational only. JSON backups omit binary files; full ZIP backups carry user attachments from IndexedDB plus the same safe study-data payload. In-flight recall sessions are excluded.
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

Actual Safari and physical mobile devices. Chrome QA does not establish Safari compatibility. This environment's Safari WebDriver reports that “Allow Remote Automation” must first be enabled in Safari's Develop menu; this desktop session cannot toggle that user-controlled setting.

## 2026-10-03 full attachment backup

Full backup creates a dependency-free, uncompressed ZIP containing `manifest.json` and local IndexedDB attachment blobs. The importer validates archive paths, manifest-to-material IDs/file names, sizes, local/central headers and CRC32 before preview. Import merges metadata and saves missing blobs in one IndexedDB transaction; existing same-ID blobs win. If the study-data localStorage write fails after attachment storage, newly inserted blobs are deleted. JSON v1/v2 imports remain supported. Legacy metadata-only records are listed as not included and still require re-upload.

Chrome verified ZIP interoperability with the system unzip utility; a real local-file upload/export/fresh-context restore returned identical bytes. A simulated localStorage quota failure rolled back both metadata and the newly written IndexedDB attachment. Corrupt CRC, path traversal and manifest mismatch are rejected. Size ceilings are 90 MB for attachments and 100 MB for the full archive.
