import io
from flask.json import jsonify
from flask import session
from . import api_conn
from instance.config import get_settings

settings = get_settings()

def ping():
    endpoint = "/ping/"
    return api_conn.get(api_conn.api_url + endpoint)

def send_message(prompt: str, conversation_id: int, user_id: int):
    endpoint = "/chat/sendMessage/"
    body = {
        "prompt": prompt,
        "conversation_id": conversation_id,
        "user_id": user_id
    }
    return api_conn.post(url= endpoint, body=body)

def get_conversation(conversation_id: int):
    endpoint = "/chat/getConversationMessages/"
    body = {
        "conversation_id": conversation_id
    }
    conversation = api_conn.get(url= endpoint, body=body)
    if conversation:
        messages = []
        for message in conversation:
            if message.get("role") == "user":
                messages.append(message)
            else:
                content = message.get("content")
                msg = {"role": "assistant", "content": content}
                messages.append(msg)
        return {'messages': messages}
    else:
        return []


def get_user_conversations(user_id: int):
    endpoint = "/chat/getConversations/"
    body = {
        "user_id": user_id
    }
    conversations = api_conn.get(url= endpoint, body=body)
    return conversations


def set_conversation(conversation_id: int):
    try:
        session["conversation_id"] = conversation_id
        return {'success': True}
    except Exception as e:
        return {'success': False}

def download_file(file_id: int, file_type: str):
    if file_type == "csv":
        endpoint = "/files/download/csv/"
    elif file_type == "xlsx":
        endpoint = "/files/download/xlsx/"
    
    body = {
        "file_id": file_id
    }
    path = settings.temp_files + str(file_id) + "." + file_type
    response = api_conn.get_file(url=endpoint, body=body)
    if response:
        with open(path, 'wb') as file:
            for chunk in response:
                if chunk:
                    file.write(chunk)
    
        return {
            "file_path" : path
        }


def change_conversation_name(conversation_id: int, name: str):
    body = {
        "conversation_id": conversation_id,
        "name": name
    }
    return api_conn.post(url = "/chat/changeConversationName/", body=body)

def get_conversations_table(limit = 10, offset = 0):
    endpoint = "/chat/getConversationTable/"
    body = {
        "limit" : limit,
        "offset" : offset
    }
    conversations_table = api_conn.get(url= endpoint, body=body)
    return conversations_table

def check_file(file_id: int, file_type: str):
    endpoint = "/files/check/"
    body = {
        "file_id": file_id,
        "file_type": file_type
    }
    exists = api_conn.get(url = endpoint, body = body)
    return exists