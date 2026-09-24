import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Clock, 
  Award, 
  Building2, 
  Briefcase, 
  Receipt, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  MapPin,
  HeartHandshake
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export interface Milestone {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  category: 'origem' | 'corporativo' | 'tecnologia' | 'resiliencia' | 'futuro';
  categoryLabel: string;
  summary: string;
  description: string;
  quote?: string;
  quoteAuthor?: string;
  icon: React.ReactNode;
  highlightStat: {
    value: string;
    label: string;
  };
  tags: string[];
  takeaways: string[];
}

export const MILESTONES: Milestone[] = [
  {
    id: '1989',
    year: '1989',
    title: 'O Sonho & A Fundação',
    subtitle: '2 de janeiro de 1989 · Curitiba, Paraná',
    category: 'origem',
    categoryLabel: 'Origem & Tradição',
    summary: 'Neusa Culpi transforma a paixão por viagens em um projeto empresarial sólido no centro de Curitiba.',
    description: 'A NC Turismo nasceu a partir da coragem e sensibilidade de sua fundadora, Neusa Culpi, que decidiu estabelecer uma agência com propósito claro: tratar viagens com o mais alto rigor ético, proximidade humana e transparência incondicional.',
    quote: 'Uma viagem não começa no aeroporto; começa na escuta atenta dos sonhos de quem viaja.',
    quoteAuthor: 'Neusa Culpi · Fundadora',
    icon: <Award className="w-6 h-6 text-nc-orange" />,
    highlightStat: {
      value: '38+ Anos',
      label: 'De história contínua em Curitiba'
    },
    tags: ['Fundação Neusa Culpi', 'Sede Curitiba', 'Atendimento Consultivo'],
    takeaways: [
      'Início das operações no centro de Curitiba',
      'Valores fundamentais de proximidade e ética',
      'Conexão com os primeiros viajantes e famílias'
    ]
  },
  {
    id: '1996',
    year: '1996',
    title: 'Consolidação & Sede Própria',
    subtitle: 'Estrutura física real e parcerias globais diretas',
    category: 'origem',
    categoryLabel: 'Expansão & Solidez',
    summary: 'Abertura de espaço executivo preparado para receber clientes com conforto, discrição e segurança.',
    description: 'Em um mercado em rápida transformação, a NC Turismo reforça seu compromisso com a presença física e inaugura estrutura moderna na capital paranaense. A empresa firma parcerias com as maiores companhias aéreas do mundo e consolidadoras de hotelaria de alto padrão.',
    quote: 'Presença física não é nostalgia; é solidez, acolhimento e garantia de que o cliente sempre sabe onde nos encontrar.',
    quoteAuthor: 'Diretoria NC Turismo',
    icon: <Building2 className="w-6 h-6 text-amber-400" />,
    highlightStat: {
      value: '100% Físico',
      label: 'Escritório com portas abertas'
    },
    tags: ['Sede Executiva', 'Alianças Aéreas', 'Rede Hoteleira Internacional'],
    takeaways: [
      'Espaço para atendimento reservado a viajantes e empresas',
      'Acordos diretos com redes aéreas internacionais',
      'Reconhecimento como referência em viagens no Paraná'
    ]
  },
  {
    id: '2004',
    year: '2004',
    title: 'Especialização Corporativa B2B',
    subtitle: 'Entender antes de executar: a revolução consultiva',
    category: 'corporativo',
    categoryLabel: 'Viagens Corporativas',
    summary: 'Criação da divisão B2B com foco em compliance, política de viagens e suporte ágil para empresas.',
    description: 'A NC Turismo institucionaliza sua célula de atendimento empresarial. Deixa de operar como mera emissora para atuar como parceira consultiva estratégica para diretores financeiros (CFOs) e gestores de RH, desenhando políticas de viagem sob medida.',
    quote: 'Viagem corporativa inteligente é aquela em que o colaborador viaja seguro e a diretoria tem previsibilidade de caixa.',
    quoteAuthor: 'Gestão Corporativa NC',
    icon: <Briefcase className="w-6 h-6 text-nc-orange" />,
    highlightStat: {
      value: 'Até -24%',
      label: 'Otimização média em orçamentos B2B'
    },
    tags: ['Governança B2B', 'Acordos Corporativos', 'SLA Prioritário'],
    takeaways: [
      'Estruturação de políticas customizadas de viagens',
      'Negociação de tarifas corporativas exclusivas',
      'Atendimento dedicado a contas empresariais'
    ]
  },
  {
    id: '2014',
    year: '2014',
    title: 'Travel & Expense e Digitalização',
    subtitle: 'Controle orçamentário, dados e auditoria em tempo real',
    category: 'tecnologia',
    categoryLabel: 'Tecnologia & Gestão',
    summary: 'Integração pioneira de plataformas de reservas online (OBT), aprovações em múltiplos níveis e T&E.',
    description: 'A agência dá um salto tecnológico integrando plataformas de reservas, self-booking assistido e prestação de contas automatizada. Empresas parceiras passam a contar com relatórios analíticos de saving, conciliação de cartão corporativo e rastreabilidade total.',
    quote: 'Tecnologia sem olhar humano vira burocracia. Na NC, a tecnologia liberta tempo para o atendimento consultivo.',
    quoteAuthor: 'Comitê de Inovação NC',
    icon: <Receipt className="w-6 h-6 text-amber-300" />,
    highlightStat: {
      value: '24/7 OBT',
      label: 'Plataforma integrada de autoatendimento'
    },
    tags: ['Travel & Expense', 'Relatórios de Saving', 'Compliance Fiscal'],
    takeaways: [
      'Automação de workflows de aprovação corporativa',
      'Dashboards executivos de custos por centro de custo',
      'Redução de ruídos e extravio de comprovantes'
    ]
  },
  {
    id: '2020',
    year: '2020',
    title: 'Resiliência, Plantão 24/7 & Apoio Humano',
    subtitle: 'Presença inabalável no período mais desafiador da aviação',
    category: 'resiliencia',
    categoryLabel: 'Resiliência & Cuidado',
    summary: 'Equipe mobilizada dia e noite garantindo repatriações seguras, remarcações e proteção de crédito.',
    description: 'Quando as fronteiras mundiais se fecharam repentinamente, a NC Turismo provou a força de seu modelo consultivo. Enquanto centenas de plataformas automáticas colapsavam sem suporte telefônico, a equipe NC trabalhou 24 horas por dia para trazer viajantes de volta e preservar cada centavo dos clientes.',
    quote: 'Em momentos de crise, o que vale não é um robô de chatbot, mas uma pessoa experiente resolvendo o seu retorno.',
    quoteAuthor: 'Depoimento de Cliente Corporativo',
    icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
    highlightStat: {
      value: 'Zero',
      label: 'Passageiros sem assistência imediata'
    },
    tags: ['Plantão Emergencial 24h', 'Repatriações', 'Segurança do Passageiro'],
    takeaways: [
      'Célula 24 horas para remanejamento de bilhetes e cancelamentos',
      'Recuperação de créditos e renegociação com fornecedores',
      'Reforço da confiança e fidelidade dos clientes'
    ]
  },
  {
    id: 'hoje',
    year: 'Hoje',
    title: 'We Are Travel by NC Turismo',
    subtitle: 'Um ecossistema completo de mobilidade, dados e conexões',
    category: 'futuro',
    categoryLabel: 'Ecossistema & Futuro',
    summary: 'A evolução definitiva: inteligência de dados, mobilidade urbana, eventos e viagens de alto padrão.',
    description: 'Chegando aos 38 anos de história, a NC Turismo se consolida sob a bandeira "We Are Travel". Uma agência que une a autoridade de quatro décadas à agilidade contemporânea, atendendo desde deslocamentos de alta diretoria e grandes convenções até experiências de lazer inesquecíveis.',
    quote: 'Conectamos pessoas, empresas e oportunidades por meio de viagens mais seguras, eficientes e humanas.',
    quoteAuthor: 'Manifesto NC Turismo',
    icon: <Sparkles className="w-6 h-6 text-nc-orange" />,
    highlightStat: {
      value: '38 Anos',
      label: 'Conectando Curitiba ao mundo'
    },
    tags: ['We Are Travel', 'Mobilidade Corporativa', 'Eventos & Lazer'],
    takeaways: [
      'Ecossistema 360° com T&E, mobilidade, lazer e eventos',
      'Integração de inteligência analítica com plantão humano',
      'Preparação contínua para as próximas décadas'
    ]
  }
];

