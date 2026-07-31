from flask import Blueprint, request, jsonify
from extensions import db, bcrypt
from models import Student

# Ensure auth_bp is explicitly defined here
auth_bp = Blueprint('auth', __name__, url_prefix='/api')

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json() or {}

        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        cgpa_raw = data.get('cgpa')

        if not name or not email or not password:
            return jsonify({"error": "Please provide name, email, and password"}), 400

        # Check existing user
        existing_student = Student.query.filter_by(email=email).first()
        if existing_student:
            return jsonify({"error": "An account with this email already exists"}), 400

        # Handle optional CGPA safely
        cgpa_value = 0.0
        if cgpa_raw is not None and cgpa_raw != "":
            try:
                parsed_cgpa = float(cgpa_raw)
                if 0.0 <= parsed_cgpa <= 10.0:
                    cgpa_value = parsed_cgpa
                else:
                    return jsonify({"error": "Invalid CGPA. Must be between 0.0 and 10.0"}), 400
            except (ValueError, TypeError):
                return jsonify({"error": "Invalid CGPA format"}), 400

        # Hash password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        # Create new student record (using password_hash)
        new_student = Student(
            name=name,
            email=email,
            password_hash=hashed_password,
            cgpa=cgpa_value
        )

        db.session.add(new_student)
        db.session.commit()

        return jsonify({
            "message": "Registration successful",
            "token": f"token-{new_student.id}",
            "student": {
                "id": new_student.id,
                "name": new_student.name,
                "email": new_student.email,
                "cgpa": new_student.cgpa
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json() or {}
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Please enter both email and password"}), 400

        student = Student.query.filter_by(email=email).first()

        if not student or not bcrypt.check_password_hash(student.password_hash, password):
            return jsonify({"error": "Invalid email or password"}), 401

        return jsonify({
            "message": "Login successful",
            "token": f"token-{student.id}",
            "student": {
                "id": student.id,
                "name": student.name,
                "email": student.email,
                "cgpa": student.cgpa
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500