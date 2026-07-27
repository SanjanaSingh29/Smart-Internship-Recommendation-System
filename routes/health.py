from flask import Blueprint, jsonify

health_bp = Blueprint("health", __name__)


@health_bp.route("/api/health", methods=["GET"])
def health_check():
    """Simple endpoint to confirm the server is running."""
    return jsonify({"status": "ok", "message": "Backend is running 🚀"}), 200