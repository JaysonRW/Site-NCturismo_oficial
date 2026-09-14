import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plane, Bed, Car, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    let mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Background Image scale down
      tl.fromTo(imageRef.current, 
        { scale: 1.05, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 1.5 }, 
        0
      );

      // Paragraph fade in
      tl.fromTo('.hero-text-small', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1 }, 
        0.3
      );

      // Character fade in
      tl.fromTo('.hero-character',
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5 },
        0.2
      );

      // Giant Typography Slide in
      tl.fromTo('.hero-title-1',
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2 },
        0.5
      );
      tl.fromTo('.hero-title-2',
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2 },
        0.7
      );

      // Orange Swoosh Draw
      tl.fromTo('.orange-swoosh',
        { strokeDasharray: 3000, strokeDashoffset: 3000 },
        { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' },
        0.4
      );
      
      // Flight Path Draw
      tl.fromTo('.flight-path',
        { strokeDasharray: '8 8', strokeDashoffset: 100 },
        { strokeDashoffset: 0, duration: 2, ease: 'none' },
        0.8
      );
      tl.fromTo('.flight-icon',
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.8 },
        1.2
      );

      // Floating UI Cards
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.floating-card');
        tl.fromTo(cards,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 },
          1
        );
      }

      // Circular Metric Animation
      tl.fromTo('.metric-ring',
        { strokeDasharray: 251, strokeDashoffset: 251 },
        { strokeDashoffset: 20, duration: 1.5, ease: 'power3.out' },
        1.5
      );

      // Parallax on scroll (Background)
      gsap.to(imageRef.current, {
        y: '10%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
      
      // Parallax on scroll (Foreground Character)
      gsap.to('.hero-character', {
        y: '5%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
      
      // Parallax for text elements
      gsap.to('.hero-title-1', {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
      
      gsap.to('.hero-title-2', {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      // Set to final states immediately
      gsap.set([imageRef.current, '.hero-text-small', '.hero-character', '.hero-title-1', '.hero-title-2', '.floating-card', '.flight-icon'], { opacity: 1, x: 0, y: 0, scale: 1 });
      gsap.set('.orange-swoosh', { strokeDashoffset: 0 });
      gsap.set('.metric-ring', { strokeDashoffset: 20 });
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen min-h-[700px] md:min-h-[900px] overflow-hidden bg-[#e8e9eb]">
      
      {/* Background Image */}
      <img 
        ref={imageRef}
        src="/background-sem-foto.png" 
        alt="Fundo do escritório" 
        className="absolute inset-0 w-full h-full object-cover object-[65%_30%]"
      />

      {/* Subtle Gradient Overlays */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent z-10" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-nc-space to-transparent z-10" />
      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white/60 via-white/20 to-transparent z-10 md:hidden" />

      {/* Graphic Overlays: Orange Swoosh (Behind the character) */}
      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1440 900">
         <path className="orange-swoosh" d="M-100,750 Q600,950 1600,300" stroke="#DB8902" strokeWidth="6" fill="none" strokeLinecap="round" />
      </svg>

      {/* Graphic Overlays: Flight Path */}
      <div className="absolute top-[35%] left-[5%] md:left-[15%] w-[50%] md:w-[35%] h-[20%] z-10 pointer-events-none">
         <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
           <path className="flight-path" d="M0,150 Q200,50 400,80" stroke="#DB8902" strokeWidth="2" fill="none" opacity="0.3" />
           <g className="flight-icon" transform="translate(380, 75) rotate(15)">
             <Plane className="text-nc-orange fill-nc-orange/20" size={24} />
           </g>
         </svg>
      </div>

      {/* Foreground Character (In front of the swoosh, behind the text) */}
      <img
        src="/Mulher.png"
        alt="Executiva"
        className="hero-character absolute bottom-0 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-[15%] lg:right-[20%] h-[75%] md:h-[95%] w-auto object-contain z-[15] drop-shadow-2xl pointer-events-none"
      />

      <div className="relative z-20 w-full max-w-[1440px] mx-auto h-full px-6 md:px-12 lg:px-20 pt-32 pb-24 flex flex-col justify-between">
        
        {/* Top Content: Paragraph */}
        <div className="hero-text-small max-w-[320px] md:max-w-[420px]">
          <p className="text-[#c90d23] font-bold text-sm md:text-base tracking-widest uppercase mb-2 drop-shadow-sm">We Are Travel</p>
          <p className="text-nc-space text-lg md:text-2xl font-medium leading-snug drop-shadow-sm">
            Soluções inteligentes para viagens corporativas com <span className="text-white font-bold drop-shadow-md">atendimento humano, tecnologia e gestão eficiente</span>
          </p>
        </div>

        {/* Middle/Bottom Typography */}
        <div className="relative w-full flex-grow pointer-events-none mt-8 md:mt-0">
           <h1 className="hero-title-1 absolute top-[20%] md:top-[25%] left-0 text-[#37393e] font-display font-extrabold text-[72px] md:text-[120px] lg:text-[160px] xl:text-[180px] leading-[0.85] tracking-tighter drop-shadow-2xl">
             A evolução
           </h1>
           <h2 className="hero-title-2 absolute bottom-[10%] md:bottom-[15%] right-0 md:right-10 text-white font-display font-extrabold text-[56px] md:text-[90px] lg:text-[130px] xl:text-[150px] leading-[0.85] tracking-tighter drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)] text-right">
             é sob medida
           </h2>
        </div>

        {/* Floating UI Cards */}
        <div ref={cardsRef} className="absolute top-40 right-12 lg:right-24 z-30 hidden lg:flex flex-col gap-5 w-[340px]">
           
           {/* Card 1: Flight */}
           <div className="floating-card bg-white/85 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/60 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center">
                    <Plane size={18} className="text-[#37393e]" />
                 </div>
                 <div>
                   <p className="text-[13px] font-bold text-[#37393e]">São Paulo &rarr; Lisboa</p>
                   <p className="text-[11px] text-[#37393e]/60 font-medium">12 - 16 mai 2025</p>
                 </div>
              </div>
              <div className="bg-[#E6F4EA] text-[#137333] text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                Confirmado
              </div>
              <ChevronRight size={14} className="text-gray-400" />
           </div>
           
           {/* Card 2: Hotel */}
           <div className="floating-card bg-white/85 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/60 flex items-center justify-between ml-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center">
                  <Bed size={18} className="text-[#37393e]" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#37393e]">Hotel</p>
                  <p className="text-[11px] text-[#37393e]/60 font-medium">Reserva garantida</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-gray-400" />
           </div>
           
           {/* Card 3: Transfer */}
           <div className="floating-card bg-white/85 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/60 flex items-center justify-between ml-16">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center">
                  <Car size={18} className="text-[#37393e]" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#37393e]">Transfers</p>
                  <p className="text-[11px] text-[#37393e]/60 font-medium">Agendado</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-gray-400" />
           </div>

           {/* Circular Metric Card */}
           <div className="floating-card absolute top-[280px] -left-12 bg-white/95 backdrop-blur-md rounded-[32px] p-6 shadow-2xl border border-white/60 flex flex-col items-center justify-center w-44 h-44">
              <div className="relative w-24 h-24 flex items-center justify-center mb-3">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                  <circle cx="50" cy="50" r="40" stroke="#DB8902" strokeWidth="8" fill="none" strokeDasharray="251" strokeDashoffset="251" strokeLinecap="round" className="metric-ring" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-[28px] font-bold text-[#37393e] leading-none tracking-tighter">92%</span>
                </div>
              </div>
              <p className="text-[9px] text-center font-bold text-[#37393e]/70 leading-[1.2] uppercase tracking-[0.05em] px-2">
                viagens dentro<br/>da política
              </p>
           </div>
           
        </div>
      </div>
    </section>
  );
};
