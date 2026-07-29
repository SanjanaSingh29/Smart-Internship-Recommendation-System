from flask import Blueprint, request, jsonify
from extensions import db
from models import Student, Internship, Recommendation, StudentSkill, Skill
from auth_utils import token_required

recommendations_bp = Blueprint("recommendations", __name__)


@recommendations_bp.route("/api/recommend", methods=["GET"])
@token_required
def get_recommendations(current_student_id):
    """Generate recommendations for the logged-in student."""
    
    student = Student.query.get(current_student_id)
    if not student:
        return jsonify({"error": "Student not found"}), 404

    # Get student's skills
    student_skills = db.session.query(Skill.name).join(
        StudentSkill, Skill.id == StudentSkill.skill_id
    ).filter(StudentSkill.student_id == current_student_id).all()
    
    student_skill_list = [skill[0].lower() for skill in student_skills]

    if not student_skill_list:
        return jsonify({
            "message": "Add skills to your profile first",
            "recommendations": []
        }), 200

    # Get all internships
    internships = Internship.query.all()
    recommendations = []

    for internship in internships:
        if internship.required_skills:
            required_skills = [s.strip().lower() for s in internship.required_skills.split(",")]
            
            # Calculate match percentage (simple algorithm)
            matched_skills = sum(1 for skill in required_skills if skill in student_skill_list)
            match_percentage = (matched_skills / len(required_skills)) * 100 if required_skills else 0
            
            missing_skills = [s for s in required_skills if s not in student_skill_list]
            
            recommendations.append({
                "internship_id": internship.id,
                "title": internship.title,
                "company": internship.company,
                "location": internship.location,
                "stipend": internship.stipend,
                "required_skills": internship.required_skills,
                "match_percentage": round(match_percentage, 2),
                "missing_skills": ", ".join(missing_skills) if missing_skills else "None"
            })

    # Sort by match percentage (descending)
    recommendations.sort(key=lambda x: x["match_percentage"], reverse=True)

    # Save top recommendations to database
    # (Delete old ones first)
    Recommendation.query.filter_by(student_id=current_student_id).delete()
    
    for rec in recommendations[:5]:  # Save top 5
        new_rec = Recommendation(
            student_id=current_student_id,
            internship_id=rec["internship_id"],
            match_percentage=rec["match_percentage"],
            missing_skills=rec["missing_skills"]
        )
        db.session.add(new_rec)
    
    db.session.commit()

    return jsonify({
        "student_id": current_student_id,
        "student_skills": student_skill_list,
        "total_recommendations": len(recommendations),
        "recommendations": recommendations[:10]  # Return top 10
    }), 200


@recommendations_bp.route("/api/recommendations", methods=["GET"])
@token_required
def get_saved_recommendations(current_student_id):
    """Get saved recommendations for the student."""
    
    recs = db.session.query(Recommendation, Internship).join(
        Internship, Recommendation.internship_id == Internship.id
    ).filter(Recommendation.student_id == current_student_id).all()

    return jsonify({
        "count": len(recs),
        "recommendations": [
            {
                "internship": {
                    "id": internship.id,
                    "title": internship.title,
                    "company": internship.company,
                    "location": internship.location,
                    "stipend": internship.stipend
                },
                "match_percentage": rec.match_percentage,
                "missing_skills": rec.missing_skills
            }
            for rec, internship in recs
        ]
    }), 200