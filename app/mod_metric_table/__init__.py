from flask import Blueprint
metric_bp = Blueprint('metric', __name__, template_folder='templates/metrics')
from . import routes