## Duplicate Detection Strategy

The platform uses a three-layer duplicate detection pipeline:

1. SHA-256 hash for exact binary matches
2. Chromaprint fingerprints for perceptual matches across encodings
3. Audio embeddings (MFCC + spectral features) with cosine similarity

See `Audio-Dedup-Platform-Plan.md` section **2. Multi-Layer Duplicate Detection Strategy** for full details.

This document will be expanded with implementation notes, thresholds, and tuning guidance.

