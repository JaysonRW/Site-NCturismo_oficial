import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Transformation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    
    let mm = gsap.matchMedia();
    
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const isDesktop = window.innerWidth >= 1024;
      const xOffsetLeft = isDesktop ? 220 : 40;
      const xOffsetRight = isDesktop ? -220 : -40;

      const scrubTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%', 
          end: 'bottom 80%', // Termina antes da seção sair da tela
          scrub: 1,
        }
      });
      
      // 1. Primeira frase surge primeiro e vai até o centro
      scrubTl.fromTo('.st-title-left', 
        { opacity: 0, x: xOffsetLeft + 50 },
        { opacity: 1, x: xOffsetLeft, duration: 1.5, ease: 'power1.out' }
      )
      // 2. Segunda frase surge em seguida e vai até o centro
      .fromTo('.st-title-right', 
        { opacity: 0, x: xOffsetRight - 50 },
        { opacity: 1, x: xOffsetRight, duration: 1.5, ease: 'power1.out' },
        "-=0.5" // Sobrepõe um pouco a primeira para agilizar a sequência
      )
      
      // Breve momento com as duas no centro (reduzido)
      .addLabel('separacao', "+=0.2")
      
      // 3. Imagem surge no centro expandindo e joga as frases para os lados
      .to('.st-title-left', { x: 0, duration: 2.5, ease: 'power2.out' }, 'separacao')
      .to('.st-title-right', { x: 0, duration: 2.5, ease: 'power2.out' }, 'separacao')
      .fromTo('.st-center-img',
        { opacity: 0, scale: 0.1, y: 150 },
        { opacity: 1, scale: 1, y: 0, duration: 2.5, ease: 'back.out(1.2)' },
        'separacao'
      )
      
      // 4. Texto inferior surge logo que a imagem se aproxima do final
      .fromTo('.st-bottom-text',
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.5, ease: 'power1.out' },
        "-=1"
      );
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full bg-[#F8F9FA] overflow-hidden">
      
      {/* Light Background Layer with Grid */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_60%,transparent_100%)]"></div>
      </div>

      <div className="max-w-[1536px] mx-auto px-6 md:px-12 relative z-10 pt-20 pb-24 lg:pt-32 lg:pb-32">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 lg:mb-16 gap-6">
           <div className="flex items-center gap-3">
              <span className="w-1 h-5 bg-nc-orange rounded-full"></span>
              <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">
                 Viagens corporativas sem complexidade
              </span>
           </div>
           
           <div className="flex items-center gap-4">
              <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-slate-500 uppercase flex items-center gap-4">
                <span>Pessoas</span>
                <span>Viajam</span>
                <span>Negócios</span>
                <span className="text-[#0F172A]">Avançam</span>
              </span>
              <span className="w-8 h-0.5 bg-nc-orange"></span>
           </div>
        </div>

        {/* Main Content Layout */}
        <div className="relative w-full flex flex-col items-center justify-center min-h-[450px] lg:min-h-[550px] mt-4 mb-12">
           
           {/* Left Title */}
           <div className="st-title-left absolute left-0 lg:left-[5%] xl:left-[8%] top-[5%] lg:top-[25%] w-full lg:w-auto text-center lg:text-left z-20">
              <h2 className="text-[#0F172A] text-4xl md:text-5xl lg:text-[44px] xl:text-[50px] font-bold leading-[1.1] tracking-tight">
                 Da solicitação<br/>ao retorno,
              </h2>
           </div>

           {/* Right Title */}
           <div className="st-title-right absolute right-0 lg:right-[2%] xl:right-[4%] top-[25%] lg:top-[25%] w-full lg:w-auto text-center lg:text-right z-20 mt-32 lg:mt-0">
              <h2 className="text-[#0F172A] text-4xl md:text-5xl lg:text-[44px] xl:text-[50px] font-bold leading-[1.1] tracking-tight">
                 uma gestão que<br/>
                 <span className="text-[#DB8902]">conecta cada etapa.</span>
              </h2>
           </div>

           {/* Center Illustration */}
           <div className="st-center-img relative w-[90%] md:w-[70%] lg:w-[55%] xl:w-[45%] mt-[180px] lg:mt-0 z-10 flex justify-center items-center">
              <img 
                 src="/ilustra3.png" 
                 alt="Gestão de Viagens Conectada" 
                 className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
              />
           </div>

        </div>

        {/* Bottom Text */}
        <div className="st-bottom-text mt-8 lg:mt-10 max-w-3xl mx-auto text-center relative z-20">
           <p className="text-slate-600 text-lg md:text-xl lg:text-[22px] font-medium leading-relaxed">
             Evolua de uma operação fragmentada para um fluxo inteligente,<br className="hidden md:block"/>
             eliminando atritos em cada fase do deslocamento corporativo.
           </p>
        </div>

      </div>

    </section>
  );
};
