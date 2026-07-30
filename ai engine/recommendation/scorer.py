from config import WEIGHTS

def final_score(

        embedding,

        skills,

        location,

        cgpa,

        workmode):

    return (

        embedding*100*WEIGHTS["embedding"]

        +

        skills*WEIGHTS["skills"]

        +

        location*WEIGHTS["location"]

        +

        cgpa*WEIGHTS["cgpa"]

        +

        workmode*WEIGHTS["workmode"]

    )