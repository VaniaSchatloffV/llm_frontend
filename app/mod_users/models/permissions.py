import sqlalchemy as sal
from sqlalchemy.orm import registry
from sqlalchemy.sql import func
mapper_registry = registry()

Base = mapper_registry.generate_base()

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