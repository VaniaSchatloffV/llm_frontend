from helpers import api_helper

def test_conn():
    api_helper.ping()

def send_message(prompt: str):
    api_helper.send_message(prompt)