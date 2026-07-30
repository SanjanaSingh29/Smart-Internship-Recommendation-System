def extract_projects(text):

    projects = []

    blocks = text.split("\n\n")

    for block in blocks:

        if len(block.split()) > 4:

            projects.append(block.strip())

    return projects