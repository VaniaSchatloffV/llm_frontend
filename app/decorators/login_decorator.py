from functools import wraps
from flask import session, redirect, url_for

def login_required(f):
    @wraps(f)
    def login_review(*args, **kwargs):
        if 'user_name' not in session or 'user_role' not in session:
            return redirect(url_for('auth.index'))
        return f(*args, **kwargs)
    return login_review