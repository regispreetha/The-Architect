# Deployment Guide - Floor Plan Designer

## Deploy to Netlify (5 minutes)

### Option 1: Netlify CLI (Recommended)

1. **Install Netlify CLI** (in PowerShell):
   ```powershell
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```powershell
   netlify login
   ```

3. **Deploy from your local machine**:
   ```powershell
   # Clone the repository
   git clone http://127.0.0.1:41729/git/regispreetha/The-Architect
   cd The-Architect
   
   # Install dependencies
   cd frontend
   npm install
   cd ..
   
   # Deploy
   netlify deploy --prod
   ```

4. Follow the prompts:
   - Create & configure a new site
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

5. **Done!** You'll get a URL like `https://your-site-name.netlify.app`

### Option 2: Netlify Drop (Easiest)

1. **Build locally**:
   ```powershell
   cd frontend
   npm install
   npm run build
   ```

2. **Go to Netlify**:
   - Visit https://app.netlify.com/drop
   - Drag the `frontend/dist` folder onto the page
   - Done! Instant deployment

### Option 3: GitHub Integration (Best for continuous deployment)

1. **Push to GitHub** (if not already there)
2. **Connect to Netlify**:
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Build settings:
     - Base directory: `frontend`
     - Build command: `npm run build`
     - Publish directory: `frontend/dist`
   - Click "Deploy site"

3. **Automatic deployments**: Every push to your repo triggers a new deployment

## What Works Without Backend

✅ **Full functionality**:
- Draw walls, doors, windows
- Place and arrange furniture
- Add measurements
- Layer management
- 3D visualization
- Grid and snap-to-grid
- Export to PDF, SVG, JSON

❌ **Not available** (requires backend):
- Save projects to database
- Load previous projects
- Multi-user collaboration

## Adding Backend (Optional)

To enable project persistence, deploy the backend to:

**Render.com** (Free tier available):
```bash
# Deploy backend as a Web Service
# Build Command: cd backend && npm install
# Start Command: node backend/server.js
```

**Railway.app** (Free tier available):
```bash
# One-click deploy from GitHub
# Automatically detects Node.js
```

Then update the frontend API calls to point to your backend URL.

## Environment Variables

None required for the frontend! The app works standalone.

## Custom Domain (Optional)

In Netlify dashboard:
1. Domain settings → Add custom domain
2. Follow DNS configuration instructions
3. Free SSL certificate included

## Troubleshooting

**Build fails?**
- Ensure Node.js 18+ is installed
- Run `npm install` in frontend directory
- Check that all dependencies are in package.json

**App not loading?**
- Check browser console for errors
- Verify the dist folder was created
- Ensure netlify.toml is in the root directory

**3D view not working?**
- Some older browsers may not support WebGL
- Try Chrome, Firefox, or Edge (latest versions)
