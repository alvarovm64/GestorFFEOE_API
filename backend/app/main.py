from fastapi import FastAPI
from app.database import engine, Base
from app.models import *
from app.routers import auth, admin
from app.routers import auth, admin, profesores
from app.routers import auth, admin, profesores, empresas
from app.routers import auth, admin, profesores, empresas, alumnos
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GestorFFEOE API",
    description="API para gestión de prácticas en empresa",
    version="1.0.0"
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(profesores.router, prefix="/api/profesores", tags=["Profesores"])
app.include_router(empresas.router, prefix="/api/empresas", tags=["Empresas"])
app.include_router(alumnos.router, prefix="/api/alumnos", tags=["Alumnos"])




@app.get("/")
def root():
    return {"mensaje": "API GestorFFEOE funcionando"}