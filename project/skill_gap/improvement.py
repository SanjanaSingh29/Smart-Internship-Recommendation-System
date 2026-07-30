def estimate(priority):

    output = []

    for item in priority:

        gain = round(

            item["priority_score"]/20,

            1

        )

        output.append({

            "skill":item["skill"],

            "expected_gain":gain

        })

    return output