import os
from typing import Optional
import requests
import json

from instance.config import get_settings

settings = get_settings()

api_url = settings.api_url

def get(url, url_params: Optional[dict] = None, body: Optional[dict] = None):
    if api_url not in url:
        url = api_url + url
    try:
        env = True if settings.environment == "prod" else False
        response = requests.get(url, params=url_params, json=body, verify=env)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except Exception as err:
        print(f"Other error occurred: {err}")

def get_file(url, url_params: Optional[dict] = None, body: Optional[dict] = None):
    if api_url not in url:
        url = api_url + url
    try:
        verify_ssl = True if settings.environment == "prod" else False
        
        response = requests.get(url, params=url_params, json=body, verify=verify_ssl, stream=True)
        response.raise_for_status()
        return response.iter_content(chunk_size=8192)

    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except Exception as err:
        print(f"Other error occurred: {err}")

def post(url, url_params:Optional[dict] = None, body:Optional[dict] = None):
    if api_url not in url:
        url = api_url + url
    try:
        env = True if settings.environment == "prod" else False
        response = requests.post(url, params=url_params, json=body, verify=env)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except Exception as err:
        print(f"Other error occurred: {err}")


