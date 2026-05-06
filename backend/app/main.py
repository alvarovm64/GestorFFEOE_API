from fastapi import FastAPI
from app.database import engine, Base
from app.models import *

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GestorFFEOE API",
    description="API para gestión de prácticas en empresa",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"mensaje": "API GestorFFEOE funcionando"}