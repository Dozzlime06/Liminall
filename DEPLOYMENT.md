# Deployment Guide - Liminal Dreams NFT DApp

## Vercel Deployment

### Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Privy App ID (from https://dashboard.privy.io)
- OpenAI API Key (from https://platform.openai.com/api-keys)

### Step 1: Push to GitHub
1. Create a new GitHub repository
2. Push your code to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

### Step 2: Deploy to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Add Environment Variables
In Vercel project settings → Environment Variables, add:

#### Required Variables:
```
VITE_PRIVY_APP_ID=your_privy_app_id_here
VITE_CONTRACT_ADDRESS=0x7d5C48A82E13168d84498548fe0a2282b9C1F16B
VITE_CHAIN_ID=999
VITE_RPC_URL=https://rpc.hyperliquid.xyz/evm
OPENAI_API_KEY=your_openai_api_key_here
SESSION_SECRET=generate_random_string_here
```

#### How to Get API Keys:

**Privy App ID:**
1. Go to https://dashboard.privy.io
2. Create a new app or select existing app
3. Copy the App ID from Settings

**OpenAI API Key:**
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy and save the key (you won't see it again)

**Session Secret:**
- Generate a random string (at least 32 characters)
- You can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your app will be live at: `https://your-project.vercel.app`

### Step 5: Configure Privy for Production
1. Go to https://dashboard.privy.io
2. Add your Vercel domain to **Allowed Domains**
   - Example: `https://your-project.vercel.app`
3. Save settings

## Netlify Deployment (Alternative)

Similar steps, but:
- Build command: `npm run build`
- Publish directory: `dist`
- Add same environment variables in Netlify dashboard

## Railway Deployment (Alternative)

1. Connect GitHub repository
2. Add environment variables
3. Railway will auto-detect and deploy

## Important Notes

- The app requires a backend for AI chat support
- Make sure all environment variables are set correctly
- Test the production build locally first: `npm run build && npm run preview`
- Monitor your OpenAI API usage to avoid unexpected costs

## Troubleshooting

**Privy not connecting:**
- Check VITE_PRIVY_APP_ID is correct
- Verify domain is whitelisted in Privy dashboard

**Wallet not connecting:**
- Ensure Chain ID 999 is configured
- Check RPC URL is accessible

**AI chat not working:**
- Verify OPENAI_API_KEY is valid
- Check API key has credits

**Build fails:**
- Run `npm install` locally
- Check for TypeScript errors: `npm run build`

## Support

For issues, check:
- Privy Docs: https://docs.privy.io
- OpenAI Docs: https://platform.openai.com/docs
- Vercel Docs: https://vercel.com/docs
