from functools import wraps
from typing import Optional
from flask import redirect, url_for, flash, session

def contains_sublist(big_list, sublist):
    for i in sublist:
        if i not in big_list:
            return False
    return True


def permissions_required(permissions_list=[], main_view : Optional[bool] = False):
    from ..common.DB import DB_ORM_Handler
    from ..mod_users.models.role_permission_assoc import RolePermissionAssocObject
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
                if main_view:
                    admin = 2 in permissions or 3 in permissions or 6 in permissions or 7 in permissions
                    chat = 1 in permissions
                    conversations = 4 in permissions
                    metrics = 5 in permissions
                    kwargs['admin'] = admin
                    kwargs['chat'] = chat
                    kwargs['conversations'] = conversations
                    kwargs['metrics'] = metrics
                if contains_sublist(permissions, permissions_list):
                    return func(*args, **kwargs)
            flash('No tienes permisos para acceder a esta página.', 'error')
            return redirect(url_for('auth.home'))
        return wrapper
    return decorator
