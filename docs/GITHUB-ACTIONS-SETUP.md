# GitHub Actions Setup Guide

## Overview

This repository uses GitHub Actions to automatically deploy to Coolify when you push to the `dev` branch.

## Required Secrets

You need to add the following secret to your GitHub repository:

### COOLIFY_WEBHOOK_URL

This is the webhook URL from Coolify that triggers deployments.

## How to Set Up

### 1. Get Your Coolify Webhook URL

1. Log in to your Coolify dashboard
2. Navigate to your application (wedding photo gallery)
3. Click on the **Webhooks** tab in the left sidebar
4. You should see a webhook URL that looks like:
   ```
   https://your-coolify-domain.com/api/v1/deploy?uuid=YOUR-UUID&force=false
   ```
5. **Copy this entire URL** (click the copy button if available)

**Important Notes:**

- ⚠️ Make sure you're copying the **webhook URL**, NOT the Coolify dashboard URL
- ⚠️ If the URL doesn't contain `/api/v1/deploy`, it's the wrong URL
- ⚠️ If you see `http://http://` in any redirects, you need to fix your Coolify FQDN settings:
  - Go to Coolify Settings → Configuration → Instance Settings
  - Update the FQDN to your correct domain (without `http://` prefix)
  - Example: Use `coolify.yourdomain.com` not `http://coolify.yourdomain.com`

### 2. Add the Secret to GitHub

1. Go to your GitHub repository: https://github.com/rabira-hierpa/our-wedding
2. Click on **Settings** (top menu)
3. In the left sidebar, click on **Secrets and variables** → **Actions**
4. Click the **New repository secret** button
5. Add the following:
   - **Name:** `COOLIFY_WEBHOOK_URL`
   - **Value:** Your Coolify webhook URL (paste the full URL)
6. Click **Add secret**

### 3. Test the Deployment

Once you've added the secret:

1. Make any small change to your repository
2. Commit and push to the `dev` branch:
   ```bash
   git add .
   git commit -m "Test auto-deployment"
   git push origin dev
   ```
3. Go to the **Actions** tab in your GitHub repository
4. Watch the deployment workflow run
5. If successful, you should see ✅ "Deployment triggered successfully"

## Workflow Features

- **Automatic Deployment:** Pushes to `dev` branch trigger deployment
- **PR Previews:** Pull requests also trigger deployments
- **Status Comments:** The workflow comments on PRs with deployment status
- **Error Handling:** Failed deployments are reported with details

## Troubleshooting

### Error: Empty URL ('')

**Cause:** The `COOLIFY_WEBHOOK_URL` secret is not set or is empty.  
**Solution:** Follow the steps above to add the secret.

### Error: HTTP 302 (Redirect to login)

**Cause:** You're using the wrong URL - it's redirecting to the Coolify login page.  
**Solution:**

- You need the **webhook URL**, not the dashboard URL
- In Coolify: Go to your app → **Webhooks** tab → Copy the webhook URL
- The URL should contain `/api/v1/deploy?uuid=...`
- Example correct URL: `https://coolify.example.com/api/v1/deploy?uuid=abc123&force=false`
- Example wrong URL: `https://coolify.example.com` (dashboard URL)

### Error: Malformed redirect `http://http://...`

**Cause:** Your Coolify FQDN setting is incorrect.  
**Solution:**

1. Go to Coolify Settings → Configuration → Instance Settings
2. Find the FQDN field
3. Remove any `http://` or `https://` prefix
4. Use just the domain: `coolify.yourdomain.com`
5. Save and restart Coolify if needed

### Error: HTTP 4xx or 5xx

**Cause:** The webhook URL is incorrect or Coolify is not accessible.  
**Solution:**

- Verify the webhook URL in Coolify
- Check that Coolify is accessible from GitHub Actions (public internet)
- Ensure the webhook is enabled in Coolify
- Test the webhook manually with curl:
  ```bash
  curl "YOUR_WEBHOOK_URL"
  ```

### Deployment Triggered but Nothing Happens

**Cause:** The webhook might not be configured correctly in Coolify.  
**Solution:**

- Check Coolify logs for the application
- Verify the webhook settings in Coolify
- Ensure the application is set to deploy on webhook trigger

## Current Configuration

The workflow is configured to:

- **Trigger on:** Push to `dev` branch
- **Also trigger on:** Pull requests to `dev` branch
- **Deployment method:** Coolify webhook (GET request)
- **Status reporting:** Comments on PRs with deployment status

## Need Help?

If you continue to have issues:

1. Check the [GitHub Actions logs](https://github.com/rabira-hierpa/our-wedding/actions) for detailed error messages
2. Verify your Coolify webhook configuration
3. Ensure the webhook URL is correct and accessible
