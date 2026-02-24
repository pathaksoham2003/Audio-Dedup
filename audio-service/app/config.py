from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    fingerprint_similarity_threshold: float = 0.85
    embedding_similarity_threshold: float = 0.92
    suspicious_similarity_threshold: float = 0.75

    class Config:
        env_prefix = ""
        case_sensitive = False


settings = Settings()

