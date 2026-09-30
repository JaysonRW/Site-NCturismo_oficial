import React, { useEffect, useState } from 'react';
import { 
  Headphones, 
  Clock, 
  ShieldCheck, 
  Globe2, 
  Zap, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Sparkles, 
  AlertCircle, 
  Plane, 
  CheckCircle2, 
  Building2, 
  TrendingUp, 
  UserCheck, 
  Radio, 
  CalendarClock, 
  Activity, 
  Compass, 
  HeartHandshake
} from 'lucide-react';

interface Atendimento24hViewProps {
  onBackToHome: () => void;
  onOpenDiagnosis: () => void;
  onOpenLegalTab?: (tab: string) => void;
  onNavigateToSection?: (target: string) => void;
}

export const Atendimento24hView: React.FC<Atendimento24hViewProps> = ({
  onBackToHome,
  onOpenDiagnosis,
  onNavigateToSection
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [activeSituacao, setActiveSituacao] = useState<number>(0);

  // 3 Pilares Principais de "O que entregamos"
  const entregas = [
    {
      num: '01',
      tag: 'Suporte Emergencial',
      badge: 'Plantão Imediato',
      icon: AlertCircle,
      title: 'Apoio quando algo muda no meio da viagem',
      desc: 'Intervenção rápida para solucionar imprevistos críticos a qualquer hora do dia ou da noite, sem burocracia.',
      whatsappMsg: 'Olá, preciso de suporte emergencial para uma viagem corporativa.',
      items: [
        'Alterações de voos e reemissões expressas',
        'Cancelamentos de companhias aéreas e no-show',
        'Reacomodações em outros voos ou companhias congêneres',
        'Mudanças emergenciais de itinerário e conexões',
        'Apoio operacional completo em imprevistos com bagagens ou transfers'
      ]
    },
    {
      num: '02',
      tag: 'Nacional e Internacional',
      badge: 'Cobertura Global',
      icon: Globe2,
      title: 'Suporte para diferentes jornadas corporativas',
      desc: 'Atendimento consultivo e contínuo para deslocamentos em qualquer fuso horário ao redor do mundo.',
      whatsappMsg: 'Olá, gostaria de saber mais sobre o atendimento nacional e internacional 24h da NC Turismo.',
      items: [
        'Suporte integral para viagens em território nacional',
        'Suporte internacional para voos, conexões e aduanas',
        'Orientação técnica e segura ao viajante em trânsito',
        'Acompanhamento pró-ativo em casos de greves climáticas ou atrasos de malha'
      ]
    },
    {
      num: '03',
      tag: 'Continuidade Operacional',
      badge: 'Proteção de Negócios',
      icon: Activity,
      title: 'Menos impacto para agendas e operações corporativas',
      desc: 'Garantimos que reuniões estratégicas, feiras e compromissos da diretoria não sejam cancelados por falhas logísticas.',
      whatsappMsg: 'Olá, quero entender como a NC Turismo garante a continuidade das agendas corporativas 24h.',
      items: [
        'Redução drástica de impactos em reuniões e agendas executivas',
        'Apoio imediato à tomada de decisão de gestores em situações críticas',
        'Mais segurança psicológica para quem viaja e tranquilidade para o RH',
        'Agilidade com autoridade na resolução direta com cias aéreas e hotéis'
      ]
    }
  ];

  // 6 Benefícios para sua empresa
  const beneficios = [
    {
      title: 'Atendimento humano quando a tecnologia não resolve',
      desc: 'Suporte especializado para situações complexas que exigem análise sensível, negociação e ação rápida — sem robôs que repetem respostas prontas.',
      badge: 'Human Touch',
      icon: UserCheck
    },
    {
      title: 'Maior tranquilidade para gestores',
      desc: 'Apoio tático para decisões rápidas em momentos de alta pressão operacional, mantendo a governança e o controle de custos.',
      badge: 'Gestão Segura',
      icon: ShieldCheck
    },
    {
      title: 'Apoio ao viajante em momentos críticos',
      desc: 'Orientação clara, acolhimento e acompanhamento contínuo quando imprevistos e cancelamentos impactam o trajeto.',
      badge: 'Duty of Care',
      icon: HeartHandshake
    },
    {
      title: 'Menor impacto operacional',
      desc: 'Preservação de reuniões cruciais, agendas de vendas, convenções e compromissos corporativos prioritários da sua diretoria.',
      badge: 'Continuidade',
      icon: Zap
    },
    {
      title: 'Mais segurança e continuidade das operações',
      desc: 'A empresa jamais fica desassistida: um time próprio e especializado monitora sua operação 24 horas por dia, 365 dias ao ano.',
      badge: 'Disponibilidade 365d',
      icon: CalendarClock
    },
    {
      title: 'Suporte especializado fora do horário comercial',
      desc: 'Madrugadas, fins de semana, feriados e fusos horários internacionais cobertos com o mesmo nível de excelência e alçada de resolução.',
      badge: 'Plantão Próprio',
      icon: Clock
    }
  ];

  // Situações Típicas Resolvidas pelo Plantão 24h
  const situacoesResolvidas = [
    {
      titulo: 'Voo Cancelado na Madrugada',
      cenario: 'Viajante no aeroporto às 03:00 com voo cancelado por nevoeiro ou manutenção não programada.',
      solucao: 'O consultor NC localiza imediatamente a melhor alternativa em outra companhia aérea parceira, reemite o bilhete e avisa o transfer no destino antes do desembarque.'
    },
    {
      titulo: 'Reunião Antecipada de Emergência',
      cenario: 'Diretor precisa chegar a São Paulo 4 horas antes do planejado para fechar um contrato decisivo.',
      solucao: 'Alteração de bilhete realizada em menos de 10 minutos pelo plantão, respeitando a política da empresa e emitindo o cartão de embarque direto no WhatsApp.'
    },
    {
      titulo: 'Overbooking ou Problema no Hotel',
      cenario: 'Colaborador chega ao hotel tarde da noite após conexão longa e encontra a reserva sem disponibilidade.',
      solucao: 'Contato direto da NC Turismo com a gerência da rede hoteleira, garantindo acomodação imediata de padrão igual ou superior sem custo adicional.'
    },
    {
      titulo: 'Conexão Perdida no Exterior',
      cenario: 'Atraso no trecho doméstico gerou perda do voo transatlântico rumo à Europa ou Estados Unidos.',
      solucao: 'Reacomodação internacional rápida, solicitação de voucher de alimentação/hotel da aérea e reprogramação de todos os traslados no país de chegada.'
    }
  ];

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#C8102E] selection:text-white relative overflow-hidden">
      {/* Ambient glows */}
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
            <Headphones size={13} className="text-[#DB8902]" /> Soluções Corporativas · Atendimento 24h
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
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold tracking-widest uppercase shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Plantão Próprio Ativo 24/7 · Sem Terceirização</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
              Quando a viagem <span className="bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] bg-clip-text text-transparent">não pode esperar</span>.
            </h1>

            <p className="text-base md:text-xl text-slate-600 leading-relaxed font-normal">
              Imprevistos acontecem: alterações de voos, cancelamentos, atrasos, mudanças de agenda e situações emergenciais podem impactar diretamente a operação de uma empresa.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="https://wa.me/554132811153?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20NC%20Turismo%20e%20gostaria%20de%20saber%20mais%20sobre%20atendimento%2024h%20para%20viagens%20corporativas."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:brightness-105 active:scale-[0.99] transition-all shadow-xl shadow-red-500/25 cursor-pointer"
              >
                <MessageCircle size={18} />
                <span>Falar com o Plantão 24h</span>
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

              <a
                href="tel:04132811153"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-[#C8102E] py-2 px-3 transition-colors cursor-pointer"
              >
                <Phone size={14} className="text-[#DB8902]" /> Discagem Rápida: (41) 3281-1153
              </a>
            </div>

            {/* Micro Metrics Bar */}
            <div className="pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">24/7/365</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Operação Contínua</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#C8102E] tracking-tight">&lt; 15 min</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Primeira Resposta SLA</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#DB8902] tracking-tight">100%</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Consultores Humanos</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">99.4%</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Índice de Resolução</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUPORTE OPERACIONAL */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-8 md:p-12 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DB8902]">
              Suporte Operacional · Presença Contínua
            </span>
            <span className="h-1 w-8 bg-[#DB8902] rounded-full" />
          </div>

          <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight leading-snug">
            Apoio especializado para gestores e viajantes sempre que necessário
          </h2>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-4xl">
            Por isso, a NC Turismo disponibiliza atendimento especializado 24 horas para apoiar gestores e viajantes sempre que necessário.
          </p>

          {/* Destaque / Citação */}
          <div className="border-l-4 border-[#C8102E] bg-gradient-to-r from-red-50/60 to-transparent pl-6 pr-4 py-4 rounded-r-2xl">
            <p className="text-[#0F172A] font-semibold text-lg md:text-xl italic leading-relaxed">
              &ldquo;Mais do que um canal de atendimento, oferecemos suporte operacional para reduzir impactos e manter suas operações em movimento.&rdquo;
            </p>
          </div>

          {/* Três Diferenciais Rápidos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-[#C8102E] flex items-center justify-center font-bold">
                <Radio size={20} />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Plantão Próprio</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Você conversa diretamente com profissionais seniores da NC Turismo que conhecem as políticas e acordos da sua empresa.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#DB8902] flex items-center justify-center font-bold">
                <Zap size={20} />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Poder de Decisão</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Alçada para reemitir passagens, reacomodar hospedagens e acionar companhias aéreas sem repassar o problema ao passageiro.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Clock size={20} />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Disponibilidade 365 Dias</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sem pausas nos feriados ou fins de semana. Porque viagens executivas acontecem no ritmo dos negócios globais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* O QUE ENTREGAMOS (3 PILARES DETALHADOS) */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="bg-gradient-to-b from-[#FFFDFB] to-[#F8FAFC] border border-slate-200/90 rounded-[28px] p-8 md:p-12 shadow-sm space-y-8">
          
          <div className="space-y-3 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C8102E] block">
              O que entregamos · Pilares do Plantão 24h
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight">
              Atendimento para situações que exigem rapidez, experiência e resolução
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              Conheça os 3 principais pilares estruturados da nossa operação 24h para garantir que nenhum colaborador fique desamparado.
            </p>
          </div>

          {/* Grid dos 3 Pilares */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {entregas.map((entrega) => {
              const IconComp = entrega.icon;
              return (
                <div
                  key={entrega.num}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 flex flex-col justify-between hover:border-[#C8102E]/40 hover:shadow-md transition-all group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Top Tag & Number */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#DB8902]">
                        {entrega.num} · {entrega.tag}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-50 text-[#C8102E] border border-red-200/60">
                        {entrega.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 text-[#C8102E] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <IconComp size={22} />
                      </div>
                      <h3 className="text-lg font-bold text-[#0F172A] leading-snug group-hover:text-[#C8102E] transition-colors">
                        {entrega.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {entrega.desc}
                    </p>

                    {/* Bullet List */}
                    <div className="pt-4 border-t border-slate-100 space-y-2.5">
                      {entrega.items.map((item, idx) => (
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
                      href={`https://wa.me/554132811153?text=${encodeURIComponent(entrega.whatsappMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8102E] hover:text-[#DB8902] transition-colors cursor-pointer"
                    >
                      <MessageCircle size={14} />
                      <span>Falar sobre {entrega.tag}</span>
                    </a>
                    <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-1 group-hover:text-[#C8102E] transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CASOS PRÁTICOS RESOLVIDOS */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-8 md:p-12 shadow-sm space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-200/80">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#DB8902] block">
                Cenários Reais · Como Agimos
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight">
                Exemplos de imprevistos solucionados pelo plantão
              </h2>
              <p className="text-slate-600 text-sm md:text-base">
                Veja como nossa equipe atua prontamente nos momentos em que o tempo é o recurso mais valioso da sua diretoria.
              </p>
            </div>

            <div className="flex gap-2">
              {situacoesResolvidas.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSituacao(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeSituacao === i
                      ? 'bg-[#C8102E] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Caso {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Card em Destaque do Caso Selecionado */}
          <div className="bg-gradient-to-br from-[#FAFCFF] to-[#FFF9F3] border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-100/70 text-[#C8102E]">
                Cenário Operacional
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Resolução com Autoridade
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-bold text-[#0F172A]">
                {situacoesResolvidas[activeSituacao].titulo}
              </h3>
              <p className="text-sm text-slate-600 bg-white p-4 rounded-xl border border-slate-200/80">
                <strong className="text-slate-800 block mb-1">O Problema:</strong>
                {situacoesResolvidas[activeSituacao].cenario}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 text-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#C8102E] uppercase tracking-wider">
                <CheckCircle2 size={16} /> A Solução NC Turismo:
              </div>
              <p className="text-sm font-medium leading-relaxed">
                {situacoesResolvidas[activeSituacao].solucao}
              </p>
            </div>
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
              Mais tranquilidade, segurança e continuidade para sua operação
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Descubra por que mais de 335 corporações confiam diariamente suas viagens críticas ao plantão especializado da NC Turismo.
            </p>
          </div>

          {/* Grid de 6 Benefícios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            {beneficios.map((ben, idx) => {
              const BenIcon = ben.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#FAFCFF] border-l-4 border-l-[#C8102E] border border-slate-200/80 rounded-xl p-5 space-y-3 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
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
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* DIFERENCIAL NC TURISMO */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-8 md:p-12 shadow-sm space-y-6">
          <div className="space-y-3 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C8102E] block">
              Diferencial NC Turismo
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight leading-snug">
              Tecnologia automatiza processos. Pessoas resolvem exceções.
            </h2>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              Por isso, combinamos plataformas digitais com atendimento especializado para garantir que sua empresa tenha suporte quando realmente precisar.
            </p>
          </div>

          <div className="border-l-4 border-[#DB8902] bg-gradient-to-r from-amber-50/60 to-transparent pl-6 pr-4 py-4 rounded-r-2xl">
            <p className="text-[#0F172A] font-semibold text-lg md:text-xl italic leading-relaxed">
              &ldquo;Quando a viagem exige resposta rápida, experiência faz diferença.&rdquo;
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
              <Sparkles size={13} className="text-[#C8102E]" /> Atendimento 24 Horas · NC Turismo
            </span>

            <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-extrabold text-[#0F172A] tracking-tight leading-tight">
              Sua operação não para. Nosso atendimento também não.
            </h2>

            <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal">
              Atuamos 24 horas por dia para apoiar gestores e viajantes em situações que exigem rapidez, experiência e capacidade de resolução.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <a
              href="https://wa.me/554132811153?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20NC%20Turismo%20e%20gostaria%20de%20saber%20mais%20sobre%20atendimento%2024h%20para%20viagens%20corporativas."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:brightness-105 active:scale-[0.99] transition-all shadow-xl shadow-red-500/25 cursor-pointer"
            >
              <MessageCircle size={18} />
              <span>Falar com o Plantão 24h</span>
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
