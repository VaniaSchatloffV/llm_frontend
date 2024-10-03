import sqlalchemy as sal
from sqlalchemy.orm import registry
from sqlalchemy.sql import func
from ...common.DB import DB_ORM_Handler
from .roles import RoleObject
from .permissions import PermissionObject
mapper_registry = registry()

Base = mapper_registry.generate_base()

def initialize_data():
    base_associations = [
        {
            "permission_id" : 1,
            "role_id" : 1
        },
        {
            "permission_id" : 2,
            "role_id" : 1
        },
        {
            "permission_id" : 3,
            "role_id" : 1
        },
        {
            "permission_id" : 4,
            "role_id" : 1
        },
        {
            "permission_id" : 5,
            "role_id" : 1
        },
        {
            "permission_id" : 6,
            "role_id" : 1
        },
        {
            "permission_id" : 7,
            "role_id" : 1
        }
    ]
    with DB_ORM_Handler() as db:
        db.createTable(RolePermissionAssocObject)
        assocs = []
        for i in base_associations:
            assoc = RolePermissionAssocObject()
            assoc.set_dictionary(i)
            assocs.append(assoc)
        db.saveObject(p_objs=assocs)

class RolePermissionAssocObject(Base):
    __tablename__ = 'role_permission_associations'
    __attributes__ = [
            'id', 'permission_id', 'role_id'
        ]
    permission_id               = sal.Column('permission_id', sal.Integer, sal.ForeignKey(PermissionObject.id), primary_key=True)
    role_id                     = sal.Column('role_id', sal.Integer, sal.ForeignKey(RoleObject.id),  primary_key=True)
    
    def __repr__(self):
        return(f"RolePermissionAssocObject (id={self.id}, role_id={self.role_id}, permission_id={self.permission_id}, created_at={self.created_at})")
    
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