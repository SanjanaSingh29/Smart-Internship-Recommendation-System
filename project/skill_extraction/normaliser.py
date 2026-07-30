import json

with open("aliases.json","r") as f:
    ALIASES = json.load(f)

def normalize(skill):

    skill = skill.strip().lower()

    if skill in ALIASES:
        return ALIASES[skill]

    return skill.title()