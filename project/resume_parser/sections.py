import re

SECTION_HEADERS = [
    "education",
    "academic",
    "experience",
    "work experience",
    "employment",
    "projects",
    "skills",
    "technical skills",
    "certifications",
    "certificates",
    "languages",
    "achievements",
    "internships"
]

def split_sections(text):

    text = text.replace("\r", "")

    pattern = r"(?i)^(" + "|".join(map(re.escape, SECTION_HEADERS)) + r")\s*$"

    lines = text.split("\n")

    sections = {}

    current = "header"

    sections[current] = []

    for line in lines:

        line = line.strip()

        if not line:
            continue

        if re.match(pattern, line):

            current = line.lower()

            sections[current] = []

        else:

            sections[current].append(line)

    return {
        key: "\n".join(value)
        for key, value in sections.items()
    }