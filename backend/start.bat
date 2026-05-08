@echo off
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do taskkill /PID %%a /F 2>nul
call venv\Scripts\activate
uvicorn app.main:app --reload