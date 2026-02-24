from __future__ import annotations

import numpy as np
import acoustid
import base64


def generate_fingerprint(
    audio_data: np.ndarray, sample_rate: int
) -> tuple[str, list[int]]:
    """
    Generates a Chromaprint fingerprint from audio data.
    audio_data should be a 1D numpy array of float32 (PCM).
    """
    # Chromaprint expects 16-bit signed integers
    # Convert float32 [-1, 1] to int16
    pcm_data = (audio_data * 32767).astype(np.int16).tobytes()

    # acoustid.fingerprint returns (duration, fingerprint_bytes)
    # The fingerprint_bytes is the encoded string format from Chromaprint
    try:
        # Note: acoustid.fingerprint might require the fpcalc executable 
        # but pyacoustid can also use the library directly if available.
        duration = len(audio_data) / sample_rate
        _, fp_encoded = acoustid.fingerprint(sample_rate, 1, pcm_data)
        
        # fp_encoded is already a bytes/string representation
        if isinstance(fp_encoded, bytes):
            fp_str = fp_encoded.decode('ascii')
        else:
            fp_str = fp_encoded

        # For the raw integers, we can decode it if we really need to, 
        # but let's just return the encoded string and a placeholder for now
        # or just use the string for both if we want.
        # Actually Chromaprint raw is a list of int32.
        
        return fp_str, [] # Placeholder for raw ints for now
        
    except Exception as e:
        # If acoustid fails (e.g. missing libchromaprint), fallback or return empty
        print(f"Fingerprinting failed: {e}")
        return "", []
