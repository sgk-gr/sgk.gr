@echo off
chcp 65001 > nul
title SGK Auto Scraper - ΓΕΜΗ
echo ======================================================
echo 🚀 Εκκίνηση SGK GEMI Auto Scraper (Playwright)...
echo ======================================================
echo.
cd /d D:\sgk-digital
node scripts/gemi_auto_scraper.js
pause
