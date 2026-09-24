import React, { useEffect, useState, useRef } from 'react';

export const ScrollProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const updateProgress = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const scrollHeight = document.documentElement.scrollHeight || 0;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight || 0;
      const maxScroll = scrollHeight - clientHeight;

      if (maxScroll <= 30) {
        setIsScrollable(false);
        setIsVisible(false);
        setProgress(0);
        return;
      }

      setIsScrollable(true);
      const currentProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      setProgress(currentProgress);

      // Show bar once user has scrolled past a minor threshold or keep ready
      setIsVisible(scrollY > 15 || currentProgress > 0.02);
    };

    const handleScroll = () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
      rafId.current = requestAnimationFrame(updateProgress);
    };

    // Initial check
    updateProgress();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Detect dynamic content changes (e.g. accordions, images loading, route changes)
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && document.body) {
      resizeObserver = new ResizeObserver(() => {
        handleScroll();
      });
      resizeObserver.observe(document.body);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  if (!isScrollable) {
    return null;
  }

  const percent = Math.round(progress * 100);

  return (
    <div
      role="progressbar"
      aria-label="Progresso de rolagem da página"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 left-0 right-0 z-[80] pointer-events-auto cursor-default transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ height: '3px' }}
    >
      {/* Background track */}
      <div className="absolute inset-0 bg-white/[0.06] backdrop-blur-xs" />

      {/* Primary progress bar fill with GPU hardware transform */}
      <div
        className="h-full w-full bg-gradient-to-r from-[#995500] via-nc-orange to-[#FFC857] origin-left will-change-transform relative shadow-[0_0_10px_rgba(219,137,2,0.5)]"
        style={{
          transform: `scaleX(${progress})`,
          transition: 'transform 80ms cubic-bezier(0.1, 0.9, 0.2, 1)',
        }}
      >
        {/* Glow bead at leading edge */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full blur-[2px] opacity-80 pointer-events-none" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#FFE29A] rounded-full shadow-[0_0_8px_#FFC857,0_0_14px_#DB8902] pointer-events-none" />
      </div>

      {/* Discrete floating percentage tag on hover or when moving */}
      {isHovered && percent > 0 && (
        <div
          className="absolute top-2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-nc-surface/95 text-nc-orange border border-nc-orange/30 shadow-lg pointer-events-none transition-all duration-150 backdrop-blur-md"
          style={{
            left: `${Math.max(Math.min(progress * 100, 96), 4)}%`,
          }}
        >
          {percent}%
        </div>
      )}
    </div>
  );
};
