from flask import Blueprint, render_template, session
from decorators.login_decorator import login_required

administration_blueprint = Blueprint('function_administration', __name__)

@administration_blueprint.get('/administration/')
@login_required
def main_administration():
    name = session.get('user_name')
    lastname = session.get('user_lastname')
    role = session.get('user_role')
    administration_template = render_template('functions/administration.html')
    return render_template('main.html', name=name, lastname=lastname, user_type=role, data=administration_template)