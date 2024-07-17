from flask import Blueprint, render_template, session
from controllers.users import user_controller


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
def logout():
    return user_controller.logout()

@user_blueprint.get('/main/')
def main():
    name = session.get('user_name')
    lastname = session.get('user_lastname')
    role = session.get('user_role')
    return render_template('main.html', name=name, lastname=lastname, user_type=role)
