import psycopg2

# Datos de conexión a la base de datos PostgreSQL
db_host = '192.168.0.2'      # Cambia a la dirección IP del contenedor si es diferente
db_port = '5432'           # Puerto por defecto de PostgreSQL
db_name = 'mydatabase'     # Nombre de la base de datos
db_user = 'myuser'         # Nombre de usuario de PostgreSQL
db_password = 'mypassword' # Contraseña del usuario

# Establecer conexión a la base de datos
try:
    connection = psycopg2.connect(
        host=db_host,
        port=db_port,
        database=db_name,
        user=db_user,
        password=db_password
    )

    # Crear un cursor para ejecutar operaciones SQL
    cursor = connection.cursor()

    # Ejemplo de consulta SQL
    cursor.execute('SELECT version()')

    # Obtener el resultado de la consulta
    db_version = cursor.fetchone()
    print('Versión de PostgreSQL:', db_version)

    # Cerrar el cursor y la conexión
    cursor.close()
    connection.close()

except psycopg2.Error as e:
    print('Error al conectar a PostgreSQL:', e)
