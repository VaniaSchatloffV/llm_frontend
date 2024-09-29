import os
from flask import Blueprint, render_template, session, jsonify, request, send_file, abort, flash
from ..common import llm_api
from ..decorators.login_decorator import login_required
from . import conv_bp


@conv_bp.get('/conversations/')
@login_required
def main_conversations():
    name = session.get('user_name')
    lastname = session.get('user_lastname')
    role = session.get('user_role')
    conversations_template = render_template('conversations.html', name=name, lastname=lastname, user_type=role)
    return conversations_template

@conv_bp.route('/get_conversation_table/', methods=['POST'])
@login_required
def get_conversation_table():
    data = request.get_json()
    limit = data.get("limit")
    offset = data.get("offset")
    return jsonify(llm_api.get_conversations_table(limit, offset))
