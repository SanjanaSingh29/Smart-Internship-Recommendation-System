from flask import Blueprint, request, jsonify
from extensions import db, bcrypt
from models import Student
import jwt
import datetime
from flask import current_app

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    education = data.get("education", "")

    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required"}), 400

    existing_student = Student.query.filter_by(email=email).first()
    if existing_student:
        return jsonify({"error": "Email already registered"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    new_student = Student(
        name=name,
        email=email,
        password_hash=hashed_password,
        education=education
    )

    db.session.add(new_student)
    db.session.commit()

    return jsonify({"message": "Student registered successfully", "student_id": new_student.id}), 201


@auth_bp.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    student = Student.query.filter_by(email=email).first()

    if not student or not bcrypt.check_password_hash(student.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = jwt.encode(
        {
            "student_id": student.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(
                minutes=current_app.config["JWT_ACCESS_TOKEN_EXPIRES_MIN"]
            )
        },
        current_app.config["JWT_SECRET_KEY"],
        algorithm="HS256"
    )

    return jsonify({
        "message": "Login successful",
        "token": token,
        "student": {"id": student.id, "name": student.name, "email": student.email}
    }), 200