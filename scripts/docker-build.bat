@echo off
REM Docker 构建和测试脚本 (Windows)

echo 🐳 开始构建 Docker 镜像...

REM 构建镜像
docker build -t wujun-article-generator:local .

if %ERRORLEVEL% neq 0 (
    echo ❌ 镜像构建失败
    pause
    exit /b 1
)

echo ✅ 镜像构建完成

REM 询问是否运行容器
set /p choice="是否立即运行容器？(y/n): "
if /i "%choice%"=="y" (
    echo 🚀 启动容器...
    
    REM 停止并删除已存在的容器
    docker stop wujun-generator-local >nul 2>&1
    docker rm wujun-generator-local >nul 2>&1
    
    REM 运行新容器
    docker run -d --name wujun-generator-local -p 3000:80 wujun-article-generator:local
    
    if %ERRORLEVEL% equ 0 (
        echo ✅ 容器已启动
        echo 🌐 访问地址: http://localhost:3000
        echo 📋 容器名称: wujun-generator-local
        echo.
        echo 查看日志: docker logs wujun-generator-local
        echo 停止容器: docker stop wujun-generator-local
    ) else (
        echo ❌ 容器启动失败
    )
)

pause