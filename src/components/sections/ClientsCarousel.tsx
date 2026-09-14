import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const MOCK_CLIENTS = [
  { id: 1, name: 'Client 1', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
  { id: 2, name: 'Client 2', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
  { id: 3, name: 'Client 3', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
  { id: 4, name: 'Client 4', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
  { id: 5, name: 'Client 5', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
  { id: 6, name: 'Client 6', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg' },
  { id: 7, name: 'Client 7', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg' },
  { id: 8, name: 'Client 8', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
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
          {MOCK_CLIENTS.map((client) => (
            <div 
              key={client.id}
              className="flex-shrink-0 w-[200px] md:w-[240px] h-[100px] md:h-[120px] bg-white border border-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center p-6 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
            >
              <img 
                src={client.logo} 
                alt={client.name} 
                className="w-full h-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
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
