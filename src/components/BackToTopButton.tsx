import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Exibe o botão discretamente após o usuário rolar 400px
      const currentScrollY = window.scrollY || document.documentElement.scrollTop || 0;
      if (currentScrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    // Verificação inicial
    toggleVisibility();

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Voltar ao topo da página"
      className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 group inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full text-xs font-medium text-slate-300 hover:text-white bg-[#0B0D13]/85 hover:bg-[#151922] border border-white/10 hover:border-[#DB8902]/60 shadow-xl shadow-black/50 backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#DB8902]/50 cursor-pointer ${
        isVisible 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="w-5 h-5 rounded-full bg-white/5 group-hover:bg-[#C8102E]/20 text-[#DB8902] group-hover:text-[#C8102E] flex items-center justify-center transition-colors">
        <ArrowUp size={13} className="group-hover:-translate-y-0.5 transition-transform duration-200" />
      </div>
      <span className="tracking-wide font-medium">Voltar ao topo</span>
    </button>
  );
};
