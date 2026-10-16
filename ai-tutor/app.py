"""Local-only, unauthenticated AI Tutor prototype. Never deploy publicly."""
import os
from pathlib import Path
import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

load_dotenv(Path(__file__).with_name(".env"))
app = FastAPI(title="IGCSE AI Tutor")
PROVIDERS = {
 "openai": ("https://api.openai.com/v1/chat/completions", "OPENAI_API_KEY", "OPENAI_MODEL", "gpt-4.1-mini"),
 "gemini": ("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", "GEMINI_API_KEY", "GEMINI_MODEL", "gemini-2.5-flash")
}
SYSTEM = ("You are a Cambridge IGCSE Physics 0625 tutor for Chinese-speaking students. "
"Explain in Chinese with English exam terms. Diagnose misconceptions, show equations and units, "
"and offer one practice question. Give direct worked solutions when asked. "
"Do not invent official syllabus quotes or mark schemes; admit uncertainty. "
"You have no persistent memory or syllabus retrieval.")
class Turn(BaseModel):
 role: str
 content: str = Field(min_length=1, max_length=4000)
class ChatRequest(BaseModel):
 message: str = Field(min_length=1, max_length=4000)
 history: list[Turn] = Field(default_factory=list, max_length=12)
@app.get("/")
async def home():
 return FileResponse(Path(__file__).with_name("tutor.html"))
@app.get("/api/health")
async def health():
 return {"status": "ok"}
@app.post("/api/tutor/chat")
async def chat(body: ChatRequest):
 provider = os.getenv("AI_PROVIDER", "gemini").lower()
 if provider not in PROVIDERS:
  raise HTTPException(503, "Invalid AI_PROVIDER")
 url, key_name, model_name, default_model = PROVIDERS[provider]
 key = os.getenv(key_name, "").strip()
 if not key:
  raise HTTPException(503, "Model API key is not configured")
 history = [{"role": t.role, "content": t.content} for t in body.history if t.role in ("user", "assistant")]
 payload = {"model": os.getenv(model_name) or default_model, "messages": [{"role": "system", "content": SYSTEM}] + history + [{"role": "user", "content": body.message}], "max_tokens": 900}
 try:
  async with httpx.AsyncClient(timeout=35) as client:
   response = await client.post(url, headers={"Authorization": "Bearer " + key}, json=payload)
   response.raise_for_status()
   answer = response.json()["choices"][0]["message"]["content"]
   if not isinstance(answer, str) or not answer.strip():
    raise ValueError("Empty response")
   return {"answer": answer[:12000], "provider": provider}
 except httpx.TimeoutException:
  raise HTTPException(504, "Model request timed out") from None
 except httpx.HTTPStatusError as exc:
  raise HTTPException(502, "Provider returned HTTP " + str(exc.response.status_code)) from None
 except (httpx.RequestError, ValueError, KeyError, IndexError, TypeError):
  raise HTTPException(502, "Provider response unavailable") from None
