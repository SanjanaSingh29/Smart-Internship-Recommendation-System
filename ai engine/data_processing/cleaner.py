import re
from bs4 import BeautifulSoup

def clean_text(text):

    if text is None:
        return ""

    text = BeautifulSoup(str(text), "html.parser").get_text()

    text = re.sub(r"\s+", " ", text)

    return text.strip()