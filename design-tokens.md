# Design System Tokens

## Overview

Our design system uses CSS custom properties that are automatically converted to Tailwind CSS utilities. All tokens are defined in `src/app/globals.css` and configured in `tailwind.config.cjs`.

### Token Structure

Tokens follow a semantic naming convention:

- **Semantic tokens**: `primary`, `secondary`, `background`, `foreground`
- **Component tokens**: `card`, `popover`, `sidebar`
- **State tokens**: `destructive`, `muted`, `accent`

## Color Tokens

### Core Color System

#### Background & Foreground

```css
/* Light Mode */
--background: 210 25% 97%;
--foreground: 222.2 84% 4.9%;

/* Dark Mode */
--background: 222.2 84% 4.9%;
--foreground: 210 40% 98%;
```

**Usage:**

```tsx
// ✅ Correct - Use semantic tokens
<div className="bg-background text-foreground">
  Content with proper theming
</div>

// ❌ Incorrect - Hardcoded colors
<div className="bg-[#f3f6f8] text-gray-900">
  Content without theming support
</div>
```

#### Primary Colors

```css
--primary: 230 84% 50%;
--primary-foreground: 210 40% 98%;
```

**Usage:**

```tsx
// Buttons, CTAs, important actions
<button className="bg-primary text-primary-foreground">Primary Action</button>
```

#### Secondary Colors

```css
/* Light Mode */
--secondary: 210 40% 96.1%;
--secondary-foreground: 222.2 47.4% 11.2%;

/* Dark Mode */
--secondary: 217.2 32.6% 17.5%;
--secondary-foreground: 210 40% 98%;
```

**Usage:**

```tsx
// Secondary buttons, less prominent elements
<button className="bg-secondary text-secondary-foreground">
  Secondary Action
</button>
```

#### State Colors

##### Destructive

```css
/* Light Mode */
--destructive: 0 84.2% 60.2%;
--destructive-foreground: 210 40% 98%;

/* Dark Mode */
--destructive: 0 62.8% 30.6%;
```

**Usage:**

```tsx
// Error states, delete buttons, warnings
<button className="bg-destructive text-destructive-foreground">
  Delete Item
</button>

<div className="text-destructive">
  Error message text
</div>
```

##### Muted (Subtle/Disabled)

```css
/* Light Mode */
--muted: 210 40% 96.1%;
--muted-foreground: 215.4 16.3% 46.9%;

/* Dark Mode */
--muted: 217.2 32.6% 17.5%;
--muted-foreground: 215 20.2% 65.1%;
```

**Usage:**

```tsx
// Placeholder text, disabled states, subtle backgrounds
<p className="text-muted-foreground">
  Subtle helper text
</p>

<div className="bg-muted">
  Subtle background section
</div>
```

##### Accent (Highlights)

```css
/* Same values as secondary - used for highlights and hover states */
--accent: 210 40% 96.1%;
--accent-foreground: 222.2 47.4% 11.2%;

/* Dark Mode */
--accent: 217.2 32.6% 17.5%;
--accent-foreground: 210 40% 98%;
```

**Usage:**

```tsx
// Hover states, highlights, selected items
<div className="hover:bg-accent hover:text-accent-foreground">
  Interactive element
</div>
```

### Component-Specific Colors

#### Card System

```css
--card: 0 0% 100%;
--card-foreground: 222.2 84% 4.9%;

/* Dark Mode */
--card: 222.2 84% 4.9%;
--card-foreground: 210 40% 98%;
```

**Usage:**

```tsx
// Card components
<div className="bg-card text-card-foreground border rounded-lg p-6">
  <h3>Card Title</h3>
  <p>Card content with proper theming</p>
</div>
```

#### Border & Input

```css
/* Light Mode */
--border: 214.3 31.8% 91.4%;
--input: 214.3 31.8% 91.4%;

/* Dark Mode */
--border: 217.2 32.6% 17.5%;
--input: 217.2 32.6% 17.5%;
```

**Usage:**

```tsx
// Borders and form inputs
<input className="border-input bg-background text-foreground" />
<div className="border border-border">Bordered content</div>
```

