from flask import Blueprint, jsonify, url_for, request, render_template, redirect, flash, session
from werkzeug.security import generate_password_hash, check_password_hash
from handlers.DBHandler import DBHandler


def login():
    email = request.form.get('email')
    password = request.form.get('password')
    with DBHandler() as db_handler:
        user = db_handler.select("SELECT id, name, lastname, email, password, role_id FROM users WHERE email = %s", (email,))
        if user and check_password_hash(user[0][4], password):
            role = db_handler.select("SELECT role_name FROM roles WHERE id = %s", (user[0][5],))
            session['user_id'] = user[0][0]
            session['user_name'] = user[0][1]
            session['user_lastname'] = user[0][2]
            if role:
                session['user_role'] = role[0][0]
            session['conversation_id'] = 0
            flash('Login successful!', 'success')
            return redirect(url_for('function_chat.main_chat'))
        else:
            print("invalid mail o pass")
            flash('Invalid email or password', 'danger')
            return redirect(url_for('users.index'))


def register():
    email = request.form.get('email')
    name = request.form.get('name')
    lastname = request.form.get('lastname')
    password = request.form.get('password')
    password_review = request.form.get('password_review')

    # Validación de entradas
    if not email or not name or not lastname or not password or not password_review:
        flash('Por favor, completa todos los campos.', 'danger')
        return redirect(url_for('users.register'))
    
    if password != password_review:
        flash('Las contraseñas no coinciden.', 'danger')
        return redirect(url_for('users.register'))
    
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    print(email, name, lastname, hashed_password)
    try:
        with DBHandler() as db_handler:
            existing_user = db_handler.select("SELECT id FROM users WHERE email = %s", (email,))
            if existing_user:
                flash('El correo electrónico ya está registrado.', 'danger')
                print('El correo electrónico ya está registrado.')
                return redirect(url_for('users.register'))
            db_handler.execute(
                "INSERT INTO users (email, name, lastname, password, role_id) VALUES (%s, %s, %s, %s, 2)",
                (email, name, lastname, hashed_password)
            )
            print("Exito")
            flash('Registro exitoso. Por favor, inicia sesión.', 'success')
            return redirect(url_for('users.index'))
    except Exception as e:
        print("error", e)
        flash('Ocurrió un error durante el registro. Por favor, intenta de nuevo.', 'danger')
        return redirect(url_for('users.register'))

def logout():
    session.clear()
    flash('Sesión cerrada.', 'success')
    return redirect(url_for('users.index'))