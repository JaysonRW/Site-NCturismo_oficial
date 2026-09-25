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
  AlertCircle
} from 'lucide-react';
import { recordTermsAcceptance } from '../lib/supabase';

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

  const DOCUMENT_VERSION = 'Termos de Uso v1.1 e Política de Privacidade v1.1';
  const TARGET_URL = 'http://beneficios.ncturismo.com.br/b2c/';

  const [consentWarning, setConsentWarning] = useState(false);

  useEffect(() => {
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
    if (!accepted) {
      setConsentWarning(true);
      return;
    }
    if (isSubmitting) return;

    setConsentWarning(false);
    setIsSubmitting(true);
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
        target_url: TARGET_URL,
        source: 'menu_beneficios_e_viagens'
      });

      setAcceptanceRecord({
        timestamp: formattedDate,
        version: DOCUMENT_VERSION,
        id: record.id
      });
      setRedirectSuccess(true);

      // Short delay so the user sees the confirmation and audit receipt
      setTimeout(() => {
        window.location.href = TARGET_URL;
      }, 1000);
    } catch (err) {
      console.error('Erro ao registrar aceite:', err);
      // Even if background logging has an exception, redirect the user
      setTimeout(() => {
        window.location.href = TARGET_URL;
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-nc-space text-nc-warm selection:bg-nc-orange selection:text-white pt-28 pb-20">
      {/* Top Header / Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-white/10">
          <button
            onClick={onBackToHome}
            className="group flex items-center gap-2.5 text-nc-warm/70 hover:text-white text-xs md:text-sm uppercase tracking-wider font-semibold transition-colors py-2 px-3 rounded-full hover:bg-white/5"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-nc-orange" />
            Voltar para o site principal
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-nc-warm/80">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Ambiente Seguro NC Turismo
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="relative rounded-3xl bg-gradient-to-b from-[#131722] via-nc-surface to-[#0c0e14] border border-white/15 p-8 md:p-14 shadow-2xl shadow-black/80 overflow-hidden">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-nc-orange/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Header Badge */}
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-nc-orange/10 border border-nc-orange/30 text-nc-orange text-xs md:text-sm font-mono font-bold tracking-wider uppercase">
              <Sparkles size={14} />
              NC Turismo | Benefícios em Viagens
            </div>

            {/* Main Titles strictly following user specification */}
            <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.15]">
              Bem-vindo ao nosso ambiente de viagens.
            </h1>

            <p className="text-base md:text-xl text-nc-warm/85 font-normal leading-relaxed">
              Aqui você pode pesquisar e contratar serviços para suas viagens de lazer, com a praticidade do atendimento online e o suporte da NC Turismo sempre que precisar.
            </p>

            {/* Quick Benefits Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 pb-2">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-nc-orange/10 text-nc-orange flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Suporte Especializado</h4>
                  <p className="text-[11px] text-nc-warm/70 leading-snug mt-1">38 anos de solidez e consultoria dedicada sempre ao seu lado.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-nc-orange/10 text-nc-orange flex items-center justify-center shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Agilidade Online</h4>
                  <p className="text-[11px] text-nc-warm/70 leading-snug mt-1">Pesquise passagens, hotéis e pacotes com autonomia 24 horas.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-nc-orange/10 text-nc-orange flex items-center justify-center shrink-0">
                  <Lock size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Ambiente Protegido</h4>
                  <p className="text-[11px] text-nc-warm/70 leading-snug mt-1">Conformidade estrita com a LGPD e motor de reservas homologado.</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent my-8" />

            {/* Consent & Document Consultation Box */}
            <div className="rounded-2xl bg-[#0a0c10] border border-white/10 p-6 md:p-8 space-y-6">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.16em] text-nc-orange font-bold mb-2">
                  Documentação Obrigatória
                </p>
                <h3 className="text-lg md:text-xl font-bold text-white">
                  Antes de continuar, consulte:
                </h3>
              </div>

              {/* Consultation Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => setModalDocument('termos')}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-nc-orange/50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-nc-orange/10 text-nc-orange flex items-center justify-center">
                      <FileText size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white group-hover:text-nc-orange transition-colors block">
                        Termos de Uso
                      </span>
                      <span className="text-[11px] text-nc-warm/60">
                        Regras de uso, reservas e responsabilidades
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-nc-warm/40 group-hover:text-nc-orange group-hover:translate-x-1 transition-all" />
                </button>

                <button
                  type="button"
                  onClick={() => setModalDocument('privacidade')}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-nc-orange/50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-nc-orange/10 text-nc-orange flex items-center justify-center">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white group-hover:text-nc-orange transition-colors block">
                        Política de Privacidade
                      </span>
                      <span className="text-[11px] text-nc-warm/60">
                        Tratamento de dados pessoais e LGPD
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-nc-warm/40 group-hover:text-nc-orange group-hover:translate-x-1 transition-all" />
                </button>
              </div>

              {/* Checkbox Acceptance (Exactly as requested by user) */}
              <div className="pt-2">
                <label className={`flex items-start gap-3.5 cursor-pointer p-3.5 rounded-xl transition-all border select-none ${
                  consentWarning && !accepted
                    ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/40'
                    : 'hover:bg-white/5 border-transparent hover:border-white/5'
                }`}>
                  <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      checked={accepted}
                      onChange={(e) => {
                        setAccepted(e.target.checked);
                        if (e.target.checked) setConsentWarning(false);
                      }}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-md border transition-all flex items-center justify-center ${
                      accepted 
                        ? 'bg-nc-orange border-nc-orange shadow-lg shadow-nc-orange/30' 
                        : consentWarning
                        ? 'border-amber-400 bg-amber-500/10 animate-pulse'
                        : 'border-white/30 bg-white/5 hover:border-white/50'
                    }`}>
                      {accepted && <Check size={16} className="text-nc-space stroke-[3]" />}
                    </div>
                  </div>
                  <div className="text-xs md:text-sm text-nc-warm/90 leading-relaxed font-medium">
                    Li e aceito os <span className="text-white underline decoration-white/30 hover:decoration-nc-orange cursor-pointer" onClick={(e) => { e.stopPropagation(); setModalDocument('termos'); }}>Termos de Uso</span> e estou ciente da <span className="text-white underline decoration-white/30 hover:decoration-nc-orange cursor-pointer" onClick={(e) => { e.stopPropagation(); setModalDocument('privacidade'); }}>Política de Privacidade</span>.
                  </div>
                </label>

                {consentWarning && !accepted && (
                  <div className="mt-2 flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs animate-in fade-in">
                    <AlertCircle size={15} className="shrink-0 text-amber-400" />
                    <span>Por favor, marque a caixa acima confirmando o aceite para prosseguir para o portal de benefícios.</span>
                  </div>
                )}
              </div>

              {/* CTA Button and Confirmation Feedback */}
              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleAccess}
                  className={`w-full py-4 md:py-5 px-8 rounded-full font-bold text-xs md:text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
                    accepted && !isSubmitting
                      ? 'bg-nc-orange text-nc-space hover:bg-white hover:shadow-nc-orange/30 cursor-pointer scale-100 hover:scale-[1.01]'
                      : isSubmitting
                      ? 'bg-white/10 text-nc-warm/40 cursor-wait border border-white/5'
                      : 'bg-nc-orange/80 hover:bg-nc-orange text-nc-space cursor-pointer border border-nc-orange/50 hover:shadow-lg hover:shadow-nc-orange/20'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-nc-space border-t-transparent rounded-full animate-spin" />
                      <span>Registrando aceite em conformidade com a LGPD...</span>
                    </>
                  ) : redirectSuccess ? (
                    <>
                      <CheckCircle2 size={18} className="text-nc-space" />
                      <span>Aceite registrado! Redirecionando...</span>
                    </>
                  ) : (
                    <>
                      <span>ACESSAR BENEFÍCIOS EM VIAGENS</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                {/* Subdomain Notice */}
                <div className="flex items-center justify-between text-[11px] text-nc-warm/60 px-2 flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Lock size={12} className="text-nc-orange" />
                    Destino: <strong className="text-white">beneficios.ncturismo.com.br/b2c/</strong>
                  </span>

                  <span className="text-nc-warm/50">
                    Registro de aceite com data/hora e versão auditada
                  </span>
                </div>

                {/* Acceptance Confirmation Badge if logged */}
                {acceptanceRecord && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-3">
                    <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold">Termo de Aceite Registrado com Sucesso:</p>
                      <p className="text-[11px] opacity-90 font-mono">
                        Data/Hora: {acceptanceRecord.timestamp} | {acceptanceRecord.version} | ID: {acceptanceRecord.id}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Support / Contact details footer */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-nc-warm/60 border-t border-white/5">
              <div className="flex items-center gap-4">
                <span>Dúvidas ou atendimento corporativo?</span>
                <a href="tel:4132811167" className="text-nc-orange hover:underline font-mono">
                  (41) 3281-1167
                </a>
              </div>
              <a href="mailto:atendimento@ncturismo.com.br" className="text-nc-warm/80 hover:text-white transition-colors">
                atendimento@ncturismo.com.br
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL VIEWER FOR "TERMOS DE USO" AND "POLÍTICA DE PRIVACIDADE"
         ========================================================================= */}
      {modalDocument && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-3xl max-h-[85vh] bg-[#0f121a] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 md:px-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-nc-orange/10 text-nc-orange flex items-center justify-center">
                  {modalDocument === 'termos' ? <FileText size={20} /> : <ShieldCheck size={20} />}
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white">
                    {modalDocument === 'termos' ? 'Termos de Uso da NC Turismo' : 'Política de Privacidade e Proteção de Dados'}
                  </h3>
                  <p className="text-xs text-nc-warm/60 font-mono">
                    Versão 1.1 — Vigente em conformidade com a LGPD (Lei nº 13.709/2018)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalDocument(null)}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-nc-warm/70 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Fechar modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body with full clauses */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-sm text-nc-warm/80 leading-relaxed custom-scrollbar">
              {modalDocument === 'termos' ? (
                <>
                  <div className="p-4 bg-nc-surface rounded-xl border border-white/5 text-xs text-nc-warm/90">
                    <strong className="text-white block mb-1">Identificação do Prestador:</strong>
                    N C TURISMO LTDA., CNPJ nº 81.102.709/0001-08, com sede na Rua Dr. Faivre, 75, Loja 2, Centro, Curitiba/PR, CEP 80060-140.
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-white font-bold text-base">1. Objeto e Âmbito de Aplicação</h4>
                    <p>
                      Estes Termos e Condições de Uso regulam o acesso e a utilização dos websites, plataformas digitais, portais corporativos e canais de atendimento disponibilizados pela NC Turismo. Ao navegar ou contratar serviços através de nossos ambientes digitais ou subdomínios (incluindo <code>beneficios.ncturismo.com.br</code>), o usuário declara expressamente ter lido, compreendido e aceito as condições estipuladas.
                    </p>

                    <h4 className="text-white font-bold text-base">2. Papel da NC Turismo e Intermediação de Serviços</h4>
                    <p>
                      A NC Turismo atua na condição de agência de viagens e turismo e gestora de viagens corporativas e de lazer, intermediando a contratação de serviços turísticos prestados por terceiros independentes (como companhias aéreas, hotéis, locadoras de veículos, seguradoras e operadores turísticos).
                    </p>

                    <h4 className="text-white font-bold text-base">3. Regras de Tarifas, Emissão, Alterações e Cancelamento</h4>
                    <p>
                      As condições de reserva, emissão, alteração, no-show, cancelamento e reembolso vinculam-se expressamente às regras tarifárias dos prestadores finais dos serviços.
                    </p>

                    <h4 className="text-white font-bold text-base">4. Benefícios Corporativos e Convênios</h4>
                    <p>
                      Condições especiais e tarifas diferenciadas disponibilizadas em canais de benefícios corporativos, parcerias associativas ou cooperativas são destinadas exclusivamente aos membros e colaboradores elegíveis da respectiva organização conveniada, estando sujeitas a validação de vínculo e regras específicas do convênio.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-nc-surface rounded-xl border border-white/5 text-xs text-nc-warm/90">
                    <strong className="text-white block mb-1">Encarregado pelo Tratamento de Dados (DPO):</strong>
                    Canal oficial para dúvidas e solicitações sobre privacidade: <code className="text-nc-orange">atendimento@ncturismo.com.br</code>.
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-white font-bold text-base">1. Finalidade do Tratamento de Dados</h4>
                    <p>
                      A NC Turismo trata dados pessoais (como nome, CPF, data de nascimento, documentos de viagem, dados de contato e dados necessários para pagamento) com a finalidade exclusiva de realizar pesquisas, orçamentos, emissão de bilhetes, reservas de hospedagem, locação de veículos e prestação de suporte antes, durante e após as viagens.
                    </p>

                    <h4 className="text-white font-bold text-base">2. Compartilhamento Seguro com Prestadores</h4>
                    <p>
                      Para viabilizar a execução dos contratos de viagem solicitados pelo titular, dados necessários são compartilhados com as companhias aéreas, redes hoteleiras, consolidadoras e seguradoras envolvidas na jornada, bem como com plataformas homologadas de motor de reservas turísticas (Infotera / InfoTravel).
                    </p>

                    <h4 className="text-white font-bold text-base">3. Direitos do Titular (LGPD)</h4>
                    <p>
                      Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem o direito de solicitar a confirmação de tratamento, acesso aos dados, correção de dados incompletos ou inexatos, anonimização ou eliminação de dados desnecessários, observadas as obrigações fiscais e regulatórias de guarda.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-4">
              <span className="text-xs text-nc-warm/60">
                NC Turismo • Segurança e transparência documental
              </span>

              <button
                onClick={() => {
                  setAccepted(true);
                  setModalDocument(null);
                }}
                className="px-6 py-2.5 bg-nc-orange text-nc-space rounded-full font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors"
              >
                Li e compreendi os termos
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
