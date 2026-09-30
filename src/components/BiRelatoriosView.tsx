import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  FileSpreadsheet, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  ShieldCheck, 
  Coins, 
  CheckCircle2, 
  Building2, 
  Layers, 
  Sliders, 
  Calendar, 
  Plane, 
  Hotel, 
  Car, 
  Receipt, 
  AlertTriangle, 
  Target, 
  FileText,
  DollarSign,
  Download
} from 'lucide-react';

interface BiRelatoriosViewProps {
  onBackToHome: () => void;
  onOpenDiagnosis: () => void;
  onOpenLegalTab?: (tab: string) => void;
  onNavigateToSection?: (target: string) => void;
}

export const BiRelatoriosView: React.FC<BiRelatoriosViewProps> = ({
  onBackToHome,
  onOpenDiagnosis,
  onNavigateToSection
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [activeDeliveryFilter, setActiveDeliveryFilter] = useState<'todos' | 'relatorios' | 'gastos' | 'creditos' | 'kpis' | 'dashboards'>('todos');
  const [activeMetricTab, setActiveMetricTab] = useState<'saving' | 'politica' | 'creditos'>('saving');

  // 5 Recursos principais de "O que entregamos"
  const entregas = [
    {
      num: '01',
      tag: 'Relatórios Gerenciais',
      type: 'relatorios',
      icon: FileSpreadsheet,
      badge: 'Visão Detalhada',
      title: 'Acompanhe os principais indicadores da operação',
      desc: 'Extratos completos e estruturados para prestação de contas, conciliação e auditorias sem esforço manual.',
      whatsappMsg: 'Olá, quero saber mais sobre relatórios gerenciais da NC Turismo.',
      items: [
        'Despesas consolidadas por período e data de emissão',
        'Controle minucioso por centros de custo e filiais',
        'Alocação por projetos e unidades de negócio',
        'Histórico detalhado por viajante e solicitante',
        'Mapeamento dos destinos e rotas mais frequentes',
        'Relatório de volume com fornecedores utilizados'
      ]
    },
    {
      num: '02',
      tag: 'Controle de Gastos',
      type: 'gastos',
      icon: Receipt,
      badge: 'Gestão Orçamentária',
      title: 'Visibilidade sobre investimentos em viagens',
      desc: 'Entenda exatamente a composição de cada linha orçamentária de mobilidade corporativa.',
      whatsappMsg: 'Olá, quero saber mais sobre controle de gastos em viagens corporativas.',
      items: [
        'Monitoramento de passagens aéreas e tarifas médias',
        'Diárias médias de hospedagens por praça e categoria',
        'Locações de veículos e categorias contratadas',
        'Despesas corporativas em campo e reembolsos',
        'Consumo segmentado por área, diretoria ou departamento'
      ]
    },
    {
      num: '03',
      tag: 'Bilhetes não voados',
      type: 'creditos',
      icon: Coins,
      badge: 'Recuperação de Créditos',
      title: 'Monitore créditos e valores disponíveis',
      desc: 'Rastreabilidade total para evitar que bilhetes cancelados expirem e gerem prejuízos silenciosos.',
      whatsappMsg: 'Olá, quero saber mais sobre bilhetes não voados e créditos.',
      items: [
        'Painel em tempo real de créditos disponíveis com cias aéreas',
        'Histórico completo de utilização e reaproveitamento',
        'Alertas automatizados de controle de vencimentos de prazos',
        'Redução drástica de perdas financeiras na operação'
      ]
    },
    {
      num: '04',
      tag: 'Indicadores de Performance',
      type: 'kpis',
      icon: TrendingUp,
      badge: 'KPIs Executivos',
      title: 'Acompanhe a eficiência do programa de viagens',
      desc: 'Métricas preditivas para calibrar a política de viagens e garantir o cumprimento de metas de economia.',
      whatsappMsg: 'Olá, quero saber mais sobre indicadores de performance em viagens corporativas.',
      items: [
        'Antecedência média de compra (Lead Time)',
        'Taxa de aderência e compliance às políticas corporativas',
        'Índice de adoção dos acordos com fornecedores preferenciais',
        'Curva comparativa de evolução dos gastos mês a mês',
        'Indicadores reais de saving gerado nas negociações'
      ]
    },
    {
      num: '05',
      tag: 'Dashboards',
      type: 'dashboards',
      icon: BarChart3,
      badge: 'Visual Analytics',
      title: 'Visualização de dados para decisão',
      desc: 'Painéis visuais dinâmicos, interativos e intuitivos, projetados para a diretoria e CFOs.',
      whatsappMsg: 'Olá, quero saber mais sobre dashboards e BI da NC Turismo.',
      items: [
        'Visão executiva consolidada em gráficos interativos',
        'Indicadores e métricas atualizados em tempo real',
        'Comparativos históricos trimestrais e anuais',
        'Filtros instantâneos por centro de custo e categorias',
        'Apoio técnico direto à gestão estratégica corporativa'
      ]
    }
  ];

  const filteredEntregas = activeDeliveryFilter === 'todos'
    ? entregas
    : entregas.filter(e => e.type === activeDeliveryFilter);

  // 6 Benefícios para sua empresa
  const beneficios = [
    {
      title: 'Maior transparência operacional',
      desc: 'Informações organizadas para acompanhar a operação com clareza, eliminando pontos cegos no fluxo de mobilidade.',
      badge: 'Transparência',
      icon: ShieldCheck
    },
    {
      title: 'Controle financeiro aprimorado',
      desc: 'Mais visibilidade sobre gastos, centros de custo e investimentos corporativos em tempo real.',
      badge: 'Controle Fino',
      icon: Coins
    },
    {
      title: 'Apoio ao planejamento orçamentário',
      desc: 'Dados estruturados para prever, revisar e planejar despesas futuras com base em tendências históricas reais.',
      badge: 'Orçamento',
      icon: Building2
    },
    {
      title: 'Oportunidades de economia',
      desc: 'Identifique padrões de consumo, gargalos de antecedência e oportunidades concretas de redução sustentável de custos.',
      badge: 'Saving Real',
      icon: Target
    },
    {
      title: 'Decisões baseadas em dados',
      desc: 'Menos achismo e mais inteligência analítica na gestão, com dados prontos para reuniões de conselho e comitês.',
      badge: 'Inteligência',
      icon: TrendingUp
    },
    {
      title: 'Mais governança e conformidade',
      desc: 'Relatórios e indicadores que apoiam auditorias internas e externas, compliance e regras fiscais.',
      badge: 'Governança',
      icon: Sparkles
    }
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
            <BarChart3 size={13} className="text-[#DB8902]" /> Soluções Corporativas · BI e Relatórios
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
              NC Turismo · Business Intelligence & Analytics
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
              Transforme dados em <span className="bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] bg-clip-text text-transparent">decisões estratégicas</span>.
            </h1>

            <p className="text-base md:text-xl text-slate-600 leading-relaxed font-normal">
              Informação sem análise gera trabalho. Análise sem informação gera risco. A NC Turismo disponibiliza relatórios gerenciais e recursos de Business Intelligence para apoiar decisões relacionadas à mobilidade corporativa.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="https://wa.me/554132811153?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20NC%20Turismo%20e%20gostaria%20de%20saber%20mais%20sobre%20BI%20e%20relat%C3%B3rios%20para%20viagens%20corporativas."
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
                Solicitar Demonstração de BI &rarr;
              </button>
            </div>

            {/* Micro Metrics Bar */}
            <div className="pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">100%</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Visibilidade de Gastos</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#C8102E] tracking-tight">Até 22%</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Economia Média (Saving)</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#DB8902] tracking-tight">Zero</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Créditos Esquecidos</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">Real-Time</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Dashboards & Exportação</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTELIGÊNCIA DE DADOS (VISÃO CONCEITUAL) */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-8 md:p-12 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DB8902]">
              Inteligência de Dados · Visão Executiva
            </span>
            <span className="h-1 w-8 bg-[#DB8902] rounded-full" />
          </div>

          <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight leading-snug">
            Dados organizados para apoiar a gestão da mobilidade corporativa
          </h2>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-4xl">
            Acompanhamos despesas, padrões de consumo, fornecedores, centros de custo e indicadores operacionais para identificar oportunidades de economia e apoiar decisões mais estratégicas.
          </p>

          {/* Destaque / Citação */}
          <div className="border-l-4 border-[#C8102E] bg-gradient-to-r from-red-50/60 to-transparent pl-6 pr-4 py-4 rounded-r-2xl">
            <p className="text-[#0F172A] font-semibold text-lg md:text-xl italic leading-relaxed">
              &ldquo;Mais do que visualizar números, ajudamos sua empresa a transformar dados em ações.&rdquo;
            </p>
          </div>

          {/* Três Frentes Analíticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-[#C8102E] flex items-center justify-center font-bold">
                <PieChart size={20} />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Composição de Custos</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mapeamento por categoria (aéreo, hotelaria, locação, traslados) e por centro de custo para identificar concentrações de despesa.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#DB8902] flex items-center justify-center font-bold">
                <Sliders size={20} />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Aderência e Compliance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Métricas de compra com antecedência ideal e auditoria automática de compras fora da política estabelecida pela empresa.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Saving e Negociação</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Comparativo entre a tarifa cheia e a tarifa negociada pela NC Turismo, comprovando a economia gerada em cada fechamento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DEMONSTRAÇÃO VISUAL / DASHBOARD PREVIEW WIDGET */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 md:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#DB8902] font-bold">
                Preview do Dashboard Executivo
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-[#0F172A] mt-1">
                Visão consolidada de indicadores-chave
              </h3>
            </div>

            {/* Abas do Simulador */}
            <div className="flex p-1 bg-slate-100 rounded-xl">
              {[
                { id: 'saving', label: 'Saving & Economia' },
                { id: 'politica', label: 'Compliance & SLA' },
                { id: 'creditos', label: 'Bilhetes & Créditos' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveMetricTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeMetricTab === tab.id
                      ? 'bg-white text-[#C8102E] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conteúdo Dinâmico da Demonstração */}
          {activeMetricTab === 'saving' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
              <div className="p-5 rounded-2xl bg-[#FAFCFF] border border-slate-200/90 space-y-1">
                <span className="text-xs text-slate-500 font-medium">Economia Total Gerada</span>
                <div className="text-2xl font-extrabold text-emerald-600">R$ 284.450</div>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <TrendingUp size={12} className="text-emerald-500" /> +18.4% vs período anterior
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAFCFF] border border-slate-200/90 space-y-1">
                <span className="text-xs text-slate-500 font-medium">Tarifa Média Praticada</span>
                <div className="text-2xl font-extrabold text-[#0F172A]">R$ 685,00</div>
                <p className="text-[11px] text-slate-500">14% abaixo da média de mercado</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAFCFF] border border-slate-200/90 space-y-1">
                <span className="text-xs text-slate-500 font-medium">Acordos Corporativos</span>
                <div className="text-2xl font-extrabold text-[#DB8902]">84.2%</div>
                <p className="text-[11px] text-slate-500">Emitidos com desconto negociado</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAFCFF] border border-slate-200/90 space-y-1">
                <span className="text-xs text-slate-500 font-medium">Volume Transacionado</span>
                <div className="text-2xl font-extrabold text-[#C8102E]">R$ 1.42 M</div>
                <p className="text-[11px] text-slate-500">Conciliado sem inconsistências</p>
              </div>
            </div>
          )}

          {activeMetricTab === 'politica' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
              <div className="p-5 rounded-2xl bg-[#FAFCFF] border border-slate-200/90 space-y-1">
                <span className="text-xs text-slate-500 font-medium">Aderência à Política</span>
                <div className="text-2xl font-extrabold text-emerald-600">96.8%</div>
                <p className="text-[11px] text-slate-500">Dentro dos limites de teto</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAFCFF] border border-slate-200/90 space-y-1">
                <span className="text-xs text-slate-500 font-medium">Antecedência Média</span>
                <div className="text-2xl font-extrabold text-[#0F172A]">18.4 dias</div>
                <p className="text-[11px] text-slate-500">Meta recomendada: 14 dias</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAFCFF] border border-slate-200/90 space-y-1">
                <span className="text-xs text-slate-500 font-medium">Tempo de Aprovação</span>
                <div className="text-2xl font-extrabold text-[#DB8902]">2h 15m</div>
                <p className="text-[11px] text-slate-500">Aprovação ágil pelo smartphone</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAFCFF] border border-slate-200/90 space-y-1">
                <span className="text-xs text-slate-500 font-medium">Exceções Justificadas</span>
                <div className="text-2xl font-extrabold text-slate-700">3.2%</div>
                <p className="text-[11px] text-slate-500">Auditadas e com motivo formal</p>
              </div>
            </div>
          )}

          {activeMetricTab === 'creditos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
              <div className="p-5 rounded-2xl bg-[#FAFCFF] border border-slate-200/90 space-y-1">
                <span className="text-xs text-slate-500 font-medium">Créditos Recuperados</span>
                <div className="text-2xl font-extrabold text-emerald-600">R$ 94.120</div>
                <p className="text-[11px] text-slate-500">Reutilizados em novos voos</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAFCFF] border border-slate-200/90 space-y-1">
                <span className="text-xs text-slate-500 font-medium">Taxa de Reutilização</span>
                <div className="text-2xl font-extrabold text-[#0F172A]">98.2%</div>
                <p className="text-[11px] text-slate-500">Zero créditos vencidos no mês</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAFCFF] border border-slate-200/90 space-y-1">
                <span className="text-xs text-slate-500 font-medium">Créditos em Aberto</span>
                <div className="text-2xl font-extrabold text-[#DB8902]">R$ 14.800</div>
                <p className="text-[11px] text-slate-500">Com validade superior a 90 dias</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAFCFF] border border-slate-200/90 space-y-1">
                <span className="text-xs text-slate-500 font-medium">Alertas Preventivos</span>
                <div className="text-2xl font-extrabold text-[#C8102E]">Automáticos</div>
                <p className="text-[11px] text-slate-500">Avisos antes da expiração</p>
              </div>
            </div>
          )}

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" />
              Sincronização diária de dados via API e OBT
            </span>
            <span className="font-mono">Exportações disponíveis em Excel, PDF e conexão Power BI</span>
          </div>
        </div>
      </section>

      {/* O QUE ENTREGAMOS (5 RECURSOS FUNDAMENTAIS) */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="bg-gradient-to-b from-[#FFFDFB] to-[#F8FAFC] border border-slate-200/90 rounded-[28px] p-8 md:p-12 shadow-sm space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200/80">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C8102E] block">
                O que entregamos · Módulos de BI
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight">
                Relatórios, indicadores e dashboards para gestão estratégica
              </h2>
              <p className="text-slate-600 text-sm md:text-base">
                Conheça os 5 principais módulos de entrega em inteligência de dados da NC Turismo.
              </p>
            </div>

            {/* Filtros interativos */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'todos', label: 'Todos os Módulos (5)' },
                { id: 'relatorios', label: 'Relatórios' },
                { id: 'gastos', label: 'Gastos' },
                { id: 'creditos', label: 'Bilhetes' },
                { id: 'kpis', label: 'KPIs' },
                { id: 'dashboards', label: 'Dashboards' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDeliveryFilter(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeDeliveryFilter === tab.id
                      ? 'bg-[#C8102E] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid dos 5 Recursos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntregas.map((rec) => {
              const IconComp = rec.icon;
              return (
                <div
                  key={rec.num}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 flex flex-col justify-between hover:border-[#C8102E]/40 hover:shadow-md transition-all group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Top Tag & Number */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#DB8902]">
                        {rec.num} · {rec.tag}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-50 text-[#C8102E] border border-red-200/60">
                        {rec.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 text-[#C8102E] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <IconComp size={22} />
                      </div>
                      <h3 className="text-lg font-bold text-[#0F172A] leading-snug group-hover:text-[#C8102E] transition-colors">
                        {rec.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {rec.desc}
                    </p>

                    {/* Bullet List */}
                    <div className="pt-4 border-t border-slate-100 space-y-2.5">
                      {rec.items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                          <Check size={14} className="text-[#C8102E] shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action WhatsApp */}
                  <div className="pt-5 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={`https://wa.me/554132811153?text=${encodeURIComponent(rec.whatsappMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8102E] hover:text-[#DB8902] transition-colors cursor-pointer"
                    >
                      <MessageCircle size={14} />
                      <span>Saiba mais sobre {rec.tag}</span>
                    </a>
                    <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-1 group-hover:text-[#C8102E] transition-transform" />
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
              Mais governança, controle e clareza para decidir
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Descubra como o Business Intelligence da NC Turismo transforma números operacionais em alavancas de eficiência para o departamento financeiro.
            </p>
          </div>

          {/* Grid de 6 Benefícios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            {beneficios.map((ben, idx) => {
              const BenIcon = ben.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#FAFCFF] border-l-4 border-l-[#DB8902] border border-slate-200/80 rounded-xl p-5 space-y-3 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
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
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* INFORMAÇÃO QUE GERA RESULTADO */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-8 md:p-12 shadow-sm space-y-6">
          <div className="space-y-3 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C8102E] block">
              Informação que gera resultado
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight leading-snug">
              Indicadores, tendências e ação rápida diante das oportunidades
            </h2>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              A gestão eficiente das viagens corporativas depende da capacidade de acompanhar indicadores, entender tendências e agir rapidamente diante das oportunidades.
            </p>
          </div>

          <div className="border-l-4 border-[#DB8902] bg-gradient-to-r from-amber-50/60 to-transparent pl-6 pr-4 py-4 rounded-r-2xl">
            <p className="text-[#0F172A] font-semibold text-lg md:text-xl italic leading-relaxed">
              &ldquo;Combinamos tecnologia, inteligência de dados e atendimento especializado para transformar informações em resultados para sua empresa.&rdquo;
            </p>
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
              <Sparkles size={13} className="text-[#C8102E]" /> Business Intelligence · NC Turismo
            </span>

            <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-extrabold text-[#0F172A] tracking-tight leading-tight">
              Dados para analisar. Informações para decidir.
            </h2>

            <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal">
              Ajudamos gestores, financeiro, RH e áreas estratégicas a enxergar sua operação de viagens de forma clara, organizada e orientada a resultados.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <a
              href="https://wa.me/554132811153?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20NC%20Turismo%20e%20gostaria%20de%20saber%20mais%20sobre%20BI%20e%20relat%C3%B3rios%20para%20viagens%20corporativas."
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
              <span>Solicitar Diagnóstico sem Custo</span>
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
