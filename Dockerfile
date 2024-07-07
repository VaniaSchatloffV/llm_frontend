# Dockerfile for Python application
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app
RUN chmod -x service_entrypoint.sh
CMD ["./service_entrypoint.sh"]  # Reemplaza con el comando de inicio de tu aplicación Python
