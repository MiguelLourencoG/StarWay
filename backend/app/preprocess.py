import pandas as pd
import numpy as np

def preprocess(df: pd.DataFrame):
    df = df[df["dist"] < 100000]
    df = df.dropna(subset=["x", "y", "z", "mag"])
    df = df.astype(object).where(df.notna(), None)
    return df.to_dict(orient="records")

STRIDE = 5
LAYOUT = ["x", "y", "z", "ci", "id"]

def build_binary(stars: list[dict]) -> bytes:
    arr = np.zeros((len(stars), STRIDE), dtype=np.float32)

    for i, s in enumerate(stars):
        arr[i, 0] = s["x"]
        arr[i, 1] = s["y"]
        arr[i, 2] = s["z"]
        arr[i, 3] = s["ci"] if s["ci"] is not None else 0.0
        arr[i, 4] = s["id"]

    return arr.tobytes()