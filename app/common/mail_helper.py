import os
import base64
import pickle
from email.message import EmailMessage
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from jinja2 import Environment, FileSystemLoader

from instance.config import get_settings
settings = get_settings()

# El alcance de acceso
SCOPES = ['https://www.googleapis.com/auth/gmail.send']

def authenticate_gmail():
    """Autenticar y obtener las credenciales de Gmail."""
    creds = None
    # El archivo token.pickle almacena el token de acceso y actualización del usuario.
    # Si ya existe, se usará directamente. Si no, se inicia el flujo de OAuth.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)

    # Si no hay credenciales disponibles o están expiradas, pide al usuario autenticarse.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)

        # Guardar las credenciales para la próxima ejecución
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    return creds

def send_email(destination_mail: str, subject: str, body_html: str):
    """Enviar un correo usando la API de Gmail con un cuerpo en HTML."""
    creds = authenticate_gmail()

    try:
        service = build('gmail', 'v1', credentials=creds)
        message = EmailMessage()
        message.add_alternative(body_html, subtype='html')
        message['To'] = destination_mail
        message['From'] = settings.email_sender
        message['Subject'] = subject

        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        send_message = service.users().messages().send(userId="me", body={'raw': raw_message}).execute()
        print(f'Correo enviado, ID del mensaje: {send_message["id"]}')

    except HttpError as error:
        print(f'Ocurrió un error: {error}')

def get_template(template: str):
    """
    Recibe el nombre del template ubicado en mail_templates/.
    Retorna template
    """
    env = Environment(loader=FileSystemLoader('.'))
    return env.get_template("app/common/mail_templates/"+template)

def send_recuperation_email(destination_mail, name, lastname, code):
    template = get_template('basic_mail_template.html')
    template_recuperar = get_template('forgot_password_template.html')
    recuperation_data = {
        "name": name,
        "lastname": lastname,
        "code": code,
        "minutes": settings.file_expiration_time_delta
    }
    recuperar_body = template_recuperar.render(recuperation_data)
    data = {
        'title': 'Restablecer contraseña',
        'description': recuperar_body,
    }
    html_body = template.render(data)
    send_email(destination_mail, "NexQuery: Recuperar contraseña", html_body)

def send_default_email(destination_mail, title, description, subject):
    template = get_template('basic_mail_template.html')
    data = {
        "title": title,
        "description": description
    }
    html_body = template.render(data)
    send_email(destination_mail, subject, html_body)