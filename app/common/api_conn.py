import os
from typing import Optional
import requests
import json

from instance.config import get_settings

settings = get_settings()

api_url = settings.api_url
AUTH0_DOMAIN = settings.auth0_domain
API_IDENTIFIER = settings.api_identifier
CLIENT_ID = settings.auth0_client_id
CLIENT_SECRET = settings.auth0_client_secret

def get_access_token():
    url = f"https://{AUTH0_DOMAIN}/oauth/token"
    headers = {'content-type': 'application/json'}
    body = {
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'audience': API_IDENTIFIER
    }
    response = requests.post(url, json=body, headers=headers)
    return response.json().get('access_token')

def get(url, url_params: Optional[dict] = None, body: Optional[dict] = None):
    if api_url not in url:
        url = api_url + url
    try:
        env = True if settings.environment == "prod" else False
        access_token = get_access_token()
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(url, params=url_params, json=body, verify=env, headers=headers)
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
        access_token = get_access_token()
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(url, params=url_params, json=body, verify=verify_ssl, stream=True, headers=headers)
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
        access_token = get_access_token()
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.post(url, params=url_params, json=body, verify=env, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except Exception as err:
        print(f"Other error occurred: {err}")


