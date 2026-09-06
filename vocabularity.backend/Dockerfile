# ---------- Stage 1: build Go migrator for linux ----------
FROM golang:1.21-alpine AS migrator-builder
WORKDIR /src/migrator
COPY migrator/go.mod migrator/go.sum ./
RUN go mod download
COPY migrator/ ./
RUN CGO_ENABLED=0 go build -o /out/migrator .

# ---------- Stage 2: Python runtime ----------
FROM python:3.12-slim
WORKDIR /app

ENV PYTHONUNBUFFERED=1
ENV BACKEND_HOST=0.0.0.0
ENV BACKEND_PORT=8000
# migrator по умолчанию ищет миграции в ../migrations — в контейнере путь другой
ENV MIGRATIONS_DIR=/app/migrations

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

COPY --from=migrator-builder /out/migrator /usr/local/bin/migrator

EXPOSE 8000

# По умолчанию контейнер запускает приложение.
# Сервис миграций в docker-compose переопределяет команду на ["migrator"].
CMD ["python", "main.py"]
