import pandas as pd

def load_dictionary():

    df = pd.read_csv("skill_dictionary.csv")

    return dict(zip(df.skill, df.category))