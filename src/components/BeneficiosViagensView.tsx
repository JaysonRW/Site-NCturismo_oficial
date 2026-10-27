import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
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
import { recordTermsAcceptance } from '../lib/supabase';
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

  // Parâmetro opcional caso o usuário venha por um link de parceiro na URL (?convenio= ou ?codigo=)
  const [partnerRef, setPartnerRef] = useState<string>('');

  const DOCUMENT_VERSION = 'Termos de Uso v1.1 e Política de Privacidade v1.1';
  const TARGET_URL = 'http://beneficios.ncturismo.com.br/b2c/';

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get('convenio') || params.get('codigo') || params.get('parceiro') || '';
      if (refCode) {
        setPartnerRef(refCode.toUpperCase());
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

    const finalUrl = partnerRef
      ? `${TARGET_URL}?convenio=${encodeURIComponent(partnerRef)}`
      : TARGET_URL;

    try {
      await recordTermsAcceptance({
        document_version: DOCUMENT_VERSION,
        accepted_at: nowIso,
        user_agent: navigator.userAgent || 'unknown',
        target_url: finalUrl,
        source: partnerRef ? `portal_beneficios_${partnerRef}` : 'portal_beneficios_acesso_livre'
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
            <span className="font-semibold text-[#0F172A]">37 Anos de Atuação (2026)</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#C8102E] font-semibold">B2B & B2C</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ETAPA 1: HERO SECTION & OS 3 PILARES DE VALOR
         ========================================================================= */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mb-12">
        <div className="relative rounded-3xl bg-white border border-slate-200/90 p-8 md:p-14 shadow-xl shadow-slate-200/60 overflow-hidden">
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-4xl">
            <div className="flex items-center gap-2 text-xs md:text-sm font-mono font-bold tracking-wider uppercase text-[#C8102E]">
              <Sparkles size={15} className="text-[#C8102E]" />
              <span>Benefícios em Viagens, Lazer & Soluções Corporativas</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-display font-extrabold text-[#0F172A] tracking-tight leading-[1.15]">
              Da primeira reserva à gestão completa. A solução certa para cada empresa.
            </h1>

            <h2 className="text-xl md:text-2xl font-display font-bold text-[#C8102E] tracking-tight">
              Sua empresa merece mais vantagens para viajar — e você também.
            </h2>

            <p className="text-base md:text-lg text-slate-600 font-normal leading-relaxed">
              Com <strong>37 anos de atuação no mercado em 2026</strong>, a <strong>NC Turismo</strong> conecta empresas, entidades parceiras, colaboradores e viajantes individuais a um portal completo para buscar itinerários, reservar viagens corporativas ou planejar férias com condições reais e suporte dedicado.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="#porta-de-entrada"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#DB8902] text-white font-bold text-xs uppercase tracking-wider hover:brightness-105 transition-all shadow-md shadow-red-500/20"
              >
                <span>Acessar Portal de Viagens & Benefícios</span>
                <ArrowRight size={15} />
              </a>

              <a
                href="#formulario-parceria"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all border border-slate-200"
              >
                <span>Quero cadastrar minha empresa / entidade</span>
              </a>
            </div>
          </div>

          {/* OS 3 PILARES CENTRAIS: Economia, Facilidade e Assessoria */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-10 border-t border-slate-200">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-200 text-[#C8102E] flex items-center justify-center">
                <Ticket size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">
                1. Economia e Benefícios
              </h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Acesso a <strong>cupons mensais da BRT</strong> e condições comerciais diferenciadas em hotelaria, pacotes e serviços para empresas cadastradas, entidades e viajantes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 text-[#DB8902] flex items-center justify-center">
                <Compass size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">
                2. Facilidade de Reserva
              </h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Acesso simples, direto e transparente ao portal para pesquisar itinerários de viagens corporativas ou de lazer com total autonomia e rapidez.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <Headphones size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">
                3. Assessoria e Suporte 24/7
              </h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Atendimento humano 24 horas por dia, 7 dias por semana, sustentado pelos <strong>37 anos de solidez</strong> da NC Turismo para apoiar cada etapa da sua jornada.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ETAPA 2: PORTA DE ENTRADA (ACESSO LIVRE AO PORTAL B2B & B2C)
         ========================================================================= */}
      <div id="porta-de-entrada" className="max-w-6xl mx-auto px-6 md:px-12 mb-16 scroll-mt-28">
        <div className="mb-8 space-y-2">
          <div className="text-xs font-mono uppercase tracking-[0.16em] text-[#C8102E] font-bold">
            Porta de Entrada • Para Viajantes (B2C) e Empresas (B2B)
          </div>
          <h2 className="text-2xl md:text-4xl font-display font-extrabold text-[#0F172A] tracking-tight">
            Acesse o portal de buscas ou escolha como deseja avançar
          </h2>
          <p className="text-sm md:text-base text-slate-600 max-w-3xl leading-relaxed">
            Nosso ambiente de reservas e benefícios está liberado para você consultar itinerários, pacotes e tarifas — seja para uma viagem corporativa, pelo convênio da sua entidade ou para sua próxima viagem pessoal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* COLUNA PRINCIPAL: ACESSO DIRETO E LIVRE AO PORTAL (SEM TRAVAMENTO DE CÓDIGO) */}
          <div id="portal-colaborador" className="lg:col-span-7 rounded-3xl bg-white border-2 border-[#C8102E]/20 p-7 md:p-10 shadow-xl shadow-slate-200/60 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#C8102E] font-bold flex items-center gap-1.5">
                  <Lock size={14} /> Acesso Direto ao Portal de Benefícios & Itinerários
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                  Acesso Livre • Sem bloqueio de cadastro
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-display font-bold text-[#0F172A]">
                Buscar itinerários e acessar benefícios em viagens
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Consulte disponibilidade, compare opções e faça suas buscas diretamente no portal <strong>beneficios.ncturismo.com.br</strong>. Para prosseguir com transparência e segurança, basta revisar os termos abaixo e confirmar a ciência.
              </p>

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
                      <span>Por favor, marque a caixa acima confirmando a ciência dos termos para abrir o portal.</span>
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
                    <span>ACESSAR BENEFÍCIOS EM VIAGENS (NOVA ABA)</span>
                    <ExternalLink size={17} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 flex-wrap gap-2">
                <span className="flex items-center gap-1.5 font-mono">
                  <Lock size={12} className="text-[#C8102E]" />
                  Ambiente Oficial: <strong className="text-[#0F172A]">beneficios.ncturismo.com.br</strong>
                </span>
                <span className="text-slate-400 font-mono">
                  Aberto para buscas B2B e B2C
                </span>
              </div>
            </div>
          </div>

          {/* COLUNA LATERAL: CAMINHOS DIRECIONADOS ("Quero viajar" & "Quero oferecer benefícios") */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Caminho 1: Quero oferecer benefícios para minha empresa ou entidade */}
            <div className="rounded-3xl bg-white border border-slate-200 p-7 shadow-lg flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-[#DB8902] flex items-center justify-center">
                  <Building2 size={20} />
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-[#DB8902] font-bold">
                  Para Empresas, RH e Entidades (B2B)
                </div>
                <h4 className="text-xl font-display font-bold text-[#0F172A]">
                  Quer oferecer este benefício para sua empresa ou entidade?
                </h4>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  Disponibilize cupons mensais da BRT, condições diferenciadas e suporte 24/7 para seus colaboradores, associados ou cooperados sem custo de adesão.
                </p>
              </div>

              <a
                href="#formulario-parceria"
                className="w-full py-3.5 px-5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <span>Quero oferecer benefícios para minha empresa ou entidade</span>
                <ArrowRight size={15} />
              </a>
            </div>

            {/* Caminho 2: Quero viajar (Roteiros & Lazer) */}
            <div className="rounded-3xl bg-white border border-slate-200 p-7 shadow-lg flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-[#C8102E] flex items-center justify-center">
                  <Compass size={20} />
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-[#C8102E] font-bold">
                  Para Viajantes & Famílias (B2C)
                </div>
                <h4 className="text-xl font-display font-bold text-[#0F172A]">
                  Planejando sua próxima viagem ou férias?
                </h4>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  Além de pesquisar diretamente no portal ao lado, você também pode conferir nossos pacotes selecionados, cruzeiros e roteiros personalizados de lazer.
                </p>
              </div>

              <a
                href="#lazer"
                className="w-full py-3.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] border border-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <span>Quero viajar (Ver Roteiros & Lazer)</span>
                <ArrowRight size={15} />
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================================
          ETAPA 4 (PARTE A): VITRINE DE CUPONS MENSAIS BRT (ISCA DE CONVERSÃO)
         ========================================================================= */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mb-16">
        <div className="rounded-3xl bg-gradient-to-r from-[#C8102E] via-[#B71C1C] to-[#DB8902] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-200 font-bold">
                <Ticket size={16} /> Vitrine de Campanhas & Vantagens Exclusivas
              </div>
              <h2 className="text-2xl md:text-4xl font-display font-extrabold tracking-tight">
                Cupons Mensais para empresas e Viajantes
              </h2>
              <p className="text-sm md:text-base text-white/90 leading-relaxed max-w-2xl">
                Em parceria estratégica com a <strong>BRT</strong>, disponibilizamos lotes mensais de cupons promocionais e condições especiais em hospedagens nacionais e internacionais, pacotes completos e serviços turísticos no portal.
              </p>
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-medium text-white/90">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-amber-300" />
                  Campanhas renovadas mensalmente
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-amber-300" />
                  Aplicação direta nas reservas elegíveis
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-amber-300" />
                  Curadoria com 37 anos de experiência NC
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-200">
                Benefício Recorrente
              </div>
              <div className="text-2xl font-display font-extrabold text-white">
                Cupons Mensais BRT
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                Cadastre sua empresa no final desta página para habilitar o recebimento recorrente das campanhas mensais para sua equipe.
              </p>
              <a
                href="#formulario-parceria"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-white text-[#C8102E] hover:bg-amber-50 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                <span>Habilitar para minha empresa</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ETAPA 4 (PARTE B): PORTFÓLIO UNIFICADO (3 NÍVEIS DE SERVIÇO NA MESMA TELA)
         ========================================================================= */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mb-16">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-lg space-y-8">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C8102E] font-bold">
              <Layers size={15} /> Evolução Contínua • Portfólio Unificado NC Turismo
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-[#0F172A] tracking-tight">
              Três níveis de serviço que acompanham o momento da sua empresa
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              A NC Turismo escala junto com a sua operação: desde a primeira reserva com benefícios imediatos até a governança corporativa integrada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Nível 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-[#C8102E] uppercase tracking-wider">
                  01. Entrada & Vantagens
                </div>
                <h3 className="text-xl font-display font-bold text-[#0F172A]">
                  Benefícios NC Turismo
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  Acesso imediato ao PDV de viagens e aos <strong>cupons mensais BRT</strong>. Ideal para colaboradores, associados e empresas que buscam economia rápida em reservas pontuais e viagens de lazer.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/80 text-[11px] font-mono text-slate-500">
                PDV Online · Cupons Mensais · Suporte 24/7
              </div>
            </div>

            {/* Nível 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-[#DB8902] uppercase tracking-wider">
                  02. Controle & Performance
                </div>
                <h3 className="text-xl font-display font-bold text-[#0F172A]">
                  Gestão Corporativa
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  Estruturação completa das viagens a trabalho da sua empresa, com faturamento centralizado, organização por centros de custo, relatórios gerenciais e atendimento consultivo dedicado.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/80 text-[11px] font-mono text-slate-500">
                Centros de Custo · Faturamento · BI & Relatórios
              </div>
            </div>

            {/* Nível 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                  03. Governança & Escala
                </div>
                <h3 className="text-xl font-display font-bold text-[#0F172A]">
                  Gestão Integrada
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  Operação avançada com integração direta ao seu ERP, aplicação automatizada de políticas de viagem (compliance), fluxos multinível de aprovação e acordos corporativos globais.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/80 text-[11px] font-mono text-slate-500">
                Integração ERP · Políticas & Compliance · SLA Dedicado
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ETAPA 4 (PARTE C): NC PARTNERS (ISOLADO VISUALMENTE PARA PARCERIAS INSTITUCIONAIS)
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
                  <span>Programa Institucional • NC Partners</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-display font-bold text-white tracking-tight">
                  Parcerias estratégicas para Entidades, Associações e RH
                </h2>
                <p className="text-xs md:text-sm text-nc-warm/80 leading-relaxed">
                  Diferente da gestão tradicional de viagens a trabalho, o <strong>NC Partners</strong> é o programa institucional desenhado para que sindicatos, federações, cooperativas (como SINDIFAR, FPCG e entidades de classe) e departamentos de RH agreguem valor direto aos seus associados e colaboradores em viagens pessoais e familiares.
                </p>
              </div>
              <div className="shrink-0">
                <a
                  href="#formulario-parceria"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <span>Tornar-se Entidade Parceira</span>
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
                <h3 className="text-base font-bold text-white">Condições de Clube</h3>
                <p className="text-xs text-nc-warm/70 leading-relaxed">
                  Acesso ao portal e campanhas de cupons mensais sem custo de implantação ou mensalidade para a entidade parceira.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <h3 className="text-base font-bold text-white">Suporte 24/7 Real</h3>
                <p className="text-xs text-nc-warm/70 leading-relaxed">
                  Assistência completa para o associado ou colaborador antes, durante e após a viagem em qualquer destino.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                  <Briefcase size={20} />
                </div>
                <h3 className="text-base font-bold text-white">Zero Sobrecarga</h3>
                <p className="text-xs text-nc-warm/70 leading-relaxed">
                  A NC Turismo assume toda a operação e o atendimento ao viajante, sem gerar trabalho operacional para o seu RH ou secretaria.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Award size={20} />
                </div>
                <h3 className="text-base font-bold text-white">37 Anos de Solidez</h3>
                <p className="text-xs text-nc-warm/70 leading-relaxed">
                  Em 2026, celebramos 37 anos de atuação e credibilidade cuidando das viagens das maiores organizações do país.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-nc-warm/70 border-t border-white/10">
              <span className="font-semibold text-white">Perfis que integram o NC Partners:</span>
              <div className="flex flex-wrap items-center gap-2 text-nc-warm/80">
                <span>Empresas Privadas & RH</span>
                <span aria-hidden="true">·</span>
                <span>Sindicatos & Federações</span>
                <span aria-hidden="true">·</span>
                <span>Associações Profissionais</span>
                <span aria-hidden="true">·</span>
                <span>Cooperativas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ETAPA 3: FORMULÁRIO SIMPLIFICADO DE CADASTRO DE EMPRESAS (ÚLTIMA PARTE DA PÁGINA)
         ========================================================================= */}
      <div id="formulario-parceria" className="max-w-6xl mx-auto px-6 md:px-12 scroll-mt-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#DB8902]">
              <Users size={15} /> Cadastro de Empresas & Entidades (B2B)
            </div>

            <h2 className="text-2xl md:text-4xl font-display font-extrabold text-[#0F172A] tracking-tight leading-tight">
              Leve os benefícios da NC Turismo para a sua organização.
            </h2>

            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Quer oferecer <strong>cupons mensais BRT</strong>, condições especiais em viagens de lazer ou estruturar a gestão de viagens corporativas da sua empresa? Preencha os dados essenciais ao lado para conhecer o programa.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200">
                <CheckCircle2 size={18} className="text-[#DB8902] shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Adesão rápida e descomplicada:</strong> Sem burocracia inicial. Nossa equipe apresentará o formato ideal para o perfil da sua empresa ou entidade.
                </p>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200">
                <CheckCircle2 size={18} className="text-[#DB8902] shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Atendimento consultivo 24/7:</strong> Suporte dedicado tanto para o gestor quanto para cada viajante beneficiado.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
              <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Canal direto de parcerias e atendimento:</p>
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
              title="Quero oferecer este benefício na minha empresa"
              subtitle="Preencha seus dados de contato para receber a apresentação do programa."
              submitLabel="Quero conhecer o programa"
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
