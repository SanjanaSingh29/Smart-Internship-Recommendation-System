import pandas as pd

def remove_duplicates(df):

    return df.drop_duplicates(
        subset=[
            "company",
            "title",
            "location"
        ]
    )