import sqlalchemy as sal
from sqlalchemy.orm import registry
from sqlalchemy.sql import func
from ...common.DB import DB_ORM_Handler
from .roles import RoleObject
mapper_registry = registry()

Base = mapper_registry.generate_base()

def initialize_data():
    with DB_ORM_Handler() as db:
        db.createTable(UserObject)

class UserObject(Base):
    __tablename__ = 'users'
    __attributes__ = [
            'id', 'name', 'name', 'lastname', 'email', 'password', 'role_id', 'created_at', 'deleted'
        ]
    
    id                          = sal.Column('id', sal.BigInteger, primary_key=True, autoincrement=True)
    name                        = sal.Column('name', sal.String(length=128))
    lastname                    = sal.Column('lastname', sal.String(length=128))
    email                       = sal.Column('email', sal.String(length=256))
    password                    = sal.Column('password', sal.String(length=512))
    role_id                     = sal.Column('role_id', sal.Integer, sal.ForeignKey(RoleObject.id))
    created_at                  = sal.Column('created_at', sal.DateTime(timezone=True), server_default=func.now())
    deleted                     = sal.Column('deleted', sal.Boolean, default=False)
    
    def __repr__(self):
        return(f"UserObject (id={self.id}, name={self.name}, lastname={self.lastname}, created_at={self.created_at})")
    
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