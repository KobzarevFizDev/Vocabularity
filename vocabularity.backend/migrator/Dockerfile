# ---------- Stage 1: build Go migrator for linux ----------
FROM golang:1.21-alpine AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /out/migrator .

# ---------- Stage 2: minimal runtime ----------
FROM alpine:3.19
COPY --from=builder /out/migrator /usr/local/bin/migrator
# Compose overrides this with the /migrations volume mount
ENV MIGRATIONS_DIR=/migrations
ENTRYPOINT ["migrator"]
