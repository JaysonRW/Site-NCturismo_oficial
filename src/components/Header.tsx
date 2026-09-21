import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onHomeClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Quem Somos', href: '#quem-somos' },
    { name: 'Corporativo', href: '#solucoes' },
    { name: 'Lazer', href: '#lazer' },
    { name: 'Conhecimento NC', href: '#conhecimento' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-nc-space/95 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-between">
        <a 
          href="#" 
          onClick={(e) => {
            if (onHomeClick) {
              e.preventDefault();
              onHomeClick();
            }
          }}
          className="flex items-center gap-3"
        >
          <img src="/logo.png" alt="NC Turismo" className="w-[180px] md:w-[220px] h-auto object-contain transform origin-left -my-4" />
        </a>
        
        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-nc-warm/70 text-[13px] uppercase tracking-[0.08em] font-medium hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a href="#area-cliente" className="text-nc-warm/70 text-[13px] uppercase tracking-[0.08em] font-medium hover:text-white transition-colors">
            Área do Cliente
          </a>
          <a 
            href="#diagnostico" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white text-[12px] uppercase tracking-[0.1em] font-bold transition-all backdrop-blur-sm"
          >
            Contato
          </a>
        </nav>

        {/* Mobile Nav Toggle */}
        <button 
          className="lg:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-nc-space border-t border-white/5 p-6 flex flex-col space-y-6 shadow-xl h-screen">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={() => setMobileMenuOpen(false)}
              className="text-nc-warm uppercase tracking-[0.08em] hover:text-nc-orange transition-colors text-sm font-medium"
            >
              {link.name}
            </a>
          ))}
          <div className="h-px w-full bg-white/5 my-2"></div>
          <a href="#area-cliente" onClick={() => setMobileMenuOpen(false)} className="text-nc-warm uppercase tracking-[0.08em] hover:text-nc-orange transition-colors text-sm font-medium">
            Área do Cliente
          </a>
          <a 
            href="#diagnostico" 
            onClick={() => setMobileMenuOpen(false)}
            className="inline-flex justify-center items-center gap-2 px-6 py-4 bg-nc-orange rounded-full text-nc-space text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-opacity-90 transition-colors mt-4"
          >
            Solicitar diagnóstico
          </a>
        </div>
      )}
    </header>
  );
};
