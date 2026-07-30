import re

DEGREES = [

    "b.tech",

    "b.e",

    "m.tech",

    "mca",

    "bca",

    "b.sc",

    "m.sc",

    "phd"

]

CGPA_REGEX = r"\b\d\.\d{1,2}\b"

YEAR_REGEX = r"(20\d{2})"


def extract_education(text):

    education = []

    lines = text.split("\n")

    for line in lines:

        item = {}

        lower = line.lower()

        for degree in DEGREES:

            if degree in lower:

                item["degree"] = degree.upper()

        cgpa = re.search(CGPA_REGEX, line)

        if cgpa:

            item["cgpa"] = float(cgpa.group())

        year = re.search(YEAR_REGEX, line)

        if year:

            item["year"] = int(year.group())

        if item:

            item["raw"] = line

            education.append(item)

    return education