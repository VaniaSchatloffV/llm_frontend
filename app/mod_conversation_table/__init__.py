from flask import Blueprint
conv_bp = Blueprint('conv', __name__, template_folder='templates/conv')
from . import routes