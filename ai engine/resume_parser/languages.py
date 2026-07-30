KNOWN_LANGUAGES = [

    "English",

    "Hindi",

    "French",

    "German",

    "Spanish",

    "Japanese"

]

def extract_languages(text):

    found = []

    lower = text.lower()

    for language in KNOWN_LANGUAGES:

        if language.lower() in lower:

            found.append(language)

    return found