# 🚀 Deploy to Vercel

## Quick Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Complete Trending Token Tracker for hackathon"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Click "Deploy"

### 3. Get Live URL
Your app will be available at: `https://your-project-name.vercel.app`

## Environment Variables (Optional)
Add these in Vercel dashboard if needed:
- `COINDCX_API_KEY` - For real CoinDCX data
- `AGENTKIT_API_KEY` - For real gasless swaps

## Demo URL
Once deployed, you'll have a live URL to share with hackathon judges!

## Local Development
```bash
npm run dev
# Open http://localhost:3000
```

## Build for Production
```bash
npm run build
npm start
```

---
**Your Trending Token Tracker is ready for the hackathon! 🏆**
