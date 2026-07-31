from flask import Blueprint, jsonify, request
from models import Internship
from extensions import db

internships_bp = Blueprint('internships', __name__, url_prefix='/api')

@internships_bp.route('/internships', methods=['GET'])
def get_internships():
    try:
        # Fetch all internships from your database
        all_internships = Internship.query.all()
        
        # Serialize database records into JSON format for React
        results = []
        for item in all_internships:
            results.append({
                "id": item.id,
                "title": getattr(item, 'title', ''),
                "company": getattr(item, 'company', ''),
                "location": getattr(item, 'location', 'Remote'),
                "type": getattr(item, 'type', 'Full-time'),
                "duration": getattr(item, 'duration', 'N/A'),
                "stipend": getattr(item, 'stipend', 'N/A'),
                "category": getattr(item, 'category', 'General'),
                "description": getattr(item, 'description', ''),
                "skills": getattr(item, 'skills', '').split(',') if isinstance(getattr(item, 'skills', ''), str) else []
            })
            
        return jsonify(results), 200

    except Exception as e:
        print(f"Error fetching internships: {e}")
        return jsonify({"error": "Failed to fetch internships from database"}), 500