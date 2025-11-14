#!/bin/bash
echo "🚀 Deploying Liminal Dreams to Vercel (Serverless)..."
echo ""

rm -f .git/index.lock

echo "📦 Staging serverless API functions..."
git add api/ vercel.json server/storage.ts

echo "💾 Committing..."
git commit -m "Convert Express backend to Vercel serverless functions

- Created /api folder with serverless endpoints
- Converted all routes to Vercel functions
- Updated vercel.json for static file serving
- Removed unused User types from storage
- Ready for Vercel deployment!"

echo "⬆️ Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Done! Vercel will auto-deploy now."
echo "📱 Check: https://vercel.com/dashboard"
echo "🌐 Your site: https://liminall.vercel.app"
