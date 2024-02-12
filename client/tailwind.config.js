/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '500px',
      },
      fontFamily: {
        poppins: ['Poppins'],
      },
      container: {
        center: true,
        padding: '2rem',
        screens: {
          '2xl': '1400px',
        },
      },
      colors: {
        'dark-layer-1': 'rgb(40,40,40)',
        'dark-layer-2': 'rgb(26,26,26)',
        'dark-layer-3': 'rgb(48,48,48)',
        'dark-hover': 'rgb(55, 55, 55)',
        'dark-button': '#ffffff1a',
        'dark-label-1': 'rgba(200, 200, 230, 0.75)',
        'dark-ring-1': 'rgba(200, 200, 230, 0.5)',
        'dark-label-2': '#eff1f6bf',
        'dark-border': '#f7faff1f',
        'dark-divider-border-2': 'rgb(61, 61, 61)',
        'dark-fill-2': 'hsla(0,0%,100%,.14)',
        'dark-fill-3': 'hsla(0,0%,100%,.1)',
        'dark-fill-1': '#0f0f0f',
        'dark-gray-6': 'rgb(138, 138, 138)',
        'dark-gray-7': 'rgb(179, 179, 179)',
        'gray-8': 'rgb(38, 38, 38)',
        'dark-gray-8': 'rgb(219, 219, 219)',
        'brand-orange': 'rgb(255 161 22)',
        'brand-orange-s': 'rgb(193, 122, 15)',
        'dark-yellow': 'rgb(255 192 30)',
        'dark-pink': 'rgb(255 55 95)',
        olive: 'rgb(0, 184, 163)',
        'dark-green-s': 'rgb(44 187 93)',
        'dark-green-hover': 'rgb(50 200 100)',
        'dark-blue-s': 'rgb(10 132 255)',
        'dark-blue-l': 'rgba(10, 132, 255, 0.2)',
        'dark-blue-h': 'rgba(10, 132, 255, 0.9);',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
