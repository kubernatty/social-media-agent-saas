# Social Media Agent - Professional SaaS Platform

A complete social media management SaaS platform with AI-powered content generation, LinkedIn integration, and enterprise-grade user management.

## 🏗️ Architecture Overview

### Current Architecture: Supabase + Vercel

We've built a modern, scalable SaaS architecture using:

**Frontend**: React (Vite) deployed to Vercel
**Backend**: Node.js + Express API deployed to Vercel
**Database**: PostgreSQL on Supabase
**Authentication**: JWT + bcrypt
**File Storage**: Supabase Storage

### Why This Architecture?

**✅ Cost-Effective Scaling:**
- **Phase 1**: FREE (Development/MVP)
- **Phase 2**: $25/month (Growth)
- **Phase 3**: $99/month (Enterprise)

**✅ Developer Experience:**
- **Instant setup** - Deploy in minutes
- **Auto-scaling** - Handles traffic spikes
- **Real-time features** - WebSocket support
- **Admin dashboard** - Visual database management

**✅ Enterprise Ready:**
- **Row Level Security** - Database-level permissions
- **Automatic backups** - Point-in-time recovery
- **Global CDN** - Worldwide performance
- **99.9% uptime** - Production SLA

## 🚀 Features

### Core Features
- **User Authentication & Management**
- **LinkedIn OAuth Integration**
- **Content Generation & Scheduling**
- **Post Management & Analytics**
- **Multi-tenant Architecture**
- **Usage Analytics & Reporting**

### Technical Features
- **JWT Authentication** with refresh tokens
- **Rate Limiting** and security headers
- **Input Validation** and sanitization
- **Database migrations** and seeding
- **Error handling** and logging
- **API documentation** with examples

## 📊 Scaling Strategy

### Phase 1: Development/MVP (FREE)
- **Target**: 50-100 active users
- **Database**: 500MB PostgreSQL
- **Bandwidth**: 2GB/month
- **Features**: Core functionality
- **Cost**: $0/month

### Phase 2: Growth ($25/month)
- **Target**: 1,000-5,000 active users
- **Database**: 8GB PostgreSQL
- **Bandwidth**: 250GB/month
- **Features**: Advanced analytics, daily backups
- **Cost**: $25/month

### Phase 3: Enterprise ($99/month)
- **Target**: 10,000+ active users
- **Database**: Dedicated instance
- **Bandwidth**: 1TB/month
- **Features**: Read replicas, priority support
- **Cost**: $99/month

### Phase 4: Custom Scale
- **Migration to AWS/GCP** for enterprise clients
- **Microservices architecture**
- **Multi-region deployment**
- **Custom SLA and compliance**

## 🔧 Quick Start

### 1. Backend Setup (Supabase + Vercel)

```bash
# Clone repository
git clone https://github.com/your-username/social-media-agent.git
cd social-media-agent/server

# Install dependencies
npm install

# Set up Supabase project
# 1. Go to supabase.com and create new project
# 2. Run SQL in supabase-schema.sql
# 3. Get API keys from Settings > API

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev

# Deploy to Vercel
vercel --prod
```

### 2. Frontend Setup

```bash
# Install frontend dependencies
cd ../
npm install

# Start development server
npm run dev

# Deploy to Vercel
vercel --prod
```

### 3. Database Migration

Run the following SQL in your Supabase SQL editor:

```sql
-- See server/supabase-schema.sql for complete schema
-- Creates users, posts, linkedin_connections, analytics tables
-- Includes indexes, RLS policies, and triggers
```

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - Login user
GET  /api/auth/verify      - Verify JWT token
POST /api/auth/refresh     - Refresh JWT token
```

### User Management
```
GET    /api/users/profile  - Get user profile
PUT    /api/users/profile  - Update user profile
PUT    /api/users/password - Change password
DELETE /api/users/account  - Delete account
GET    /api/users/stats    - Get user statistics
```

### Posts & Content
```
GET    /api/posts          - Get user's posts
POST   /api/posts          - Create new post
GET    /api/posts/:id      - Get specific post
PUT    /api/posts/:id      - Update post
DELETE /api/posts/:id      - Delete post
POST   /api/posts/:id/publish - Publish post
```

### LinkedIn Integration
```
GET    /api/linkedin/connection - Get connection status
GET    /api/linkedin/auth       - Start OAuth flow
GET    /api/linkedin/callback   - OAuth callback
DELETE /api/linkedin/connection - Disconnect LinkedIn
POST   /api/linkedin/post       - Post to LinkedIn
```

### Analytics
```
POST /api/analytics/event   - Record analytics event
GET  /api/analytics/stats   - Get analytics statistics
GET  /api/analytics/summary - Get analytics summary
```

## 🗄️ Database Schema

### Users Table
- Complete user profiles with authentication
- Subscription plans (free, pro, enterprise)
- User preferences and settings
- Email verification status

### Posts Table
- Social media posts with content
- Scheduling and publishing status
- Platform-specific metadata
- Media attachments support

### LinkedIn Connections Table
- OAuth token management
- Profile data synchronization
- Connection status tracking
- Token expiration handling

### Analytics Table
- User activity tracking
- Event-based analytics
- Daily aggregation
- Custom event data

## 🔒 Security Features

### Authentication & Authorization
- **JWT tokens** with expiration
- **Password hashing** with bcrypt
- **Row Level Security** (RLS) policies
- **Rate limiting** on all endpoints

### Data Protection
- **Input validation** with express-validator
- **SQL injection protection** via parameterized queries
- **XSS protection** with helmet.js
- **CORS configuration** for secure cross-origin requests

### Privacy & Compliance
- **Data encryption** at rest and in transit
- **Audit logging** for user actions
- **GDPR compliance** with data deletion
- **SOC 2 compliance** via Supabase

## 🚀 Deployment

### Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy backend
cd server
vercel --prod

# Deploy frontend
cd ../
vercel --prod
```

### Alternative Deployment Options
- **Railway**: `railway deploy`
- **Heroku**: `git push heroku main`
- **AWS**: ECS with Fargate
- **GCP**: Cloud Run

## 📈 Monitoring & Analytics

### Built-in Monitoring
- **Supabase Dashboard**: Database metrics
- **Vercel Analytics**: Function performance
- **Custom Analytics**: User behavior tracking
- **Error Tracking**: Automatic error logging

### Performance Metrics
- **API Response Times**
- **Database Query Performance**
- **User Engagement Metrics**
- **System Resource Usage**

## 🌟 When to Scale

### Indicators for Phase 2 Migration:
- 50+ active users
- 400MB+ database usage
- 1.5GB+ monthly bandwidth
- Need for advanced features

### Indicators for Phase 3 Migration:
- 1,000+ active users
- 6GB+ database usage
- 200GB+ monthly bandwidth
- Performance requirements

### Indicators for AWS Migration:
- 10,000+ active users
- Enterprise compliance needs
- Custom integrations required
- Budget of $500+/month

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: See `/server/README.md` for detailed API docs
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Email**: support@agenticintelligence.com

---

**Built with ❤️ by Agentic Intelligence**