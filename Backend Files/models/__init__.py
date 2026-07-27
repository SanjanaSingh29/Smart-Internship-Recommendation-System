from extensions import db


class Student(db.Model):
    __tablename__ = "students"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    education = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, server_default=db.func.now())


class Skill(db.Model):
    __tablename__ = "skills"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    category = db.Column(db.String(100))


class StudentSkill(db.Model):
    __tablename__ = "student_skills"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    skill_id = db.Column(db.Integer, db.ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)

    __table_args__ = (db.UniqueConstraint("student_id", "skill_id"),)


class Internship(db.Model):
    __tablename__ = "internships"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    company = db.Column(db.String(150), nullable=False)
    location = db.Column(db.String(150))
    stipend = db.Column(db.Integer)
    required_skills = db.Column(db.Text)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=db.func.now())


class Recommendation(db.Model):
    __tablename__ = "recommendations"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    internship_id = db.Column(db.Integer, db.ForeignKey("internships.id", ondelete="CASCADE"), nullable=False)
    match_percentage = db.Column(db.Float, nullable=False)
    missing_skills = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=db.func.now())


class Application(db.Model):
    __tablename__ = "applications"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    internship_id = db.Column(db.Integer, db.ForeignKey("internships.id", ondelete="CASCADE"), nullable=False)
    status = db.Column(db.String(50), default="applied")
    applied_at = db.Column(db.DateTime, server_default=db.func.now())