#!/bin/bash
rm -f .git/index.lock .git/config.lock
git add .
git commit -m "Complete Liminal Dreams DApp: NFT minting, AI agents, chat support" || echo "Nothing to commit"
git push origin main
echo "✅ Pushed to https://github.com/Dozzlime06/Liminall"
