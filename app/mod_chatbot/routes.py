import os
from . import chatbot_bp
from flask import session, jsonify, request, send_file, abort, render_template
from ..common import llm_api
from ..decorators.login_decorator import login_required
from ..decorators.access_decorator import permissions_required

messages = []

@chatbot_bp.route('/', methods=['POST'])
@login_required
@permissions_required(permissions_list=[1])
def send_message():
    data = request.get_json()
    message = data.get('message')
    if message:
        response = llm_api.send_message(message, session['conversation_id'], session['user_id'])
        session['conversation_id'] = response.get("conversation_id")
    return jsonify({'success': True, 'messages': llm_api.get_conversation(conversation_id=session['conversation_id'])})

@chatbot_bp.route('/get_messages/', methods=['GET'])
@login_required
@permissions_required(permissions_list=[1])
def get_messages():
    return jsonify(llm_api.get_conversation(conversation_id=session['conversation_id']))

@chatbot_bp.route('/get_conversations/', methods=['GET'])
@login_required
@permissions_required(permissions_list=[1])
def get_conversations():
    return jsonify(llm_api.get_user_conversations(user_id=session['user_id']))

@chatbot_bp.route('/set_conversation/', methods=['POST'])
@login_required
@permissions_required(permissions_list=[1])
def set_conversation():
    data = request.get_json()
    conversation_id = data.get('conversation_id')
    return llm_api.set_conversation(conversation_id)

@chatbot_bp.route('/downloadFile/', methods=['POST'])
@login_required
@permissions_required(permissions_list=[1])
def download_file():
    data = request.get_json()
    file_id = data.get('file_id')
    file_type = data.get('file_type')
    file = llm_api.download_file(file_id, file_type)
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


@chatbot_bp.route('/change_conversation_name/', methods=['POST'])
@login_required
@permissions_required(permissions_list=[1])
def change_conversation_name():
    data = request.get_json()
    conversation_id = data.get('conversation_id')
    name = data.get('name')
    return llm_api.change_conversation_name(conversation_id, name)

@chatbot_bp.get('/chat/')
@login_required
@permissions_required(permissions_list=[1], main_view=True)
def main_chat(*args, **kwargs):
    admin = kwargs.get('admin', False)
    chat = kwargs.get('chat', False)
    conversations = kwargs.get('conversations', False)
    metrics = kwargs.get('metrics', False)
    name = session.get('user_name')
    lastname = session.get('user_lastname')
    role = session.get('user_role')
    chat_template = render_template('chat.html', name=name, lastname=lastname, user_type=role, admin=admin, chat=chat, conversations=conversations, metrics=metrics)
    return chat_template

@chatbot_bp.route('/checkFile/', methods=['POST'])
@login_required
@permissions_required(permissions_list=[1])
def check_file():
    data = request.get_json()
    file_id = data.get('file_id')
    exists = llm_api.check_file(file_id)
    return {"result" : exists}
