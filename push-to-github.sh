#!/bin/bash

echo "🚀 Pushing Liminal Dreams DApp to GitHub..."
echo ""

# Update remote URL to Liminall repository
echo "📝 Updating remote URL..."
git remote set-url origin https://github.com/Dozzlime06/Liminall.git

# Show current remote
echo "✅ Remote updated to:"
git remote -v | grep origin | head -1

# Stage all changes
echo ""
echo "📦 Staging all files..."
git add .

# Commit changes
echo ""
echo "💾 Committing changes..."
git commit -m "Complete Liminal Dreams DApp: NFT minting, AI agents, chat support, Vercel deployment ready"

# Push to GitHub
echo ""
echo "⬆️ Pushing to GitHub..."
git push origin main

echo ""
echo "✨ Done! Check your repo: https://github.com/Dozzlime06/Liminall"
