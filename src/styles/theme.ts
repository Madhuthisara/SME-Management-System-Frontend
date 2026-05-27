/**
 * TypeScript Theme Configuration
 * 
 * This file provides type-safe access to theme values for use in
 * TypeScript/React components. These values mirror the CSS variables
 * and can be used for dynamic styling or component props.
 */

export const colors = {
    // Primary Colors
    primary: {
        main: '#00b96b',
        hover: '#23cf85',
        active: '#009456',
        light: '#e6f8f0',
        dark: '#006d40',
    },

    // Secondary Colors
    secondary: {
        main: '#52c41a',
        hover: '#73d13d',
    },

    // Accent Colors
    accent: {
        main: '#faad14',
        hover: '#ffc53d',
        active: '#d48806',
    },

    // Semantic Colors
    success: {
        main: '#52c41a',
        bg: '#f6ffed',
        border: '#b7eb8f',
    },

    warning: {
        main: '#faad14',
        bg: '#fffbe6',
        border: '#ffe58f',
    },

    error: {
        main: '#ff4d4f',
        bg: '#fff2f0',
        border: '#ffccc7',
    },

    info: {
        main: '#1890ff',
        bg: '#e6f7ff',
        border: '#91d5ff',
    },

    // Text Colors
    text: {
        primary: 'rgba(0, 0, 0, 0.88)',
        secondary: 'rgba(0, 0, 0, 0.65)',
        tertiary: 'rgba(0, 0, 0, 0.45)',
        disabled: 'rgba(0, 0, 0, 0.25)',
    },

    // Background Colors
    background: {
        base: '#ffffff',
        container: '#ffffff',
        elevated: '#ffffff',
        layout: '#f5f5f5',
        spotlight: '#fafafa',
    },

    // Border Colors
    border: {
        primary: '#d9d9d9',
        secondary: '#f0f0f0',
    },
} as const;

export const typography = {
    // Font Families
    fontFamily: {
        base: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif`,
        code: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`,
    },

    // Font Sizes
    fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        md: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
        '5xl': '48px',

        // Headings
        h1: '38px',
        h2: '30px',
        h3: '24px',
        h4: '20px',
        h5: '16px',
        h6: '14px',
    },

    // Font Weights
    fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },

    // Line Heights
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
        loose: 2,
    },
} as const;

export const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
} as const;

export const layout = {
    header: {
        height: '64px',
    },
    sider: {
        width: '256px',
        collapsedWidth: '80px',
    },
    footer: {
        height: '70px',
    },
    container: {
        maxWidth: '1200px',
    },
    content: {
        maxWidth: '1000px',
    },
} as const;

export const borderRadius = {
    sm: '2px',
    base: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
} as const;

export const borderWidth = {
    thin: '1px',
    base: '1px',
    thick: '2px',
} as const;

export const shadows = {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
    base: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
    lg: '0 12px 48px 16px rgba(0, 0, 0, 0.03), 0 9px 28px 0 rgba(0, 0, 0, 0.05), 0 6px 16px -8px rgba(0, 0, 0, 0.08)',
} as const;

export const transitions = {
    duration: {
        fast: '0.1s',
        base: '0.2s',
        slow: '0.3s',
    },
    timing: {
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
} as const;

export const zIndex = {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
} as const;

// Combined theme object for easy import
export const theme = {
    colors,
    typography,
    spacing,
    layout,
    borderRadius,
    borderWidth,
    shadows,
    transitions,
    zIndex,
} as const;

// Export type for TypeScript usage
export type Theme = typeof theme;

export default theme;
