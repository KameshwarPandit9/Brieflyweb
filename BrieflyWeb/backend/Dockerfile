FROM python:3.12-slim
WORKDIR /app/backend
COPY backend/pyproject.toml ./
RUN pip install --no-cache-dir .
COPY backend/app ./app
COPY apps/web/static /app/apps/web/static
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
