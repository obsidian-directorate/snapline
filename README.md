# SnapLine 🕵️‍♂️

**Software by the Obsidian Directorate**

A secure, spy-themed image rendering service that transforms image links into real pictures with sophisticated animations and security features.

## 🎯 Mission

SnapLine provides covert image rendering capabilities with enterprise-grade security, audit logging, and multi-factor authentication.

## 🚀 Features

- **Secure Image Rendering**: Convert URLs to cached images with security validation
- **Spy-Themed Interface**: Covert operations aesthetic with smooth animations
- **Multi-Factor Authentication**: TOTP-based MFA support
- **Audit Logging**: Comprehensive security event tracking
- **Role-Based Access Control**: User and admin permission levels
- **File Vault**: Secure image storage with encryption

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, MongoDB
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Security**: bcrypt, JWT, TOTP, Helmet.js
- **Image Processing**: Sharp, Multer
- **Database**: MongoDB with Mongoose ODM

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/obsidian-directorate/snapline.git
cd snapline
```

2. Install dependencies:
```bash
cd backend && npm install
cd ../frontend && npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development servers:
```bash
# Backend (Terminal 1)
cd backend && npm run dev

# Frontend (Terminal 2)  
cd frontend && npm run dev
```

## 🛠️ Setup

You can see the guide [here](docs/SETUP.md).

## 🔒 Security Features

- Session-based authentication with HTTP-only cookies
- TOTP MFA support (Google Authenticator compatible)
- Rate limiting and brute force protection
- Content security policy headers
- Audit logging for all security events
- File type validation and malware scanning

## 📁 Project Structure

```text
snapline/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # Express routes
│   │   ├── middleware/     # Custom middleware
│   │   └── config/         # Database and app config
│   └── uploads/            # File storage
├── frontend/               # Web interface
│   ├── css/               # Spy-themed styles
│   ├── js/                # Frontend logic
│   ├── images/            # Static assets
│   └── components/        # Reusable components
└── docs/                  # Documentation
```

## 🎨 Theme

Inspired by covert intelligence operations with:

- Dark color schemes
- Animated transitions
- Secure, minimalist design
- Responsive layout for all devices

## 📄 License
Proprietary - Obsidian Directorate