COMPANY_WORDS = [
    "intern",
    "engineer",
    "developer",
    "analyst"
]

def extract_experience(text):

    experiences = []

    blocks = text.split("\n\n")

    for block in blocks:

        block_lower = block.lower()

        if any(word in block_lower for word in COMPANY_WORDS):

            experiences.append(block.strip())

    return experiences
