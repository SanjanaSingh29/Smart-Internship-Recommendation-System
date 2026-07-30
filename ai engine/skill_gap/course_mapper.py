import json

with open(

    "learning_resources.json",

    "r"

) as f:

    resources = json.load(f)

def courses(skill):

    return resources.get(

        skill,

        []

    )