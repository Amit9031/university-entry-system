# University Gate Entry System 🏛️

A real-time QR-based university gate entry system built with Spring Boot, featuring a complete DevOps pipeline.

## 🚀 Features

- **Student Registration**: Register multiple students with name, registration number, and phone
- **QR Code Generation**: Automatic QR code generation for each student
- **Mobile Entry Confirmation**: Students scan QR on phone → Accept/Reject entry
- **Real-time Dashboard**: Security guard sees all entries with date, time, registration number
- **Database**: H2 in-memory database (persists during app runtime)

## 🛠️ Tech Stack

- **Backend**: Spring Boot 3.3.4, Java 17
- **Database**: H2 (in-memory) & **MongoDB 7.0** (with `mongosh` automated init & `$jsonSchema`)
- **Frontend**: Thymeleaf templates & **Mongo Express** (Admin Web UI)
- **DevOps**: Maven → Jenkins → Docker & Docker Compose → Kubernetes

## 📦 Quick Start (Local)

```bash
# Clone repository
git clone <your-github-repo-url>
cd powerCA2

# Run application
mvn clean spring-boot:run

# Access application
# PC: http://localhost:9090/
# Students: http://localhost:9090/students
```

## 🌐 Free Deployment Options

### Option 1: Railway (Recommended - 100% Free)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Railway auto-detects Dockerfile and deploys
6. Get your URL: `https://your-app.railway.app`

**That's it!** Your app is live for free.

### Option 2: Render (Free Tier)

1. Go to https://render.com
2. Sign up with GitHub
3. Click **"New"** → **"Web Service"**
4. Connect your GitHub repo
5. Set **Environment**: `Docker`
6. Click **"Deploy"**

### Option 3: Fly.io (Free Tier)

```bash
# Install flyctl
# Then:
fly launch
fly deploy
```

## 🔧 DevOps Pipeline

This project demonstrates:
- ✅ **Git** - Source code version control
- ✅ **Maven** - Build automation (`pom.xml`)
- ✅ **Jenkins** - CI/CD pipeline (`Jenkinsfile`)
- ✅ **Docker** - Containerization (`Dockerfile`)
- ✅ **Kubernetes** - Orchestration (`k8s/`)

See `DEPLOYMENT.md` for detailed pipeline setup.

## 📱 How to Use

1. **Register Students** (PC):
   - Go to `http://localhost:9090/students`
   - Fill form: Name, Registration Number, Phone
   - Click "Save Student"
   - QR code appears automatically

2. **Scan QR** (Student's Phone):
   - Student scans QR code
   - Phone shows Accept/Reject page
   - Tap **Accept** → Entry recorded

3. **View Entries** (Security PC):
   - Go to `http://localhost:9090/`
   - See all entries with:
     - Student name
     - Registration number
     - Phone number
     - Entry date & time

## 🍃 MongoDB & mongosh Setup (CA Module)

The project includes a complete MongoDB NoSQL setup with `$jsonSchema` validation, compound indexing, seed data, and analytical queries for Continuous Assessment (CA) evaluation:

- **Automated Docker Compose**:
  ```bash
  docker compose up -d
  # MongoDB runs on port 27017
  # Mongo Express Web UI runs at http://localhost:8081
  ```
- **Run mongosh initialization locally**:
  ```bash
  mongosh "mongodb://localhost:27017/university_gate_db" mongo-init/init.js
  ```
- **Run 10 CA Demonstration Queries**:
  ```bash
  mongosh "mongodb://localhost:27017/university_gate_db" mongo-init/03-ca-queries.js
  ```
- **Helper Shell Runner**:
  ```bash
  ./scripts/run-mongosh.sh --init      # Run initialization
  ./scripts/run-mongosh.sh --queries   # Run CA evaluation queries
  ./scripts/run-mongosh.sh --stats     # Show collections and document counts
  ./scripts/run-mongosh.sh             # Interactive mongosh shell
  ```

See [`MONGODB_INIT.md`](file:///Users/amitranjan/.gemini/antigravity/scratch/university-entry-system/MONGODB_INIT.md) for full architectural documentation, schema design diagrams, query explanations, and viva Q&A.

## 📁 Project Structure

```
university-entry-system/
├── mongo-init/                 # MongoDB Shell (mongosh) Initialization
│   ├── 01-init-db.js           # DB creation, RBAC user, $jsonSchema & indexes
│   ├── 02-seed-data.js         # Realistic sample data (students, gates, entries)
│   ├── 03-ca-queries.js        # 10 CA evaluation queries & aggregations
│   └── init.js                 # Master init runner with status summary
├── scripts/
│   ├── run-mongosh.sh          # Helper script for mongosh operations
│   └── export-data.sh          # Export MongoDB collections to JSON
├── src/main/java/com/university/gate/
│   ├── controller/             # Web controllers
│   ├── model/                  # Entity classes
│   ├── repository/             # Data repositories
│   └── service/                # Business logic
├── src/main/resources/
│   ├── templates/              # Thymeleaf HTML pages
│   └── application.properties
├── docker-compose.yml          # Multi-container: App + MongoDB 7 + Mongo-Express
├── Dockerfile                  # Multi-stage Docker build
├── Jenkinsfile                 # Jenkins pipeline
├── MONGODB_INIT.md             # Detailed CA documentation & viva guide
└── pom.xml                     # Maven dependencies
```

## 🔐 Environment Variables

For production deployment, set:
- `PORT` - Server port (auto-detected on Railway/Render)
- `SPRING_PROFILES_ACTIVE=prod` (optional)

## 📝 License

This project is for educational purposes (DevOps pipeline demonstration).

## 🤝 Contributing

This is a university project demonstrating DevOps practices.

---

**Made with ❤️ for DevOps Pipeline Demonstration**
