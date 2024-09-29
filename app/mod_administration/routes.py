from flask import Blueprint, render_template, session
from ..decorators.login_decorator import login_required
from . import admin_bp

@admin_bp.get('/administration/')
@login_required
def main_administration():
    name = session.get('user_name')
    lastname = session.get('user_lastname')
    role = session.get('user_role')
    administration_template = render_template('administration.html', name=name, lastname=lastname, user_type=role)
    return administration_template