# 🎓 Campus Events Hub
**Professional College Event Management & Approval Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Role-Based Access Control](#role-based-access-control)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Campus Events Hub** is a comprehensive, production-ready SaaS platform designed for managing college events with a sophisticated multi-level approval workflow system. Built with modern web technologies, it provides an intuitive interface for event organizers, approvers, administrators, and regular users.

### Key Highlights
- ✅ **Multi-Tenant Architecture** - Isolated data per college with secure tenant scoping
- ✅ **Professional 4-Role RBAC** - COLLEGE_ADMIN, ORGANIZER, APPROVER, USER
- ✅ **Modern UI/UX** - Split-panel hero + responsive design (desktop/tablet/mobile)
- ✅ **Enterprise Security** - JWT authentication, rate limiting, CORS protection
- ✅ **Real-Time Approvals** - Event approval workflow with audit trails
- ✅ **Comprehensive Reporting** - Data insights and event analytics
- ✅ **Docker Ready** - Full containerization for production deployment

---

## ✨ Features

### Authentication & Authorization
- 🔐 JWT-based authentication with refresh tokens
- 👥 4-role RBAC system with granular permissions
- 📧 Email domain verification for college domains
- 🔑 Secure password hashing with bcrypt
- 🚫 Rate limiting on auth endpoints

### Event Management
- 📅 Create, update, and manage events
- 📍 Venue management with booking system
- 📊 Event tracking and status monitoring
- 🗓️ Calendar view with event timeline
- 📱 Mobile-responsive event listing

### Approval Workflow
- ✔️ Multi-level event approvals
- 📋 Approval queue management
- 💬 Comments and feedback system
- 📈 Approval analytics
- 🔔 Notification system

### Admin Dashboard
- 📊 Real-time analytics
- 👨‍💼 User management
- 🏫 College settings
- 📈 Reports and insights
- ⚙️ System configuration

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18+** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Fast build tool |
| **TailwindCSS** | Styling framework |
| **Axios** | HTTP client |
| **React Router** | Navigation |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime |
| **Express.js** | Web framework |
| **TypeScript** | Type safety |
| **MongoDB** | Database |
| **Prisma** | ORM |
| **JWT** | Authentication |
| **bcrypt** | Password hashing |

### DevOps & Deployment
| Technology | Purpose |
|---|---|
| **Docker** | Containerization |
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
