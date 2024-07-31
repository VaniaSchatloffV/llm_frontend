from handlers.DBHandler import DBHandler

CHECK_USER = """
    SELECT
        id, name, lastname, password, role_id
    FROM
        users
    WHERE
        email = %s
"""

GET_ROLE = """
    SELECT
        role_name
    FROM
        roles
    WHERE
        id = %s
"""

INSERT_USER = """
    INSERT INTO users(
        email, name, lastname, password, role_id
    ) VALUES
    (%s, %s, %s, %s, 2)
"""

def get_user(user_email: str):
    """
    Retorna diccionario con
        - id
        - name
        - lastname
        - password
        - role_id
    Almacenados en la base de datos. Si el usuario no existe, retorna diccionario vacío.
    """
    with DBHandler() as db:
        user = db.select(CHECK_USER, (user_email,))
    if user:
        return {
            "id"        : user[0][0],
            "name"      : user[0][1],
            "lastname"  : user[0][2],
            "password"  : user[0][3],
            "role_id"   : user[0][4]
        }
    else:
        return {}


def get_role(role_id: int):
    with DBHandler() as db:
        role = db.select(GET_ROLE, (role_id,))
        if role:
            return role[0][0]
        else:
            return None

def insert_new_user(email: str, name: str, lastname: str, password: str):
    with DBHandler() as db:
        db.execute(INSERT_USER, (email, name, lastname, password))
        