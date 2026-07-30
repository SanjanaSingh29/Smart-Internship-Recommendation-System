from embeddings import embed
from embeddings import build_student_text
from embeddings import build_job_text

from similarity import similarity
from skill_match import match
from filters import *
from scorer import final_score

def recommend(student,
              internships):

    student_vector = embed(
        build_student_text(student)
    )

    results = []

    for job in internships:

        internship_vector = embed(
            build_job_text(job)
        )

        semantic = similarity(

            student_vector,

            internship_vector

        )

        skills = match(

            student["skills"],

            job["skills"]

        )

        score = final_score(

            semantic,

            skills["percentage"],

            location_score(

                student["location"],

                job["location"]

            ),

            cgpa_score(

                student["cgpa"],

                job["minimum_cgpa"]

            ),

            work_mode_score(

                student["preferred_mode"],

                job["work_mode"]

            )

        )

        results.append({

            "company":job["company"],

            "title":job["title"],

            "score":round(score,2),

            "matched":skills["matched"],

            "missing":skills["missing"]

        })

    return sorted(

        results,

        key=lambda x:x["score"],

        reverse=True

    )