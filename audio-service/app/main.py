from __future__ import annotations

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .models.analysis import AnalysisResponse
from .models.comparison import (
    ComparisonDetails,
    ComparisonRequest,
    ComparisonResponse,
    ComparisonBatchRequest,
    ComparisonBatchResponse,
)
from .services.analyzer import analyze_bytes
from .services.comparator import cosine_similarity
from .utils.audio_io import load_bytes

app = FastAPI(title="Audio Analysis Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(
    file: UploadFile = File(...),
) -> AnalysisResponse:
    data, content_type = load_bytes(file)
    # For now, just use the content type's subtype as format hint if available
    audio_format = None
    if content_type and "/" in content_type:
        audio_format = content_type.split("/")[-1]
    return analyze_bytes(data, audio_format=audio_format)


@app.post("/compare", response_model=ComparisonResponse)
async def compare(payload: ComparisonRequest) -> ComparisonResponse:
    embedding_score = 0.0
    if payload.embedding_a is not None and payload.embedding_b is not None:
        embedding_score = cosine_similarity(payload.embedding_a, payload.embedding_b)

    fingerprint_score = payload.fingerprint_similarity or 0.0

    # Simple rule: prefer embedding score when available
    similarity_score = max(embedding_score, fingerprint_score)

    if similarity_score >= settings.embedding_similarity_threshold:
        detection_method = "embedding_similarity"
    elif similarity_score >= settings.fingerprint_similarity_threshold:
        detection_method = "fingerprint_similarity"
    else:
        detection_method = "none"

    is_duplicate = similarity_score >= settings.embedding_similarity_threshold

    details = ComparisonDetails(
        fingerprint_similarity=fingerprint_score or None,
        embedding_cosine_similarity=embedding_score or None,
        mfcc_similarity=None,
    )

    return ComparisonResponse(
        is_duplicate=is_duplicate,
        similarity_score=similarity_score,
        detection_method=detection_method,
        details=details,
    )

@app.post("/compare-batch", response_model=ComparisonBatchResponse)
async def compare_batch(payload: ComparisonBatchRequest) -> ComparisonBatchResponse:
    target_embedding = np.array(payload.target_embedding)
    results = []
    
    threshold = payload.threshold or settings.embedding_similarity_threshold
    
    for item in payload.candidates:
        cand_embedding = np.array(item.embedding)
        score = cosine_similarity(target_embedding, cand_embedding)
        
        if score >= threshold:
            results.append({
                "id": item.id,
                "score": score,
                "method": "embedding_similarity"
            })
            
    # Sort by score descending
    results.sort(key=lambda x: x["score"], reverse=True)
    
    return ComparisonBatchResponse(matches=results)
