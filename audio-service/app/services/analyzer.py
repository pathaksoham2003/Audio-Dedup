from __future__ import annotations

from ..models.analysis import AnalysisResponse
from ..models.metadata import AudioMetadata
from .embedder import extract_features
from .fingerprinter import generate_fingerprint
from .hasher import compute_sha256
from ..utils.audio_io import load_audio_from_bytes


def analyze_bytes(data: bytes, audio_format: str | None = None) -> AnalysisResponse:
    """
    Complete analysis pipeline: Hash -> Fingerprint -> Embeddings -> Metadata
    """
    # 1. Compute SHA-256 (byte-level)
    sha_hash = compute_sha256(data)
    
    # 2. Load audio and extract features
    try:
        audio_np, sample_rate, raw_metadata = load_audio_from_bytes(data, audio_format)
        
        # 3. Generate Chromaprint Fingerprint
        fp_str, fp_raw = generate_fingerprint(audio_np, sample_rate)
        
        # 4. Extract Embeddings and Spectral Features
        features = extract_features(audio_np, sample_rate)
        
        metadata = AudioMetadata(
            duration_seconds=raw_metadata["duration_seconds"],
            sample_rate=raw_metadata["sample_rate"],
            channels=raw_metadata["channels"],
            format=raw_metadata["format"],
        )
        
        return AnalysisResponse(
            sha256_hash=sha_hash,
            fingerprint=fp_str,
            fingerprint_raw=fp_raw,
            embedding=features["embedding"],
            mfcc_mean=features["mfcc_mean"],
            spectral_centroid_mean=features["spectral_centroid_mean"],
            chroma_mean=features["chroma_mean"],
            zero_crossing_rate=features["zero_crossing_rate"],
            metadata=metadata,
        )
        
    except Exception as e:
        # If audio decoding fails, we can still return the hash but metadata will be empty
        # Or we can let the exception bubble up for a 400/500 error
        raise e
