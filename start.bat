@echo off
title 课时费统计系统
cd /d "%~dp0"

echo ========================================
echo    课时费统计系统
echo ========================================
echo.

:: 检查Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

:: 检查依赖
if not exist "node_modules" (
    echo [安装] 正在安装依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
    echo [完成] 依赖安装成功
    echo.
)

:: 启动服务器
echo [启动] 正在启动服务器...
echo.
echo 请在浏览器中打开: http://localhost:3000
echo 按 Ctrl+C 可停止服务器
echo.

node server.js

pause