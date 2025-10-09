#!/bin/bash

# Deploy script for Wedding Frontend
# This script builds and deploys the optimized frontend

echo "🔨 Building production bundle..."
cd /root/Wedding-front-end-
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
