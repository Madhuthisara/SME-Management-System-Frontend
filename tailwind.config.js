/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Custom Colors matching CSS variables
      colors: {
        primary: {
          DEFAULT: '#00b96b',
          hover: '#23cf85',
          active: '#009456',
          light: '#e6f8f0',
          dark: '#006d40',
        },
        secondary: {
          DEFAULT: '#52c41a',
          hover: '#73d13d',
          active: '#389e0d',
        },
        accent: {
          DEFAULT: '#faad14',
          hover: '#ffc53d',
          active: '#d48806',
        },
        // Common Colors from common.css
        common: {
          primary: 'var(--color-common-primary)',
          secondary: 'var(--color-common-secondary)',
          third: 'var(--color-common-third)',
          fourth: 'var(--color-common-fourth)',
          fifth: 'var(--color-common-fifth)',
        },
      },

      // Custom Spacing matching CSS variables
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
      },

      // Custom Font Sizes matching CSS variables
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'md': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
        '5xl': '48px',
        'h1': '38px',
        'h2': '30px',
        'h3': '24px',
        'h4': '20px',
        'h5': '16px',
        'h6': '14px',
      },

      // Custom Border Radius matching CSS variables
      borderRadius: {
        'sm': '2px',
        'base': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
      },

      // Custom Shadows matching CSS variables
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
        'base': '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
        'lg': '0 12px 48px 16px rgba(0, 0, 0, 0.03), 0 9px 28px 0 rgba(0, 0, 0, 0.05), 0 6px 16px -8px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
