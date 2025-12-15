# 💒 Wedding Photo Gallery - Design Documentation

A stunning, romantic, and immersive wedding photo gallery built with React, Next.js, and Framer Motion.

## ✨ Features

### Visual & UX Design

- **Romantic Color Palette**: Soft rose, amber, and pink tones creating an elegant atmosphere
- **Premium Typography**: Playfair Display serif for headings, Inter sans-serif for body text
- **Cinematic Animations**: Smooth, natural transitions using Framer Motion
- **Responsive Design**: Mobile-first approach, beautiful on all devices

### Key Sections

#### 1. Hero Section (`HeroSection.tsx`)

- Full-width cinematic entrance
- Floating hearts background animation
- Elegant animated title with staggered reveals
- Smooth scroll indicator

**Animations:**

- Scale & fade-in for main content (1s duration)
- Staggered text reveals (200-1000ms delays)
- Infinite floating hearts (15-25s duration each)
- Bouncing scroll indicator

#### 2. Telegram Bot Guide (`TelegramGuide.tsx`)

- Step-by-step instructions with beautiful icons
- Hover effects on cards (lift & scale)
- Gradient icon backgrounds
- Direct link to Telegram bot

**Animations:**

- Staggered card reveals (150ms delay between cards)
- Lift on hover (-8px translate)
- Icon scale on hover (1.1x)
- Pulsing heart animation in CTA section

#### 3. Photo Gallery (`PhotoGallery.tsx`)

- Masonry grid layout (1-4 columns based on screen size)
- Staggered image loading animations
- Hover effects with gradient overlays
- Click-to-expand lightbox modal

**Animations:**

- Fade-in & scale for each photo (500ms + staggered delays)
- Hover lift & scale (300ms duration)
- Smooth modal open/close with backdrop blur
- Info reveals on hover with slide-up effect

#### 4. Footer Section (`FooterSection.tsx`)

- Romantic closing message
- Floating hearts decoration
- Pulsing heart icon
- Elegant fade-out design

**Animations:**

- Rotating heart icon (3s cycle)
- Floating background hearts with random delays
- Bouncing hearts in footer (2s cycle, staggered)

### Reusable Components

#### `AnimatedSection.tsx`

A reusable wrapper for scroll-triggered animations:

- Fade-in + slide-up effect (800ms duration)
- Triggers once when scrolled into view
- Custom delay support for staggered reveals
- Uses `react-intersection-observer` for performance

## 🎨 Animation Principles

### Motion Design

- **Duration**: 300-800ms for most transitions (feels natural, not rushed)
- **Easing**: Custom cubic-bezier curves `[0.25, 0.1, 0.25, 1]` for elegance
- **Delays**: Staggered reveals (50-150ms between items) for visual interest
- **Hover States**: Subtle lifts (-8px) and scales (1.02-1.1x)

### Performance Optimizations

- `triggerOnce: true` on scroll animations (no re-triggering)
- `threshold: 0.1` for early activation
- Framer Motion's automatic GPU acceleration
- Optimized image loading with Next.js Image component

## 🛠️ Technical Stack

- **Framework**: Next.js 15.1.3 with React 19
- **Animations**: Framer Motion + React Intersection Observer
- **Styling**: Tailwind CSS with custom gradients
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Playfair Display, Inter)
- **Backend**: Prisma with PostgreSQL
- **Image Storage**: Local file system (configurable)

## 📱 Responsive Breakpoints

- **Mobile**: 1 column masonry
- **Tablet (sm)**: 2 columns
- **Desktop (lg)**: 3 columns
- **Large Desktop (xl)**: 4 columns

## 🎯 User Flow

1. **Hero**: User is greeted with cinematic entrance animation
2. **Guide**: Clear step-by-step instructions to upload photos via Telegram
3. **Gallery**: Browse photos in beautiful masonry layout
4. **Lightbox**: Click any photo for full-screen view with details
5. **Footer**: Romantic closing message with animations

## 🎨 Color System

```css
Rose: 50, 100, 300, 400, 500, 600, 700, 900
Amber: 50, 100, 700, 800, 900
Pink: 50, 100, 400, 600
```

## 📦 Component Structure

```
app/
  page.tsx              → Main page orchestration
  globals.css           → Custom fonts, scrollbar, selection colors

components/
  HeroSection.tsx       → Cinematic entrance
  TelegramGuide.tsx     → Bot instructions
  PhotoGallery.tsx      → Main gallery with lightbox
  FooterSection.tsx     → Closing section
  AnimatedSection.tsx   → Reusable scroll animation wrapper
```

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see the gallery.

## 🔧 Customization

### Update Telegram Bot Link

Edit `components/TelegramGuide.tsx`:

```typescript
link: "https://t.me/your_wedding_bot";
```

### Adjust Animation Timing

All animations can be customized via Framer Motion's `transition` prop:

```typescript
transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
```

### Change Color Palette

Update Tailwind classes in components or add custom colors in `tailwind.config.ts`.

## 💡 Design Decisions

1. **Serif for Headings**: Creates emotional, romantic feel
2. **Staggered Animations**: Adds visual interest without overwhelming
3. **Soft Gradients**: More sophisticated than flat colors
4. **Hover Reveals**: Interactive feedback without clutter
5. **Minimal UI**: Lets the photos be the hero

## 🎭 Animation Showcase

- **Hero Title**: Fade + slide with 200ms delay
- **Guide Cards**: Staggered reveals with hover lift
- **Gallery Photos**: Masonry load with 50ms stagger
- **Lightbox**: Scale + fade modal with spring physics
- **Floating Hearts**: Random delays for organic feel
- **Scroll Indicator**: Infinite bounce animation

---

**Made with ❤️ for your special day**