interface HistoryTimelineProps {
  onContactClick?: () => void;
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ onContactClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>('1989');
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({
    '1989': true,
    'hoje': true
  });

  const toggleExpand = (id: string) => {
    setExpandedMilestones(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const scrollToMilestone = (id: string) => {
    setActiveMilestoneId(id);
    const element = document.getElementById(`milestone-${id}`);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useGSAP(() => {
    if (!containerRef.current) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 1. Header reveal
      gsap.fromTo('.timeline-header',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.timeline-header',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // 2. Interactive quick-bar animation
      gsap.fromTo('.timeline-quick-nav',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.timeline-quick-nav',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // 3. Central glowing progress line fill with ScrollTrigger
      if (progressLineRef.current) {
        gsap.fromTo(progressLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            transformOrigin: 'top center',
            scrollTrigger: {
              trigger: '.timeline-track-container',
              start: 'top 75%',
              end: 'bottom 85%',
              scrub: 0.5
            }
          }
        );
      }

      // 4. Milestone items reveal sequence
      const milestoneElements = gsap.utils.toArray<HTMLElement>('.timeline-milestone-item');
      milestoneElements.forEach((el, index) => {
        const isEven = index % 2 === 0;
        const initialX = isEven ? -40 : 40;

        // Card entrance
        gsap.fromTo(el,
          { 
            y: 50, 
            x: window.innerWidth >= 1024 ? initialX : 0, 
            opacity: 0, 
            scale: 0.96 
          },
          {
            y: 0,
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
              onEnter: () => {
                const milestoneId = el.getAttribute('data-milestone-id');
                if (milestoneId) {
                  setActiveMilestoneId(milestoneId);
                }
              },
              onEnterBack: () => {
                const milestoneId = el.getAttribute('data-milestone-id');
                if (milestoneId) {
                  setActiveMilestoneId(milestoneId);
                }
              }
            }
          }
        );

        // Highlight marker pulse
        const marker = el.querySelector('.timeline-marker-dot');
        if (marker) {
          gsap.fromTo(marker,
            { scale: 0.5, opacity: 0.3 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
      });
    });
  }, { scope: containerRef });

  const filteredMilestones = activeCategory === 'todos' 
    ? MILESTONES 
    : MILESTONES.filter(m => m.category === activeCategory);

  return (
    <section 
      ref={containerRef} 
      id="linha-do-tempo" 
      className="relative py-24 md:py-32 bg-gradient-to-b from-nc-space via-[#0f0e13] to-nc-space overflow-hidden border-t border-white/5"
    >
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#DB8902]/10 via-rose-900/5 to-transparent blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        
        {/* =========================================================================
            HEADER: DESDE 1989
           ========================================================================= */}
        <div className="timeline-header max-w-3xl mx-auto text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-nc-orange/15 border border-nc-orange/30 text-nc-orange text-xs font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(219,137,2,0.15)]">
            <Clock size={15} className="animate-spin-slow" />
            <span>Linha do Tempo · 38 Anos de História</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.12]">
            Uma trajetória construída com{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nc-orange via-amber-300 to-white">
              credibilidade, relacionamento
            </span>{' '}
            e visão de futuro.
          </h2>

          <p className="text-base sm:text-lg text-nc-warm/75 leading-relaxed">
            Desde 1989 em Curitiba, acompanhando a evolução dos transportes, da tecnologia e das necessidades dos viajantes. Conheça os marcos da nossa trajetória.
          </p>
        </div>

        {/* =========================================================================
            INTERACTIVE YEAR SCRUBBER / QUICK NAV BAR
           ========================================================================= */}
        <div className="timeline-quick-nav max-w-4xl mx-auto mb-16 p-2 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2">
            
            {/* Year Quick-Jump Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 w-full sm:w-auto">
              {MILESTONES.map((item) => {
                const isActive = activeMilestoneId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToMilestone(item.id)}
                    className={`group relative px-3.5 py-2 rounded-2xl text-xs font-display font-bold transition-all duration-300 flex items-center gap-1.5 ${
                      isActive 
                        ? 'bg-gradient-to-r from-nc-orange to-amber-500 text-nc-space shadow-[0_0_20px_rgba(219,137,2,0.4)] scale-105' 
                        : 'bg-white/5 text-nc-warm/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="font-mono">{item.year}</span>
                    <span className="hidden md:inline text-[11px] opacity-80">· {item.title.split('&')[0].trim()}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Filter Pill */}
            <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10 w-full sm:w-auto justify-center sm:justify-end">
              <span className="text-[11px] font-mono uppercase tracking-wider text-nc-warm/50">Filtro:</span>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-nc-surface border border-white/15 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-nc-orange cursor-pointer"
              >
                <option value="todos">Todos os marcos (6)</option>
                <option value="origem">Origem & Tradição</option>
                <option value="corporativo">Corporativo B2B</option>
                <option value="tecnologia">Tecnologia & Gestão</option>
                <option value="resiliencia">Resiliência & Cuidados</option>
                <option value="futuro">We Are Travel / Futuro</option>
              </select>
            </div>

          </div>
        </div>

        {/* =========================================================================
            VERTICAL TIMELINE WITH GSAP PROGRESS BEAM
           ========================================================================= */}
        <div className="timeline-track-container relative max-w-5xl mx-auto py-8">
          
          {/* Background Track Line (Gray) */}
          <div className="absolute top-0 bottom-0 left-6 lg:left-1/2 -translate-x-1/2 w-0.5 bg-white/10" />

          {/* Animated Glowing Progress Beam (Fills dynamically on scroll) */}
          <div 
            ref={progressLineRef}
            className="absolute top-0 bottom-0 left-6 lg:left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-nc-orange via-amber-400 to-rose-500 shadow-[0_0_15px_rgba(219,137,2,0.8)] z-10 rounded-full"
          />

          {/* Milestone Items List */}
          <div className="space-y-16 md:space-y-24">
            {filteredMilestones.map((milestone, index) => {
              const isEven = index % 2 === 0;
              const isExpanded = !!expandedMilestones[milestone.id];
              const isActive = activeMilestoneId === milestone.id;

              return (
                <div
                  key={milestone.id}
                  id={`milestone-${milestone.id}`}
                  data-milestone-id={milestone.id}
                  className={`timeline-milestone-item relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start ${
                    isEven ? '' : 'lg:flex-row-reverse'
                  }`}
                >
                  
                  {/* Central Node Indicator */}
                  <div className="absolute left-6 lg:left-1/2 -translate-x-1/2 top-8 z-20 flex items-center justify-center">
                    <button
                      onClick={() => toggleExpand(milestone.id)}
                      className={`timeline-marker-dot relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive 
                          ? 'bg-nc-orange text-nc-space shadow-[0_0_30px_rgba(219,137,2,0.9)] scale-110' 
                          : 'bg-nc-surface border-2 border-white/20 text-white hover:border-nc-orange/80'
                      }`}
                      title={`Ver detalhes de ${milestone.year}`}
                    >
                      {/* Pulsing Aura if active */}
                      {isActive && (
                        <span className="absolute inset-0 rounded-full bg-nc-orange/40 animate-ping" />
                      )}
                      <span className="font-mono text-xs font-bold">{milestone.year === 'Hoje' ? '38a' : milestone.year.slice(2)}</span>
                    </button>
                  </div>

                  {/* Left Column / Desktop Alignment */}
                  <div className={`pl-16 lg:pl-0 ${
                    isEven ? 'lg:col-span-5 lg:text-right' : 'lg:col-start-7 lg:col-span-5 lg:order-2'
                  }`}>
                    
                    {/* Year badge & Category metadata */}
                    <div className={`flex items-center gap-3 mb-3 ${
                      isEven ? 'lg:justify-end' : 'lg:justify-start'
                    }`}>
                      <span className="px-3 py-1 rounded-full bg-nc-orange/20 border border-nc-orange/40 text-nc-orange text-xs font-mono font-bold">
                        {milestone.year}
                      </span>
                      <span className="text-xs uppercase tracking-wider text-nc-warm/60 font-medium">
                        {milestone.categoryLabel}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                      {milestone.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-nc-orange/90 font-mono mt-1">
                      {milestone.subtitle}
                    </p>

                    <p className="text-sm sm:text-base text-nc-warm/80 mt-3 leading-relaxed">
                      {milestone.summary}
                    </p>

                    {/* Stat Highlight Card */}
                    <div className={`mt-4 inline-flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 ${
                      isEven ? 'lg:flex-row-reverse' : ''
                    }`}>
                      <div className="w-10 h-10 rounded-xl bg-nc-orange/20 flex items-center justify-center shrink-0">
                        {milestone.icon}
                      </div>
                      <div className={isEven ? 'lg:text-right' : 'text-left'}>
                        <div className="text-lg font-display font-bold text-white leading-none">
                          {milestone.highlightStat.value}
                        </div>
                        <div className="text-[11px] text-nc-warm/60 tracking-wide mt-0.5">
                          {milestone.highlightStat.label}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Center Spacer Column for Desktop */}
                  <div className="hidden lg:block lg:col-span-2" />

                  {/* Right Column / Detail Box */}
                  <div className={`pl-16 lg:pl-0 ${
                    isEven ? 'lg:col-span-5' : 'lg:col-span-5 lg:order-1'
                  }`}>
                    <div className={`rounded-3xl p-6 sm:p-8 transition-all duration-500 relative overflow-hidden backdrop-blur-md ${
                      isActive 
                        ? 'bg-gradient-to-br from-nc-surface via-[#201a1e] to-nc-surface border-2 border-nc-orange/40 shadow-[0_15px_50px_rgba(219,137,2,0.15)]' 
                        : 'bg-nc-surface/90 border border-white/10 hover:border-white/20'
                    }`}>
                      
                      {/* Top Action Toggle */}
                      <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-nc-orange animate-pulse" />
                          <span className="text-xs uppercase tracking-wider text-nc-warm/70 font-mono">
                            Marco Documentado
                          </span>
                        </div>
                        <button
                          onClick={() => toggleExpand(milestone.id)}
                          className="inline-flex items-center gap-1.5 text-xs text-nc-orange hover:text-amber-300 font-semibold transition-colors"
                        >
                          <span>{isExpanded ? 'Recolher' : 'Expandir visão'}</span>
                          <ChevronRight size={14} className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                      </div>

                      {/* Full Story Content */}
                      <div className="pt-4 space-y-4">
                        <p className="text-sm text-nc-warm/80 leading-relaxed">
                          {milestone.description}
                        </p>

                        {/* Collapsible deeper points */}
                        {isExpanded && (
                          <div className="space-y-4 pt-2 animate-fadeIn">
                            
                            {/* Key Takeaways list */}
                            <div className="space-y-2">
                              <span className="text-[11px] font-mono uppercase tracking-wider text-nc-warm/50 block">
                                Impactos & Conquistas:
                              </span>
                              {milestone.takeaways.map((item, i) => (
                                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/90">
                                  <CheckCircle2 size={16} className="text-nc-orange shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>

                            {/* Quote highlight */}
                            {milestone.quote && (
                              <div className="p-4 rounded-2xl bg-black/40 border-l-2 border-nc-orange/80 space-y-1">
                                <p className="text-xs sm:text-sm italic text-nc-warm/90">
                                  "{milestone.quote}"
                                </p>
                                {milestone.quoteAuthor && (
                                  <span className="text-[10px] uppercase font-mono tracking-wider text-nc-orange block">
                                    — {milestone.quoteAuthor}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {milestone.tags.map((tag, tIndex) => (
                                <span 
                                  key={tIndex}
                                  className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-nc-warm/70"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>

                          </div>
                        )}

                      </div>

                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* =========================================================================
            BOTTOM FOOTNOTE / CALL TO ACTION
           ========================================================================= */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-nc-surface via-[#251810] to-nc-surface border border-nc-orange/20 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-nc-orange/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nc-orange/20 text-nc-orange text-xs font-mono font-bold uppercase">
                <HeartHandshake size={14} />
                <span>O Próximo Capítulo</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-display font-bold text-white">
                Sua empresa faz parte da nossa próxima história.
              </h4>
              <p className="text-sm text-nc-warm/70 max-w-xl">
                Venha tomar um café em nossa sede própria em Curitiba ou agende uma reunião executiva com nossos consultores de viagens e T&E.
              </p>
            </div>

            <a
              href="https://wa.me/554133221000?text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20com%20a%20equipe%20da%20NC%20Turismo%20sobre%20minha%20empresa!"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-8 py-4 rounded-full bg-gradient-to-r from-nc-orange to-[#b36e00] text-nc-space font-display font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_35px_rgba(219,137,2,0.45)] hover:scale-105 active:scale-95 transition-all text-center"
            >
              Falar com um Consultor
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
