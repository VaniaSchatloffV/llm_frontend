#!/bin/bash

# Variables de entorno
DB_NAME="mydatabase"
DB_USER="myuser"
DB_PASSWORD="mypassword"
DB_PORT="5432"
APP_PORT="8002"

# Función para crear base de datos y usuario en PostgreSQL
create_db_and_user() {
    psql -c "CREATE DATABASE $DB_NAME;"
    psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
    psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
}

# Iniciar el servicio de PostgreSQL si no está ya en ejecución
pg_ctl status > /dev/null 2>&1
if [ $? -ne 0 ]; then
    pg_ctl start -D /usr/local/var/postgres
fi

# Verificar si la base de datos y el usuario ya existen
DB_EXISTS=$(psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")
USER_EXISTS=$(psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'")

# Crear base de datos y usuario si no existen
if [ "$DB_EXISTS" != "1" ]; then
    create_db_and_user
else
    echo "La base de datos $DB_NAME ya existe."
fi

if [ "$USER_EXISTS" != "1" ]; then
    psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
    psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
else
    echo "El usuario $DB_USER ya existe."
fi

# Verificar si el entorno virtual existe y eliminarlo si es así
if [ -d "venv" ]; then
    echo "Eliminando el entorno virtual existente..."
    rm -rf venv
fi

# Crear un nuevo entorno virtual
python3 -m venv venv

# Activar el entorno virtual
source venv/bin/activate

# Instalar las dependencias
pip install --no-cache-dir -r requirements.txt

# Establecer variables de entorno
export $(grep -v '^#' .env | xargs)

# Ejecutar la aplicación
./service_entrypoint.sh
