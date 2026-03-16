# VivahBandhan Deployment Guide

## Free Hosting Options for Production

### 1. Supabase (PostgreSQL) - RECOMMENDED
**Free Tier:**
- 500MB database storage
- 2GB bandwidth/month
- Unlimited API requests
- Built-in authentication
- Real-time subscriptions

**Setup Steps:**
1. Go to [https://supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Update your `.env` file with the DATABASE_URL
6. Run migrations: `npx prisma migrate deploy`

### 2. Vercel (Frontend) + Supabase (Backend)
**Free Tier:**
- Vercel: Unlimited hobby projects
- Supabase: 500MB database
- Perfect for matrimonial apps

**Deploy Frontend:**
```bash
npm i -g vercel
vercel login
cd packages/frontend
vercel --prod
```

**Deploy Backend:**
```bash
cd packages/api
vercel --prod
```

### 3. Railway (Alternative)
**Free Tier:**
- $5 credit/month (sufficient for small apps)
- PostgreSQL included
- Automatic deployments

### 4. Render (Alternative)
**Free Tier:**
- Web services: Always free
- PostgreSQL: 90-day free trial
- Good for testing

## Step-by-Step Production Deployment

### Step 1: Set up Supabase Database
1. Create Supabase account
2. Create new project
3. Get connection string from Settings > Database
4. Add to `.env`:
   ```env
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Step 2: Run Database Migrations
```bash
cd packages/api
npx prisma migrate deploy
```

### Step 3: Deploy Backend
Option A - Vercel:
```bash
cd packages/api
vercel --prod
```

Option B - Railway:
```bash
cd packages/api
railway login
railway init
railway up
```

### Step 4: Deploy Frontend
```bash
cd packages/frontend
vercel --prod
```

### Step 5: Update Environment Variables
Update CORS_ORIGIN in backend to allow your frontend domain:
```env
CORS_ORIGIN=https://your-app.vercel.app
```

## Environment Variables Checklist

### Backend (.env)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGIN=https://your-frontend.vercel.app
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend.vercel.app/api/v1
```

## Important Notes

1. **Never commit `.env` files** - use `.env.example` as template
2. **Generate strong JWT secrets** - use `openssl rand -base64 32`
3. **Enable Row Level Security** in Supabase for additional security
4. **Set up backups** - Supabase provides automatic backups

## Monitoring (Free Options)

- **Vercel Analytics** - Included with deployment
- **Supabase Dashboard** - Database monitoring
- **UptimeRobot** - Free uptime monitoring (50 monitors)

## Cost Estimate

| Service | Free Tier | Paid (if needed) |
|---------|-----------|------------------|
| Supabase | 500MB DB | $25/month |
| Vercel | Unlimited hobby | $20/month |
| Total | **FREE** | ~$45/month |

Your matrimonial app can run **completely free** for 500MB of data, which is sufficient for thousands of user profiles.