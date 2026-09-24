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
    <div className="pt-28 pb-20 min-h-screen bg-nc-space text-nc-warm selection:bg-nc-orange selection:text-white">
      {/* Breadcrumb / Top bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-nc-warm/60 hover:text-white transition-colors text-xs font-mono uppercase tracking-wider"
          >
            <ArrowLeft size={16} /> Voltar à página principal
          </button>

          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nc-orange/10 border border-nc-orange/30 text-nc-orange text-xs font-mono font-medium">
            <Sparkles size={13} /> Ecossistema Corporativo NC Turismo
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121620] via-nc-surface to-[#0d0f14] border border-white/10 p-8 md:p-16 lg:p-20 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-nc-orange/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-nc-warm/90 text-xs font-mono tracking-widest uppercase mb-6">
              Visão Geral da Solução
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.05] mb-6">
              VIAGENS CORPORATIVAS
            </h1>

            <p className="text-xl md:text-2xl text-nc-orange font-medium mb-6">
              Sua empresa viaja. A NC transforma essas viagens em gestão, dados e eficiência.
            </p>

            <p className="text-base md:text-lg text-nc-warm/80 leading-relaxed mb-10">
              Mais do que emitir bilhetes, estruturamos uma operação completa de <strong className="text-white">Business Travel & Expense (T&E)</strong>. Unimos tecnologia integrada ao seu ERP, consultoria sênior humanizada 24h e inteligência de dados que reduz até 22% dos custos reais de viagem.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenDiagnosis}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-nc-orange text-nc-space font-bold text-sm uppercase tracking-wider rounded-full hover:bg-white transition-all shadow-lg hover:shadow-nc-orange/20"
              >
                Solicitar diagnóstico gratuito <ArrowRight size={16} />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('pilares-corporativos');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 text-white font-medium text-sm uppercase tracking-wider rounded-full hover:bg-white/10 transition-colors"
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
          <h2 className="text-xs font-mono text-nc-orange uppercase tracking-[0.2em] mb-3">
            Estrutura da Solução
          </h2>
          <p className="text-3xl md:text-4xl font-display font-bold text-white">
            Os Cinco Pilares do Ecossistema Corporativo
          </p>
          <p className="text-nc-warm/70 text-sm mt-4">
            Cada pilar atua integrado, garantindo controle orçamentário para o CFO, conformidade para o gestor e tranquilidade para o viajante.
          </p>
        </div>

        <div className="space-y-6">
          {pillars.map((pillar, index) => {
            const IconComponent = pillar.icon;
            return (
              <div 
                key={pillar.id}
                className="group relative bg-nc-surface/60 hover:bg-nc-surface/90 border border-white/10 hover:border-nc-orange/40 rounded-2xl p-8 md:p-10 transition-all duration-300 shadow-lg"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                  {/* Left Column: Icon & Titles */}
                  <div className="lg:w-5/12">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-nc-orange/10 border border-nc-orange/20 flex items-center justify-center text-nc-orange">
                        <IconComponent size={24} />
                      </div>
                      <div>
                        <span className="text-xs font-mono text-nc-orange font-bold uppercase tracking-wider">
                          {pillar.tag}
                        </span>
                        <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-nc-orange transition-colors">
                          {pillar.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-nc-warm/90 mb-3">
                      {pillar.subtitle}
                    </p>
                    <p className="text-xs md:text-sm text-nc-warm/70 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Middle Column: Key Highlights */}
                  <div className="lg:w-4/12 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-8">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-nc-warm/50 mb-3">
                      Entregáveis do Pilar
                    </h4>
                    <ul className="space-y-2.5">
                      {pillar.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2.5 text-xs md:text-sm text-nc-warm/80">
                          <CheckCircle2 size={16} className="text-nc-orange shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right Column: CTA */}
                  <div className="lg:w-3/12 flex flex-col justify-center items-start lg:items-end w-full">
                    <button
                      onClick={() => handleGoToSolution(pillar.solutionId)}
                      className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/5 hover:bg-nc-orange hover:text-nc-space border border-white/10 hover:border-nc-orange text-white text-xs font-bold uppercase tracking-wider transition-all"
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
        <div className="rounded-3xl bg-gradient-to-r from-nc-surface via-[#181d28] to-nc-surface border border-nc-orange/30 p-8 md:p-12 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white">
              Pronto para transformar a gestão de viagens da sua empresa?
            </h3>
            <p className="text-nc-warm/80 text-sm md:text-base leading-relaxed">
              Solicite uma análise sem custos da sua política de viagens e identifique oportunidades imediatas de otimização, economia e atendimento com a NC Turismo.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <button
                onClick={onOpenDiagnosis}
                className="px-8 py-4 bg-nc-orange text-nc-space font-bold text-sm uppercase tracking-wider rounded-full hover:bg-white transition-all shadow-xl"
              >
                Solicitar Diagnóstico Gratuito
              </button>
              <button
                onClick={onBackToHome}
                className="px-6 py-4 bg-white/10 text-white font-medium text-sm uppercase tracking-wider rounded-full hover:bg-white/20 transition-all"
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
