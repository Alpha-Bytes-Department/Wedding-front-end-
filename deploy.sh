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

# Preserve old assets so users with stale HTML can still load old chunks
if [ -d "dist/assets" ]; then
    echo "📦 Backing up old assets for graceful transition..."
    cp -r dist/assets /tmp/wedding-old-assets-backup
fi

npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    
    # Merge old asset chunks back into the new build so in-flight users don't break.
    # New files overwrite old ones with the same name; old hashed chunks are preserved.
    if [ -d "/tmp/wedding-old-assets-backup" ]; then
        echo "🔀 Merging old assets into new build for zero-downtime..."
        cp -rn /tmp/wedding-old-assets-backup/* dist/assets/ 2>/dev/null || true
        rm -rf /tmp/wedding-old-assets-backup
    fi
    
    # Clean up asset files older than 7 days
    find dist/assets -type f -mtime +7 -delete 2>/dev/null || true
    
    echo "📂 Deploying to web directory..."
    # Also sync to /var/www/wedding for backup static serving
    sudo rsync -a dist/ /var/www/wedding/
    sudo find /var/www/wedding/assets -type f -mtime +7 -delete 2>/dev/null || true
    sudo chown -R www-data:www-data /var/www/wedding
    
    echo "🔄 Restarting PM2 process..."
    pm2 restart wedding-frontend-prod
    
    echo "🚀 Deployment complete!"
    echo "🌐 Site available at: https://erieweddingofficiants.com"
else
    echo "❌ Build failed"
    exit 1
fi
