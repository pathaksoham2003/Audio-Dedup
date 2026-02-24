# Audio Dedup Platform

A full-stack audio upload deduplication system with:

- NestJS backend
- Next.js frontend
- Python FastAPI audio analysis service
- PostgreSQL (via Docker)
- Redis + BullMQ for background processing

This project implements the architecture and design described in `Audio-Dedup-Platform-Plan.md`.

## Project Structure

- `backend/` – NestJS API (upload, dedup, storage, email, health)
- `frontend/` – Next.js dashboard (upload, library, duplicates)
- `audio-service/` – Python FastAPI service for audio analysis
- `docs/` – Architecture and API documentation

## Getting Started (Dev)

1. Copy env file:
   ```bash
   cd audio-dedup-platform
   cp .env.example .env
   ```
2. Start the stack (once Docker files are implemented):
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
   ```

Detailed setup, commands, and architecture notes will be expanded as implementation progresses.

