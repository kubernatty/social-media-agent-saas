# Social Media Agent - SaaS Backend

A production-ready Node.js backend API for the Social Media Agent SaaS application with Supabase integration, user authentication, LinkedIn integration, and post management.

## 🏗️ Architecture Decision

### Why Supabase + Vercel?

We chose this architecture for **Phase 1** (MVP/Development) because:

**✅ Supabase Benefits:**
- **Free 500MB PostgreSQL** - Handles 50-100 active users
- **Built-in auth system** - Can replace JWT later
- **Real-time capabilities** - WebSocket support included
- **Admin dashboard** - Visual database management
- **Instant APIs** - Auto-generated REST APIs
- **Row Level Security** - Enterprise-grade security

**✅ Vercel Benefits:**
- **Free hosting** - Unlimited bandwidth
- **Automatic deployments** - GitHub integration
- **Global CDN** - Fast worldwide performance
- **Serverless functions** - Scales automatically
- **Zero configuration** - Deploy in minutes

**💰 Cost Comparison:**

| **Service** | **Phase 1 (Free)** | **Phase 2 (Paid)** | **Enterprise Scale** |
|-------------|-------------------|-------------------|-------------------|
| **Supabase + Vercel** | $0 | $25/month | $99/month |
| **Railway** | $5/month | $20/month | $200/month |
| **AWS** | $0 (12 months) | $45/month | $500+/month |

## 🚀 Features

- **User Authentication**: JWT-based auth with bcrypt password hashing
- **LinkedIn Integration**: OAuth 2.0 flow with posting capabilities
- **Post Management**: CRUD operations for social media posts
- **Analytics**: User activity tracking and statistics
- **Security**: Rate limiting, input validation, and secure headers
- **Database**: PostgreSQL with Supabase integration
- **Scalability**: Designed for horizontal scaling

## 📊 Scaling Phases

### Phase 1: Development/MVP (FREE)
- **Users**: 50-100 active users
- **Database**: 500MB PostgreSQL
- **Bandwidth**: 2GB/month
- **Storage**: 1GB file storage
- **Cost**: $0/month

### Phase 2: Growth ($25/month)
- **Users**: 1,000-5,000 active users
- **Database**: 8GB PostgreSQL
- **Bandwidth**: 250GB/month
- **Storage**: 100GB file storage
- **Features**: Daily backups, advanced auth

### Phase 3: Enterprise ($99/month)
- **Users**: 10,000+ active users
- **Database**: Dedicated instance
- **Bandwidth**: 1TB/month
- **Storage**: 500GB file storage
- **Features**: Read replicas, advanced analytics

### Phase 4: Custom Scale
- **Migration to AWS/GCP** for enterprise clients
- **Microservices architecture**
- **Multi-region deployment**
- **Custom SLA and support**

## 🔧 Quick Start

### 1. Set up Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Run the SQL in `supabase-schema.sql` in the SQL editor
4. Get your API keys from Settings > API

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Supabase credentials
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/refresh` - Refresh JWT token

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password
- `DELETE /api/users/account` - Delete account
- `GET /api/users/stats` - Get user statistics

### Posts
- `GET /api/posts` - Get user's posts
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get specific post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/publish` - Publish post

### LinkedIn Integration
- `GET /api/linkedin/connection` - Get connection status
- `GET /api/linkedin/auth` - Start OAuth flow
- `GET /api/linkedin/callback` - OAuth callback
- `DELETE /api/linkedin/connection` - Disconnect LinkedIn
- `POST /api/linkedin/post` - Post to LinkedIn

### Analytics
- `POST /api/analytics/event` - Record analytics event
- `GET /api/analytics/stats` - Get analytics statistics
- `GET /api/analytics/summary` - Get analytics summary

## 🗄️ Database Schema

### Users Table
```sql
id UUID PRIMARY KEY
name VARCHAR(100) NOT NULL
email VARCHAR(255) UNIQUE NOT NULL
password VARCHAR(255) NOT NULL
plan VARCHAR(20) DEFAULT 'free'
status VARCHAR(20) DEFAULT 'active'
email_verified BOOLEAN DEFAULT false
last_login TIMESTAMP
preferences JSONB DEFAULT '{}'
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

### Posts Table
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
content TEXT NOT NULL
platform VARCHAR(20) DEFAULT 'linkedin'
status VARCHAR(20) DEFAULT 'draft'
scheduled_at TIMESTAMP
published_at TIMESTAMP
platform_post_id VARCHAR(255)
media_urls JSONB DEFAULT '[]'
metadata JSONB DEFAULT '{}'
error_message TEXT
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

### LinkedIn Connections Table
```sql
id UUID PRIMARY KEY
user_id UUID UNIQUE REFERENCES users(id)
linkedin_id VARCHAR(255) NOT NULL
access_token TEXT NOT NULL
refresh_token TEXT
expires_at TIMESTAMP
profile_data JSONB DEFAULT '{}'
is_active BOOLEAN DEFAULT true
last_used TIMESTAMP
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

### Analytics Table
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
event_type VARCHAR(100) NOT NULL
event_data JSONB DEFAULT '{}'
date DATE NOT NULL DEFAULT CURRENT_DATE
count INTEGER DEFAULT 1
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: express-validator for request validation
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers and protection
- **Row Level Security**: Supabase RLS policies
- **SQL Injection Protection**: Parameterized queries

## 🚀 Deployment Options

### Vercel (Recommended for Phase 1-2)
```bash
vercel --prod
```

### Railway (Alternative)
```bash
railway deploy
```

### AWS (Phase 3+)
- ECS with Fargate
- RDS PostgreSQL
- CloudFront CDN
- Route 53 DNS

## 🌟 When to Scale

### Migrate to Phase 2 when:
- **Users**: 50+ active users
- **Database**: 400MB+ usage
- **Bandwidth**: 1.5GB+ monthly
- **Features**: Need advanced auth, backups

### Migrate to Phase 3 when:
- **Users**: 1,000+ active users
- **Database**: 6GB+ usage
- **Bandwidth**: 200GB+ monthly
- **Performance**: Need read replicas

### Migrate to AWS when:
- **Users**: 10,000+ active users
- **Compliance**: Enterprise requirements
- **Custom**: Microservices architecture
- **Budget**: $500+/month acceptable

## 📈 Performance Monitoring

- **Supabase Dashboard**: Database metrics
- **Vercel Analytics**: Function performance
- **Custom Analytics**: User behavior tracking
- **Error Tracking**: Built-in error logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details