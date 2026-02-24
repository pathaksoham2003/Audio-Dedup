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
### Run each section in separate terminal of the root location : 
1. Copy env file: (Replace your credentials in the .env file)
   ```bash
   cp .env.example .env
   ```
2. Start redis from the docker compose : Comment out everything other than redis in compose file
3. Run the docker-compose :
    ```
   docker-compose up -d
   ```
   
4. Run backend (Do npm i --force if dependencies are not installed):
   ```
   cd backend
   npm i
   npm start:dev
   ```
5. Run frontend (Do npm i --force if dependencies are not installed):
   ```
   cd frontend
   npm i
   npm start 
   ```
7. Run python service :
   ```
   conda create --name <env_name> python=3.11
   conda activate <env_name>
   cd audio-service
   pip install -r requirements.txt
   cd app
   python main.py
   ```   
## Alternate way
1. Start the stack (once Docker files are implemented):
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
   ```

Detailed setup, commands, and architecture notes will be expanded as implementation progresses.

