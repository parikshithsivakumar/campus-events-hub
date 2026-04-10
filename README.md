# 🎓 Campus Events Hub

<div align="center">

**Professional College Event Management & Approval Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

[🚀 Quick Start](#quick-start) • [📚 Documentation](#documentation) • [🏗️ Architecture](#architecture) • [🤝 Contributing](#contributing)

</div>

---

## 📋 Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Role-Based Access Control](#role-based-access-control)
- [API Endpoints](#api-endpoints)
- [Environment Setup](#environment-setup)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Campus Events Hub** is a production-ready SaaS platform for managing college events end-to-end. It provides institutional-grade security, multi-tenant architecture, and a sophisticated approval workflow system. Perfect for colleges and universities looking to streamline event planning, booking, and oversight.

### Why Campus Events Hub?

✨ **Production-Ready** - Built with enterprise-grade best practices  
🔐 **Secure by Default** - JWT auth, RBAC, rate limiting, input validation  
📱 **Fully Responsive** - Desktop, tablet, and mobile-optimized interfaces  
🏢 **Multi-Tenant** - Isolated data per institution with secure scoping  
⚡ **Scalable** - Stateless services, load-balanced, containerized  
🎯 **User-Centric** - Intuitive dashboards for all 6 user roles  

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication with refresh token rotation
- 6-role RBAC system: Super Admin, College Admin, Faculty Advisor, Student Organizer, Volunteer, Department Approver
- Email domain verification for institutional accounts
- Bcrypt password hashing with configurable cost
- Rate limiting on sensitive endpoints

### 📅 Event Management
- Create, update, and manage event proposals
- Venue management with booking and availability calendar
- Multi-level approval workflow with comments
- Event tracking with status monitoring
- Task assignment and Kanban board

### 📊 Approvals & Oversight
- Multi-stage approval workflow for events
- Approval queue with priority management
- Comments and feedback system
- Approval analytics and audit trails
- Configurable approval workflows per institution

### 🏫 Admin Dashboard
- Real-time analytics and event metrics
- User and college management
- Venue administration
- Reports and data export
- System configuration and settings

### 📈 Comprehensive Reporting
- Event analytics and insights
- Post-event reports and feedback collection
- Data export capabilities
- Historical tracking

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18+** | Component-based UI framework |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Lightning-fast build tool |
| **TailwindCSS** | Utility-first CSS styling |
| **Axios** | HTTP client for API calls |
| **React Router** | Client-side routing |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js 18+** | JavaScript runtime |
| **Express.js** | Minimalist web framework |
| **TypeScript** | Type-safe backend code |
| **MongoDB** | NoSQL document database |
| **Prisma** | Modern ORM with type safety |
| **JWT** | Stateless authentication |
| **Bcrypt** | Cryptographic password hashing |
| **Zod** | Schema validation |

### DevOps & Infrastructure
| Technology | Purpose |
|---|---|
| **Docker** | Container platform |
| **Docker Compose** | Multi-container orchestration |
| **MongoDB Atlas** | Managed database service |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm/yarn
- **MongoDB** (local or Atlas connection URL)
- **Docker** (optional, for containerized deployment)

### 1️⃣ Clone & Install

```bash
git clone https://github.com/yourusername/campus-events-hub.git
cd campus-events-hub

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2️⃣ Environment Setup

**Backend** - Create `backend/.env`:
```env
DATABASE_URL=mongodb://username:password@cluster.mongodb.net/dbname
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

**Frontend** - Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3️⃣ Run Development Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev
# ✓ Backend running on http://localhost:5000

# Terminal 2: Frontend
cd frontend
npm run dev
# ✓ Frontend running on http://localhost:5173
```

### 4️⃣ Access the Application

Open http://localhost:5173 and log in with demo credentials:
- **Role**: Student Organizer
- **Email**: organizer@campus.edu
- **Password**: demo123

---

## 📁 Project Structure

```
campus-events-hub/
├── backend/                    # Express API server
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route handlers
│   │   ├── middlewares/       # Auth, RBAC, rate limiting
│   │   ├── models/            # Data models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── types/             # TypeScript types
│   │   ├── app.ts            # Express app
│   │   └── server.ts         # Entry point
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React + Vite app
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Route pages
│   │   ├── services/          # API client
│   │   ├── store/             # State management
│   │   ├── types/             # TypeScript types
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions
│   │   ├── App.tsx           # Root component
│   │   └── main.tsx          # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml         # Multi-container setup
├── README.md                  # This file
└── LICENSE                    # MIT License
```

---

## 🏗️ Architecture

### Multi-Tenant Design
Every table includes a `collegeId` field for strict data isolation. Tenant scoping is enforced at:
- **Middleware layer** - Extracts `collegeId` from authenticated JWT
- **Service layer** - All database queries automatically scoped to user's college
- **Prisma middleware** - Database-level enforcement of tenant boundaries

### Security Architecture
```
Client (Browser)
    ↓
Reverse Proxy / Load Balancer
    ↓
Express Server (CORS, Helmet, Rate Limiting)
    ↓
Auth Middleware → JWT Verification → Extract collegeId
    ↓
RBAC Middleware → Check permissions against role
    ↓
Route Handler → Tenant-scoped service layer
    ↓
MongoDB (row-level data isolation)
```

### Key Security Features
- **Input Validation**: All requests validated with Zod schemas
- **SQL Injection Prevention**: Parameterized queries via Prisma
- **Authentication**: JWT with short-lived access tokens + refresh token rotation
- **Authorization**: Role-based permissions enforced per endpoint
- **Rate Limiting**: Protected endpoints throttled per IP
- **CORS**: Restricted to approved origins
- **Security Headers**: Helmet.js for HTTP hardening
- **Password Hashing**: Bcrypt with configurable cost factor

---

## 👥 Role-Based Access Control

| Role | Capabilities | Restrictions |
|---|---|---|
| **Super Admin** | System-wide management, all features | None |
| **College Admin** | All college operations, user management | Restricted to own college |
| **Faculty Advisor** | Event approval, review, oversight | Cannot create events |
| **Student Organizer** | Create events, manage proposals | Cannot approve events |
| **Volunteer** | View tasks, check assignments | Read-only access |
| **Department Approver** | Approve events in department | Limited to assigned departments |

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register          Register new account
POST   /api/auth/login             Login and get tokens
POST   /api/auth/refresh           Refresh access token
```

### Events
```
GET    /api/events                 List all events
POST   /api/events                 Create new event
GET    /api/events/:id             Get event details
PATCH  /api/events/:id             Update event
DELETE /api/events/:id             Delete event
POST   /api/events/:id/approve     Approve event
POST   /api/events/:id/reject      Reject event
```

### Approvals
```
GET    /api/approvals              List pending approvals
GET    /api/approvals/:id          Get approval details
POST   /api/approvals/:id/approve  Approve request
POST   /api/approvals/:id/reject   Reject request
```

### Venues
```
GET    /api/venues                 List venues
POST   /api/venues                 Create venue (admin only)
GET    /api/venues/:id             Get venue details
PATCH  /api/venues/:id             Update venue (admin only)
DELETE /api/venues/:id             Delete venue (admin only)
```

### Reports
```
GET    /api/reports                Get event analytics
GET    /api/reports/approval       Get approval statistics
```

Full API documentation available at `/api/docs` when server is running.

---

## ⚙️ Environment Setup

### Backend Environment Variables
```env
# Database
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# JWT Secrets
JWT_ACCESS_SECRET=your_secret_access_key
JWT_REFRESH_SECRET=your_secret_refresh_key

# Server Config
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Campus Events Hub
```

---

## 📦 Deployment

### Docker Deployment

```bash
# Build and start with Docker Compose
docker-compose up --build

# Or build individually
docker build -t campus-events-backend ./backend
docker build -t campus-events-frontend ./frontend
```

### Production Checklist
- [ ] Use managed PostgreSQL (Neon, Supabase, or Railway)
- [ ] Configure environment variables in secret manager
- [ ] Enable HTTPS/TLS everywhere
- [ ] Set up database backups and retention policies
- [ ] Configure CDN for static assets
- [ ] Enable structured logging and monitoring
- [ ] Set up automated deployments (CI/CD)
- [ ] Configure health checks and auto-scaling
- [ ] Review security headers and CORS policies
- [ ] Test disaster recovery procedures

### Deployment Platforms

**Recommended For Backend:**
- Railway, Render, Fly.io, Heroku, AWS/GCP/Azure

**Recommended For Frontend:**
- Vercel, Netlify, AWS S3 + CloudFront

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and test thoroughly
4. Commit with clear messages (`git commit -m 'Add amazing feature'`)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Coding Standards
- Use TypeScript for type safety
- Follow ESLint/Prettier configuration
- Write descriptive commit messages
- Include tests for new features
- Update documentation as needed

### Bug Reports
Please file issues with:
- Clear description of the problem
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots if applicable
- Environment details (OS, Node version, browser, etc.)

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 🙏 Acknowledgments

Built with ❤️ for college administrators, faculty advisors, and student organizers worldwide.

---

## 📞 Support & Questions

- 📧 Email: support@campusevents.com
- 💬 Discussions: GitHub Discussions
- 🐛 Bug Reports: GitHub Issues
- 📚 Documentation: [Full Docs](./docs)

---

<div align="center">

**[⬆ back to top](#campus-events-hub)**

Made with 💻 by [Your Name/Organization]

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
