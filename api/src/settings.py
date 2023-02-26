from pydantic import BaseSettings


class Settings(BaseSettings):
    DB_URI: str 
    SECRET_KEY: str 
    ALGORITHM: str 
    ACCESS_TOKEN_EXPIRE_MINUTES: int 
    SNORT_ENGINE_URL: str

    POSTGRES_SERVER: str 
    POSTGRES_USER: str 
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_PORT: str
    ENVIRONMENT: str

    class Config:
        env_file = ".env"


settings = Settings()