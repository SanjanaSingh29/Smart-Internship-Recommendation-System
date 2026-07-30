from analyzer import analyze
from priority import prioritize
from improvement import estimate
from roadmap import build

def generate(student, internships):

    missing = analyze(

        student["skills"],

        internships

    )

    priority = prioritize(

        missing

    )

    improvement = estimate(

        priority

    )

    roadmap = build(

        priority

    )

    return {

        "missing_skills":missing,

        "priority":priority,

        "improvement":improvement,

        "roadmap":roadmap

    }