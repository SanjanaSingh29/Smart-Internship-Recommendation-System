"""
Shared extension instances.

Kept in their own file (instead of inside app.py) so that models.py and
routes/*.py can import `db` and `bcrypt` without causing circular imports.
"""

from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()