from flask import Blueprint, request, jsonify
from extensions import db
from models import Internship

internships_bp = Blueprint("internships", __name__)


@internships_bp.route("/api/internships", methods=["GET"])
def get_all_internships():
    """Get all internships (with optional pagination)."""
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    internships = Internship.query.paginate(page=page, per_page=per_page)

    return jsonify({
        "internships": [
            {
                "id": i.id,
                "title": i.title,
                "company": i.company,
                "location": i.location,
                "stipend": i.stipend,
                "required_skills": i.required_skills,
                "description": i.description,
                "created_at": i.created_at.isoformat() if i.created_at else None
            }
            for i in internships.items
        ],
        "total": internships.total,
        "pages": internships.pages,
        "current_page": page
    }), 200


@internships_bp.route("/api/internships/search", methods=["GET"])
def search_internships():
    """Search internships by location, skills, stipend, or company."""
    location = request.args.get("location", "").lower()
    skills = request.args.get("skills", "").lower()  # comma-separated
    min_stipend = request.args.get("min_stipend", type=int)
    max_stipend = request.args.get("max_stipend", type=int)
    company = request.args.get("company", "").lower()

    query = Internship.query

    if location:
        query = query.filter(Internship.location.ilike(f"%{location}%"))

    if company:
        query = query.filter(Internship.company.ilike(f"%{company}%"))

    if min_stipend is not None:
        query = query.filter(Internship.stipend >= min_stipend)

    if max_stipend is not None:
        query = query.filter(Internship.stipend <= max_stipend)

    internships = query.all()

    # Filter by skills (manual filtering, since skills are stored as text)
    if skills:
        skill_list = [s.strip() for s in skills.split(",")]
        filtered_internships = []
        for internship in internships:
            if internship.required_skills:
                internship_skills = [s.strip().lower() for s in internship.required_skills.split(",")]
                if any(skill in internship_skills for skill in skill_list):
                    filtered_internships.append(internship)
        internships = filtered_internships

    return jsonify({
        "count": len(internships),
        "internships": [
            {
                "id": i.id,
                "title": i.title,
                "company": i.company,
                "location": i.location,
                "stipend": i.stipend,
                "required_skills": i.required_skills,
                "description": i.description
            }
            for i in internships
        ]
    }), 200