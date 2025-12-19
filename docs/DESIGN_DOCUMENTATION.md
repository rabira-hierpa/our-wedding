# Wedding Photo Gallery - Design Documentation

## Overview
A stunning, romantic wedding photo gallery featuring cinematic animations, elegant typography, and a premium user experience built with Next.js 15, React, Framer Motion, and Tailwind CSS.

---

## 🎨 Design System

### Color Palette
The gallery uses a romantic, sophisticated color scheme:

#### Primary Colors
- **Champagne** (`champagne-50` to `champagne-900`)
  - Soft, warm neutrals that evoke elegance and sophistication
  - Used for backgrounds, text, and accent elements

- **Gold** (`gold-50` to `gold-900`)
  - Luxurious metallic tones for highlights and CTAs
  - Creates premium feel with gradient applications

- **Blush** (`blush-50` to `blush-900`)
  - Romantic rose tones for emotional moments
  - Used sparingly for love-themed elements

- **Ivory** (`ivory-50` to `ivory-900`)
  - Clean, pure whites for contrast and breathing room
  - Background highlights and text overlays

### Typography
```css
- Headings: 'Playfair Display' (serif) - Elegant, classic
- Body: 'Inter' (sans-serif) - Clean, modern
- Script: 'Great Vibes' (cursive) - Romantic accents
```

### Animation Philosophy
- **Duration**: 300-800ms for most animations
- **Easing**: Custom cubic-bezier curves `[0.25, 0.1, 0.25, 1]`
- **Principle**: Subtle, natural motion that enhances without distracting
- **Scroll-triggered**: Elements animate into view as users scroll

---

## 📐 Component Architecture

### 1. HeroSection
**Purpose**: Cinematic entrance with countdown timer

**Features**:
- Full-screen landscape background with gradient overlay
- Animated sparkles floating upward
- Staggered text reveal animation
- Live countdown to wedding date
- Smooth scroll indicator

**Animation Details**:
```typescript
- Title: Fade-in with slide-up (800ms, staggered)
- Countdown: Individual boxes with glow effects
- Sparkles: 15+ elements with random timing (20-35s duration)
- Scroll indicator: Infinite bounce animation
```

### 2. TelegramGuide
**Purpose**: Step-by-step instructions for photo upload

**Features**:
- Interactive Telegram bot link card with hover effects
- 4-step process with icon animations
- Glass morphism cards with subtle gradients
- Hover states with lift and scale effects

**Animation Details**:
```typescript
- Cards: Slide-up on scroll (600ms, staggered by 150ms)
- Icons: Scale and rotate on hover
- CTA Button: Scale + shimmer effect on hover
```

### 3. HighlightMoments
**Purpose**: Categorize and highlight special wedding moments

**Features**:
- 4 category cards (Ceremony, Reception, Portraits, Moments)
- Icon-based visual hierarchy
- Gradient backgrounds with hover reveals
- Romantic quote with script typography

**Animation Details**:
```typescript
- Grid: Staggered reveal (800ms per item)
- Icons: Playful rotation on hover
- Background: Gradient opacity fade on hover
- Sparkles: Infinite rotation in corner
```

### 4. PhotoGallery
**Purpose**: Masonry layout of uploaded photos with lightbox

**Features**:
- Responsive masonry grid (1-4 columns)
- Hover overlay with photo details
- Full-screen lightbox modal
- Real-time photo updates (10s polling)
- Animated loading skeletons

**Animation Details**:
```typescript
- Images: Fade-in with scale (500ms, 50ms stagger)
- Hover: Lift (-8px) with scale (1.02)
- Overlay: Gradient fade with content slide-up
- Modal: Scale + fade with spring physics
```

### 5. FooterSection
**Purpose**: Elegant closing with gratitude message

**Features**:
- Animated sparkles background
- Romantic closing message
- Gradient dividers
- Floating icon animations

**Animation Details**:
```typescript
- Sparkles: Random scale/rotate/opacity (3-5s loops)
- Main icon: Gentle rotation wiggle (3s infinite)
- Text: Fade-in with slide-up
```

### 6. 404 Page
**Purpose**: Beautiful error page with clear navigation

**Features**:
- Large "404" with floating hearts
- Romantic messaging
- Primary + secondary CTAs
- Gradient background orbs

**Animation Details**:
```typescript
- Hearts: Float upward with fade (10-15s)
- Number: Slide-down entrance
- Buttons: Scale + shimmer on hover
- Background: Pulsing gradient orbs
```

---

## 🎬 Animation Techniques

### Scroll-Triggered Animations
Using `react-intersection-observer`:
```typescript
const [ref, inView] = useInView({
  triggerOnce: true,
  threshold: 0.1,
});

<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={inView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.8 }}
>
```

### Staggered Children
```typescript
const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};
```

