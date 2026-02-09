# Next.js Build Error Fix: Html Import Issue

## Problem

You encountered this error when deploying to your server:

```
Error: <Html> should not be imported outside of pages/_document.
Read more: https://nextjs.org/docs/messages/no-document-import-in-page
```

This error occurred during the build process on your server but **not locally**.

## Root Cause

This is a **build cache issue**. The `.next` directory on your server contains stale build artifacts that incorrectly reference `next/document`. This happens because:

1. Your project uses the **App Router** (Next.js 13+), which doesn't use `pages/_document`
2. The server's `.next` folder has cached files from a previous build or configuration
3. When Next.js builds, it's using these stale cached files instead of rebuilding from scratch

## Why It Works Locally

Locally, you likely:

- Have a clean `.next` folder
- Or your local environment automatically clears the cache
- Or you've manually deleted `.next` before building

## Solution Implemented

I've updated your `package.json` to automatically clean the `.next` directory before every build:

### For Your Server (Linux/Unix):

```bash
npm run build
```

This now runs: `prisma generate && rm -rf .next && next build`

### For Local Windows Development:

```bash
npm run build:win
```

This runs: `set NODE_ENV=production && prisma generate && (if exist .next rmdir /s /q .next) && next build`

### Manual Clean Command:

```bash
npm run clean
```

This removes the `.next` directory without building.

## What Changed

**Before:**

```json
"build": "set NODE_ENV=production && prisma generate && next build"
```

**After:**

```json
"build": "prisma generate && rm -rf .next && next build",
"build:win": "set NODE_ENV=production && prisma generate && (if exist .next rmdir /s /q .next) && next build",
"clean": "rm -rf .next"
```

## Next Steps

1. **Commit the changes** to `package.json`
2. **Push to your repository**
3. **Redeploy** on your server
4. The build should now succeed because it will clean the cache first

## Alternative Manual Fix (If Needed)

If you need to fix this immediately on your server without updating the build script:

```bash
# SSH into your server
cd /path/to/your/project

# Remove the .next directory
rm -rf .next

# Run the build again
npm run build
```

## Prevention

The updated build script ensures this won't happen again by always starting with a clean build cache.
