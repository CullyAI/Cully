:: Setup for Windows

@echo off
echo 🚀 Setting up the environment...

:: Remove existing virtual environment if needed
if exist venv (
    echo 🗑️ Removing existing virtual environment...
    rmdir /s /q venv
)

:: Create new virtual environment
echo 🚀 Creating a new virtual environment...
python -m venv venv

:: Activate virtual environment
call venv\Scripts\activate

:: Install Chocolatey if needed
where choco >nul 2>nul
if %errorlevel% neq 0 (
    echo 🍫 Chocolatey not found. Installing Chocolatey...
    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "Set-ExecutionPolicy Bypass -Scope Process -Force; ^
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; ^
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"
)

:: Install PostgreSQL and dependencies using Chocolatey
echo 📦 Installing PostgreSQL and libpq...
choco install postgresql -y
choco install libpq -y

:: Install Python dependencies
echo 📦 Installing Python dependencies...
pip install --upgrade pip
pip install -r requirements.txt

echo ✅ Virtual environment is set up and dependencies are installed!
pause

