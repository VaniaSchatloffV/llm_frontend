from flask import Blueprint, render_template, session
from ..decorators.login_decorator import login_required
from ..decorators.access_decorator import permissions_required
from . import metric_bp

@metric_bp.get('/metrics/')
@permissions_required(permissions_list=[5])
@login_required
def main_metrics():
    name = session.get('user_name')
    lastname = session.get('user_lastname')
    role = session.get('user_role')
    metrics_template = render_template('metrics.html', name=name, lastname=lastname, user_type=role)
    return metrics_template