from configs.config import get_settings

import os

from datetime import timedelta
from flask import Flask, Blueprint, jsonify, url_for, request, render_template, redirect, flash, session
from markupsafe import escape

from api.login.users import user_blueprint
from api.chatbot.chat import llm_blueprint
from api.functions.conversations import conv_blueprint
from api.functions.chat import chat_blueprint
from api.chatbot.conversation import conversation_blueprint
from api.functions.metrics import metrics_blueprint
from api.functions.administration import administration_blueprint

settings = get_settings()

app = Flask(__name__)
app.config['SECRET_KEY'] = settings.flask_secret_key
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=5)

@app.before_request
def before_request():
    session.permanent = True

@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response

app.register_blueprint(user_blueprint, url_prefix='/')
app.register_blueprint(chat_blueprint, url_prefix='/')
app.register_blueprint(conv_blueprint, url_prefix='/')
app.register_blueprint(metrics_blueprint, url_prefix='/')
app.register_blueprint(administration_blueprint, url_prefix="/")
app.register_blueprint(llm_blueprint, url_prefix='/c/')
app.register_blueprint(conversation_blueprint, url_prefix='/conv/')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8002)
