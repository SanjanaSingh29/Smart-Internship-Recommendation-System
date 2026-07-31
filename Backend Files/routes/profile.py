from flask import Blueprint, jsonify, request
from extensions import db
from models import Student, StudentSkill, Recommendation, Application

profile_bp = Blueprint('profile', __name__, url_prefix='/api')

@profile_bp.route('/users/<int:student_id>', methods=['DELETE'])
def delete_student_account(student_id):
    try:
        student = Student.query.get(student_id)

        if not student:
            return jsonify({"error": "Student not found in database"}), 404

        StudentSkill.query.filter_by(student_id=student_id).delete()
        Recommendation.query.filter_by(student_id=student_id).delete()
        Application.query.filter_by(student_id=student_id).delete()

        db.session.delete(student)
        db.session.commit()

        return jsonify({"message": "Student account and profile deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500 