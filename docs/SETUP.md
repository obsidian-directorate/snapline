# SnapLine Setup Guide

## Prerequisites

- Node.js 16+
- MongoDB 4.4+
- Git

## Initial setup

1. **Database setup**

```bash
# Start MongoDB service
sudo systemctl start mongod

# Create database (automatically on first connection)
# The app will create collections automatically
```

2. **Backend setup**

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm run dev
```

3. **Frontend setup**

```bash
cd frontend
npm install
npm run dev
```

## First time configuration

1. Access the web interface at http://localhost:3000 (can be changed by you)
2. The first user will be granted admin privileges
3. Configure system settings through the admin panel
4. Set up MFA for admin accounts