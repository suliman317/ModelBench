# Dockerfile
FROM python:3.11.9-slim-bookworm as builder

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /app

RUN pip install poetry==1.8.2
COPY pyproject.toml poetry.lock* /app/
RUN poetry install --no-root --no-dev --no-cache

FROM python:3.11.9-slim-bookworm as final

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /app

COPY --from=builder /app/.venv /.venv
ENV PATH="/app/.venv/bin:$PATH"

COPY modelbench.py .
EXPOSE 8000

CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-w", "2", "modelbench:app", "--bind", "0.0.0.0:8000"]