const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public', {
    setHeaders: (res, filePath) => {
        const ext = path.extname(filePath).toLowerCase();
        const mimeMap = {
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.html': 'text/html',
            '.json': 'application/json',
            '.ico': 'image/x-icon'
        };

        if (mimeMap[ext]) {
            res.setHeader('Content-Type', mimeMap[ext]);
        }
    }
}));
app.use(express.static('views'));

// Serve main interface
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Basic route for status check
app.get('/api/status', (req, res) => {
    res.json({
        status: 'OPERATIONAL',
        message: 'SnapLine server is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// MongoDB connection
const connectDB = async () => {
    try {
        if (process.env.MONGODB_URI) {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('🟢 MonogDB: Connection established - Database online');
        } else {
            console.log('🟡 MongoDB: No connection string - Running in demo mode');
        }
    } catch (error) {
        console.log('🔴 MongoDB: Connection failed - ', error.message);
    }
};

// Initialize server
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`🕵️‍♂️ SnapLine Server active on port ${PORT}`);
        console.log(`📍 Access point: http://localhost:${PORT}`);
        console.log(`📡 Status check: http://localhost:${PORT}/api/status`);
        console.log(`📁 Serving static files from: ${path.join(__dirname, '../views')}`);
    });
};

startServer();