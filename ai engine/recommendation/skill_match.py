def match(student_skills,
          internship_skills):

    student = set(student_skills)

    internship = set(internship_skills)

    matched = student.intersection(
        internship
    )

    missing = internship - student

    percentage = (
        len(matched)
        /
        len(internship)
    )*100 if internship else 0

    return {

        "matched":list(matched),

        "missing":list(missing),

        "percentage":percentage

    }