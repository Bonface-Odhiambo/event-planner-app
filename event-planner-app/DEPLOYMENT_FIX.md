# Vercel Deployment Fix for Event Planner App

## The Problem
You're getting a MIME type error because Vercel is not correctly building and serving your Vite React application. This happens when the build configuration doesn't match your project structure.

## Solutions

### Option 1: Deploy from Root Directory (Current Setup)
I've created a root-level `vercel.json` that should work with your current GitHub deployment:

1. **Use the root-level vercel.json** - This tells Vercel to build the client app from the root directory
2. **Update your backend URL** - Replace `https://your-backend-url.vercel.app` with your actual backend URL

### Option 2: Deploy Client and Server Separately (Recommended)

#### Deploy the Client:
1. In Vercel dashboard, create a new project
2. Connect your GitHub repo
3. Set **Root Directory** to `client`
4. Framework will auto-detect as Vite
5. Deploy

#### Deploy the Server:
1. Create another Vercel project
2. Connect the same GitHub repo
3. Set **Root Directory** to `server`
4. Framework will auto-detect as Node.js
5. Deploy

#### Update API URLs:
After deploying both, update the client's API calls to point to your server's Vercel URL.

### Option 3: Quick Fix for Current Deployment

If you want to fix your current deployment quickly:

1. **Go to your Vercel project settings**
2. **Build & Development Settings**:
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/dist`
   - Install Command: `cd client && npm install`

## Environment Variables

Make sure to set these in your Vercel project settings:

### Client Environment Variables:
```
VITE_API_URL=https://your-server-url.vercel.app
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

### Server Environment Variables:
```
NODE_ENV=production
DATABASE_URL=your_database_url
STRIPE_SECRET_KEY=your_stripe_secret
JWT_SECRET=your_jwt_secret
```

## Testing the Fix

1. After redeploying, check the browser console for errors
2. Verify that static assets (JS, CSS) are loading correctly
3. Test API calls to ensure they're reaching your backend

## Common Issues and Solutions

### Issue: Static files not found
**Solution**: Ensure `outputDirectory` in vercel.json matches your Vite build output (`dist`)

### Issue: API calls failing
**Solution**: Update API base URL in your client code to point to your deployed backend

### Issue: Routing not working
**Solution**: The `rewrites` in vercel.json handle client-side routing for React Router

## Next Steps

1. Choose one of the deployment options above
2. Update your backend URL in the client configuration
3. Redeploy and test
4. Monitor the deployment logs in Vercel dashboard for any issues

## Need Help?

If you're still having issues:
1. Check Vercel deployment logs
2. Verify build command is working locally: `cd client && npm run build`
3. Test the built files locally: `cd client && npm run preview`
