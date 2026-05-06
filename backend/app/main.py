from fastapi import FastAPI
from app.database import engine, Base
from app.models import *
from app.routers import auth

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GestorFFEOE API",
    description="API para gestión de prácticas en empresa",
    version="1.0.0"
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])

@app.get("/")
def root():
    return {"mensaje": "API GestorFFEOE funcionando"}