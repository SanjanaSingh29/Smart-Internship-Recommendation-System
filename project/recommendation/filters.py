def location_score(student,
                   internship):

    if student == internship:

        return 100

    return 50


def work_mode_score(student,
                    internship):

    if student == internship:

        return 100

    return 0


def cgpa_score(student,
               required):

    if required is None:

        return 100

    if student >= required:

        return 100

    return 0