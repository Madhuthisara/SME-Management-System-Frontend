# Theme & Design System Guide

This guide explains how to use the centralized theme system in the admin-fe project.

## 📁 File Structure

```
src/
├── styles/
│   ├── variables.css          # CSS Variables (Design Tokens)
│   ├── utility-classes.css    # Custom utility classes
│   └── theme.ts               # TypeScript theme constants
├── config/
│   └── antdTheme.ts          # Ant Design theme configuration
└── index.css                  # Main CSS file (imports all styles)
```

## 🎨 How to Use the Theme

### 1. **Using CSS Variables (Recommended for Custom Styles)**

Use CSS variables directly in your component styles:

```css
.my-component {
  color: var(--color-primary);
  font-size: var(--font-size-lg);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-base);
  box-shadow: var(--shadow-base);
}
```

### 2. **Using Utility Classes**

Use predefined utility classes in your JSX:

```tsx
<div className="bg-primary-light p-md rounded-lg shadow-base">
  <h1 className="text-primary">Hello World</h1>
  <p className="text-secondary">This is a paragraph</p>
</div>
```

### 3. **Using Tailwind Classes**

The Tailwind configuration has been extended to match our theme:

```tsx
<button className="bg-primary hover:bg-primary-hover text-white px-lg py-sm rounded-md">
  Click Me
</button>
```

### 4. **Using TypeScript Theme Constants**

Import theme values in your TypeScript/React components:

```tsx
import theme from '@/styles/theme';

const MyComponent = () => {
  return (
    <div style={{
      color: theme.colors.primary.main,
      fontSize: theme.typography.fontSize.lg,
      padding: theme.spacing.md,
    }}>
      Styled Component
    </div>
  );
};
```

### 5. **Using Ant Design with Theme**

Wrap your app with ConfigProvider to apply the theme to Ant Design components:

```tsx
import { ConfigProvider } from 'antd';
import antdTheme from '@/config/antdTheme';

function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      {/* Your app components */}
    </ConfigProvider>
  );
}
```

## 🎯 Common Use Cases

### Changing Primary Color

**Update in one place:** `src/styles/variables.css`

```css
:root {
  --color-primary: #722ed1; /* New purple color */
  --color-primary-hover: #9254de;
  --color-primary-active: #531dab;
}
```

**Also update:**
- `src/styles/theme.ts` (colors.primary.main)
- `src/config/antdTheme.ts` (token.colorPrimary)
- `tailwind.config.js` (theme.extend.colors.primary.DEFAULT)

### Adding a New Color

1. Add to `variables.css`:
```css
:root {
  --color-custom: #ff6b6b;
}
```

2. Add to `theme.ts`:
```ts
export const colors = {
  ...
  custom: '#ff6b6b',
}
```

3. Add to `tailwind.config.js` (optional):
```js
theme: {
  extend: {
    colors: {
      custom: '#ff6b6b',
    }
  }
}
```

### Creating Consistent Buttons

```tsx
// Bad - Inconsistent styling
<button style={{ padding: '10px', fontSize: '15px' }}>Button</button>

// Good - Using theme values
<button className="px-md py-sm text-base bg-primary rounded-base">
  Button
</button>

// Better - Using Ant Design with theme
import { Button } from 'antd';
<Button type="primary">Button</Button>
```

## 🌙 Dark Mode Support

Dark mode variables are already defined in `variables.css`. To enable dark mode:

1. Add the `data-theme="dark"` attribute to your root element:

```tsx
<html data-theme="dark">
  {/* Your app */}
</html>
```

2. Or toggle it dynamically:

```tsx
const toggleDarkMode = () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
};
```

## 📏 Available Design Tokens

### Colors
- Primary: `--color-primary`, `--color-primary-hover`, `--color-primary-active`
- Semantic: `--color-success`, `--color-warning`, `--color-error`, `--color-info`
- Text: `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary`
- Background: `--color-bg-base`, `--color-bg-container`, `--color-bg-layout`
- Border: `--color-border-primary`, `--color-border-secondary`

### Typography
- Sizes: `--font-size-xs` to `--font-size-5xl`, `--font-size-h1` to `--font-size-h6`
- Weights: `--font-weight-light` to `--font-weight-bold`
- Line Heights: `--line-height-tight` to `--line-height-loose`

### Spacing
- `--spacing-xs` (4px) to `--spacing-3xl` (64px)

### Borders
- Radius: `--border-radius-sm` to `--border-radius-full`
- Width: `--border-width-thin`, `--border-width-base`, `--border-width-thick`

### Shadows
- `--shadow-sm`, `--shadow-base`, `--shadow-lg`

### Transitions
- Duration: `--transition-fast`, `--transition-base`, `--transition-slow`
- Timing: `--transition-ease`, `--transition-ease-in`, `--transition-ease-out`

## ✅ Best Practices

1. **Always use theme values** - Never hardcode colors, sizes, or spacing
2. **CSS Variables for flexibility** - They can be changed at runtime
3. **TypeScript constants for type safety** - Get autocomplete in your IDE
4. **Tailwind for quick prototyping** - Use for rapid development
5. **Utility classes for common patterns** - Reduce CSS duplication
6. **Ant Design components when possible** - They're already themed

## 🚫 Anti-Patterns

```tsx
// ❌ Bad - Hardcoded values
<div style={{ color: '#1890ff', fontSize: '16px' }}>Text</div>

// ✅ Good - Using theme
<div style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-base)' }}>Text</div>

// ✅ Better - Using utility classes
<div className="text-primary text-base">Text</div>

// ✅ Best - Using semantic HTML with Ant Design
import { Typography } from 'antd';
<Typography.Text type="primary">Text</Typography.Text>
```

## 🔄 Migration Guide

If you have existing components with hardcoded styles:

1. **Find hardcoded colors:**
```bash
# Search for hex colors in your code
grep -r "#[0-9a-fA-F]\{6\}" src/
```

2. **Replace with CSS variables:**
```css
/* Before */
color: #1890ff;

/* After */
color: var(--color-primary);
```

3. **Use utility classes where appropriate:**
```tsx
{/* Before */}
<div style={{ padding: '16px', backgroundColor: '#f5f5f5' }}>

{/* After */}
<div className="p-md bg-layout">
```

## 📚 Resources

- [CSS Variables Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Ant Design Theming](https://ant.design/docs/react/customize-theme)
- [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)

---

**Remember:** The goal is to have ONE source of truth for all design decisions. When you need to change a color or size, you should only need to update it in ONE place! 🎯
