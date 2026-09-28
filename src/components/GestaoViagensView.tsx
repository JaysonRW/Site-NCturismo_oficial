import React, { useEffect } from 'react';
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
  Clock,
  Check,
  Phone,
  Mail,
  MapPin,
  Award,
  Zap,
  Smartphone,
  FileSpreadsheet,
  FileCheck2,
  Users2,
  CalendarCheck,
  MessageCircle
} from 'lucide-react';

interface GestaoViagensViewProps {
  onBackToHome: () => void;
  onOpenDiagnosis: () => void;
  onOpenLegalTab?: (tab: string) => void;
}

export const GestaoViagensView: React.FC<GestaoViagensViewProps> = ({
  onBackToHome,
  onOpenDiagnosis
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const metrics = [
    {
      value: '99.4%',
      label: 'SLA de Atendimento',
      desc: 'Índice de resolutividade e excelência nas solicitações.'
    },
    {
      value: '+12.000',
      label: 'Empresas atendidas',
      desc: 'Ao longo da nossa história e trajetória.'
    },
    {
      value: '+335',
      label: 'Clientes corporativos ativos',
      desc: 'Empresas com operação recorrente.'
    },
    {
      value: '24/7',
      label: 'Suporte ao viajante',
      desc: 'Porque viagem de negócios não tem horário comercial.'
    }
  ];

  const tacCiclo = [
    {
      letter: 'T',
      title: 'Tecnologia: plataformas de gestão',
      desc: 'Utilizamos as melhores plataformas do mercado para colocar o controle nas mãos da sua empresa, integrando aprovações e orçamentos em tempo real.',
      icon: Cpu,
      color: 'from-red-500 to-rose-600'
    },
    {
      letter: 'A',
      title: 'Atendimento: pessoas de verdade, 24/7',
      desc: 'Quando acontece um imprevisto, sua empresa não fica dependente de chatbot. Atendemos todos os dias, a qualquer hora, com equipe sênior dedicada.',
      icon: Headphones,
      color: 'from-amber-500 to-orange-600'
    },
    {
      letter: 'C',
      title: 'Consultoria: além da reserva',
      desc: 'Ajudamos sua empresa a estruturar ou revisar a política de viagens, negociar tarifas corporativas com redes hoteleiras e cias aéreas, e identificar pontos de economia.',
      icon: BarChart3,
      color: 'from-[#C8102E] to-[#DB8902]'
    }
  ];

  const plataformas = [
    {
      title: 'Self-booking inteligente',
      desc: 'Colaboradores pesquisam e reservam passagens aéreas, hotéis e rodoviário em uma única interface, já dentro das regras e limites da empresa.',
      icon: Smartphone
    },
    {
      title: 'Workflow de aprovação configurável',
      desc: 'Cada solicitação segue o fluxo definido por valor, centro de custo ou hierarquia, com registro auditável e histórico completo do processo.',
      icon: FileCheck2
    },
    {
      title: 'Relatórios e visibilidade total',
      desc: 'Acompanhe gastos por colaborador, departamento, centro de custo ou projeto — com métricas claras sem precisar esperar o fechamento contábil.',
      icon: BarChart3
    },
    {
      title: 'App mobile corporativo',
      desc: 'Disponível para Android e iOS, em português, inglês e espanhol, para o viajante consultar itinerários e gerenciar a viagem de qualquer lugar.',
      icon: Zap
    }
  ];

  const resultados = [
    {
      metric: '-30%',
      title: 'Redução em custos de viagem',
      desc: 'Com planejamento prévio, cumprimento de política e gestão profissional de tarifas.'
    },
    {
      metric: 'D → M',
      title: 'Tempo de aprovação de viagem',
      desc: 'De dias para minutos, com fluxo digital automatizado e notificações diretas aos gestores.'
    },
    {
      metric: '100%',
      title: 'Visibilidade de gastos',
      desc: 'Acompanhamento detalhado por centro de custo, departamento, projeto ou colaborador.'
    },
    {
      metric: '24/7',
      title: 'Suporte ao viajante',
      desc: 'Atendimento humanizado em qualquer dia e horário para imprevistos e emergências.'
    },
    {
      metric: '-h',
      title: 'Menos retrabalho para financeiro e RH',
      desc: 'Prestação de contas unificada, conciliação facilitada e eliminação de processos manuais.'
    }
  ];

  const motivos = [
    {
      title: 'Solidez e autoridade comprovadas',
      desc: 'Tradição, governança e credibilidade consolidada no turismo de negócios corporativo.',
      badge: 'Solidez'
    },
    {
      title: 'Credenciamento e certificações oficiais',
      desc: 'Cadastur, IATA, ABAV, SNEA e rigorosa conformidade com padrões PCI de segurança.',
      badge: 'Conformidade'
    },
    {
      title: 'Tecnologia + Pessoas',
      desc: 'Plataformas tecnológicas modernas operadas em sinergia com consultores humanos experientes.',
      badge: 'Modelo Híbrido'
    },
    {
      title: 'Estrutura própria no centro de Curitiba',
      desc: 'Não somos apenas um número de WhatsApp. Somos uma TMC real, com estrutura física, equipe e governança.',
      badge: 'Presença Real'
    },
    {
      title: '+335 empresas confiam na nossa gestão',
      desc: 'Corporações líderes que contam diariamente com a NC Turismo para organizar e proteger suas viagens.',
      badge: 'Confiança'
    }
  ];

  const certs = ['CADASTUR', 'IATA', 'ABAV', 'SNEA', 'CONFORMIDADE PCI'];

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
            <Sparkles size={13} className="text-[#DB8902]" /> Soluções Corporativas · Gestão de Viagens
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
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

          <div className="max-w-3xl relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#C8102E] text-xs font-bold tracking-widest uppercase shadow-2xs">
              NC Turismo · Gestão de Viagens Corporativas
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
              Excelência e solidez conduzindo a viagem corporativa de <span className="bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] bg-clip-text text-transparent">empresas exigentes</span>.
            </h1>

            <p className="text-base md:text-xl text-slate-600 leading-relaxed font-normal">
              Sua empresa com controle total de custos, aprovação em minutos e suporte real a qualquer hora — sem depender de aplicativo instável, de planilha manual ou de sorte.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="https://wa.me/554132811153?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20NC%20Turismo%20e%20gostaria%20de%20solicitar%20um%20diagn%C3%B3stico%20gratuito%20sobre%20gest%C3%A3o%20de%20viagens%20corporativas."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:brightness-105 transition-all shadow-xl shadow-red-500/25 cursor-pointer"
              >
                <MessageCircle size={18} />
                <span>Solicitar diagnóstico gratuito</span>
              </a>

              <a
                href="#como-funciona"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('como-funciona');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-4 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-700 hover:text-[#C8102E] font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <span>Entenda como funciona</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Key Numbers Grid (Solidez & Experiência) */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white border border-slate-200/90 hover:border-red-300 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-2 group"
            >
              <div className="text-3xl md:text-4xl font-extrabold text-[#C8102E] group-hover:text-[#DB8902] transition-colors font-display">
                {item.value}
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                {item.label}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* O Problema (Diagnóstico de Dor) */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-8 md:p-12 shadow-sm space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#C8102E] border border-red-200 text-xs font-bold uppercase tracking-wider">
            O Problema
          </div>

          <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight">
            Viagem corporativa sem gestão profissional custa mais do que parece
          </h2>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-4xl">
            Reservas feitas por canais dispersos. Aprovação informal por mensagens, sem registro ou política definida. Financeiro descobrindo o gasto só no fechamento do mês. Viajante sem suporte quando o voo atrasa ou a hospedagem tem divergência em cima da hora.
          </p>

          <div 
            className="p-6 md:p-8 rounded-2xl space-y-2 shadow-2xs"
            style={{
              background: 'linear-gradient(135deg, #FFFDFB 0%, #FFF7EE 100%)',
              border: '1px solid #FED7AA',
              borderLeft: '5px solid #DB8902'
            }}
          >
            <p className="text-base md:text-lg font-semibold text-[#0F172A] italic leading-relaxed">
              "Isso não é falha de pessoas — é ausência de processo e de parceiro certo. A NC Turismo resolve isso, e qualquer imprevisto que venha depois."
            </p>
          </div>
        </div>
      </section>

      {/* Quem é a NC Turismo */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div 
          className="rounded-[28px] border border-amber-200/80 p-8 md:p-12 shadow-md space-y-8"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFDFB 50%, #FFF8F0 100%)'
          }}
        >
          <div className="space-y-4 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DB8902] block">
              Quem é a NC Turismo
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight">
              Uma TMC com sede no centro de Curitiba e atuação consultiva
            </h2>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              Somos uma TMC — <strong className="text-[#0F172A]">Travel Management Company</strong> — com sede própria no centro de Curitiba, com sólida atuação no mercado de turismo corporativo nacional e internacional.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { text: '+12.000 empresas já atendidas ao longo da nossa história.', strong: '+12.000 empresas' },
              { text: '+335 clientes corporativos ativos hoje com operação contínua.', strong: '+335 clientes' },
              { text: 'Atendimento humanizado 24 horas, 7 dias por semana.', strong: '24 horas, 7 dias' },
              { text: 'Estrutura física própria, localizada estrategicamente no centro de Curitiba.', strong: 'Estrutura física própria' }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 flex items-start gap-3 shadow-2xs hover:border-red-200 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-red-50 text-[#C8102E] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={14} className="stroke-[3]" />
                </div>
                <p className="text-sm text-slate-700 leading-snug">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* Badges de Certificações Oficiais */}
          <div className="pt-2 border-t border-slate-200/80">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
              Credenciamento e Certificações Oficiais:
            </span>
            <div className="flex flex-wrap gap-2">
              {certs.map((c, i) => (
                <span 
                  key={i}
                  className="px-3.5 py-1.5 rounded-full bg-white border border-amber-200 text-[#DB8902] font-bold text-xs shadow-2xs"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <p className="text-base font-medium text-slate-700 italic border-l-4 border-[#C8102E] pl-4">
            Não somos um aplicativo isolado. Somos pessoas, processos estruturados e tecnologia trabalhando juntos para a sua empresa.
          </p>
        </div>
      </section>

      {/* O que entregamos (Ciclo T.A.C.) */}
      <section id="como-funciona" className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#C8102E] text-xs font-bold uppercase tracking-wider">
            O que entregamos
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight">
            Gestão completa para as viagens da sua empresa
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Combinamos tecnologia, atendimento humano e consultoria para organizar todo o ciclo da viagem corporativa — da solicitação à prestação de contas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tacCiclo.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-white border border-slate-200/90 hover:border-red-300 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-red-500/5 transition-all space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 text-[#C8102E] flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform shadow-2xs">
                    {item.letter}
                  </div>
                  <Icon size={24} className="text-[#DB8902]" />
                </div>

                <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#C8102E] transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tecnologia & Plataformas de Gestão */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="bg-white border border-slate-200/90 rounded-[32px] p-8 md:p-14 shadow-sm space-y-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C8102E] block">
              Tecnologia Integrada
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight">
              Plataformas para controle e visibilidade total
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              Painéis intuitivos e automatizados com parametrização completa de políticas e fluxos de aprovação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plataformas.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl p-6 border border-slate-200/90 hover:border-amber-300 transition-all space-y-3 shadow-2xs"
                  style={{
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFDFB 60%, #FFF9F2 100%)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 text-[#C8102E] flex items-center justify-center shrink-0">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-base font-bold text-[#0F172A]">
                      {p.title}
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Resultados que Entregamos */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div 
          className="rounded-[32px] border border-red-200/80 p-8 md:p-14 shadow-md space-y-10"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFDFB 50%, #FFF7EE 100%)'
          }}
        >
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C8102E] block">
              Resultados que entregamos
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight">
              Mais controle, menos custo e mais produtividade
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              Impactos mensuráveis e comprovados na operação diária de empresas parceiras.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resultados.map((r, idx) => (
              <div 
                key={idx}
                className="bg-white border border-slate-200/90 hover:border-red-300 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-2"
              >
                <div className="text-2xl md:text-3xl font-extrabold text-[#C8102E] font-display">
                  {r.metric}
                </div>
                <h3 className="text-sm font-bold text-[#0F172A] leading-snug">
                  {r.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para empresas de qualquer porte e segmento */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-8 md:p-12 shadow-sm space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#DB8902] block">
            Para empresas de qualquer porte e segmento
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight">
            De empresas em crescimento a operações de grande escala
          </h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            Atendemos desde empresas que estão estruturando viagens corporativas pela primeira vez até operações com múltiplos centros de custo e fluxos de aprovação complexos. Nossos mais de 12.000 clientes atendidos ao longo da nossa trajetória abrangem diversos segmentos — o que nos dá a expertise para entender rapidamente a realidade da sua empresa.
          </p>
        </div>
      </section>

      {/* Por que escolher a NC Turismo */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C8102E] block">
            Diferenciais Competitivos
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight">
            Por que escolher a NC Turismo
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Tecnologia, pessoas e estrutura trabalhando juntas para sua empresa.
          </p>
        </div>

        <div className="space-y-4">
          {motivos.map((m, idx) => (
            <div 
              key={idx}
              className="bg-white border border-slate-200/90 hover:border-red-300 rounded-2xl p-6 transition-all shadow-2xs hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
              style={{
                borderLeft: '4px solid #C8102E'
              }}
            >
              <div className="space-y-1">
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#DB8902] mb-1">
                  {m.badge}
                </span>
                <h3 className="text-base md:text-lg font-bold text-[#0F172A]">
                  {m.title}
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
                  {m.desc}
                </p>
              </div>

              <div className="shrink-0">
                <span className="w-8 h-8 rounded-full bg-red-50 text-[#C8102E] flex items-center justify-center">
                  <Check size={16} className="stroke-[3]" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Manifesto "We Are Travel" */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div 
          className="rounded-[28px] border border-amber-200/80 p-8 md:p-12 text-center shadow-md space-y-4"
          style={{
            background: 'linear-gradient(135deg, #FFFDFB 0%, #FFF8F0 100%)'
          }}
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8102E] block">
            We Are Travel &amp; Expense
          </span>
          <p className="text-lg md:text-2xl font-serif italic text-[#0F172A] max-w-3xl mx-auto leading-relaxed">
            "Tecnologia, conhecimento, relacionamento, mobilidade, suporte e experiência — transformando deslocamentos corporativos em jornadas mais seguras, eficientes e humanas."
          </p>
        </div>
      </section>

      {/* Final Conversion CTA Box */}
      <section id="diagnostico-nc" className="max-w-[1240px] mx-auto px-6 md:px-12">
        <div 
          className="rounded-[32px] p-8 md:p-14 text-center text-white shadow-2xl relative overflow-hidden space-y-6"
          style={{
            background: 'linear-gradient(135deg, #C8102E 0%, #D32F2F 50%, #DB8902 100%)',
            boxShadow: '0 16px 38px rgba(200, 16, 46, 0.25)'
          }}
        >
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-white/90 block">
            NC Turismo · Diagnóstico Corporativo
          </span>

          <h2 className="text-2xl md:text-4xl font-display font-bold text-white tracking-tight leading-tight max-w-2xl mx-auto">
            Solicite um diagnóstico gratuito
          </h2>

          <p className="text-sm md:text-base text-white/90 max-w-xl mx-auto font-normal leading-relaxed">
            Em uma conversa de 30 minutos, nossa equipe entende como sua empresa gerencia viagens hoje e mostra, com números, onde estão as maiores oportunidades de economia e controle.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/554132811153?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20NC%20Turismo%20e%20gostaria%20de%20solicitar%20um%20diagn%C3%B3stico%20gratuito%20sobre%20gest%C3%A3o%20de%20viagens%20corporativas."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#C8102E] font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-slate-50 transition-all shadow-xl hover:scale-[1.02] cursor-pointer"
            >
              <MessageCircle size={18} className="text-[#C8102E]" />
              <span>Solicitar diagnóstico pelo WhatsApp</span>
            </a>

            <button
              onClick={onBackToHome}
              className="px-6 py-4 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Voltar à Página Principal
            </button>
          </div>

          <div className="pt-4 border-t border-white/15 text-xs text-white/80 font-mono">
            <span>ncturismo@ncturismo.com.br</span>
            <span className="mx-2.5">•</span>
            <span>(41) 3281-1153</span>
          </div>
        </div>
      </section>
    </div>
  );
};
