# Security and privacy notes

BrieflyWeb currently targets local single-user development. The API does not implement authentication, authorization, account isolation, CSRF protection, rate limiting, encrypted profile storage, or a production database. Keep it bound to localhost. Do not expose it to a network.

The extension requests `activeTab`, `scripting`, `storage`, and `sidePanel`, plus access to the local API origin. It injects the extraction function only after the user clicks a feature in the popup. Extraction is capped at 100,000 characters. The user initiates transfer to the local API, which forwards text to the configured AI provider. Provider-specific retention and training terms apply.

URL checks are local syntactic heuristics. They do not resolve DNS, follow redirects, or query reputation services. Link analysis intentionally does not make outbound HTTP requests. Never interpret a LOW result as proof of safety. Video results are unavailable; the service does not invent scores.

Saved summaries are in `chrome.storage.local`. Profile fields are encrypted with AES-GCM and a PBKDF2-derived key before being saved there. Autofill previews supported fields and requires the user to approve selected mappings; it excludes hidden and sensitive fields and never submits a form. The vault passphrase is not recoverable.
