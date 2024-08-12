from flask.json import jsonify
from helpers import api_helper

def ping():
    endpoint = "/ping/"
    api_helper.get(api_helper.api_url + endpoint)

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
    print(conversation)
    if conversation:
        messages = []
        for message in conversation:
            if message.get("role") == "user":
                messages.append(message.get("content"))
            else:
                messages.append(message.get("content")[0].get("text"))
        return jsonify({'messages': messages})
    else:
        return []