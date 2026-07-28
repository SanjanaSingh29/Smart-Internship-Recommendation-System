from functools import wraps
from flask import request, jsonify, current_app
import jwt


def token_required(f):
    """Decorator that checks for a valid JWT token before allowing access.
    Use this on any route that should only work for logged-in students."""

    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"error": "Token is missing"}), 401

        try:
            data = jwt.decode(
                token,
                current_app.config["JWT_SECRET_KEY"],
                algorithms=["HS256"]
            )
            current_student_id = data["student_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Token is invalid"}), 401

        return f(current_student_id, *args, **kwargs)

    return decorated