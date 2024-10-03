from flask import Blueprint, jsonify, url_for, request, render_template, redirect, flash, session
from werkzeug.security import generate_password_hash, check_password_hash
from .DB import DB_ORM_Handler
from ..mod_users.models.users import UserObject
from ..mod_users.models.roles import RoleObject
import json

def login():
    email = request.form.get('email')
    password = request.form.get('password')
    user = get_user(email)
    if user != {} and check_password_hash(user.get("password"), password):
        role = get_role(user.get("role_id"))
        session['user_id'] = user.get("id")
        session['user_name'] = user.get("name")
        session['user_lastname'] = user.get("lastname")
        if role:
            session['user_role'] = role
        session['conversation_id'] = 0
        flash('Ha iniciado sesión correctamente', 'success')
        return redirect(url_for('chatbot.main_chat'))
    else:
        flash('Email o contraseña inválida', 'danger')
        return redirect(url_for('auth.index'))


def register():
    email = request.form.get('email')
    name = request.form.get('name')
    lastname = request.form.get('lastname')
    password = request.form.get('password')
    password_review = request.form.get('password_review')
    # Validación de entradas
    if not email or not name or not lastname or not password or not password_review:
        flash('Por favor, completa todos los campos', 'danger')
        return redirect(url_for('auth.register'))
    
    if password != password_review:
        flash('Las contraseñas no coinciden', 'danger')
        return redirect(url_for('auth.register'))
    
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    try:
        existing_user = get_user(email)
        print(existing_user)
        if existing_user != {}:
            flash('El correo electrónico ya está registrado', 'danger')
            return redirect(url_for('auth.index'))
        result = insert_new_user(email, name, lastname, hashed_password)
        if not result:
            raise Exception("No se ha podido guardar el usuario.")
        flash('Registro exitoso. Por favor, inicia sesión', 'success')
        return redirect(url_for('auth.index'))
    except Exception as e:
        flash('Ocurrió un error durante el registro. Por favor, intenta de nuevo', 'danger')
        return redirect(url_for('auth.register'))

def logout():
    session.clear()
    flash('Sesión cerrada.', 'success')
    return redirect(url_for('auth.index'))

def get_user(user_email: str):
    """
    Retorna diccionario con
        - id
        - name
        - lastname
        - password
        - role_id
    Almacenados en la base de datos. Si el usuario no existe, retorna diccionario vacío.
    """
    with DB_ORM_Handler() as db:
        user = db.getObjects(
            UserObject,
            UserObject.email == user_email,
            defer_cols=[],
            columns=[UserObject.id, UserObject.name, UserObject.lastname, UserObject.role_id, UserObject.password]
        )
        if len(user) == 0:
            return {}
        return user.pop()


def get_role(role_id: int):
    with DB_ORM_Handler() as db:
        role = db.getObjects(
            RoleObject,
            RoleObject.id == role_id,
            defer_cols=[],
            columns=[RoleObject.role_name]
        )
        if len(role) == 0:
            return None
        return role.pop().get("role_name")

def insert_new_user(email: str, name: str, lastname: str, password: str):
    User = UserObject()
    User.email = email
    User.name = name
    User.lastname = lastname
    User.password = password
    User.role_id = 2
    with DB_ORM_Handler() as db:
        db.createTable(User)
        return db.saveObject(User)

def get_all_users(offset = 0, limit = 10):
    with DB_ORM_Handler() as db:
        user_role_data = db.getObjects(
        columns=[UserObject.id, UserObject.name, UserObject.lastname, RoleObject.role_name, UserObject.created_at], 
        p_obj=UserObject, 
        defer_cols=[], 
        order_by=[UserObject.id],
        limit=limit,
        offset=offset,
        join_conditions=[(RoleObject, UserObject.role_id == RoleObject.id)]
    )
    for i in range(len(user_role_data)):
        row = user_role_data[i]
        row["created_at"] = row["created_at"].strftime("%Y-%m-%d, %H:%M:%S")
        user_role_data[i] = row
    return json.dumps(user_role_data)

def get_all_roles(offset = 0, limit = 10):
    with DB_ORM_Handler() as db:
        role_data = db.getObjects(
        columns=[RoleObject.id, RoleObject.role_name], 
        p_obj=RoleObject, 
        defer_cols=[], 
        order_by=[RoleObject.id],
        limit=limit,
        offset=offset
    )
    return json.dumps(role_data)