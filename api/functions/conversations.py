from flask import Blueprint, render_template, session
from decorators.login_decorator import login_required

conversations_blueprint = Blueprint('function_conversations', __name__)

@conversations_blueprint.get('/conversations/')
@login_required
def main_conversations():
    name = session.get('user_name')
    lastname = session.get('user_lastname')
    role = session.get('user_role')
    conversations_template = render_template('functions/conversations.html')
    return render_template('main.html', name=name, lastname=lastname, user_type=role, data=conversations_template)