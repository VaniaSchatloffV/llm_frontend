# llm_frontend

flask run

# Crear la red
docker network create mynetwork

# Crear y ejecutar el contenedor de PostgreSQL
docker run -d --name postgres-db --network mynetwork --env-file .db.env -p 5432:5432 -v pgdata:/var/lib/postgresql/data postgres:latest

# Construir la imagen de la aplicación web
docker build -t python-app .

# Crear y ejecutar el contenedor de la aplicación web
docker run -d --name python-app --network mynetwork -p 8002:8002 -v $(pwd):/app --env-file .env python-app
