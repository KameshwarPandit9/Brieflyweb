import pytest
import inspect
from fastapi import HTTPException
from app.main import health
from app.api.routes import URLIn, analyze_link, analyze_video, check_url
from app.core.config import settings
from app.services.summarizer import ensure_provider_configured

def test_health_reports_optional_services_unconfigured():
    response = health()
    assert response["url_reputation_configured"] is False
    assert response["media_detector_configured"] is False

def test_url_check_endpoint_is_heuristic():
    response = check_url(URLIn(url="http://192.0.2.9/login"))
    assert response["assessment"] == "heuristic"
    assert response["risk"] == "HIGH"

def test_link_analysis_does_not_fetch_untrusted_url():
    response = analyze_link(URLIn(url="http://127.0.0.1/admin"))
    assert response["status"] == "URL_FETCH_NOT_CONFIGURED"

def test_media_detector_returns_unavailable_instead_of_fake_score():
    from app.services.detector import NotConfiguredDetector
    assert inspect.iscoroutinefunction(analyze_video)
    assert NotConfiguredDetector.status == "NOT_CONFIGURED"

def test_summary_without_provider_is_an_explicit_configuration_error(monkeypatch):
    monkeypatch.setattr(settings, "llm_api_key", "")
    with pytest.raises(RuntimeError, match="LLM_API_KEY"):
        ensure_provider_configured()
