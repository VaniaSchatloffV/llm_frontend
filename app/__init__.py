from instance.config import get_settings

import os

from datetime import timedelta
from flask import Flask, jsonify, session, get_flashed_messages
from markupsafe import escape

from .mod_administration import admin_bp
from .mod_chatbot import chatbot_bp
from .mod_conversation_table import conv_bp
from .mod_metric_table import metric_bp
from .mod_users import auth_bp
from .mod_users.models import initialize_models

initialize_models()

def create_app():
    settings = get_settings()

    app = Flask(__name__)
    app.config['SECRET_KEY'] = settings.flask_secret_key
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=10)

    @app.before_request
    def before_request():
        session.permanent = True

    @app.after_request
    def after_request(response):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        return response

    app.register_blueprint(admin_bp, url_prefix='/adm/')
    app.register_blueprint(chatbot_bp, url_prefix='/c/')
    app.register_blueprint(conv_bp, url_prefix='/conv/')
    app.register_blueprint(metric_bp, url_prefix='/met/')
    app.register_blueprint(auth_bp, url_prefix="/")

    @app.route('/get_flash_messages')
    def get_flash_messages():
        messages = get_flashed_messages(with_categories=True)
        return jsonify(messages)


    return app
