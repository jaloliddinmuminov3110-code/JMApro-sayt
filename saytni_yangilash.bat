@echo off
chcp 65001 > nul
title JMAPRO.UZ - Saytni Avtomatik Yangilash
color 0b

echo ======================================================
echo           JMAPRO.UZ - SAYTNI YANGILASH
echo ======================================================
echo.

cd /d "%~dp0"

echo [1/3] O'zgarishlar tekshirilmoqda...
"C:\Program Files\Git\cmd\git.exe" add .

echo [2/3] O'zgarishlar saqlanmoqda...
"C:\Program Files\Git\cmd\git.exe" diff-index --quiet HEAD --
if %ERRORLEVEL% EQU 0 (
    echo.
    echo Hech qanday yangi o'zgarish topilmadi.
    echo Barcha fayllar allaqachon so'nggi versiyada.
    echo.
    timeout /t 4 > nul
    exit /b 0
)

"C:\Program Files\Git\cmd\git.exe" commit -m "Sayt yangilandi: %date% %time%"

echo [3/3] GitHub va Vercel'ga yuklanmoqda...
"C:\Program Files\Git\cmd\git.exe" push origin main

if %ERRORLEVEL% EQU 0 (
    color 0a
    echo.
    echo ======================================================
    echo   MUVAFFAQIYATLI YUKLANDI!
    echo   15-20 soniyada https://jmapro-sayt.vercel.app
    echo   manzilida yangi ko'rinish paydo bo'ladi.
    echo ======================================================
    echo.
    timeout /t 4 > nul
) else (
    color 0c
    echo.
    echo [XATOLIK] Internetga ulanishni tekshiring.
    echo.
    pause
)
