# Backend Deployment Fix for Vercel

## The Problem
Your Express server was configured for traditional hosting (with `server.listen()`), but Vercel requires serverless functions. The 404 error occurs because Vercel can't find the correct entry point.

## What I Fixed

### 1. Created Serverless Entry Point (`api/index.js`)
- Converted your Express app to work as a Vercel serverless function
- Removed `server.listen()` and socket.io (not supported in serverless)
- Added proper CORS configuration for production
- Enhanced error handling and route documentation

### 2. Updated `vercel.json`
- Changed entry point from `server.js` to `api/index.js`
- Added production environment variables
- Configured proper routing for serverless

### 3. Optimized Database Connection (`config/database.js`)
- Added connection caching for serverless environment
- Prevents multiple database connections per request
- Optimized connection settings for Vercel

## Deployment Steps

### Option 1: Deploy Server Separately (Recommended)

1. **Create a new Vercel project for your backend:**
   ```bash
   cd server
   vercel --prod
   ```

2. **Or deploy via Vercel Dashboard:**
   - Import your GitHub repo
   - Set **Root Directory** to `server`
   - Framework will auto-detect as Node.js

### Option 2: Deploy from Root with Server Configuration

Update your root `vercel.json` to handle both client and server:

```json
{
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "client/dist" }
    },
    {
      "src": "server/api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/$1"
    }
  ]
}
```

## Environment Variables

Set these in your Vercel project settings:

```env
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=https://your-frontend-url.vercel.app
```

## Important Notes

### Socket.io Limitation
Socket.io doesn't work in Vercel's serverless environment. For real-time features, consider:
- **Vercel Edge Functions** with WebSockets
- **Pusher** or **Ably** for real-time messaging
- **Server-Sent Events (SSE)** for simple real-time updates

### API Endpoints Available
After deployment, your API will be available at:
- `GET /` - API information
- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/events` - Get events
- `POST /api/events` - Create event
- `GET /api/bookings` - Get bookings
- `POST /api/bookings` - Create booking
- `POST /api/payments` - Process payment
- `GET /api/chat` - Chat endpoints

## Testing the Fix

1. **Deploy the backend** using one of the options above
2. **Test the health endpoint**: `https://your-backend-url.vercel.app/api/health`
3. **Update your frontend** to use the new backend URL
4. **Test API calls** from your frontend

## Update Frontend Configuration

Update your client's environment variables:

```env
# In client/.env.production
VITE_API_URL=https://your-backend-url.vercel.app
```

Or update the root `vercel.json` client configuration:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-backend-url.vercel.app/api/$1"
    }
  ]
}
```

## Troubleshooting

### If you still get 404 errors:
1. Check Vercel deployment logs
2. Verify environment variables are set
3. Test individual API endpoints
4. Check MongoDB connection string

### If database connection fails:
1. Ensure MongoDB URI is correct
2. Check if your MongoDB allows connections from Vercel IPs
3. Verify database credentials

### If CORS errors occur:
1. Update `CLIENT_URL` environment variable
2. Check CORS configuration in `api/index.js`

## Next Steps

1. Deploy the backend using one of the methods above
2. Get your backend URL from Vercel
3. Update your frontend to use the new backend URL
4. Test all API endpoints
5. Consider implementing alternative real-time features if needed

The 404 error should be resolved once you redeploy with these changes!
