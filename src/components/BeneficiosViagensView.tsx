import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink, 
  Check, 
  FileText, 
  Lock, 
  Building2, 
  Sparkles, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  X,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Handshake,
  Users,
  Award,
  Zap,
  TrendingUp,
  Tag,
  Briefcase,
  KeyRound,
  MessageCircle
} from 'lucide-react';
import { 
  recordTermsAcceptance, 
  validateEmpresaCodigo, 
  getEmpresasConveniadas, 
  saveSolicitacaoCodigo, 
  EmpresaConveniada 
} from '../lib/supabase';
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
  const [acceptanceRecord, setAcceptanceRecord] = useState<{
    timestamp: string;
    version: string;
    id: string;
  } | null>(null);

  // Modal preview state for viewing legal documents inline
  const [modalDocument, setModalDocument] = useState<'termos' | 'privacidade' | null>(null);

  // Estados de Validação do Convênio Corporativo
  const [empresaNome, setEmpresaNome] = useState('');
  const [codigoAcesso, setCodigoAcesso] = useState('');
  const [codigoError, setCodigoError] = useState<string | null>(null);
  const [validatedEmpresa, setValidatedEmpresa] = useState<EmpresaConveniada | null>(null);
  const [empresasLista, setEmpresasLista] = useState<EmpresaConveniada[]>([]);

  // Estados do Modal "Esqueci meu Código"
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotForm, setForgotForm] = useState({
    nome: '',
    emailCorporativo: '',
    empresa: '',
    telefone: ''
  });
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const DOCUMENT_VERSION = 'Termos de Uso v1.1 e Política de Privacidade v1.1';
  const TARGET_URL = 'http://beneficios.ncturismo.com.br/b2c/';

  const [consentWarning, setConsentWarning] = useState(false);

  useEffect(() => {
    // Carrega a lista de empresas conveniadas ativas para auxílio visual
    getEmpresasConveniadas().then(data => {
      setEmpresasLista(data.filter(e => e.ativa));
    });

    // Check if user has already accepted in this browser session/storage
    try {
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
    if (!codigoAcesso.trim()) {
      setCodigoError('Por favor, informe o Código Único da sua organização conveniada.');
      return;
    }

    setCodigoError(null);
    setIsSubmitting(true);

    // Validação do código corporativo
    const validation = await validateEmpresaCodigo(codigoAcesso, empresaNome);
    if (!validation.valid || !validation.empresa) {
      setCodigoError(validation.message || 'Código de convênio não encontrado. Solicite o código abaixo.');
      setIsSubmitting(false);
      return;
    }

    setValidatedEmpresa(validation.empresa);

    if (!accepted) {
      setConsentWarning(true);
      setIsSubmitting(false);
      return;
    }
    
    setConsentWarning(false);
    const nowIso = new Date().toISOString();
    const formattedDate = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      dateStyle: 'short',
      timeStyle: 'medium'
    });

    try {
      localStorage.setItem('nc_last_accepted_at', nowIso);
      localStorage.setItem('nc_current_accepted_version', DOCUMENT_VERSION);
    } catch {
      // ignore localStorage errors
    }

    try {
      const record = await recordTermsAcceptance({
        document_version: DOCUMENT_VERSION,
        accepted_at: nowIso,
        user_agent: navigator.userAgent || 'unknown',
        target_url: `${TARGET_URL}?convenio=${encodeURIComponent(validation.empresa.codigo_acesso)}`,
        source: `convenio_${validation.empresa.codigo_acesso}`
      });

      setAcceptanceRecord({
        timestamp: formattedDate,
        version: DOCUMENT_VERSION,
        id: record.id
      });
      setRedirectSuccess(true);

      // Redireciona o usuário para nova aba
      setTimeout(() => {
        window.open(`${TARGET_URL}?convenio=${encodeURIComponent(validation.empresa.codigo_acesso)}`, '_blank', 'noopener,noreferrer');
        setIsSubmitting(false);
      }, 700);
    } catch (err) {
      console.error('Erro ao registrar aceite:', err);
      setTimeout(() => {
        window.open(`${TARGET_URL}?convenio=${encodeURIComponent(validation.empresa.codigo_acesso)}`, '_blank', 'noopener,noreferrer');
        setIsSubmitting(false);
      }, 500);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSubmitting(true);

    try {
      await saveSolicitacaoCodigo({
        nome_colaborador: forgotForm.nome,
        email_corporativo: forgotForm.emailCorporativo,
        telefone: forgotForm.telefone,
        nome_empresa: forgotForm.empresa
      });
    } catch (err) {
      console.warn('Erro ao salvar solicitação:', err);
    }

    setTimeout(() => {
      setForgotSubmitting(false);
      setForgotSubmitted(true);
    }, 400);
  };

  const generateForgotWhatsAppUrl = () => {
    const text = `Olá equipe NC Turismo! Sou colaborador da empresa *${forgotForm.empresa}* e gostaria de receber o código de acesso para o portal de benefícios em viagens.\n\n*Nome:* ${forgotForm.nome}\n*E-mail Corporativo:* ${forgotForm.emailCorporativo}\n*Telefone:* ${forgotForm.telefone}`;
    return `https://wa.me/5541996830144?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#C8102E] selection:text-white pt-28 pb-20">
      
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

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-mono text-slate-700 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            NC Partners & Benefícios em Viagens
          </div>
        </div>
      </div>

      {/* =========================================================================
          SEÇÃO 1: HERO & PROPOSTA DE VALOR
         ========================================================================= */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mb-12">
        <div className="relative rounded-3xl bg-white border border-slate-200/90 p-8 md:p-14 shadow-xl shadow-slate-200/60 overflow-hidden">
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-4xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-red-50 border border-red-200 text-[#C8102E] text-xs md:text-sm font-mono font-bold tracking-wider uppercase">
              <Sparkles size={14} className="text-[#C8102E]" />
              Benefícios Corporativos & Parcerias Institucionais
            </div>

            <h1 className="text-3xl md:text-5xl font-display font-extrabold text-[#0F172A] tracking-tight leading-[1.15]">
              Viagens como benefício estratégico para sua equipe e associados.
            </h1>

            <p className="text-base md:text-xl text-slate-600 font-normal leading-relaxed">
              Conecte sua empresa, associação, cooperativa ou federação ao ecossistema da <strong>NC Turismo</strong>. Oferecemos um clube completo de vantagens com tarifas negociadas, tecnologia de ponta e suporte humanizado para férias e lazer.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="#formulario-parceria"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#DB8902] text-white font-bold text-xs uppercase tracking-wider hover:brightness-105 transition-all shadow-md shadow-red-500/20"
              >
                <span>Quero ser um parceiro NC</span>
                <ArrowRight size={15} />
              </a>

              <a
                href="#portal-colaborador"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all border border-slate-200"
              >
                <span>Já sou beneficiário / Acessar portal</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SEÇÃO 2: PROGRAMA "NC PARTNERS" (CONTEÚDO INTEGRADO)
         ========================================================================= */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mb-14">
        <div className="rounded-3xl bg-gradient-to-br from-[#0C0F17] via-[#141824] to-[#0A0D14] p-8 md:p-12 text-white border border-white/10 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Ambient lights */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#C8102E]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#DB8902]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-300 border border-white/10 text-xs font-mono uppercase tracking-wider">
                  <Handshake size={14} className="text-[#DB8902]" />
                  Programa Exclusivo NC Partners
                </div>
                <h2 className="text-2xl md:text-4xl font-display font-bold text-white tracking-tight">
                  Como funciona o convênio para sua entidade
                </h2>
              </div>
              <p className="text-xs md:text-sm text-nc-warm/70 max-w-md">
                Soluções sob medida para valorização de colaboradores, membros e cooperados com custo zero de implantação para a organização.
              </p>
            </div>

            {/* Pilares do NC Partners */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center">
                  <Tag size={20} />
                </div>
                <h3 className="text-base font-bold text-white">Tarifas Negociadas</h3>
                <p className="text-xs text-nc-warm/70 leading-relaxed">
                  Condições especiais e tarifas reduzidas em passagens aéreas, hotéis, resorts e locação de veículos.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <h3 className="text-base font-bold text-white">Plantão 24/7 Dedicado</h3>
                <p className="text-xs text-nc-warm/70 leading-relaxed">
                  Segurança total para quem viaja com atendimento de emergência ativo em qualquer fuso horário.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                  <Briefcase size={20} />
                </div>
                <h3 className="text-base font-bold text-white">Zero Burocracia</h3>
                <p className="text-xs text-nc-warm/70 leading-relaxed">
                  Implantação rápida e canal exclusivo online sem sobrecarregar a equipe interna do seu RH ou diretoria.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Award size={20} />
                </div>
                <h3 className="text-base font-bold text-white">38 Anos de Solidez</h3>
                <p className="text-xs text-nc-warm/70 leading-relaxed">
                  A garantia de uma das agências mais conceituadas do país cuidando das viagens das pessoas que movem seu negócio.
                </p>
              </div>
            </div>

            {/* Organizações atendidas pelo NC Partners */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs text-nc-warm/70 border-t border-white/10">
              <span className="font-semibold text-white">Modalidades atendidas no NC Partners:</span>
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Empresas Privadas (RH & Benefícios)</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Cooperativas de Crédito & Agro</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Associações de Classe</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Federações & Sindicatos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SEÇÃO 3: FORMULÁRIO MULTI-ÁREA PADRÃO (FOCO EM BENEFÍCIOS & PARCERIAS)
         ========================================================================= */}
      <div id="formulario-parceria" className="max-w-6xl mx-auto px-6 md:px-12 mb-16 scroll-mt-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[#DB8902] text-xs font-mono font-bold uppercase tracking-wider">
              <Users size={14} /> Adesão Institucional
            </div>

            <h2 className="text-2xl md:text-4xl font-display font-extrabold text-[#0F172A] tracking-tight leading-tight">
              Cadastre sua organização no programa de parcerias.
            </h2>

            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Preencha o formulário ao lado. Nossa equipe de parcerias corporativas entrará em contato para apresentar a proposta e ativar os benefícios para seus colaboradores ou associados.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200">
                <CheckCircle2 size={18} className="text-[#DB8902] shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Sem taxa de adesão:</strong> Sua entidade não paga mensalidade para disponibilizar o canal aos associados ou colaboradores.
                </p>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200">
                <CheckCircle2 size={18} className="text-[#DB8902] shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Atendimento consultivo:</strong> Orientação personalizada em roteiros de lazer, pacotes, cruzeiros e viagens internacionais.
                </p>
              </div>
            </div>

            {/* Contato direto */}
            <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
              <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Canal direto de parcerias:</p>
              <p className="text-xs text-slate-600 font-mono">
                Telefone: (41) 3281-1167 | E-mail: atendimento@ncturismo.com.br
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <LeadForm
              defaultInteresse="beneficios-parcerias"
              sourceContext="pagina_beneficios_parcerias"
              onOpenLegal={onOpenLegalTab}
              theme="light"
              title="Formulário de Interesse & Parcerias"
              subtitle="Informe os dados da sua instituição para receber nossa apresentação completa."
            />
          </div>

        </div>
      </div>

      {/* =========================================================================
          SEÇÃO 4: ACESSO AO PORTAL DO COLABORADOR / BENEFICIÁRIO (MOTOR B2C)
         ========================================================================= */}
      <div id="portal-colaborador" className="max-w-4xl mx-auto px-6 md:px-12 scroll-mt-28">
        <div className="relative rounded-3xl bg-white border border-slate-200/90 p-8 md:p-12 shadow-xl shadow-slate-200/60 overflow-hidden">
          
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-[#C8102E] font-bold">
              <Lock size={14} /> Acesso do Viajante Beneficiário
            </div>

            <h3 className="text-2xl md:text-3xl font-display font-bold text-[#0F172A]">
              Já é colaborador ou associado conveniado?
            </h3>

            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Consulte e reserve suas viagens de férias e lazer no ambiente exclusivo <strong>beneficios.ncturismo.com.br</strong> com as tarifas e vantagens do convênio da sua entidade.
            </p>

            {/* Formulário de Identificação do Convênio Corporativo */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 md:p-8 space-y-5">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <KeyRound size={15} className="text-[#C8102E]" />
                    Identificação do Convênio
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotSubmitted(false);
                      setIsForgotModalOpen(true);
                    }}
                    className="text-xs text-[#C8102E] hover:underline font-semibold cursor-pointer"
                  >
                    Esqueceu ou não tem seu código?
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nome da Empresa / Organização */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Nome da Empresa / Entidade <span className="text-[#C8102E]">*</span>
                    </label>
                    <input
                      type="text"
                      list="empresas-conveniadas-list"
                      placeholder="Ex: Sicredi, AMAPAR, FIEP, Renault..."
                      value={empresaNome}
                      onChange={(e) => {
                        setEmpresaNome(e.target.value);
                        setCodigoError(null);
                        // Se o usuário selecionar ou digitar um nome conhecido, preenche o código automaticamente se encontrar
                        const match = empresasLista.find(emp => emp.nome.toLowerCase() === e.target.value.toLowerCase());
                        if (match && !codigoAcesso) {
                          setCodigoAcesso(match.codigo_acesso);
                          setValidatedEmpresa(match);
                        }
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#C8102E] transition-all"
                    />
                    <datalist id="empresas-conveniadas-list">
                      {empresasLista.map(emp => (
                        <option key={emp.id} value={emp.nome} />
                      ))}
                    </datalist>
                  </div>

                  {/* Código Único de Acesso */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Código Único da Empresa <span className="text-[#C8102E]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: NC-AMAPAR-2026"
                      value={codigoAcesso}
                      onChange={(e) => {
                        setCodigoAcesso(e.target.value.toUpperCase());
                        setCodigoError(null);
                        setValidatedEmpresa(null);
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-mono uppercase text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#C8102E] transition-all"
                    />
                  </div>
                </div>

                {/* Feedback de Validação do Convênio */}
                {validatedEmpresa && (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs animate-in fade-in">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <div>
                      <strong>Convênio Validado:</strong> {validatedEmpresa.nome} • Benefício de {validatedEmpresa.desconto_percentual}% de desconto aplicado!
                    </div>
                  </div>
                )}

                {codigoError && (
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs animate-in fade-in">
                    <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p>{codigoError}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotForm(prev => ({ ...prev, empresa: empresaNome }));
                          setForgotSubmitted(false);
                          setIsForgotModalOpen(true);
                        }}
                        className="mt-1 text-xs text-[#C8102E] underline font-bold cursor-pointer"
                      >
                        Clique aqui para solicitar o código de acesso da sua organização
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Documentação & Termos */}
              <div className="pt-2 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Documentação e Termos:</span>
                  <span className="text-[11px] text-slate-500 font-mono">Versão auditada v1.1</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setModalDocument('termos')}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white hover:bg-red-50/30 border border-slate-200 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#C8102E]">Consultar Termos de Uso</span>
                    <ArrowRight size={14} className="text-slate-400 group-hover:text-[#C8102E]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalDocument('privacidade')}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white hover:bg-amber-50/30 border border-slate-200 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#DB8902]">Consultar Política de Privacidade</span>
                    <ArrowRight size={14} className="text-slate-400 group-hover:text-[#DB8902]" />
                  </button>
                </div>

                {/* Checkbox de Aceite Simplificado Conforme Solicitado */}
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
                      <span>Por favor, marque a caixa acima confirmando o aceite para acessar o motor de reservas.</span>
                    </div>
                  )}
                </div>

                {/* Botão de Redirecionamento Direto com Validação */}
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
                      <span>Validando código e registrando conformidade...</span>
                    </>
                  ) : redirectSuccess ? (
                    <>
                      <CheckCircle2 size={18} className="text-white" />
                      <span>Convênio validado! Abrindo portal em nova aba...</span>
                    </>
                  ) : (
                    <>
                      <span>VALIDAR E ACESSAR BENEFÍCIOS (NOVA ABA)</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Lock size={12} className="text-[#C8102E]" />
                    Destino: <strong className="text-[#0F172A]">beneficios.ncturismo.com.br/b2c/</strong>
                  </span>
                  <span className="text-slate-400 font-mono">
                    Autenticação Corporativa SSL 256-bit
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          MODAL: RECUPERAÇÃO DE CÓDIGO ESQUECIDO (CONVÊNIOS)
         ========================================================================= */}
      {isForgotModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsForgotModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 md:p-8 overflow-hidden text-slate-800"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-[#C8102E] flex items-center justify-center">
                  <KeyRound size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">
                    Solicitar Código de Acesso
                  </h3>
                  <p className="text-xs text-slate-500">
                    Convênio corporativo e benefícios em viagens
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="py-6 text-center space-y-5 animate-in fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={30} />
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-bold text-[#0F172A]">Solicitação Registrada!</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Recebemos seus dados e registramos no painel de atendimento da NC Turismo.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <p className="text-xs font-semibold text-slate-700">
                    Prefere receber seu código imediatamente pelo WhatsApp?
                  </p>
                  <a
                    href={generateForgotWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    <MessageCircle size={16} />
                    <span>Falar com o Suporte da NC no WhatsApp</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline"
                >
                  Fechar janela
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="pt-5 space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Preencha os campos abaixo com seus dados corporativos para localizarmos o convênio ativo da sua organização:
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Nome Completo <span className="text-[#C8102E]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome completo"
                    value={forgotForm.nome}
                    onChange={e => setForgotForm({ ...forgotForm, nome: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    E-mail Corporativo ou Pessoal <span className="text-[#C8102E]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ex: seu.nome@empresa.com.br"
                    value={forgotForm.emailCorporativo}
                    onChange={e => setForgotForm({ ...forgotForm, emailCorporativo: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Empresa / Entidade <span className="text-[#C8102E]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nome da organização"
                      value={forgotForm.empresa}
                      onChange={e => setForgotForm({ ...forgotForm, empresa: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:border-[#C8102E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      WhatsApp / Celular <span className="text-[#C8102E]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(41) 99999-9999"
                      value={forgotForm.telefone}
                      onChange={e => setForgotForm({ ...forgotForm, telefone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:border-[#C8102E]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotSubmitting}
                  className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#DB8902] hover:brightness-105 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {forgotSubmitting ? (
                    <span>Registrando solicitação...</span>
                  ) : (
                    <>
                      <span>Enviar Solicitação de Código</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

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
                    NC Turismo • Versão 1.1 Vigente • Atualizado em 2026
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
