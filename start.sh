#!/bin/bash
docker network create mynetwork
docker rm postgres-db
docker run -d --name postgres-db --network mynetwork --env-file .db.env -p 5432:5432 -v pgdata:/var/lib/postgresql/data postgres:latest

docker build -t python-app .
docker rm python-app
docker run -d --name python-app --network mynetwork -p 8002:8002 -v $(pwd):/app --env-file .env python-app
