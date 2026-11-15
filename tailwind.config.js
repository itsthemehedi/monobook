/** MonoBook design tokens. Black and white; red (brand) is a small signal only, under 3% of any screen. */
export default {
  content: { relative: true, files: ['./index.html', './src/**/*.{js,jsx}'] },
  theme: {
    screens: { md: '768px', lg: '1000px', xl: '1200px' },
    extend: {
      colors: {
        ink: '#0b0b0b',
        paper: '#ffffff',
        off: '#f3f3f3',
        muted: '#6b6b6b',
        brand: '#ed3614',
        line: '#0b0b0b1f',
        'line-dark': '#ffffff2e',
        'paper-muted': '#ffffffb3',
      },
      fontFamily: {
        display: ['Inter', '"Inter Fallback"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        sans: ['Manrope', '"Manrope Fallback"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      fontSize: {
        small: 'clamp(.9375rem,.91rem + .1vw,1rem)',
        body: 'clamp(1.0625rem,1rem + .25vw,1.1875rem)',
        lead: 'clamp(1.3125rem,1.1rem + .9vw,2rem)',
        h3: 'clamp(1.5rem,1.25rem + 1.1vw,2.25rem)',
        h2: 'clamp(2.25rem,1.45rem + 3.6vw,5.25rem)',
        display: 'clamp(3rem,1.1rem + 8vw,10.5rem)',
        email: 'clamp(1.5rem,.4rem + 5.6vw,6rem)',
      },
      maxWidth: { site: '96rem' },
      spacing: { section: 'clamp(4.5rem,3rem + 6vw,9rem)', header: '4rem', tap: '44px', control: '3.5rem' },
      transitionTimingFunction: { soft: 'cubic-bezier(.2,.7,.2,1)' },
    },
  },
  plugins: [],
};
