import React from 'react';
import { 
  Building2, 
  Cpu, 
  BarChart3, 
  ShieldCheck, 
  Headphones, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Sparkles,
  TrendingDown,
  Lock,
  Globe2,
  FileCheck
} from 'lucide-react';

interface ViagensCorporativasViewProps {
  onBackToHome: () => void;
  onOpenDiagnosis: () => void;
  onSelectSolutionSection?: (solutionId: string) => void;
}

export const ViagensCorporativasView: React.FC<ViagensCorporativasViewProps> = ({
  onBackToHome,
  onOpenDiagnosis,
  onSelectSolutionSection
}) => {
  const handleGoToSolution = (solutionId: string) => {
    if (onSelectSolutionSection) {
      onSelectSolutionSection(solutionId);
    } else {
      window.location.hash = 'solucoes';
      setTimeout(() => {
        const el = document.getElementById('solucoes');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const pillars = [
    {
      id: 'gestao',
      title: 'GESTÃO',
      subtitle: 'Gestão de viagens e despesas',
      icon: Building2,
      tag: 'Pilar 01',
      description: 'Parametrização completa da sua política de viagens, alçadas de aprovação em multiníveis e conciliação ágil de despesas corporativas para eliminar desvios antes do faturamento.',
      items: [
        'Aprovações multiníveis e centros de custos integrados',
        'Gestão e prestação automatizada de despesas (T&E)',
        'Auditoria prévia e bloqueio preventivo fora da política'
      ],
      solutionId: 'planejamento'
    },
    {
      id: 'tecnologia',
      title: 'TECNOLOGIA',
      subtitle: 'Integrações e automação de ponta a ponta',
      icon: Cpu,
      tag: 'Pilar 02',
      description: 'Plataforma unificada com self-booking inteligente Web e Mobile, APIs abertas e conectores nativos para os principais ERPs e sistemas de RH do mercado (SAP, TOTVS, Senior, Workday).',
      items: [
        'Conexão direta com ERP financeiro e folha de pagamento',
        'Self-booking intuitivo para viajantes e secretárias executivas',
        'Single Sign-On (SSO) com máxima segurança corporativa'
      ],
      solutionId: 'tecnologia'
    },
    {
      id: 'inteligencia',
      title: 'INTELIGÊNCIA',
      subtitle: 'BI analítico e relatórios estratégicos',
      icon: BarChart3,
      tag: 'Pilar 03',
      description: 'Transformamos dados brutos em decisões orçamentárias estratégicas. Dashboards em tempo real com mapeamento de rotas, savings gerados e inteligência para negociação de tarifas-acordo.',
      items: [
        'Dashboard dinâmico de savings obtidos vs. metas',
        'Relatórios detalhados exportáveis para diretoria financeira',
        'Mapeamento estratégico para negociações de volume hoteleiro e aéreo'
      ],
      solutionId: 'bi'
    },
    {
      id: 'seguranca',
      title: 'SEGURANÇA & GOVERNANÇA',
      subtitle: 'Compliance, Duty of Care e ESG',
      icon: ShieldCheck,
      tag: 'Pilar 04',
      description: 'Rastreabilidade em tempo real dos viajantes da sua empresa em qualquer lugar do mundo, rigorosa conformidade com a LGPD e relatórios periódicos de emissão de carbono (CO₂) por rota.',
      items: [
        'Duty of care: localização e assistência imediata de colaboradores',
        'Conformidade integral com LGPD e auditoria de dados',
        'Cálculo e compensação de pegada de carbono por viagem corporativa'
      ],
      solutionId: 'compliance'
    },
    {
      id: 'suporte',
      title: 'SUPORTE',
      subtitle: 'Atendimento consultivo 24 horas humanizado',
      icon: Headphones,
      tag: 'Pilar 05',
      description: 'Plantão executivo próprio e ininterrupto 365 dias ao ano, operado por consultores seniores bilíngues prontos para atuar em remarcações e emergências sem filas ou robôs.',
      items: [
        'Tempo médio de resposta humano menor que 15 segundos',
        'Plantão executivo bilíngue 24h sem robôs intermediários',
        'Gestão ativa de no-shows, voos cancelados e contingências'
      ],
      solutionId: 'atendimento'
    }
  ];

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#C8102E] selection:text-white relative overflow-hidden">
      {/* Soft atmospheric background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-red-100/30 via-orange-50/20 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[600px] right-0 w-[500px] h-[600px] bg-gradient-to-l from-amber-100/25 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-0 w-[600px] h-[600px] bg-gradient-to-r from-red-100/20 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Breadcrumb / Top bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-5">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-[#C8102E] transition-colors text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft size={16} /> Voltar à página principal
          </button>

          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/80 text-[#C8102E] text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles size={13} className="text-[#DB8902]" /> Ecossistema Corporativo NC Turismo
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
        <div 
          className="relative overflow-hidden rounded-[32px] border border-red-200/80 p-8 md:p-14 lg:p-16 shadow-xl shadow-red-500/5"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFDFB 45%, #FFF6EC 100%)'
          }}
        >
          {/* Top colored indicator bar: #C8102E to #DB8902 */}
          <div 
            className="w-[88px] h-[5px] rounded-full mb-8"
            style={{ background: 'linear-gradient(90deg, #C8102E, #DB8902)' }}
          />

          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#C8102E] text-xs font-bold tracking-widest uppercase mb-6 shadow-2xs">
              Visão Geral da Solução
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-extrabold text-[#0F172A] tracking-tight leading-[1.05] mb-6">
              VIAGENS <span className="bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] bg-clip-text text-transparent">CORPORATIVAS</span>
            </h1>

            <p className="text-xl md:text-2xl text-[#C8102E] font-bold mb-6">
              Sua empresa viaja. A NC transforma essas viagens em gestão, dados e eficiência.
            </p>

            <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-10 font-normal">
              Mais do que emitir bilhetes, estruturamos uma operação completa de <strong className="text-[#0F172A] font-semibold">Business Travel &amp; Expense (T&amp;E)</strong>. Unimos tecnologia integrada ao seu ERP, consultoria sênior humanizada 24h e inteligência de dados que reduz até 22% dos custos reais de viagem.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenDiagnosis}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:brightness-105 transition-all shadow-xl shadow-red-500/25 cursor-pointer"
              >
                Solicitar diagnóstico gratuito <ArrowRight size={16} />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('pilares-corporativos');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-4 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-700 hover:text-[#C8102E] font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Explorar os 5 Pilares
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section id="pilares-corporativos" className="max-w-7xl mx-auto px-6 md:px-12 mb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-[#C8102E] uppercase tracking-[0.2em] mb-3">
            Estrutura da Solução
          </h2>
          <p className="text-3xl md:text-4xl font-display font-bold text-[#0F172A]">
            Os Cinco Pilares do Ecossistema Corporativo
          </p>
          <p className="text-slate-600 text-sm md:text-base mt-4">
            Cada pilar atua integrado, garantindo controle orçamentário para o CFO, conformidade para o gestor e tranquilidade para o viajante.
          </p>
        </div>

        <div className="space-y-6">
          {pillars.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <div 
                key={pillar.id}
                className="group relative bg-white hover:bg-gradient-to-r hover:from-white hover:to-orange-50/20 border border-slate-200/90 hover:border-red-300 rounded-3xl p-8 md:p-10 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-red-500/5"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                  {/* Left Column: Icon & Titles */}
                  <div className="lg:w-5/12">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 flex items-center justify-center text-[#C8102E] group-hover:scale-110 transition-transform shadow-2xs">
                        <IconComponent size={24} />
                      </div>
                      <div>
                        <span className="text-xs font-mono text-[#DB8902] font-bold uppercase tracking-wider">
                          {pillar.tag}
                        </span>
                        <h3 className="text-xl md:text-2xl font-bold text-[#0F172A] group-hover:text-[#C8102E] transition-colors">
                          {pillar.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-[#C8102E] mb-2">
                      {pillar.subtitle}
                    </p>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Middle Column: Key Highlights */}
                  <div className="lg:w-4/12 border-t lg:border-t-0 lg:border-l border-slate-200/90 pt-4 lg:pt-0 lg:pl-8">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3">
                      Entregáveis do Pilar
                    </h4>
                    <ul className="space-y-2.5">
                      {pillar.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700 font-medium">
                          <CheckCircle2 size={16} className="text-[#DB8902] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right Column: CTA */}
                  <div className="lg:w-3/12 flex flex-col justify-center items-start lg:items-end w-full">
                    <button
                      onClick={() => handleGoToSolution(pillar.solutionId)}
                      className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-50 hover:bg-gradient-to-r hover:from-[#C8102E] hover:to-[#DB8902] text-slate-700 hover:text-white border border-slate-200 hover:border-transparent text-xs font-bold uppercase tracking-wider transition-all shadow-2xs hover:shadow-md cursor-pointer"
                    >
                      Saiba mais no painel <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Conversion Box */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <div 
          className="rounded-[32px] p-8 md:p-14 text-center text-white shadow-2xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #C8102E 0%, #D32F2F 50%, #DB8902 100%)',
            boxShadow: '0 16px 38px rgba(200, 16, 46, 0.25)'
          }}
        >
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-white/90 block">
              NC Turismo · Soluções Corporativas
            </span>
            <h3 className="text-2xl md:text-4xl font-display font-bold text-white tracking-tight leading-tight">
              Pronto para transformar a gestão de viagens da sua empresa?
            </h3>
            <p className="text-white/90 text-sm md:text-base font-normal leading-relaxed">
              Solicite uma análise sem custos da sua política de viagens e identifique oportunidades imediatas de otimização, economia e atendimento com a NC Turismo.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <button
                onClick={onOpenDiagnosis}
                className="px-8 py-4 bg-white text-[#C8102E] font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-slate-50 transition-all shadow-xl hover:scale-[1.02] cursor-pointer"
              >
                Solicitar Diagnóstico Gratuito
              </button>
              <button
                onClick={onBackToHome}
                className="px-6 py-4 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Voltar à Página Principal
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
