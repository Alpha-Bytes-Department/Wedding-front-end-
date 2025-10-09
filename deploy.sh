#!/bin/bash

# Deploy script for Wedding Frontend
# This script builds and deploys the optimized frontend with latest changes

echo "🔨 Wedding Frontend Deployment"
echo "==============================="

cd /root/Wedding-front-end-

# Stash any local changes (if any)
echo "💾 Stashing local changes..."
git stash

# Pull latest changes from repository
echo "📥 Pulling latest changes from repository..."
git pull origin main

if [ $? -ne 0 ]; then
    echo "❌ Git pull failed"
    exit 1
fi

# Check if package.json was modified in the latest pull
if git diff HEAD~1 --name-only | grep -q "package.json"; then
    echo "📦 package.json changed, installing dependencies..."
    npm install --legacy-peer-deps
    if [ $? -ne 0 ]; then
        echo "❌ npm install failed"
        exit 1
    fi
fi

echo "🔨 Building production bundle..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    
    echo "📂 Deploying to web directory..."
    sudo cp -r dist/* /var/www/wedding/
    sudo chown -R www-data:www-data /var/www/wedding
    
    echo "🔄 Restarting PM2 process..."
    pm2 restart wedding-frontend-prod
    
    echo "🚀 Deployment complete!"
    echo "🌐 Site available at: https://erieweddingofficiants.com"
else
    echo "❌ Build failed"
    exit 1
fi
