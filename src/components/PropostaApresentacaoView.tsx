import React, { useState, useEffect } from 'react';
import {
  PropostaComercial,
  buildPropostaShareUrl,
  registerPropostaClientDecision,
} from '../lib/supabase';
import {
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Cpu,
  Download,
  FileCheck2,
  Handshake,
  Headphones,
  Layers,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  PieChart,
  Printer,
  Receipt,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  UserCheck,
  ArrowLeft,
  Share2,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface PropostaApresentacaoViewProps {
  proposta: PropostaComercial;
  notFoundCode?: string | null;
  isPublicView?: boolean;
  onBack?: () => void;
  onEdit?: () => void;
  onOpenSendModal?: (proposta: PropostaComercial) => void;
  onUpdateProposta?: (updated: PropostaComercial) => void;
}

export const PropostaApresentacaoView: React.FC<PropostaApresentacaoViewProps> = ({
  proposta,
  notFoundCode = null,
  isPublicView = false,
  onBack,
  onEdit,
  onOpenSendModal,
  onUpdateProposta,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [decisionTab, setDecisionTab] = useState<'aprovar' | 'ajustar' | 'recusar'>('aprovar');
  const [responsavelNome, setResponsavelNome] = useState(proposta.contato_nome || '');
  const [responsavelCargo, setResponsavelCargo] = useState(proposta.contato_cargo || '');
  const [responsavelEmail, setResponsavelEmail] = useState(proposta.contato_email || '');
  const [decisionMessage, setDecisionMessage] = useState('');
  const [acceptedTermsCheck, setAcceptedTermsCheck] = useState(true);
  const [submittingDecision, setSubmittingDecision] = useState(false);
  const [decisionFeedback, setDecisionFeedback] = useState<{
    type: 'success' | 'warning' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    setResponsavelNome(proposta.contato_nome || '');
    setResponsavelCargo(proposta.contato_cargo || '');
    setResponsavelEmail(proposta.contato_email || '');
  }, [proposta.id, proposta.contato_nome, proposta.contato_cargo, proposta.contato_email]);

  const selectedModulos = (proposta.modulos || []).filter((m) => m.selecionado);

  const formatDateBR = (dateStr: string) => {
    if (!dateStr) return new Date().toLocaleDateString('pt-BR');
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const handlePrint = () => {
    window.print();
  };

  const shareUrl = buildPropostaShareUrl(proposta);

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const scrollToDecision = () => {
    const el = document.getElementById('decisao-proposta');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClientDecisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responsavelNome.trim()) {
      setDecisionFeedback({
        type: 'error',
        text: 'Por favor, informe o seu nome completo para registrar a resposta.',
      });
      return;
    }

    if (decisionTab === 'aprovar' && !acceptedTermsCheck) {
      setDecisionFeedback({
        type: 'error',
        text: 'Confirme a caixa de ciência das condições comerciais para concluir o aceite.',
      });
      return;
    }

    if ((decisionTab === 'ajustar' || decisionTab === 'recusar') && !decisionMessage.trim()) {
      setDecisionFeedback({
        type: 'error',
        text:
          decisionTab === 'ajustar'
            ? 'Descreva brevemente quais pontos ou condições gostaria de ajustar.'
            : 'Informe brevemente o motivo para registrarmos em nosso atendimento.',
      });
      return;
    }

    setSubmittingDecision(true);
    setDecisionFeedback(null);

    try {
      const targetStatus =
        decisionTab === 'aprovar'
          ? 'aprovada'
          : decisionTab === 'ajustar'
          ? 'em_negociacao'
          : 'arquivada';

      const result = await registerPropostaClientDecision({
        proposta,
        decision: targetStatus,
        responsavelNome,
        responsavelCargo,
        responsavelEmail,
        mensagem: decisionMessage,
      });

      if (onUpdateProposta) {
        onUpdateProposta(result.proposta);
      }

      setDecisionFeedback({
        type: 'success',
        text:
          targetStatus === 'aprovada'
            ? `Aceite digital da proposta ${proposta.codigo_proposta} confirmado com sucesso! Nossa equipe executiva já foi notificada para iniciar o onboarding.`
            : targetStatus === 'em_negociacao'
            ? `Sua solicitação de ajuste na proposta ${proposta.codigo_proposta} foi registrada com sucesso! Nosso consultor retornará em breve.`
            : `Sua resposta para a proposta ${proposta.codigo_proposta} foi registrada com sucesso.`,
      });
    } catch (err: any) {
      setDecisionFeedback({
        type: 'error',
        text: 'Não foi possível registrar sua resposta no momento. Tente novamente ou fale pelo WhatsApp.',
      });
    } finally {
      setSubmittingDecision(false);
    }
  };

  if (notFoundCode) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-lg w-full bg-slate-900 border border-white/10 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 text-[#C8102E] flex items-center justify-center mx-auto">
            <AlertCircle size={28} />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Proposta Comercial Não Localizada ({notFoundCode})
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Não encontramos uma proposta ativa com o código informado ou o link pode estar incompleto. Solicite o link atualizado diretamente ao seu consultor NC Turismo.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {onBack && (
              <button
                onClick={onBack}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white cursor-pointer"
              >
                Ir para o Portal NC Turismo
              </button>
            )}
            <a
              href={`https://wa.me/554132811153?text=${encodeURIComponent(
                `Olá! Tentei acessar a Proposta Comercial ${notFoundCode} no portal da NC Turismo e gostaria de receber o link atualizado.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#DB8902] text-white text-xs font-bold uppercase tracking-wider"
            >
              <MessageCircle size={15} />
              <span>Falar com Consultor</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'despesas':
        return Receipt;
      case 'obt':
        return Cpu;
      case 'bi':
        return PieChart;
      case 'atendimento':
        return Headphones;
      case 'beneficios':
        return Sparkles;
      default:
        return Layers;
    }
  };

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen font-sans selection:bg-[#C8102E] selection:text-white pb-20 print:bg-white print:pb-0">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3.5 text-white print:hidden">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>{isPublicView ? 'Conhecer o Portal NC' : 'Voltar ao Painel'}</span>
              </button>
            )}
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  proposta.status === 'aprovada'
                    ? 'bg-emerald-400'
                    : proposta.status === 'em_negociacao'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-emerald-400 animate-pulse'
                }`}
              />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Proposta Executiva · <strong className="text-white">{proposta.codigo_proposta}</strong>
              </span>
              {proposta.status === 'aprovada' && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold">
                  <CheckCircle2 size={12} /> Aprovada pelo Cliente
                </span>
              )}
              {proposta.status === 'em_negociacao' && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold">
                  Em Revisão / Negociação
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
              >
                <span>Editar Textos e Escopo</span>
              </button>
            )}

            {onOpenSendModal ? (
              <button
                onClick={() => onOpenSendModal(proposta)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-xs font-bold transition-all cursor-pointer"
                title="Enviar link desta proposta ao cliente via WhatsApp, E-mail ou copiar link"
              >
                <Send size={14} />
                <span>Enviar Proposta ao Cliente</span>
              </button>
            ) : (
              <button
                onClick={handleCopyShareLink}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/30 text-xs font-bold transition-all cursor-pointer"
                title="Copiar link direto desta proposta para enviar ao cliente"
              >
                {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link da Proposta'}</span>
              </button>
            )}

            {isPublicView && proposta.status !== 'aprovada' && (
              <button
                onClick={scrollToDecision}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all cursor-pointer"
              >
                <CheckCircle2 size={14} />
                <span>Aceitar / Responder Proposta</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#DB8902] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:brightness-105 transition-all cursor-pointer"
            >
              <Printer size={14} />
              <span>Imprimir / Salvar PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Document Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-8 space-y-8 print:px-0 print:pt-0 print:space-y-6">
        
        {/* =====================================================================
            CAPA EXECUTIVA CO-BRANDED (NC TURISMO + LOGO DO CLIENTE)
           ===================================================================== */}
        <section
          className="relative overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-xl shadow-slate-900/5 p-8 md:p-12 print:shadow-none print:border-slate-300"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFDFB 55%, #FFF5EB 100%)'
          }}
        >
          {/* Top Accent Gradient Line */}
          <div
            className="w-full h-2 absolute top-0 left-0"
            style={{ background: 'linear-gradient(90deg, #C8102E 0%, #DB8902 100%)' }}
          />

          {/* Co-Branded Logos Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-slate-200/80">
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              {/* NC Turismo Brand */}
              <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-2xs">
                <img
                  src="/assets/aistudio/Logos-nc-turismo-icone_-_Copia_3bd41d50.png"
                  alt="NC Turismo"
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <span className="block text-base font-extrabold tracking-tight text-[#0F172A] leading-none">
                    NC TURISMO
                  </span>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[#C8102E] mt-1">
                    37 Anos · Soluções Corporativas
                  </span>
                </div>
              </div>

              {/* Connector */}
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-amber-50 border border-amber-200/80 text-[#DB8902] shrink-0">
                <Handshake size={18} />
              </div>

              {/* Client Logo or Standardized Company Badge */}
              <div className="flex items-center gap-3.5 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-2xs min-h-[60px]">
                {proposta.cliente_logo_url ? (
                  <img
                    src={proposta.cliente_logo_url}
                    alt={`Logo ${proposta.cliente_nome}`}
                    className="max-h-11 max-w-[160px] object-contain"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-sm shrink-0">
                    {(proposta.cliente_nome || 'CL').substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Apresentação Preparada Para
                  </span>
                  <span className="block text-sm md:text-base font-extrabold text-[#0F172A] leading-tight">
                    {proposta.cliente_nome || 'Empresa Cliente'}
                  </span>
                </div>
              </div>
            </div>

            {/* Metadata Pill */}
            <div className="text-left sm:text-right font-mono text-xs space-y-1 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200/80">
              <div className="text-[11px] font-bold text-[#C8102E] uppercase tracking-wider">
                REF: {proposta.codigo_proposta}
              </div>
              <div className="text-slate-600">
                Emissão: <strong>{formatDateBR(proposta.data_emissao)}</strong>
              </div>
              <div className="text-slate-500 text-[11px]">
                Validade: {proposta.validade_dias || 15} dias corridos
              </div>
            </div>
          </div>

          {/* Main Proposal Headline */}
          <div className="py-8 space-y-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-[#C8102E] text-xs font-bold uppercase tracking-widest">
              <Sparkles size={13} className="text-[#DB8902]" /> Proposta Técnica & Comercial Consultiva
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-[42px] font-display font-extrabold text-[#0F172A] tracking-tight leading-[1.15]">
              {proposta.titulo_apresentacao}
            </h1>

            {proposta.subtitulo_apresentacao && (
              <p className="text-base md:text-lg text-slate-600 leading-relaxed font-normal">
                {proposta.subtitulo_apresentacao}
              </p>
            )}
          </div>

          {/* Client & Consultant Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-200/80">
            {/* Client Card */}
            <div className="p-5 rounded-2xl bg-white/90 border border-slate-200/90 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#C8102E]">
                  Dados da Organização Cliente
                </span>
                <Building2 size={15} className="text-slate-400" />
              </div>
              <div className="text-base font-extrabold text-[#0F172A]">
                {proposta.cliente_nome}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                {proposta.contato_nome && (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">A/C Responsável</span>
                    <strong className="text-slate-800">
                      {proposta.contato_nome} {proposta.contato_cargo ? `(${proposta.contato_cargo})` : ''}
                    </strong>
                  </div>
                )}
                {proposta.cliente_cnpj && (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">CNPJ / Identificação</span>
                    <strong className="text-slate-800">{proposta.cliente_cnpj}</strong>
                  </div>
                )}
                {proposta.cliente_segmento && (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Segmento</span>
                    <strong className="text-slate-800">{proposta.cliente_segmento}</strong>
                  </div>
                )}
                {proposta.cliente_volume_mensal && (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Escopo / Demanda Estimada</span>
                    <strong className="text-slate-800">{proposta.cliente_volume_mensal}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* NC Turismo Consultant Card */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                  Atendimento Executivo NC Turismo
                </span>
                <ShieldCheck size={15} className="text-amber-400" />
              </div>
              <div className="text-base font-bold text-white">
                {proposta.consultor_nome || 'Equipe Executiva NC Turismo'}
              </div>
              <div className="text-xs text-slate-300">
                {proposta.consultor_cargo || 'Consultoria de Viagens & Gestão de Despesas'}
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300 border-t border-white/10">
                {proposta.consultor_email && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={13} className="text-amber-400" /> {proposta.consultor_email}
                  </span>
                )}
                {proposta.consultor_telefone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone size={13} className="text-amber-400" /> {proposta.consultor_telefone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SEÇÃO 1: CARTA EXECUTIVA, DIAGNÓSTICO & OBJETIVOS ESTRATÉGICOS
           ===================================================================== */}
        <section className="bg-white rounded-[28px] border border-slate-200/90 p-8 md:p-10 shadow-sm space-y-8 print:shadow-none print:border-slate-300">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C8102E]">
                01 · Visão Executiva & Diagnóstico Consultivo
              </span>
              <span className="h-1 w-8 bg-[#C8102E] rounded-full" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
              Entendimento do Cenário e Compromisso NC Turismo
            </h2>
          </div>

          {proposta.carta_introducao && (
            <div className="text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-line bg-[#F8FAFC] p-6 rounded-2xl border border-slate-200/80">
              {proposta.carta_introducao}
            </div>
          )}

          {proposta.diagnostico_cenario && (
            <div className="border-l-4 border-[#DB8902] bg-amber-50/50 pl-6 pr-5 py-4 rounded-r-2xl space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#DB8902] block">
                Diagnóstico Operacional & Oportunidade de Eficiência
              </span>
              <p className="text-slate-800 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {proposta.diagnostico_cenario}
              </p>
            </div>
          )}

          {proposta.objetivos_estrategicos && proposta.objetivos_estrategicos.length > 0 && (
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Metas & Pilares de Valor para {proposta.cliente_nome}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proposta.objetivos_estrategicos.map((obj, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FAFCFF] border border-slate-200/90"
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-200/70 text-[#C8102E] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      0{idx + 1}
                    </div>
                    <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
                      {obj}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* =====================================================================
            SEÇÃO 2: PRODUTOS CONSULTIVOS, ATIVOS TECNOLÓGICOS & PROGRAMAS NC
           ===================================================================== */}
        <section className="bg-white rounded-[28px] border border-slate-200/90 p-8 md:p-10 shadow-sm space-y-8 print:shadow-none print:border-slate-300">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#DB8902]">
                  02 · Arquitetura de Soluções, Ativos & Programas
                </span>
                <span className="h-1 w-8 bg-[#DB8902] rounded-full" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
                O Que a NC Turismo Entrega para Sua Operação
              </h2>
              <p className="text-slate-600 text-sm">
                Escopo consultivo e tecnológico selecionado especificamente para atender às demandas de mobilidade, gestão de despesas e governança de <strong>{proposta.cliente_nome}</strong>.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
              <Layers size={15} className="text-[#C8102E]" />
              <span>{selectedModulos.length} Soluções Integráveis no Escopo</span>
            </div>
          </div>

          <div className="space-y-6">
            {selectedModulos.map((mod, index) => {
              const IconComp = getCategoryIcon(mod.categoria);
              return (
                <div
                  key={mod.id}
                  className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-[#FAFCFF] p-6 md:p-8 shadow-2xs space-y-5 hover:border-red-200 transition-all print:break-inside-avoid"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C8102E] to-[#DB8902] text-white flex items-center justify-center font-bold shadow-md shrink-0">
                        <IconComp size={22} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8102E]">
                            Módulo 0{index + 1}
                          </span>
                          {mod.ativo_programa && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-[#DB8902] text-[11px] font-bold">
                              Ativo / Programa: {mod.ativo_programa}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg md:text-xl font-extrabold text-[#0F172A]">
                          {mod.titulo}
                        </h3>
                        {mod.subtitulo && (
                          <p className="text-xs md:text-sm font-medium text-slate-500">
                            {mod.subtitulo}
                          </p>
                        )}
                      </div>
                    </div>

                    {mod.destaque && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        {mod.destaque}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                    {mod.descricao}
                  </p>

                  {mod.entregaveis && mod.entregaveis.length > 0 && (
                    <div className="pt-4 border-t border-slate-200/70">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                        Entregáveis Técnicos & Operacionais Inclusos:
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {mod.entregaveis.map((item, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700">
                            <CheckCircle2 size={15} className="text-[#C8102E] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================================
            SEÇÃO 3: CRONOGRAMA & METODOLOGIA DE IMPLANTAÇÃO ASSISTIDA
           ===================================================================== */}
        {proposta.etapas_implantacao && proposta.etapas_implantacao.length > 0 && (
          <section className="bg-white rounded-[28px] border border-slate-200/90 p-8 md:p-10 shadow-sm space-y-6 print:shadow-none print:border-slate-300 print:break-inside-avoid">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C8102E]">
                  03 · Implantação & Onboarding
                </span>
                <span className="h-1 w-8 bg-[#C8102E] rounded-full" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
                Transição Segura e Parametrização em 4 Etapas
              </h2>
              {proposta.metodologia_texto && (
                <p className="text-slate-600 text-sm md:text-base">
                  {proposta.metodologia_texto}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {proposta.etapas_implantacao.map((etapa, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#C8102E] uppercase">
                        {etapa.fase}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-100/80 text-[#DB8902] font-mono text-[11px] font-bold">
                        {etapa.prazo}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#0F172A]">
                      {etapa.titulo}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {etapa.descricao}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =====================================================================
            SEÇÃO 4: CONDIÇÕES COMERCIAIS, INVESTIMENTO & BENEFÍCIOS
           ===================================================================== */}
        <section className="bg-white rounded-[28px] border border-slate-200/90 p-8 md:p-10 shadow-sm space-y-6 print:shadow-none print:border-slate-300 print:break-inside-avoid">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#DB8902]">
                04 · Proposta Comercial & Condições de Parceria
              </span>
              <span className="h-1 w-8 bg-[#DB8902] rounded-full" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
              Estrutura de Investimento e Benefícios Inclusos
            </h2>
            {proposta.modelo_remuneracao_resumo && (
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                {proposta.modelo_remuneracao_resumo}
              </p>
            )}
          </div>

          {proposta.beneficio_especial_destaque && (
            <div
              className="p-5 rounded-2xl border border-amber-300/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{
                background: 'linear-gradient(135deg, #FFFDFB 0%, #FFF4E5 50%, #FFE9CC 100%)'
              }}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#C8102E] text-white flex items-center justify-center shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C8102E] block">
                    Vantagem Exclusiva na Aprovação desta Proposta
                  </span>
                  <strong className="text-sm md:text-base font-extrabold text-[#0F172A]">
                    {proposta.beneficio_especial_destaque}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* Commercial Table */}
          {proposta.itens_comerciais && proposta.itens_comerciais.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-[11px] font-mono uppercase tracking-wider">
                    <th className="py-3.5 px-4">Item / Solução / Ativo</th>
                    <th className="py-3.5 px-4">Modalidade</th>
                    <th className="py-3.5 px-4">Investimento / Condição</th>
                    <th className="py-3.5 px-4">Observações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs md:text-sm">
                  {proposta.itens_comerciais.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-bold text-[#0F172A]">{item.item}</td>
                      <td className="py-3.5 px-4 text-slate-600">{item.modelo}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs">
                          {item.valor}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">{item.observacao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* =====================================================================
            SEÇÃO 5: TERMOS, SLA, LGPD & FORMALIZAÇÃO DE ACEITE
           ===================================================================== */}
        <section className="bg-white rounded-[28px] border border-slate-200/90 p-8 md:p-10 shadow-sm space-y-6 print:shadow-none print:border-slate-300 print:break-inside-avoid">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                05 · Termos Comerciais, SLA Operacional & Governança
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] tracking-tight">
              Termos Gerais e Garantias de Nível de Serviço
            </h2>
          </div>

          {proposta.termos_condicoes && (
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-sans">
              {proposta.termos_condicoes}
            </div>
          )}

          {proposta.observacoes_finais && (
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs md:text-sm text-slate-700">
              <strong className="text-[#0F172A] block mb-1">Nota Consultiva Adicional:</strong>
              {proposta.observacoes_finais}
            </div>
          )}

          {/* Signatures Block */}
          <div className="pt-8 mt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-[#FAFCFF] border border-slate-200/80 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C8102E] font-bold block">
                Proponente · NC Turismo (37 Anos)
              </span>
              <div className="h-10 border-b border-slate-300 flex items-end pb-1 font-display italic text-slate-700 text-sm">
                {proposta.consultor_nome}
              </div>
              <div className="text-xs text-slate-600">
                <strong className="text-[#0F172A] block">{proposta.consultor_nome}</strong>
                <span>{proposta.consultor_cargo}</span>
                <span className="block text-slate-400 mt-0.5">{proposta.consultor_email} · {proposta.consultor_telefone}</span>
              </div>
            </div>

            <div
              className={`p-6 rounded-2xl border space-y-3 ${
                proposta.status === 'aprovada'
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-[#FAFCFF] border-slate-200/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                  De Acordo / Aceite do Cliente
                </span>
                {proposta.status === 'aprovada' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider">
                    <CheckCircle2 size={11} /> Aceite Confirmado
                  </span>
                )}
              </div>
              <div className="h-10 border-b border-slate-300 flex items-end pb-1 font-display italic text-slate-800 text-sm">
                {proposta.status === 'aprovada' ? proposta.contato_nome || responsavelNome : ''}
              </div>
              <div className="text-xs text-slate-600">
                <strong className="text-[#0F172A] block">{proposta.cliente_nome}</strong>
                <span>Representante: {proposta.contato_nome || '_______________________________'}</span>
                <span className="block text-slate-500 mt-0.5">
                  {proposta.status === 'aprovada'
                    ? `Aprovada digitalmente em ${formatDateBR(proposta.updated_at?.slice(0, 10))}`
                    : 'Data de aprovação: ____/____/2026'}
                </span>
              </div>
            </div>
          </div>

          {/* =================================================================
              CENTRAL INTERATIVA DE ACEITE OU RESPOSTA DO CLIENTE (NÃO IMPRIME)
             ================================================================= */}
          <div id="decisao-proposta" className="pt-8 mt-6 border-t-2 border-slate-200 print:hidden">
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-[#0F172A] via-[#131C31] to-[#1A1423] text-white p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
                    <FileCheck2 size={13} /> Formalização Digital da Proposta · {proposta.codigo_proposta}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    Deseja Aprovar esta Proposta ou Solicitar Ajustes?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Registre abaixo sua decisão para que nossa equipe executiva inicie o onboarding ou realize eventuais adequações no escopo.
                  </p>
                </div>

                {/* Status Badge Atual */}
                <div className="shrink-0">
                  {proposta.status === 'aprovada' ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                      <CheckCircle2 size={16} />
                      <span>Proposta Aprovada</span>
                    </div>
                  ) : proposta.status === 'em_negociacao' ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
                      <Clock size={16} />
                      <span>Em Revisão / Negociação</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-slate-200 text-xs font-bold">
                      <Clock size={16} className="text-amber-400" />
                      <span>Aguardando Parecer do Cliente</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3 Opções de Decisão */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDecisionTab('aprovar');
                    setDecisionFeedback(null);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    decisionTab === 'aprovar'
                      ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      decisionTab === 'aprovar' ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-emerald-400'
                    }`}
                  >
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white">1. Aceitar Proposta</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      Aprovar condições e iniciar implantação
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDecisionTab('ajustar');
                    setDecisionFeedback(null);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    decisionTab === 'ajustar'
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      decisionTab === 'ajustar' ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-amber-400'
                    }`}
                  >
                    <Handshake size={18} />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white">2. Solicitar Ajustes</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      Revisar escopo, valores ou tirar dúvidas
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDecisionTab('recusar');
                    setDecisionFeedback(null);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    decisionTab === 'recusar'
                      ? 'bg-red-500/20 border-red-400 text-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      decisionTab === 'recusar' ? 'bg-red-500 text-white' : 'bg-white/10 text-red-400'
                    }`}
                  >
                    <XCircle size={18} />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white">3. Não Aprovar Agora</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      Declinar ou adiar projeto para outro momento
                    </div>
                  </div>
                </button>
              </div>

              {/* Formulário de Registro da Decisão */}
              <form onSubmit={handleClientDecisionSubmit} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-300 mb-1.5">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={responsavelNome}
                      onChange={(e) => setResponsavelNome(e.target.value)}
                      placeholder="Ex: Régis Silva"
                      className="w-full h-11 rounded-xl bg-white/10 border border-white/15 px-3.5 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-300 mb-1.5">
                      Cargo / Departamento
                    </label>
                    <input
                      type="text"
                      value={responsavelCargo}
                      onChange={(e) => setResponsavelCargo(e.target.value)}
                      placeholder="Ex: Diretor / Gestor Financeiro"
                      className="w-full h-11 rounded-xl bg-white/10 border border-white/15 px-3.5 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-300 mb-1.5">
                      E-mail Corporativo
                    </label>
                    <input
                      type="email"
                      value={responsavelEmail}
                      onChange={(e) => setResponsavelEmail(e.target.value)}
                      placeholder="nome@suaempresa.com.br"
                      className="w-full h-11 rounded-xl bg-white/10 border border-white/15 px-3.5 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-300 mb-1.5">
                    {decisionTab === 'aprovar'
                      ? 'Observações para o Início da Implantação (Opcional)'
                      : decisionTab === 'ajustar'
                      ? 'Quais pontos ou condições você gostaria de ajustar na proposta? *'
                      : 'Gostaria de informar o motivo do adiamento/recusa? *'}
                  </label>
                  <textarea
                    rows={3}
                    value={decisionMessage}
                    onChange={(e) => setDecisionMessage(e.target.value)}
                    placeholder={
                      decisionTab === 'aprovar'
                        ? 'Ex: Aprovado! Podemos agendar a reunião de kickoff para esta semana.'
                        : decisionTab === 'ajustar'
                        ? 'Ex: Gostaria de revisar a condição comercial do item X ou incluir mais um centro de custo...'
                        : 'Ex: Vamos retomar o projeto no próximo trimestre.'
                    }
                    className="w-full rounded-xl bg-white/10 border border-white/15 p-3.5 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {decisionTab === 'aprovar' && (
                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-400/30 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTermsCheck}
                      onChange={(e) => setAcceptedTermsCheck(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-emerald-500 rounded"
                    />
                    <span className="text-xs text-slate-200 leading-relaxed">
                      Declaro estar de acordo com o escopo consultivo e as condições comerciais apresentadas na Proposta{' '}
                      <strong>{proposta.codigo_proposta}</strong> para <strong>{proposta.cliente_nome}</strong>, autorizando o contato da equipe NC Turismo para formalização contratual e kickoff.
                    </span>
                  </label>
                )}

                {decisionFeedback && (
                  <div
                    className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      decisionFeedback.type === 'success'
                        ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200'
                        : 'bg-red-500/20 border-red-400/50 text-red-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                      <span>{decisionFeedback.text}</span>
                    </div>
                    {decisionFeedback.type === 'success' && (
                      <a
                        href={`https://wa.me/554132811153?text=${encodeURIComponent(
                          decisionTab === 'aprovar'
                            ? `Olá! Acabei de registrar o ACEITE DIGITAL da Proposta Comercial ${proposta.codigo_proposta} (${proposta.cliente_nome}) no portal da NC Turismo. Responsável: ${responsavelNome}. Podemos alinhar os próximos passos!`
                            : `Olá! Acabei de registrar uma observação na Proposta Comercial ${proposta.codigo_proposta} (${proposta.cliente_nome}): "${decisionMessage}"`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shrink-0 hover:bg-amber-300 transition-colors"
                      >
                        <MessageCircle size={14} />
                        <span>Notificar Consultor no WhatsApp</span>
                      </a>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <a
                    href={`https://wa.me/554132811153?text=${encodeURIComponent(
                      `Olá! Estou analisando a Proposta Comercial ${proposta.codigo_proposta} preparada pela NC Turismo para a empresa ${proposta.cliente_nome} e gostaria de falar com o consultor.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-amber-300 hover:text-amber-200 font-semibold"
                  >
                    <MessageCircle size={15} />
                    <span>Prefere falar antes pelo WhatsApp com o consultor? Clique aqui</span>
                  </a>

                  <button
                    type="submit"
                    disabled={submittingDecision}
                    className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all cursor-pointer disabled:opacity-50 ${
                      decisionTab === 'aprovar'
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                        : decisionTab === 'ajustar'
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                        : 'bg-red-500 hover:bg-red-400 text-white'
                    }`}
                  >
                    {decisionTab === 'aprovar' ? (
                      <>
                        <CheckCircle2 size={17} />
                        <span>{submittingDecision ? 'Confirmando Aceite...' : 'Confirmar Aceite da Proposta'}</span>
                      </>
                    ) : decisionTab === 'ajustar' ? (
                      <>
                        <Send size={16} />
                        <span>{submittingDecision ? 'Enviando...' : 'Enviar Solicitação de Ajustes'}</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={16} />
                        <span>{submittingDecision ? 'Registrando...' : 'Registrar Recusa / Adiamento'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
