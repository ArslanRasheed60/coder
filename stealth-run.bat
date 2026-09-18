@echo off
echo === Buddy Boy - Desktop AI Coding Companion ===
echo.
echo Welcome to Buddy Boy!
echo Use the keyboard shortcuts to control the floating companion window:
echo.
echo - Toggle Visibility: Ctrl+B (or Cmd+B on Mac)
echo - Take Screenshot: Ctrl+H
echo - Process Screenshots: Ctrl+Enter
echo - Move Window: Ctrl+Arrows (Left/Right/Up/Down)
echo - Adjust Opacity: Ctrl+[ (decrease) / Ctrl+] (increase)
echo - Reset View: Ctrl+R
echo - Quit App: Ctrl+Q
echo.
echo When you press Ctrl+B, the companion window will toggle between visible and hidden.
echo If movement shortcuts aren't working, try making the window visible first with Ctrl+B.
echo.

cd /D "%~dp0"

echo === Step 1: Creating required directories... ===
mkdir "%APPDATA%\buddy-boy\temp" 2>nul
mkdir "%APPDATA%\buddy-boy\cache" 2>nul
mkdir "%APPDATA%\buddy-boy\screenshots" 2>nul
mkdir "%APPDATA%\buddy-boy\extra_screenshots" 2>nul

echo === Step 2: Cleaning previous builds... ===
echo Removing old build files to ensure a fresh start...
rmdir /s /q dist dist-electron 2>nul
del /q .env 2>nul

echo === Step 3: Building application... ===
echo This may take a moment...
call npm run build

echo === Step 4: Launching Buddy Boy companion... ===
echo Remember: Press Ctrl+B to toggle window, Ctrl+[ and Ctrl+] to adjust opacity!
echo.
set NODE_ENV=production
start /B cmd /c "npx electron ./dist-electron/main.js"

echo Buddy Boy is now running! Press Ctrl+B to bring the HUD into view.
echo.
echo If you encounter any issues:
echo 1. Make sure you've installed dependencies with 'npm install'
echo 2. Press Ctrl+B multiple times to toggle visibility
echo 3. Check Task Manager to verify the app is running