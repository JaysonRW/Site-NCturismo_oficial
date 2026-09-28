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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#C8102E] selection:text-white relative overflow-hidden">
      {/* Soft ambient warm atmospheric glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-red-100/30 via-orange-50/20 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[600px] right-0 w-[500px] h-[600px] bg-gradient-to-l from-amber-100/25 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-0 w-[600px] h-[600px] bg-gradient-to-r from-red-100/20 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Floating Vertical Social Share Dock on Desktop */}
      <SocialShareBar title={title} summary={excerpt} variant="floating" />

      {/* Top Floating Bar */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 pt-28 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="text-xs uppercase tracking-wider text-slate-500 hover:text-[#C8102E] transition-colors cursor-pointer font-semibold"
            >
              Início
            </button>
            <ChevronRight size={14} className="text-slate-300" />
            <button
              onClick={onBackToBlog}
              className="text-xs uppercase tracking-wider text-[#C8102E] font-bold hover:underline flex items-center gap-1.5 cursor-pointer"
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

      {/* Hero Header Editorial - Visual elegante com harmonia quente editorial */}
      <header className="max-w-[1240px] mx-auto px-6 md:px-12 mb-12">
        <div 
          className="relative rounded-[28px] border border-red-200/80 p-8 md:p-14 overflow-hidden shadow-lg shadow-red-500/5"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFDFB 45%, #FFF6EC 100%)'
          }}
        >
          {/* Top colored strip: #C8102E to #DB8902 */}
          <div 
            className="w-[88px] h-[5px] rounded-full mb-6"
            style={{ background: 'linear-gradient(90deg, #C8102E, #DB8902)' }}
          />

          <span 
            className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-red-50 to-orange-50 text-[#C8102E] border border-red-200 shadow-2xs"
          >
            Conhecimento NC · {categoryName}
          </span>

          <h1 className="text-3xl md:text-5xl lg:text-[44px] font-bold text-[#0F172A] tracking-tight leading-[1.14] mb-6 max-w-4xl">
            {title}
          </h1>

          <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-normal max-w-3xl mb-8">
            {excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-200/80 text-xs md:text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-[#C8102E]" />
              <span className="text-[#0F172A] font-semibold">Por NC Turismo</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-[#DB8902]" />
              <span className="font-medium">{readingTime} min de leitura</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-[#C8102E]" />
              <span className="font-medium">{publishedDate}</span>
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
              <div className="space-y-6 text-slate-700 text-base md:text-[17px] leading-relaxed">
                {post.cover_image && (
                  <div className="w-full h-80 md:h-96 rounded-2xl overflow-hidden border border-slate-200 mb-8 shadow-xs">
                    <img 
                      src={post.cover_image} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div className="whitespace-pre-line text-slate-700 leading-relaxed space-y-4">
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
                <div className="space-y-5 text-slate-700 text-base md:text-[17px] leading-relaxed">
                  <p>
                    A evolução da tecnologia mudou profundamente a forma como empresas solicitam, aprovam e acompanham viagens corporativas. Ferramentas de reserva online, plataformas de despesas, aplicativos, integrações com ERP e painéis de indicadores trouxeram mais agilidade, controle e autonomia para muitos processos.
                  </p>
                  <p>
                    Mas, mesmo em operações digitalizadas, uma pergunta continua relevante:
                  </p>

                  {/* Callout Box "A Pergunta Central" com borda laranja vibrante e fundo acolhedor */}
                  <div 
                    className="rounded-2xl p-6 md:p-8 shadow-sm space-y-2 relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #FFFDFB 0%, #FFF7EE 100%)',
                      border: '1px solid #FED7AA',
                      borderLeft: '5px solid #DB8902'
                    }}
                  >
                    <strong className="block text-xl font-bold tracking-tight text-[#C8102E]">
                      A pergunta central
                    </strong>
                    <p className="text-base md:text-lg font-semibold text-slate-800">
                      Quando algo sai do planejado, quem resolve?
                    </p>
                  </div>

                  <p>
                    Essa pergunta explica por que suporte ao viajante e SLA de atendimento continuam sendo temas centrais na gestão de viagens corporativas.
                  </p>
                  <p>
                    Em uma viagem a trabalho, nem tudo acontece dentro do fluxo ideal. Voos atrasam, conexões são perdidas, reuniões mudam de horário, hotéis podem ter divergências de reserva, veículos podem não estar disponíveis, documentos podem gerar dúvidas, tarifas podem ter regras restritivas e emergências podem acontecer durante a jornada.
                  </p>
                  <p className="font-bold text-[#0F172A] bg-amber-50/70 border-l-4 border-[#DB8902] px-4 py-2 rounded-r-xl">
                    Nesses momentos, a gestão de viagens deixa de ser apenas reserva e passa a ser resposta. É por isso que atendimento ainda importa.
                  </p>
                </div>

                {/* Manifesto Banner "We Are Travel & Expense" */}
                <div 
                  className="rounded-[24px] p-8 md:p-10 shadow-md space-y-3 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #FFF6F3 0%, #FFFBF7 50%, #FEF3C7 100%)',
                    border: '1px solid #FED7AA'
                  }}
                >
                  <span className="text-xs font-bold uppercase tracking-[0.2em] block text-[#C8102E]">
                    We Are Travel &amp; Expense
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] leading-tight">
                    Atendimento não substitui tecnologia. Ele complementa a gestão.
                  </h2>
                  <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal">
                    O suporte é essencial nas situações que exigem análise, priorização, orientação e resolução.
                  </p>
                </div>

                {/* Section 01: O que é SLA */}
                <section className="space-y-5 pt-4">
                  <div 
                    className="w-[76px] h-[4px] rounded-full mb-3"
                    style={{ background: 'linear-gradient(90deg, #C8102E, #DB8902)' }}
                  />
                  <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
                    O que é SLA em viagens corporativas
                  </h2>
                  <p className="text-slate-700 text-base md:text-[17px] leading-relaxed">
                    SLA é a sigla para <strong className="text-[#0F172A]">Service Level Agreement</strong>, ou Acordo de Nível de Serviço. Na gestão de viagens corporativas, ele define parâmetros de atendimento entre a empresa, seus fornecedores e os usuários do processo.
                  </p>
                  <p className="text-slate-700 text-base md:text-[17px] leading-relaxed">
                    Na prática, o SLA ajuda a estabelecer prazos, canais, prioridades, responsabilidades e formas de acompanhamento das solicitações relacionadas às viagens corporativas.
                  </p>

                  {/* Checklist Container */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
                    <h3 className="text-base md:text-lg font-bold text-[#C8102E]">
                      Um SLA ajuda a responder:
                    </h3>
                    <ul className="space-y-3 text-sm md:text-base text-slate-700">
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
                          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#C8102E] to-[#DB8902] mt-1.5 shrink-0 shadow-2xs" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Insight Box */}
                  <div 
                    className="rounded-2xl p-6 shadow-sm"
                    style={{
                      background: 'linear-gradient(135deg, #FFFDFB 0%, #FFF8F0 100%)',
                      border: '1px solid #FED7AA',
                      borderLeft: '5px solid #DB8902'
                    }}
                  >
                    <strong className="block text-base md:text-lg font-bold mb-1 text-[#C8102E]">
                      Um SLA bem definido não elimina imprevistos
                    </strong>
                    <p className="text-sm md:text-base leading-relaxed text-slate-600">
                      Mas melhora a forma como eles são tratados. Ele cria previsibilidade, organiza prioridades e dá mais clareza sobre responsabilidades.
                    </p>
                  </div>
                </section>

                {/* Section 02: Sem SLA */}
                <section className="space-y-5 pt-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
                    Sem SLA, cada área pode ter uma expectativa diferente
                  </h2>
                  <p className="text-slate-700 text-base md:text-[17px] leading-relaxed">
                    Sem SLA, cada área pode interpretar o atendimento de uma forma. O viajante espera resposta imediata. O gestor espera solução rápida. O financeiro espera documentação correta. O fornecedor pode trabalhar com prazos genéricos.
                  </p>
                  <p className="text-slate-700 text-base md:text-[17px] leading-relaxed">
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
                      <div key={idx} className="bg-white border border-slate-200/90 hover:border-red-300 p-5 rounded-2xl space-y-1.5 transition-all shadow-2xs hover:shadow-md hover:-translate-y-0.5">
                        <strong className="text-[#C8102E] font-bold text-base block">{actor.role}</strong>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{actor.desc}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm md:text-base text-slate-500 italic">
                    Quando essas expectativas não estão alinhadas, a gestão perde clareza justamente nos momentos em que mais precisa de resposta.
                  </p>
                </section>

                {/* Section 03: Suporte não é apenas operacional */}
                <section className="space-y-5 pt-4">
                  <div 
                    className="w-[76px] h-[4px] rounded-full mb-3"
                    style={{ background: 'linear-gradient(90deg, #C8102E, #DB8902)' }}
                  />
                  <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
                    Suporte não é apenas atendimento operacional
                  </h2>
                  <p className="text-slate-700 text-base md:text-[17px] leading-relaxed">
                    Em muitas empresas, suporte em viagens ainda é visto como algo simples: responder solicitações, emitir reservas ou fazer alterações quando necessário.
                  </p>
                  <p className="text-slate-700 text-base md:text-[17px] leading-relaxed">
                    Essa visão é limitada. O suporte em viagens corporativas envolve compreensão da política, leitura da urgência, avaliação das opções disponíveis, conhecimento das regras tarifárias, orientação ao viajante, comunicação com fornecedores, registro de exceções e alinhamento com os interesses da empresa.
                  </p>

                  {/* 3 cards de cenários complexos */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-b from-white to-red-50/20 border border-slate-200/90 hover:border-red-300 p-5 rounded-2xl space-y-2 shadow-2xs hover:shadow-md transition-all">
                      <strong className="text-base block font-bold text-[#C8102E]">Remarcação de voo</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Pode envolver diferença tarifária, multa, agenda, conexão, aprovação e registro posterior.
                      </p>
                    </div>
                    <div className="bg-gradient-to-b from-white to-red-50/20 border border-slate-200/90 hover:border-red-300 p-5 rounded-2xl space-y-2 shadow-2xs hover:shadow-md transition-all">
                      <strong className="text-base block font-bold text-[#C8102E]">Hospedagem com problema</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Pode exigir renegociação, troca de hotel, análise de localização, segurança e pagamento.
                      </p>
                    </div>
                    <div className="bg-gradient-to-b from-white to-red-50/20 border border-slate-200/90 hover:border-red-300 p-5 rounded-2xl space-y-2 shadow-2xs hover:shadow-md transition-all">
                      <strong className="text-base block font-bold text-[#C8102E]">Viagem internacional</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Pode envolver documentação, regras de entrada, conexões, bagagem, fuso horário e reação rápida.
                      </p>
                    </div>
                  </div>

                  <div 
                    className="rounded-2xl p-6 shadow-sm"
                    style={{
                      background: 'linear-gradient(135deg, #FFFDFB 0%, #FFF8F0 100%)',
                      border: '1px solid #FED7AA',
                      borderLeft: '5px solid #DB8902'
                    }}
                  >
                    <strong className="block text-base md:text-lg font-bold mb-1 text-[#C8102E]">
                      Suporte não é apenas executar
                    </strong>
                    <p className="text-sm md:text-base leading-relaxed text-slate-600">
                      É interpretar o contexto e orientar a melhor decisão possível para a empresa e para o viajante.
                    </p>
                  </div>
                </section>

                {/* Section 04: Tecnologia resolve fluxo */}
                <section className="space-y-5 pt-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
                    Tecnologia resolve fluxo, mas nem sempre resolve exceção
                  </h2>
                  <p className="text-slate-700 text-base md:text-[17px] leading-relaxed">
                    A tecnologia é muito eficiente para organizar processos previsíveis. Ela ajuda a padronizar solicitações, aplicar políticas, automatizar aprovações, registrar informações, centralizar dados e gerar relatórios.
                  </p>
                  <p className="text-slate-700 text-base md:text-[17px] leading-relaxed">
                    Mas viagens corporativas têm uma característica importante: elas envolvem movimento, agenda, pessoas, fornecedores e risco.
                  </p>

                  <div className="bg-white border border-red-200/80 rounded-2xl p-6 md:p-8 space-y-3.5 shadow-sm">
                    <h3 className="text-base font-bold flex items-center gap-2 text-[#C8102E]">
                      <AlertCircle size={18} />
                      O problema aparece quando a viagem sai do padrão:
                    </h3>
                    <ul className="space-y-2.5 text-sm md:text-base text-slate-700">
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
                          <span className="w-5 h-5 rounded-full bg-red-50 text-[#C8102E] border border-red-200 flex items-center justify-center font-bold text-xs shrink-0">!</span>
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Manifesto Banner 2 */}
                <div 
                  className="rounded-[24px] p-8 md:p-10 shadow-md space-y-3 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #FFF6F3 0%, #FFFBF7 50%, #FEF3C7 100%)',
                    border: '1px solid #FED7AA'
                  }}
                >
                  <span className="text-xs font-bold uppercase tracking-[0.2em] block text-[#C8102E]">
                    We Are Travel &amp; Expense
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] leading-tight">
                    Uma gestão madura não substitui atendimento por tecnologia
                  </h2>
                  <p className="text-base text-slate-700 leading-relaxed font-normal">
                    Ela combina os dois: ferramenta para organizar o processo e suporte humano para agir quando a exceção exige análise, negociação e priorização.
                  </p>
                </div>

                {/* Section 05: SLA Medido */}
                <section className="space-y-5 pt-4">
                  <div 
                    className="w-[76px] h-[4px] rounded-full mb-3"
                    style={{ background: 'linear-gradient(90deg, #C8102E, #DB8902)' }}
                  />
                  <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
                    SLA precisa ser medido com indicadores claros
                  </h2>
                  <p className="text-slate-700 text-base md:text-[17px] leading-relaxed">
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
                      <div key={idx} className="bg-gradient-to-b from-white to-slate-50 border border-slate-200/90 hover:border-red-300 p-4 rounded-xl text-center flex items-center justify-center shadow-2xs hover:shadow-xs hover:scale-[1.02] transition-all">
                        <span className="text-xs md:text-sm font-semibold text-[#0F172A]">{metric}</span>
                      </div>
                    ))}
                  </div>

                  <div 
                    className="rounded-2xl p-6 shadow-sm"
                    style={{
                      background: 'linear-gradient(135deg, #FFFDFB 0%, #FFF8F0 100%)',
                      border: '1px solid #FED7AA',
                      borderLeft: '5px solid #DB8902'
                    }}
                  >
                    <strong className="block text-base md:text-lg font-bold mb-1 text-[#C8102E]">
                      Medir atendimento é uma forma de melhorar a gestão
                    </strong>
                    <p className="text-sm md:text-base leading-relaxed text-slate-600">
                      Sem dados, o suporte é avaliado apenas por percepção. Com dados, a empresa consegue identificar padrões e ajustar processos.
                    </p>
                  </div>
                </section>

                {/* Section 06: Duty of Care */}
                <section className="space-y-5 pt-4">
                  <div 
                    className="w-[76px] h-[4px] rounded-full mb-3"
                    style={{ background: 'linear-gradient(90deg, #C8102E, #DB8902)' }}
                  />
                  <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
                    Suporte humano e Duty of Care
                  </h2>
                  <p className="text-slate-700 text-base md:text-[17px] leading-relaxed">
                    O suporte ao viajante também se conecta diretamente ao <strong className="text-[#0F172A]">duty of care</strong>, que é a responsabilidade legal e moral da empresa de cuidar, orientar e apoiar colaboradores durante deslocamentos a trabalho.
                  </p>

                  <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-3 shadow-xs">
                    <h3 className="text-base font-bold flex items-center gap-2 text-[#C8102E]">
                      <ShieldCheck size={18} />
                      Uma gestão madura precisa saber:
                    </h3>
                    <ul className="space-y-2 text-sm md:text-base text-slate-700">
                      {[
                        'Onde seus viajantes estão em tempo real.',
                        'Como contatá-los de forma imediata.',
                        'Como apoiá-los quando necessário.',
                        'Quais canais de contingência acionar.',
                        'Quais responsabilidades cabem à empresa, gestor, fornecedor e viajante.'
                      ].map((doc, idx) => (
                        <li key={idx} className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#DB8902] to-[#C8102E] shrink-0" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div 
                    className="rounded-2xl p-6 shadow-sm"
                    style={{
                      background: 'linear-gradient(135deg, #FFFDFB 0%, #FFF6F3 100%)',
                      border: '1px solid #FECACA',
                      borderLeft: '5px solid #C8102E'
                    }}
                  >
                    <strong className="block text-base md:text-lg font-bold mb-1 text-[#C8102E]">
                      Duty of care não depende apenas de intenção
                    </strong>
                    <p className="text-sm md:text-base leading-relaxed text-slate-600">
                      Depende de processo, informação atualizada e capacidade de resposta operacional.
                    </p>
                  </div>
                </section>

                {/* Conclusion */}
                <section className="space-y-5 pt-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
                    Conclusão
                  </h2>
                  <p className="text-slate-700 text-base md:text-[17px] leading-relaxed">
                    SLA e suporte continuam importantes na gestão de viagens corporativas porque viagens envolvem pessoas, agendas, riscos e imprevistos. A tecnologia ajuda a organizar o processo, mas não elimina a necessidade de atendimento estruturado.
                  </p>
                  <p className="text-slate-700 text-base md:text-[17px] leading-relaxed">
                    Isso fortalece a governança, melhora a experiência do viajante, reduz improvisos e apoia o duty of care.
                  </p>

                  <div 
                    className="rounded-2xl p-6 shadow-sm"
                    style={{
                      background: 'linear-gradient(135deg, #FFFDFB 0%, #FFF8F0 100%)',
                      border: '1px solid #FED7AA',
                      borderLeft: '5px solid #DB8902'
                    }}
                  >
                    <strong className="block text-base md:text-lg font-bold mb-1 text-[#C8102E]">
                      A pergunta mais importante
                    </strong>
                    <p className="text-sm md:text-base leading-relaxed text-slate-600">
                      Quando algo acontece durante a viagem, o processo da sua empresa está preparado para responder com rapidez, clareza e responsabilidade?
                    </p>
                  </div>
                </section>

                {/* Social Share Box */}
                <SocialShareBar title={title} summary={excerpt} variant="card" />

                {/* Big CTA Banner (Identidade visual da referência: gradiente #C8102E to #DB8902) */}
                <div 
                  className="rounded-[26px] p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden space-y-6"
                  style={{
                    background: 'linear-gradient(135deg, #C8102E 0%, #D32F2F 50%, #DB8902 100%)',
                    boxShadow: '0 16px 38px rgba(200, 16, 46, 0.25)'
                  }}
                >
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-white/90 block">
                    NC Turismo · We Are Travel &amp; Expense
                  </span>
                  <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight max-w-2xl mx-auto">
                    Atendimento que organiza, orienta e resolve
                  </h2>
                  <p className="text-sm md:text-base text-white/90 max-w-xl mx-auto font-normal leading-relaxed">
                    Fale com a NC Turismo e descubra como estruturar SLA, suporte ao viajante, plantão, governança e indicadores para uma gestão de viagens mais segura e eficiente.
                  </p>
                  <div className="pt-2">
                    <a
                      href="https://wa.me/554196830144?text=Ol%C3%A1%2C%20vim%20pelo%20Centro%20de%20Conhecimento%20da%20NC%20Turismo%20e%20gostaria%20de%20entender%20como%20estruturar%20SLA%2C%20suporte%20ao%20viajante%20e%20atendimento%20em%20viagens%20corporativas."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white font-bold text-sm uppercase tracking-wider transition-all shadow-xl hover:scale-[1.02] text-[#C8102E] hover:bg-slate-50 cursor-pointer"
                    >
                      <MessageCircle size={18} className="text-[#C8102E]" />
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
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 flex items-center justify-center text-[#C8102E] font-bold shadow-2xs">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-[#0F172A] font-bold text-sm">NC Turismo</h4>
                    <p className="text-xs text-slate-500 font-medium">Centro de Conhecimento</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Artigos e diretrizes técnicas para CFOs, gestores de viagens e lideranças de compras que buscam previsibilidade e redução de custos.
                </p>
              </div>

              {/* Diagnóstico CTA Box */}
              <div className="bg-gradient-to-br from-white via-red-50/30 to-amber-50/40 border border-red-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="inline-flex items-center gap-1.5 text-[#C8102E] text-xs font-bold uppercase tracking-wider">
                  <TrendingUp size={14} />
                  Diagnóstico Gratuito
                </div>
                <h4 className="text-[#0F172A] font-bold text-base leading-snug">
                  Como está a política de viagens da sua empresa?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Agende uma conversa técnica de 20 minutos com nossos especialistas para mapear savings imediatos.
                </p>
                <button
                  onClick={onBackToHome}
                  className="w-full py-3 bg-gradient-to-r from-[#C8102E] to-[#DB8902] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-105 shadow-md shadow-red-500/20 transition-all cursor-pointer"
                >
                  Solicitar Diagnóstico
                </button>
              </div>

              {/* Tags Cloud */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tópicos do Artigo</h4>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'SLA', 'Suporte 24h', 'Viagens Corporativas', 'Duty of Care', 
                    'Governança', 'Remarcação', 'Emergência', 'Gestão de Custos'
                  ].map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-[11px] text-slate-600 hover:text-[#C8102E] transition-colors cursor-default"
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
