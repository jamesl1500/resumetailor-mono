import json
import time
from collections import deque
from typing import Optional
import httpx
from app.config.config import Config

TIMEOUT = httpx.Timeout(20.0, connect=10.0)
RATE_WINDOW_SECONDS = 60.0
_request_timestamps: deque[float] = deque()


def _openai_headers() -> dict:
    return {
        "Authorization": f"Bearer {Config.OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }


def _openai_url(path: str) -> str:
    base = Config.OPENAI_BASE_URL.rstrip("/")
    if base.endswith("/chat/completions"):
        base = base[: -len("/chat/completions")]
    return f"{base}/{path.lstrip('/')}"


def _safe_json_loads(text: str) -> dict:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {}


def _rate_limit_ok() -> bool:
    max_rpm = Config.OPENAI_MAX_RPM
    if max_rpm <= 0:
        return True

    now = time.monotonic()
    while _request_timestamps and now - _request_timestamps[0] > RATE_WINDOW_SECONDS:
        _request_timestamps.popleft()

    if len(_request_timestamps) >= max_rpm:
        return False

    _request_timestamps.append(now)
    return True


def _extract_response_text(data: dict) -> str:
    output_text = ""
    for item in data.get("output", []):
        if item.get("type") == "output_text":
            output_text += item.get("text", "")
    return output_text


def _extract_chat_text(data: dict) -> str:
    choices = data.get("choices", [])
    if not choices:
        return ""
    message = choices[0].get("message", {})
    return message.get("content", "") or ""


def _post_with_retry(client: httpx.Client, path: str, payload: dict) -> dict:
    max_retries = max(Config.OPENAI_MAX_RETRIES, 0)
    backoff = max(Config.OPENAI_RETRY_BACKOFF, 0.1)
    retry_statuses = {429, 500, 502, 503, 504}

    for attempt in range(max_retries + 1):
        try:
            response = client.post(
                _openai_url(path),
                headers=_openai_headers(),
                json=payload,
            )
            if response.status_code in retry_statuses and attempt < max_retries:
                time.sleep(backoff * (2**attempt))
                continue
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError:
            if attempt >= max_retries:
                raise
            time.sleep(backoff * (2**attempt))

    return {}


def _call_openai(payload_responses: dict, payload_chat: dict) -> tuple[dict, str]:
    with httpx.Client(timeout=TIMEOUT) as client:
        try:
            data = _post_with_retry(client, "responses", payload_responses)
            return data, "responses"
        except httpx.HTTPStatusError as exc:
            if exc.response is None or exc.response.status_code != 400:
                raise

        data = _post_with_retry(client, "chat/completions", payload_chat)
        return data, "chat"


def analyze_job_with_openai(job_text: str, model: Optional[str] = None) -> Optional[dict]:
    if not Config.OPENAI_API_KEY:
        return None
    if not _rate_limit_ok():
        return None

    selected_model = model or Config.OPENAI_JOB_MODEL

    payload = {
        "model": selected_model,
        "response_format": {
            "type": "json_schema",
            "json_schema": {
                "name": "job_analysis",
                "schema": {
                    "type": "object",
                    "properties": {
                        "summary": {"type": "string"},
                        "keywords": {"type": "array", "items": {"type": "string"}},
                        "signals": {
                            "type": "object",
                            "properties": {
                                "levels": {"type": "array", "items": {"type": "string"}},
                                "tools": {"type": "array", "items": {"type": "string"}},
                                "focus": {"type": "array", "items": {"type": "string"}},
                            },
                            "required": ["levels", "tools", "focus"],
                        },
                    },
                    "required": ["summary", "keywords", "signals"],
                },
            },
        },
        "input": [
            {
                "role": "system",
                "content": "You extract concise hiring signals from job descriptions.",
            },
            {
                "role": "user",
                "content": "Analyze this job description and return JSON only.\n\n" + job_text,
            },
        ],
    }

    payload_chat = {
        "model": selected_model,
        "response_format": payload["response_format"],
        "messages": [
            {
                "role": "system",
                "content": "You extract concise hiring signals from job descriptions.",
            },
            {
                "role": "user",
                "content": "Analyze this job description and return JSON only.\n\n" + job_text,
            },
        ],
    }

    data, mode = _call_openai(payload, payload_chat)

    output_text = (
        _extract_response_text(data) if mode == "responses" else _extract_chat_text(data)
    )
    result = _safe_json_loads(output_text)
    if not result:
        return None
    return {"parsed": result, "raw": data, "model": selected_model}


def parse_resume_with_openai(resume_text: str, model: Optional[str] = None) -> Optional[dict]:
    if not Config.OPENAI_API_KEY:
        return None
    if not _rate_limit_ok():
        return None

    selected_model = model or Config.OPENAI_RESUME_MODEL

    payload = {
        "model": selected_model,
        "response_format": {
            "type": "json_schema",
            "json_schema": {
                "name": "resume_profile",
                "schema": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "email": {"type": ["string", "null"]},
                        "phone": {"type": ["string", "null"]},
                        "skills": {"type": "array", "items": {"type": "string"}},
                        "summary": {"type": "string"},
                        "experience": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "title": {"type": "string"},
                                    "company": {"type": "string"},
                                    "location": {"type": ["string", "null"]},
                                    "start_date": {"type": ["string", "null"]},
                                    "end_date": {"type": ["string", "null"]},
                                    "bullets": {
                                        "type": "array",
                                        "items": {"type": "string"},
                                    },
                                },
                                "required": ["title", "company", "bullets"],
                            },
                        },
                        "education": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "institution": {"type": "string"},
                                    "degree": {"type": ["string", "null"]},
                                    "field_of_study": {"type": ["string", "null"]},
                                    "start_date": {"type": ["string", "null"]},
                                    "end_date": {"type": ["string", "null"]},
                                    "bullets": {
                                        "type": "array",
                                        "items": {"type": "string"},
                                    },
                                },
                                "required": ["institution", "bullets"],
                            },
                        },
                    },
                    "required": ["name", "skills", "summary", "experience", "education"],
                },
            },
        },
        "input": [
            {
                "role": "system",
                "content": "You extract structured data from resumes.",
            },
            {
                "role": "user",
                "content": "Parse this resume and return JSON only.\n\n" + resume_text,
            },
        ],
    }

    payload_chat = {
        "model": selected_model,
        "response_format": payload["response_format"],
        "messages": [
            {
                "role": "system",
                "content": "You extract structured data from resumes.",
            },
            {
                "role": "user",
                "content": "Parse this resume and return JSON only.\n\n" + resume_text,
            },
        ],
    }

    data, mode = _call_openai(payload, payload_chat)

    output_text = (
        _extract_response_text(data) if mode == "responses" else _extract_chat_text(data)
    )
    result = _safe_json_loads(output_text)
    if not result:
        return None
    return {"parsed": result, "raw": data, "model": selected_model}
