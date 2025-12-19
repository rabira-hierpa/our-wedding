# 🎨 Wedding Gallery - Component Usage Guide

## Quick Start

The wedding gallery is now fully set up with beautiful animations and elegant design. Here's how to customize it for your wedding:

## 📝 Configuration Steps

### 1. Update Telegram Bot Link

Edit `/components/TelegramGuide.tsx` (line 15):

```typescript
{
  icon: Send,
  title: "Find Our Bot",
  description: "Search for @YourWeddingBot on Telegram",
  action: "Open Telegram",
  link: "https://t.me/your_wedding_bot", // ⬅️ UPDATE THIS
  color: "from-blue-400 to-blue-600",
}
```

Replace `your_wedding_bot` with your actual bot username.

### 2. Customize Page Titles & Messages

#### Hero Section (`/components/HeroSection.tsx`)

```typescript
<h1>A Day to Remember</h1>  // ⬅️ Change to your couple names
<p>Moments of love, captured in time</p>  // ⬅️ Your tagline
```

#### Footer Section (`/components/FooterSection.tsx`)

```typescript
<h3>Forever Grateful</h3>  // ⬅️ Your closing message
<p>Thank you for being part of our story...</p>
```

### 3. Adjust Color Palette (Optional)

Current palette is **romantic rose & amber**. To change colors:

**Option A: Use different Tailwind colors**
Search and replace in all components:

- `rose-` → `purple-` (for purple theme)
- `amber-` → `blue-` (for blue accents)

**Option B: Add custom colors**
Edit `/tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      'wedding-primary': '#your-hex-color',
      'wedding-accent': '#your-hex-color',
    }
  }
}
```

### 4. Customize Animations

All animations use Framer Motion. Common adjustments:

**Slow down animations:**

```typescript
transition={{ duration: 1.2 }} // Increase from 0.8
```

**Remove delays:**

```typescript
transition={{ delay: 0 }} // Remove or set to 0
```

**Disable an animation:**

```typescript
// Remove the motion wrapper
<div> instead of <motion.div>
```

## 🎯 Component Overview

### Main Components

| Component         | Purpose                    | Key Props                |
| ----------------- | -------------------------- | ------------------------ |
| `HeroSection`     | Cinematic entrance         | None                     |
| `TelegramGuide`   | Bot instructions           | None                     |
| `PhotoGallery`    | Main gallery + lightbox    | None                     |
| `FooterSection`   | Closing message            | None                     |
| `AnimatedSection` | Scroll animation wrapper   | `delay`, `className`     |
| `LoadingStates`   | Loading/error/empty states | `onRetry` for ErrorState |

### Usage Example

```tsx
import AnimatedSection from "@/components/AnimatedSection";

export default function MySection() {
  return (
    <AnimatedSection delay={0.2}>
      <h2>This will fade in when scrolled into view</h2>
    </AnimatedSection>
  );
}
```

## 🎬 Animation Timing Reference

| Element        | Animation    | Duration | Delay           | Easing    |
| -------------- | ------------ | -------- | --------------- | --------- |
| Hero Title     | Fade + Scale | 1s       | 0.2s            | easeOut   |
| Guide Cards    | Fade + Slide | 0.5s     | Staggered 0.15s | easeOut   |
| Gallery Photos | Fade + Scale | 0.5s     | Staggered 0.05s | easeOut   |
| Lightbox Modal | Scale + Fade | 0.3s     | 0s              | spring    |
| Hover Effects  | Lift + Scale | 0.3s     | 0s              | easeInOut |

## 📱 Responsive Behavior

The gallery automatically adjusts:

- **Mobile (< 640px)**: 1 column
- **Tablet (640px+)**: 2 columns
- **Desktop (1024px+)**: 3 columns
- **Large (1280px+)**: 4 columns

## 🎨 Font System

- **Headings**: Playfair Display (serif) - romantic, elegant
- **Body**: Inter (sans-serif) - clean, readable

To change fonts, edit `/app/globals.css`:

```css
@import url("your-google-font-url");

:root {
  --font-serif: "Your Serif Font", serif;
  --font-sans: "Your Sans Font", sans-serif;
}
```

## 🔧 Common Customizations

### Change Hero Background

```tsx
// In HeroSection.tsx
<section className="bg-gradient-to-br from-rose-50 via-amber-50 to-pink-50">
  // Change these colors ↑
```

### Adjust Gallery Columns

```tsx
// In PhotoGallery.tsx
<div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4">
  // Modify: sm:columns-X, lg:columns-X, xl:columns-X
```

### Disable Floating Hearts

```tsx
// In HeroSection.tsx, remove or comment out:
<div className="absolute inset-0 overflow-hidden opacity-10">
  {/* ...floating hearts code... */}
</div>
```

### Change Photo Hover Effect

```tsx
// In PhotoGallery.tsx
whileHover={{ y: -8, scale: 1.02 }} // Adjust these values
```

## 🚀 Performance Tips

1. **Lazy load images**: Already implemented via Next.js Image
2. **Optimize photos**: Compress images before upload (800-1200px wide)
3. **Reduce animations**: On slow devices, reduce animation count
4. **Disable polling**: Remove auto-refresh if not needed:
   ```tsx
   // In PhotoGallery.tsx, remove:
   const interval = setInterval(fetchPhotos, 10000);
   ```

## 🎭 Advanced: Creating Custom Animations

### Example: Slide from Right

```tsx
<motion.div
  initial={{ opacity: 0, x: 100 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
>
  Your content
</motion.div>
```

### Example: Stagger Children

```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }}
>
  {items.map((item) => (
    <motion.div variants={childVariant}>{item}</motion.div>
  ))}
</motion.div>
```

## 📚 Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [Google Fonts](https://fonts.google.com/)

## 🆘 Troubleshooting

**Q: Animations aren't working**

- Check browser DevTools console for errors
- Ensure `framer-motion` is installed: `npm install framer-motion`

**Q: Images not loading**

- Verify API route `/api/photos` is working
- Check browser Network tab for 404 errors
- Ensure database has photos

**Q: Layout looks broken**

- Run `npm install` to ensure all dependencies are installed
- Clear `.next` folder: `rm -rf .next`
- Restart dev server: `npm run dev`

**Q: Telegram bot link not working**

- Double-check the bot username in `TelegramGuide.tsx`
- Ensure link format is `https://t.me/bot_username`

---

**Need help?** Check the main documentation in `GALLERY-DESIGN.md`
