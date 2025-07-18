/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional base colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Professional card colors
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // Professional popover colors
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        
        // Professional primary colors - deep navy
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        
        // Professional secondary colors - neutral gray
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        
        // Professional destructive colors - muted red
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        
        // Professional muted colors
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        
        // Professional accent colors
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        
        // Professional UI elements
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        
        // Professional trading colors
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        
        // Professional chart colors
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        
        // Professional profit/loss colors
        profit: "hsl(var(--success))",
        loss: "hsl(var(--destructive))",
        
        // Custom Meow theme colors
        "meow-midnight": "hsl(var(--meow-midnight))",
        "meow-cream": "hsl(var(--meow-cream))",
        "meow-paw": "#f97316", // Orange-500
        "meow-tabby": "#ea580c", // Orange-600
      },
      
      // Professional typography
      fontSize: {
        'display': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
        'headline': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.025em' }],
        'title': ['1.5rem', { lineHeight: '1.3' }],
        'subtitle': ['1.125rem', { lineHeight: '1.4' }],
        'body': ['1rem', { lineHeight: '1.5' }],
        'caption': ['0.875rem', { lineHeight: '1.4' }],
        'overline': ['0.75rem', { lineHeight: '1.3', letterSpacing: '0.05em' }],
      },
      
      // Professional spacing system
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '80px',
      },
      
      // Professional border radius
      borderRadius: {
        'lg': "var(--radius)",
        'md': "calc(var(--radius) - 2px)",
        'sm': "calc(var(--radius) - 4px)",
      },
      
      // Professional shadows
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'card-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'professional': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'professional-hover': '0 4px 12px 0 rgb(0 0 0 / 0.1)',
        '3d': '0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        '3d-hover': '0 8px 16px 0 rgba(0, 0, 0, 0.15), 0 4px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        '3d-soft': '0 2px 4px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.06), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        '3d-hover-soft': '0 6px 12px 0 rgba(0, 0, 0, 0.1), 0 3px 6px 0 rgba(0, 0, 0, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        '3d-blue': '0 4px 8px 0 rgba(59, 130, 246, 0.25), 0 2px 4px 0 rgba(59, 130, 246, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        '3d-hover-blue': '0 8px 16px 0 rgba(59, 130, 246, 0.3), 0 4px 8px 0 rgba(59, 130, 246, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      },
      
      // Professional animations
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-alternate': 'float-alternate 8s ease-in-out infinite',
        'rotate-slow': 'rotate-slow 20s linear infinite',
        'slide-horizontal': 'slide-horizontal 12s ease-in-out infinite',
        'morph': 'morph 15s ease-in-out infinite',
        'drift': 'drift 10s ease-in-out infinite',
      },
      
      // Professional keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-alternate': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-15px) translateX(10px)' },
          '75%': { transform: 'translateY(-5px) translateX(-10px)' },
        },
        'rotate-slow': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        'slide-horizontal': {
          '0%, 100%': { transform: 'translateX(-100px)', opacity: '0.3' },
          '50%': { transform: 'translateX(100px)', opacity: '0.8' },
        },
        'morph': {
          '0%, 100%': { 
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            transform: 'scale(1) rotate(0deg)'
          },
          '25%': { 
            borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
            transform: 'scale(1.1) rotate(90deg)'
          },
          '50%': { 
            borderRadius: '50% 60% 30% 70% / 60% 30% 60% 40%',
            transform: 'scale(0.9) rotate(180deg)'
          },
          '75%': { 
            borderRadius: '60% 40% 60% 30% / 30% 70% 40% 60%',
            transform: 'scale(1.05) rotate(270deg)'
          },
        },
        'drift': {
          '0%, 100%': { transform: 'translateX(0px) translateY(0px)' },
          '25%': { transform: 'translateX(20px) translateY(-10px)' },
          '50%': { transform: 'translateX(10px) translateY(20px)' },
          '75%': { transform: 'translateX(-10px) translateY(10px)' },
        },
      },
      
      // Professional font families
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        'mono': ['ui-monospace', 'SFMono-Regular', '"SF Mono"', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      
      // Professional aspect ratios
      aspectRatio: {
        'trading-card': '4 / 3',
        'chart': '16 / 9',
        'dashboard': '3 / 2',
      },
    },
  },
  plugins: [],
}; 