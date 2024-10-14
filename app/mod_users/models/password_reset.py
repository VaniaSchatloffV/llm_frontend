from datetime import timedelta
import sqlalchemy as sal
from sqlalchemy.orm import registry
from sqlalchemy.sql import func
from ...common.DB import DB_ORM_Handler
from .roles import RoleObject
from instance.config import get_settings

settings = get_settings()
mapper_registry = registry()

Base = mapper_registry.generate_base()

def initialize_data():
    with DB_ORM_Handler() as db:
        db.createTable(PasswordResetObject)

class PasswordResetObject(Base):
    __tablename__ = 'password_reset'
    __attributes__ = [
            'id', 'email', 'user_id', 'old_password', 'code' 'created_at', 'expires_at'
        ]
    
    id                          = sal.Column('id', sal.BigInteger, primary_key=True, autoincrement=True)
    email                       = sal.Column('email', sal.String(length=256))
    user_id                     = sal.Column('user_id', sal.BigInteger)
    old_password                = sal.Column('old_password', sal.String(length=512))
    code                        = sal.Column('code', sal.String(length=10))
    reset                       = sal.Column('reset', sal.Boolean, default = False)
    created_at                  = sal.Column('created_at', sal.DateTime(timezone=True), server_default=func.now())
    expires_at                  = sal.Column('expires_at', sal.DateTime(timezone=True), server_default=func.now()+timedelta(minutes=settings.file_expiration_time_delta))
    
    def __repr__(self):
        return(f"PasswordResetObject (id={self.id}, email={self.email}, code={self.code}, created_at={self.created_at})")
    
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