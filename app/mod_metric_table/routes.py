from flask import Blueprint, render_template, session, request, jsonify
from ..decorators.login_decorator import login_required
from ..decorators.access_decorator import permissions_required
from . import metric_bp
from ..common import llm_api


@metric_bp.get('/metrics/')
@login_required
@permissions_required(permissions_list=[5], main_view=True)
def main_metrics(*args, **kwargs):
    admin = kwargs.get('admin', False)
    chat = kwargs.get('chat', False)
    conversations = kwargs.get('conversations', False)
    metrics = kwargs.get('metrics', False)
    name = session.get('user_name')
    lastname = session.get('user_lastname')
    role = session.get('user_role')
    metrics_template = render_template('metrics.html', name=name, lastname=lastname, user_type=role, admin=admin, chat=chat, conversations=conversations, metrics=metrics)
    return metrics_template


@metric_bp.route('/send/', methods=['POST'])
@login_required
@permissions_required(permissions_list=[1])
def send_metric():
    data = request.get_json()
    questions = data.get('questions')
    conversation_id = data.get('conversation_id')
    calification = data.get('calification')
    response = llm_api.send_metric(conversation_id, questions, calification)
    return jsonify({'success': True})


@metric_bp.route('/get_metric_table/', methods=['POST'])
@login_required
@permissions_required(permissions_list=[5])
def get_metric_table():
    data = request.get_json()
    limit = data.get("limit")
    offset = data.get("offset")
    order_by = data.get("order_by")
    order_way = data.get("order_way")
    return jsonify(llm_api.get_metric_table(limit, offset, order_by, order_way))