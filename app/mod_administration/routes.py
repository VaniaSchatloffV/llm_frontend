from flask import Blueprint, render_template, session, request
from ..decorators.login_decorator import login_required
from . import admin_bp
from ..common import user_controller

@admin_bp.get('/administration/')
@login_required
def main_administration():
    name = session.get('user_name')
    lastname = session.get('user_lastname')
    role = session.get('user_role')
    administration_template = render_template('administration.html', name=name, lastname=lastname, user_type=role)
    return administration_template

@admin_bp.get('/users/')
@login_required
def get_users():
    offset = request.args.get('offset')
    limit = request.args.get('limit')
    return user_controller.get_all_users(offset,limit)

@admin_bp.get('/roles/')
@login_required
def get_roles():
    offset = request.args.get('offset')
    limit = request.args.get('limit')
    return user_controller.get_all_roles(offset,limit)

@admin_bp.get('/permissions/')
@login_required
def get_permissions():
    offset = request.args.get('offset')
    limit = request.args.get('limit')
    return user_controller.get_all_permissions(offset,limit)

@admin_bp.post('/addRole/')
@login_required
def add_role_to_user():
    data = request.get_json()
    user_id = data.get('user_id')
    role_id = data.get('role_id')
    return user_controller.add_role_to_user(user_id,role_id)
