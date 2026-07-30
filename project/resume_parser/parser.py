from pdf_reader import extract_text
from cleaner import clean_text
from extractor import (
    extract_name,
    extract_email,
    extract_phone,
    extract_linkedin,
    extract_github
)

from sections import split_sections
from education import extract_education
from experience import extract_experience
from projects import extract_projects
from certifications import extract_certifications
from languages import extract_languages


def parse_resume(pdf_path):

    raw = extract_text(pdf_path)

    cleaned = clean_text(raw)

    sections = split_sections(cleaned)

    profile = {

        "personal": {

            "name": extract_name(cleaned),

            "email": extract_email(cleaned),

            "phone": extract_phone(cleaned),

            "linkedin": extract_linkedin(cleaned),

            "github": extract_github(cleaned)

        },

        "education": extract_education(
            sections.get("education", "")
        ),

        "experience": extract_experience(
            sections.get("experience", "")
        ),

        "projects": extract_projects(
            sections.get("projects", "")
        ),

        "certifications": extract_certifications(
            sections.get("certifications", "")
        ),

        "languages": extract_languages(
            sections.get("languages", "")
        ),

        "raw_text": cleaned

    }

    return profile