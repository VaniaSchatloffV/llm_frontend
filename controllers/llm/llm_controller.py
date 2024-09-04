import os
from flask.json import jsonify
from flask import session
from helpers import api_helper

def ping():
    endpoint = "/ping/"
    return api_helper.get(api_helper.api_url + endpoint)

def send_message(prompt: str, conversation_id: int, user_id: int):
    endpoint = "/sendMessage/"
    body = {
        "prompt": prompt,
        "conversation_id": conversation_id,
        "user_id": user_id
    }
    return api_helper.post(url= endpoint, body=body)

def get_conversation(conversation_id: int):
    endpoint = "/getConversationMessages/"
    body = {
        "conversation_id": conversation_id
    }
    conversation = api_helper.get(url= endpoint, body=body)
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
    endpoint = "/getConversations/"
    body = {
        "user_id": user_id
    }
    conversations = api_helper.get(url= endpoint, body=body)
    return conversations


def set_conversation(conversation_id: int):
    try:
        session["conversation_id"] = conversation_id
        return {'success': True}
    except Exception as e:
        return {'success': False}

def download_file(file_id: int, file_type: str):
    if file_type == "csv":
        endpoint = "/download/csv"
    if file_type == "xlsx":
        endpoint = "/download/xlsx"
    body = {
        "file_id": file_id
    }
    path ="temp_files/" + str(file_id) + "." + file_type
    data = api_helper.get_file(url= endpoint, body=body)
    with open(path, 'w') as file:
        file.write(data)
    return {
        "file_path" : path
    }

def change_conversation_name(conversation_id: int, name: str):
    body = {
        "conversation_id": conversation_id,
        "name": name
    }
    return api_helper.post(url = "/changeConversationName/", body=body)