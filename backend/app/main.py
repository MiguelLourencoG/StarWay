from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

stars = [
    {"id": 0, "proper": "Sol", "x": 0.0, "y": 0.0, "z": 0.0, "mag": -26.74, "ci": 0.656},
    {"id": 1, "proper": "Sirius", "x": -1.52, "y": 2.17, "z": -1.13, "mag": -1.46, "ci": 0.00},
    {"id": 2, "proper": "Canopus", "x": 10.31, "y": -50.22, "z": 75.41, "mag": -0.74, "ci": 0.15},
    {"id": 3, "proper": "Rigil Kentaurus", "x": -0.72, "y": -1.11, "z": 0.23, "mag": -0.01, "ci": 0.71},
    {"id": 4, "proper": "Vega", "x": 2.53, "y": 6.84, "z": 3.42, "mag": 0.03, "ci": 0.00}
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"]
)

@app.get("/stars")
def get_stars():
    return stars


