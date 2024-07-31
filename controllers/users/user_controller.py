from flask import Blueprint, jsonify, url_for, request, render_template, redirect, flash, session
from werkzeug.security import generate_password_hash, check_password_hash
from handlers.DBHandler import DBHandler
from repositories.users import user_repository


def login():
    email = request.form.get('email')
    password = request.form.get('password')
    user = user_repository.get_user(email)
    if user != {} and check_password_hash(user.get("password"), password):
        role = user_repository.get_role(user.get("role_id"))
        session['user_id'] = user.get("id")
        session['user_name'] = user.get("name")
        session['user_lastname'] = user.get("lastname")
        if role:
            session['user_role'] = role
        session['conversation_id'] = 0
        flash('Ha iniciado sesión correctamente', 'success')
        return redirect(url_for('function_chat.main_chat'))
    else:
        flash('Email o contraseña inválida', 'danger')
        return redirect(url_for('users.index'))


def register():
    email = request.form.get('email')
    name = request.form.get('name')
    lastname = request.form.get('lastname')
    password = request.form.get('password')
    password_review = request.form.get('password_review')
    # Validación de entradas
    if not email or not name or not lastname or not password or not password_review:
        flash('Por favor, completa todos los campos', 'danger')
        return redirect(url_for('users.register'))
    
    if password != password_review:
        flash('Las contraseñas no coinciden', 'danger')
        return redirect(url_for('users.register'))
    
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    try:
        existing_user = user_repository.get_user(email)
        if existing_user != {}:
            flash('El correo electrónico ya está registrado', 'danger')
            return redirect(url_for('users.register'))
        user_repository.insert_new_user(email, name, lastname, hashed_password)
        flash('Registro exitoso. Por favor, inicia sesión', 'success')
        return redirect(url_for('users.index'))
    except Exception as e:
        flash('Ocurrió un error durante el registro. Por favor, intenta de nuevo', 'danger')
        return redirect(url_for('users.register'))

def logout():
    session.clear()
    flash('Sesión cerrada.', 'success')
    return redirect(url_for('users.index'))