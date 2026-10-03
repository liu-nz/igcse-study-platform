# Optional Study Assistant API QA — 2026-10-03

The built-in local keyword assistant remains the default and works without network access, an account, or a key. The opt-in connector accepts an HTTPS OpenAI-compatible Chat Completions endpoint (HTTP localhost allowed for development) and a model name. It sends only the submitted prompt, plus a bilingual IGCSE system instruction, directly from the browser to the configured endpoint.

The key is kept in page memory only, cleared from the password input immediately after activation, and removed on disconnect, pagehide, reload or close. It is not written to app state, localStorage, sessionStorage, study-data JSON or full ZIP backup. The provider may charge for calls, receives submitted prompts and must permit browser CORS. No file attachments or learning history are included in API requests.

Automated unit and isolated Chrome checks cover default-off behavior, URL protocol/path restrictions, key clearing and non-persistence, authorization header and request body, local fallback after disconnect, reload clearing, HTTP/CORS error handling and 375/390/430/768px widths. Provider calls were mocked; no real key or paid request was used.
