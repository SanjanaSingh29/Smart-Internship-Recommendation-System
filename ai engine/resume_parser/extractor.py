import re
import spacy

from regex_patterns import *

nlp = spacy.load("en_core_web_sm")


def extract_email(text):

    match = re.search(EMAIL_REGEX, text)

    return match.group() if match else None


def extract_phone(text):

    match = re.search(PHONE_REGEX, text)

    return match.group() if match else None


def extract_linkedin(text):

    match = re.search(LINKEDIN_REGEX, text)

    return match.group() if match else None


def extract_github(text):

    match = re.search(GITHUB_REGEX, text)

    return match.group() if match else None


def extract_name(text):

    doc = nlp(text[:1000])

    for ent in doc.ents:

        if ent.label_ == "PERSON":

            return ent.text

    return None