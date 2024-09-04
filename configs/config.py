from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    environment : str
    flask_app : str
    flask_run_host : str
    flask_debug : int
    flask_secret_key : str
    postgres_user : str
    postgres_password : str
    postgres_host : str
    postgres_port : int
    postgres_db : str
    api_url : str
    
    class Config:
        env_file = ".env"

def get_settings():
    return Settings()
