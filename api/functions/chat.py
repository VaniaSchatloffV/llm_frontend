from flask import Blueprint, render_template, session
from decorators.login_decorator import login_required

chat_blueprint = Blueprint('function_chat', __name__)

@chat_blueprint.get('/chat/')
@login_required
def main_chat():
    name = session.get('user_name')
    lastname = session.get('user_lastname')
    role = session.get('user_role')
    chat_template = render_template('functions/chat.html')
    return render_template('main.html', name=name, lastname=lastname, user_type=role, data=chat_template)