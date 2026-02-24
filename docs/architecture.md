## Audio Dedup Platform – Architecture

This document complements `Audio-Dedup-Platform-Plan.md` and describes the high-level architecture of the system:

- Next.js frontend for upload/dashboard
- NestJS backend API with BullMQ workers
- Python FastAPI audio analysis service
- PostgreSQL + Redis infrastructure
- Supabase storage and SMTP for alerts

Details will be expanded as implementation is filled in.

