from flask import Blueprint, render_template, session, request
from ..decorators.login_decorator import login_required
from ..decorators.access_decorator import permissions_required
from . import admin_bp
from ..common import user_controller

@admin_bp.get('/administration/users/')
@login_required
@permissions_required(permissions_list=[3,6,7], main_view=True)
def main_administration(*args, **kwargs):
    admin = kwargs.get('admin', False)
    chat = kwargs.get('chat', False)
    conversations = kwargs.get('conversations', False)
    metrics = kwargs.get('metrics', False)
    name = session.get('user_name')
    lastname = session.get('user_lastname')
    role = session.get('user_role')
    administration_template = render_template('administration_users.html', name=name, lastname=lastname, user_type=role, admin=admin, chat=chat, conversations=conversations, metrics=metrics)
    return administration_template

@admin_bp.get('/administration/roles/')
@login_required
@permissions_required(permissions_list=[2], main_view=True)
def main_administration_role(*args, **kwargs):
    admin = kwargs.get('admin', False)
    chat = kwargs.get('chat', False)
    conversations = kwargs.get('conversations', False)
    metrics = kwargs.get('metrics', False)
    name = session.get('user_name')
    lastname = session.get('user_lastname')
    role = session.get('user_role')
    administration_template = render_template('administration_roles.html', name=name, lastname=lastname, user_type=role, admin=admin, chat=chat, conversations=conversations, metrics=metrics)
    return administration_template

@admin_bp.get('/administration/permissions/')
@login_required
@permissions_required(permissions_list=[2], main_view=True)
def main_administration_permission(*args, **kwargs):
    admin = kwargs.get('admin', False)
    chat = kwargs.get('chat', False)
    conversations = kwargs.get('conversations', False)
    metrics = kwargs.get('metrics', False)
    name = session.get('user_name')
    lastname = session.get('user_lastname')
    role = session.get('user_role')
    administration_template = render_template('administration_permissions.html', name=name, lastname=lastname, user_type=role, admin=admin, chat=chat, conversations=conversations, metrics=metrics)
    return administration_template

@admin_bp.get('/users/')
@login_required
@permissions_required(permissions_list=[3,6,7])
def get_users():
    offset = request.args.get('offset')
    limit = request.args.get('limit')
    return user_controller.get_all_users(offset,limit)

@admin_bp.get('/roles/')
@login_required
@permissions_required(permissions_list=[2])
def get_roles():
    offset = request.args.get('offset')
    limit = request.args.get('limit')
    return user_controller.get_all_roles(offset,limit)

@admin_bp.get('/permissions/')
@login_required
@permissions_required(permissions_list=[2])
def get_permissions():
    offset = request.args.get('offset')
    limit = request.args.get('limit')
    return user_controller.get_all_permissions(offset,limit)

@admin_bp.post('/addRole/')
@login_required
@permissions_required(permissions_list=[3,6,7])
def add_role_to_user():
    data = request.get_json()
    user_id = data.get('user_id')
    role_id = data.get('role_id')
    return user_controller.add_role_to_user(user_id,role_id)

@admin_bp.post('/createRole/')
@login_required
@permissions_required(permissions_list=[2])
def create_role():
    data = request.get_json()
    role_name = data.get('new_role_name')
    permissions = data.get('permissions')
    return user_controller.create_role(role_name, permissions)


@admin_bp.post('/updateRole/')
@login_required
@permissions_required(permissions_list=[2])
def update_role():
    data = request.get_json()
    role_id = data.get('role_id')
    role_name = data.get('new_role_name', None)
    permissions = data.get('permissions', None)
    return user_controller.update_role(role_id, permissions, role_name)

@admin_bp.post('/deleteRole/')
@login_required
@permissions_required(permissions_list=[2])
def delete_role():
    data = request.get_json()
    role_id = data.get('role_id')
    return user_controller.delete_role(role_id)


