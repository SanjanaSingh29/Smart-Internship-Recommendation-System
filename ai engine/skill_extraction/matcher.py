def dictionary_match(text, skills):

    found = set()

    text = text.lower()

    for skill in skills:

        if skill.lower() in text:

            found.add(skill)

    return found