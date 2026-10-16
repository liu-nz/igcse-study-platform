# IGCSE AI Tutor — local MVP

An isolated, stateless Physics 0625 tutor prototype with configurable Gemini or OpenAI provider.

## Local setup

1. Install Python 3.10+.
2. Enter this folder and create a virtual environment: `python -m venv .venv`.
3. Activate it, then run `pip install -r requirements.txt`.
4. Copy `.env.example` to `.env`. Select `AI_PROVIDER=gemini` or `openai` and enter the corresponding API key.
5. Run `uvicorn app:app --host 127.0.0.1 --port 8000`.
6. Open http://127.0.0.1:8000/ .

API keys remain on the local server. The two providers use OpenAI-compatible chat completions endpoints. Model availability and API pricing may change.

## Important limitations

This is **not safe for public deployment**: no authentication, user quotas, abuse prevention, moderation, persistent memory, RAG, or billing. Do not deploy this prototype on an internet-facing host. Do not commit your .env file. Future proprietary backend logic should be moved to a private repository.

The existing website and its local profiles are unchanged. This prototype is intentionally separate to prevent regressions.

## Manual acceptance checklist

- Open the tutor page locally.
- Ask a bilingual Ohm's Law question and check reasoning and units.
- Switch providers in .env and restart the server; repeat.
- Verify an absent API key returns a controlled error.
- Verify .env is ignored by Git.
