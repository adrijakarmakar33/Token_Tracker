#!/bin/bash

# 🚀 Trending Token Tracker - Deployment Script
# This script will deploy your app to Vercel for the hackathon demo

echo "🚀 Deploying Trending Token Tracker to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your app is now live at the URL shown above!"
echo "🎉 Ready for hackathon demo!"
