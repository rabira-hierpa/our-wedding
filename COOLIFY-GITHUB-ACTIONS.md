# Coolify GitHub Webhook Setup

You **don't need GitHub Actions** for automatic deployments! Coolify has native GitHub webhook support.

## Setup Steps

### 1. Get Webhook URL from Coolify

- Go to Coolify Dashboard → Your App → **Webhooks** (left sidebar)
- In the **Manual Git Webhooks** section, you'll see a webhook URL
- Set a secret in the **GitHub Webhook Secret** field (remember this!)
- Copy the webhook URL

### 2. Add Webhook to GitHub Repository

- Go to: https://github.com/rabira-hierpa/our-wedding/settings/hooks
- Click **Add webhook**
- **Payload URL:** Paste the Coolify webhook URL
- **Content type:** `application/json`
- **Secret:** Enter the same secret you set in Coolify
- **Which events?** Select **Just the push event**
- Click **Add webhook**

### 3. Test It

```bash
git add .
git commit -m "Test automatic deployment"
git push origin dev
```

That's it! GitHub will now automatically notify Coolify on every push, and Coolify will deploy your app.

## How It Works

1. You push code to GitHub
2. GitHub sends a webhook to Coolify
3. Coolify receives the webhook, pulls the latest code, and deploys
4. No GitHub Actions needed!

## Optional: Pull Request Deployments

If you want PR preview deployments:

- In GitHub webhook settings, also select **Pull requests** event
- Coolify will automatically deploy preview environments for PRs

## Reference

Official docs: https://coolify.io/docs/applications/ci-cd/github/integration#automatic-commit-deployments-with-webhooks-optional
