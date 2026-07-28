from flask import Blueprint, request, jsonify
from extensions import db
from models import Student
from auth_utils import token_required

profile_bp = Blueprint("profile", __name__)


@profile_bp.route("/api/profile", methods=["GET"])
@token_required
def get_profile(current_student_id):
    """Get the logged-in student's profile."""
    student = Student.query.get(current_student_id)

    if not student:
        return jsonify({"error": "Student not found"}), 404

    return jsonify({
        "id": student.id,
        "name": student.name,
        "email": student.email,
        "education": student.education,
        "created_at": student.created_at.isoformat() if student.created_at else None
    }), 200


@profile_bp.route("/api/profile", methods=["PUT"])
@token_required
def update_profile(current_student_id):
    """Update the logged-in student's profile."""
    data = request.get_json()

    student = Student.query.get(current_student_id)

    if not student:
        return jsonify({"error": "Student not found"}), 404

    if "name" in data:
        student.name = data["name"]
    if "education" in data:
        student.education = data["education"]

    db.session.commit()

    return jsonify({
        "message": "Profile updated successfully",
        "student": {
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "education": student.education
        }
    }), 200