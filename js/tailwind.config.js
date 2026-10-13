/* ==========================================================================
   TAILWIND CONFIG  (Play CDN)
   --------------------------------------------------------------------------
   This file MUST be loaded straight AFTER the Tailwind CDN <script> tag.
   Colours come from CSS variables in /css/styles.css (shadcn/ui convention),
   so to re-brand the whole site you only edit the variables in :root there.

   SPACING: Tailwind's scale is 4px per step. We use an 8px grid, so only use
   EVEN steps in markup:  2 = 8px · 4 = 16px · 6 = 24px · 8 = 32px · 10 = 40px
   12 = 48px · 16 = 64px · 20 = 80px · 24 = 96px
   ========================================================================== */
tailwind.config = {
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', md: '2rem', lg: '3rem' },
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1200px', '2xl': '1240px' },
    },
    extend: {
      screens: { xs: '400px' },
      colors: {
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        navy: 'hsl(var(--navy) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        destructive: 'hsl(var(--destructive) / <alpha-value>)',
        sun: 'hsl(var(--sun-tint) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Figtree', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'Figtree', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 8px)',
      },
      boxShadow: {
        sticker: '0 4px 0 0 hsl(var(--navy))',
        soft: '0 1px 2px hsl(var(--navy) / .04), 0 8px 24px -8px hsl(var(--navy) / .12)',
        lift: '0 2px 4px hsl(var(--navy) / .04), 0 24px 48px -16px hsl(var(--navy) / .22)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'none' } },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'pop-in': { '0%': { opacity: '0', transform: 'scale(.88)' }, '100%': { opacity: '1', transform: 'none' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-16px)' } },
        bob: { '0%,100%': { transform: 'translateY(0) rotate(-1deg)' }, '50%': { transform: 'translateY(-8px) rotate(1deg)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        'fade-up': 'fade-up .8s cubic-bezier(.2,.7,.2,1) both',
        'fade-in': 'fade-in .8s ease both',
        'pop-in': 'pop-in .6s cubic-bezier(.2,1.2,.3,1) both',
        float: 'float 6s ease-in-out infinite',
        bob: 'bob 5s ease-in-out infinite',
        marquee: 'marquee 36s linear infinite',
        'spin-slow': 'spin-slow 40s linear infinite',
      },
    },
  },
};
