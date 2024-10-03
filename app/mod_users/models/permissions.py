import sqlalchemy as sal
from sqlalchemy.orm import registry
from sqlalchemy.sql import func
from ...common.DB import DB_ORM_Handler
mapper_registry = registry()

Base = mapper_registry.generate_base()
def initialize_data():
    base_permissions = [{
                            "id": 1,
                            "name": "consulta_chatbot",
                            "description": "Permite al usuario realizar consultas al chatbot."
                        },
                        {
                            "id": 2,
                            "name": "cambiar_permisos_de_rol",
                            "description": "Permite al usuario modificar los permisos asignados a los diferentes roles de usuario."
                        },
                        {
                            "id": 3,
                            "name": "asignar_roles_usuario",
                            "description": "Permite asignar o modificar los roles de los usuarios."
                        },
                        {
                            "id": 4,
                            "name": "ver_conversaciones",
                            "description": "Permite al usuario ver los datos de las conversaciones."
                        },
                        {
                            "id": 5,
                            "name": "ver_metricas",
                            "description": "Permite al usuario acceder a los datos de las métricas."
                        },
                        {
                            "id": 6,
                            "name": "crear_usuarios",
                            "description": "Permite al usuario crear nuevos usuarios."
                        },
                        {
                            "id": 7,
                            "name": "borrar_usuarios",
                            "description": "Permite al usuario eliminar usuarios existentes."
                        }]
    with DB_ORM_Handler() as db:
        permissions = []
        db.createTable(PermissionObject)
        for i in base_permissions:
            perm = PermissionObject()
            perm.set_dictionary(i)
            permissions.append(perm)
        db.saveObject(p_objs=permissions)


class PermissionObject(Base):
    __tablename__ = 'permissions'
    __attributes__ = [
            'id', 'name', 'description'
        ]
    
    id                          = sal.Column('id', sal.BigInteger, primary_key=True, autoincrement=True)
    name                        = sal.Column('name', sal.String(length=256))
    description                 = sal.Column('description', sal.String(length=512))

    def __repr__(self):
        return(f"PermissionObject (id={self.id}, name={self.name})")
    
    def set_dictionary(self, data: dict):
        for attr in self.__attributes__:
            value = data.get(attr)
            if value is not None:
                setattr(self, attr, value)
    
    def get_dictionary(self):
        result = {}
        for attr in self.__attributes__:
            result[attr] = getattr(self, attr)
        return result