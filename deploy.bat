@echo off
title LearnForge AI Deployment Pipeline
cd /d "%~dp0"
:: Temporarily add default Windows PowerShell and system directories to path in case they are missing
set PATH=%PATH%;%SystemRoot%\System32\WindowsPowerShell\v1.0;C:\Windows\System32\WindowsPowerShell\v1.0;%SystemRoot%\System32;C:\Windows\System32
powershell -NoProfile -ExecutionPolicy Bypass -File .\deploy.ps1
pause
