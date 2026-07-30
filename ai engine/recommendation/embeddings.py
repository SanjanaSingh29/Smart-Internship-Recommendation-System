from sentence_transformers import SentenceTransformer

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

def build_student_text(profile):

    return f"""
Skills:
{' '.join(profile['skills'])}

Projects:
{' '.join(profile['projects'])}

Experience:
{' '.join(profile['experience'])}
"""


def build_job_text(job):

    return f"""
Title:
{job['title']}

Description:
{job['description']}

Skills:
{' '.join(job['skills'])}
"""


def embed(text):

    return model.encode(text)