from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

from backend.app.preprocess import preprocess
from backend.app.config import DATA_PATH

STATE = {}
DESIRED_COLUMNS = ['id', 'proper', 'mag', 'ci', 'x', 'y', 'z', 'dist']

@asynccontextmanager
async def lifespan(app):
    df = pd.read_csv(DATA_PATH, usecols=DESIRED_COLUMNS)
    STATE["stars"] = preprocess(df)
    yield
    STATE.clear()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"]
)

@app.get("/stars")
def get_stars():
    return STATE["stars"]

@app.get("/health")
def get_health():
    return {"stars": len(STATE["stars"])}
