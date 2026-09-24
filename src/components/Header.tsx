import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, 
  Menu, 
  X, 
  ArrowRight, 
  Building2, 
  Cpu, 
  BarChart3, 
  ShieldCheck, 
  Headphones, 
  CreditCard, 
  Users, 
  CalendarDays, 
  Sparkles,
  BookOpen,
  HelpCircle,
  FileCheck
} from 'lucide-react';

interface HeaderProps {
  onHomeClick?: () => void;
  currentView?: string;
  onNavigate?: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onHomeClick, 
  currentView = 'home',
  onNavigate 
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Desktop active dropdown state: 'corporativo' | 'beneficios' | 'mice' | null
  const [activeDropdown, setActiveDropdown] = useState<'corporativo' | 'beneficios' | 'mice' | null>(null);
  
  // Mobile accordion expand state
  const [mobileExpanded, setMobileExpanded] = useState<{
    corporativo: boolean;
    beneficios: boolean;
    mice: boolean;
  }>({
    corporativo: false,
    beneficios: false,
    mice: false
  });

  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMouseEnter = (menu: 'corporativo' | 'beneficios' | 'mice') => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const navigateTo = (hash: string, viewName?: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    
    if (viewName && onNavigate) {
      onNavigate(viewName);
    }
    
    window.location.hash = hash;
    
    // If it's an anchor on the current page, scroll into view
    if (hash.startsWith('#')) {
      const elementId = hash.replace('#', '');
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Dynamic header CTA label based on context
  const isCorporativoView = currentView === 'corporativo' || currentView === 'viagens-corporativas';
  const ctaLabel = isCorporativoView ? 'Solicitar Diagnóstico' : 'Fale com a NC';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || activeDropdown || mobileMenuOpen
          ? 'bg-nc-space/95 backdrop-blur-md py-4 shadow-lg border-b border-white/5' 
          : 'bg-transparent py-6 md:py-8'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            if (onHomeClick) {
              onHomeClick();
            } else {
              navigateTo('');
            }
          }}
          className="flex items-center gap-3 shrink-0 focus:outline-none focus:ring-2 focus:ring-nc-orange/50 rounded-lg p-1"
          aria-label="NC Turismo - Página Inicial"
        >
          <img 
            src="/logo.png" 
            alt="NC Turismo" 
            className="w-[170px] md:w-[210px] h-auto object-contain transform origin-left -my-3" 
          />
        </a>
        
        {/* =========================================================================
            DESKTOP NAVIGATION
           ========================================================================= */}
        <nav className="hidden lg:flex items-center space-x-7" aria-label="Navegação Principal">
          
