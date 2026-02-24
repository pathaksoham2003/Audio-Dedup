from pydantic import BaseModel
from typing import List, Optional


class ComparisonRequest(BaseModel):
    embedding_a: list[float] | None = None
    embedding_b: list[float] | None = None
    fingerprint_similarity: float | None = None


class ComparisonDetails(BaseModel):
    fingerprint_similarity: float | None = None
    embedding_cosine_similarity: float | None = None
    mfcc_similarity: float | None = None


class ComparisonResponse(BaseModel):
    is_duplicate: bool
    similarity_score: float
    detection_method: str
    details: ComparisonDetails


class Candidate(BaseModel):
    id: str
    embedding: List[float]


class ComparisonBatchRequest(BaseModel):
    target_embedding: List[float]
    candidates: List[Candidate]
    threshold: Optional[float] = None


class Match(BaseModel):
    id: str
    score: float
    method: str


class ComparisonBatchResponse(BaseModel):
    matches: List[Match]
