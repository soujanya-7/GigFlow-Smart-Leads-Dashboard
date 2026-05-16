# Smart Leads Dashboard 🚀

A full-stack Lead Management Dashboard built with the MERN stack, TypeScript, and TailwindCSS.

## Tech Stack

### Frontend
- React.js + TypeScript
- TailwindCSS
- React Query (TanStack Query)
- React Router v6
- Axios
- React Hook Form + Zod

### Backend
- Node.js + Express.js + TypeScript
- MongoDB + Mongoose
- JWT Authentication
- bcrypt
- Express Validator

## Features

- ✅ JWT Authentication (Register/Login)
- ✅ Role-Based Access Control (Admin / Sales User)
- ✅ Lead CRUD Operations
- ✅ Advanced Filtering (Status, Source, Search)
- ✅ Debounced Search
- ✅ Backend Pagination (10 per page)
- ✅ CSV Export
- ✅ Dark Mode Support
- ✅ Docker Setup
- ✅ Responsive Design

## Project Structure

```
smart-leads-dashboard/
├── backend/             # Express.js + TypeScript API
│   ├── src/
│   │   ├── config/      # DB config, env
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Auth, error, validation
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   ├── types/       # TypeScript interfaces
│   │   └── utils/       # Helper utilities
│   ├── Dockerfile
│   └── package.json
├── frontend/            # React + TypeScript + TailwindCSS
│   ├── src/
│   │   ├── api/         # Axios API calls
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth context
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page components
│   │   ├── types/       # TypeScript interfaces
│   │   └── utils/       # Helper utilities
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Docker & Docker Compose (optional)

### Using Docker (Recommended)

```bash
cp .env.example .env
# Fill in your environment variables
docker-compose up --build
```

### Manual Setup

#### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your environment variables
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Documentation

See [API_DOCS.md](./API_DOCS.md)

## Environment Variables

See [.env.example](./.env.example)

## Default Credentials (Seeded)

- **Admin**: admin@leads.com / Admin@123
- **Sales**: sales@leads.com / Sales@123
