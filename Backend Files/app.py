from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import db, bcrypt

from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.internship import internships_bp
from routes.health import health_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

db.init_app(app)
bcrypt.init_app(app)

# Register all routes
app.register_blueprint(auth_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(internships_bp)
app.register_blueprint(health_bp)

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, port=5000)