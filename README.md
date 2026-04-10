# 🎓 Campus Events Hub

<div align="center">

**Professional College Event Management & Approval Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

**[🚀 Quick Start](#-quick-start) • [✨ Features](#-features) • [🛠️ Tech Stack](#-tech-stack) • [📖 Docs](#-documentation)**

</div>

---

## 💡 What is Campus Events Hub?

A **production-ready** platform for managing college events, approvals, and venue bookings. Built for simplicity, security, and scale.

✨ Enterprise security • 📱 Fully responsive • 🏢 Multi-tenant • ⚡ Scalable • 🎯 6 role-based access system

---

## ✨ Features at a Glance

🔐 **Authentication** - JWT + RBAC with 6 roles  
📅 **Event Management** - Create, track, and book venues  
✅ **Approval Workflow** - Multi-level approvals with audit trails  
📊 **Dashboard** - Real-time analytics & insights  
🎯 **Role-Based Access** - Super Admin, College Admin, Faculty Advisor, Student Organizer, Volunteer, Department Approver  
📱 **Responsive UI** - Works on desktop, tablet, and mobile  
🐳 **Docker Ready** - Fully containerized for production  

---

## 🛠️ Tech Stack

**Frontend:** React 18 • TypeScript • Vite • TailwindCSS  
**Backend:** Node.js • Express • TypeScript • MongoDB • Prisma  
**DevOps:** Docker • Docker Compose  

---

## 🚀 Quick Start

### Install & Run (2 minutes)

```bash
# Clone repo
git clone https://github.com/yourusername/campus-events-hub.git
cd campus-events-hub

# Backend setup
cd backend
npm install
npm run dev
# ✓ Running on http://localhost:5000

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
# ✓ Running on http://localhost:5173
```

### Environment Setup

**Backend** - `backend/.env`:
```env
DATABASE_URL=mongodb://user:pass@cluster.mongodb.net/dbname
JWT_ACCESS_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
NODE_ENV=development
PORT=5000
```

**Frontend** - `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Demo Login
- **URL:** http://localhost:5173
- **Email:** organizer@campus.edu
- **Password:** demo123
- **Role:** Student Organizer

---

## 📁 Project Structure

```
campus-events-hub/
├── backend/              # API server (Express + TypeScript)
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── middlewares/  # Auth, RBAC, rate limiting
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── app.ts       # Express app
│   └── prisma/
│       └── schema.prisma
│
├── frontend/             # UI app (React + Vite)
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Route pages
│   │   ├── services/     # API client
│   │   └── App.tsx
│
└── docker-compose.yml    # Multi-container setup
```

---

## 🏗️ Architecture

### Multi-Tenant & Secure

```
Browser → Load Balancer → Express Server → Auth/RBAC Middleware → MongoDB
         (CORS, Helmet)   (JWT verified)  (Tenant scoped)      (Row-level isolation)
```

**Key Features:**
- ✅ JWT authentication with refresh tokens
- ✅ Zod input validation on all endpoints
- ✅ Role-based permissions per route
- ✅ Rate limiting (15-min windows)
- ✅ Bcrypt password hashing
- ✅ Prepared queries (no SQL injection)
- ✅ Audit logs for all approvals

---

## 🔌 Core API Endpoints

```
POST   /api/auth/login              Login
POST   /api/events                  Create event
GET    /api/events                  List events
POST   /api/events/:id/approve      Approve event
GET    /api/approvals               List pending approvals
GET    /api/venues                  List venues
POST   /api/venues                  Create venue (admin)
GET    /api/reports                 Analytics dashboard
```

---

## 👥 Roles & Permissions

| Role | Can Create Events | Can Approve | Can Manage Users |
|---|---|---|---|
| Super Admin | ✅ | ✅ | ✅ |
| College Admin | ✅ | ✅ | ✅ |
| Faculty Advisor | ❌ | ✅ | ❌ |
| Student Organizer | ✅ | ❌ | ❌ |
| Volunteer | ❌ | ❌ | ❌ |
| Department Approver | ❌ | ✅* | ❌ |

*Limited to assigned departments

---

## 🐳 Docker Deployment

```bash
# Build and run all services
docker-compose up --build

# Production
docker build -t campus-events-backend ./backend
docker build -t campus-events-frontend ./frontend
```

---

## 📖 Documentation

- **Full Setup Guide:** [SETUP.md](./SETUP.md)
- **Architecture Details:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **API Reference:** Available at `/api/docs` when running
- **Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📦 Production Checklist

- [ ] Use managed MongoDB/PostgreSQL
- [ ] Configure environment secrets
- [ ] Enable HTTPS/TLS
- [ ] Set up database backups
- [ ] Configure CDN for assets
- [ ] Enable structured logging
- [ ] Set up CI/CD pipeline
- [ ] Configure auto-scaling
- [ ] Test disaster recovery

**Deploy To:** Railway • Render • Vercel • AWS • GCP • Azure

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open PR

**Guidelines:** Use TypeScript • Follow ESLint • Write tests • Update docs

---

## 📄 License

MIT License - [View License](./LICENSE)

---

## 🙏 Questions?

- 📧 **Email:** support@campusevents.com
- 💬 **Discussions:** GitHub Discussions
- 🐛 **Issues:** GitHub Issues

---

<div align="center">

Made with 💻 by [Your Team]

**[⬆ back to top](#-campus-events-hub)**

</div>
| **Docker Compose** | Orchestration |
| **GitHub** | Version control |

---

## 📁 Project Structure

```
campus-events-hub/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── pages/              # Page components (Auth, Dashboard, Events, etc.)
│   │   ├── components/         # Reusable UI components
│   │   ├── services/           # API service layer
│   │   ├── store/              # state management (Context API)
│   │   ├── styles/             # Global styling
│   │   └── types/              # TypeScript type definitions
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/                     # Express backend API
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── routes/             # API routes
│   │   ├── middlewares/        # Auth, RBAC, rate limiting
│   │   ├── models/             # Database models
│   │   ├── config/             # Configuration files
│   │   ├── scripts/            # Database seeding
│   │   └── server.ts           # Server entry point
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── package.json
│   └── tsconfig.json
│
├── test_data/                   # Test credentials and sample data
│   └── test_credentials.xlsx    # Sample login credentials for each role
│
├── docker-compose.yml           # Docker orchestration
├── .gitignore
└── README.md

```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- MongoDB (or use Atlas cloud)
- Git

### 1️⃣ Clone Repository
```bash
git clone https://github.com/parikshithsivakumar/campus-events-hub.git
cd campus-events-hub
```

### 2️⃣ Setup Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
npm install
```

### 3️⃣ Setup Frontend
```bash
cd ../frontend
cp .env.example .env
npm install
```

### 4️⃣ Run with Docker (Recommended)
```bash
cd ..
docker compose up --build
```

### 5️⃣ Initialize Database
```bash
# In backend container
npx prisma migrate dev
npm run seed
```

### 6️⃣ Start Development Servers
**Frontend (in new terminal):**
```bash
cd frontend
npm run dev
```

**Backend (if not using Docker):**
```bash
cd backend
npm run dev
```

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register          Register new user
POST   /api/auth/login              User login
POST   /api/auth/refresh            Refresh JWT token
GET    /api/auth/me                 Get current user
POST   /api/auth/logout             User logout
```

### Events
```
GET    /api/events                  List all events
POST   /api/events                  Create event
GET    /api/events/:id              Get event details
PUT    /api/events/:id              Update event
DELETE /api/events/:id              Delete event
```

### Approvals
```
GET    /api/approvals               Get approval queue
POST   /api/approvals/:id/approve   Approve event
POST   /api/approvals/:id/reject    Reject event
```

### Admin
```
GET    /api/colleges                List colleges
POST   /api/colleges                Create college
GET    /api/users                   List users
PUT    /api/users/:id/role          Update user role
```

### Reports
```
GET    /api/reports/events          Event statistics
GET    /api/reports/approvals       Approval statistics
GET    /api/reports/venues          Venue usage
```

---

## 👥 Role-Based Access Control

| Role | Capabilities |
|------|---|
| **COLLEGE_ADMIN** | Full system access, user management, college settings, reports |
| **ORGANIZER** | Create/manage events, submit for approval, view approvals |
| **APPROVER** | Review and approve/reject events, provide feedback |
| **USER** | Browse events, register for events, view calendar |

---

## 🔧 Environment Variables

### Backend (`.env`)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/db_name
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
COLLEGE_DOMAIN=college.edu
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Campus Events Hub
```

See `.env.example` files for complete configuration.

---

## 📖 Additional Documentation

- **[Backend README](./backend/README.md)** - API documentation & backend setup
- **[Frontend README](./frontend/README.md)** - UI components & frontend setup
- **[Architecture Guide](./ARCHITECTURE.md)** - System design & architecture
- **[User Guide](./USER_GUIDE.md)** - Feature walkthrough
- **[Deployment Guide](./DEPLOY.md)** - Production deployment

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

## 👨‍💻 Author

**Parikshith Sivakumar**
- GitHub: [@parikshithsivakumar](https://github.com/parikshithsivakumar)
- Repository: [campus-events-hub](https://github.com/parikshithsivakumar/campus-events-hub)

---

## 🙏 Support

If you have questions or issues:
1. 📖 Check [existing documentation](./ARCHITECTURE.md)
2. 🐛 Search [GitHub Issues](https://github.com/parikshithsivakumar/campus-events-hub/issues)
3. 💬 Create a new issue with detailed description
4. 📧 Contact the maintainers

---

**Built with ❤️ for the college community**
