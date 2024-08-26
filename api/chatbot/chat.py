from flask import Blueprint, render_template, session, jsonify, request
from controllers.llm import llm_controller
from decorators.login_decorator import login_required

messages = []


llm_blueprint = Blueprint('chat', __name__)

@llm_blueprint.route('/', methods=['POST'])
@login_required
def send_message():
    data = request.get_json()
    message = data.get('message')
    if message:
        response = llm_controller.send_message(message, session['conversation_id'], session['user_id'])
        session['conversation_id'] = response.get("conversation_id")
    return jsonify({'success': True, 'messages': llm_controller.get_conversation(conversation_id=session['conversation_id'])})

@llm_blueprint.route('/get_messages/', methods=['GET'])
def get_messages():
    #data = request.get_json()
    #conversation_id = data.get("conversation_id")
    return jsonify(llm_controller.get_conversation(conversation_id=session['conversation_id']))

@llm_blueprint.route('/get_conversations/', methods=['GET'])
def get_conversations():
    #data = request.get_json()
    #conversation_id = data.get("conversation_id")
    return jsonify(llm_controller.get_user_conversations(user_id=session['user_id']))