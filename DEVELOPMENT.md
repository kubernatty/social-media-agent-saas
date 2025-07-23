# AIfluence Development Guide

## Quick Start

### 1. Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Return to project root
cd ..
```

### 2. Set Up Environment
```bash
# Backend configuration is already set up in server/.env
# Frontend configuration
cp .env.frontend .env.local  # Optional: customize frontend settings
```

### 3. Start Development Servers
```bash
# Option 1: Start both frontend and backend together (Recommended)
npm run dev

# Option 2: Start servers separately
npm run dev:backend    # Start backend API server (port 3001)
npm run dev:frontend   # Start frontend server (port 8080)
```

### 4. Access the Application
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/health

## Development Architecture

### Current State
The application is in a **hybrid state**:
- ✅ **Backend**: Production-ready API with Supabase database
- ⚠️ **Frontend**: Feature-rich but mostly localStorage-based
- 🔧 **Integration**: Limited connectivity between frontend and backend

### File Structure
```
├── standalone.html           # Main frontend application
├── dev-server.js            # Development server script
├── server/                  # Backend API
│   ├── server.js           # Main server file
│   ├── routes/             # API routes
│   ├── middleware/         # Auth, validation, etc.
│   └── .env               # Backend configuration
├── api/                    # Vercel serverless functions
└── docs/                   # Documentation
```

## Development Workflow

### Frontend Development
- Main application: `standalone.html`
- Live reload: Served via dev-server.js
- API calls: Configured to use `http://localhost:3001`
- Debugging: Browser console shows detailed API logs

### Backend Development
- Entry point: `server/server.js`
- Database: Supabase (configured in `server/.env`)
- Authentication: JWT with Row Level Security
- API testing: Use Postman or `curl` commands

### Common Tasks

#### Test API Connection
```bash
# Check backend health
curl http://localhost:3001/health

# Test user registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'
```

#### Debug Frontend-Backend Communication
1. Open browser console (F12)
2. Look for API request logs: `🌐 API Request: GET /api/...`
3. Check network tab for HTTP status codes
4. Verify CORS headers in response

#### Add New Features
1. **Backend**: Add route in `server/routes/`
2. **Frontend**: Update API calls in `standalone.html`
3. **Database**: Update schema in `server/supabase-schema.sql`

## Current Issues & Solutions

### Issue 1: Frontend-Backend Disconnect
**Problem**: Frontend uses localStorage, backend uses database
**Solution**: Gradually migrate localStorage calls to API calls

### Issue 2: Scheduled Publishing Not Working
**Problem**: No background job processor
**Solution**: Add job queue (Bull.js or similar)

### Issue 3: API Keys Stored Insecurely
**Problem**: Client-side API key storage
**Solution**: Use backend proxy for AI services

## Environment Configuration

### Backend (.env)
```bash
# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-key-here

# Authentication
JWT_SECRET=your-secret-here

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-client-id
LINKEDIN_CLIENT_SECRET=your-secret
```

### Frontend (.env.local)
```bash
# API Configuration
API_BASE_URL=http://localhost:3001

# Feature Flags
ENABLE_BACKEND_INTEGRATION=true
ENABLE_DEMO_MODE=true
```

## Testing

### Manual Testing
1. **User Registration**: Create account via frontend
2. **Content Generation**: Generate LinkedIn post
3. **LinkedIn OAuth**: Test connection flow (demo mode)
4. **Post Scheduling**: Schedule posts (frontend only currently)

### API Testing
```bash
# Health check
curl http://localhost:3001/health

# Register user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

## Deployment

### Development
- Frontend: Static files served by dev-server.js
- Backend: Node.js server on port 3001

### Production
- Frontend: Deployed to CDN or static hosting
- Backend: Deployed to Vercel serverless functions
- Database: Supabase (already configured)

## Troubleshooting

### Common Issues

#### "CORS Error"
- Check `server/.env` CORS_ORIGIN setting
- Ensure frontend URL is whitelisted

#### "API Connection Failed"
- Verify backend server is running on port 3001
- Check firewall/antivirus blocking connections

#### "Authentication Error"
- Verify JWT_SECRET in backend .env
- Check token expiration in frontend

#### "Database Connection Error"
- Verify Supabase credentials in server/.env
- Check network connectivity

### Debug Commands
```bash
# Check if backend is running
lsof -i :3001

# Check frontend server
lsof -i :8080

# View backend logs
cd server && npm run dev

# Check database connection
node -e "require('./server/config/supabase.js')"
```

## Contributing

### Code Style
- Use meaningful variable names
- Add console.log statements for debugging
- Comment complex functions
- Follow existing patterns

### Git Workflow
1. Create feature branch
2. Make changes
3. Test locally
4. Commit with descriptive message
5. Push and create PR

### Pull Request Checklist
- [ ] Frontend and backend both start without errors
- [ ] API endpoints return expected responses
- [ ] Browser console shows no JavaScript errors
- [ ] New features are documented

## Next Steps

### Priority 1: Basic Integration
1. Connect authentication system (frontend → backend)
2. Migrate user data from localStorage to API
3. Implement real LinkedIn OAuth

### Priority 2: Core Features
1. Add background job processor for scheduled posts
2. Implement secure API key management
3. Connect analytics dashboard to real data

### Priority 3: Advanced Features
1. Multi-platform support (Twitter, Facebook)
2. Payment integration
3. Real-time notifications

## Resources

- **API Documentation**: See `server/README.md`
- **Database Schema**: `server/supabase-schema.sql`
- **Feature Status**: `FEATURE-STATUS-REPORT.md`
- **Architecture**: `PROJECT-ARCHITECTURE.md`