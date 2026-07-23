# Ascent Digital — Marketing Website

A premium single-page marketing website for Ascent Digital, a fictional digital marketing agency. Built to demonstrate a complete, animated agency website with a disciplined design system.

## Tech Stack
- HTML5, CSS3, Vanilla JavaScript
- GSAP 3 + ScrollTrigger (via CDN) for animations
- Google Fonts: Space Grotesk, Inter, JetBrains Mono

## Folder Structure
```
index.html            # Main HTML page (Vite entry point)
public/css/style.css  # All styles
public/js/script.js   # All JavaScript animations & interactions
README.md             # This file
```

## Running Locally

### Option 1: No Build Tool
Simply open `index.html` in any modern browser. 

### Option 2: Local Server (Vite)
If you're running this in a modern dev environment (like Replit), use the Vite config provided:
```bash
npm run dev
# or
npm run serve
```
*Note: Vite serves the `public/` directory at the root, which is why CSS and JS are referenced as `/css/style.css` in the HTML.*

## Deployment
This static site is completely build-free on the front end. It can be deployed as-is on GitHub Pages, Replit, Vercel, or Netlify without any build configuration.
