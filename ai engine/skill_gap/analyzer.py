from collections import Counter

def analyze(student_skills, internships):

    counter = Counter()

    for job in internships:

        required = set(job["skills"])

        missing = required - set(student_skills)

        counter.update(missing)

    return dict(counter)