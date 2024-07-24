from flask import Blueprint, render_template, session
from controllers.users import user_controller
from decorators.login_decorator import login_required

user_blueprint = Blueprint('users', __name__)

@user_blueprint.get('/')
def index():
    return render_template('index.html')

@user_blueprint.route('/register/')
def register_view():
    return render_template('register.html')

@user_blueprint.route('/login/', methods=['POST'])
def login():
    return user_controller.login()

@user_blueprint.route('/register/', methods=['POST'])
def register():
    return user_controller.register()

@user_blueprint.route('/logout')
@login_required
def logout():
    return user_controller.logout()


