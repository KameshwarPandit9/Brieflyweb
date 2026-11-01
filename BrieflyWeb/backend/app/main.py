from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from app.api.routes import router
from app.core.config import settings

app = FastAPI(title="BrieflyWeb API", version="0.1.0", description="Local API for source-grounded web summaries and heuristic URL checks.")
origins = [settings.web_app_origin]
if settings.extension_id:
    origins.append("chrome-extension://" + settings.extension_id)
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=False, allow_methods=["GET", "POST", "DELETE"], allow_headers=["Content-Type"])
app.include_router(router, prefix="/api/v1")
dashboard_dir = Path(__file__).resolve().parents[2] / "apps" / "web" / "static"
app.mount("/dashboard", StaticFiles(directory=dashboard_dir, html=True), name="dashboard")
@app.get("/", include_in_schema=False)
def dashboard_redirect(): return RedirectResponse("/dashboard/")
@app.get("/health")
def health(): return {"status": "ok", "summarization_configured": bool(settings.llm_api_key), "url_reputation_configured": False, "media_detector_configured": False}
