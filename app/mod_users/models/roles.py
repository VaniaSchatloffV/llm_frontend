import sqlalchemy as sal
from sqlalchemy.orm import registry
from sqlalchemy.sql import func
mapper_registry = registry()

Base = mapper_registry.generate_base()

class RoleObject(Base):
    __tablename__ = 'roles'
    __attributes__ = [
            'id', 'role_name'
        ]
    
    id                          = sal.Column('id', sal.BigInteger, primary_key=True, autoincrement=True)
    role_name                   = sal.Column('role_name', sal.String(length=256))

    def __repr__(self):
        return(f"RoleObject (id={self.id}, role_name={self.role_name})")
    
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