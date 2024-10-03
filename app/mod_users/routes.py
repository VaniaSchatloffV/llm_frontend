from flask import Blueprint, render_template, session
from ..common import user_controller
from ..decorators.login_decorator import login_required
from . import auth_bp

@auth_bp.get('/')
def index():
    return render_template('index.html')

@auth_bp.route('/register/')
def register_view():
    return render_template('register.html')

@auth_bp.route('/login/', methods=['POST'])
def login():
    return user_controller.login()

@auth_bp.route('/register/', methods=['POST'])
def register():
    return user_controller.register()

@auth_bp.route('/logout')
@login_required
def logout():
    return user_controller.logout()


