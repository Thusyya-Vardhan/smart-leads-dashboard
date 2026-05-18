# 🚀 Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack + TypeScript.

## Features
- JWT Authentication with Role-Based Access Control (Admin / Sales)
- Leads CRUD — Create, Update, Delete, View
- Advanced Filtering by Status, Source, Search, Sort
- Backend Pagination (10 records/page)
- Debounced Search
- CSV Export
- Responsive UI with TailwindCSS
- Docker Support

## Tech Stack
| Layer | Tech |
|---|---|
| Frontend | React, TypeScript, TailwindCSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| DevOps | Docker, Docker Compose |

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Docker (optional)

### Manual Setup

**Backend:**
```bash
cd server
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

**Frontend:**
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

### Docker Setup
```bash
cp .env.example .env
# Fill in your .env values
docker-compose up --build
```

## API Documentation

### Auth
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | /api/auth/register | Register user | Public |
| POST | /api/auth/login | Login user | Public |

### Leads
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | /api/leads | Get all leads | Protected |
| GET | /api/leads/:id | Get single lead | Protected |
| POST | /api/leads | Create lead | Protected |
| PUT | /api/leads/:id | Update lead | Protected |
| DELETE | /api/leads/:id | Delete lead | Admin only |

### Query Parameters for GET /api/leads
| Param | Type | Description |
|---|---|---|
| search | string | Search by name or email |
| status | string | Filter by status |
| source | string | Filter by source |
| sort | string | latest or oldest |
| page | number | Page number |
| limit | number | Records per page |

## Roles
- **Admin** — Full access including delete leads
- **Sales** — Can create, view and update leads

## Environment Variables

See `.env.example` in both `server/` and `client/` folders.

## Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas