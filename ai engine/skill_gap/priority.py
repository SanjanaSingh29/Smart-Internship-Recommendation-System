import pandas as pd

db = pd.read_csv("skills_db.csv")

DEMAND = dict(zip(db.skill, db.demand))

def prioritize(missing):

    output = []

    for skill, frequency in missing.items():

        demand = DEMAND.get(skill,50)

        score = frequency * demand

        output.append({

            "skill":skill,

            "frequency":frequency,

            "demand":demand,

            "priority_score":score

        })

    return sorted(

        output,

        key=lambda x:x["priority_score"],

        reverse=True
    )