from flask import Blueprint, render_template, session, jsonify, request
from controllers.llm_controller import llm_controller
from decorators.login_decorator import login_required

messages = []


llm_blueprint = Blueprint('chat', __name__)

@llm_blueprint.route('/', methods=['POST'])
@login_required
def send_message():
    data = request.get_json()
    message = data.get('message')
    if message:
        messages.append(message)
        assistant_message = llm_controller.send_message(message)
        messages.append(assistant_message)
    return jsonify({'success': True, 'messages': messages})

@llm_blueprint.route('/get_messages/', methods=['GET'])
def get_messages():
    return jsonify({'messages': messages})