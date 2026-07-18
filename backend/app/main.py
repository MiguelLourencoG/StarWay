from contextlib import asynccontextmanager
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

from backend.app.preprocess import preprocess, build_binary, LAYOUT, STRIDE
from backend.app.config import DATA_PATH

STATE = {}
DESIRED_COLUMNS = ['id', 'proper', 'mag', 'ci', 'x', 'y', 'z', 'dist']

@asynccontextmanager
async def lifespan(app):
    df = pd.read_csv(DATA_PATH, usecols=DESIRED_COLUMNS)
    STATE["stars"] = preprocess(df)
    STATE["stars_binary"] = build_binary(STATE["stars"])
    print(f"[startup] {len(STATE['stars'])} estrelas | binário {len(STATE['stars_binary']) / 1024:.0f} KB")
    yield
    STATE.clear()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"]
)

@app.get("/health")
def get_health():
    return {"stars": len(STATE["stars"])}

@app.get("/stars")
def get_stars():
    return STATE["stars"]

@app.get("/stars/meta")
def get_stars_meta():
    return {"count": len(STATE["stars"]), "stride": STRIDE, "layout": LAYOUT}

@app.get("/stars/binary")
def get_stars_binary():
    return Response(
        content=STATE["stars_binary"],
        media_type="application/octet-stream",
    )