import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HistoryTimeline } from './HistoryTimeline';
import { 
  Building2, 
  Users, 
  Headphones, 
  Cpu, 
  ArrowRight, 
  ArrowLeft,
  Briefcase, 
  Receipt, 
  Car, 
  CalendarDays, 
  Compass, 
  ShieldCheck, 
  MessageCircle, 
  ChevronRight, 
  MapPin, 
  Sparkles, 
  Award, 
  Clock, 
  CheckCircle2, 
  HeartHandshake
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface QuemSomosViewProps {
  onBackToHome: () => void;
  onOpenSolutions?: () => void;
  onOpenLegal?: (tab: 'privacidade' | 'beneficios' | 'termos') => void;
}

export const QuemSomosView: React.FC<QuemSomosViewProps> = ({ 
  onBackToHome, 
  onOpenSolutions,
  onOpenLegal 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const diffSliderRef = useRef<HTMLDivElement>(null);
  const ecoSliderRef = useRef<HTMLDivElement>(null);
  const [diffScrollPos, setDiffScrollPos] = useState(0);
  const [ecoScrollPos, setEcoScrollPos] = useState(0);

  // GSAP Entrance and Scroll Animations
  useGSAP(() => {
    if (!containerRef.current) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 1. Hero Entrance
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.qs-badge', 
        { y: -20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8 }, 
        0.1
      );

      tl.fromTo('.qs-hero-title', 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.15 }, 
        0.2
      );

      tl.fromTo('.qs-hero-desc', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1 }, 
        0.5
      );

      tl.fromTo('.qs-hero-cta', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, 
        0.7
      );

      tl.fromTo('.qs-hero-stat-card', 
        { scale: 0.95, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 1.2 }, 
        0.6
      );

      // 3. Manifesto / Quote
      gsap.fromTo('.qs-quote-card',
        { scale: 0.94, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          scrollTrigger: {
            trigger: '.qs-quote-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // 4. Differentials Cards
      gsap.fromTo('.qs-diff-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.qs-diff-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // 5. Ecosystem Cards
      gsap.fromTo('.qs-eco-card',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.qs-eco-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // 6. Trust Section Reveal
      gsap.fromTo('.qs-trust-content',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: '.qs-trust-section',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }, { scope: containerRef });

  const differentials = [
    {
      num: '01',
      title: 'Estrutura física',
      tagline: 'Presença real, atendimento próximo',
      desc: 'Uma sede preparada para receber clientes, apresentar soluções e reforçar a solidez de uma empresa com história e presença no mercado.',
      icon: <Building2 className="w-8 h-8 text-nc-orange" />,
      accentColor: 'from-[#DB8902]/20 to-transparent',
      borderColor: 'border-nc-orange/30',
      badge: 'Solidez & Presença'
    },
    {
      num: '02',
      title: 'Equipe experiente',
      tagline: 'Pessoas preparadas para orientar',
      desc: 'Profissionais preparados para apoiar viajantes e empresas em diferentes necessidades, com atenção, agilidade e conhecimento do setor.',
      icon: <Users className="w-8 h-8 text-amber-400" />,
      accentColor: 'from-amber-500/20 to-transparent',
      borderColor: 'border-amber-500/30',
      badge: 'Expertise Humana'
    },
    {
      num: '03',
      title: 'Atendimento consultivo',
      tagline: 'Entender antes de executar',
      desc: 'Mais do que realizar reservas, buscamos compreender objetivos, perfis de viajantes, políticas internas e oportunidades de melhoria.',
      icon: <Headphones className="w-8 h-8 text-orange-400" />,
      accentColor: 'from-orange-500/20 to-transparent',
      borderColor: 'border-orange-500/30',
      badge: 'Consultoria Ativa'
    },
    {
      num: '04',
      title: 'Tecnologia e gestão',
      tagline: 'Controle, dados e eficiência',
      desc: 'Plataformas, processos e soluções que apoiam reservas, despesas, mobilidade, relatórios, acompanhamento e gestão das viagens.',
      icon: <Cpu className="w-8 h-8 text-red-400" />,
      accentColor: 'from-red-500/20 to-transparent',
      borderColor: 'border-red-500/30',
      badge: 'Dados & Eficiência'
    }
  ];

  const ecosystem = [
    {
      title: 'Viagens corporativas',
      desc: 'Gestão, reservas, controle, atendimento consultivo e suporte para empresas.',
      icon: <Briefcase className="w-7 h-7 text-nc-orange" />,
      badge: 'B2B & Governança',
      highlight: 'SLA ágil e emissão 24/7'
    },
    {
      title: 'Travel & Expense',
      desc: 'Soluções para organizar viagens, despesas, aprovações e relatórios.',
      icon: <Receipt className="w-7 h-7 text-amber-400" />,
      badge: 'Controle Financeiro',
      highlight: 'Compliance e reconciliação'
    },
    {
      title: 'Mobilidade corporativa',
      desc: 'Traslados, deslocamentos, locações e apoio para jornadas profissionais.',
      icon: <Car className="w-7 h-7 text-orange-400" />,
      badge: 'Logística Terrestre',
      highlight: 'Locações e transfers executivos'
    },
    {
      title: 'Eventos e grupos',
      desc: 'Apoio para viagens de incentivo, eventos, grupos e necessidades especiais.',
      icon: <CalendarDays className="w-7 h-7 text-rose-400" />,
      badge: 'Encontros & Convenções',
      highlight: 'Coordenação ponta a ponta'
    },
    {
      title: 'Lazer e experiências',
      desc: 'Viagens nacionais e internacionais com cuidado, personalização e segurança.',
      icon: <Compass className="w-7 h-7 text-emerald-400" />,
      badge: 'Personalizado',
      highlight: 'Roteiros exclusivos e seguros'
    },
    {
      title: 'Atendimento especializado',
      desc: 'Suporte próximo, relacionamento e acompanhamento antes, durante e depois da viagem.',
      icon: <HeartHandshake className="w-7 h-7 text-blue-400" />,
      badge: 'Plantão Dedicado',
      highlight: 'Acompanhamento integral'
    }
  ];

  const scrollSlider = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (!ref.current) return;
    const scrollAmount = 380;
    ref.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const whatsappUrl = "https://wa.me/554133221000?text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20com%20a%20equipe%20da%20NC%20Turismo!";

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-nc-space text-nc-warm">
      
      {/* Decorative Brand Gradient Background Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-gradient-to-b from-[#DB8902]/15 via-rose-950/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* =========================================================================
          HERO SECTION: 38 ANOS CONECTANDO PESSOAS
         ========================================================================= */}
      <section className="relative pt-36 md:pt-44 pb-20 md:pb-28 px-6 md:px-12 lg:px-20 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-8">
            
            {/* Breadcrumb / Top Tag */}
            <div className="qs-badge inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-nc-orange text-xs font-bold tracking-[0.18em] uppercase">NC TURISMO</span>
              <span className="text-white/30 text-xs">→</span>
              <span className="text-white/80 text-xs font-medium tracking-[0.14em] uppercase">QUEM SOMOS</span>
            </div>

            {/* Giant Title */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1 rounded-full bg-nc-orange/20 border border-nc-orange/30 text-nc-orange text-xs md:text-sm font-bold uppercase tracking-widest">
                  Tradição & Vanguarda
                </span>
                <span className="text-xs uppercase tracking-wider text-nc-warm/50 font-mono">1989 — 2027</span>
              </div>
              <h1 className="qs-hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-white leading-[1.08] tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-nc-orange via-amber-300 to-white">
                  38 anos
                </span>{' '}
                conectando pessoas, empresas e destinos.
              </h1>
            </div>

            {/* Subtitle / Paragraph */}
            <p className="qs-hero-desc text-base sm:text-lg md:text-xl text-nc-warm/75 font-normal leading-relaxed max-w-2xl">
              Uma agência tradicional de Curitiba, com estrutura física, equipe experiente, atendimento consultivo e soluções completas para viagens corporativas, lazer, eventos e mobilidade.
            </p>

            {/* CTAs */}
            <div className="qs-hero-cta flex flex-wrap items-center gap-4 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-nc-orange to-[#b36e00] text-nc-space font-display font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_35px_rgba(219,137,2,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <MessageCircle size={18} className="fill-current" />
                <span>Falar com a NC Turismo</span>
              </a>

              <a
                href="#solucoes"
                onClick={(e) => {
                  e.preventDefault();
                  if (onOpenSolutions) {
                    onOpenSolutions();
                  } else {
                    window.location.hash = '#solucoes';
                  }
                }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-display font-bold text-sm tracking-wider uppercase hover:border-white/20 transition-all group"
              >
                <span>Conhecer soluções</span>
                <ArrowRight size={16} className="text-nc-orange group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Micro Highlights */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl md:text-3xl font-display font-bold text-white">38+</div>
                <div className="text-xs text-nc-warm/60 uppercase tracking-wider mt-0.5">Anos de Mercado</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-display font-bold text-white">Sede Própria</div>
                <div className="text-xs text-nc-warm/60 uppercase tracking-wider mt-0.5">Curitiba / PR</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-display font-bold text-nc-orange">100%</div>
                <div className="text-xs text-nc-warm/60 uppercase tracking-wider mt-0.5">Consultivo & Humano</div>
              </div>
            </div>

          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-5">
            <div className="qs-hero-stat-card relative rounded-3xl p-1 bg-gradient-to-b from-white/15 via-white/5 to-transparent shadow-2xl">
              <div className="relative rounded-[22px] bg-nc-surface border border-white/10 p-8 sm:p-10 overflow-hidden space-y-8">
                
                {/* Visual Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-nc-orange/15 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-nc-orange/20 border border-nc-orange/40 flex items-center justify-center text-nc-orange">
                    <Building2 size={28} />
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono uppercase tracking-widest text-nc-warm/70">
                    Sede em Curitiba
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-display font-bold text-white">
                    Estrutura física e relacionamento de verdade
                  </h3>
                  <p className="text-sm text-nc-warm/70 leading-relaxed">
                    Em um mercado massificado e impessoal de plataformas anônimas, preservamos nossa sede aberta, equipe de especialistas sênior e atendimento personalizado com plantão dedicado.
                  </p>
                </div>

                {/* Badges List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <CheckCircle2 size={18} className="text-nc-orange shrink-0" />
                    <span className="text-xs sm:text-sm text-white/90 font-medium">Recepção executiva e salas de alinhamento estratégico</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <CheckCircle2 size={18} className="text-nc-orange shrink-0" />
                    <span className="text-xs sm:text-sm text-white/90 font-medium">Equipes dedicadas para contas corporativas e lazer</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <CheckCircle2 size={18} className="text-nc-orange shrink-0" />
                    <span className="text-xs sm:text-sm text-white/90 font-medium">Conectividade direta com companhias aéreas e redes hoteleiras globais</span>
                  </div>
                </div>

                {/* Quote Stamp */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#DB8902]/20 to-transparent border-l-4 border-nc-orange">
                  <p className="text-xs italic text-nc-warm/80">
                    "Tradição não é fazer as coisas como antigamente; é honrar nossos valores de proximidade enquanto inovamos na tecnologia."
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          HISTÓRIA: DESDE 1989 (INTERACTIVE GSAP SCROLLTRIGGER TIMELINE)
         ========================================================================= */}
      <HistoryTimeline onContactClick={() => window.open(whatsappUrl, '_blank')} />

      {/* =========================================================================
          MANIFESTO: WE ARE TRAVEL BY NC TURISMO
         ========================================================================= */}
      <section className="qs-quote-section relative py-24 md:py-32 px-6 md:px-12 lg:px-20 max-w-[1440px] mx-auto">
        <div className="qs-quote-card relative rounded-3xl md:rounded-[36px] p-8 md:p-16 lg:p-20 overflow-hidden bg-gradient-to-br from-[#1c1c1f] via-[#241712] to-[#121214] border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
          
          {/* Subtle Orange Accent Top Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-nc-orange to-amber-300" />
          
          {/* Background Ambient Glow */}
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#DB8902]/20 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center space-y-8">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold tracking-[0.2em] text-nc-orange uppercase">
              <Sparkles size={14} />
              <span>We Are Travel by NC Turismo</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-snug">
              Mais do que uma agência de viagens.
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-nc-warm/80 leading-relaxed font-normal">
              Para a NC Turismo, viajar vai além do deslocamento. É mobilidade, experiência, relacionamento, tecnologia, gestão e suporte.
            </p>

            {/* Highlighted Quote Box */}
            <div className="py-6 px-8 rounded-2xl bg-black/40 border border-nc-orange/30 shadow-inner">
              <p className="text-lg sm:text-xl md:text-2xl font-display font-medium text-white italic leading-relaxed">
                “Conectamos pessoas, empresas e oportunidades por meio de viagens mais seguras, eficientes e humanas.”
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs md:text-sm text-nc-warm/60">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-nc-orange" /> Mobilidade Inteligente
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-nc-orange" /> Gestão de Custos & SLA
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-nc-orange" /> Atendimento 100% Consultivo
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          PILARES: O QUE NOS DIFERENCIA
         ========================================================================= */}
      <section className="qs-diff-section relative py-20 md:py-28 bg-nc-surface/40 border-t border-white/5">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3 max-w-2xl">
              <span className="text-nc-orange text-xs font-bold uppercase tracking-[0.16em]">
                O que nos diferencia
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
                Estrutura, equipe e atendimento para entregar confiança.
              </h2>
              <p className="text-nc-warm/70 text-sm sm:text-base">
                Conheça os quatro pilares essenciais da atuação da NC Turismo.
              </p>
            </div>

            {/* Slider Navigation Arrows */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollSlider(diffSliderRef, 'left')}
                aria-label="Deslizar para a esquerda"
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white hover:text-nc-orange transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={() => scrollSlider(diffSliderRef, 'right')}
                aria-label="Deslizar para a direita"
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white hover:text-nc-orange transition-colors"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Cards Carousel / Grid */}
          <div 
            ref={diffSliderRef}
            className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {differentials.map((item, idx) => (
              <div
                key={idx}
                className="qs-diff-card min-w-[300px] sm:min-w-[340px] md:min-w-[360px] max-w-[380px] snap-start flex-1 rounded-3xl p-8 bg-nc-surface border border-white/10 hover:border-nc-orange/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group shadow-lg"
              >
                {/* Top Subtle Glow */}
                <div className={`absolute top-0 right-0 w-44 h-44 bg-gradient-to-b ${item.accentColor} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

                <div className="space-y-6">
                  {/* Number & Badge */}
                  <div className="flex items-center justify-between">
                    <span className="font-display font-extrabold text-2xl text-nc-orange font-mono">
                      {item.num}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-nc-warm/80 uppercase tracking-wider">
                      {item.badge}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-nc-orange/40 transition-all duration-300">
                    {item.icon}
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-display font-bold text-white group-hover:text-nc-orange transition-colors">
                      {item.title}
                    </h3>
                    <h4 className="text-sm font-semibold text-nc-warm/90">
                      {item.tagline}
                    </h4>
                    <p className="text-xs sm:text-sm text-nc-warm/70 leading-relaxed pt-2">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-2 text-xs text-nc-orange font-semibold">
                  <span>Pilar fundamental</span>
                  <CheckCircle2 size={14} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-nc-warm/50 pt-4 uppercase tracking-widest">
            <span>← deslize para navegar →</span>
          </div>

        </div>
      </section>

      {/* =========================================================================
          ECOSSISTEMA NC TURISMO: SOLUÇÕES COMPLETAS
         ========================================================================= */}
      <section className="qs-eco-section relative py-20 md:py-28 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <span className="text-nc-orange text-xs font-bold uppercase tracking-[0.16em]">
              Ecossistema NC Turismo
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
              Soluções completas para diferentes jornadas.
            </h2>
            <p className="text-nc-warm/70 text-sm sm:text-base">
              Conheça as principais frentes de atuação desenhadas para simplificar a rotina da sua empresa e dos seus viajantes.
            </p>
          </div>

          {/* Slider Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollSlider(ecoSliderRef, 'left')}
              aria-label="Deslizar soluções para a esquerda"
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white hover:text-nc-orange transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => scrollSlider(ecoSliderRef, 'right')}
              aria-label="Deslizar soluções para a direita"
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white hover:text-nc-orange transition-colors"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Eco Cards Slider */}
        <div 
          ref={ecoSliderRef}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {ecosystem.map((sol, idx) => (
            <div
              key={idx}
              className="qs-eco-card min-w-[290px] sm:min-w-[320px] md:min-w-[350px] max-w-[360px] snap-start flex-1 rounded-3xl p-7 bg-nc-surface border border-white/10 hover:border-nc-orange/40 transition-all duration-300 flex flex-col justify-between group shadow-lg"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {sol.icon}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-nc-warm/70 uppercase tracking-wider">
                    {sol.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-display font-bold text-white group-hover:text-nc-orange transition-colors">
                    {sol.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-nc-warm/75 leading-relaxed">
                    {sol.desc}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-nc-orange font-medium">{sol.highlight}</span>
                <ChevronRight size={16} className="text-nc-warm/40 group-hover:text-nc-orange group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-nc-warm/50 pt-4 uppercase tracking-widest">
          <span>← deslize para navegar →</span>
        </div>

      </section>

      {/* =========================================================================
          PRESENÇA E CONFIANÇA & CTA FINAL
         ========================================================================= */}
      <section className="qs-trust-section relative py-20 md:py-32 border-t border-white/5 bg-gradient-to-b from-nc-space via-nc-surface to-nc-space">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          
          <div className="qs-trust-content grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-nc-orange/15 border border-nc-orange/30 text-nc-orange text-xs font-bold uppercase tracking-widest">
                <ShieldCheck size={16} />
                <span>Presença e confiança</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                Confiança também se constrói mostrando quem somos.
              </h2>

              <p className="text-base sm:text-lg text-nc-warm/80 leading-relaxed">
                A NC Turismo acredita que sua estrutura, sua equipe e seus bastidores fazem parte da experiência entregue aos clientes. Mostrar nossa presença e nossa rotina é uma forma de aproximar pessoas da marca e reforçar a credibilidade construída ao longo de décadas.
              </p>

              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <p className="text-sm md:text-base font-medium text-white italic">
                  “Em um mercado cada vez mais digital, seguimos valorizando relacionamento, presença, confiança e cuidado em cada detalhe.”
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-nc-orange text-nc-space font-display font-bold text-sm tracking-wider uppercase hover:bg-amber-400 transition-all shadow-lg"
                >
                  <MessageCircle size={18} className="fill-current" />
                  <span>Falar com nosso time</span>
                </a>

                <button
                  onClick={onBackToHome}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-display font-bold text-sm tracking-wider uppercase transition-all"
                >
                  <span>Voltar para a página inicial</span>
                </button>
              </div>

            </div>

            {/* Location & Contact Widget Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl p-8 bg-nc-surface border border-white/10 shadow-2xl space-y-6">
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-nc-orange/20 border border-nc-orange/30 flex items-center justify-center text-nc-orange">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Sede NC Turismo</h4>
                    <p className="text-xs text-nc-warm/60">Curitiba, Paraná · Brasil</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-nc-warm/80 divide-y divide-white/5">
                  <div className="pt-2 flex justify-between">
                    <span className="text-nc-warm/50">Fundação:</span>
                    <span className="font-medium text-white">02 de janeiro de 1989</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-nc-warm/50">Fundadora:</span>
                    <span className="font-medium text-white">Neusa Culpi</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-nc-warm/50">Atuação:</span>
                    <span className="font-medium text-white">Nacional e Internacional</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-nc-warm/50">Atendimento:</span>
                    <span className="font-medium text-white">Presencial e Digital 24/7</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs text-nc-warm/70">
                  <span>Pronto para otimizar suas viagens?</span>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-nc-orange hover:underline font-bold">
                    Converse agora →
                  </a>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          INSTITUTIONAL FOOTER
         ========================================================================= */}
      <footer className="border-t border-white/5 bg-nc-space py-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="NC Turismo" className="w-[140px] h-auto object-contain" />
            <span className="text-xs text-nc-warm/40 hidden md:inline">| We Are Travel · 38 anos de história</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-nc-warm/60">
            <button 
              onClick={() => onOpenLegal && onOpenLegal('privacidade')}
              className="hover:text-nc-orange transition-colors"
            >
              Privacidade
            </button>
            <button 
              onClick={() => onOpenLegal && onOpenLegal('beneficios')}
              className="hover:text-nc-orange transition-colors"
            >
              Benefícios em Viagens
            </button>
            <button 
              onClick={() => onOpenLegal && onOpenLegal('termos')}
              className="hover:text-nc-orange transition-colors"
            >
              Termos de Uso
            </button>
          </div>

          <div className="text-xs text-nc-warm/40">
            © 1989 - {new Date().getFullYear()} NC Turismo. Todos os direitos reservados.
          </div>
        </div>
      </footer>

    </div>
  );
};
