from course_mapper import courses

def build(priority):

    roadmap = []

    week = 1

    for skill in priority:

        roadmap.append({

            "week":week,

            "skill":skill["skill"],

            "resources":courses(

                skill["skill"]

            )

        })

        week += 1

    return roadmap