import os
from flask import Blueprint, render_template, session, jsonify, request, send_file, abort, flash
from controllers.llm import llm_controller
from decorators.login_decorator import login_required

messages = []


conversation_blueprint = Blueprint('conv', __name__)


@conversation_blueprint.route('/get_conversation_table/', methods=['POST'])
def get_conversation_table():
    data = request.get_json()
    limit = data.get("limit")
    offset = data.get("offset")
    return jsonify(llm_controller.get_conversations_table(limit, offset))