          {/* 1. CORPORATIVO (Mega Menu) */}
          <div 
            className="relative"
            onMouseEnter={() => handleMouseEnter('corporativo')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'corporativo' ? null : 'corporativo')}
              className={`inline-flex items-center gap-1.5 text-[13px] uppercase tracking-[0.08em] font-medium transition-colors py-2 focus:outline-none ${
                activeDropdown === 'corporativo' || isCorporativoView
                  ? 'text-nc-orange font-semibold'
                  : 'text-nc-warm/80 hover:text-white'
              }`}
              aria-expanded={activeDropdown === 'corporativo'}
              aria-haspopup="true"
            >
              <span>Corporativo</span>
              <ChevronDown 
                size={14} 
                className={`transition-transform duration-200 ${activeDropdown === 'corporativo' ? 'rotate-180 text-nc-orange' : 'opacity-70'}`} 
              />
            </button>

            {/* Mega Menu Dropdown */}
            {activeDropdown === 'corporativo' && (
              <div 
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[880px] bg-[#0c0e13]/98 backdrop-blur-2xl border border-white/10 rounded-2xl p-7 shadow-2xl shadow-black/80 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                onMouseEnter={() => handleMouseEnter('corporativo')}
                onMouseLeave={handleMouseLeave}
                role="menu"
                aria-label="Submenu Corporativo"
              >
                {/* Header label */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-nc-orange animate-pulse" />
                    <span className="text-xs font-mono uppercase tracking-[0.16em] text-nc-orange font-bold">
                      Soluções Corporativas Integradas
                    </span>
                  </div>
                  <a
                    href="#viagens-corporativas"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('#viagens-corporativas', 'viagens-corporativas');
                    }}
                    className="text-xs text-nc-warm/60 hover:text-white transition-colors flex items-center gap-1"
                  >
                    Ver visão geral corporativa <ArrowRight size={12} />
                  </a>
                </div>

                <div className="grid grid-cols-4 gap-6">
                  {/* Coluna 1: GESTÃO */}
                  <div className="space-y-4">
                    <div className="border-b border-white/10 pb-2">
                      <h4 className="text-[12px] font-mono uppercase tracking-[0.12em] text-white font-bold">
                        Gestão
                      </h4>
                    </div>
                    <ul className="space-y-2.5 text-xs text-nc-warm/75">
                      <li>
                        <a 
                          href="#solucoes"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('#solucoes');
                          }}
                          className="hover:text-nc-orange hover:translate-x-1 transition-all inline-block py-1 font-medium"
                        >
                          Gestão de Viagens
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#solucoes"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('#solucoes');
                          }}
                          className="hover:text-nc-orange hover:translate-x-1 transition-all inline-block py-1 font-medium"
                        >
                          Gestão de Despesas
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#solucoes"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('#solucoes');
                          }}
                          className="hover:text-nc-orange hover:translate-x-1 transition-all inline-block py-1 font-medium"
                        >
                          Política de Viagens
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Coluna 2: TECNOLOGIA E DADOS */}
                  <div className="space-y-4">
                    <div className="border-b border-white/10 pb-2">
                      <h4 className="text-[12px] font-mono uppercase tracking-[0.12em] text-white font-bold">
                        Tecnologia e Dados
                      </h4>
                    </div>
                    <ul className="space-y-2.5 text-xs text-nc-warm/75">
                      <li>
                        <a 
                          href="#solucoes"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('#solucoes');
                          }}
                          className="hover:text-nc-orange hover:translate-x-1 transition-all inline-block py-1 font-medium"
                        >
                          Tecnologia e Integrações
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#solucoes"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('#solucoes');
                          }}
                          className="hover:text-nc-orange hover:translate-x-1 transition-all inline-block py-1 font-medium"
                        >
                          BI e Relatórios
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Coluna 3: SEGURANÇA E SUPORTE */}
                  <div className="space-y-4">
                    <div className="border-b border-white/10 pb-2">
                      <h4 className="text-[12px] font-mono uppercase tracking-[0.12em] text-white font-bold">
                        Segurança e Suporte
                      </h4>
                    </div>
                    <ul className="space-y-2.5 text-xs text-nc-warm/75">
                      <li>
                        <a 
                          href="#solucoes"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('#solucoes');
                          }}
                          className="hover:text-nc-orange hover:translate-x-1 transition-all inline-block py-1 font-medium"
                        >
                          Atendimento 24h
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#solucoes"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('#solucoes');
                          }}
                          className="hover:text-nc-orange hover:translate-x-1 transition-all inline-block py-1 font-medium"
                        >
                          Compliance e ESG
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Coluna 4: CONHEÇA A SOLUÇÃO (Featured Box) */}
                  <div className="bg-gradient-to-br from-nc-surface via-[#171b26] to-nc-surface border border-nc-orange/30 rounded-xl p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-nc-orange font-bold block mb-1.5">
                        Conheça a Solução
                      </span>
                      <h5 className="text-sm font-bold text-white mb-2 leading-snug">
                        VIAGENS CORPORATIVAS
                      </h5>
                      <p className="text-[11px] text-nc-warm/70 leading-relaxed mb-4">
                        Gestão, tecnologia, dados e atendimento para sua empresa.
                      </p>
                    </div>

                    <a 
                      href="#viagens-corporativas"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('#viagens-corporativas', 'viagens-corporativas');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-nc-orange hover:text-white transition-colors"
                    >
                      Conhecer solução <ArrowRight size={13} />
                    </a>
                  </div>
                </div>

                {/* Sub-bar: Conteúdo em Destaque do Conhecimento NC */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-nc-warm/50 font-semibold">
                      Conteúdo em Destaque:
                    </span>
                    <a 
                      href="#artigo/sla-suporte-viagens-corporativas-atendimento"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('#artigo/sla-suporte-viagens-corporativas-atendimento', 'blog-post');
                      }}
                      className="text-nc-warm/85 hover:text-nc-orange transition-colors font-medium flex items-center gap-1"
                    >
                      Como estruturar SLA e atendimento para viagens corporativas <ArrowRight size={11} />
                    </a>
                  </div>

                  <a 
                    href="#conhecimento"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('#conhecimento', 'blog');
                    }}
                    className="text-nc-orange hover:underline font-mono text-[11px]"
                  >
                    Ver Conhecimento NC &rarr;
                  </a>
                </div>

              </div>
            )}
          </div>

          {/* 2. BENEFÍCIOS E PARCERIAS (Submenu) */}
          <div 
            className="relative"
            onMouseEnter={() => handleMouseEnter('beneficios')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'beneficios' ? null : 'beneficios')}
              className={`inline-flex items-center gap-1.5 text-[13px] uppercase tracking-[0.08em] font-medium transition-colors py-2 focus:outline-none ${
                activeDropdown === 'beneficios' || currentView === 'beneficios'
                  ? 'text-nc-orange font-semibold'
                  : 'text-nc-warm/80 hover:text-white'
              }`}
              aria-expanded={activeDropdown === 'beneficios'}
              aria-haspopup="true"
            >
              <span>Benefícios e Parcerias</span>
              <ChevronDown 
                size={14} 
                className={`transition-transform duration-200 ${activeDropdown === 'beneficios' ? 'rotate-180 text-nc-orange' : 'opacity-70'}`} 
              />
            </button>

            {/* Submenu Dropdown */}
            {activeDropdown === 'beneficios' && (
              <div 
                className="absolute top-full left-0 mt-3 w-80 bg-[#0c0e13]/98 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/80 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                onMouseEnter={() => handleMouseEnter('beneficios')}
                onMouseLeave={handleMouseLeave}
                role="menu"
              >
                <div className="text-[11px] font-mono uppercase tracking-wider text-nc-orange font-bold mb-3">
                  Benefícios em Viagens
                </div>
                <ul className="space-y-2.5 text-xs text-nc-warm/80 mb-5">
                  <li>
                    <a 
                      href="#beneficios"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('#beneficios', 'beneficios');
                      }}
                      className="hover:text-white hover:translate-x-1 transition-all inline-block py-1 font-medium"
                    >
                      Para Empresas
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#beneficios"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('#beneficios', 'beneficios');
                      }}
                      className="hover:text-white hover:translate-x-1 transition-all inline-block py-1 font-medium"
                    >
                      Para Associações e Entidades
                    </a>
                  </li>
                </ul>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  <p className="text-[11px] text-nc-warm/60 leading-relaxed">
                    Sua organização também pode oferecer viagens como benefício para colaboradores e membros.
                  </p>
                  <a 
                    href="#beneficios"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('#beneficios', 'beneficios');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-nc-orange hover:text-white transition-colors"
                  >
                    Conheça a solução <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* 3. MICE ▼ (Submenu) */}
          <div 
            className="relative"
            onMouseEnter={() => handleMouseEnter('mice')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'mice' ? null : 'mice')}
              className={`inline-flex items-center gap-1.5 text-[13px] uppercase tracking-[0.08em] font-medium transition-colors py-2 focus:outline-none ${
                activeDropdown === 'mice'
                  ? 'text-nc-orange font-semibold'
                  : 'text-nc-warm/80 hover:text-white'
              }`}
              aria-expanded={activeDropdown === 'mice'}
              aria-haspopup="true"
            >
              <span>MICE</span>
              <ChevronDown 
                size={14} 
                className={`transition-transform duration-200 ${activeDropdown === 'mice' ? 'rotate-180 text-nc-orange' : 'opacity-70'}`} 
              />
            </button>

            {/* Submenu Dropdown */}
            {activeDropdown === 'mice' && (
              <div 
                className="absolute top-full left-0 mt-3 w-72 bg-[#0c0e13]/98 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/80 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                onMouseEnter={() => handleMouseEnter('mice')}
                onMouseLeave={handleMouseLeave}
                role="menu"
              >
                <div className="text-[11px] font-mono uppercase tracking-wider text-nc-orange font-bold mb-3">
                  Eventos & Incentivos
                </div>
                <ul className="space-y-2.5 text-xs text-nc-warm/80 mb-5">
                  <li>
                    <a 
                      href="#diagnostico"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('#diagnostico');
                      }}
                      className="hover:text-white hover:translate-x-1 transition-all inline-block py-1 font-medium"
                    >
                      Eventos Corporativos
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#diagnostico"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('#diagnostico');
                      }}
                      className="hover:text-white hover:translate-x-1 transition-all inline-block py-1 font-medium"
                    >
                      Grupos
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#diagnostico"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('#diagnostico');
                      }}
                      className="hover:text-white hover:translate-x-1 transition-all inline-block py-1 font-medium"
                    >
                      Incentivos
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#diagnostico"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('#diagnostico');
                      }}
                      className="hover:text-white hover:translate-x-1 transition-all inline-block py-1 font-medium"
                    >
                      Congressos e Convenções
                    </a>
                  </li>
                </ul>

                <div className="pt-4 border-t border-white/10">
                  <a 
                    href="#diagnostico"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('#diagnostico');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-nc-orange hover:text-white transition-colors"
                  >
                    Planeje seu evento com a NC Turismo <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* 4. LAZER (Direct Link) */}
          <a 
            href="#lazer"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('#lazer', 'lazer');
            }}
            className={`text-[13px] uppercase tracking-[0.08em] font-medium transition-colors py-2 ${
              currentView === 'lazer' ? 'text-nc-orange font-semibold' : 'text-nc-warm/80 hover:text-white'
            }`}
          >
            Lazer
          </a>

          {/* 5. CONHECIMENTO NC (Direct Link) */}
          <a 
            href="#conhecimento"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('#conhecimento', 'blog');
            }}
            className={`text-[13px] uppercase tracking-[0.08em] font-medium transition-colors py-2 ${
              currentView === 'blog' || currentView === 'blog-post' ? 'text-nc-orange font-semibold' : 'text-nc-warm/80 hover:text-white'
            }`}
          >
            Conhecimento NC
          </a>

          {/* 6. QUEM SOMOS (Direct Link) */}
          <a 
            href="#quem-somos"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('#quem-somos', 'quem-somos');
            }}
            className={`text-[13px] uppercase tracking-[0.08em] font-medium transition-colors py-2 ${
              currentView === 'quem-somos' ? 'text-nc-orange font-semibold' : 'text-nc-warm/80 hover:text-white'
            }`}
          >
            Quem Somos
          </a>

          {/* Action CTA Button */}
          <a 
            href="#diagnostico" 
            onClick={(e) => {
              e.preventDefault();
              navigateTo('#diagnostico');
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-nc-orange text-nc-space hover:bg-white hover:text-nc-space rounded-full text-[12px] uppercase tracking-[0.1em] font-bold transition-all shadow-md hover:shadow-nc-orange/30 shrink-0 ml-2"
          >
            {ctaLabel}
          </a>

        </nav>

        {/* =========================================================================
            MOBILE NAV TOGGLE
           ========================================================================= */}
        <button 
          className="lg:hidden text-white p-2 focus:outline-none focus:ring-2 focus:ring-nc-orange/50 rounded-lg"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Fechar Menu' : 'Abrir Menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* =========================================================================
          MOBILE MENU DRAWER
         ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[72px] bottom-0 bg-nc-space/98 backdrop-blur-2xl border-t border-white/10 p-6 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* 1. Mobile Accordion: Corporativo */}
            <div className="border-b border-white/10 pb-3">
              <button
                onClick={() => setMobileExpanded(prev => ({ ...prev, corporativo: !prev.corporativo }))}
                className="w-full flex items-center justify-between text-left text-sm uppercase tracking-[0.08em] font-bold text-white py-2"
              >
                <span>Corporativo</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${mobileExpanded.corporativo ? 'rotate-180 text-nc-orange' : 'text-white/60'}`} 
                />
              </button>

              {mobileExpanded.corporativo && (
                <div className="pt-3 pl-3 space-y-4 animate-in fade-in duration-200">
                  <a
                    href="#viagens-corporativas"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('#viagens-corporativas', 'viagens-corporativas');
                    }}
                    className="block text-xs font-bold text-nc-orange bg-nc-orange/10 p-2.5 rounded-lg border border-nc-orange/30"
                  >
                    Viagens Corporativas (Visão Geral) &rarr;
                  </a>

                  {/* Gestão */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-nc-warm/50 font-bold">Gestão</span>
                    <div className="flex flex-col space-y-1 pl-2 text-xs text-nc-warm/80">
                      <a href="#solucoes" onClick={() => navigateTo('#solucoes')} className="py-1">Gestão de Viagens</a>
                      <a href="#solucoes" onClick={() => navigateTo('#solucoes')} className="py-1">Gestão de Despesas</a>
                      <a href="#solucoes" onClick={() => navigateTo('#solucoes')} className="py-1">Política de Viagens</a>
                    </div>
                  </div>

                  {/* Tecnologia e Dados */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-nc-warm/50 font-bold">Tecnologia e Dados</span>
                    <div className="flex flex-col space-y-1 pl-2 text-xs text-nc-warm/80">
                      <a href="#solucoes" onClick={() => navigateTo('#solucoes')} className="py-1">Tecnologia e Integrações</a>
                      <a href="#solucoes" onClick={() => navigateTo('#solucoes')} className="py-1">BI e Relatórios</a>
                    </div>
                  </div>

                  {/* Segurança e Suporte */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-nc-warm/50 font-bold">Segurança e Suporte</span>
                    <div className="flex flex-col space-y-1 pl-2 text-xs text-nc-warm/80">
                      <a href="#solucoes" onClick={() => navigateTo('#solucoes')} className="py-1">Atendimento 24h</a>
                      <a href="#solucoes" onClick={() => navigateTo('#solucoes')} className="py-1">Compliance e ESG</a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Mobile Accordion: Benefícios e Parcerias */}
            <div className="border-b border-white/10 pb-3">
              <button
                onClick={() => setMobileExpanded(prev => ({ ...prev, beneficios: !prev.beneficios }))}
                className="w-full flex items-center justify-between text-left text-sm uppercase tracking-[0.08em] font-bold text-white py-2"
              >
                <span>Benefícios e Parcerias</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${mobileExpanded.beneficios ? 'rotate-180 text-nc-orange' : 'text-white/60'}`} 
                />
              </button>

              {mobileExpanded.beneficios && (
                <div className="pt-2 pl-3 space-y-2 text-xs text-nc-warm/80 animate-in fade-in duration-200">
                  <a href="#beneficios" onClick={() => navigateTo('#beneficios', 'beneficios')} className="block py-1">Para Empresas</a>
                  <a href="#beneficios" onClick={() => navigateTo('#beneficios', 'beneficios')} className="block py-1">Para Associações e Entidades</a>
                  <a href="#beneficios" onClick={() => navigateTo('#beneficios', 'beneficios')} className="block py-1 text-nc-orange font-semibold">Conheça a solução &rarr;</a>
                </div>
              )}
            </div>

            {/* 3. Mobile Accordion: MICE */}
            <div className="border-b border-white/10 pb-3">
              <button
                onClick={() => setMobileExpanded(prev => ({ ...prev, mice: !prev.mice }))}
                className="w-full flex items-center justify-between text-left text-sm uppercase tracking-[0.08em] font-bold text-white py-2"
              >
                <span>MICE</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${mobileExpanded.mice ? 'rotate-180 text-nc-orange' : 'text-white/60'}`} 
                />
              </button>

              {mobileExpanded.mice && (
                <div className="pt-2 pl-3 space-y-2 text-xs text-nc-warm/80 animate-in fade-in duration-200">
                  <a href="#diagnostico" onClick={() => navigateTo('#diagnostico')} className="block py-1">Eventos Corporativos</a>
                  <a href="#diagnostico" onClick={() => navigateTo('#diagnostico')} className="block py-1">Grupos</a>
                  <a href="#diagnostico" onClick={() => navigateTo('#diagnostico')} className="block py-1">Incentivos</a>
                  <a href="#diagnostico" onClick={() => navigateTo('#diagnostico')} className="block py-1">Congressos e Convenções</a>
                  <a href="#diagnostico" onClick={() => navigateTo('#diagnostico')} className="block py-1 text-nc-orange font-semibold">Planeje seu evento com a NC &rarr;</a>
                </div>
              )}
            </div>

            {/* 4. Direct: Lazer */}
            <div className="border-b border-white/10 py-2">
              <a 
                href="#lazer" 
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('#lazer', 'lazer');
                }}
                className="block text-sm uppercase tracking-[0.08em] font-bold text-white py-1"
              >
                Lazer
              </a>
            </div>

            {/* 5. Direct: Conhecimento NC */}
            <div className="border-b border-white/10 py-2">
              <a 
                href="#conhecimento" 
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('#conhecimento', 'blog');
                }}
                className="block text-sm uppercase tracking-[0.08em] font-bold text-white py-1"
              >
                Conhecimento NC
              </a>
            </div>

            {/* 6. Direct: Quem Somos */}
            <div className="border-b border-white/10 py-2">
              <a 
                href="#quem-somos" 
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('#quem-somos', 'quem-somos');
                }}
                className="block text-sm uppercase tracking-[0.08em] font-bold text-white py-1"
              >
                Quem Somos
              </a>
            </div>

          </div>

          {/* Mobile Bottom CTA */}
          <div className="pt-6">
            <a 
              href="#diagnostico" 
              onClick={() => navigateTo('#diagnostico')}
              className="w-full inline-flex justify-center items-center gap-2 px-6 py-4 bg-nc-orange text-nc-space rounded-full text-xs font-bold uppercase tracking-[0.1em] shadow-lg"
            >
              {ctaLabel}
            </a>
          </div>

        </div>
      )}
    </header>
  );
};
