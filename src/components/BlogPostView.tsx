import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Share2, 
  Check, 
  MessageCircle, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  ChevronLeft
} from 'lucide-react';
import { supabase, Post } from '../lib/supabase';
import { SocialShareBar } from './SocialShareBar';

interface BlogPostViewProps {
  slug: string;
  onBackToBlog: () => void;
  onBackToHome: () => void;
}

export const BlogPostView: React.FC<BlogPostViewProps> = ({ 
  slug, 
  onBackToBlog, 
  onBackToHome 
}) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            category:categories(*),
            author:authors(*)
          `)
          .eq('slug', slug)
          .single();

        if (error) {
          console.warn('Erro ao buscar post do Supabase:', error);
        } else if (data) {
          setPost(data);
        }
      } catch (err) {
        console.error('Falha na consulta do post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Default values if fetching dynamic or showing the flagship SLA post
  const isSlaArticle = !post || slug.includes('sla') || slug.includes('suporte');

  const title = post?.title || 'SLA e suporte em viagens corporativas: por que atendimento ainda importa';
  const excerpt = post?.excerpt || 'Mesmo em operações digitalizadas, viagens corporativas ainda exigem resposta, orientação e suporte quando algo sai do planejado.';
  const readingTime = post?.reading_time_minutes || 7;
  const categoryName = post?.category?.name || 'Atendimento e Governança';
  const publishedDate = post?.published_at 
    ? new Date(post.published_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '21 de setembro de 2026';

  return (
    <div className="min-h-screen bg-[#090b0e] text-nc-warm selection:bg-nc-orange selection:text-white relative">
      {/* Scroll Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-red-600 via-nc-orange to-amber-400 z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Floating Vertical Social Share Dock on Desktop */}
      <SocialShareBar title={title} summary={excerpt} variant="floating" />

      {/* Top Floating Bar */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 pt-28 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="text-xs uppercase tracking-wider text-nc-warm/60 hover:text-white transition-colors"
            >
              Início
            </button>
            <ChevronRight size={14} className="text-nc-warm/30" />
            <button
              onClick={onBackToBlog}
              className="text-xs uppercase tracking-wider text-nc-orange font-semibold hover:underline flex items-center gap-1.5"
            >
              <ChevronLeft size={14} />
              <span>Centro de Conhecimento</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <SocialShareBar title={title} summary={excerpt} variant="inline" />
          </div>
        </div>
      </div>

      {/* Hero Header Editorial - Visual inspirado na referência com gradiente e barra superior */}
      <header className="max-w-[1240px] mx-auto px-6 md:px-12 mb-12">
        <div 
          className="relative rounded-[22px] border border-white/10 p-8 md:p-14 overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #151515 0%, #241717 55%, #3a2112 100%)'
          }}
        >
          {/* Top colored strip: #bd0f0f to #f28c28 */}
          <div 
            className="w-[76px] h-[4px] rounded-full mb-6"
            style={{ background: 'linear-gradient(90deg, #bd0f0f, #f28c28)' }}
          />

          <span 
            className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{
              backgroundColor: 'rgba(242, 140, 40, 0.12)',
              color: '#f28c28',
              border: '1px solid rgba(242, 140, 40, 0.35)'
            }}
          >
            Conhecimento NC · {categoryName}
          </span>

          <h1 className="text-3xl md:text-5xl lg:text-[44px] font-bold text-white tracking-tight leading-[1.14] mb-6 max-w-4xl">
            {title}
          </h1>

          <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light max-w-3xl mb-8">
            {excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10 text-xs md:text-sm text-nc-warm/70">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-nc-orange" />
              <span className="text-white font-medium">Por NC Turismo</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-nc-orange" />
              <span>{readingTime} min de leitura</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-nc-orange" />
              <span>{publishedDate}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-[1240px] mx-auto px-6 md:px-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Article Stream (col-span-8) */}
          <article className="lg:col-span-8 space-y-10">

            {/* If dynamic post with custom content in DB, display it with the design system */}
            {post && post.content && !isSlaArticle ? (
              <div className="space-y-6 text-nc-warm/90 text-base md:text-[17px] leading-relaxed">
                {post.cover_image && (
                  <div className="w-full h-80 md:h-96 rounded-2xl overflow-hidden border border-white/10 mb-8">
                    <img 
                      src={post.cover_image} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div className="whitespace-pre-line text-nc-warm/90 leading-relaxed space-y-4">
                  {post.content}
                </div>
                <div className="pt-6">
                  <SocialShareBar title={title} summary={excerpt} variant="card" />
                </div>
              </div>
            ) : (
              /* Rich Editorial Layout based directly on user provided SLA content */
              <>
                {/* Intro */}
                <div className="space-y-5 text-nc-warm/90 text-base md:text-[17px] leading-relaxed">
                  <p>
                    A evolução da tecnologia mudou profundamente a forma como empresas solicitam, aprovam e acompanham viagens corporativas. Ferramentas de reserva online, plataformas de despesas, aplicativos, integrações com ERP e painéis de indicadores trouxeram mais agilidade, controle e autonomia para muitos processos.
                  </p>
                  <p>
                    Mas, mesmo em operações digitalizadas, uma pergunta continua relevante:
                  </p>

                  {/* Callout Box "A Pergunta Central" com borda laranja #f28c28 */}
                  <div 
                    className="rounded-2xl p-6 md:p-8 shadow-xl space-y-2"
                    style={{
                      backgroundColor: '#fff8ef',
                      border: '1px solid #ffe2bd',
                      borderLeft: '5px solid #f28c28'
                    }}
                  >
                    <strong className="block text-xl font-bold tracking-tight" style={{ color: '#bd0f0f' }}>
                      A pergunta central
                    </strong>
                    <p className="text-base md:text-lg font-medium" style={{ color: '#555555' }}>
                      Quando algo sai do planejado, quem resolve?
                    </p>
                  </div>

                  <p>
                    Essa pergunta explica por que suporte ao viajante e SLA de atendimento continuam sendo temas centrais na gestão de viagens corporativas.
                  </p>
                  <p>
                    Em uma viagem a trabalho, nem tudo acontece dentro do fluxo ideal. Voos atrasam, conexões são perdidas, reuniões mudam de horário, hotéis podem ter divergências de reserva, veículos podem não estar disponíveis, documentos podem gerar dúvidas, tarifas podem ter regras restritivas e emergências podem acontecer durante a jornada.
                  </p>
                  <p className="font-semibold text-white">
                    Nesses momentos, a gestão de viagens deixa de ser apenas reserva e passa a ser resposta. É por isso que atendimento ainda importa.
                  </p>
                </div>

                {/* Manifesto Banner "We Are Travel & Expense" */}
                <div 
                  className="rounded-[22px] p-8 md:p-10 shadow-xl space-y-3 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #151515 0%, #241717 55%, #3a2112 100%)',
                    border: '1px solid rgba(242, 140, 40, 0.3)'
                  }}
                >
                  <span className="text-sm font-bold uppercase tracking-wider block" style={{ color: '#f28c28' }}>
                    We Are Travel &amp; Expense
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                    Atendimento não substitui tecnologia. Ele complementa a gestão.
                  </h2>
                  <p className="text-base md:text-lg text-white/90 leading-relaxed font-light">
                    O suporte é essencial nas situações que exigem análise, priorização, orientação e resolução.
                  </p>
                </div>

                {/* Section 01: O que é SLA */}
                <section className="space-y-5 pt-4">
                  <div 
                    className="w-[76px] h-[4px] rounded-full mb-3"
                    style={{ background: 'linear-gradient(90deg, #bd0f0f, #f28c28)' }}
                  />
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    O que é SLA em viagens corporativas
                  </h2>
                  <p className="text-nc-warm/90 text-base md:text-[17px] leading-relaxed">
                    SLA é a sigla para <strong className="text-white">Service Level Agreement</strong>, ou Acordo de Nível de Serviço. Na gestão de viagens corporativas, ele define parâmetros de atendimento entre a empresa, seus fornecedores e os usuários do processo.
                  </p>
                  <p className="text-nc-warm/90 text-base md:text-[17px] leading-relaxed">
                    Na prática, o SLA ajuda a estabelecer prazos, canais, prioridades, responsabilidades e formas de acompanhamento das solicitações relacionadas às viagens corporativas.
                  </p>

                  {/* Checklist Container */}
                  <div className="bg-[#12141a] border border-white/10 rounded-2xl p-6 md:p-8 space-y-4">
                    <h3 className="text-base md:text-lg font-bold" style={{ color: '#f28c28' }}>
                      Um SLA ajuda a responder:
                    </h3>
                    <ul className="space-y-3 text-sm md:text-base text-nc-warm/80">
                      {[
                        'Qual é o prazo esperado para atendimento de uma solicitação?',
                        'Como demandas urgentes são priorizadas?',
                        'Quais canais devem ser utilizados?',
                        'Como funciona o suporte fora do horário comercial?',
                        'Qual é o tempo de resposta para remarcações, cancelamentos ou emergências?',
                        'Quem deve ser acionado em caso de escalonamento?',
                        'Como ocorrências devem ser registradas e acompanhadas?'
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full bg-nc-orange mt-2 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Insight Box */}
                  <div 
                    className="rounded-2xl p-6 shadow-md"
                    style={{
                      backgroundColor: '#fff8ef',
                      border: '1px solid #ffe2bd',
                      borderLeft: '5px solid #f28c28'
                    }}
                  >
                    <strong className="block text-base md:text-lg font-bold mb-1" style={{ color: '#bd0f0f' }}>
                      Um SLA bem definido não elimina imprevistos
                    </strong>
                    <p className="text-sm md:text-base leading-relaxed" style={{ color: '#555555' }}>
                      Mas melhora a forma como eles são tratados. Ele cria previsibilidade, organiza prioridades e dá mais clareza sobre responsabilidades.
                    </p>
                  </div>
                </section>

                {/* Section 02: Sem SLA */}
                <section className="space-y-5 pt-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Sem SLA, cada área pode ter uma expectativa diferente
                  </h2>
                  <p className="text-nc-warm/90 text-base md:text-[17px] leading-relaxed">
                    Sem SLA, cada área pode interpretar o atendimento de uma forma. O viajante espera resposta imediata. O gestor espera solução rápida. O financeiro espera documentação correta. O fornecedor pode trabalhar com prazos genéricos.
                  </p>
                  <p className="text-nc-warm/90 text-base md:text-[17px] leading-relaxed">
                    O problema é que a empresa muitas vezes só percebe esse desalinhamento quando ocorre um problema durante a viagem.
                  </p>

                  {/* Grid 4 atores */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {[
                      { role: 'Viajante', desc: 'Precisa saber quem acionar e em quanto tempo terá retorno.' },
                      { role: 'Gestor', desc: 'Precisa entender prioridades, impactos e responsabilidades.' },
                      { role: 'Financeiro', desc: 'Precisa de registros, documentos e informações confiáveis.' },
                      { role: 'Fornecedor', desc: 'Precisa operar dentro de critérios e prazos previamente definidos.' }
                    ].map((actor, idx) => (
                      <div key={idx} className="bg-[#12141a] border border-white/10 hover:border-white/20 p-5 rounded-2xl space-y-1.5 transition-colors">
                        <strong className="text-nc-orange font-bold text-base block">{actor.role}</strong>
                        <p className="text-xs md:text-sm text-nc-warm/75 leading-relaxed">{actor.desc}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm md:text-base text-nc-warm/70 italic">
                    Quando essas expectativas não estão alinhadas, a gestão perde clareza justamente nos momentos em que mais precisa de resposta.
                  </p>
                </section>

                {/* Section 03: Suporte não é apenas operacional */}
                <section className="space-y-5 pt-4">
                  <div 
                    className="w-[76px] h-[4px] rounded-full mb-3"
                    style={{ background: 'linear-gradient(90deg, #bd0f0f, #f28c28)' }}
                  />
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Suporte não é apenas atendimento operacional
                  </h2>
                  <p className="text-nc-warm/90 text-base md:text-[17px] leading-relaxed">
                    Em muitas empresas, suporte em viagens ainda é visto como algo simples: responder solicitações, emitir reservas ou fazer alterações quando necessário.
                  </p>
                  <p className="text-nc-warm/90 text-base md:text-[17px] leading-relaxed">
                    Essa visão é limitada. O suporte em viagens corporativas envolve compreensão da política, leitura da urgência, avaliação das opções disponíveis, conhecimento das regras tarifárias, orientação ao viajante, comunicação com fornecedores, registro de exceções e alinhamento com os interesses da empresa.
                  </p>

                  {/* 3 cards de cenários complexos */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#12141a] border border-white/10 p-5 rounded-2xl space-y-2">
                      <strong className="text-base block font-bold" style={{ color: '#bd0f0f' }}>Remarcação de voo</strong>
                      <p className="text-xs text-nc-warm/70 leading-relaxed">
                        Pode envolver diferença tarifária, multa, agenda, conexão, aprovação e registro posterior.
                      </p>
                    </div>
                    <div className="bg-[#12141a] border border-white/10 p-5 rounded-2xl space-y-2">
                      <strong className="text-base block font-bold" style={{ color: '#bd0f0f' }}>Hospedagem com problema</strong>
                      <p className="text-xs text-nc-warm/70 leading-relaxed">
                        Pode exigir renegociação, troca de hotel, análise de localização, segurança e pagamento.
                      </p>
                    </div>
                    <div className="bg-[#12141a] border border-white/10 p-5 rounded-2xl space-y-2">
                      <strong className="text-base block font-bold" style={{ color: '#bd0f0f' }}>Viagem internacional</strong>
                      <p className="text-xs text-nc-warm/70 leading-relaxed">
                        Pode envolver documentação, regras de entrada, conexões, bagagem, fuso horário e reação rápida.
                      </p>
                    </div>
                  </div>

                  <div 
                    className="rounded-2xl p-6 shadow-md"
                    style={{
                      backgroundColor: '#fff8ef',
                      border: '1px solid #ffe2bd',
                      borderLeft: '5px solid #f28c28'
                    }}
                  >
                    <strong className="block text-base md:text-lg font-bold mb-1" style={{ color: '#bd0f0f' }}>
                      Suporte não é apenas executar
                    </strong>
                    <p className="text-sm md:text-base leading-relaxed" style={{ color: '#555555' }}>
                      É interpretar o contexto e orientar a melhor decisão possível para a empresa e para o viajante.
                    </p>
                  </div>
                </section>

                {/* Section 04: Tecnologia resolve fluxo */}
                <section className="space-y-5 pt-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Tecnologia resolve fluxo, mas nem sempre resolve exceção
                  </h2>
                  <p className="text-nc-warm/90 text-base md:text-[17px] leading-relaxed">
                    A tecnologia é muito eficiente para organizar processos previsíveis. Ela ajuda a padronizar solicitações, aplicar políticas, automatizar aprovações, registrar informações, centralizar dados e gerar relatórios.
                  </p>
                  <p className="text-nc-warm/90 text-base md:text-[17px] leading-relaxed">
                    Mas viagens corporativas têm uma característica importante: elas envolvem movimento, agenda, pessoas, fornecedores e risco.
                  </p>

                  <div className="bg-[#12141a] border border-white/10 rounded-2xl p-6 md:p-8 space-y-3">
                    <h3 className="text-base font-bold flex items-center gap-2" style={{ color: '#bd0f0f' }}>
                      <AlertCircle size={18} />
                      O problema aparece quando a viagem sai do padrão:
                    </h3>
                    <ul className="space-y-2.5 text-sm md:text-base text-nc-warm/80">
                      {[
                        'Um voo é cancelado perto do embarque.',
                        'Uma reunião é antecipada.',
                        'Um colaborador perde uma conexão.',
                        'Um hotel informa que não localizou a reserva.',
                        'Uma agenda internacional exige alteração imediata.',
                        'Um passageiro precisa de apoio fora do horário comercial.',
                        'Uma greve, evento climático ou instabilidade no destino muda o cenário.'
                      ].map((exc, idx) => (
                        <li key={idx} className="flex items-center gap-2.5">
                          <span className="text-nc-orange font-bold text-xs">✕</span>
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Manifesto Banner 2 */}
                <div 
                  className="rounded-[22px] p-8 md:p-10 shadow-xl space-y-3"
                  style={{
                    background: 'linear-gradient(135deg, #151515 0%, #241717 55%, #3a2112 100%)',
                    border: '1px solid rgba(242, 140, 40, 0.3)'
                  }}
                >
                  <span className="text-xs font-bold uppercase tracking-[0.2em] block" style={{ color: '#f28c28' }}>
                    We Are Travel &amp; Expense
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                    Uma gestão madura não substitui atendimento por tecnologia
                  </h2>
                  <p className="text-base text-white/90 leading-relaxed font-light">
                    Ela combina os dois: ferramenta para organizar o processo e suporte humano para agir quando a exceção exige análise, negociação e priorização.
                  </p>
                </div>

                {/* Section 05: SLA Medido */}
                <section className="space-y-5 pt-4">
                  <div 
                    className="w-[76px] h-[4px] rounded-full mb-3"
                    style={{ background: 'linear-gradient(90deg, #bd0f0f, #f28c28)' }}
                  />
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    SLA precisa ser medido com indicadores claros
                  </h2>
                  <p className="text-nc-warm/90 text-base md:text-[17px] leading-relaxed">
                    Um SLA só tem valor se puder ser acompanhado. Não basta definir prazos e canais. É preciso medir se eles estão sendo cumpridos e se fazem sentido para a realidade da empresa.
                  </p>

                  {/* Grid 8 Métricas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      'Tempo médio de 1ª resposta',
                      'Tempo médio de resolução',
                      'Solicitações por canal',
                      'Ocorrências urgentes',
                      'Demandas fora do horário',
                      'Remarcações tratadas',
                      'Exceções registradas',
                      'Satisfação dos usuários (CSAT)'
                    ].map((metric, idx) => (
                      <div key={idx} className="bg-[#12141a] border border-white/10 p-4 rounded-xl text-center flex items-center justify-center">
                        <span className="text-xs md:text-sm font-semibold text-white">{metric}</span>
                      </div>
                    ))}
                  </div>

                  <div 
                    className="rounded-2xl p-6 shadow-md"
                    style={{
                      backgroundColor: '#fff8ef',
                      border: '1px solid #ffe2bd',
                      borderLeft: '5px solid #f28c28'
                    }}
                  >
                    <strong className="block text-base md:text-lg font-bold mb-1" style={{ color: '#bd0f0f' }}>
                      Medir atendimento é uma forma de melhorar a gestão
                    </strong>
                    <p className="text-sm md:text-base leading-relaxed" style={{ color: '#555555' }}>
                      Sem dados, o suporte é avaliado apenas por percepção. Com dados, a empresa consegue identificar padrões e ajustar processos.
                    </p>
                  </div>
                </section>

                {/* Section 06: Duty of Care */}
                <section className="space-y-5 pt-4">
                  <div 
                    className="w-[76px] h-[4px] rounded-full mb-3"
                    style={{ background: 'linear-gradient(90deg, #bd0f0f, #f28c28)' }}
                  />
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Suporte humano e Duty of Care
                  </h2>
                  <p className="text-nc-warm/90 text-base md:text-[17px] leading-relaxed">
                    O suporte ao viajante também se conecta diretamente ao <strong className="text-white">duty of care</strong>, que é a responsabilidade legal e moral da empresa de cuidar, orientar e apoiar colaboradores durante deslocamentos a trabalho.
                  </p>

                  <div className="bg-[#12141a] border border-white/10 rounded-2xl p-6 md:p-8 space-y-3">
                    <h3 className="text-base font-bold flex items-center gap-2" style={{ color: '#bd0f0f' }}>
                      <ShieldCheck size={18} />
                      Uma gestão madura precisa saber:
                    </h3>
                    <ul className="space-y-2 text-sm md:text-base text-nc-warm/80">
                      {[
                        'Onde seus viajantes estão em tempo real.',
                        'Como contatá-los de forma imediata.',
                        'Como apoiá-los quando necessário.',
                        'Quais canais de contingência acionar.',
                        'Quais responsabilidades cabem à empresa, gestor, fornecedor e viajante.'
                      ].map((doc, idx) => (
                        <li key={idx} className="flex items-center gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-nc-orange" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div 
                    className="rounded-2xl p-6 shadow-md"
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #eeeeee',
                      borderLeft: '5px solid #bd0f0f'
                    }}
                  >
                    <strong className="block text-base md:text-lg font-bold mb-1" style={{ color: '#bd0f0f' }}>
                      Duty of care não depende apenas de intenção
                    </strong>
                    <p className="text-sm md:text-base leading-relaxed" style={{ color: '#555555' }}>
                      Depende de processo, informação atualizada e capacidade de resposta operacional.
                    </p>
                  </div>
                </section>

                {/* Conclusion */}
                <section className="space-y-5 pt-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Conclusão
                  </h2>
                  <p className="text-nc-warm/90 text-base md:text-[17px] leading-relaxed">
                    SLA e suporte continuam importantes na gestão de viagens corporativas porque viagens envolvem pessoas, agendas, riscos e imprevistos. A tecnologia ajuda a organizar o processo, mas não elimina a necessidade de atendimento estruturado.
                  </p>
                  <p className="text-nc-warm/90 text-base md:text-[17px] leading-relaxed">
                    Isso fortalece a governança, melhora a experiência do viajante, reduz improvisos e apoia o duty of care.
                  </p>

                  <div 
                    className="rounded-2xl p-6 shadow-md"
                    style={{
                      backgroundColor: '#fff8ef',
                      border: '1px solid #ffe2bd',
                      borderLeft: '5px solid #f28c28'
                    }}
                  >
                    <strong className="block text-base md:text-lg font-bold mb-1" style={{ color: '#bd0f0f' }}>
                      A pergunta mais importante
                    </strong>
                    <p className="text-sm md:text-base leading-relaxed" style={{ color: '#555555' }}>
                      Quando algo acontece durante a viagem, o processo da sua empresa está preparado para responder com rapidez, clareza e responsabilidade?
                    </p>
                  </div>
                </section>

                {/* Social Share Box */}
                <SocialShareBar title={title} summary={excerpt} variant="card" />

                {/* Big CTA Banner (Identidade visual da referência: gradiente #bd0f0f to #f28c28) */}
                <div 
                  className="rounded-[22px] p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden space-y-6"
                  style={{
                    background: 'linear-gradient(135deg, #bd0f0f 0%, #f28c28 100%)',
                    boxShadow: '0 16px 38px rgba(189, 15, 15, 0.22)'
                  }}
                >
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-white/90 block">
                    NC Turismo · We Are Travel &amp; Expense
                  </span>
                  <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight max-w-2xl mx-auto">
                    Atendimento que organiza, orienta e resolve
                  </h2>
                  <p className="text-sm md:text-base text-white/90 max-w-xl mx-auto font-light leading-relaxed">
                    Fale com a NC Turismo e descubra como estruturar SLA, suporte ao viajante, plantão, governança e indicadores para uma gestão de viagens mais segura e eficiente.
                  </p>
                  <div className="pt-2">
                    <a
                      href="https://wa.me/554196830144?text=Ol%C3%A1%2C%20vim%20pelo%20Centro%20de%20Conhecimento%20da%20NC%20Turismo%20e%20gostaria%20de%20entender%20como%20estruturar%20SLA%2C%20suporte%20ao%20viajante%20e%20atendimento%20em%20viagens%20corporativas."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white font-bold text-sm uppercase tracking-wider transition-all shadow-xl hover:scale-[1.02]"
                      style={{ color: '#bd0f0f' }}
                    >
                      <MessageCircle size={18} style={{ color: '#bd0f0f' }} />
                      <span>Falar com a NC Turismo</span>
                    </a>
                  </div>
                </div>
              </>
            )}

          </article>

          {/* Sticky Right Sidebar (col-span-4) */}
          <aside className="lg:col-span-4 hidden lg:block space-y-6">
            <div className="sticky top-28 space-y-6">
              
              {/* Author / NC Profile */}
              <div className="bg-[#12141a] border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-nc-orange/20 border border-nc-orange/40 flex items-center justify-center text-nc-orange font-bold">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">NC Turismo</h4>
                    <p className="text-xs text-nc-warm/60">Centro de Conhecimento</p>
                  </div>
                </div>
                <p className="text-xs text-nc-warm/70 leading-relaxed">
                  Artigos e diretrizes técnicas para CFOs, gestores de viagens e lideranças de compras que buscam previsibilidade e redução de custos.
                </p>
              </div>

              {/* Diagnóstico CTA Box */}
              <div className="bg-[#16181d] border border-nc-orange/30 rounded-2xl p-6 space-y-4">
                <div className="inline-flex items-center gap-1.5 text-nc-orange text-xs font-bold uppercase tracking-wider">
                  <TrendingUp size={14} />
                  Diagnóstico Gratuito
                </div>
                <h4 className="text-white font-bold text-base leading-snug">
                  Como está a política de viagens da sua empresa?
                </h4>
                <p className="text-xs text-nc-warm/70 leading-relaxed">
                  Agende uma conversa técnica de 20 minutos com nossos especialistas para mapear savings imediatos.
                </p>
                <button
                  onClick={onBackToHome}
                  className="w-full py-3 bg-nc-orange text-nc-space font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-opacity-95 transition-all"
                >
                  Solicitar Diagnóstico
                </button>
              </div>

              {/* Tags Cloud */}
              <div className="bg-[#12141a] border border-white/10 rounded-2xl p-6 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-nc-warm/50">Tópicos do Artigo</h4>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'SLA', 'Suporte 24h', 'Viagens Corporativas', 'Duty of Care', 
                    'Governança', 'Remarcação', 'Emergência', 'Gestão de Custos'
                  ].map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] text-nc-warm/70"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </aside>

        </div>
      </main>
    </div>
  );
};
