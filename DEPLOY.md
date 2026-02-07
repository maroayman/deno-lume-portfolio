# Deploying to Vercel

## Quick Deploy

1. **Install Vercel CLI** (if not already installed):

```bash
npm i -g vercel
```

2. **Login to Vercel**:

```bash
vercel login
```

3. **Deploy**:

```bash
vercel
```

Follow the prompts:

- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? `deno-lume-portfolio` (or your preferred name)
- Directory? `./` (press Enter)
- Override settings? **N**

4. **Production Deploy**:

```bash
vercel --prod
```

## Alternative: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect the settings from `vercel.json`
5. Click "Deploy"

## Configuration

The `vercel.json` file is already configured with:

- **Build Command**: `deno task build`
- **Output Directory**: `dist`
- **Install Command**: Installs Deno automatically

## Environment Variables

No environment variables are required for this static site.

## Custom Domain

After deployment, you can add a custom domain:

1. Go to your project settings on Vercel
2. Navigate to "Domains"
3. Add your custom domain

## Notes

- The site is fully static (no server-side rendering)
- All pages are pre-generated during build
- Resume PDF is included in the build
- Dark/light theme toggle works client-side
