# MongoDB Setup Guide

## Local Development Setup

### Option 1: MongoDB Community Edition

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Debian:**
```bash
# Import the public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Windows:**
Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)

### Option 2: Docker (recommended)

```bash
# Create MongoDB container
docker run -d \
  --name snapline-mongo \
  -p 27017:27017 \
  -v snapline_data:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:6.0

# Or use Docker Compose (create docker-compose.yml)
```

### Option 3: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create database user
4. Get connection string
5. Update MONGODB_URI in .env

## Verification

Test your MongoDB connection:

```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ismaster')"

# Or connect directly
mongosh "mongodb://localhost:27017/snapline"
```

## Initial Setup

After MongoDB is running;

```bash
cd backend
npm run setup
```

This will:
- Create the database
- Set up collections
- Create default system settings
- Initialize indexes
