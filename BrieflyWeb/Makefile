.PHONY: api web extension test
api:
	cd backend && uvicorn app.main:app --reload --port 8000
web:
	npm run dev:web
extension:
	npm run build:extension
test:
	cd backend && python -m pytest -q
