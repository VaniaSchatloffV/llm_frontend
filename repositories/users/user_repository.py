from handlers.DBORMHandler import DB_ORM_Handler
from models.users import UserObject
from models.roles import RoleObject

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
    with DB_ORM_Handler() as db:
        user = db.getObjects(
            UserObject,
            UserObject.email == user_email,
            defer_cols=[],
            columns=[UserObject.id, UserObject.name, UserObject.lastname, UserObject.role_id]
        )
        if len(user) == 0:
            return {}
        return user.pop()


def get_role(role_id: int):
    with DB_ORM_Handler() as db:
        role = db.getObjects(
            RoleObject,
            RoleObject.id == role_id,
            defer_cols=[],
            columns=[RoleObject.role_name]
        )
        if len(role) == 0:
            return None
        return role.pop().get("role_name")

def insert_new_user(email: str, name: str, lastname: str, password: str):
    User = UserObject()
    User.email = email
    User.name = name
    User.lastname = lastname
    User.password = password
    User.role_id = 2
    with DB_ORM_Handler() as db:
        db.createTable(User)
        db.saveObject(User)
        