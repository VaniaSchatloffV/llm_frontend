import os
from typing import Optional
import requests
import json

api_url = os.getenv("API_URL")

def get(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        print("Status Code:", response.status_code)
        print("Response Body:", response.json())
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except Exception as err:
        print(f"Other error occurred: {err}")

def post(url, url_params:Optional[dict] = None, body:Optional[dict] = None):
    try:
        response = requests.post(url, params=url_params, json=body)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except Exception as err:
        print(f"Other error occurred: {err}")

def ping():
    endpoint = "/ping/"
    get(api_url + endpoint)

def send_message(prompt: str):
    endpoint = "/sendMessage/"
    body = {
        "prompt": prompt,
        "conversation_id": 1
    }
    return post(url= api_url + endpoint, body=body)

