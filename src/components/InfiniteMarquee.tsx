import React from 'react';
import { Sparkles } from 'lucide-react';

interface InfiniteMarqueeProps {
  variant?: 'dual' | 'single';
  className?: string;
}

export const InfiniteMarquee: React.FC<InfiniteMarqueeProps> = ({
  variant = 'dual',
  className = ''
}) => {
  // Primary message specified by user: WE ARE TRAVEL ✦ CORPORATIVO ✦ BENEFÍCIOS ✦ MICE ✦ LAZER ✦ TECNOLOGIA ✦ GESTÃO ✦ EXPERIÊNCIA ✦
  const primaryItems = [
    { text: 'WE ARE TRAVEL', highlight: true, brand: true },
    { text: 'CORPORATIVO', highlight: true, badge: 'B2B' },
    { text: 'BENEFÍCIOS', highlight: false },
    { text: 'MICE', highlight: false },
    { text: 'LAZER', highlight: false },
    { text: 'TECNOLOGIA', highlight: true, badge: 'T&E' },
    { text: 'GESTÃO', highlight: false },
    { text: 'EXPERIÊNCIA', highlight: false },
    { text: 'ATENDIMENTO 24H', highlight: true, badge: 'SLA < 15s' }
  ];

  // Secondary reverse message for brand positioning
  const secondaryItems = [
    'WE ARE TRAVEL',
    'CORPORATIVO',
    'BENEFÍCIOS',
    'MICE',
    'LAZER',
    'TECNOLOGIA & T&E',
    'GESTÃO',
    'EXPERIÊNCIA',
    '38 ANOS EM CURITIBA',
    'PLANTÃO DEDICADO'
  ];

  return (
    <section 
      aria-label="Posicionamento NC Turismo" 
      className={`relative w-full py-4 md:py-6 overflow-hidden bg-gradient-to-b from-nc-space via-[#13151b] to-nc-space border-y border-white/10 ${className}`}
    >
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-20 bg-nc-orange/10 blur-[100px] pointer-events-none" />

      {/* Left & Right Edge Vignettes (Seamless Fade Out) */}
      <div className="absolute inset-y-0 left-0 w-20 md:w-40 z-20 pointer-events-none bg-gradient-to-r from-nc-space via-nc-space/80 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-20 md:w-40 z-20 pointer-events-none bg-gradient-to-l from-nc-space via-nc-space/80 to-transparent" />

      {/* Outer wrapper with pause-on-hover */}
      <div className="pause-on-hover flex flex-col gap-3 md:gap-4 select-none">
        
        {/* =========================================================================
            ROW 1: Primary Brand Proposition (Left Scroll)
           ========================================================================= */}
        <div className="flex overflow-hidden py-1">
          <div className="animate-marquee flex items-center">
            {/* First sequence */}
            {primaryItems.map((item, index) => (
              <div 
                key={`p1-${index}`} 
                className="flex items-center gap-6 sm:gap-8 mx-3 sm:mx-4 shrink-0"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs sm:text-sm md:text-base font-display font-extrabold uppercase tracking-[0.16em] transition-colors ${
                    item.brand 
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-nc-orange via-amber-300 to-white drop-shadow-[0_0_12px_rgba(219,137,2,0.4)]' 
                      : item.highlight 
                        ? 'text-white' 
                        : 'text-nc-warm/85 hover:text-white'
                  }`}>
                    {item.text}
                  </span>

                  {item.badge && (
                    <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-nc-orange/20 border border-nc-orange/40 text-[10px] font-mono font-bold text-nc-orange uppercase">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Sparkling Star Divider */}
                <span className="text-nc-orange text-sm sm:text-base opacity-80 drop-shadow-[0_0_8px_rgba(219,137,2,0.6)]">
                  ✦
                </span>
              </div>
            ))}

            {/* Second sequence for seamless loop */}
            {primaryItems.map((item, index) => (
              <div 
                key={`p2-${index}`} 
                className="flex items-center gap-6 sm:gap-8 mx-3 sm:mx-4 shrink-0"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs sm:text-sm md:text-base font-display font-extrabold uppercase tracking-[0.16em] transition-colors ${
                    item.brand 
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-nc-orange via-amber-300 to-white drop-shadow-[0_0_12px_rgba(219,137,2,0.4)]' 
                      : item.highlight 
                        ? 'text-white' 
                        : 'text-nc-warm/85 hover:text-white'
                  }`}>
                    {item.text}
                  </span>

                  {item.badge && (
                    <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-nc-orange/20 border border-nc-orange/40 text-[10px] font-mono font-bold text-nc-orange uppercase">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Sparkling Star Divider */}
                <span className="text-nc-orange text-sm sm:text-base opacity-80 drop-shadow-[0_0_8px_rgba(219,137,2,0.6)]">
                  ✦
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            ROW 2: Secondary Reverse Track (Right Scroll - Optional Dual Variant)
           ========================================================================= */}
        {variant === 'dual' && (
          <div className="flex overflow-hidden border-t border-white/5 pt-2">
            <div className="animate-marquee-reverse flex items-center opacity-80 hover:opacity-100 transition-opacity">
              {/* Sequence 1 */}
              {secondaryItems.map((item, index) => (
                <div 
                  key={`s1-${index}`} 
                  className="flex items-center gap-4 sm:gap-6 mx-2 sm:mx-3 shrink-0"
                >
                  <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-nc-warm/60 hover:text-nc-orange transition-colors">
                    {item}
                  </span>
                  <span className="text-nc-warm/30 text-xs font-mono">
                    —
                  </span>
                </div>
              ))}

              {/* Sequence 2 for seamless loop */}
              {secondaryItems.map((item, index) => (
                <div 
                  key={`s2-${index}`} 
                  className="flex items-center gap-4 sm:gap-6 mx-2 sm:mx-3 shrink-0"
                >
                  <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-nc-warm/60 hover:text-nc-orange transition-colors">
                    {item}
                  </span>
                  <span className="text-nc-warm/30 text-xs font-mono">
                    —
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
