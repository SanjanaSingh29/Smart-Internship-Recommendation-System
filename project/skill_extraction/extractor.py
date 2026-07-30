import pandas as pd
import re

dictionary = pd.read_csv("skill_dictionary.csv")

SKILLS = dictionary["skill"].tolist()

def extract(text):

    found = []

    lower = text.lower()

    for skill in SKILLS:

        pattern = r"\b" + re.escape(skill.lower()) + r"\b"

        if re.search(pattern, lower):

            found.append(skill)

    return sorted(list(set(found)))