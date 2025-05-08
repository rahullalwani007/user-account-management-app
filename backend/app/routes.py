from flask import Blueprint, request, jsonify
from .models import db, User
from app.utils import verify_password 
import re

main_bp = Blueprint('main', __name__)

def is_valid_email(email):
    """Simple email validation."""
    if not email:
        return False
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return re.match(pattern, email) is not None

def is_strong_password(password):
    """Simple password strength check (e.g., min 8 chars)."""
    return len(password) >= 8

@main_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid input, JSON required"}), 400

    email = data.get('email')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    password = data.get('password')

    if not all([email, first_name, last_name, password]):
        return jsonify({"error": "Missing required fields: email, first_name, last_name, password"}), 400

    if not is_valid_email(email):
        return jsonify({"error": "Invalid email format"}), 400

    if not is_strong_password(password):
        return jsonify({"error": "Password must be at least 8 characters long"}), 400

    if User.query.filter_by(email=email.lower()).first():
        return jsonify({"error": "Email address already registered"}), 409 # 409 Conflict

    try:
        new_user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created successfully", "user": new_user.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error creating user: {e}") 
        return jsonify({"error": "Could not create user", "details": str(e)}), 500

@main_bp.route('/users', methods=['GET'])
def get_all_users():
    try:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users]), 200
    except Exception as e:
        print(f"Error fetching users: {e}")
        return jsonify({"error": "Could not fetch users", "details": str(e)}), 500

@main_bp.route('/users/<string:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = User.query.get(user_id)
        if user:
            return jsonify(user.to_dict()), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        print(f"Error fetching user {user_id}: {e}")
        return jsonify({"error": "Could not fetch user", "details": str(e)}), 500

@main_bp.route('/users/<string:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid input, JSON required"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        if 'email' in data:
            new_email = data['email'].lower()
            if not is_valid_email(new_email):
                return jsonify({"error": "Invalid email format"}), 400
            # Check if the new email is already taken by another user
            existing_user = User.query.filter(User.email == new_email, User.id != user_id).first()
            if existing_user:
                return jsonify({"error": "Email address already registered by another user"}), 409
            user.email = new_email

        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'password' in data:
            new_password = data['password']
            if not is_strong_password(new_password):
                 return jsonify({"error": "Password must be at least 8 characters long"}), 400
            user.set_password(new_password)

        if not any(key in data for key in ['email', 'first_name', 'last_name', 'password']):
             return jsonify({"error": "No update fields provided"}), 400

        db.session.commit()
        return jsonify({"message": "User updated successfully", "user": user.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error updating user {user_id}: {e}")
        return jsonify({"error": "Could not update user", "details": str(e)}), 500

@main_bp.route('/users/<string:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200 
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting user {user_id}: {e}")
        return jsonify({"error": "Could not delete user", "details": str(e)}), 500