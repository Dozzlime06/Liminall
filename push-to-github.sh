#!/bin/bash

echo "🚀 Pushing to GitHub with authentication..."
echo ""

# Configure git to use the token
echo "🔑 Setting up authentication..."
git remote set-url origin https://$GITHUB_PERSONAL_ACCESS_TOKEN@github.com/Dozzlime06/Liminall.git

# Pull first to sync (if needed)
echo ""
echo "📥 Syncing with GitHub..."
git pull origin main --allow-unrelated-histories --no-edit 2>/dev/null || echo "Already up to date"

# Stage all changes
echo ""
echo "📦 Staging changes..."
git add .

# Commit changes
echo ""
echo "💾 Committing changes..."
git commit -m "Deploy ClaimManagerBalance v6.0 - Balance-based token claim with auto-sweep" || echo "Nothing to commit"

# Push to GitHub
echo ""
echo "⬆️ Pushing to GitHub..."
git push origin main

echo ""
echo "✨ Done! View at: https://github.com/Dozzlime06/Liminall"
