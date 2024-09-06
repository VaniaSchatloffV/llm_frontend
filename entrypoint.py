from app import create_app
from instance.config import get_settings

settings = get_settings()
host = settings.flask_run_host
port = settings.flask_run_port

app = create_app()
app.run(host=host, port=port)