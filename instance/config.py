from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    environment : str
    flask_app : str
    flask_run_host : str
    flask_run_port : int
    flask_debug : int
    flask_secret_key : str
    postgres_user : str
    postgres_password : str
    postgres_host : str
    postgres_port : int
    postgres_db : str
    postgres_schema : str
    api_url : str
    temp_files : str
    auth0_domain : str
    api_identifier : str
    auth0_client_id : str
    auth0_client_secret : str
    
    class Config:
        env_file = ".env"

def get_settings():
    return Settings()
