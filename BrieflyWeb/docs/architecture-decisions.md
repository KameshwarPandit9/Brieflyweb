# Architecture decisions

- **Local-first, single-user starter:** use SQLite and Chrome local storage so the project can run without provisioning Postgres or Redis. The API has no authentication or user isolation yet; it is only suitable for localhost development.
- **User-triggered page access:** use `activeTab` and inject a short-lived content script from the popup. This keeps extraction attached to an explicit user action and avoids a persistent all-sites content script.
- **Backend AI boundary:** the extension never stores provider credentials. It sends extracted page text to the configurable backend adapter only after the user asks for a summary.
- **No backend URL fetching:** the link endpoint does not fetch user URLs. A safe fetcher needs DNS pinning, redirect revalidation, response caps, and private-network protections; until that exists, the extension page extraction path is used for articles.
- **Honest unavailable integrations:** video detection is behind a replaceable adapter and reports `NOT_CONFIGURED`. Transcript retrieval, URL reputation, autofill, profile vault, semantic search, and account management are not implemented in this initial slice.
- **Hand-authored styles:** custom CSS keeps the initial popup and dashboard dependency footprint small. Tailwind is not wired in this starter.