### Hover Interactions
```typescript
<motion.div
  whileHover={{ y: -8, scale: 1.02 }}
  transition={{ duration: 0.3 }}
>
```

### Infinite Loops
```typescript
<motion.div
  animate={{ y: [0, -10, 0] }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  }}
>
```

---

## 🎯 User Experience Features

### 1. Telegram Bot Integration
- Direct link to bot (@rabnlee_wedding_bot)
- Clear 4-step upload process
- Visual guide with icons and descriptions
- External link indicators

### 2. Photo Management
- Real-time gallery updates (10s polling)
- Click to expand full-screen
- Photo details overlay on hover
- Guest attribution with timestamps

### 3. Responsive Design
- Mobile-first approach
- Adaptive masonry columns (1-4)
- Touch-friendly interactions
- Optimized font sizes

### 4. Loading States
- Elegant skeleton loaders
- Empty state with encouragement
- Error state with retry option
- Smooth transitions between states

### 5. Accessibility
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Reduced motion respect (can be added)

---

## 🚀 Performance Optimizations

### Image Handling
- Next.js Image component with `unoptimized` flag
- Lazy loading for gallery images
- Optimized image formats from Telegram

### Animation Performance
- CSS transforms (not layout properties)
- GPU acceleration with `will-change`
- Intersection Observer for scroll triggers
- Debounced scroll events

### Code Splitting
- Component-level code splitting
- Dynamic imports for heavy components
- Minimal initial bundle size

---

## 🎨 Custom Tailwind Utilities

### Animations
```css
.animate-fade-in      /* Fade in from 0 to 1 */
.animate-slide-up     /* Slide up with fade */
.animate-slide-down   /* Slide down with fade */
.animate-scale-in     /* Scale from 0.9 to 1 */
.animate-float        /* Infinite float effect */
```

### Effects
```css
.glass                /* Glass morphism effect */
.gradient-text        /* Gradient text with clip */
```

---

## 📱 Responsive Breakpoints

```css
sm:  640px  /* Small devices */
md:  768px  /* Tablets */
lg:  1024px /* Laptops */
xl:  1280px /* Desktops */
2xl: 1536px /* Large screens */
```

---

## 🔮 Future Enhancements

### Potential Additions
1. **Photo Filtering**
   - By guest
   - By date
   - By category

2. **Social Sharing**
   - Share individual photos
   - Generate shareable albums
   - Social media integration

3. **Advanced Animations**
   - Parallax scrolling
   - 3D card flips
   - Particle effects

4. **Interactive Features**
   - Like/favorite photos
   - Comments system
   - Download albums

5. **Admin Dashboard**
   - Moderate uploads
   - Feature photos
   - Analytics

---

## 🎭 Visual Hierarchy

### Primary Elements (Largest Impact)
1. Hero title ("A Day to Remember")
2. Photo gallery images
3. Section headings

### Secondary Elements
1. Descriptive text
2. Step-by-step guides
3. Photo captions

### Tertiary Elements
1. Timestamps
2. Icon accents
3. Decorative elements

---

## 💝 Emotional Design Principles

### Creating Connection
- **Warmth**: Champagne and gold evoke warmth and celebration
- **Romance**: Script fonts and heart icons add intimate feel
- **Joy**: Sparkles and floating elements suggest happiness
- **Elegance**: Serif typography and smooth animations feel refined

### Visual Storytelling
1. **Hero**: Sets the scene with anticipation (countdown)
2. **Guide**: Invites participation and contribution
3. **Highlights**: Frames the narrative of the day
4. **Gallery**: Showcases the collective memory
5. **Footer**: Closes with gratitude

---

## 🛠️ Development Notes

### Tech Stack
- **Framework**: Next.js 15.1.3
- **UI Library**: React 19
- **Animation**: Framer Motion 12
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Database**: PostgreSQL + Prisma
- **Image Optimization**: Next/Image + Sharp

### Key Dependencies
```json
{
  "framer-motion": "^12.23.26",
  "react-intersection-observer": "^10.0.0",
  "lucide-react": "^0.561.0"
}
```

### Environment Variables Required
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3002
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=rabnlee_wedding_bot
TELEGRAM_BOT_TOKEN=<your-bot-token>
TELEGRAM_WEBHOOK_SECRET=<your-secret>
```

---

## 📖 Component Usage Examples

### Using AnimatedSection
```typescript
import AnimatedSection from '@/components/AnimatedSection';

<AnimatedSection delay={0.2}>
  <h2>Your Content</h2>
</AnimatedSection>
```

### Custom Animations
```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
>
```

---

## 🎓 Learning Resources

### Framer Motion
- [Official Docs](https://www.framer.com/motion/)
- [Animation Examples](https://www.framer.com/motion/examples/)

### Design Inspiration
- Elegant wedding sites
- Luxury brand experiences
- Premium photography portfolios

---

**Created with love for an unforgettable celebration** ✨💍
