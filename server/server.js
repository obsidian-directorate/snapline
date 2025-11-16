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

// Image processing routes
app.post('/api/process-image', async (req, res) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'No image URL provided'
            });
        }

        // Validate URL format
        try {
            new URL(imageUrl);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid URL format'
            });
        }

        // Simulate image processing (in real implementation, you'd fetch and analyze the image)
        const processedImage = {
            success: true,
            imageUrl: imageUrl,
            metadata: {
                width: Math.floor(Math.random() * 2000) + 800, // Simulated dimensions
                height: Math.floor(Math.random() * 2000) + 600,
                size: Math.floor(Math.random() * 5000000) + 100000, // Simulated file size
                type: imageUrl.split('.').pop() || 'jpg',
                processedAt: new Date().toISOString()
            },
            analysis: {
                clarity: (Math.random() * 100).toFixed(1) + '%',
                integrity: (Math.random() * 100).toFixed(1) + '%',
                security: Math.random() > 0.3 ? 'CLEAR' : 'FLAGGED'
            }
        };

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
        console.error('Image processing error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process image asset'
        });
    }
});

// Mock intelligence archive endpoint
app.post('/api/archive-intel', async (req, res) => {
    try {
        const { imageUrl, metadata } = req.body;

        // Simulate archiving delay
        await new Promise(resolve => setTimeout(resolve, 800));

        res.json({
            success: true,
            message: 'Intelligence archived successfully',
            archiveId: 'ARC-' + Date.now(),
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to archive intelligence'
        });
    }
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