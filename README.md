# VivahBandhan - Matrimonial Platform

A modern, full-stack matrimonial platform built with TypeScript, React, Fastify, and PostgreSQL.

## Project Structure

```
vivahbandhan/
├── packages/
│   ├── api/                 # Fastify backend API
│   │   ├── src/
│   │   │   ├── routes/      # API route handlers
│   │   │   ├── middleware/  # Express middleware
│   │   │   └── server.ts    # Server entry point
│   │   ├── prisma/
│   │   │   └── schema.prisma # Database schema
│   │   └── package.json
│   │
│   ├── frontend/            # React frontend
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── pages/       # Page components
│   │   │   ├── App.tsx      # Main app component
│   │   │   └── main.tsx     # Entry point
│   │   └── package.json
│   │
│   └── shared/              # Shared types and utilities
│       ├── src/
│       │   ├── types/       # TypeScript type definitions
│       │   ├── constants/   # Shared constants
│       │   └── utils/       # Utility functions
│       └── package.json
│
├── architecture.json        # System architecture documentation
├── docker-compose.yml       # Docker compose configuration
├── Dockerfile              # Production Docker build
├── package.json            # Root package.json (monorepo)
├── tsconfig.json           # TypeScript configuration
└── .gitignore
```

## Tech Stack

### Backend
- **Runtime**: Node.js 20
- **Framework**: Fastify
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Authentication**: JWT with refresh tokens
- **Payments**: Razorpay integration
- **SMS**: Twilio integration
- **Storage**: AWS S3 / Google Cloud Storage

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Form Handling**: React Hook Form + Zod

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- npm or pnpm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd vivahbandhan
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp packages/api/.env.example packages/api/.env
cp packages/frontend/.env.example packages/frontend/.env
```

4. Set up the database
```bash
cd packages/api
npx prisma generate
npx prisma migrate dev
```

### Development

Run both frontend and backend:
```bash
npm run dev
```

Or run them separately:
```bash
# Terminal 1 - API
npm run dev --workspace=packages/api

# Terminal 2 - Frontend
npm run dev --workspace=packages/frontend
```

### Docker

Run with Docker Compose:
```bash
docker-compose up -d
```

## Features

### User Features
- User registration with email/phone verification
- Profile creation and management
- Advanced search with filters
- Send/receive interests
- Real-time messaging
- Video calling (Premium)
- Profile verification
- Subscription plans

### Admin Features
- User management
- Report resolution
- Verification approvals
- Dashboard analytics

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user

### Profiles
- `GET /api/v1/profiles/me` - Get own profile
- `PUT /api/v1/profiles/me` - Update profile
- `GET /api/v1/profiles/:id` - Get profile by ID

### Search
- `GET /api/v1/search` - Search profiles

### Interests
- `GET /api/v1/interests` - Get interests
- `POST /api/v1/interests` - Send interest
- `PUT /api/v1/interests/:id` - Accept/reject interest

### Messages
- `GET /api/v1/messages` - Get conversations
- `GET /api/v1/messages/:matchId` - Get messages
- `POST /api/v1/messages` - Send message

### Subscriptions
- `GET /api/v1/subscriptions/plans` - Get plans
- `POST /api/v1/subscriptions` - Create subscription

## Environment Variables

See `.env.example` files in respective packages for required environment variables.

## License

Private - All rights reserved