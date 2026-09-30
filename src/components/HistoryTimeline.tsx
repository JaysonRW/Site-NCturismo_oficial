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
    icon: <Award className="w-6 h-6 text-[#C8102E]" />,
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
    icon: <Building2 className="w-6 h-6 text-[#DB8902]" />,
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
    icon: <Briefcase className="w-6 h-6 text-[#C8102E]" />,
    highlightStat: {
      value: 'Gestão B2B',
      label: 'Foco em políticas e governança'
    },
    tags: ['Contratos Corporativos', 'Auditoria Prévia', 'Atendimento Humanizado'],
    takeaways: [
      'Implantação de SLAs corporativos estritos',
      'Treinamento especializado para consultores corporativos',
      'Crescimento da carteira com indústrias e serviços'
    ]
  },
  {
    id: '2012',
    year: '2012',
    title: 'Digitalização & Automação OBT',
    subtitle: 'Pioneirismo na integração de portais corporativos',
    category: 'tecnologia',
    categoryLabel: 'Tecnologia & Gestão',
    summary: 'Adoção precoce de plataformas self-booking (OBT) sem abrir mão do consultor sênior na retaguarda.',
    description: 'Enquanto muitos temiam a internet, a NC Turismo abraçou as ferramentas digitais para conceder autonomia ao viajante corporativo. Lança portais integrados com alçadas de aprovação em tempo real e conciliação eletrônica.',
    quote: 'A tecnologia economiza tempo em processos rotineiros; as pessoas garantem acolhimento nas exceções.',
    quoteAuthor: 'Comitê de Inovação NC',
    icon: <Receipt className="w-6 h-6 text-[#DB8902]" />,
    highlightStat: {
      value: 'Sistemas OBT',
      label: 'Automação com apoio consultivo'
    },
    tags: ['Self-Booking OBT', 'Workflow de Aprovação', 'Relatórios Gerenciais'],
    takeaways: [
      'Redução do tempo médio de emissão',
      'Transparência com relatórios detalhados de despesas',
      'Harmonia perfeita entre app digital e atendimento humano'
    ]
  },
  {
    id: '2020',
    year: '2020',
    title: 'Resiliência & Duty of Care',
    subtitle: 'Presença inabalável no momento mais desafiador do mundo',
    category: 'resiliencia',
    categoryLabel: 'Resiliência & Cuidados',
    summary: 'Durante o fechamento global das fronteiras, a NC Turismo operou 24 horas por dia para repatriar clientes e apoiar viagens essenciais.',
    description: 'A pandemia da COVID-19 colocou à prova todo o setor de turismo. A NC Turismo permaneceu de portas e linhas abertas sem interrupções, resgatando viajantes em múltiplos continentes, renegociando créditos sem perdas e oferecendo segurança sanitária e psicológica.',
    quote: 'Quando as fronteiras fecharam, nosso telefone não parou de tocar. E nunca deixamos de atender.',
    quoteAuthor: 'Equipe de Plantão 24h',
    icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
    highlightStat: {
      value: '24/7/365',
      label: 'Atendimento contínuo na crise'
    },
    tags: ['Repatriação de Brasileiros', 'Recuperação de Créditos', 'Duty of Care'],
    takeaways: [
      'Nenhum cliente corporativo deixado desassistido',
      'Gestão de milhares de remarcações e créditos',
      'Reforço da reputação como agência de confiança incondicional'
    ]
  },
  {
    id: 'Hoje',
    year: 'Hoje',
    title: 'We Are Travel · O Futuro em Movimento',
    subtitle: 'Inteligência de dados, ESG e mobilidade corporativa integrada',
    category: 'futuro',
    categoryLabel: 'We Are Travel / Futuro',
    summary: 'Uma agência consolidada, dinâmica e preparada para as próximas décadas de mobilidade.',
    description: 'Hoje, a NC Turismo consolida seu posicionamento: uma agência completa, com portfólio robusto de soluções em gestão de viagens corporativas, mobilidade, eventos, lazer sob medida e sustentabilidade (ESG). Seguimos fiéis ao nosso DNA: estrutura real, time experiente e paixão por conectar pessoas.',
    quote: 'O futuro do turismo corporativo é ágil, consciente e cada vez mais relacional.',
    quoteAuthor: 'Diretoria NC Turismo',
    icon: <Sparkles className="w-6 h-6 text-[#C8102E]" />,
    highlightStat: {
      value: 'Selo ESG',
      label: 'Práticas sustentáveis ativas'
    },
    tags: ['Plataformas Integradas', 'Calculadora de Carbono', 'Sede em Curitiba'],
    takeaways: [
      'Ecossistema integrado de viagens, despesas e mobilidade',
      'Auditoria contínua de contratos e redução de custos (saving)',
      'Relacionamento humanizado como diferencial inegociável'
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
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({
    '1989': true,
    'Hoje': true
  });
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>('1989');

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
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useGSAP(() => {
    if (!containerRef.current) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 1. Header fade in
      gsap.fromTo('.timeline-header',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: '.timeline-header',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // 2. Timeline Quick Navigation Fade in
      gsap.fromTo('.timeline-quick-nav',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: '.timeline-quick-nav',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // 3. Dynamic Progress Line Fill
      if (progressLineRef.current) {
        gsap.fromTo(progressLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: 'top center',
            ease: 'none',
            scrollTrigger: {
              trigger: '.timeline-track-container',
              start: 'top 70%',
              end: 'bottom 80%',
              scrub: 0.5
            }
          }
        );
      }

      // 4. Milestone items reveal on scroll
      const milestoneItems = gsap.utils.toArray<HTMLElement>('.timeline-milestone-item');
      milestoneItems.forEach((item) => {
        const id = item.getAttribute('data-milestone-id');
        
        ScrollTrigger.create({
          trigger: item,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => id && setActiveMilestoneId(id),
          onEnterBack: () => id && setActiveMilestoneId(id)
        });

        gsap.fromTo(item,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
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
      className="relative py-20 md:py-28 bg-[#F8FAFC] text-[#0F172A] overflow-hidden border-t border-slate-200"
    >
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-red-100/30 via-orange-50/20 to-transparent blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-100/30 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        
        {/* HEADER: DESDE 1989 */}
        <div className="timeline-header max-w-3xl mx-auto text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/80 text-[#C8102E] text-xs font-bold uppercase tracking-[0.2em] shadow-2xs">
            <Clock size={15} className="text-[#DB8902]" />
            <span>Linha do Tempo · 38 Anos de História</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
            Uma trajetória construída com{' '}
            <span className="bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] bg-clip-text text-transparent">
              credibilidade, relacionamento
            </span>{' '}
            e visão de futuro.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Desde 1989 em Curitiba, acompanhando a evolução dos transportes, da tecnologia e das necessidades dos viajantes. Conheça os marcos da nossa trajetória.
          </p>
        </div>

        {/* INTERACTIVE YEAR SCRUBBER / QUICK NAV BAR */}
        <div className="timeline-quick-nav max-w-4xl mx-auto mb-16 p-2 rounded-2xl bg-white border border-slate-200/90 shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2">
            
            {/* Year Quick-Jump Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 w-full sm:w-auto">
              {MILESTONES.map((item) => {
                const isActive = activeMilestoneId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToMilestone(item.id)}
                    className={`group relative px-3.5 py-2 rounded-xl text-xs font-display font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#C8102E] to-[#DB8902] text-white shadow-md scale-105' 
                        : 'bg-slate-100 text-slate-600 hover:text-[#0F172A] hover:bg-slate-200'
                    }`}
                  >
                    <span className="font-mono">{item.year}</span>
                    <span className="hidden md:inline text-[11px] opacity-90">· {item.title.split('&')[0].trim()}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Filter Pill */}
            <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 w-full sm:w-auto justify-center sm:justify-end">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Filtro:</span>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-[#0F172A] text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#C8102E] cursor-pointer"
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

        {/* VERTICAL TIMELINE WITH GSAP PROGRESS BEAM */}
        <div className="timeline-track-container relative max-w-5xl mx-auto py-8">
          
          {/* Background Track Line */}
          <div className="absolute top-0 bottom-0 left-6 lg:left-1/2 -translate-x-1/2 w-0.5 bg-slate-200" />

          {/* Animated Progress Beam */}
          <div 
            ref={progressLineRef}
            className="absolute top-0 bottom-0 left-6 lg:left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-[#C8102E] via-[#DB8902] to-amber-500 shadow-[0_0_12px_rgba(200,16,46,0.6)] z-10 rounded-full"
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
                      className={`timeline-marker-dot relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                        isActive 
                          ? 'bg-gradient-to-r from-[#C8102E] to-[#DB8902] text-white shadow-lg shadow-red-500/30 scale-110' 
                          : 'bg-white border-2 border-slate-300 text-slate-700 hover:border-[#C8102E] hover:text-[#C8102E]'
                      }`}
                      title={`Ver detalhes de ${milestone.year}`}
                    >
                      {isActive && (
                        <span className="absolute inset-0 rounded-full bg-red-400/40 animate-ping" />
                      )}
                      <span className="font-mono text-xs font-bold">{milestone.year === 'Hoje' ? '38a' : milestone.year.slice(2)}</span>
                    </button>
                  </div>

                  {/* Column 1 */}
                  <div className={`pl-16 lg:pl-0 ${
                    isEven 
                      ? 'lg:col-start-1 lg:col-span-5 lg:text-right lg:pr-6' 
                      : 'lg:col-start-8 lg:col-span-5 lg:order-2 lg:text-left lg:pl-6'
                  }`}>
                    
                    {/* Year badge & Category */}
                    <div className={`flex items-center gap-3 mb-3 ${
                      isEven ? 'lg:justify-end' : 'lg:justify-start'
                    }`}>
                      <span className="px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-[#C8102E] text-xs font-mono font-bold">
                        {milestone.year}
                      </span>
                      <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                        {milestone.categoryLabel}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#0F172A] tracking-tight">
                      {milestone.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-[#DB8902] font-mono font-bold mt-1">
                      {milestone.subtitle}
                    </p>

                    <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
                      {milestone.summary}
                    </p>

                    {/* Stat Highlight Card */}
                    <div className={`mt-4 inline-flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs ${
                      isEven ? 'lg:flex-row-reverse' : ''
                    }`}>
                      <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                        {milestone.icon}
                      </div>
                      <div className={isEven ? 'lg:text-right' : 'text-left'}>
                        <div className="text-lg font-display font-bold text-[#0F172A] leading-none">
                          {milestone.highlightStat.value}
                        </div>
                        <div className="text-[11px] text-slate-500 tracking-wide mt-0.5 font-medium">
                          {milestone.highlightStat.label}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Spacer Column */}
                  <div className="hidden lg:block lg:col-start-6 lg:col-span-2 pointer-events-none" />

                  {/* Column 2 / Detail Box */}
                  <div className={`pl-16 lg:pl-0 ${
                    isEven 
                      ? 'lg:col-start-8 lg:col-span-5 lg:order-2' 
                      : 'lg:col-start-1 lg:col-span-5 lg:order-1'
                  }`}>
                    <div className={`rounded-3xl p-6 sm:p-8 transition-all duration-300 relative overflow-hidden bg-white shadow-sm ${
                      !isEven ? 'lg:mr-6' : 'lg:ml-6'
                    } ${
                      isActive 
                        ? 'border-2 border-[#DB8902]/60 shadow-lg shadow-amber-500/5' 
                        : 'border border-slate-200 hover:border-slate-300'
                    }`}>
                      
                      {/* Top Action Toggle */}
                      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#C8102E] animate-pulse" />
                          <span className="text-xs uppercase tracking-wider text-slate-500 font-mono font-medium">
                            Marco Documentado
                          </span>
                        </div>
                        <button
                          onClick={() => toggleExpand(milestone.id)}
                          className="inline-flex items-center gap-1.5 text-xs text-[#C8102E] hover:text-[#DB8902] font-semibold transition-colors cursor-pointer"
                        >
                          <span>{isExpanded ? 'Recolher' : 'Expandir visão'}</span>
                          <ChevronRight size={14} className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                      </div>

                      {/* Story Content */}
                      <div className="pt-4 space-y-4">
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {milestone.description}
                        </p>

                        {/* Collapsible deep points */}
                        {isExpanded && (
                          <div className="space-y-4 pt-2">
                            
                            {/* Key Takeaways list */}
                            <div className="space-y-2">
                              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                                Impactos & Conquistas:
                              </span>
                              {milestone.takeaways.map((item, i) => (
                                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                                  <CheckCircle2 size={16} className="text-[#C8102E] shrink-0 mt-0.5" />
                                  <span className="font-medium">{item}</span>
                                </div>
                              ))}
                            </div>

                            {/* Quote highlight */}
                            {milestone.quote && (
                              <div className="p-4 rounded-xl bg-gradient-to-r from-red-50/70 to-orange-50/30 border-l-4 border-[#C8102E] space-y-1">
                                <p className="text-xs sm:text-sm italic text-[#0F172A] font-medium">
                                  "{milestone.quote}"
                                </p>
                                {milestone.quoteAuthor && (
                                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#DB8902] font-bold block">
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
                                  className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] text-slate-600 font-medium"
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

        {/* BOTTOM CALL TO ACTION */}
        <div 
          className="mt-20 p-8 sm:p-12 rounded-3xl border border-amber-200/80 max-w-4xl mx-auto shadow-xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #FFFDFB 0%, #FFF4E5 40%, #FFE9CC 100%)'
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-amber-200 text-[#DB8902] text-xs font-mono font-bold uppercase shadow-2xs">
                <HeartHandshake size={14} className="text-[#C8102E]" />
                <span>O Próximo Capítulo</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-display font-bold text-[#0F172A]">
                Sua empresa faz parte da nossa próxima história.
              </h4>
              <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
                Venha tomar um café em nossa sede própria em Curitiba ou agende uma reunião executiva com nossos consultores de viagens e T&E.
              </p>
            </div>

            <button
              onClick={onContactClick}
              className="shrink-0 px-8 py-4 rounded-xl bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] text-white font-bold text-sm tracking-wider uppercase hover:brightness-105 active:scale-95 transition-all text-center shadow-lg shadow-red-500/20 cursor-pointer"
            >
              Falar com um Consultor
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
