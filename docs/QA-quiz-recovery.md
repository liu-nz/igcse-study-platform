# Quiz recovery QA — 2026-10-01

Base: main a605a40. Additive `quizDrafts` field; one local draft per identity. Drafts are not portable and are excluded by the backup allowlist.

## Passed

- All JS syntax, duplicate IDs, git diff whitespace, and existing revision/backup regressions.
- Node recovery validation: roundtrip, unsubmitted selection, identity/guest-name isolation, malformed option/index/order/time rejection, changed question/answer detection, draft clearing.
- Isolated Chrome actual clicks/reloads: question order and index, submitted and unsubmitted answers, preserved timer, no repeated daily/mistake/SRS update, pause and excluded time away, identity switching, completion exactly once and draft cleanup, changed-bank notice/disabled recovery, explicit discard retaining saved learning.
- Recovery setup at 375/390/430/768px without document overflow; screenshot reviewed.

## Limits

One active quiz tab per local identity is recommended. Browser-local identities are not secure cloud accounts. On an abrupt process crash, the latest timer snapshot can lag by approximately ten seconds. Storage failure uses the persistent warning; a draft cannot survive a failed write. Changed question text/options/answer fail closed rather than changing a student's saved attempt. No actual Safari/physical-device verification; the available WebKit runtime does not support this host OS.