#### Focus Ring

```css
--ring: 230 84% 50%;
```

**Usage:**

```tsx
// Focus states (automatically applied by Tailwind)
<button className="focus-visible:ring-2 focus-visible:ring-ring">
  Focusable element
</button>
```

### Chart Colors

```css
--chart-1: oklch(0.646 0.222 41.116);
--chart-2: oklch(0.6 0.118 184.704);
--chart-3: oklch(0.398 0.07 227.392);
--chart-4: oklch(0.828 0.189 84.429);
--chart-5: oklch(0.769 0.188 70.08);
```

**Usage:**

```tsx
// Data visualization components
<div className="bg-chart-1">Chart segment 1</div>
<div className="bg-chart-2">Chart segment 2</div>
```

### Sidebar Colors

```css
/* Light Mode */
--sidebar: oklch(0.985 0 0); /* Light sidebar background */
--sidebar-foreground: oklch(0.145 0 0); /* Dark sidebar text */
--sidebar-primary: oklch(0.205 0 0); /* Sidebar primary elements */
--sidebar-accent: oklch(0.97 0 0); /* Sidebar accent/hover */
--sidebar-border: oklch(0.922 0 0); /* Sidebar borders */

/* Dark Mode */
--sidebar: oklch(0.205 0 0); /* Dark sidebar background */
--sidebar-foreground: oklch(0.985 0 0); /* Light sidebar text */
--sidebar-primary: oklch(0.488 0.243 264.376); /* Sidebar primary */
--sidebar-accent: oklch(0.269 0 0); /* Sidebar accent/hover */
--sidebar-border: oklch(1 0 0 / 10%); /* Sidebar borders */
```

## Spacing & Layout

### Border Radius

```css
--radius: 0.625rem; /* Base radius (10px) */
```

**Computed Values:**

```css
--radius-sm: calc(var(--radius) - 4px); /* 6px */
--radius-md: calc(var(--radius) - 2px); /* 8px */
--radius-lg: var(--radius); /* 10px */
--radius-xl: calc(var(--radius) + 4px); /* 14px */
```

**Usage:**

```tsx
// Different radius sizes
<div className="rounded-sm">Small radius</div>
<div className="rounded-md">Medium radius</div>
<div className="rounded-lg">Large radius (default)</div>
<div className="rounded-xl">Extra large radius</div>
```

## Typography

Typography tokens are handled through Tailwind's default system with custom font families:

```css
--font-sans: var(--font-geist-sans);
--font-mono: var(--font-geist-mono);
```

**Usage:**

```tsx
// Font families
<p className="font-sans">Default sans-serif text</p>
<code className="font-mono">Monospace code text</code>
```

## Animation Tokens

### Custom Animations

```css
/* Skeleton loading */
@keyframes skeleton {
  0% {
    backgroundcolor: hsl(210, 40%, 94%);
  }
  100% {
    backgroundcolor: hsl(210, 40%, 98%);
  }
}

/* Pulse skeleton */
@keyframes pulse-skeleton {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Float animation */
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

/* Shimmer effect */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}
```

**Usage:**

```tsx
// Animation classes
<div className="animate-skeleton">Loading skeleton</div>
<div className="animate-pulse-skeleton">Pulsing skeleton</div>
<div className="animate-float">Floating element</div>
<div className="animate-shimmer">Shimmer effect</div>
```

## Light/Dark Mode Usage

### Theme Toggle Setup

The application uses class-based dark mode switching:

```tsx
// Theme toggle implementation
const toggleTheme = () => {
  document.documentElement.classList.toggle('dark');
};
```

### Token Behavior

All tokens automatically adapt to light/dark mode:

```tsx
// ✅ This automatically works in both themes
<div className="bg-background text-foreground border border-border">
  Content that adapts to theme
</div>

// ✅ Explicit dark mode variants (when needed)
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Explicit theme handling
</div>
```

### Using Dark Mode Classes

For explicit theme handling when needed:

```tsx
// ✅ Explicit dark mode variants
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Explicit theme handling
</div>
```

---
