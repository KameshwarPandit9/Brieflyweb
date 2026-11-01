from urllib.parse import urlsplit
import ipaddress, re

SUSPICIOUS_WORDS = {"login", "verify", "secure", "account", "update", "wallet", "support"}
def assess_url(raw: str) -> dict:
    try:
        p = urlsplit(raw.strip())
        hostname = p.hostname
        port = p.port
    except ValueError:
        return {"risk": "UNKNOWN", "score": 0, "factors": ["The URL is malformed and could not be assessed."], "assessment": "heuristic"}
    if p.scheme not in {"http", "https"} or not hostname:
        return {"risk": "UNKNOWN", "score": 0, "factors": ["Only complete HTTP or HTTPS URLs can be assessed."], "assessment": "heuristic"}
    host = hostname.lower().rstrip(".")
    factors: list[str] = []
    score = 0
    try:
        ipaddress.ip_address(host); factors.append("The host is an IP address rather than a domain."); score += 30
    except ValueError: pass
    if p.scheme == "http": factors.append("The connection does not use HTTPS."); score += 15
    if port and port not in {80, 443}: factors.append(f"The URL uses unusual port {port}."); score += 20
    if "@" in p.netloc: factors.append("The URL contains user-info that can disguise the actual host."); score += 25
    if host.startswith("xn--") or ".xn--" in host or not host.isascii(): factors.append("The hostname contains an internationalized or non-ASCII label."); score += 20
    labels = host.split(".")
    if len(labels) > 4: factors.append("The hostname has an unusually deep subdomain structure."); score += 10
    matched = sorted(SUSPICIOUS_WORDS.intersection(set(re.split(r"[^a-z0-9]+", p.path.lower() + " " + p.query.lower()))))
    if matched: factors.append("Path/query contains credential-themed terms: " + ", ".join(matched) + "."); score += min(20, len(matched) * 7)
    if not factors: factors.append("No obvious URL-structure warning was detected. This does not establish that the site is safe.")
    risk = "HIGH" if score >= 50 else "MEDIUM" if score >= 25 else "LOW"
    return {"risk": risk, "score": min(score, 100), "factors": factors, "assessment": "heuristic", "hostname": host}
