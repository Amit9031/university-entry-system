# Deployment Guide - University Gate Entry System

## 🚀 Quick Deployment Options

### Option 1: Railway (Easiest - Free Tier Available)

1. **Go to** https://railway.app and sign up/login with GitHub
2. **Click** "New Project" → "Deploy from GitHub repo"
3. **Select** your `powerCA2` repository
4. **Railway will automatically:**
   - Detect the Dockerfile
   - Build the Docker image
   - Deploy the app
5. **Get your URL:** Railway gives you a URL like `https://your-app.railway.app`
6. **Update QR codes:** Change `app.base-url` in `application.properties` to your Railway URL

**Note:** Railway uses port 80/443, so update `server.port=9090` to use `$PORT` environment variable.

---

### Option 2: Render (Free Tier Available)

1. **Go to** https://render.com and sign up/login with GitHub
2. **Click** "New" → "Web Service"
3. **Connect** your GitHub repository
4. **Settings:**
   - **Name:** `gate-entry`
   - **Environment:** `Docker`
   - **Build Command:** (auto-detected from Dockerfile)
   - **Start Command:** (auto-detected)
5. **Deploy** → Render builds and deploys automatically
6. **Get URL:** `https://your-app.onrender.com`

---

## 🔧 Full DevOps Pipeline (Git → Maven → Jenkins → Docker → Kubernetes)

### Prerequisites:
- Jenkins installed (local or cloud)
- Docker installed
- Kubernetes cluster (Minikube for local, or cloud: GKE/EKS/AKS)
- kubectl configured

### Step-by-Step:

#### 1. **Git (Already Done ✅)**
Your code is on GitHub.

#### 2. **Maven Build (Local Test)**
```bash
mvn clean package
```

#### 3. **Jenkins Setup**

**a) Install Jenkins:**
- Download from https://jenkins.io
- Or use Docker: `docker run -p 8080:8080 jenkins/jenkins:lts`

**b) Configure Jenkins:**
- Install plugins: `Git`, `Docker Pipeline`, `Kubernetes`
- Configure tools:
  - **Maven:** Global Tool Configuration → Add Maven 3.9+
  - **JDK:** Add JDK 17

**c) Create Pipeline:**
- New Item → Pipeline
- Pipeline definition: "Pipeline script from SCM"
- SCM: Git
- Repository URL: Your GitHub repo URL
- Script Path: `Jenkinsfile`

**d) Run Pipeline:**
- Click "Build Now"
- Jenkins will:
  1. Checkout code from Git
  2. Build with Maven
  3. Build Docker image
  4. Push to registry (if configured)
  5. Deploy to Kubernetes

#### 4. **Docker Build (Manual)**
```bash
docker build -t university/gate-entry:latest .
docker run -p 9090:9090 university/gate-entry:latest
```

#### 5. **Kubernetes Deployment**

**a) Local (Minikube):**
```bash
# Start Minikube
minikube start

# Deploy
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Check status
kubectl get pods
kubectl get services

# Access (Minikube)
minikube service gate-entry-service
```

**b) Cloud (Example - Google Cloud GKE):**
```bash
# Create cluster
gcloud container clusters create gate-entry-cluster --num-nodes=2

# Deploy
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Get external IP
kubectl get service gate-entry-service
```

---

## 📝 Environment Variables

For production, set these in your deployment platform:

- `SERVER_PORT=9090` (or use platform's PORT)
- `SPRING_PROFILES_ACTIVE=prod`
- `APP_BASE_URL=https://your-deployed-url.com` (for QR codes)

---

## 🔍 Troubleshooting

**Docker build fails:**
- Check Dockerfile syntax
- Ensure Maven dependencies download correctly

**Kubernetes pods not starting:**
- Check: `kubectl describe pod <pod-name>`
- Check logs: `kubectl logs <pod-name>`

**QR codes not working:**
- Update `app.base-url` in `application.properties` to your deployed URL
- Restart the application

---

## 📚 For Your DevOps Report

Your pipeline demonstrates:
1. ✅ **Git** - Source code version control
2. ✅ **Maven** - Build automation (`pom.xml`)
3. ✅ **Jenkins** - CI/CD pipeline (`Jenkinsfile`)
4. ✅ **Docker** - Containerization (`Dockerfile`)
5. ✅ **Kubernetes** - Orchestration (`k8s/deployment.yaml`, `k8s/service.yaml`)

