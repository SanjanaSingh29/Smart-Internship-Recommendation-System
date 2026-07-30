import pandas as pd
import re

from cleaner import clean_text
from duplicate_removal import remove_duplicates
from normalize_skills import normalize_skill_list
from location_standardizer import normalize_location

INPUT = "../datasets/raw/internships_raw.csv"
OUTPUT = "../datasets/processed/internships_clean.csv"

df = pd.read_csv(INPUT)

df["company"] = df["company"].str.title()

df["title"] = df["title"].str.strip()

df["description"] = df["description"].apply(clean_text)

df["location"] = df["location"].apply(normalize_location)

df["skills"] = df["skills"].apply(normalize_skill_list)

df["work_mode"] = (
    df["work_mode"]
      .str.lower()
      .str.replace(" ", "")
      .replace({
          "onsite": "Onsite",
          "remote": "Remote",
          "hybrid": "Hybrid"
      })
)

def clean_stipend(value):

    value = str(value)

    digits = re.sub(r"[^\d]", "", value)

    return int(digits) if digits else None

df["stipend"] = df["stipend"].apply(clean_stipend)

df = remove_duplicates(df)

df.to_csv(OUTPUT, index=False)

print(df.head())