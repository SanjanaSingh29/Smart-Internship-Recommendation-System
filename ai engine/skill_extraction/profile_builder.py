from extractor import extract
from categorizer import categorize
from scorer import score

def build(profile):

    text = profile["raw_text"]

    skills = extract(text)

    categories = categorize(skills)

    scores = score(text,skills)

    return {

        "skills":skills,

        "categories":categories,

        "proficiency":scores
    }