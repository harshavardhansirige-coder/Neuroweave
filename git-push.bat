@echo off
title Push to Git Repository
cd /d "%~dp0"
echo ========================================================
echo 🚀 Initializing Git and Pushing to Github Repository...
echo ========================================================
echo.

:: Temporarily add common Git installation paths to the PATH in case they are missing
set PATH=%PATH%;C:\Program Files\Git\cmd;C:\Program Files (x86)\Git\cmd;%SystemRoot%\System32;C:\Windows\System32

:: Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️ Git was not found on your system.
    echo.
    echo Attempting to automatically install Git using Windows Package Manager (winget)...
    where winget >nul 2>nul
    if %errorlevel% neq 0 (
        echo ❌ winget is not available on this system.
        echo Please manually download and install Git from: https://git-scm.com/
        pause
        exit /b
    )
    
    echo 📦 Installing Git... Please accept any UAC prompts that appear.
    winget install --id Git.Git -e --accept-source-agreements --accept-package-agreements
    
    if %errorlevel% eq 0 (
        echo.
        echo 🎉 Git installed successfully!
        echo Please close this window and run 'git-push.bat' again to complete the push.
    ) else (
        echo ❌ Automatic installation failed. Please manually download and install Git from https://git-scm.com/
    )
    pause
    exit /b
)

:: Initialize git repository if not already done
if not exist .git (
    echo 📦 Initializing a new Git repository...
    git init
    git branch -M main
) else (
    echo 📦 Existing Git repository detected.
)

:: Add remote origin (update if already exists)
git remote remove origin >nul 2>nul
echo 🔗 Linking remote repository: harshavardhansirige-coder/Neuroweave...
git remote add origin https://github.com/harshavardhansirige-coder/Neuroweave.git

:: Add all files (excluding ignored files)
echo 💾 Adding files to commit...
git add .

:: Display files that are staged to double check .env is not included
echo.
echo 🔍 The following files will be pushed (excluding .env and secrets):
git status -s
echo.

choice /M "Do you want to commit and push these files now?"
if %errorlevel% neq 1 (
    echo ⏭️ Push cancelled by user.
    pause
    exit /b
)

:: Commit files
echo 📝 Committing files...
git commit -m "Configure production deployment pipelines and setup environment structures"

:: Push to remote main branch
echo 🚀 Pushing to Github...
git push -u origin main --force

if %errorlevel% eq 0 (
    echo.
    echo 🎉 Successfully pushed code to https://github.com/harshavardhansirige-coder/Neuroweave !
) else (
    echo.
    echo ⚠️ Push failed. Please make sure you are logged in to GitHub (e.g. via 'gh auth login' or git credential manager) and have write permissions.
)

pause
