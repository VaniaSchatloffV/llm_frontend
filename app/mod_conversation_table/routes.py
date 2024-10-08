import os
from flask import Blueprint, render_template, session, jsonify, request, send_file, abort, flash
from ..common import llm_api
from ..decorators.login_decorator import login_required
from ..decorators.access_decorator import permissions_required
from . import conv_bp


@conv_bp.get('/conversations/')
@login_required
@permissions_required(permissions_list=[4], main_view=True)
def main_conversations(*args, **kwargs):
    admin = kwargs.get('admin', False)
    chat = kwargs.get('chat', False)
    conversations = kwargs.get('conversations', False)
    metrics = kwargs.get('metrics', False)
    name = session.get('user_name')
    lastname = session.get('user_lastname')
    role = session.get('user_role')
    conversations_template = render_template('conversations.html', name=name, lastname=lastname, user_type=role, admin=admin, chat=chat, conversations=conversations, metrics=metrics)
    return conversations_template

@conv_bp.route('/get_conversation_table/', methods=['POST'])
@login_required
@permissions_required(permissions_list=[4])
def get_conversation_table():
    data = request.get_json()
    limit = data.get("limit")
    offset = data.get("offset")
    order_by = data.get("order_by")
    order_way = data.get("order_way")
    return jsonify(llm_api.get_conversations_table(limit, offset, order_by, order_way))
