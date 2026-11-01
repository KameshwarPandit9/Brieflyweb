from app.services.risk import assess_url

def test_https_regular_domain_is_low_with_caveat():
    result = assess_url("https://docs.python.org/3/library/")
    assert result["risk"] == "LOW"
    assert result["assessment"] == "heuristic"
    assert "does not establish" in result["factors"][0]

def test_http_ip_and_credential_path_raise_risk():
    result = assess_url("http://192.0.2.2/login/verify")
    assert result["risk"] == "HIGH"
    assert any("IP address" in factor for factor in result["factors"])
    assert any("HTTPS" in factor for factor in result["factors"])

def test_invalid_scheme_is_unknown():
    assert assess_url("file:///etc/passwd")["risk"] == "UNKNOWN"

def test_at_sign_flags_disguised_host():
    result = assess_url("https://trusted.example@evil.test/")
    assert any("user-info" in factor for factor in result["factors"])

def test_malformed_ipv6_url_is_unknown():
    assert assess_url("http://[")["risk"] == "UNKNOWN"
