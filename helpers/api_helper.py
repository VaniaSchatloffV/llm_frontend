import os
import requests

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

def ping():
    endpoint = "/ping"
    get(api_url + endpoint)