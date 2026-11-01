import os
from pathlib import Path

def load_local_env() -> None:
    env_file = Path(".env")
    if not env_file.is_file():
        return
    for line in env_file.read_text(encoding="utf-8").splitlines():
        key, sep, value = line.partition("=")
        if sep and key.strip() and not key.lstrip().startswith("#"):
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))

load_local_env()

class Settings:
    database_url = os.getenv("DATABASE_URL", "sqlite:///./brieflyweb.db")
    llm_provider = os.getenv("LLM_PROVIDER", "openai_compatible")
    llm_api_key = os.getenv("LLM_API_KEY", "")
    llm_base_url = os.getenv("LLM_BASE_URL", "https://api.openai.com/v1")
    llm_model = os.getenv("LLM_MODEL", "gpt-4o-mini")
    web_app_origin = os.getenv("WEB_APP_ORIGIN", "http://localhost:3000")
    extension_id = os.getenv("EXTENSION_ID", "mdnlaggaocnjkpicpcknafepahongefg")
    log_level = os.getenv("LOG_LEVEL", "INFO")

settings = Settings()
