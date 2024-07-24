import os
from flask import Flask, Blueprint, jsonify, url_for, request, render_template, redirect, flash, session
from markupsafe import escape

from api.login.users import user_blueprint
from api.functions.chat import chat_blueprint
from api.functions.conversations import conversations_blueprint
from api.functions.metrics import metrics_blueprint

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv("FLASK_SECRET_KEY")

app.register_blueprint(user_blueprint, url_prefix='/')
app.register_blueprint(chat_blueprint, url_prefix='/')
app.register_blueprint(conversations_blueprint, url_prefix='/')
app.register_blueprint(metrics_blueprint, url_prefix='/')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8002)
