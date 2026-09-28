import React, { useEffect, useState } from 'react';
import { 
  Cpu, 
  Layers, 
  CreditCard, 
  BarChart3, 
  Smartphone, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Globe, 
  FileText, 
  Sliders, 
  Zap, 
  UserCheck, 
  PlaneTakeoff, 
  Receipt,
  Headphones
} from 'lucide-react';

interface TecnologiaObtViewProps {
  onBackToHome: () => void;
  onOpenDiagnosis: () => void;
  onOpenLegalTab?: (tab: string) => void;
  onNavigateToSection?: (target: string) => void;
}

export const TecnologiaObtView: React.FC<TecnologiaObtViewProps> = ({
  onBackToHome,
  onOpenDiagnosis,
  onNavigateToSection
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [activePlatformFilter, setActivePlatformFilter] = useState<'todos' | 'obt' | 'despesas' | 'pagamentos' | 'bi'>('todos');

  // 5 Pilares Principais de "O que entregamos"
  const pilares = [
    {
      num: '01',
      tag: 'Gestão de Viagens',
      type: 'obt',
      icon: PlaneTakeoff,
      title: 'Automatize solicitações, aprovações e políticas',
      desc: 'Plataformas OBT de ponta a ponta que garantem aderência às diretrizes corporativas em tempo real.',
      whatsappMsg: 'Olá, quero saber mais sobre gestão de viagens corporativas com a NC Turismo.',
      items: [
        'Fluxos de aprovação multinível configuráveis',
        'Controle automático por centro de custo',
        'Aplicação preventiva de políticas de viagem',
        'Mais autonomia para gestores, secretárias e viajantes'
      ],
      badge: 'OBT Principal'
    },
    {
      num: '02',
      tag: 'Gestão de Despesas',
      type: 'despesas',
      icon: Receipt,
      title: 'Integre viagens e despesas em um único processo',
      desc: 'Elimine planilhas manuais e unifique a jornada de deslocamento com a prestação de contas.',
      whatsappMsg: 'Olá, quero saber mais sobre gestão de despesas corporativas em viagens.',
      items: [
        'Expense Management integrado',
        'Prestação de contas digital com leitura de recibos',
        'Controle e prestação de adiantamentos',
        'Maior governança financeira e conformidade fiscal'
      ],
      badge: 'Expense Sync'
    },
    {
      num: '03',
      tag: 'Pagamentos Corporativos',
      type: 'pagamentos',
      icon: CreditCard,
      title: 'Mais controle sobre gastos durante as viagens',
      desc: 'Soluções modernas de pagamento virtual e físico para simplificar a conciliação contábil.',
      whatsappMsg: 'Olá, quero saber mais sobre pagamentos corporativos em viagens.',
      items: [
        'Cartões corporativos físicos e virtuais (VCN)',
        'Conciliação automática e faturamento centralizado',
        'Visibilidade em tempo real dos gastos dos colaboradores',
        'Redução drástica de processos manuais de conferência'
      ],
      badge: 'TravelPay'
    },
    {
      num: '04',
      tag: 'Business Intelligence',
      type: 'bi',
      icon: BarChart3,
      title: 'Transforme dados em informações estratégicas',
      desc: 'Relatórios gerenciais analíticos e dashboards dinâmicos para suportar decisões financeiras.',
      whatsappMsg: 'Olá, quero saber mais sobre BI e dashboards para viagens corporativas.',
      items: [
        'Dashboards gerenciais em tempo real',
        'Indicadores de desempenho e SLAs operacionais',
        'Análises aprofundadas por centro de custo e filial',
        'Mapeamento ativo de oportunidades de saving'
      ],
      badge: 'Inteligência de Dados'
    },
    {
      num: '05',
      tag: 'Mobilidade & Autoatendimento',
      type: 'obt',
      icon: Smartphone,
      title: 'Mais agilidade para gestores e viajantes',
      desc: 'Aplicativos móveis nativos e portais web responsivos com acesso 24h a qualquer dispositivo.',
      whatsappMsg: 'Olá, quero saber mais sobre mobilidade, autonomia e autoatendimento em viagens corporativas.',
      items: [
        'Solicitações online direto pelo smartphone',
        'Aprovações digitais com 1 toque para diretoria',
        'Acesso unificado por desktop e dispositivos móveis',
        'Informações e vouchers centralizados na palma da mão'
      ],
      badge: 'App Mobile'
    }
  ];

  const filteredPilares = activePlatformFilter === 'todos'
    ? pilares
    : pilares.filter(p => p.type === activePlatformFilter);

  // 11 Itens de Integração Operacional
  const integracoes = [
    { title: 'Gestão de viagens', desc: 'Reserva e emissão integrada em múltiplos canais GDS e NDC.' },
    { title: 'Gestão de despesas', desc: 'Captura digital de recibos e prestação de contas automatizada.' },
    { title: 'Integração entre viagens e despesas', desc: 'Ciclo fechado entre a passagem, hospedagem e despesas em campo.' },
    { title: 'Fluxos de aprovação', desc: 'Alçadas hierárquicas por cargo, projeto ou orçamento.' },
    { title: 'Centros de custo', desc: 'Rateio inteligente e associação automática de despesas.' },
    { title: 'Cartões corporativos', desc: 'Integração direta com faturas e conciliação de bandeiras.' },
    { title: 'Relatórios gerenciais', desc: 'Exportação em PDF, Excel e envio programado por e-mail.' },
    { title: 'Dashboards e BI', desc: 'Visualização gráfica de tendências, tarifas médias e savings.' },
    { title: 'Controle de bilhetes não voados', desc: 'Rastreabilidade de créditos aéreos para evitar perdas financeiras.' },
    { title: 'Atendimento especializado', desc: 'Equipe sênior operando lado a lado com as plataformas.' },
    { title: 'Informações centralizadas para tomada de decisão', desc: 'Dados unificados e confiáveis para negociações com fornecedores.' }
  ];

  // 8 Benefícios Estruturados
  const beneficios = [
    {
      title: 'Mais autonomia para gestores e viajantes',
      desc: 'Solicitações, aprovações e informações mais acessíveis 24h.',
      badge: 'Autonomia',
      icon: Zap
    },
    {
      title: 'Redução de processos manuais',
      desc: 'Menos retrabalho operacional e mais fluidez na rotina corporativa.',
      badge: 'Produtividade',
      icon: Clock
    },
    {
      title: 'Integração entre viagens e despesas',
      desc: 'Processos conectados para elevar controle, auditoria e governança.',
      badge: 'Conectividade',
      icon: Layers
    },
    {
      title: 'Maior visibilidade dos gastos',
      desc: 'Acompanhamento claro sobre despesas em tempo real e investimentos.',
      badge: 'Transparência',
      icon: TrendingUp
    },
    {
      title: 'Controle e governança',
      desc: 'Rastreabilidade total, padronização e segurança operacional.',
      badge: 'Compliance',
      icon: ShieldCheck
    },
    {
      title: 'Decisões baseadas em dados',
      desc: 'Informações analíticas organizadas para orientar decisões estratégicas.',
      badge: 'Inteligência',
      icon: BarChart3
    },
    {
      title: 'Melhor experiência para usuários',
      desc: 'Jornada simples, moderna e sem atritos para gestores e viajantes.',
      badge: 'Experiência',
      icon: Sparkles
    },
    {
      title: 'Escalabilidade nacional e internacional',
      desc: 'Estrutura robusta para operações corporativas de qualquer porte.',
      badge: 'Escalabilidade',
      icon: Globe
    }
  ];

  // Ferramentas do Ecossistema Tecnológico NC Turismo
  const ecossistema = [
    {
      name: 'Argo Travel & Expense',
      category: 'OBT & Expense Líder de Mercado',
      desc: 'A plataforma OBT e gestão de despesas mais utilizada e confiável da América Latina, parametrizada sob medida para sua empresa.',
      tag: 'Plataforma Homologada',
      highlight: 'Aprovações rápidas, regras de política pré-configuradas e auditoria automática.'
    },
    {
      name: 'WTS Corporate',
      category: 'Backoffice & Governança',
      desc: 'Sistema ERP especializado em turismo corporativo para emissão veloz, conciliação e faturamento unificado.',
      tag: 'Emissão & Backoffice',
      highlight: 'Controle contábil impecável, emissão ágil e gestão de créditos de bilhetes.'
    },
    {
      name: 'Clara TravelPay',
      category: 'Pagamentos & Cartão Corporativo',
      desc: 'Gestão moderna de pagamentos com emissão de cartões virtuais instantâneos e conciliação automatizada.',
      tag: 'Solução Financeira',
      highlight: 'Fim dos adiantamentos inseguros e controle de limites por colaborador.'
    },
    {
      name: 'Business Intelligence (BI)',
      category: 'Analytics & Inteligência Executiva',
      desc: 'Painéis dinâmicos desenvolvidos por especialistas para monitorar métricas de tarifas médias, compliance e savings.',
      tag: 'BI Proprietário NC',
      highlight: 'Indicadores customizados por centro de custo, diretoria ou projeto.'
    },
    {
      name: 'Ferramentas de Gestão e Controle Operacional',
      category: 'Automação & Monitoramento Contínuo',
      desc: 'Robôs de busca de menor tarifa, rastreador de bilhetes não voados e portais de atendimento emergencial 24h.',
      tag: 'Monitoramento 24/7',
      highlight: 'Recuperação garantida de créditos e suporte proativo contra cancelamentos.'
    }
  ];

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#C8102E] selection:text-white relative overflow-hidden">
      {/* Soft atmospheric background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-red-100/30 via-orange-50/20 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[600px] right-0 w-[550px] h-[600px] bg-gradient-to-l from-amber-100/25 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-0 w-[600px] h-[600px] bg-gradient-to-r from-red-100/20 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Header / Breadcrumb */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-5">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-[#C8102E] transition-colors text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft size={16} /> Voltar à página principal
          </button>

          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/80 text-[#C8102E] text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Cpu size={13} className="text-[#DB8902]" /> Soluções Corporativas · Tecnologia & OBT
          </span>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div 
          className="relative overflow-hidden rounded-[32px] border border-red-200/80 p-8 md:p-14 lg:p-16 shadow-xl shadow-red-500/5"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFDFB 45%, #FFF6EC 100%)'
          }}
        >
          {/* Top colored indicator bar */}
          <div 
            className="w-[88px] h-[5px] rounded-full mb-8"
            style={{ background: 'linear-gradient(90deg, #C8102E, #DB8902)' }}
          />

          <div className="max-w-3xl relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#C8102E] text-xs font-bold tracking-widest uppercase shadow-2xs">
              NC Turismo · Tecnologia e Integrações Corporativas
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
              Tecnologia para conectar <span className="bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] bg-clip-text text-transparent">pessoas, processos e informações</span>.
            </h1>

            <p className="text-base md:text-xl text-slate-600 leading-relaxed font-normal">
              A transformação digital da gestão de viagens corporativas exige mais do que reservas online. As empresas precisam integrar solicitações, aprovações, despesas, pagamentos e relatórios em uma única jornada operacional.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="https://wa.me/554132811153?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20NC%20Turismo%20e%20gostaria%20de%20saber%20mais%20sobre%20tecnologia%20e%20integra%C3%A7%C3%B5es%20para%20viagens%20corporativas."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:brightness-105 active:scale-[0.99] transition-all shadow-xl shadow-red-500/25 cursor-pointer"
              >
                <MessageCircle size={18} />
                <span>Falar com a NC Turismo</span>
              </a>

              <a
                href="#beneficios-nc"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('beneficios-nc');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-4 bg-white hover:bg-slate-50 text-[#0F172A] font-semibold text-sm rounded-xl border border-slate-200 transition-all shadow-2xs hover:border-slate-300 cursor-pointer"
              >
                <span>Ver benefícios corporativos</span>
                <ArrowRight size={16} className="text-[#C8102E]" />
              </a>

              <button
                onClick={onOpenDiagnosis}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#C8102E] py-2 px-3 transition-colors cursor-pointer"
              >
                Solicitar Demonstração OBT &rarr;
              </button>
            </div>

            {/* Micro Metrics Bar */}
            <div className="pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">Multi-OBT</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Argo & Plataformas</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#C8102E] tracking-tight">100% Cloud</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">App iOS & Android</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#DB8902] tracking-tight">&lt; 3 min</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Tempo Médio de Reserva</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">24/7</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Plantão & Suporte Humano</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSFORMAÇÃO DIGITAL */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-8 md:p-12 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DB8902]">
              Transformação Digital · Mobilidade Corporativa
            </span>
            <span className="h-1 w-8 bg-[#DB8902] rounded-full" />
          </div>

          <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight leading-snug">
            Plataformas reconhecidas, processos estruturados e atendimento especializado
          </h2>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-4xl">
            A NC Turismo combina atendimento especializado com plataformas reconhecidas pelo mercado para oferecer mais controle, automação e visibilidade sobre toda a operação de mobilidade corporativa.
          </p>

          {/* Destaque / Citação */}
          <div className="border-l-4 border-[#C8102E] bg-gradient-to-r from-red-50/60 to-transparent pl-6 pr-4 py-4 rounded-r-2xl">
            <p className="text-[#0F172A] font-semibold text-lg md:text-xl italic leading-relaxed">
              &ldquo;Mais do que digitalizar etapas, conectamos pessoas, processos e informações para tornar a gestão mais inteligente.&rdquo;
            </p>
          </div>

          {/* Tripla Conexão */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-[#C8102E] flex items-center justify-center font-bold">
                <Cpu size={20} />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Plataformas Líderes (OBT)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ecossistema tecnológico que inclui Argo Travel & Expense, WTS e Clara TravelPay, já homologado para o mercado brasileiro.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#DB8902] flex items-center justify-center font-bold">
                <Sliders size={20} />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Processos Estruturados</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fluxos de trabalho com alçadas de aprovação, política de antecedência mínima e regras de voos/hotéis auditadas em tempo real.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Headphones size={20} />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Suporte Humano Dedicado</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consultores experientes prontos para atuar onde a máquina não alcança: reacomodações de urgência, upgrades e negociações de grupo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* O QUE ENTREGAMOS (5 PILARES COM RECURSOS E WHATSAPP CONTEXTUAL) */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="bg-gradient-to-b from-[#FFFDFB] to-[#F8FAFC] border border-slate-200/90 rounded-[28px] p-8 md:p-12 shadow-sm space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200/80">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C8102E] block">
                O que entregamos · Pilares de Tecnologia
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight">
                Soluções para conectar viagens, despesas, pagamentos e relatórios
              </h2>
              <p className="text-slate-600 text-sm md:text-base">
                Conheça os 5 pilares tecnológicos integrados pela NC Turismo para proporcionar controle total aos gestores e fluidez absoluta aos viajantes.
              </p>
            </div>

            {/* Filtros interativos */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'todos', label: 'Todos os Pilares (5)' },
                { id: 'obt', label: 'Viagens & App' },
                { id: 'despesas', label: 'Despesas' },
                { id: 'pagamentos', label: 'Pagamentos' },
                { id: 'bi', label: 'BI & Dados' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActivePlatformFilter(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activePlatformFilter === tab.id
                      ? 'bg-[#C8102E] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid dos 5 Pilares */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPilares.map((pilar) => {
              const IconComp = pilar.icon;
              return (
                <div
                  key={pilar.num}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between hover:border-[#C8102E]/40 hover:shadow-md transition-all group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Top Tag & Number */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#DB8902]">
                        {pilar.num} · {pilar.tag}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-50 text-[#C8102E] border border-red-200/60">
                        {pilar.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 text-[#C8102E] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <IconComp size={20} />
                      </div>
                      <h3 className="text-lg font-bold text-[#0F172A] leading-snug group-hover:text-[#C8102E] transition-colors">
                        {pilar.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {pilar.desc}
                    </p>

                    {/* Bullet List */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      {pilar.items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <Check size={14} className="text-[#C8102E] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action WhatsApp Contextual */}
                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={`https://wa.me/554132811153?text=${encodeURIComponent(pilar.whatsappMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8102E] hover:text-[#DB8902] transition-colors cursor-pointer"
                    >
                      <MessageCircle size={14} />
                      <span>Saiba mais sobre {pilar.tag}</span>
                    </a>
                    <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-1 group-hover:text-[#C8102E] transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* INTEGRAÇÕES QUE APOIAM SUA OPERAÇÃO (11 ITENS) */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-8 md:p-12 shadow-sm space-y-8">
          
          <div className="space-y-3 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DB8902] block">
              Integrações que apoiam sua operação
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight leading-snug">
              Mais eficiência operacional e melhor experiência para usuários e gestores
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              As soluções utilizadas pela NC Turismo podem ser integradas aos processos corporativos para proporcionar maior eficiência operacional e uma jornada mais organizada para todos os envolvidos.
            </p>
          </div>

          {/* Grid dos 11 Recursos de Integração */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {integracoes.map((item, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-[#FAFCFF] border border-slate-200/80 hover:border-slate-300 flex items-start gap-3 hover:shadow-2xs transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={14} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A] leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* BENEFÍCIOS PARA SUA EMPRESA (id="beneficios-nc") */}
      <section id="beneficios-nc" className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16 scroll-mt-28">
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-8 md:p-12 shadow-sm space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DB8902] block">
              Benefícios para sua empresa
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight">
              Mais controle, autonomia e escalabilidade para sua operação
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Entenda como a combinação de tecnologia ágil e processos estruturados gera economia e empoderamento para o time.
            </p>
          </div>

          {/* Grid de 8 Benefícios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
            {beneficios.map((ben, idx) => {
              const BenIcon = ben.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#FAFCFF] border-l-4 border-l-[#C8102E] border border-slate-200/80 rounded-xl p-5 space-y-3 hover:border-slate-300 hover:shadow-xs transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-[#C8102E] border border-red-200/60">
                      {ben.badge}
                    </span>
                    <BenIcon size={16} className="text-[#DB8902]" />
                  </div>

                  <strong className="block text-base font-bold text-[#0F172A] leading-snug">
                    {ben.title}
                  </strong>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {ben.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* TECNOLOGIA COM ATENDIMENTO HUMANO */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-8 md:p-12 shadow-sm space-y-6">
          <div className="space-y-3 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C8102E] block">
              Tecnologia com Atendimento Humano
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight leading-snug">
              Tecnologia organiza processos. Pessoas resolvem situações.
            </h2>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              Por isso, combinamos plataformas especializadas com atendimento consultivo e suporte operacional para garantir mais eficiência, controle e segurança na gestão da mobilidade corporativa.
            </p>
          </div>

          <div className="border-l-4 border-[#DB8902] bg-gradient-to-r from-amber-50/60 to-transparent pl-6 pr-4 py-4 rounded-r-2xl">
            <p className="text-[#0F172A] font-semibold text-lg md:text-xl italic leading-relaxed">
              &ldquo;A tecnologia deve simplificar a operação — não afastar sua empresa de um atendimento especializado.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ECOSSISTEMA TECNOLÓGICO NC TURISMO (FERRAMENTAS) */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="bg-gradient-to-b from-[#FFFDFB] to-[#F8FAFC] border border-slate-200/90 rounded-[28px] p-8 md:p-12 shadow-sm space-y-8">
          
          <div className="space-y-3 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DB8902] block">
              Ecossistema Tecnológico NC Turismo
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight leading-snug">
              Ferramentas que apoiam a gestão completa da mobilidade corporativa
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Operamos com o melhor da tecnologia global e nacional, entregando soluções testadas e consolidadas para garantir máxima estabilidade e governança.
            </p>
          </div>

          {/* Cards das Ferramentas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ecossistema.map((tool, idx) => (
              <div 
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-red-200 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {tool.tag}
                    </span>
                    <Sparkles size={14} className="text-[#DB8902]" />
                  </div>

                  <h3 className="text-lg font-bold text-[#0F172A]">
                    {tool.name}
                  </h3>

                  <span className="text-xs font-semibold text-[#C8102E] block">
                    {tool.category}
                  </span>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl font-medium">
                  <strong className="text-slate-700 block mb-0.5">Destaque:</strong>
                  {tool.highlight}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* BANNER CTA DE ALTA CONVERSÃO */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div 
          className="relative overflow-hidden rounded-[32px] p-8 md:p-14 lg:p-16 text-center space-y-8 shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #FFFDFB 0%, #FFF4E5 40%, #FFE9CC 100%)',
            border: '1px solid rgba(219, 137, 2, 0.35)'
          }}
        >
          {/* Ambient spots */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-red-200/30 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-amber-200/40 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-amber-200 text-[#DB8902] text-xs font-bold uppercase tracking-widest shadow-2xs">
              <Sparkles size={13} className="text-[#C8102E]" /> Tecnologia & OBT · NC Turismo
            </span>

            <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-extrabold text-[#0F172A] tracking-tight leading-tight">
              Tecnologia para organizar. Experiência para resolver.
            </h2>

            <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal">
              Mais do que disponibilizar ferramentas, ajudamos empresas a transformar tecnologia em resultados, conectando pessoas, processos e informações para uma gestão mais inteligente da mobilidade corporativa.
            </p>

            <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal">
              Combinamos plataformas especializadas, processos estruturados e atendimento consultivo para apoiar empresas na gestão completa de viagens e despesas corporativas, garantindo mais eficiência, segurança e economia.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <a
              href="https://wa.me/554132811153?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20NC%20Turismo%20e%20gostaria%20de%20saber%20mais%20sobre%20tecnologia%20e%20integra%C3%A7%C3%B5es%20para%20viagens%20corporativas."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:brightness-105 active:scale-[0.99] transition-all shadow-xl shadow-red-500/25 cursor-pointer"
            >
              <MessageCircle size={18} />
              <span>Falar com a NC Turismo</span>
            </a>

            <button
              onClick={onOpenDiagnosis}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-[#0F172A] font-bold text-sm uppercase tracking-wider rounded-xl border border-slate-300 hover:border-slate-400 transition-all shadow-md cursor-pointer"
            >
              <span>Solicitar Demonstração</span>
              <ArrowRight size={16} className="text-[#C8102E]" />
            </button>
          </div>

          {/* Micro Footer */}
          <div className="pt-6 border-t border-amber-200/60 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 relative z-10">
            <a href="tel:04132811153" className="inline-flex items-center gap-2 hover:text-[#C8102E] transition-colors font-medium">
              <Phone size={14} className="text-[#DB8902]" /> (41) 3281-1153
            </a>
            <a href="mailto:corporativo@ncturismo.com.br" className="inline-flex items-center gap-2 hover:text-[#C8102E] transition-colors font-medium">
              <Mail size={14} className="text-[#DB8902]" /> corporativo@ncturismo.com.br
            </a>
            <span className="inline-flex items-center gap-2 font-medium">
              <MapPin size={14} className="text-[#DB8902]" /> Centro · Curitiba / PR
            </span>
          </div>

        </div>
      </section>

    </div>
  );
};
