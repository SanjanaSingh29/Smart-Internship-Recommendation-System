from dictionary import load_dictionary

categories = load_dictionary()

def categorize(skills):

    output = {}

    for skill in skills:

        category = categories.get(skill,"Other")

        output.setdefault(category,[])

        output[category].append(skill)

    return output