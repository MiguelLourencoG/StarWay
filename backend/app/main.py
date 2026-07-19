from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

from backend.app.preprocess import preprocess, build_binary, LAYOUT, STRIDE
from backend.app.config import DATA_PATH

STATE = {}

@asynccontextmanager
async def lifespan(app):
    df = pd.read_csv(DATA_PATH)
    STATE["stars"] = preprocess(df)
    STATE["stars_binary"] = build_binary(STATE["stars"])
    STATE["by_id"] = {int(s["id"]): s for s in STATE["stars"]}
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

@app.get("/stars/{id}")
def get_star(id: int):
    star = STATE["by_id"].get(id)
    if not star:
        raise HTTPException(status_code=404, detail="Estrela não encontrada.")
    return star