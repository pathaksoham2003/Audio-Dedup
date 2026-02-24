from __future__ import annotations

import librosa
import numpy as np


def extract_features(audio: np.ndarray, sr: int) -> dict:
    """
    Extracts audio features (MFCCs, spectral features) and computes an embedding vector.
    """
    # 1. Extract MFCCs
    mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
    mfcc_mean = np.mean(mfccs, axis=1)

    # 2. Extract Spectral Centroid
    spectral_centroid = librosa.feature.spectral_centroid(y=audio, sr=sr)
    spectral_centroid_mean = float(np.mean(spectral_centroid))

    # 3. Extract Chroma Features
    chroma = librosa.feature.chroma_stft(y=audio, sr=sr)
    chroma_mean = np.mean(chroma, axis=1)

    # 4. Zero Crossing Rate
    zcr = librosa.feature.zero_crossing_rate(y=audio)
    zcr_mean = float(np.mean(zcr))

    # 5. Create a combined embedding vector (normalized)
    # Concatenate features into a single vector
    embedding = np.concatenate([
        mfcc_mean,
        [spectral_centroid_mean / 5000.0],  # Normalized approx range
        chroma_mean,
        [zcr_mean]
    ])
    
    # Normalize the embedding vector for easier cosine similarity
    norm = np.linalg.norm(embedding)
    if norm > 0:
        embedding = embedding / norm

    return {
        "embedding": embedding.tolist(),
        "mfcc_mean": mfcc_mean.tolist(),
        "spectral_centroid_mean": spectral_centroid_mean,
        "chroma_mean": chroma_mean.tolist(),
        "zero_crossing_rate": zcr_mean
    }
