@echo off
echo Recuerda tener WSL abierto y el contenedor MariaDB corriendo!
echo Ejecuta en WSL: docker start mariadb
echo Pulsa cualquier tecla cuando este listo...
pause
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do taskkill /PID %%a /F 2>nul
call venv\Scripts\activate
uvicorn app.main:app --reload