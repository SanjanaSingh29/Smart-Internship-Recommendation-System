from config import SKILL_MAP

def normalize_skill(skill):

    skill = skill.strip().lower()

    return SKILL_MAP.get(skill, skill.title())


def normalize_skill_list(skill_string):

    skills = []

    for skill in skill_string.split(","):

        skill = normalize_skill(skill)

        if skill not in skills:

            skills.append(skill)

    return skills