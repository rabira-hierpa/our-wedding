# Theme System Documentation

## Overview

This project uses a semantic theme system built on top of Tailwind CSS custom colors. All components reference theme tokens instead of hardcoded colors, making it easy to rebrand or adjust the color scheme globally.

## Theme Architecture

### Base Color Palettes

Located in `tailwind.config.ts`, we define four base color palettes:

- **champagne**: Warm, elegant neutral tones (#faf9f7 to #5e5342)
- **gold**: Rich golden accents (#fefbf3 to #654e1a)
- **blush**: Romantic accent colors (#fef7f7 to #792828)
- **ivory**: Soft, light neutrals (#fffffe to #c8c8b9)

### Semantic Theme Tokens

Theme tokens provide meaningful names for colors based on their purpose:

#### Primary Brand Colors

- `theme-primary`: Main brand color (gold-500)
- `theme-primary-light`: Lighter variant (gold-400)
- `theme-primary-dark`: Darker variant (gold-600)

#### Secondary Brand Colors

- `theme-secondary`: Secondary brand color (champagne-500)
- `theme-secondary-light`: Lighter variant (champagne-400)
- `theme-secondary-dark`: Darker variant (champagne-600)

#### Accent Colors

- `theme-accent`: Accent color for highlights (blush-500)
- `theme-accent-light`: Lighter accent (blush-400)
- `theme-accent-dark`: Darker accent (blush-600)

#### Surface Colors

- `theme-surface`: Primary surface/background (white)
- `theme-surface-secondary`: Secondary surface (champagne-50)
- `theme-surface-tertiary`: Tertiary surface (champagne-100)

#### Text Colors

- `theme-text-primary`: Primary text (champagne-900)
- `theme-text-secondary`: Secondary text (champagne-700)
- `theme-text-muted`: Muted text (champagne-600)
- `theme-text-inverse`: Inverse text for dark backgrounds (white)

#### Border Colors

- `theme-border`: Standard border (champagne-200)
- `theme-border-light`: Light border (champagne-100)
- `theme-border-accent`: Accent border (gold-200)

#### Gradient Stops

- `theme-gradient-start`: Gradient starting color (champagne-50)
- `theme-gradient-mid`: Gradient middle color (white)
- `theme-gradient-end`: Gradient ending color (gold-50)

#### Dark Theme Colors

- `theme-dark-surface`: Dark background (champagne-900)
- `theme-dark-surface-secondary`: Secondary dark background (gold-900)
- `theme-dark-text`: Dark theme text (champagne-50)

## Usage Examples

### Backgrounds

```tsx
// Light surfaces
className = "bg-theme-surface";
className = "bg-theme-surface-secondary";

// Gradients
className =
  "bg-gradient-to-br from-theme-gradient-start via-theme-gradient-mid to-theme-gradient-end";

// Dark surfaces
className = "bg-theme-dark-surface";
```

### Text Colors

```tsx
// Primary text
className = "text-theme-text-primary";

// Secondary/muted text
className = "text-theme-text-secondary";
className = "text-theme-text-muted";

// Inverse text (on dark backgrounds)
className = "text-theme-text-inverse";
```

### Borders

```tsx
className = "border border-theme-border";
className = "border-theme-border-accent/20"; // with opacity
```

### Buttons & Interactive Elements

```tsx
// Primary button
className =
  "bg-gradient-to-r from-theme-primary to-theme-accent text-theme-text-inverse";

// Secondary button
className =
  "bg-theme-secondary text-theme-text-inverse hover:bg-theme-secondary-dark";

// Outlined button
className =
  "border-2 border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-theme-text-inverse";
```

### Icons

```tsx
<Icon className="text-theme-primary" />
<Icon className="text-theme-accent" />
```

## Component Theme Usage

### Header

- **Background**: `theme-surface` with backdrop blur when scrolled
- **Logo**: Gradient from `theme-primary` to `theme-accent` when scrolled
- **Text**: `theme-text-inverse` when not scrolled, `theme-text-primary` when scrolled
- **Icons**: `theme-primary` when scrolled

### Hero Section

- **Overlay**: Semi-transparent black for image readability
- **Text**: `theme-text-inverse` (white) with drop shadows
- **Accents**: `theme-primary-light` for decorative elements
- **Divider**: Gradient using `theme-primary-light`

### Telegram Guide

- **Background**: Gradient using `theme-gradient-*` tokens
- **Cards**: `theme-surface` to `theme-surface-secondary`
- **Step numbers**: Gradient from `theme-secondary` to `theme-primary`
- **Icons**: Uses dynamic gradients with theme colors
- **Text**: `theme-text-primary` and `theme-text-secondary`

### Venue Map

- **Background**: Gradient using `theme-gradient-*` tokens
- **Card surface**: `theme-surface`
- **Map container**: Gradient from `theme-surface-tertiary` to `theme-gradient-end`
- **Icon background**: Gradient from `theme-primary-light` to `theme-accent-light`
- **Button**: Gradient from `theme-primary` to `theme-accent`

### Footer Section

- **Background**: Gradient from `theme-surface-tertiary` to `theme-surface-secondary`
- **Text**: `theme-text-primary` and `theme-text-secondary`
- **Decorative elements**: `theme-primary`

### Powered By Footer

- **Background**: Dark theme using `theme-dark-surface` and `theme-dark-surface-secondary`
- **Text**: `theme-dark-text` (light text on dark background)
- **Accent border**: `theme-primary-light`
- **Heart icon**: `theme-accent-light`

## Customization

To change the entire theme, modify the CSS custom property values in `tailwind.config.ts`:

```typescript
colors: {
  theme: {
    primary: "var(--theme-primary, #d4af37)",  // Change default value
    "primary-light": "var(--theme-primary-light, #f0c75f)",
    // ... etc
  }
}
```

Or override at runtime using CSS custom properties in your root stylesheet:

```css
:root {
  --theme-primary: #your-color;
  --theme-primary-light: #your-light-color;
  --theme-primary-dark: #your-dark-color;
}
```

## Benefits

1. **Consistency**: All components use the same color tokens
2. **Maintainability**: Change theme globally by updating tokens
3. **Semantic Naming**: Colors are named by purpose, not appearance
4. **Flexibility**: Easy to create theme variants or dark mode
5. **Type Safety**: Tailwind IntelliSense works with theme tokens
6. **Scalability**: Add new theme tokens without breaking existing components

## Migration Guide

If you need to add a new theme color:

1. Add it to the `theme` object in `tailwind.config.ts`
2. Provide a CSS custom property name and default value
3. Update this documentation with usage examples
4. Replace hardcoded colors in components with the new token

## Best Practices

1. **Always use theme tokens** instead of base palette colors in components
2. **Use opacity modifiers** (`/20`, `/50`, etc.) for transparency
3. **Prefer gradients** using theme colors for visual interest
4. **Maintain contrast** between text and background using appropriate token pairs
5. **Test dark backgrounds** with inverse text tokens
6. **Use semantic names** when adding new tokens (not color-specific names)

## Theme Token Reference

| Category  | Token                  | Default Value | Usage                                |
| --------- | ---------------------- | ------------- | ------------------------------------ |
| Primary   | `theme-primary`        | gold-500      | Main brand buttons, links, accents   |
| Primary   | `theme-primary-light`  | gold-400      | Hover states, highlights             |
| Primary   | `theme-primary-dark`   | gold-600      | Active states, shadows               |
| Secondary | `theme-secondary`      | champagne-500 | Secondary buttons, backgrounds       |
| Accent    | `theme-accent`         | blush-500     | Call-to-action, important highlights |
| Surface   | `theme-surface`        | white         | Card backgrounds, containers         |
| Text      | `theme-text-primary`   | champagne-900 | Body text, headings                  |
| Text      | `theme-text-secondary` | champagne-700 | Secondary text, captions             |
| Border    | `theme-border`         | champagne-200 | Standard borders                     |
| Gradient  | `theme-gradient-start` | champagne-50  | Background gradients start           |

For complete list, see `tailwind.config.ts`.
