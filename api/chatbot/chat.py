import os
from flask import Blueprint, render_template, session, jsonify, request, send_file, abort, flash
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
@login_required
def get_messages():
    #data = request.get_json()
    #conversation_id = data.get("conversation_id")
    return jsonify(llm_controller.get_conversation(conversation_id=session['conversation_id']))

@llm_blueprint.route('/get_conversations/', methods=['GET'])
@login_required
def get_conversations():
    #data = request.get_json()
    #conversation_id = data.get("conversation_id")
    return jsonify(llm_controller.get_user_conversations(user_id=session['user_id']))

@llm_blueprint.route('/set_conversation/', methods=['POST'])
@login_required
def set_conversation():
    data = request.get_json()
    conversation_id = data.get('conversation_id')
    return llm_controller.set_conversation(conversation_id)

@llm_blueprint.route('/downloadFile/', methods=['POST'])
@login_required
def download_file():
    data = request.get_json()
    file_id = data.get('file_id')
    file_type = data.get('file_type')
    file = llm_controller.download_file(file_id, file_type)
    file_path = file.get("file_path")
    if not os.path.exists(file_path):
        abort(404, description="File not found")
    def remove_file_after_send(file_path):
        try:
            os.remove(file_path)
        except Exception as e:
            print(f"Error removing file: {e}")
    
    response = send_file(file_path, as_attachment=True, download_name=os.path.basename(file_path))
    response.call_on_close(lambda: remove_file_after_send(file_path))
    return response


@llm_blueprint.route('/change_conversation_name/', methods=['POST'])
@login_required
def change_conversation_name():
    data = request.get_json()
    conversation_id = data.get('conversation_id')
    name = data.get('name')
    return llm_controller.change_conversation_name(conversation_id, name)

