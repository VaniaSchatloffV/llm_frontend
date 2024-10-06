from functools import wraps
from flask import redirect, url_for, flash, session
from ..common.DB import DB_ORM_Handler
from ..mod_users.models.role_permission_assoc import RolePermissionAssocObject


def contains_sublist(big_list, sublist):
    sublist_length = len(sublist)
    for i in range(len(big_list) - sublist_length + 1):
        if big_list[i:i + sublist_length] == sublist:
            return True
    return False

def permissions_required(permissions_list = []):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            role_id = session.get('role_id', None)
            if role_id:
                with DB_ORM_Handler() as db:
                    permissions = db.getObjects(
                        RolePermissionAssocObject,
                        RolePermissionAssocObject.role_id == role_id,
                        columns=[RolePermissionAssocObject.permission_id]
                    )
                    permissions = [perm.get("permission_id") for perm in permissions]
                if contains_sublist(permissions, permissions_list):
                    return func(*args, **kwargs)
            
            flash('No tienes permisos para acceder a esta página.', 'error')
            return redirect(url_for('auth.home'))
        return wrapper
    return decorator
