from collections import Counter

def score(text, skills):

    text = text.lower()

    scores = {}

    for skill in skills:

        count = text.count(skill.lower())

        if count == 0:
            count = 1

        scores[skill] = min(count*20,100)

    return scores