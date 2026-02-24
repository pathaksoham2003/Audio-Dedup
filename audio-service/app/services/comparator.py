from __future__ import annotations

from typing import Iterable

import numpy as np


def cosine_similarity(a: Iterable[float], b: Iterable[float]) -> float:
    a_vec = np.array(list(a), dtype=float)
    b_vec = np.array(list(b), dtype=float)
    if a_vec.size == 0 or b_vec.size == 0:
        return 0.0
    denom = np.linalg.norm(a_vec) * np.linalg.norm(b_vec)
    if denom == 0:
        return 0.0
    return float(np.dot(a_vec, b_vec) / denom)

