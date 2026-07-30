from preprocess import preprocess
from dictionary import load_skills
from matcher import dictionary_match
from fuzzy import fuzzy_match
from extractor import extract_spacy

skills = load_skills()

def extract_skills(text):

    cleaned = preprocess(text)

    dictionary = dictionary_match(cleaned, skills)

    fuzzy = fuzzy_match(cleaned.split(), skills)

    spacy = extract_spacy(cleaned)

    final = sorted(
        dictionary |
        fuzzy |
        spacy
    )

    return final