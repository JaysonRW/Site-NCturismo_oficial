import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Headphones } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export const HumanSupport: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (!containerRef.current) return;
    
    // Set initial states for animation targets
    gsap.set('.hs-bg-image', { scale: 1.08, filter: 'blur(4px)', opacity: 0.55 });
    gsap.set('.hs-title-1', { y: '100%' });
    gsap.set('.hs-t2-part1', { y: '100%' });
    gsap.set('.hs-t2-part2', { y: '100%' });
    gsap.set('.hs-t2-part3', { opacity: 0 });
    gsap.set('.hs-strike', { width: 0 });
    gsap.set('.hs-desc', { opacity: 0, y: 20 });
    
    gsap.set('.hs-point', { opacity: 0 });
    gsap.set('.hs-alert', { opacity: 0, scale: 0.5 });
    gsap.set('.hs-lis', { opacity: 0 });
    gsap.set('.hs-mad', { opacity: 0 });
    gsap.set('.hs-new-route-label', { opacity: 0, x: -10 });
    gsap.set('.hs-actions', { opacity: 0, y: 20 });
    gsap.set('#airplane', { opacity: 0 });

    // Setup SVG path drawings (strokeDasharray logic)
    const path1 = document.getElementById('mask-path') as SVGPathElement;
    const length1 = path1?.getTotalLength() || 1000;
    if(path1) gsap.set(path1, { strokeDasharray: length1, strokeDashoffset: length1 });

    const path2 = document.getElementById('new-mask-path') as SVGPathElement;
    const length2 = path2?.getTotalLength() || 1000;
    if(path2) gsap.set(path2, { strokeDasharray: length2, strokeDashoffset: length2 });

    let mm = gsap.matchMedia();

    // DESKTOP - Scrubbed Storytelling Timeline
    mm.add('(min-width: 1024px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=4000', // Long scrub distance for perfect storytelling
          pin: true,
          scrub: 1,
          anticipatePin: 1
        }
      });

      // 1. Entrance & Background Focus
      tl.to('.hs-bg-image', { scale: 1, filter: 'blur(0px)', opacity: 0.8, duration: 2 })

      // 2. Eyebrow Title
      tl.to('.hs-title-1', { y: 0, duration: 1, ease: 'power2.out' }, "-=1")

      // 3. Main Headline
      tl.to(['.hs-t2-part1', '.hs-t2-part2'], { y: 0, duration: 1, ease: 'power2.out', stagger: 0.2 })
      
      // 4. The Transformation (PARAR -> CONTINUA)
      tl.to('.hs-strike', { width: '100%', duration: 0.5, ease: 'power2.inOut' }, "+=0.3")
      tl.to('.hs-t2-part2', { opacity: 0, duration: 0.3 }, "+=0.2")
      tl.to('.hs-t2-part3', { opacity: 1, duration: 0.3 }, "-=0.3")

      // 5. Supporting Text
      tl.to('.hs-desc', { opacity: 1, y: 0, duration: 1 }, "-=0.2")

      // 6. ROUTE ANIMATION BEGINS (The original plan)
      tl.to('.hs-point', { opacity: 1, duration: 0.5 }, "+=0.5")
      tl.to('#airplane', { opacity: 1, duration: 0.2 })
      
      // Draw first line & move airplane
      tl.to(path1, { strokeDashoffset: length1 * 0.52, duration: 2.5, ease: "none" }, "route1")
      tl.to('#airplane', {
        motionPath: {
          path: "#original-path-raw",
          align: "#original-path-raw",
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          start: 0,
          end: 0.44 
        },
        duration: 2.5,
        ease: "none"
      }, "route1")

      // 7. Interruption!
      tl.to('.hs-alert', { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' })
      tl.to(path1, { opacity: 0.3, duration: 0.5 }, "interrupt-fade")
      tl.to('#airplane', { opacity: 0, duration: 0.2 }, "interrupt-fade")

      // Pause briefly for tension
      tl.addLabel("recalculate", "+=0.5")

      // 8. The Solution (New Route)
      tl.to('.hs-lis', { opacity: 1, duration: 0.5 }, "recalculate")
      tl.to('.hs-new-route-label', { opacity: 1, x: 0, duration: 0.5 }, "-=0.3")

      tl.to('#airplane', { opacity: 1, duration: 0.2 })
      tl.to(path2, { strokeDashoffset: 0, duration: 2.5, ease: "none" }, "route2")
      tl.to('#airplane', {
        motionPath: {
          path: "#new-path-raw",
          align: "#new-path-raw",
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          start: 0,
          end: 1
        },
        duration: 2.5,
        ease: "none"
      }, "route2")

      tl.to('.hs-mad', { opacity: 1, duration: 0.5 }, "-=0.5")

      // 9. Call to Actions show up
      tl.to('.hs-actions', { opacity: 1, y: 0, duration: 1 }, "+=0.5")

      // MOUSE PARALLAX (Only active when pinned on Desktop)
      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        
        gsap.to('.hs-bg-image', { x: x * -4, y: y * -4, duration: 1, ease: 'power2.out' });
        gsap.to('.hs-map-layer', { x: x * 7, y: y * 7, duration: 1, ease: 'power2.out' });
        gsap.to('.hs-svg-container', { x: x * 10, y: y * 10, duration: 1, ease: 'power2.out' });
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    });

    // MOBILE - Automatic Triggered Timeline (No Scrubbing)
    mm.add('(max-width: 1023px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 50%',
        }
      });

      // Quick resolve
      tl.to('.hs-bg-image', { scale: 1, filter: 'blur(0px)', opacity: 0.8, duration: 1 })
      
      // Texts
      tl.to('.hs-title-1', { y: 0, duration: 0.8, ease: 'power2.out' }, "-=0.5")
      tl.to(['.hs-t2-part1', '.hs-t2-part2'], { y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.1 })
      
      tl.to('.hs-strike', { width: '100%', duration: 0.4, ease: 'power2.inOut' }, "+=0.2")
      tl.to('.hs-t2-part2', { opacity: 0, duration: 0.2 }, "+=0.1")
      tl.to('.hs-t2-part3', { opacity: 1, duration: 0.2 }, "-=0.2")
      tl.to('.hs-desc', { opacity: 1, y: 0, duration: 0.8 }, "-=0.2")

      // Fast Route
      tl.to('.hs-point', { opacity: 1, duration: 0.3 }, "+=0.3")
      tl.to('#airplane', { opacity: 1, duration: 0.1 })
      
      tl.to(path1, { strokeDashoffset: length1 * 0.52, duration: 1.5, ease: "none" }, "route1")
      tl.to('#airplane', {
        motionPath: {
          path: "#original-path-raw",
          align: "#original-path-raw",
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          start: 0,
          end: 0.44 
        },
        duration: 1.5,
        ease: "none"
      }, "route1")

      tl.to('.hs-alert', { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' })
      tl.to(path1, { opacity: 0.3, duration: 0.3 }, "interrupt-fade")
      tl.to('#airplane', { opacity: 0, duration: 0.2 }, "interrupt-fade")

      tl.addLabel("recalculate", "+=0.4")

      tl.to('.hs-lis', { opacity: 1, duration: 0.3 }, "recalculate")
      tl.to('.hs-new-route-label', { opacity: 1, x: 0, duration: 0.3 }, "-=0.2")

      tl.to('#airplane', { opacity: 1, duration: 0.1 })
      tl.to(path2, { strokeDashoffset: 0, duration: 1.5, ease: "none" }, "route2")
      tl.to('#airplane', {
        motionPath: {
          path: "#new-path-raw",
          align: "#new-path-raw",
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          start: 0,
          end: 1
        },
        duration: 1.5,
        ease: "none"
      }, "route2")

      tl.to('.hs-mad', { opacity: 1, duration: 0.3 }, "-=0.3")

      // Actions
      tl.to('.hs-actions', { opacity: 1, y: 0, duration: 0.8 }, "+=0.3")
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#050505]">
      
      {/* BACKGROUND - LAYER 1: PHOTOGRAPHY */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/fachada.png" 
          alt="Fachada NC Turismo" 
          className="hs-bg-image w-full h-full object-cover object-center transform origin-center"
        />
        {/* Gradients and Vignette for deep cinematic feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-[#050505]/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]/60"></div>
        <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(5,5,5,1)]"></div>
      </div>

      {/* MIDGROUND - LAYER 2: MAP & GRID */}
      <div className="hs-map-layer absolute inset-0 z-0 opacity-15 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#ffffff" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* LAYER 3: LIGHT GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-nc-orange/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* EDITORIAL UI (Top corners) */}
      <div className="absolute top-8 left-6 md:left-12 z-20">
        <p className="text-[9px] md:text-[10px] text-nc-warm/50 tracking-[0.3em] font-semibold uppercase">NC / Continuidade Operacional</p>
      </div>
      <div className="absolute top-8 right-6 md:right-12 z-20 text-right">
        <p className="text-[10px] md:text-xs text-nc-orange tracking-[0.2em] mb-1 font-bold">24 / 7</p>
        <p className="text-[8px] md:text-[9px] text-nc-warm/40 tracking-[0.1em] uppercase hidden md:block">
          Onde você estiver<br/>Sempre com você
        </p>
      </div>

      {/* FOREGROUND - CONTENT */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-24 pb-12 px-6">
        
        {/* Headlines */}
        <div className="text-center max-w-4xl mx-auto z-20 mt-4 lg:mt-0">
          <div className="overflow-hidden pb-1">
             <h2 className="hs-title-1 text-white text-3xl md:text-[44px] lg:text-[56px] font-bold leading-tight">
                Quando os planos mudam,
             </h2>
          </div>
          <div className="overflow-hidden pb-4 mb-4 md:mb-8 flex justify-center items-center flex-wrap gap-x-2 md:gap-x-3">
             <span className="hs-t2-part1 text-white text-3xl md:text-[44px] lg:text-[64px] font-bold leading-tight inline-block">a viagem</span>
             <div className="relative">
                <span className="hs-t2-part2 text-white text-3xl md:text-[44px] lg:text-[64px] font-bold leading-tight inline-block">
                   não precisa parar.
                   <div className="hs-strike absolute top-1/2 left-0 w-full h-[3px] md:h-[6px] bg-nc-orange -translate-y-1/2"></div>
                </span>
                <span className="hs-t2-part3 absolute left-0 top-0 text-nc-orange text-3xl md:text-[44px] lg:text-[64px] font-bold leading-tight inline-block whitespace-nowrap">
                   continua.
                </span>
             </div>
          </div>
          
          <p className="hs-desc text-nc-warm/80 text-sm md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Imprevistos fazem parte da jornada. Nossa equipe permanece ao lado do viajante para orientar, reorganizar e encontrar a melhor alternativa durante a viagem.
          </p>
        </div>

        {/* ROUTE SVG ANIMATION */}
        <div className="hs-svg-container relative w-full max-w-[900px] h-[180px] md:h-[280px] mt-8 md:mt-4 z-10">
          <svg viewBox="0 0 1000 300" className="w-full h-full overflow-visible pointer-events-none">
            
            {/* Raw hidden paths for MotionPathPlugin to read */}
            <path id="original-path-raw" d="M 150,220 Q 400,20 850,150" fill="none" stroke="none" />
            <path id="new-path-raw" d="M 430,94 Q 550,200 650,220 Q 750,230 850,150" fill="none" stroke="none" />

            {/* Base points */}
            <circle cx="150" cy="220" r="4" fill="#DB8902" className="hs-point" />
            <text x="150" y="245" fill="white" fontSize="13" textAnchor="middle" className="hs-point tracking-[0.1em] font-semibold">CWB</text>
            <text x="150" y="260" fill="#94A3B8" fontSize="10" textAnchor="middle" className="hs-point tracking-[0.1em]">BRASIL</text>

            {/* Original Planned Route (Masked) */}
            <mask id="route-mask">
              <path id="mask-path" d="M 150,220 Q 400,20 850,150" fill="none" stroke="white" strokeWidth="15" />
            </mask>
            <path d="M 150,220 Q 400,20 850,150" fill="none" stroke="#475569" strokeWidth="2.5" strokeDasharray="6,6" mask="url(#route-mask)" />
            
            {/* Destination (MAD) */}
            <circle cx="850" cy="150" r="4" fill="#DB8902" className="hs-mad" />
            <text x="850" y="175" fill="white" fontSize="13" textAnchor="middle" className="hs-mad tracking-[0.1em] font-semibold">MAD</text>
            <text x="850" y="190" fill="#94A3B8" fontSize="10" textAnchor="middle" className="hs-mad tracking-[0.1em]">ESPANHA</text>

            {/* Interruption Marker */}
            <g className="hs-alert" transform="translate(430, 94)">
              <circle cx="0" cy="0" r="14" fill="#050505" stroke="#ef4444" strokeWidth="2" />
              <text x="0" y="4" fill="#ef4444" fontSize="14" textAnchor="middle" fontWeight="bold">!</text>
              <text x="0" y="30" fill="#ef4444" fontSize="10" textAnchor="middle" className="tracking-[0.2em] font-semibold hidden md:block">ROTA</text>
              <text x="0" y="44" fill="#ef4444" fontSize="10" textAnchor="middle" className="tracking-[0.2em] font-semibold hidden md:block">INTERROMPIDA</text>
            </g>

            {/* New Route from CWB to LIS to MAD */}
            <mask id="new-route-mask">
              <path id="new-mask-path" d="M 430,94 Q 550,200 650,220 Q 750,230 850,150" fill="none" stroke="white" strokeWidth="15" />
            </mask>
            <path d="M 430,94 Q 550,200 650,220 Q 750,230 850,150" fill="none" stroke="#DB8902" strokeWidth="2.5" strokeDasharray="8,8" mask="url(#new-route-mask)" />

            {/* LIS Point */}
            <circle cx="650" cy="220" r="5" fill="#050505" stroke="#DB8902" strokeWidth="2" className="hs-lis" />
            <text x="650" y="245" fill="white" fontSize="13" textAnchor="middle" className="hs-lis tracking-[0.1em] font-semibold">LIS</text>
            <text x="650" y="260" fill="#94A3B8" fontSize="10" textAnchor="middle" className="hs-lis tracking-[0.1em]">PORTUGAL</text>
            
            <g className="hs-new-route-label hidden md:block" transform="translate(680, 240)">
              <rect x="0" y="0" width="150" height="28" rx="14" fill="#050505" stroke="#DB8902" strokeWidth="1" />
              <text x="75" y="18" fill="white" fontSize="10" textAnchor="middle" className="tracking-wide">Nova rota encontrada &rarr;</text>
            </g>

            {/* The Airplane */}
            <g id="airplane">
              {/* Box bounds to ensure center rotation logic works perfectly */}
              <svg x="-16" y="-16" width="32" height="32" viewBox="0 0 24 24" fill="#DB8902" transform="rotate(45)">
                 <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
            </g>
          </svg>
        </div>

        {/* BOTTOM UI ACTIONS */}
        <div className="hs-actions absolute bottom-6 md:bottom-12 left-0 w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 z-20">
           <div className="relative group cursor-pointer mt-4 md:mt-0">
             <button className="relative flex items-center justify-center gap-3 bg-nc-orange text-white px-6 md:px-8 py-3.5 md:py-4 rounded-full font-bold text-sm md:text-base hover:bg-[#b06f02] transition-colors z-10 w-[260px]">
               <Headphones size={20} />
               Acionar suporte 24h &rarr;
             </button>
             {/* Pulse ring on hover */}
             <div className="absolute inset-0 rounded-full bg-nc-orange opacity-0 group-hover:animate-ping z-0 pointer-events-none" style={{ animationDuration: '2s' }}></div>
             
             <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 w-max">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-[9px] md:text-[10px] text-nc-warm/60 uppercase tracking-widest font-medium">Atendimento disponível</span>
             </div>
           </div>

           <div className="w-px h-6 bg-white/10 hidden md:block"></div>

           <a href="#diagnostico" className="text-nc-warm/60 hover:text-white transition-colors flex items-center gap-2 border-b border-transparent hover:border-white pb-1 text-xs md:text-sm tracking-wide font-medium mt-4 md:mt-0">
             Falar sobre gestão corporativa &rarr;
           </a>
        </div>
      </div>
    </section>
  );
};
