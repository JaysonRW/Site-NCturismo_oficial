import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CLIENT_LOGOS = [
  { id: 1, name: 'Empresa Parceira 1', logo: '/logoempresa (1).jpeg' },
  { id: 2, name: 'Empresa Parceira 2', logo: '/logoempresa (2).jpeg' },
  { id: 3, name: 'Empresa Parceira 3', logo: '/logoempresa (3).jpeg' },
  { id: 4, name: 'Empresa Parceira 4', logo: '/logoempresa (4).jpeg' },
  { id: 5, name: 'Empresa Parceira 5', logo: '/logoempresa (5).jpeg' },
  { id: 6, name: 'Empresa Parceira 6', logo: '/logoempresa (6).jpeg' },
  { id: 7, name: 'Empresa Parceira 7', logo: '/logoempresa (7).jpeg' },
  { id: 8, name: 'Empresa Parceira 8', logo: '/logoempresa (8).jpeg' },
  { id: 9, name: 'Empresa Parceira 9', logo: '/logoempresa (9).jpeg' },
  { id: 10, name: 'Empresa Parceira 10', logo: '/logoempresa (10).jpeg' },
  { id: 11, name: 'Empresa Parceira 11', logo: '/logoempresa (11).jpeg' },
  { id: 12, name: 'Empresa Parceira 12', logo: '/logoempresa (12).jpeg' },
];

export const ClientsCarousel: React.FC = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollerRef.current) return;
    
    // Duplicate content for infinite scroll effect
    const scrollerContent = Array.from(scrollerRef.current.children);
    scrollerContent.forEach(item => {
      const duplicatedItem = item.cloneNode(true);
      if (scrollerRef.current) {
        scrollerRef.current.appendChild(duplicatedItem);
      }
    });
  }, []);

  return (
    <section className="py-24 bg-white overflow-hidden border-t border-slate-100">
      <div className="max-w-[1536px] mx-auto px-6 md:px-12 mb-12">
        <h2 className="text-[#0F172A] text-2xl md:text-3xl lg:text-[40px] font-bold leading-tight max-w-xl">
          Grandes jornadas começam com boas parcerias.
        </h2>
      </div>

      {/* CSS Animation Carousel */}
      <div className="relative w-full overflow-hidden flex whitespace-nowrap bg-white py-4 mask-edges">
        <div 
          ref={scrollerRef}
          className="flex gap-6 px-3 items-center animate-scroll"
        >
          {CLIENT_LOGOS.map((client) => (
            <div 
              key={client.id}
              className="flex-shrink-0 w-[180px] sm:w-[220px] md:w-[240px] h-[90px] md:h-[110px] bg-white border border-slate-200/90 rounded-2xl flex items-center justify-center p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-[#DB8902]/40 transition-all duration-300 group cursor-pointer overflow-hidden"
            >
              <img 
                src={client.logo} 
                alt={client.name} 
                loading="lazy"
                className="w-full h-full object-contain filter grayscale contrast-125 opacity-70 group-hover:grayscale-0 group-hover:contrast-100 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .mask-edges {
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); } /* 50% is the original content width + gap */
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
};
