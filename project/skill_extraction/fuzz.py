from rapidfuzz import fuzz

def fuzzy_match(words, skills):

    detected = set()

    for word in words:

        for skill in skills:

            score = fuzz.ratio(word.lower(), skill.lower())

            if score > 90:

                detected.add(skill)

    return detected