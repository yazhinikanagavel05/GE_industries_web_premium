# Premium visual upgrade — what changed

No copy, product data, routes or logic were changed. Everything below is visual / motion only.

## New files (src/components/motion/)
- AutoReveal.tsx – scroll-reveal for headings, grid cards, forms, FAQ items & footer on every storefront page
- PageTransition.tsx – soft fade between routes
- Preloader.tsx – 1.3s branded intro, once per session, click to skip
- BackToTop.tsx – floating button with scroll-progress ring
- SpotlightProvider.tsx – cursor-following glow on `.spotlight` cards
- TiltCard.tsx – 3D cursor tilt (hero product card)
- ParallaxLayer.tsx – scroll-parallax decorative layers
- HeroParticles.tsx – canvas "steel dust" network behind the hero
- GraphicAccents.tsx – rotating weight-plate SVG + self-drawing barbell divider
- cartBurst.ts – spark burst on Add to Cart (uses existing canvas-confetti)
- prefersReducedMotion.ts – helpers

## Edited files
- src/App.tsx – mounts the motion layer
- src/index.css – reveal, button light-sweep, spotlight, film grain, focus ring, marquee pause
- tailwind.config.js – new keyframes/animations (kenburns, gradient-x, orb, spin-slow)
- src/pages/HomePage.tsx – hero ken-burns/particles/plates/tilt, shimmering headlines, hover polish
- src/components/product/ProductCard.tsx – spotlight, image hover, animated add-to-cart icon + burst
- src/pages/ProductDetailPage.tsx – burst on Add to Cart
- src/components/common/Navbar.tsx – sliding active-link pill

## Accessibility / performance
- All motion is disabled for visitors with "reduce motion" enabled.
- Cursor effects (tilt, spotlight) only run on mouse/trackpad devices.
- Particles pause when off-screen or the tab is hidden.

## To run
npm install && npm run dev      (then `npm run build` for production — the old /dist is stale)
