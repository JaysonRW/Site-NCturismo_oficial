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
  FileCheck,
  Phone,
  MessageSquare
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
  
  // Desktop active dropdown state: 'corporativo' | 'beneficios' | null
  const [activeDropdown, setActiveDropdown] = useState<'corporativo' | 'beneficios' | null>(null);
  
  // Mobile accordion expand state
  const [mobileExpanded, setMobileExpanded] = useState<{
    corporativo: boolean;
    beneficios: boolean;
  }>({
    corporativo: false,
    beneficios: false
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

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [mobileMenuOpen]);

  const handleMouseEnter = (menu: 'corporativo' | 'beneficios') => {
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
    
    if (onNavigate) {
      onNavigate(viewName || hash);
    } else {
      window.location.hash = hash;
      // If it's an anchor on the current page, scroll into view
      if (hash.startsWith('#')) {
        const elementId = hash.replace('#', '');
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  // Dynamic header CTA label based on context
  const isCorporativoView = currentView === 'corporativo' || currentView === 'viagens-corporativas' || currentView === 'gestao-de-viagens';
  const ctaLabel = isCorporativoView ? 'Solicitar Diagnóstico' : 'Fale com a NC';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 h-[70px] lg:h-auto flex items-center lg:block transition-all duration-300 ${
        scrolled || activeDropdown || mobileMenuOpen || currentView !== 'home'
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
                          href="#gestao-de-viagens"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('#gestao-de-viagens', 'gestao-de-viagens');
                          }}
                          className="hover:text-nc-orange hover:translate-x-1 transition-all inline-block py-1 font-medium"
                        >
                          Gestão de Viagens
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#gestao-de-despesas"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('#gestao-de-despesas', 'gestao-de-despesas');
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
                          href="#tecnologia-obt"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('#tecnologia-obt', 'tecnologia-obt');
                          }}
                          className="hover:text-nc-orange hover:translate-x-1 transition-all inline-block py-1 font-medium"
                        >
                          Tecnologia e Integrações (OBT)
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#bi-e-relatorios"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('#bi-e-relatorios', 'bi-e-relatorios');
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
                          href="#atendimento-24h"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('#atendimento-24h', 'atendimento-24h');
                          }}
                          className="hover:text-nc-orange hover:translate-x-1 transition-all inline-block py-1 font-medium"
                        >
                          Atendimento 24h
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#compliance-esg"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('#compliance-esg', 'compliance-esg');
                          }}
                          className="hover:text-nc-orange hover:translate-x-1 transition-all inline-block py-1 font-medium"
                        >
                          Compliance e ESG
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#faq"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('#faq');
                          }}
                          className="hover:text-nc-orange hover:translate-x-1 transition-all inline-block py-1 font-medium text-amber-400/90"
                        >
                          Dúvidas Frequentes (FAQ)
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
            <a
              href="#beneficios"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('#beneficios', 'beneficios');
              }}
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
            </a>

            {/* Submenu Dropdown */}
            {activeDropdown === 'beneficios' && (
              <div 
                className="absolute top-full left-0 mt-3 w-80 bg-[#0c0e13]/98 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/80 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                onMouseEnter={() => handleMouseEnter('beneficios')}
                onMouseLeave={handleMouseLeave}
                role="menu"
              >
                <a 
                  href="#beneficios"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('#beneficios', 'beneficios');
                  }}
                  className="group flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-nc-orange hover:text-white font-bold mb-3 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-nc-orange animate-pulse" />
                    Benefícios em Viagens
                  </span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </a>
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

          {/* 3. LAZER (Direct Link) */}
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
          className="lg:hidden text-white p-2.5 rounded-xl border border-white/10 hover:border-nc-orange/50 bg-white/5 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-nc-orange/50 flex items-center justify-center cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Fechar Menu' : 'Abrir Menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} className="text-nc-orange" /> : <Menu size={24} />}
        </button>
      </div>

      {/* =========================================================================
          MOBILE MENU DRAWER - ROBUST & FULLY SCROLLABLE (100dvh)
         ========================================================================= */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-x-0 top-[70px] bottom-0 h-[calc(100dvh-70px)] z-50 bg-[#0B0D13]/98 backdrop-blur-2xl border-t border-white/10 flex flex-col shadow-2xl"
          data-lenis-prevent="true"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Scrollable Navigation Items */}
          <div 
            className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 space-y-3 pb-8"
            data-lenis-prevent="true"
          >
            {/* 1. SEÇÃO: CORPORATIVO (ACCORDION EXPANSÍVEL OU LISTA DESTACADA) */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 space-y-3">
              <button
                onClick={() => setMobileExpanded(prev => ({ ...prev, corporativo: !prev.corporativo }))}
                className="w-full flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C8102E]/20 to-[#DB8902]/20 border border-red-500/30 flex items-center justify-center text-nc-orange">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white tracking-wide">Corporativo</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-[#FF6B6B] border border-red-500/30">B2B</span>
                    </div>
                    <p className="text-[11px] text-nc-warm/60">Gestão, Plataformas e Governança</p>
                  </div>
                </div>
                <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 group-hover:text-nc-orange transition-colors">
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-200 ${mobileExpanded.corporativo ? 'rotate-180 text-nc-orange' : ''}`} 
                  />
                </div>
              </button>

              {/* Accordion Content */}
              {mobileExpanded.corporativo && (
                <div className="pt-2 space-y-2 border-t border-white/5 animate-in fade-in duration-200">
                  {/* Destaque 1: Gestão de Viagens */}
                  <a
                    href="#gestao-de-viagens"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('#gestao-de-viagens', 'gestao-de-viagens');
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-red-500/15 via-orange-500/10 to-transparent border border-red-500/40 hover:border-red-500/70 transition-all text-white group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles size={16} className="text-[#DB8902] shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          Gestão de Viagens Corporativas
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#C8102E] text-white">Novo</span>
                        </div>
                        <p className="text-[10px] text-nc-warm/70">Solução de ponta a ponta para empresas exigentes</p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-nc-orange group-hover:translate-x-1 transition-transform shrink-0" />
                  </a>

                  {/* Destaque 2: Viagens Corporativas Visão Geral */}
                  <a
                    href="#viagens-corporativas"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('#viagens-corporativas', 'viagens-corporativas');
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-nc-orange/40 transition-all text-white group cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">Viagens Corporativas (Visão Geral)</div>
                      <p className="text-[10px] text-nc-warm/60">Pilares: Gestão, BI, Tecnologia e Suporte</p>
                    </div>
                    <ArrowRight size={14} className="text-white/40 group-hover:text-nc-orange group-hover:translate-x-1 transition-transform shrink-0" />
                  </a>

                  {/* Sub-grid with direct anchors */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href="#gestao-de-despesas"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('#gestao-de-despesas', 'gestao-de-despesas');
                      }}
                      className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/20 text-left block cursor-pointer"
                    >
                      <span className="text-[11px] font-semibold text-white/90 block">Gestão de Despesas</span>
                      <span className="text-[9px] text-nc-warm/50">Controle financeiro</span>
                    </a>
                    <a
                      href="#solucoes"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('#solucoes');
                      }}
                      className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/20 text-left block cursor-pointer"
                    >
                      <span className="text-[11px] font-semibold text-white/90 block">Política de Viagens</span>
                      <span className="text-[9px] text-nc-warm/50">Compliance e regras</span>
                    </a>
                    <a
                      href="#tecnologia-obt"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('#tecnologia-obt', 'tecnologia-obt');
                      }}
                      className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/20 text-left block cursor-pointer"
                    >
                      <span className="text-[11px] font-semibold text-white/90 block">Tecnologia & OBT</span>
                      <span className="text-[9px] text-nc-warm/50">Plataformas ágeis</span>
                    </a>
                    <a
                      href="#bi-e-relatorios"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('#bi-e-relatorios', 'bi-e-relatorios');
                      }}
                      className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/20 text-left block cursor-pointer"
                    >
                      <span className="text-[11px] font-semibold text-white/90 block">BI & Relatórios</span>
                      <span className="text-[9px] text-nc-warm/50">Métricas de saving</span>
                    </a>
                    <a
                      href="#atendimento-24h"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('#atendimento-24h', 'atendimento-24h');
                      }}
                      className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/20 text-left block cursor-pointer"
                    >
                      <span className="text-[11px] font-semibold text-white/90 block">Atendimento 24h</span>
                      <span className="text-[9px] text-emerald-400">Plantão próprio</span>
                    </a>
                    <a
                      href="#compliance-esg"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('#compliance-esg', 'compliance-esg');
                      }}
                      className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/20 text-left block cursor-pointer"
                    >
                      <span className="text-[11px] font-semibold text-white/90 block">Compliance e ESG</span>
                      <span className="text-[9px] text-nc-warm/50">Sustentabilidade</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* 2. BENEFÍCIOS E PARCERIAS */}
            <a
              href="#beneficios"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('#beneficios', 'beneficios');
              }}
              className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-amber-400/40 transition-all text-white group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <CreditCard size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white tracking-wide">Benefícios & Parcerias</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">Ambiente Exclusivo</span>
                  </div>
                  <p className="text-[11px] text-nc-warm/60">Vantagens corporativas para colaboradores e entidades</p>
                </div>
              </div>
              <ArrowRight size={15} className="text-white/40 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
            </a>

            {/* 3. LAZER & TURISMO EXCLUSIVO */}
            <a
              href="#lazer"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('#lazer', 'lazer');
              }}
              className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-nc-orange/40 transition-all text-white group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-nc-orange">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white tracking-wide">Lazer & Roteiros Sob Medida</span>
                  </div>
                  <p className="text-[11px] text-nc-warm/60">Curadoria exclusiva e viagens personalizadas</p>
                </div>
              </div>
              <ArrowRight size={15} className="text-white/40 group-hover:text-nc-orange group-hover:translate-x-1 transition-all shrink-0" />
            </a>

            {/* 5. CONHECIMENTO NC (BLOG) */}
            <a
              href="#conhecimento"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('#conhecimento', 'blog');
              }}
              className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-blue-400/40 transition-all text-white group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <BookOpen size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white tracking-wide">Conhecimento NC</span>
                    <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">Hub Editorial</span>
                  </div>
                  <p className="text-[11px] text-nc-warm/60">Artigos, inteligência corporativa e melhores práticas</p>
                </div>
              </div>
              <ArrowRight size={15} className="text-white/40 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" />
            </a>

            {/* 6. QUEM SOMOS */}
            <a
              href="#quem-somos"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('#quem-somos', 'quem-somos');
              }}
              className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-slate-400/40 transition-all text-white group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-500/15 border border-slate-500/30 flex items-center justify-center text-slate-300">
                  <Building2 size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white tracking-wide">Quem Somos</span>
                  </div>
                  <p className="text-[11px] text-nc-warm/60">História, liderança e estrutura própria em Curitiba</p>
                </div>
              </div>
              <ArrowRight size={15} className="text-white/40 group-hover:text-slate-300 group-hover:translate-x-1 transition-all shrink-0" />
            </a>

            {/* 7. DÚVIDAS FREQUENTES (FAQ) */}
            <a
              href="#faq"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('#faq');
              }}
              className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-emerald-400/40 transition-all text-white group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white tracking-wide">Dúvidas Frequentes (FAQ)</span>
                  </div>
                  <p className="text-[11px] text-nc-warm/60">Respostas sobre SLA, implantação e ferramentas</p>
                </div>
              </div>
              <ArrowRight size={15} className="text-white/40 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0" />
            </a>

            {/* 8. ÁREA DO CLIENTE */}
            <a
              href="#area-cliente"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('#area-cliente', 'area-cliente');
              }}
              className="flex items-center justify-between p-3.5 rounded-2xl border border-nc-orange/30 bg-gradient-to-r from-nc-orange/15 to-transparent hover:border-nc-orange/60 transition-all text-white group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-nc-orange/20 border border-nc-orange/40 flex items-center justify-center text-nc-orange">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-nc-orange tracking-wide">Área do Cliente</span>
                    <span className="text-[10px] font-mono bg-nc-orange/30 text-white px-2 py-0.5 rounded font-bold">Portal Seguro</span>
                  </div>
                  <p className="text-[11px] text-nc-warm/70">Acesso a relatórios, bilhetes e sistema OBT</p>
                </div>
              </div>
              <ArrowRight size={15} className="text-nc-orange group-hover:translate-x-1 transition-all shrink-0" />
            </a>
          </div>

          {/* Fixed Bottom Action Bar */}
          <div className="shrink-0 p-4 bg-[#07090D]/95 backdrop-blur-md border-t border-white/10 flex flex-col gap-2.5 z-10">
            <button 
              onClick={(e) => {
                e.preventDefault();
                navigateTo('#diagnostico');
              }}
              className="w-full inline-flex justify-center items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] text-white rounded-xl text-xs font-bold uppercase tracking-[0.1em] shadow-lg shadow-red-900/30 active:scale-[0.99] transition-all cursor-pointer"
            >
              <span>{ctaLabel}</span>
              <ArrowRight size={15} />
            </button>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="https://wa.me/554132811153?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20NC%20Turismo%20e%20gostaria%20de%20informa%C3%A7%C3%B5es."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold hover:bg-emerald-500/20 transition-all cursor-pointer"
              >
                <MessageSquare size={14} />
                <span>WhatsApp 24h</span>
              </a>
              <a
                href="tel:04132811153"
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-nc-warm/80 font-semibold hover:bg-white/10 transition-all cursor-pointer"
              >
                <Phone size={14} />
                <span>(41) 3281-1153</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
