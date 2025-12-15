# 🚀 部署指南

## Docker 镜像自动构建

每次推送到 `main` 分支时，GitHub Actions 会自动：
1. 构建 Docker 镜像
2. 推送到 GitHub Container Registry (ghcr.io)
3. 创建新的 Release

## 📦 使用 Docker 镜像

### 拉取最新镜像
```bash
docker pull ghcr.io/你的用户名/wujun-article-generator:latest
```

### 运行容器
```bash
docker run -d -p 3000:80 --name wujun-generator ghcr.io/你的用户名/wujun-article-generator:latest
```

访问 http://localhost:3000 即可使用应用。

### 使用 Docker Compose
```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 🔧 本地构建

### 构建镜像
```bash
docker build -t wujun-article-generator .
```

### 运行本地镜像
```bash
docker run -d -p 3000:80 wujun-article-generator
```

## 🌐 生产环境部署

### 1. 使用 Docker
```bash
# 拉取最新镜像
docker pull ghcr.io/你的用户名/wujun-article-generator:latest

# 运行容器（生产环境）
docker run -d \
  --name wujun-generator \
  --restart unless-stopped \
  -p 80:80 \
  ghcr.io/你的用户名/wujun-article-generator:latest
```

### 2. 使用 Docker Compose（推荐）
```bash
# 下载 docker-compose.yml
wget https://raw.githubusercontent.com/你的用户名/wujun-article-generator/main/docker-compose.yml

# 启动服务
docker-compose up -d
```

### 3. 使用 Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wujun-generator
spec:
  replicas: 2
  selector:
    matchLabels:
      app: wujun-generator
  template:
    metadata:
      labels:
        app: wujun-generator
    spec:
      containers:
      - name: wujun-generator
        image: ghcr.io/你的用户名/wujun-article-generator:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: wujun-generator-service
spec:
  selector:
    app: wujun-generator
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

## 🔄 自动更新

### GitHub Actions 触发条件
- **自动发版**：推送到 main 分支
- **手动发版**：在 GitHub Actions 页面手动触发

### 版本管理
- 镜像标签基于 `package.json` 中的版本号
- 每次发版会创建对应的 Git tag
- `latest` 标签始终指向最新版本

## 🛠️ 配置选项

### 环境变量
当前应用为纯前端项目，无需特殊环境变量配置。

### 端口配置
- 容器内端口：80
- 可通过 `-p` 参数映射到宿主机任意端口

### 数据持久化
应用使用浏览器 localStorage，无需额外数据卷。

## 🔍 监控和日志

### 查看容器日志
```bash
docker logs wujun-generator
```

### 健康检查
```bash
curl http://localhost:3000
```

### 容器状态
```bash
docker ps | grep wujun-generator
```

## 🚨 故障排除

### 常见问题

1. **端口冲突**
   ```bash
   # 使用不同端口
   docker run -d -p 8080:80 ghcr.io/你的用户名/wujun-article-generator:latest
   ```

2. **镜像拉取失败**
   ```bash
   # 检查网络连接
   docker pull ghcr.io/你的用户名/wujun-article-generator:latest
   ```

3. **容器启动失败**
   ```bash
   # 查看详细日志
   docker logs wujun-generator
   ```

### 重新部署
```bash
# 停止并删除旧容器
docker stop wujun-generator
docker rm wujun-generator

# 拉取最新镜像
docker pull ghcr.io/你的用户名/wujun-article-generator:latest

# 启动新容器
docker run -d -p 3000:80 --name wujun-generator ghcr.io/你的用户名/wujun-article-generator:latest
```

## 📈 性能优化

### Nginx 配置
- 启用 Gzip 压缩
- 静态资源缓存
- 安全头设置

### 多架构支持
镜像支持 `linux/amd64` 和 `linux/arm64` 架构。

---

**需要帮助？** 请在 GitHub Issues 中提出问题。