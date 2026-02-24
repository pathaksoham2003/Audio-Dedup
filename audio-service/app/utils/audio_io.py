from __future__ import annotations

import io
from typing import Tuple

import librosa
import numpy as np
from pydub import AudioSegment


def load_audio_from_bytes(
    data: bytes, audio_format: str | None = None
) -> Tuple[np.ndarray, int, dict]:
    """
    Loads audio bytes into a numpy array, normalizes it, and returns metadata.
    Uses pydub for initial loading to handle various formats like mp3, m4a, wav.
    """
    try:
        # Load with pydub (requires ffmpeg for non-wav)
        file_obj = io.BytesIO(data)
        
        # If format is known, use it; otherwise let pydub guess
        audio_segment = AudioSegment.from_file(file_obj, format=audio_format)
        
        # Convert to mono if stereo
        if audio_segment.channels > 1:
            audio_segment = audio_segment.set_channels(1)
            
        # Get metadata
        metadata = {
            "duration_seconds": audio_segment.duration_seconds,
            "sample_rate": audio_segment.frame_rate,
            "channels": audio_segment.channels,
            "format": audio_format or "unknown"
        }
        
        # Convert to numpy array
        # AudioSegment.get_array_of_samples() returns int16/int32 depending on sample_width
        samples = np.array(audio_segment.get_array_of_samples())
        
        # Normalize to float32 [-1, 1]
        if audio_segment.sample_width == 2:
            samples = samples.astype(np.float32) / 32768.0
        elif audio_segment.sample_width == 4:
            samples = samples.astype(np.float32) / 2147483648.0
        else:
            samples = samples.astype(np.float32) / (2.0 ** (8 * audio_segment.sample_width - 1))

        return samples, audio_segment.frame_rate, metadata

    except Exception as e:
        # Fallback to librosa if pydub fails (less likely to handle many formats without ffmpeg)
        # But here we assume ffmpeg is present (as per Dockerfile plan)
        raise RuntimeError(f"Failed to load audio: {str(e)}")


def load_bytes_from_upload(file) -> Tuple[bytes, str | None]:
    """
    Extracts raw bytes and content type from FastAPI UploadFile.
    """
    data = file.file.read()
    content_type = getattr(file, "content_type", None)
    return data, content_type
