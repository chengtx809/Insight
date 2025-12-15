#!/bin/bash

# Docker 构建和测试脚本

set -e

echo "🐳 开始构建 Docker 镜像..."

# 构建镜像
docker build -t wujun-article-generator:local .

echo "✅ 镜像构建完成"

# 询问是否运行容器
read -p "是否立即运行容器？(y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 启动容器..."
    
    # 停止并删除已存在的容器
    docker stop wujun-generator-local 2>/dev/null || true
    docker rm wujun-generator-local 2>/dev/null || true
    
    # 运行新容器
    docker run -d \
        --name wujun-generator-local \
        -p 3000:80 \
        wujun-article-generator:local
    
    echo "✅ 容器已启动"
    echo "🌐 访问地址: http://localhost:3000"
    echo "📋 容器名称: wujun-generator-local"
    echo ""
    echo "查看日志: docker logs wujun-generator-local"
    echo "停止容器: docker stop wujun-generator-local"
fi