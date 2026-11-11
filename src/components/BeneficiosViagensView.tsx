import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink, 
  FileText, 
  Lock, 
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
  Headphones,
  Search,
  Plane,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { recordTermsAcceptance, validateEmpresaCodigo, EmpresaConveniada } from '../lib/supabase';
import { LeadForm } from './LeadForm';
import heroFamiliaImg from '../assets/images/beneficios_hero_familia_aeroporto_1794342066131.jpg';
import bannerRioImg from '../assets/images/beneficios_banner_panoramico_rio_1794342040873.jpg';

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

  // Popup sutil de aceite dos termos ao clicar em "Pesquisar viagens no portal"
  const [isPortalPopupOpen, setIsPortalPopupOpen] = useState(false);

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

  const openPortalPopup = () => {
    setConsentWarning(false);
    setRedirectSuccess(false);
    setIsPortalPopupOpen(true);
  };

  const scrollToPartnershipForm = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const formEl = document.getElementById('formulario-parceria');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
        source: formalPartner ? `parceria_formal_${formalPartner.codigo_acesso}` : 'portal_beneficios_lp_popup'
      });

      setRedirectSuccess(true);

      setTimeout(() => {
        window.open(finalUrl, '_blank', 'noopener,noreferrer');
        setIsSubmitting(false);
        setIsPortalPopupOpen(false);
      }, 500);
    } catch (err) {
      console.error('Erro ao registrar aceite:', err);
      setTimeout(() => {
        window.open(finalUrl, '_blank', 'noopener,noreferrer');
        setIsSubmitting(false);
        setIsPortalPopupOpen(false);
      }, 350);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] selection:bg-[#C8102E] selection:text-white pt-24 pb-24">
      
      {/* =========================================================================
          1. DOBRA PRINCIPAL LANDING PAGE (HERO + COMO FUNCIONA + BANNER RIO)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-4 md:pt-8 pb-16">
        
        {/* Hero Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Coluna Esquerda: Copywriting LP & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs md:text-sm font-bold tracking-widest uppercase text-[#C8102E]">
              <Plane size={16} className="text-[#C8102E] -rotate-12" />
              <span>NC BENEFÍCIOS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-display font-extrabold text-[#0F172A] tracking-tight leading-[1.06]">
              Sua próxima viagem começa aqui.
            </h1>

            <div className="space-y-4 max-w-xl">
              <p className="text-base md:text-lg text-[#1E293B] font-semibold leading-relaxed">
                Pesquise voos, hotéis e pacotes no portal da NC Turismo. O acesso para consulta é aberto a todos.
              </p>

              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                Empresas e entidades parceiras podem disponibilizar cupons mensais ao seu público, conforme as regras de cada campanha.
              </p>
            </div>

            {/* Identificação automática quando o visitante acessa por link de convênio */}
            {formalPartner && (
              <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>
                  Convênio ativo identificado: <strong>{formalPartner.nome}</strong>
                  {formalPartner.desconto_percentual && formalPartner.desconto_percentual > 0
                    ? ` (${formalPartner.desconto_percentual}% habilitado)`
                    : ''}
                </span>
              </div>
            )}

            {/* Botões de Ação Lado a Lado */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={openPortalPopup}
                className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-sm md:text-base transition-all shadow-lg shadow-slate-900/15 cursor-pointer group"
              >
                <span>Pesquisar viagens no portal</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#formulario-parceria"
                onClick={scrollToPartnershipForm}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] border-[1.5px] border-[#0F172A] font-semibold text-xs md:text-sm leading-snug text-center transition-all cursor-pointer"
              >
                <span className="max-w-[200px]">
                  Quero levar esse benefício à minha empresa
                </span>
              </a>
            </div>

            {/* Selo de Confiança / Consulta Aberta */}
            <div className="pt-1 flex items-center gap-2 text-xs md:text-sm text-slate-600">
              <CheckCircle2 size={16} className="text-[#DB8902] shrink-0" />
              <span>Consulta aberta • Sem cadastro para pesquisar</span>
            </div>
          </div>

          {/* Coluna Direita: Imagem em Alta Definição com Badge Flutuante */}
          <div className="lg:col-span-6">
            <div className="relative rounded-[28px] overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-100 aspect-4/3 bg-slate-100">
              <img
                src={heroFamiliaImg}
                alt="Família no aeroporto admirando o Pão de Açúcar antes do embarque"
                className="w-full h-full object-cover object-center"
              />
              {/* Sutil vinheta quente para valorizar o contraste */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />

              {/* Selo Flutuante Superior Direito */}
              <div className="absolute top-4 right-4 sm:top-5 sm:right-5 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/80 flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#C8102E] text-white font-display font-black text-[10px] flex items-center justify-center tracking-tighter">
                  nc
                </span>
                <span className="text-xs font-bold text-[#0F172A] tracking-tight">
                  NC Turismo • desde 1989
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* =========================================================================
            FAIXA "COMO FUNCIONA" (3 PASSOS HORIZONTAIS)
           ========================================================================= */}
        <div className="mt-16 md:mt-20">
          {/* Título com linhas laterais */}
          <div className="flex items-center gap-6 mb-10">
            <div className="h-px bg-slate-200 flex-1" />
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-[#0F172A] tracking-tight text-center">
              Como funciona
            </h2>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          {/* 3 Passos com Setas Sutis */}
          <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center">
            
            {/* Passo 1: Pesquise */}
            <div 
              onClick={openPortalPopup}
              className="md:col-span-3 flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50/80 transition-colors cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#FDF2F2] border border-red-100 text-[#C8102E] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Search size={24} strokeWidth={2} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base md:text-lg font-display font-bold text-[#0F172A] group-hover:text-[#C8102E] transition-colors">
                  Pesquise
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  Encontre voos, hotéis e pacotes para o seu próximo destino.
                </p>
              </div>
            </div>

            {/* Seta 1 */}
            <div className="hidden md:flex md:col-span-1 justify-center text-slate-300">
              <ChevronRight size={24} strokeWidth={1.5} />
            </div>

            {/* Passo 2: Veja se há um cupom para você */}
            <div className="md:col-span-3 flex items-start gap-4 p-4 rounded-2xl">
              <div className="w-14 h-14 rounded-2xl bg-[#FDF2F2] border border-red-100 text-[#C8102E] flex items-center justify-center shrink-0">
                <Ticket size={24} strokeWidth={2} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base md:text-lg font-display font-bold text-[#0F172A] leading-snug">
                  Veja se há um cupom para você
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  Caso a sua empresa ou entidade seja parceira, aproveite o benefício.
                </p>
              </div>
            </div>

            {/* Seta 2 */}
            <div className="hidden md:flex md:col-span-1 justify-center text-slate-300">
              <ChevronRight size={24} strokeWidth={1.5} />
            </div>

            {/* Passo 3: Conte com a equipe NC */}
            <div className="md:col-span-3 flex items-start gap-4 p-4 rounded-2xl">
              <div className="w-14 h-14 rounded-2xl bg-[#FDF2F2] border border-red-100 text-[#C8102E] flex items-center justify-center shrink-0">
                <Headphones size={24} strokeWidth={2} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base md:text-lg font-display font-bold text-[#0F172A]">
                  Conte com a equipe NC
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  Tire dúvidas e tenha apoio especializado para a sua viagem.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
            BANNER PANORÂMICO DE CONVERSÃO CORPORATIVA
           ========================================================================= */}
        <div className="mt-12 md:mt-14">
          <div className="relative rounded-3xl overflow-hidden border border-amber-200/60 bg-[#FAF3E8] shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              
              {/* Imagem Panorâmica à Esquerda com Fade Suave */}
              <div className="relative h-48 sm:h-56 lg:h-full lg:min-h-[168px] lg:col-span-4 overflow-hidden">
                <img
                  src={bannerRioImg}
                  alt="Vista panorâmica do Rio de Janeiro ao pôr do sol"
                  className="w-full h-full object-cover object-left"
                />
                {/* Gradiente horizontal no desktop e vertical no mobile para fundir com o fundo creme */}
                <div className="hidden lg:block absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent via-[#FAF3E8]/80 to-[#FAF3E8]" />
                <div className="lg:hidden absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#FAF3E8] to-transparent" />
              </div>

              {/* Texto e Botão à Direita */}
              <div className="lg:col-span-8 p-6 sm:p-8 lg:py-8 lg:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-1.5 max-w-xl">
                  <h3 className="text-xl sm:text-2xl md:text-[1.7rem] font-display font-extrabold text-[#0F172A] tracking-tight leading-snug">
                    Sua organização pode oferecer mais possibilidades de viagem.
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600">
                    Leve condições exclusivas, cupons mensais e suporte 24/7 para colaboradores ou associados.
                  </p>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto shrink-0">
                  <div className="hidden md:block w-px h-14 bg-slate-300/80" />
                  <a
                    href="#formulario-parceria"
                    onClick={scrollToPartnershipForm}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#E08E00] hover:bg-[#C97E00] text-[#0F172A] font-bold text-xs md:text-sm transition-all shadow-md cursor-pointer group"
                  >
                    <span>Conversar sobre uma parceria</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

      </section>

      {/* =========================================================================
          2. ORGANIZAÇÃO DAS INFORMAÇÕES ATUAIS ABAIXO DA DOBRA
         ========================================================================= */}
      <div className="bg-[#F8FAFC] border-t border-slate-200/80 py-16 md:py-20 space-y-16">
        
        {/* BLOCO DE PORTFÓLIO: 3 SOLUÇÕES + DETALHE DOS CUPONS MENSAIS */}
        <section className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm space-y-10">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C8102E] font-bold">
                  <Layers size={15} /> Ecossistema NC Turismo
                </div>
                <h2 className="text-2xl md:text-4xl font-display font-extrabold text-[#0F172A] tracking-tight">
                  Da consulta livre à gestão corporativa completa
                </h2>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  Conheça como apoiamos viajantes individuais, equipes de RH, empresas e entidades parceiras com 37 anos de solidez no mercado.
                </p>
              </div>

              <button
                type="button"
                onClick={openPortalPopup}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold text-xs uppercase tracking-wider transition-colors self-start md:self-auto cursor-pointer"
              >
                <Compass size={16} className="text-[#C8102E]" />
                <span>Abrir Portal de Viagens</span>
                <ExternalLink size={14} />
              </button>
            </div>

            {/* Os 3 Módulos de Solução */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* (1) Benefícios NC Turismo */}
              <div className="p-6 md:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/90 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#C8102E] uppercase tracking-wider">
                    <span className="w-6 h-6 rounded-full bg-red-100 text-[#C8102E] flex items-center justify-center text-[11px]">01</span>
                    <span>Benefícios NC Turismo</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-display font-bold text-[#0F172A]">
                    Portal Aberto & Cupons Mensais
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                    Acesso livre ao portal para pesquisa de voos, hotéis e pacotes por qualquer pessoa, somado a cupons mensais destinados a empresas e entidades cadastradas.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Portal Online · Cupons Mensais</span>
                  <button
                    type="button"
                    onClick={openPortalPopup}
                    className="text-[#C8102E] font-bold hover:underline cursor-pointer"
                  >
                    Acessar →
                  </button>
                </div>
              </div>

              {/* (2) Gestão Corporativa */}
              <div className="p-6 md:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/90 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#DB8902] uppercase tracking-wider">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-[#DB8902] flex items-center justify-center text-[11px]">02</span>
                    <span>Gestão Corporativa</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-display font-bold text-[#0F172A]">
                    Organização e Controle
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                    Centralização das viagens a trabalho da sua empresa com faturamento organizado, centros de custo e relatórios gerenciais claros.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200/80 text-[11px] font-mono text-slate-500">
                  Controle Centralizado · Relatórios · Suporte 24/7
                </div>
              </div>

              {/* (3) Gestão Integrada */}
              <div className="p-6 md:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/90 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-[11px]">03</span>
                    <span>Gestão Integrada</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-display font-bold text-[#0F172A]">
                    T&E, Políticas e ERP
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                    Solução completa com controle de despesas (T&E), aplicação de políticas de viagem, fluxos de aprovação e integração com ERP.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200/80 text-[11px] font-mono text-slate-500">
                  Travel & Expense · Políticas · Integração ERP
                </div>
              </div>
            </div>

            {/* Resumo Comparativo: Consulta Aberta vs. Empresas Parceiras */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              <div className="lg:col-span-7 rounded-2xl bg-slate-900 text-white p-6 md:p-8 flex flex-col justify-between space-y-5">
                <div className="space-y-2.5">
                  <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                    <Ticket size={15} /> Como funcionam os Cupons Mensais
                  </div>
                  <h3 className="text-xl md:text-2xl font-display font-bold">
                    Vantagens recorrentes para empresas e entidades parceiras
                  </h3>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    Enquanto a pesquisa de voos, hotéis e pacotes no portal é <strong>100% aberta ao público</strong>, as organizações cadastradas recebem campanhas e cupons mensais exclusivos para seus colaboradores ou associados utilizarem em viagens pessoais e de lazer.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href="#formulario-parceria"
                    onClick={scrollToPartnershipForm}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#DB8902] hover:bg-amber-500 text-[#0F172A] font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    <span>Cadastrar minha empresa</span>
                    <ArrowRight size={15} />
                  </a>
                  <button
                    type="button"
                    onClick={openPortalPopup}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <span>Ir para o portal agora</span>
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 p-6 md:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C8102E] font-bold">
                    <Compass size={15} /> Roteiros Personalizados & Lazer
                  </div>
                  <h3 className="text-xl font-display font-bold text-[#0F172A]">
                    Buscando pacotes completos, resorts ou cruzeiros?
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                    Além de pesquisar diretamente no portal de benefícios, você pode explorar nossa vitrine de roteiros nacionais, internacionais e cruzeiros com consultoria completa da nossa equipe.
                  </p>
                </div>

                <a
                  href="/lazer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] border border-slate-300 font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
                >
                  <span>Explorar Vitrine de Lazer</span>
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            3. NC PARTNERS (PARCERIAS INSTITUCIONAIS: SINDICATOS, ASSOCIAÇÕES E ENTIDADES)
           ========================================================================= */}
        <section className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="rounded-3xl bg-gradient-to-br from-[#0C0F17] via-[#141824] to-[#0A0D14] p-8 md:p-12 text-white border border-white/10 shadow-xl relative overflow-hidden">
            
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#C8102E]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#DB8902]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-8">
              <div className="border-b border-white/10 pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    <Handshake size={15} className="text-[#DB8902]" />
                    <span>Programa de Parcerias Institucionais • NC Partners</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-display font-bold text-white tracking-tight">
                    Convênios para Associações, Entidades de Classe e Clubes de Benefícios
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    O <strong>NC Partners</strong> é nossa frente dedicada a parcerias institucionais (sindicatos, federações, cooperativas, conselhos profissionais e clubes de benefícios), disponibilizando cupons mensais e condições diferenciadas para valorizar o vínculo com seus associados.
                  </p>
                </div>

                <a
                  href="#formulario-parceria"
                  onClick={scrollToPartnershipForm}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#0F172A] hover:bg-amber-50 font-bold text-xs uppercase tracking-wider transition-all shrink-0 self-start lg:self-auto"
                >
                  <span>Solicitar convênio institucional</span>
                  <ArrowRight size={15} />
                </a>
              </div>

              {/* Pilares do NC Partners */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center">
                    <Tag size={20} />
                  </div>
                  <h3 className="text-base font-bold text-white">Clube de Vantagens</h3>
                  <p className="text-xs text-slate-300/80 leading-relaxed">
                    Acesso aos cupons mensais e campanhas sazonais para entidades parceiras cadastradas, conforme elegibilidade.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                  <h3 className="text-base font-bold text-white">Atendimento 24/7</h3>
                  <p className="text-xs text-slate-300/80 leading-relaxed">
                    Suporte especializado da equipe NC diretamente ao associado ou colaborador em todas as etapas da viagem.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                    <Briefcase size={20} />
                  </div>
                  <h3 className="text-base font-bold text-white">Fluxo Operacional Simples</h3>
                  <p className="text-xs text-slate-300/80 leading-relaxed">
                    A NC Turismo conduz o atendimento diretamente com o viajante, sem gerar sobrecarga administrativa para a entidade.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <Award size={20} />
                  </div>
                  <h3 className="text-base font-bold text-white">Desde 1989 no Mercado</h3>
                  <p className="text-xs text-slate-300/80 leading-relaxed">
                    Mais de três décadas de credibilidade, atendimento humanizado e segurança para fortalecer sua instituição.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 border-t border-white/10">
                <span className="font-semibold text-white">Organizações elegíveis ao NC Partners:</span>
                <div className="flex flex-wrap items-center gap-2 text-slate-300">
                  <span>Sindicatos & Federações</span>
                  <span aria-hidden="true">·</span>
                  <span>Associações de Classe</span>
                  <span aria-hidden="true">·</span>
                  <span>Cooperativas</span>
                  <span aria-hidden="true">·</span>
                  <span>Clubes de Benefícios & RH</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. FORMULÁRIO EXCLUSIVO PARA NOVOS INTERESSADOS EMPRESARIAIS (B2B)
           ========================================================================= */}
        <section id="formulario-parceria" className="max-w-7xl mx-auto px-6 md:px-12 scroll-mt-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#DB8902]">
                <Users size={15} /> Parcerias para Empresas & Entidades
              </div>

              <h2 className="text-2xl md:text-4xl font-display font-extrabold text-[#0F172A] tracking-tight leading-tight">
                Leve o benefício da NC Turismo para a sua organização
              </h2>

              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                Este formulário é exclusivo para <strong>empresas, gestores de RH, associações e entidades</strong> que desejam habilitar cupons mensais e condições diferenciadas para seu público.
              </p>

              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <CheckCircle2 size={18} className="text-[#DB8902] shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Atendimento consultivo direto:</strong> Apresentamos o modelo de parceria e as regras de elegibilidade dos cupons mensais sem burocracia.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <Compass size={18} className="text-[#C8102E] shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-600 leading-relaxed">
                    <strong>Quer apenas pesquisar sua viagem agora?</strong> Não é necessário preencher este formulário.{' '}
                    <button
                      type="button"
                      onClick={openPortalPopup}
                      className="text-[#C8102E] font-bold underline hover:text-red-800 cursor-pointer"
                    >
                      Clique aqui para abrir o portal de viagens
                    </button>.
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 space-y-1.5">
                <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Canais diretos NC Turismo:</p>
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
                title="Conversar sobre uma parceria"
                subtitle="Preencha os dados da sua empresa ou entidade para receber o contato da nossa equipe."
                submitLabel="Solicitar contato sobre parceria"
              />
            </div>

          </div>
        </section>

      </div>

      {/* Rodapé sutil de retorno */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-500">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-[#C8102E] font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft size={15} />
          <span>Voltar para a página inicial</span>
        </button>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setModalDocument('termos')}
            className="hover:text-[#0F172A] underline cursor-pointer"
          >
            Termos de Uso
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setModalDocument('privacidade')}
            className="hover:text-[#0F172A] underline cursor-pointer"
          >
            Política de Privacidade
          </button>
        </div>
      </div>

      {/* =========================================================================
          POPUP SUTIL DE ACEITE DOS TERMOS PARA ACESSAR O PORTAL (B2C)
         ========================================================================= */}
      {isPortalPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => !isSubmitting && setIsPortalPopupOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden text-[#0F172A] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Topo do Popup */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#FDF2F2] border border-red-100 text-[#C8102E] flex items-center justify-center shrink-0">
                  <Plane size={20} className="-rotate-12" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#C8102E]">
                      Portal NC Benefícios
                    </span>
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Consulta aberta
                    </span>
                  </div>
                  <h3 className="text-lg font-display font-extrabold text-[#0F172A]">
                    Acessar portal de viagens
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPortalPopupOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            {/* Corpo do Popup */}
            <div className="p-6 space-y-4">
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Você será direcionado ao portal oficial <strong className="text-[#0F172A]">beneficios.ncturismo.com.br</strong> para pesquisar voos, hotéis e pacotes livremente.
              </p>

              {formalPartner && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>
                    Acesso vinculado ao convênio: <strong>{formalPartner.nome}</strong>
                  </span>
                </div>
              )}

              {/* Caixa Sutil de Ciência dos Termos */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200/90 p-4 space-y-3">
                <label
                  className={`flex items-start gap-3 cursor-pointer select-none ${
                    consentWarning && !accepted ? 'text-amber-900' : 'text-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => {
                      setAccepted(e.target.checked);
                      if (e.target.checked) setConsentWarning(false);
                    }}
                    className="mt-0.5 w-4 h-4 rounded text-[#C8102E] accent-[#C8102E] focus:ring-[#C8102E] cursor-pointer shrink-0"
                  />
                  <span className="text-xs leading-relaxed">
                    Estou ciente e concordo com os{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setModalDocument('termos');
                      }}
                      className="text-[#C8102E] font-semibold underline hover:text-red-800 cursor-pointer"
                    >
                      Termos de Uso
                    </button>{' '}
                    e com a{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setModalDocument('privacidade');
                      }}
                      className="text-[#C8102E] font-semibold underline hover:text-red-800 cursor-pointer"
                    >
                      Política de Privacidade
                    </button>{' '}
                    da NC Turismo para utilizar o portal.
                  </span>
                </label>

                {consentWarning && !accepted && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] animate-in fade-in">
                    <AlertCircle size={14} className="shrink-0 text-amber-600" />
                    <span>Marque a opção acima para confirmar ciência dos termos e abrir o portal.</span>
                  </div>
                )}
              </div>

              {/* Botão Principal de Ida ao Portal */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleAccess}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                  isSubmitting
                    ? 'bg-slate-200 text-slate-500 cursor-wait'
                    : 'bg-[#0F172A] hover:bg-slate-800 text-white cursor-pointer'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Abrindo portal de viagens...</span>
                  </>
                ) : redirectSuccess ? (
                  <>
                    <CheckCircle2 size={17} className="text-emerald-400" />
                    <span>Acesso confirmado! Abrindo...</span>
                  </>
                ) : (
                  <>
                    <span>Continuar para o portal de viagens</span>
                    <ExternalLink size={16} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  Ambiente seguro NC Turismo
                </span>
                <span>Sem necessidade de cadastro prévio</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL DE LEITURA INTEGRAL: "TERMOS DE USO" E "POLÍTICA DE PRIVACIDADE"
         ========================================================================= */}
      {modalDocument && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200"
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
                    NC Turismo • Desde 1989 • Versão 1.1 Vigente
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
                onClick={() => {
                  setAccepted(true);
                  setConsentWarning(false);
                  setModalDocument(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#0F172A] text-white hover:bg-slate-800 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Ciente e Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
