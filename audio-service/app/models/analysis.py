from typing import List

from pydantic import BaseModel

from .metadata import AudioMetadata


class AnalysisResponse(BaseModel):
    sha256_hash: str
    fingerprint: str | None = None
    fingerprint_raw: List[int] | None = None
    embedding: List[float]
    mfcc_mean: List[float] | None = None
    spectral_centroid_mean: float | None = None
    chroma_mean: List[float] | None = None
    zero_crossing_rate: float | None = None
    metadata: AudioMetadata


class AnalysisRequest(BaseModel):
    # Placeholder for future options (e.g., which features to compute)
    dummy: bool = False

