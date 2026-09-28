import React, { useEffect, useState } from 'react';
import { 
  Receipt,
  FileCheck2, 
  CreditCard, 
  GitFork, 
  Building2, 
  ShieldCheck, 
  BarChart3, 
  Coins, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Sparkles,
  Check,
  Phone,
  Mail,
  MapPin,
  TrendingDown,
  Layers,
  Cpu,
  Clock,
  MessageCircle,
  FileText,
  PieChart,
  Sliders,
  DollarSign
} from 'lucide-react';

interface GestaoDespesasViewProps {
  onBackToHome: () => void;
  onOpenDiagnosis: () => void;
  onOpenLegalTab?: (tab: string) => void;
}

export const GestaoDespesasView: React.FC<GestaoDespesasViewProps> = ({
  onBackToHome,
  onOpenDiagnosis
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [activeTab, setActiveTab] = useState<'todos' | 'automacao' | 'governanca' | 'dados'>('todos');

  // 8 Recursos principais do "O que resolvemos"
  const recursos = [
    {
      num: '01',
      tag: 'Expense Management',
      category: 'automacao',
      icon: Receipt,
      title: 'Automatize prestação de contas e controle de despesas',
      desc: 'Elimine planilhas manuais e digitalize todo o fluxo de ponta a ponta.',
      items: [
        'Menos retrabalho operacional',
        'Mais transparência para auditoria',
        'Maior controle financeiro e limites',
        'Processos digitais e integrados ao ERP'
      ]
    },
    {
      num: '02',
      tag: 'Prestação de Contas',
      category: 'automacao',
      icon: FileCheck2,
      title: 'Centralize comprovantes, relatórios e justificativas',
      desc: 'Envio de recibos via foto, categorização instantânea e armazenamento em nuvem.',
      items: [
        'Eliminação de controles manuais e papéis',
        'Facilidade imediata para auditorias',
        'Mais agilidade na conferência contábil',
        'Melhor organização e rastreabilidade'
      ]
    },
    {
      num: '03',
      tag: 'Adiantamentos',
      category: 'governanca',
      icon: Coins,
      title: 'Controle solicitações, liberações e prestação de contas',
      desc: 'Gestão transparente de adiantamentos com conciliação automática pós-viagem.',
      items: [
        'Redução drástica de riscos de inadimplência',
        'Mais consistência nos processos financeiros',
        'Melhor acompanhamento do fluxo de caixa',
        'Menos divergências operacionais com viajantes'
      ]
    },
    {
      num: '04',
      tag: 'Cartões Corporativos',
      category: 'governanca',
      icon: CreditCard,
      title: 'Maior controle sobre gastos e conciliação',
      desc: 'Sincronização de faturas com despesas lançadas e extrato unificado.',
      items: [
        'Visibilidade em tempo real das transações',
        'Integração direta com relatórios financeiros',
        'Mais segurança e bloqueio de fraudes',
        'Controle fino sobre despesas autorizadas'
      ]
    },
    {
      num: '05',
      tag: 'Fluxos de Aprovação',
      category: 'governanca',
      icon: GitFork,
      title: 'Configure aprovações conforme a política da empresa',
      desc: 'Alçadas multinível por valor, centro de custo ou hierarquia funcional.',
      items: [
        'Governança corporativa reforçada',
        'Redução significativa de exceções não previstas',
        'Controle rigoroso de limites e alçadas',
        'Rastreabilidade total das aprovações'
      ]
    },
    {
      num: '06',
      tag: 'Centros de Custo',
      category: 'dados',
      icon: Building2,
      title: 'Associe despesas a áreas, projetos ou unidades',
      desc: 'Rateio inteligente entre múltiplos centros de custo e filiais da organização.',
      items: [
        'Controle detalhado por centro de resultado',
        'Apoio ao planejamento orçamentário anual',
        'Melhor distribuição e alocação dos gastos',
        'Informações confiáveis para tomadas de decisão'
      ]
    },
    {
      num: '07',
      tag: 'Compliance e Auditoria',
      category: 'governanca',
      icon: ShieldCheck,
      title: 'Conformidade com políticas e normas regulatórias',
      desc: 'Validação automática de recibos contra as regras de despesas da sua empresa.',
      items: [
        'Processos 100% auditáveis e certificados',
        'Mais segurança jurídica, tributária e fiscal',
        'Controle documental rigoroso com guarda segura',
        'Maior transparência operacional perante conselhos'
      ]
    },
    {
      num: '08',
      tag: 'Dashboards e Indicadores',
      category: 'dados',
      icon: BarChart3,
      title: 'Transforme dados em informações estratégicas',
      desc: 'Painéis analíticos em tempo real com métricas de gastos, savings e desvios.',
      items: [
        'Visão consolidada dos gastos corporativos',
        'Apoio direto à diretoria e tomadores de decisão',
        'Monitoramento contínuo de KPIs e SLAs',
        'Identificação de oportunidades reais de economia'
      ]
    }
  ];

  const filteredRecursos = activeTab === 'todos' 
    ? recursos 
    : recursos.filter(r => r.category === activeTab);

  // 8 Benefícios estruturados
  const beneficios = [
    {
      title: 'Redução do retrabalho operacional',
      desc: 'Menos controles manuais, conferências dispersas em planilhas e processos repetitivos.',
      icon: Clock,
      badge: 'Eficiência'
    },
    {
      title: 'Mais transparência e governança',
      desc: 'Informações rastreáveis, organizadas e com validação de conformidade.',
      icon: ShieldCheck,
      badge: 'Governança'
    },
    {
      title: 'Agilidade nas aprovações',
      desc: 'Fluxos claros para aprovação financeira pelo celular e controle rigoroso de alçadas.',
      icon: GitFork,
      badge: 'Velocidade'
    },
    {
      title: 'Controle por centro de custo',
      desc: 'Distribuição precisa de despesas por área, projeto, filial ou unidade de negócio.',
      icon: Building2,
      badge: 'Orçamento'
    },
    {
      title: 'Integração entre viagens e despesas',
      desc: 'Uma jornada conectada entre deslocamento, bilhete, hotel, gasto, aprovação e ERP.',
      icon: Layers,
      badge: 'Conectividade'
    },
    {
      title: 'Decisões estratégicas confiáveis',
      desc: 'Dados financeiros consistentes e em tempo real para apoiar o planejamento corporativo.',
      icon: PieChart,
      badge: 'Inteligência'
    },
    {
      title: 'Melhor experiência para usuários',
      desc: 'Mais simplicidade e autonomia para gestores, viajantes, financeiro e aprovadores.',
      icon: Sparkles,
      badge: 'Experiência'
    },
    {
      title: 'Maior controle sobre investimentos',
      desc: 'Visão clara sobre onde cada real de mobilidade corporativa está sendo investido.',
      icon: TrendingDown,
      badge: 'Saving'
    }
  ];

  const erpIntegrations = [
    'SAP (ECC & S/4HANA)',
    'TOTVS Protheus / Datasul',
    'Senior Sistemas',
    'Workday',
    'Oracle NetSuite',
    'Sankhya',
    'APIs Abertas / Webhooks',
    'Power BI & Excel Export'
  ];

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#C8102E] selection:text-white relative overflow-hidden">
      {/* Ambient background glows */}
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
            <Receipt size={13} className="text-[#DB8902]" /> Soluções Corporativas · Gestão de Despesas
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
              NC Turismo · Expense Management B2B
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
              Controle despesas corporativas com <span className="bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] bg-clip-text text-transparent">mais governança, visibilidade e eficiência</span>.
            </h1>

            <p className="text-base md:text-xl text-slate-600 leading-relaxed font-normal">
              Controlar despesas corporativas vai muito além do simples reembolso de gastos. É necessário garantir visibilidade, conformidade e integração entre viagens, pagamentos e processos financeiros.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="https://wa.me/554132811153?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20NC%20Turismo%20e%20gostaria%20de%20saber%20mais%20sobre%20gest%C3%A3o%20de%20despesas%20corporativas."
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
                Solicitar Diagnóstico Financeiro &rarr;
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">100%</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Sem Papel / Digital</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#C8102E] tracking-tight">Até 65%</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Menos tempo em prestação</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#DB8902] tracking-tight">Zero</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Divergência de alçadas</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">Multi-ERP</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Sincronização Contábil</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUÇÃO / CONCEITO ESTRATÉGICO */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-8 md:p-12 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DB8902]">
              Introdução · Visão Estratégica
            </span>
            <span className="h-1 w-8 bg-[#DB8902] rounded-full" />
          </div>

          <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight leading-snug">
            Viagens, pagamentos e despesas em uma gestão mais inteligente
          </h2>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-4xl">
            A NC Turismo combina tecnologia, atendimento especializado e inteligência de dados para ajudar empresas a controlar despesas, simplificar prestações de contas e melhorar a gestão financeira da mobilidade corporativa.
          </p>

          {/* Quote Block com destaque visual da marca */}
          <div className="border-l-4 border-[#C8102E] bg-gradient-to-r from-red-50/60 to-transparent pl-6 pr-4 py-4 rounded-r-2xl">
            <p className="text-[#0F172A] font-semibold text-lg md:text-xl italic leading-relaxed">
              &ldquo;Mais controle financeiro, menos retrabalho operacional e decisões baseadas em informações confiáveis.&rdquo;
            </p>
          </div>

          {/* 3 Pilares Conceituais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-[#C8102E] flex items-center justify-center font-bold">
                <Receipt size={20} />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Fluxo Digital de Despesas</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Captura fotográfica de recibos, leitura OCR e categorização imediata sem guardar papéis soltos.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#DB8902] flex items-center justify-center font-bold">
                <Sliders size={20} />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Governança e Políticas</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Parâmetros automáticos para limites diários, regras de alimentação, transporte e alçadas de diretoria.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Cpu size={20} />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Conciliação sem Erros</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Exportação e conciliação unificada direto para os módulos de contas a pagar do seu sistema ERP.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* O QUE RESOLVEMOS (8 RECURSOS PRINCIPAIS) */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="bg-gradient-to-b from-[#FFFDFB] to-[#F8FAFC] border border-slate-200/90 rounded-[28px] p-8 md:p-12 shadow-sm space-y-8">
          
          {/* Header da Seção */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200/80">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C8102E] block">
                O que resolvemos · Módulos Funcionais
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight">
                Recursos para simplificar despesas, aprovações e controle financeiro
              </h2>
              <p className="text-slate-600 text-sm md:text-base">
                Conheça os 8 recursos fundamentais integrados à gestão de despesas da NC Turismo para transformar a rotina do seu departamento financeiro.
              </p>
            </div>

            {/* Filtro rápido por tipo de necessidade */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'todos', label: 'Todos os Recursos (8)' },
                { id: 'automacao', label: 'Automação' },
                { id: 'governanca', label: 'Governança & Riscos' },
                { id: 'dados', label: 'Dados & BI' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#C8102E] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid dos 8 Recursos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredRecursos.map((rec) => {
              const IconComp = rec.icon;
              return (
                <div
                  key={rec.num}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between hover:border-[#C8102E]/40 hover:shadow-md transition-all group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Top Tag & Number */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#DB8902]">
                        {rec.num} · {rec.tag}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-[#C8102E] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconComp size={16} />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-[#0F172A] leading-snug group-hover:text-[#C8102E] transition-colors">
                      {rec.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {rec.desc}
                    </p>

                    {/* Bullet List */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      {rec.items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <Check size={14} className="text-[#C8102E] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100/60 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-[#DB8902] transition-colors">
                    <span>Módulo Integrado</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
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
              Mais transparência, governança e eficiência financeira
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Entenda como a estruturação correta de viagens e despesas gera economia mensurável, reduz o estresse da equipe financeira e garante total compliance.
            </p>
          </div>

          {/* Grid de 8 Benefícios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
            {beneficios.map((ben, idx) => {
              const BenIcon = ben.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#FAFCFF] border-l-4 border-l-[#DB8902] border border-slate-200/80 rounded-xl p-5 space-y-3 hover:border-slate-300 hover:shadow-xs transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-[#DB8902] border border-amber-200/60">
                      {ben.badge}
                    </span>
                    <BenIcon size={16} className="text-[#C8102E]" />
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

      {/* TECNOLOGIA + EXPERIÊNCIA (ECOSSISTEMA & INTEGRAÇÕES) */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-8 md:p-12 shadow-sm space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Lado Esquerdo: Texto & Citação */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C8102E] block">
                  Tecnologia + Experiência
                </span>
                <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight leading-snug">
                  Tecnologia para organizar. Experiência para resolver.
                </h2>
                <p className="text-slate-600 text-base leading-relaxed">
                  Combinamos plataformas especializadas, processos estruturados e atendimento consultivo para apoiar empresas na gestão completa de viagens e despesas corporativas, garantindo mais eficiência, segurança e economia.
                </p>
              </div>

              {/* Destaque / Quote */}
              <div className="border-l-4 border-[#DB8902] bg-gradient-to-r from-amber-50/60 to-transparent pl-6 pr-4 py-4 rounded-r-2xl">
                <p className="text-[#0F172A] font-semibold text-base md:text-lg italic leading-relaxed">
                  &ldquo;A boa gestão financeira começa quando dados, processos e pessoas trabalham na mesma direção.&rdquo;
                </p>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="https://wa.me/554132811153?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20NC%20Turismo%20e%20gostaria%20de%20conversar%20sobre%20integra%C3%A7%C3%A3o%20de%20despesas%20e%20viagens."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#DB8902] text-white text-xs font-bold uppercase tracking-wider hover:brightness-105 transition-all shadow-md shadow-red-500/20 cursor-pointer"
                >
                  <MessageCircle size={15} />
                  <span>Conversar com consultor técnico</span>
                </a>

                <button
                  onClick={onOpenDiagnosis}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <span>Mapear fluxo da sua empresa</span>
                </button>
              </div>
            </div>

            {/* Lado Direito: Card de Ecossistema de Integração */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#F8FAFC] to-[#FFF8F0] border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#DB8902]">
                  <Cpu size={14} /> Conectividade Total
                </div>
                <h4 className="text-lg font-bold text-[#0F172A]">
                  Pronto para integrar ao seu ERP
                </h4>
                <p className="text-xs text-slate-500">
                  Sem silos de informação. Os lançamentos de viagens e despesas fluem diretamente para sua contabilidade.
                </p>
              </div>

              <div className="space-y-2.5">
                {erpIntegrations.map((erp, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-red-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>{erp}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Homologado</span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200/80 text-xs text-[#C8102E] font-medium flex items-center gap-2.5">
                <ShieldCheck size={16} className="shrink-0" />
                <span>Compatível com padrões de auditoria externa e conformidade tributária.</span>
              </div>
            </div>
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
          {/* Decorative ambient spots */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-red-200/30 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-amber-200/40 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-amber-200 text-[#DB8902] text-xs font-bold uppercase tracking-widest shadow-2xs">
              <Sparkles size={13} className="text-[#C8102E]" /> Gestão de Despesas NC Turismo
            </span>

            <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-extrabold text-[#0F172A] tracking-tight leading-tight">
              Controle despesas com mais clareza, segurança e inteligência
            </h2>

            <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal">
              Ajudamos sua empresa a integrar viagens, despesas e processos financeiros em uma gestão mais eficiente, rastreável e orientada a resultados.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <a
              href="https://wa.me/554132811153?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20NC%20Turismo%20e%20gostaria%20de%20saber%20mais%20sobre%20gest%C3%A3o%20de%20despesas%20corporativas."
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
              <span>Solicitar Diagnóstico Gratuito</span>
              <ArrowRight size={16} className="text-[#C8102E]" />
            </button>
          </div>

          {/* Micro Footer com Contatos Diretos */}
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
