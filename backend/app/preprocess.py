import pandas as pd

def preprocess(df: pd.DataFrame):
    df = df[df["dist"] < 100000]
    df = df.dropna(subset=["x", "y", "z", "mag"])
    df = df.astype(object).where(df.notna(), None)
    return df.to_dict(orient="records")