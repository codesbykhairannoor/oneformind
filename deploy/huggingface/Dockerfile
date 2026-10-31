# ============================================================================
# Hugging Face Spaces Dockerfile for Tranvas Go Backend
# ============================================================================
# Stage 1: Build the statically linked Go executable
# ============================================================================
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Install git and system build dependencies
RUN apk add --no-cache git ca-certificates tzdata

# Cache Go modules first to speed up subsequent builds
COPY go.mod go.sum ./
RUN go mod download

# Copy backend source code
COPY main.go ./
COPY api/ ./api/
COPY backend/ ./backend/

# Compile stripped, statically linked binary for Linux
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags="-w -s" -o tranvas-api main.go

# ============================================================================
# Stage 2: Ultra-lightweight secure runtime environment
# ============================================================================
FROM alpine:3.20

# Install SSL root certificates and timezone data
RUN apk --no-cache add ca-certificates tzdata curl

# Hugging Face Spaces MANDATES running as non-root user with UID 1000
RUN adduser -D -u 1000 user
WORKDIR /home/user/app

# Copy binary from builder with UID 1000 ownership
COPY --from=builder --chown=user:user /app/tranvas-api ./tranvas-api

# Switch to non-root user
USER user

# Hugging Face Spaces routes external HTTPS traffic exclusively through port 7860
ENV HOME=/home/user \
    PORT=7860

EXPOSE 7860

# Built-in Docker healthcheck against existing Go /health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:7860/health || exit 1

# Launch Tranvas Go backend
CMD ["./tranvas-api"]
