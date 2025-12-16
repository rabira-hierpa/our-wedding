# 🚀 Coolify Deployment Setup with GitHub Actions

This guide explains how to set up automatic deployments to Coolify using GitHub Actions.

## 📋 Prerequisites

- Coolify instance running on your VPS
- Application configured in Coolify
- GitHub repository with admin access

## 🔧 Setup Instructions

### Step 1: Get Coolify Webhook URL

1. **Log into Coolify Dashboard**
2. Navigate to your application: `our-wedding-dev`
3. Go to **Webhooks** or **General** tab
4. Look for **Webhook URL** or **Deploy Webhook**
5. Copy the webhook URL (it looks like):
   ```
   https://your-coolify-domain/api/v1/deploy/webhooks/xxx-xxx-xxx
   ```

### Step 2: Get Coolify API Token (Optional but Recommended)

1. In Coolify, go to **Settings** → **API Tokens**
2. Click **Create Token**
3. Give it a name: `GitHub Actions`
4. Copy the token (you won't see it again!)

> **Note**: If Coolify doesn't require a token for webhooks, you can skip the `Authorization` header in the workflow.

### Step 3: Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

   **Secret 1:**
   - **Name**: `COOLIFY_WEBHOOK_URL`
   - **Value**: Your webhook URL from Step 1

   **Secret 2** (if using API token):
   - **Name**: `COOLIFY_TOKEN`
   - **Value**: Your API token from Step 2

### Step 4: Enable GitHub Actions

1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select:
   - ✅ **Read and write permissions**
3. Click **Save**

## 🎯 How It Works

### On Push to `dev` Branch

When you push to the `dev` branch:
```bash
git push origin dev
```

GitHub Actions will:
1. ✅ Checkout the code
2. ✅ Trigger Coolify deployment via webhook
3. ✅ Coolify pulls the latest code and deploys

### On Pull Request to `dev` Branch

When you create a PR targeting the `dev` branch:
```bash
git checkout -b feature/new-feature
# make changes
git push origin feature/new-feature
# Create PR on GitHub
```

GitHub Actions will:
1. ✅ Checkout the PR code
2. ✅ Trigger Coolify preview deployment
3. ✅ Post a comment on the PR with deployment status

## 🔍 Monitoring Deployments

### GitHub Actions
- Go to **Actions** tab in your repository
- Click on the latest workflow run
- View logs for deployment status

### Coolify Dashboard
- Go to your application in Coolify
- Click on **Deployments** tab
- View real-time deployment logs

## 🛠️ Customization

### Deploy Multiple Environments

If you have both `dev` and `production` environments:

```yaml
- name: Deploy to Production
  if: github.ref == 'refs/heads/main'
  run: |
    curl --request GET '${{ secrets.COOLIFY_PROD_WEBHOOK_URL }}' \
      --header 'Authorization: Bearer ${{ secrets.COOLIFY_TOKEN }}'
```

### Add Deployment Notifications

To notify Slack/Discord on deployment:

```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "🚀 Deployed to Coolify: ${{ github.sha }}"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### Run Tests Before Deployment

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'

- name: Install dependencies
  run: npm ci

- name: Run tests
  run: npm test

- name: Deploy to Coolify
  if: success()
  run: |
    curl --request GET '${{ secrets.COOLIFY_WEBHOOK_URL }}'
```

## ⚠️ Troubleshooting

### Webhook Not Triggering Deployment

**Problem**: GitHub Action succeeds but Coolify doesn't deploy

**Solutions**:
1. Verify webhook URL is correct
2. Check Coolify logs for webhook errors
3. Ensure Coolify can reach the internet
4. Try triggering webhook manually:
   ```bash
   curl --request GET 'YOUR_WEBHOOK_URL'
   ```

### Authentication Errors

**Problem**: `401 Unauthorized` or `403 Forbidden`

**Solutions**:
1. Verify `COOLIFY_TOKEN` is set correctly
2. Check token hasn't expired
3. Ensure token has proper permissions
4. Some Coolify versions don't require tokens - try removing the `Authorization` header

### PR Comments Not Working

**Problem**: Bot doesn't comment on PRs

**Solutions**:
1. Ensure workflow has `write` permissions (see Step 4)
2. Check GitHub Actions logs for errors
3. Verify `GITHUB_TOKEN` has proper scopes

## 📚 Additional Resources

- [Coolify Documentation](https://coolify.io/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Webhook Debugging](https://webhook.site) - Test webhooks

## 🔐 Security Best Practices

1. ✅ **Never commit secrets** to the repository
2. ✅ **Use GitHub Secrets** for sensitive data
3. ✅ **Rotate API tokens** periodically
4. ✅ **Use branch protection** rules for production
5. ✅ **Review PR deployments** before merging

## 📝 Quick Reference

### Trigger Manual Deployment

```bash
# Via GitHub CLI
gh workflow run deploy.yml

# Via API
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/OWNER/REPO/actions/workflows/deploy.yml/dispatches \
  -d '{"ref":"dev"}'
```

### Check Deployment Status

```bash
# Via Coolify API
curl -X GET \
  -H "Authorization: Bearer $COOLIFY_TOKEN" \
  https://your-coolify-domain/api/v1/deployments
```
