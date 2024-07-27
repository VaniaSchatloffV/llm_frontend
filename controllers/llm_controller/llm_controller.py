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
    return api_helper.post(url= api_helper.api_url + endpoint, body=body)