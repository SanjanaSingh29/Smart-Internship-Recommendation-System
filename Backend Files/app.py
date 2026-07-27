from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import db, bcrypt
from routes.health import health_bp
from routes.auth import auth_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    db.init_app(app)
    bcrypt.init_app(app)

    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)