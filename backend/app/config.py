import os
from pathlib import Path

# Caminho do catálogo. pandas lê .csv e .csv.gz de forma transparente.
DATA_PATH = Path(os.getenv("HYG_DATA_PATH", Path(__file__).resolve().parent.parent / "data" / "hygdata_v42.csv.gz"))

# Origens permitidas para CORS (o dev server do Vite/React). Separe por vírgula.
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
