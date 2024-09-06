from flask import Blueprint
chatbot_bp = Blueprint('chatbot', __name__, template_folder='templates/chatbot')
from . import routes