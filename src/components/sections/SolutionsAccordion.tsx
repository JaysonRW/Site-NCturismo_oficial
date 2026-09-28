import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ShieldCheck, 
  Cpu, 
  Headphones, 
  Leaf, 
  BarChart3, 
  ChevronRight, 
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  HelpCircle
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface SolutionItem {
  id: string;
  number: string;
  title: string;
  category: string;
  content: string;
  highlights: string[];
  badge: string;
  badgeSub: string;
  image: string;
  icon: React.ElementType;
}

const solutions: SolutionItem[] = [
  {
    id: 'planejamento',
    number: '01',
    title: 'Planejamento e política de viagens',
    category: 'Governança & Políticas',
    content: 'Parametrizamos as regras da sua empresa no sistema. Aprovações multiníveis, tetos de gastos e restrições são validados automaticamente, garantindo conformidade antes do orçamento ser comprometido.',
    highlights: [
      'Validação automática de alçadas e centros de custo',
      'Bloqueio preventivo de desvios e compras fora de política',
      'Fluxos personalizados de aprovação por diretoria ou filial'
    ],
    badge: '100% Governança',
    badgeSub: 'Auditoria pré-emissão em tempo real',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    icon: ShieldCheck
  },
  {
    id: 'tecnologia',
    number: '02',
    title: 'Tecnologia e integrações corporativas',
    category: 'Ecossistema Digital & ERP',
    content: 'Conectamos a gestão de viagens ao ERP e RH da sua empresa (SAP, TOTVS, Senior, Workday). Plataforma unificada que sincroniza solicitações, despesas e relatórios em tempo real.',
    highlights: [
      'Conectores diretos para os principais ERPs e RHs',
      'Self-booking intuitivo disponível via Web e App Mobile',
      'Autenticação corporativa segura via Single Sign-On (SSO)'
    ],
    badge: 'Integração em Tempo Real',
    badgeSub: 'APIs abertas e sincronização contínua',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    icon: Cpu
  },
  {
    id: 'atendimento',
    number: '03',
    title: 'Atendimento consultivo 24h humanizado',
    category: 'Suporte Humanizado VIP',
    content: 'Consultores seniores dedicados e prontos para atuar em remarcações, cancelamentos de emergência e crises em qualquer fuso horário. Não deixamos sua liderança desamparada com robôs.',
    highlights: [
      'Tempo médio de resposta humano menor que 15 segundos',
      'Plantão executivo bilíngue ininterrupto 365 dias/ano',
      'Gestão proativa de cancelamentos e no-shows aéreos'
    ],
    badge: 'SLA < 15 segundos',
    badgeSub: 'Especialistas seniores sem filas',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    icon: Headphones
  },
  {
    id: 'compliance',
    number: '04',
    title: 'Compliance, ESG e sustentabilidade',
    category: 'Governança & Responsabilidade',
    content: 'Garantimos rastreabilidade total de passageiros e despesas, alinhamento rigoroso à LGPD e relatórios consolidados de emissão de carbono para apoiar os compromissos ESG corporativos.',
    highlights: [
      'Cálculo e relatórios detalhados de emissão de CO₂ por rota',
      'Rastreamento em tempo real da localização de viajantes',
      'Adequação jurídica e de dados conforme a LGPD'
    ],
    badge: 'ESG & LGPD Certificado',
    badgeSub: 'Rastreabilidade e dados sustentáveis',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    icon: Leaf
  },
  {
    id: 'bi',
    number: '05',
    title: 'BI analítico e relatórios estratégicos',
    category: 'Inteligência Financeira',
    content: 'Transformamos dados brutos em inteligência financeira para tomadas de decisão. Dashboards executivos customizados para acompanhar savings, principais rotas e consolidar negociações.',
    highlights: [
      'Dashboard dinâmico de savings obtidos vs. orçado',
      'Mapeamento de rotas e hotéis para negociação de tarifas acordo',
      'Relatórios gerenciais exportáveis em múltiplos formatos'
    ],
    badge: 'Média de 22% em Savings',
    badgeSub: 'Inteligência para negociações de volume',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    icon: BarChart3
  }
];

