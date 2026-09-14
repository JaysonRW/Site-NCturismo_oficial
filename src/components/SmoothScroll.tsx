import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const SmoothScroll = () => {
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Disable GSAP animations that depend on scroll or are too intense
      gsap.matchMedia().add('(prefers-reduced-motion: reduce)', () => {
        // We can optionally kill specific ScrollTriggers here if needed globally,
        // but typically individual components should handle their own matchMedia.
        // For now, we simply don't initialize smooth scrolling.
      });
      return;
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Sync GSAP ticker with Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Prevent GSAP from lagging behind
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return null;
};
