import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink, 
  FileText, 
  Lock, 
  Building2, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  X,
  AlertCircle,
  Handshake,
  Users,
  Award,
  Tag,
  Briefcase,
  Compass,
  Layers,
  Ticket,
  Headphones
} from 'lucide-react';
import { recordTermsAcceptance, validateEmpresaCodigo, EmpresaConveniada } from '../lib/supabase';
import { LeadForm } from './LeadForm';

interface BeneficiosViagensViewProps {
  onBackToHome: () => void;
  onOpenLegalTab?: (tab: 'privacidade' | 'beneficios' | 'termos') => void;
}

export const BeneficiosViagensView: React.FC<BeneficiosViagensViewProps> = ({
  onBackToHome,
  onOpenLegalTab
}) => {
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectSuccess, setRedirectSuccess] = useState(false);
  const [consentWarning, setConsentWarning] = useState(false);

  // Modal preview state for viewing legal documents inline
  const [modalDocument, setModalDocument] = useState<'termos' | 'privacidade' | null>(null);

  // Parceria formalizada real (só exibe badge de convênio se vier de link oficial e validado no banco)
  const [formalPartner, setFormalPartner] = useState<EmpresaConveniada | null>(null);

  const DOCUMENT_VERSION = 'Termos de Uso v1.1 e Política de Privacidade v1.1';
  const TARGET_URL = 'http://beneficios.ncturismo.com.br/b2c/';

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get('convenio') || params.get('codigo') || params.get('parceiro') || '';
      if (refCode) {
        validateEmpresaCodigo(refCode).then(res => {
          if (res.valid && res.empresa) {
            setFormalPartner(res.empresa);
          }
        });
      }

      const lastAccepted = localStorage.getItem('nc_last_accepted_at');
      const lastVersion = localStorage.getItem('nc_current_accepted_version');
      if (lastAccepted && lastVersion === DOCUMENT_VERSION) {
        setAccepted(true);
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  const handleAccess = async () => {
    if (!accepted) {
      setConsentWarning(true);
      return;
    }
    if (isSubmitting) return;

    setConsentWarning(false);
    setIsSubmitting(true);
    const nowIso = new Date().toISOString();

    try {
      localStorage.setItem('nc_last_accepted_at', nowIso);
      localStorage.setItem('nc_current_accepted_version', DOCUMENT_VERSION);
    } catch {
      // ignore localStorage errors
    }

    const finalUrl = formalPartner
      ? `${TARGET_URL}?convenio=${encodeURIComponent(formalPartner.codigo_acesso)}`
      : TARGET_URL;

    try {
      await recordTermsAcceptance({
        document_version: DOCUMENT_VERSION,
        accepted_at: nowIso,
        user_agent: navigator.userAgent || 'unknown',
        target_url: finalUrl,
        source: formalPartner ? `parceria_formal_${formalPartner.codigo_acesso}` : 'portal_beneficios_acesso_direto'
      });

      setRedirectSuccess(true);

      setTimeout(() => {
        window.open(finalUrl, '_blank', 'noopener,noreferrer');
        setIsSubmitting(false);
      }, 600);
    } catch (err) {
      console.error('Erro ao registrar aceite:', err);
      setTimeout(() => {
        window.open(finalUrl, '_blank', 'noopener,noreferrer');
        setIsSubmitting(false);
      }, 400);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#C8102E] selection:text-white pt-28 pb-24">
      
      {/* Top Header / Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-slate-200">
          <button
            onClick={onBackToHome}
            className="group flex items-center gap-2.5 text-slate-600 hover:text-[#C8102E] text-xs md:text-sm uppercase tracking-wider font-semibold transition-colors py-2 px-4 rounded-full bg-white hover:bg-red-50/50 border border-slate-200 shadow-xs cursor-pointer"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-[#C8102E]" />
            Voltar para o site principal
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
            <span>NC Turismo</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-[#0F172A]">Fundada em 1989 • 37 Anos de Atuação</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          1. PRIMEIRA TELA: NOVO MOTE, 3 PILARES IMEDIATOS & ISCA DE CUPONS MENSAIS
         ========================================================================= */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mb-14">
        <div className="relative rounded-3xl bg-white border border-slate-200/90 p-8 md:p-12 shadow-xl shadow-slate-200/60 overflow-hidden">
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Coluna Esquerda: Manchete, Subtítulo de Apoio e CTAs Principais */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-[#C8102E]">
                <Sparkles size={15} className="text-[#C8102E]" />
                <span>Soluções Corporativas, Benefícios & Parcerias</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-display font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
                Da primeira reserva à gestão completa. A solução certa para cada empresa.
              </h1>

              <p className="text-base md:text-lg text-slate-600 font-normal leading-relaxed">
                <strong className="text-[#0F172A]">Sua empresa merece mais vantagens para viajar.</strong> A NC Turismo reúne condições comerciais competitivas, tecnologia e atendimento especializado para simplificar suas viagens — com 37 anos de atuação no mercado.
              </p>

              {/* CTA na esquerda focado no acesso livre ao portal (para viajantes individuais ou quem já tem acesso) */}
              <div className="pt-2 space-y-3">
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="#portal-colaborador"
                    className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs md:text-sm uppercase tracking-wider transition-all shadow-md"
                  >
                    <Compass size={16} className="text-[#DB8902]" />
                    <span>Acessar Portal & Buscar Itinerários</span>
                    <ArrowRight size={15} />
                  </a>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                  <strong className="text-[#0F172A]">Aberto para todos:</strong> Você não precisa ser uma empresa ou ter cadastro prévio. Qualquer pessoa buscando itinerários de viagem pode acessar o portal livremente — e quem já é cliente ou conveniado também entra por aqui.
                </p>
              </div>

              {/* Espaço muito discreto reservado para a condição em estudo de 12 meses */}
              <div className="pt-1 flex items-center gap-2 text-xs text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DB8902]" />
                <span>Condição especial: <strong>até 12 meses de benefícios para sua empresa</strong> (consulte elegibilidade).</span>
              </div>
            </div>

            {/* Coluna Direita (Primeira Tela): Grande Destaque Visual dos Cupons Mensais como Isca de Cadastro */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-gradient-to-br from-[#C8102E] via-[#B71C1C] to-[#DB8902] p-7 md:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-amber-200 font-bold">
                      <Ticket size={15} /> Destaque Exclusivo NC Turismo
                    </span>
                    <span className="text-[11px] font-mono bg-white/15 px-2.5 py-1 rounded-md text-white font-semibold">
                      Ativo Mensalmente
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight leading-tight">
                    Cupons Mensais para empresas e Viajantes
                  </h2>

                  <p className="text-xs md:text-sm text-white/90 leading-relaxed">
                    Condições exclusivas liberadas todo mês pela <strong>NC Turismo</strong> para reduzir custos em reservas de hotéis, pacotes e serviços turísticos para sua empresa e equipe.
                  </p>

                  <ul className="space-y-2 pt-1 text-xs text-white/95">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-amber-300 shrink-0" />
                      <span>Lotes mensais exclusivos para empresas cadastradas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-amber-300 shrink-0" />
                      <span>Economia imediata para viagens corporativas ou lazer</span>
                    </li>
                  </ul>

                  <div className="pt-3">
                    <a
                      href="#formulario-parceria"
                      className="w-full py-3.5 px-5 rounded-xl bg-white text-[#C8102E] hover:bg-amber-50 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <span>Conhecer os benefícios da minha empresa</span>
                      <ArrowRight size={15} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* OS 3 PILARES IMEDIATOS NA PRIMEIRA TELA: Economia, Facilidade e Assessoria */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 mt-10 pt-8 border-t border-slate-200">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-200 text-[#C8102E] flex items-center justify-center shrink-0">
                <Ticket size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#0F172A]">
                  Economia (Cupons Mensais)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cupons mensais exclusivos da NC Turismo e tarifas competitivas para otimizar cada viagem.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 text-[#DB8902] flex items-center justify-center shrink-0">
                <Compass size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#0F172A]">
                  Facilidade (Reservas Simplificadas)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Acesso rápido e descomplicado para pesquisar itinerários e concluir reservas sem burocracia.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                <Headphones size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#0F172A]">
                  Assessoria (Suporte 24/7)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Equipe própria disponível 24 horas por dia, 7 dias por semana, com 37 anos de experiência.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. BLOCO COMPACTO COM 3 SOLUÇÕES (PROGRESSÃO DOS SERVIÇOS)
         ========================================================================= */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mb-14">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-lg space-y-7">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C8102E] font-bold">
                <Layers size={15} /> Portfólio NC Turismo
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-extrabold text-[#0F172A] tracking-tight">
                A evolução certa para a necessidade da sua empresa
              </h2>
            </div>

            <span className="text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-lg">
              Até 12 meses de benefícios para sua empresa
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* (1) Benefícios NC Turismo */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="text-xs font-mono font-bold text-[#C8102E] uppercase tracking-wider">
                  1. Benefícios NC Turismo
                </div>
                <h3 className="text-lg font-display font-bold text-[#0F172A]">
                  PDV e Cupons Mensais
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  Acesso direto ao portal de reservas e aos cupons mensais para garantir economia imediata em hospedagens, pacotes e viagens.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/80 text-[11px] font-mono text-slate-500">
                PDV Online · Cupons Mensais · Suporte 24/7
              </div>
            </div>

            {/* (2) Gestão Corporativa */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="text-xs font-mono font-bold text-[#DB8902] uppercase tracking-wider">
                  2. Gestão Corporativa
                </div>
                <h3 className="text-lg font-display font-bold text-[#0F172A]">
                  Organização e Controle
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  Centralização das viagens a trabalho da sua empresa com faturamento organizado, centros de custo e relatórios gerenciais claros.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/80 text-[11px] font-mono text-slate-500">
                Controle Centralizado · Relatórios · Atendimento Dedicado
              </div>
            </div>

            {/* (3) Gestão Integrada */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                  3. Gestão Integrada
                </div>
                <h3 className="text-lg font-display font-bold text-[#0F172A]">
                  T&E, Políticas e ERP
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  Solução completa com controle de despesas (T&E), aplicação de políticas de viagem, fluxos de aprovação e integração com ERP.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/80 text-[11px] font-mono text-slate-500">
                Travel & Expense · Políticas · Integração ERP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. ACESSO AO PORTAL (BASE ATUAL & BUSCA DE ITINERÁRIOS - FASE 1 LIVRE)
         ========================================================================= */}
      <div id="portal-colaborador" className="max-w-6xl mx-auto px-6 md:px-12 mb-14 scroll-mt-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* COLUNA PRINCIPAL: ACESSO LIVRE AO PORTAL PARA VIAJANTES INDIVIDUAIS E CLIENTES */}
          <div className="lg:col-span-7 rounded-3xl bg-white border-2 border-[#C8102E]/20 p-7 md:p-10 shadow-xl shadow-slate-200/60 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#C8102E] font-bold flex items-center gap-1.5">
                  <Compass size={15} /> Portal de Viagens & Busca de Itinerários
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                  Acesso Livre • Sem exigir cadastro ou vínculo
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-display font-bold text-[#0F172A]">
                Busque itinerários de viagem ou utilize seu benefício
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>Não é uma empresa nem possui cadastro? Sem problema.</strong> Qualquer viajante pode entrar livremente no portal <strong>beneficios.ncturismo.com.br</strong> para consultar itinerários, comparar opções e planejar sua viagem — e quem já possui benefício corporativo também acessa por aqui.
              </p>

              {/* Explicação clara para os dois perfis (Pessoa Física sem cadastro vs. Beneficiário/Empresa) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1">
                  <div className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                    <Compass size={14} className="text-[#C8102E]" />
                    <span>Para Viajantes (Sem Cadastro)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Entre direto para pesquisar roteiros, hotéis e passagens sem precisar de código ou vínculo empresarial.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1">
                  <div className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>Já possui acesso / Beneficiário</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Se sua empresa ou entidade já é parceira, acesse o portal normalmente para utilizar suas vantagens.
                  </p>
                </div>
              </div>

              {/* Exibe identificação apenas se for uma parceria real e formalizada validada no banco */}
              {formalPartner && (
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <div>
                    <strong>Parceria Formalizada Identificada:</strong> {formalPartner.nome}
                    {formalPartner.desconto_percentual && formalPartner.desconto_percentual > 0
                      ? ` • Condição comercial de ${formalPartner.desconto_percentual}% habilitada.`
                      : ''}
                  </div>
                </div>
              )}

              {/* Documentação & Termos Ativos */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Consulta de Documentos Legais:
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Termos de Uso & Privacidade Ativos
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setModalDocument('termos')}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white hover:bg-red-50/40 border border-slate-200 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#C8102E]">
                      Consultar Termos de Uso
                    </span>
                    <ArrowRight size={14} className="text-slate-400 group-hover:text-[#C8102E]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalDocument('privacidade')}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white hover:bg-amber-50/40 border border-slate-200 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#DB8902]">
                      Consultar Política de Privacidade
                    </span>
                    <ArrowRight size={14} className="text-slate-400 group-hover:text-[#DB8902]" />
                  </button>
                </div>

                {/* Checkbox de Aceite */}
                <div className="pt-1">
                  <label className={`flex items-start gap-3 cursor-pointer p-3.5 rounded-xl transition-all border select-none ${
                    consentWarning && !accepted
                      ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-300/40'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}>
                    <input
                      type="checkbox"
                      checked={accepted}
                      onChange={(e) => {
                        setAccepted(e.target.checked);
                        if (e.target.checked) setConsentWarning(false);
                      }}
                      className="mt-0.5 w-4 h-4 rounded text-[#C8102E] accent-[#C8102E] focus:ring-[#C8102E] cursor-pointer shrink-0"
                    />
                    <div className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                      Li e estou ciente da{' '}
                      <span 
                        className="text-[#C8102E] font-semibold underline decoration-red-300 hover:decoration-[#C8102E] cursor-pointer" 
                        onClick={(e) => { e.stopPropagation(); setModalDocument('privacidade'); }}
                      >
                        Política de Privacidade
                      </span>{' '}
                      da NC Turismo e aceito os{' '}
                      <span 
                        className="text-[#C8102E] font-semibold underline decoration-red-300 hover:decoration-[#C8102E] cursor-pointer" 
                        onClick={(e) => { e.stopPropagation(); setModalDocument('termos'); }}
                      >
                        Termos de Uso
                      </span>.
                    </div>
                  </label>

                  {consentWarning && !accepted && (
                    <div className="mt-2.5 flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs animate-in fade-in">
                      <AlertCircle size={15} className="shrink-0 text-amber-600" />
                      <span>Por favor, marque a caixa acima confirmando a ciência dos termos para entrar no portal.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleAccess}
                className={`w-full py-4 px-8 rounded-full font-bold text-xs md:text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
                  isSubmitting
                    ? 'bg-slate-200 text-slate-400 cursor-wait border border-slate-300'
                    : 'bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] text-white hover:brightness-105 shadow-red-600/25 cursor-pointer'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Abrindo portal em nova aba...</span>
                  </>
                ) : redirectSuccess ? (
                  <>
                    <CheckCircle2 size={18} className="text-white" />
                    <span>Acesso liberado! Abrindo portal em nova aba...</span>
                  </>
                ) : (
                  <>
                    <span>ACESSAR PORTAL E BUSCAR ITINERÁRIOS (NOVA ABA)</span>
                    <ExternalLink size={17} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 flex-wrap gap-2">
                <span className="flex items-center gap-1.5 font-mono">
                  <Lock size={12} className="text-[#C8102E]" />
                  Ambiente Oficial: <strong className="text-[#0F172A]">beneficios.ncturismo.com.br</strong>
                </span>
                <span className="text-slate-500 font-mono">
                  Livre para Viajantes Individuais e Empresas
                </span>
              </div>
            </div>
          </div>

          {/* COLUNA LATERAL: NOVOS CLIENTES E ROTEIROS DE LAZER */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Caminho 1: Novos Clientes Corporativos */}
            <div className="rounded-3xl bg-white border border-slate-200 p-7 shadow-lg flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-[#DB8902] flex items-center justify-center">
                  <Building2 size={20} />
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-[#DB8902] font-bold">
                  Para Empresas & Gestores
                </div>
                <h4 className="text-xl font-display font-bold text-[#0F172A]">
                  Sua empresa ainda não tem os benefícios da NC?
                </h4>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  Habilite cupons mensais, reservas simplificadas e suporte 24/7 para sua equipe ou estruture a gestão das viagens corporativas da sua organização.
                </p>
              </div>

              <a
                href="#formulario-parceria"
                className="w-full py-3.5 px-5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <span>Conhecer os benefícios da minha empresa</span>
                <ArrowRight size={15} />
              </a>
            </div>

            {/* Caminho 2: Roteiros & Lazer */}
            <div className="rounded-3xl bg-white border border-slate-200 p-7 shadow-lg flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-[#C8102E] flex items-center justify-center">
                  <Compass size={20} />
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-[#C8102E] font-bold">
                  Viagens Pessoais & Férias
                </div>
                <h4 className="text-xl font-display font-bold text-[#0F172A]">
                  Buscando pacotes e roteiros de lazer?
                </h4>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  Além de utilizar o portal ao lado para pesquisar itinerários, você também pode conferir nossa vitrine de pacotes, resorts e cruzeiros selecionados.
                </p>
              </div>

              <a
                href="#lazer"
                className="w-full py-3.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] border border-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <span>Ver Roteiros & Lazer</span>
                <ArrowRight size={15} />
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================================
          4. NC PARTNERS (DISTINÇÃO VISUAL CLARA PARA PARCERIAS INSTITUCIONAIS)
         ========================================================================= */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mb-16">
        <div className="rounded-3xl bg-gradient-to-br from-[#0C0F17] via-[#141824] to-[#0A0D14] p-8 md:p-12 text-white border border-white/10 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#C8102E]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#DB8902]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                  <Handshake size={15} className="text-[#DB8902]" />
                  <span>Programa de Parcerias Institucionais • NC Partners</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-display font-bold text-white tracking-tight">
                  Convênios para Associações, Entidades de Classe e Clubes de Benefícios
                </h2>
                <p className="text-xs md:text-sm text-nc-warm/80 leading-relaxed">
                  Distinto da contratação padrão de gestão de viagens corporativas, o <strong>NC Partners</strong> é uma frente dedicada exclusivamente a <strong>parcerias institucionais</strong> (sindicatos, federações, cooperativas, associações profissionais e programas de benefícios para colaboradores), oferecendo vantagens em viagens pessoais para membros e associados.
                </p>
              </div>
              <div className="shrink-0">
                <a
                  href="#formulario-parceria"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <span>Propor Parceria Institucional</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Pilares do NC Partners */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center">
                  <Tag size={20} />
                </div>
                <h3 className="text-base font-bold text-white">Clube de Vantagens</h3>
                <p className="text-xs text-nc-warm/70 leading-relaxed">
                  Acesso aos cupons mensais e condições diferenciadas sem custo de adesão para a entidade parceira.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <h3 className="text-base font-bold text-white">Atendimento 24/7</h3>
                <p className="text-xs text-nc-warm/70 leading-relaxed">
                  Suporte especializado da equipe NC diretamente ao associado ou colaborador em todas as etapas da viagem.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                  <Briefcase size={20} />
                </div>
                <h3 className="text-base font-bold text-white">Zero Operação Interna</h3>
                <p className="text-xs text-nc-warm/70 leading-relaxed">
                  A NC Turismo conduz o atendimento diretamente com o viajante, sem gerar demanda operacional para a entidade.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Award size={20} />
                </div>
                <h3 className="text-base font-bold text-white">37 Anos de Credibilidade</h3>
                <p className="text-xs text-nc-warm/70 leading-relaxed">
                  Fundada em 1989, a NC Turismo entrega segurança e solidez para valorizar a marca da sua instituição.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-nc-warm/70 border-t border-white/10">
              <span className="font-semibold text-white">Foco exclusivo do NC Partners:</span>
              <div className="flex flex-wrap items-center gap-2 text-nc-warm/80">
                <span>Sindicatos & Federações</span>
                <span aria-hidden="true">·</span>
                <span>Associações de Classe</span>
                <span aria-hidden="true">·</span>
                <span>Cooperativas</span>
                <span aria-hidden="true">·</span>
                <span>Clubes de Benefícios (RH)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. FORMULÁRIO SIMPLIFICADO NO RODAPÉ DA PÁGINA
         ========================================================================= */}
      <div id="formulario-parceria" className="max-w-6xl mx-auto px-6 md:px-12 scroll-mt-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#DB8902]">
              <Users size={15} /> Primeiro Contato Simplificado
            </div>

            <h2 className="text-2xl md:text-4xl font-display font-extrabold text-[#0F172A] tracking-tight leading-tight">
              Conhecer os benefícios da minha empresa
            </h2>

            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Preencha apenas seus dados essenciais de contato. Nossa equipe apresentará as condições comerciais, os <strong>cupons mensais exclusivos</strong> e a solução ideal para o momento da sua empresa ou entidade.
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200">
                <CheckCircle2 size={18} className="text-[#DB8902] shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Sem burocracia no primeiro contato:</strong> Não solicitamos CNPJ ou volume detalhado de viagens nesta etapa inicial.
                </p>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200">
                <CheckCircle2 size={18} className="text-[#DB8902] shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Condição especial:</strong> Consulte a disponibilidade de <strong>até 12 meses de benefícios para sua empresa</strong>.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 space-y-1.5">
              <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Atendimento direto NC Turismo:</p>
              <p className="text-xs text-slate-600 font-mono">
                WhatsApp: (41) 99683-0144 | E-mail: atendimento@ncturismo.com.br
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <LeadForm
              variant="b2b-simple"
              defaultInteresse="beneficios-parcerias"
              sourceContext="pagina_beneficios_parcerias_b2b"
              onOpenLegal={onOpenLegalTab}
              theme="light"
              title="Conhecer os benefícios da minha empresa"
              subtitle="Informe seus dados básicos para falar com nossos especialistas."
              submitLabel="Conhecer os benefícios"
            />
          </div>

        </div>
      </div>

      {/* =========================================================================
          MODAL VIEWER FOR "TERMOS DE USO" AND "POLÍTICA DE PRIVACIDADE"
         ========================================================================= */}
      {modalDocument && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setModalDocument(null)}
        >
          <div 
            className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-800"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 md:px-8 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-[#C8102E] flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">
                    {modalDocument === 'termos' ? 'Termos e Condições de Uso' : 'Política de Privacidade'}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    NC Turismo • 37 Anos de Atuação (2026) • Versão 1.1 Vigente
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalDocument(null)}
                className="p-2 rounded-xl bg-slate-200/60 hover:bg-slate-300 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-sm leading-relaxed text-slate-600">
              {modalDocument === 'termos' ? (
                <>
                  <div className="space-y-2">
                    <h4 className="font-bold text-[#0F172A] text-base">1. Objeto e Âmbito de Aplicação</h4>
                    <p>
                      Estes Termos e Condições de Uso regulam o acesso e a utilização dos websites, plataformas digitais, portais corporativos e canais de atendimento disponibilizados pela NC Turismo. Ao navegar ou contratar serviços através de nossos ambientes digitais ou subdomínios (incluindo <code>beneficios.ncturismo.com.br</code>), o usuário declara expressamente ter lido, compreendido e aceito as condições estipuladas.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-[#0F172A] text-base">2. Natureza da Atividade (Intermediação Turística)</h4>
                    <p>
                      A NC Turismo atua como agência de viagens e turismo especializada na intermediação entre o cliente/viajante e os prestadores finais de serviços turísticos (companhias aéreas, redes hoteleiras, locadoras de veículos, seguradoras, receptivos e operadoras).
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-[#0F172A] text-base">3. Regras Tarifárias, Alterações e Cancelamentos</h4>
                    <p>
                      Cada produto ou bilhete emitido possui regras específicas de reembolso, remarcação e franquia de bagagem determinadas exclusivamente pelas companhias transportadoras ou prestadores.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <h4 className="font-bold text-[#0F172A] text-base">1. Compromisso com a Privacidade</h4>
                    <p>
                      A N C TURISMO LTDA. (CNPJ 81.102.709/0001-08) valoriza a segurança e transparência no tratamento de dados pessoais de seus clientes, colaboradores e parceiros, em estrita observância à Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018).
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-[#0F172A] text-base">2. Compartilhamento Estritamente Necessário</h4>
                    <p>
                      Para viabilizar a emissão de passagens, reservas hoteleiras e contratação de seguros solicitados pelo usuário, determinados dados pessoais são transferidos aos fornecedores operacionais homologados.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-[#0F172A] text-base">3. Direitos do Titular</h4>
                    <p>
                      O titular tem o direito de solicitar a confirmação de tratamento, acesso, correção ou eliminação de seus dados, contatando nosso canal oficial pelo e-mail: <code>atendimento@ncturismo.com.br</code>.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 md:px-8 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                NC Turismo • Todos os direitos reservados
              </span>
              <button
                type="button"
                onClick={() => setModalDocument(null)}
                className="px-6 py-2.5 rounded-xl bg-[#0F172A] text-white hover:bg-slate-800 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
