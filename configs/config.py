from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    flask_app : str
    flask_run_host : str
    flask_debug : int
    flask_secret_key : str
    database_url : str
    postgres_user : str
    postgres_password : str
    postgres_host : str
    postgres_port : int
    postgres_db : str
    api_url : str
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()