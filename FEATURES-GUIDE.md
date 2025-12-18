# New Features Setup Guide

## 🎉 Features Added

### 1. Digital Wishes (Telegram Bot)
Guests can leave heartfelt wishes for the newlyweds.

**Command:**
```
/wish Your beautiful message here
```

**Example:**
```
/wish Wishing you both a lifetime of love and happiness!
```

### 2. Wedding Group Join Flow (Telegram Bot)
Guests can join a wedding photo group where all photos are shared.

**Command:**
```
/joingroup
```

**Flow:**
1. User sends `/joingroup`
2. Bot shows confirmation with Yes/No buttons
3. On "Yes": Bot creates private invite link and marks user as joined
4. All future photo uploads from this user are automatically forwarded to the group

**Requirements:**
- Set environment variable: `WEDDING_GROUP_CHAT_ID`
- Bot must be admin in the wedding group
- Bot needs permission to create invite links

### 3. Photo Likes (Website)
Visitors can like photos on the gallery.

**Features:**
- Heart icon appears on hover
- Click to like/unlike
- Like count displayed
- Persistent likes using localStorage for web guests
- Animated heart when liked

### 4. Upload Notifications (Website)
Real-time notifications when guests upload photos.

**Behavior:**
- Appears in top-right corner
- Shows: "[Name] uploaded [X] photos"
- Animated sparkle effect
- Smart timing:
  - **30 seconds** if only one person uploaded in last 5 minutes
  - **3 seconds** if multiple people uploaded recently
- Checks for new uploads every 3 seconds

## 🛠️ Setup Instructions

### 1. Environment Variables

Add to your `.env` file:

```bash
# Telegram Wedding Group (Optional)
WEDDING_GROUP_CHAT_ID="-1001234567890"
```

**How to get Group Chat ID:**
1. Add your bot to the group
2. Make bot admin with "Invite users" permission
3. Send a message in the group
4. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
5. Look for `"chat":{"id":-1001234567890}` in the response

### 2. Database Migration

The schema has been updated. Run:

```bash
# Production (Coolify)
# Migrations run automatically via docker-entrypoint.sh

# Local Development
npx prisma db push
```

**New Tables:**
- `wishes` - Stores guest wishes
- `likes` - Tracks photo likes
- Updated `guests` table with `in_wedding_group` field

### 3. Telegram Bot Commands

Update bot commands in BotFather:

```
start - Register for the wedding gallery
help - Show help and available commands
myphotos - View and manage your uploaded photos
wish - Leave a wish for the newlyweds
joingroup - Join the wedding photo group
```

**BotFather setup:**
1. Open [@BotFather](https://t.me/BotFather)
2. Send `/mybots`
3. Select your bot
4. Choose "Edit Bot" → "Edit Commands"
5. Paste the commands above

## 📋 API Endpoints

### Get Wishes
```
GET /api/wishes
```

Returns all wishes with guest information.

### Toggle Like
```
POST /api/likes
Body: { photoId: string, guestId: string }
```

Returns: `{ liked: true/false }`

### Get Like Count
```
GET /api/likes?photoId=<id>
```

Returns: `{ count: number }`

### Get Photos (Enhanced)
```
GET /api/photos
```

Now includes `likeCount` and `likes` array for each photo.

## 🎨 Features in Detail

### Upload Notifications Logic

```typescript
// Notification display duration
const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
const recentPhotos = photos.filter(/* uploaded after 5 min ago */);
const uniqueUsers = new Set(recentPhotos.map(p => p.guestId));

const displayDuration = uniqueUsers.size === 1 
  ? 30000  // 30 seconds for single user
  : 3000;  // 3 seconds for multiple users
```

### Like System

Web visitors get a unique guest ID stored in localStorage:
```typescript
guestId = `web-guest-${Date.now()}-${Math.random()}`
```

This allows anonymous likes without registration.

### Group Photo Forwarding

Photos are only forwarded if:
1. `WEDDING_GROUP_CHAT_ID` is set
2. User has confirmed group join (`inWeddingGroup = true`)
3. Upload is successful

## 🚀 Testing

### Test Wishes
1. Open Telegram bot
2. Send: `/wish Congratulations to the happy couple!`
3. Check database: `SELECT * FROM wishes;`

### Test Group Join
1. Send `/joingroup`
2. Click "Yes, join group"
3. Click the invite link
4. Upload a photo
5. Check if photo appears in group

### Test Likes
1. Open website
2. Hover over photo
3. Click heart icon
4. Refresh page - like should persist

### Test Upload Notifications
1. Upload photo via Telegram
2. Wait 3 seconds
3. Check website - notification should appear top-right

## 🔒 Security Notes

1. **Web Guest IDs**: Generated client-side, can be manipulated
2. **Group Invite Links**: Single-use links (member_limit = 1)
3. **Photo Forwarding**: Only for opted-in users
4. **Wishes**: Anyone registered can leave wishes

## 📱 User Experience Flow

### New Guest Journey:
1. Clicks Telegram bot link → `/start` registration
2. Reads welcome message with `/joingroup` option
3. Sends `/wish` with heartfelt message
4. Uploads photos via Telegram
5. Website visitors see upload notification
6. Visitors like the photos

### Existing Guest Updates:
- Send `/help` to see new commands
- `/wish` and `/joingroup` available immediately

## 🎯 Next Steps

Optional enhancements:

1. **Wishes Display**: Create a wishes section on website to display all messages
2. **Like Notifications**: Notify guests when their photos get liked
3. **Group Statistics**: Show group member count
4. **Wish Moderation**: Admin approval for wishes before display
5. **Anonymous Guests**: Full guest registration on website for better like tracking

