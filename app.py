from flask import Flask, Blueprint, jsonify
from markupsafe import escape
from flask import url_for
from flask import request
from flask import render_template

app = Flask(__name__)
# bp = Blueprint('api', __name__, url_prefix='/ServiceDev/5000')

@app.get('/')
def index():
    return render_template('index.html')

@app.get('/main/')
def main():
    return render_template('main.html')

# app.register_blueprint(bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8002)