export const SolutionsAccordion: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const floatingBadgeRef = useRef<HTMLDivElement>(null);
  const scrollTriggerInstanceRef = useRef<ScrollTrigger | null>(null);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemProgress, setItemProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);

  // Accordion items element refs for GSAP hover interactions
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numberRefs = useRef<(HTMLDivElement | null)[]>([]);
  const arrowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;

    const mm = gsap.matchMedia();

    // 1. Initial ScrollTrigger Section Reveal: subtle reveal when section enters viewport
    const revealTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });

    revealTl
      .fromTo('.sa-reveal-kicker', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      )
      .fromTo('.sa-reveal-title', 
        { opacity: 0, y: 25 }, 
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 
        '-=0.4'
      )
      .fromTo('.sa-reveal-subtitle', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 
        '-=0.4'
      )
      .fromTo('.sa-accordion-item', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }, 
        '-=0.3'
      )
      .fromTo('.sa-mockup-reveal', 
        { opacity: 0, scale: 0.94, rotationY: -6 }, 
        { opacity: 1, scale: 1, rotationY: 0, duration: 0.9, ease: 'power3.out' }, 
        '-=0.5'
      );

    // Floating idle animation for preview badge
    if (floatingBadgeRef.current) {
      gsap.to(floatingBadgeRef.current, {
        y: -6,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    // 2. Desktop Pinned Scroll Choreography
    mm.add('(min-width: 1024px)', () => {
      const totalSteps = solutions.length;
      
      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${totalSteps * 700}`, // 3500px total for buttery-smooth scrub
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const stepSize = 1 / totalSteps;
          const currentIndex = Math.min(
            Math.floor(progress * totalSteps),
            totalSteps - 1
          );
          
          setActiveIndex(currentIndex);

          // Calculate internal progress within the active step (0 to 1)
          const currentStepProgress = Math.min(
            Math.max((progress - (currentIndex * stepSize)) / stepSize, 0),
            1
          );
          setItemProgress(currentStepProgress);
        }
      });

      scrollTriggerInstanceRef.current = st;
    });

    // 3. Mobile View: unpinned smooth transitions
    mm.add('(max-width: 1023px)', () => {
      scrollTriggerInstanceRef.current = null;
    });

  }, { scope: containerRef });

  // GSAP Image Crossfade & Mockup Reaction when activeIndex updates
  useEffect(() => {
    // Crossfade images
    solutions.forEach((_, i) => {
      const imgLayer = document.querySelector(`.sa-img-layer-${i}`);
      const imgEl = document.querySelector(`.sa-img-layer-${i} img`);
      
      if (imgLayer && imgEl) {
        if (i === activeIndex) {
          gsap.to(imgLayer, {
            opacity: 1,
            zIndex: 10,
            duration: 0.6,
            ease: 'power2.out'
          });
          gsap.fromTo(imgEl, 
            { scale: 1.08 },
            { scale: 1, duration: 1.2, ease: 'power2.out' }
          );
        } else {
          gsap.to(imgLayer, {
            opacity: 0,
            zIndex: 1,
            duration: 0.5,
            ease: 'power2.inOut'
          });
        }
      }
    });

    // Pulse animation on the floating badge when step changes
    if (floatingBadgeRef.current) {
      gsap.fromTo(floatingBadgeRef.current,
        { scale: 0.92, opacity: 0.7 },
        { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.5)' }
      );
    }
  }, [activeIndex]);

  // Subtle GSAP Hover Animation Handlers for Accordion Items
  const handleItemMouseEnter = (index: number) => {
    const itemEl = itemRefs.current[index];
    const numberEl = numberRefs.current[index];
    const arrowEl = arrowRefs.current[index];

    if (!itemEl) return;

    // Hover translate on container
    gsap.to(itemEl, {
      x: 6,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    // Number badge subtle scale and glow
    if (numberEl) {
      gsap.to(numberEl, {
        scale: 1.1,
        duration: 0.2,
        ease: 'back.out(2)',
        overwrite: 'auto'
      });
    }

    // Arrow push forward
    if (arrowEl) {
      gsap.to(arrowEl, {
        x: 4,
        duration: 0.2,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  };

  const handleItemMouseLeave = (index: number) => {
    const itemEl = itemRefs.current[index];
    const numberEl = numberRefs.current[index];
    const arrowEl = arrowRefs.current[index];

    if (!itemEl) return;

    // Reset container translation
    gsap.to(itemEl, {
      x: 0,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    // Reset number badge
    if (numberEl) {
      gsap.to(numberEl, {
        scale: 1,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }

    // Reset arrow
    if (arrowEl) {
      gsap.to(arrowEl, {
        x: 0,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  };

  // Click on Accordion Item to jump seamlessly
  const handleSelectSolution = (index: number) => {
    setActiveIndex(index);
    setItemProgress(0);

    const st = scrollTriggerInstanceRef.current;
    if (st && isDesktop) {
      const totalSteps = solutions.length;
      const progressTarget = (index + 0.15) / totalSteps;
      const targetScroll = st.start + progressTarget * (st.end - st.start);
      
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  // Subtle 3D Tilt Hover Animation on Mockup Container
  const handleMockupMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mockupRef.current || !isDesktop) return;
    const rect = mockupRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 6;

    gsap.to(mockupRef.current, {
      rotateX,
      rotateY,
      duration: 0.35,
      ease: 'power2.out',
      transformPerspective: 1200
    });
  };

  const handleMockupMouseLeave = () => {
    if (!mockupRef.current || !isDesktop) return;
    gsap.to(mockupRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power2.out'
    });
  };

  const activeSolution = solutions[activeIndex] || solutions[0];
  const ActiveIcon = activeSolution.icon;

  return (
    <section 
      id="solucoes" 
      ref={containerRef} 
      className="relative w-full min-h-screen lg:h-screen overflow-hidden bg-white text-[#0F172A]"
      aria-label="Soluções Corporativas NC Turismo"
    >
      {/* Background Soft Transition Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#F8F9FA] via-white to-white pointer-events-none" />

      {/* Decorative Grid Mesh */}
      <div className="absolute inset-0 z-0 opacity-[0.4] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Main Content Layout */}
      <div className="relative z-10 max-w-[1536px] h-full mx-auto px-6 md:px-12 lg:px-16 flex flex-col lg:flex-row items-center justify-between py-16 lg:py-0">
        
        {/* LEFT COLUMN: Header & Interactive Accordion Items */}
        <div className="w-full lg:w-[52%] flex flex-col justify-center lg:pr-8 mb-10 lg:mb-0">
          
          {/* Eyebrow Kicker & Link to Dedicated FAQ */}
          <div className="sa-reveal-kicker mb-3 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-nc-orange animate-pulse" />
              Soluções Integradas B2B
            </span>

            <a
              href="#faq"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('faq');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-amber-100/70 border border-slate-200/80 hover:border-amber-300 text-slate-700 hover:text-amber-900 text-xs font-medium transition-all duration-200 cursor-pointer shadow-xs group"
              title="Acessar sessão de Perguntas Frequentes (FAQ)"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#DB8902]" />
              <span>Dúvidas Frequentes (FAQ) &darr;</span>
            </a>
          </div>

          {/* Section Main Title */}
          <h2 className="sa-reveal-title text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-bold leading-[1.15] tracking-tight text-[#0F172A] mb-3">
            Gestão inteligente para sua corporação.
          </h2>

          <p className="sa-reveal-subtitle text-slate-500 text-sm sm:text-base md:text-lg mb-6 max-w-xl font-normal">
            Controle financeiro, parametrização de políticas e atendimento 24 horas reunidos em uma infraestrutura corporativa completa.
          </p>

          {/* ACCORDION ITEMS LIST */}
          <div className="w-full space-y-2.5 max-w-xl" role="tablist">
            {solutions.map((item, index) => {
              const isActive = index === activeIndex;
              const ItemIcon = item.icon;

              return (
                <div
                  key={item.id}
                  ref={(el) => { itemRefs.current[index] = el; }}
                  onMouseEnter={() => handleItemMouseEnter(index)}
                  onMouseLeave={() => handleItemMouseLeave(index)}
                  onClick={() => handleSelectSolution(index)}
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectSolution(index);
                    }
                  }}
                  className={`sa-accordion-item group relative rounded-2xl cursor-pointer transition-all duration-300 border select-none ${
                    isActive 
                      ? 'bg-amber-50/60 border-amber-300/80 shadow-[0_4px_20px_rgba(219,137,2,0.08)]' 
                      : 'bg-white/80 hover:bg-slate-50/90 border-slate-200/70 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  {/* Active indicator bar along the left edge */}
                  <div 
                    className={`absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full transition-all duration-300 ${
                      isActive ? 'bg-gradient-to-b from-[#DB8902] to-[#FFC857] opacity-100' : 'bg-transparent opacity-0'
                    }`} 
                  />

                  {/* Header Trigger */}
                  <div className="px-5 py-3.5 flex items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Number Badge with GSAP ref */}
                      <div 
                        ref={(el) => { numberRefs.current[index] = el; }}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-colors shrink-0 ${
                          isActive
                            ? 'bg-[#DB8902] text-white shadow-[0_0_12px_rgba(219,137,2,0.35)]'
                            : 'bg-slate-100 text-slate-500 group-hover:text-slate-800 group-hover:bg-slate-200/80'
                        }`}
                      >
                        {item.number}
                      </div>

                      {/* Title & Category */}
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                            isActive ? 'text-[#DB8902]' : 'text-slate-400 group-hover:text-slate-600'
                          }`}>
                            {item.category}
                          </span>
                        </div>
                        <h3 className={`text-sm sm:text-base font-semibold transition-colors truncate ${
                          isActive ? 'text-[#0F172A]' : 'text-slate-700 group-hover:text-[#0F172A]'
                        }`}>
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    {/* Right Action / Chevron Indicator */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isActive && (
                        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-900 border border-amber-200">
                          Ativo
                        </span>
                      )}
                      <div 
                        ref={(el) => { arrowRefs.current[index] = el; }}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 ${
                          isActive 
                            ? 'rotate-90 bg-amber-200/60 text-amber-900' 
                            : 'text-slate-400 group-hover:text-slate-700 bg-slate-100/60 group-hover:bg-slate-200/60'
                        }`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>

                  </div>

                  {/* Expanded Body Content (Smooth Transition) */}
                  <div 
                    className={`overflow-hidden transition-all duration-400 ease-out px-5 ${
                      isActive ? 'max-h-[340px] pb-4 pt-1 opacity-100' : 'max-h-0 pb-0 pt-0 opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="border-t border-amber-200/60 pt-3">
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-3">
                        {item.content}
                      </p>

                      {/* Key highlights / bullets */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 mb-3">
                        {item.highlights.slice(0, 2).map((highlight, hIdx) => (
                          <div key={hIdx} className="flex items-start gap-1.5 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#DB8902] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{highlight}</span>
                          </div>
                        ))}
                      </div>

                      {/* Scrubbing Segment Progress Bar */}
                      <div className="w-full bg-amber-200/40 h-1 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#DB8902] to-[#FFC857] transition-all duration-150 ease-out"
                          style={{ width: `${Math.round(itemProgress * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Stepper Navigation Dots */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium mr-2">
              Solução {activeIndex + 1} de {solutions.length}
            </span>
            {solutions.map((_, i) => (
              <button
                key={i}
                onClick={() => handleSelectSolution(i)}
                aria-label={`Ver solução ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex 
                    ? 'w-8 bg-[#DB8902]' 
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive 3D Showcase Card */}
        <div className="w-full lg:w-[48%] flex items-center justify-center relative">
          
          <div 
            ref={mockupRef}
            onMouseMove={handleMockupMouseMove}
            onMouseLeave={handleMockupMouseLeave}
            className="sa-mockup-reveal relative w-full max-w-[560px] aspect-[4/3] rounded-[24px] lg:rounded-[32px] overflow-hidden bg-slate-900 border border-slate-200/80 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.25)] transition-shadow duration-300 group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Background Ambient Glow */}
            <div className="absolute -inset-1 bg-gradient-to-tr from-amber-500/20 via-transparent to-orange-500/20 opacity-40 blur-xl pointer-events-none" />

            {/* Render Image Layers for smooth crossfades */}
            {solutions.map((item, index) => (
              <div 
                key={`img-${item.id}`} 
                className={`sa-img-layer-${index} absolute inset-0 w-full h-full transition-opacity duration-500`}
                style={{ opacity: index === 0 ? 1 : 0 }}
              >
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover select-none"
                  loading="lazy"
                />
                {/* Gradient vignette for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/30 to-black/20" />
              </div>
            ))}

            {/* Top Bar Glass Overlay with Active Category Pill */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
                <ActiveIcon className="w-3.5 h-3.5 text-[#FFC857]" />
                <span>{activeSolution.category}</span>
              </div>

              <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-mono font-medium">
                0{activeIndex + 1} / 0{solutions.length}
              </div>
            </div>

            {/* Bottom Floating Interactive Card */}
            <div 
              ref={floatingBadgeRef}
              className="absolute bottom-5 left-5 right-5 z-20 bg-slate-900/85 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-xl text-white pointer-events-none"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
                    {activeSolution.badge}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-300 font-medium">
                  <span>NC Enterprise</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                </div>
              </div>

              <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                {activeSolution.title}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                {activeSolution.badgeSub}
              </p>
            </div>

            {/* Interactive Shine Highlight overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          </div>

        </div>

      </div>
    </section>
  );
};
