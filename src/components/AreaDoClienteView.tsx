import React, { useState } from 'react';
import { 
  Building2, 
  Lock, 
  ShieldCheck, 
  KeyRound, 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink, 
  Download, 
  FileText, 
  Search, 
  Headphones, 
  Phone, 
  Mail, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  RefreshCw, 
  Send, 
  Plane, 
  Hotel, 
  Car, 
  Receipt, 
  CreditCard,
  UserCheck,
  AlertCircle
} from 'lucide-react';

interface AreaDoClienteViewProps {
  onBackToHome: () => void;
  onOpenLegalTab?: (tab: 'privacidade' | 'beneficios' | 'termos') => void;
  onOpenBeneficios?: () => void;
}

type TabType = 'sistemas' | 'faturas' | 'itinerario' | 'suporte' | 'primeiro-acesso';

export const AreaDoClienteView: React.FC<AreaDoClienteViewProps> = ({
  onBackToHome,
  onOpenLegalTab,
  onOpenBeneficios
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('sistemas');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // States for Faturas search
  const [cnpjInput, setCnpjInput] = useState('81.102.709/0001-08');
  const [hasSearchedFaturas, setHasSearchedFaturas] = useState(true);
  const [isSearchingFaturas, setIsSearchingFaturas] = useState(false);

  // States for Itinerary search
  const [locatorInput, setLocatorInput] = useState('NC849K');
  const [lastNameInput, setLastNameInput] = useState('Silva');
  const [hasSearchedItinerary, setHasSearchedItinerary] = useState(true);
  const [isSearchingItinerary, setIsSearchingItinerary] = useState(false);

  // States for New User Request form
  const [requestForm, setRequestForm] = useState({
    nome: '',
    email: '',
    empresa: '',
    departamento: '',
    gestor: '',
    tipoAcesso: 'viajante'
  });
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Modal for OBT Quick Access
  const [obtModal, setObtModal] = useState<{
    systemName: string;
    description: string;
    isOpen: boolean;
  }>({
    systemName: '',
    description: '',
    isOpen: false
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSearchFaturas = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchingFaturas(true);
    setTimeout(() => {
      setIsSearchingFaturas(false);
      setHasSearchedFaturas(true);
      showToast('Faturas atualizadas para o documento informado.');
    }, 600);
  };

  const handleSearchItinerary = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchingItinerary(true);
    setTimeout(() => {
      setIsSearchingItinerary(false);
      setHasSearchedItinerary(true);
      showToast('Itinerário localizado com sucesso.');
    }, 600);
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
    showToast('Solicitação de credencial enviada para a equipe de Implantação NC.');
  };

  // Mock Invoices
  const mockInvoices = [
    {
      id: 'FAT-2026-0891',
      emissao: '15/09/2026',
      vencimento: '30/09/2026',
      competencia: '1ª Quinzena Set/2026',
      valor: 'R$ 28.450,80',
      status: 'Aberto',
      nf: 'NF-e 004.912',
      itens: '18 bilhetes aéreos, 12 diárias hotel'
    },
    {
      id: 'FAT-2026-0814',
      emissao: '31/08/2026',
      vencimento: '15/09/2026',
      competencia: '2ª Quinzena Ago/2026',
      valor: 'R$ 34.120,45',
      status: 'Liquidado',
      nf: 'NF-e 004.830',
      itens: '24 bilhetes aéreos, 16 diárias hotel, 4 locações'
    },
    {
      id: 'FAT-2026-0740',
      emissao: '15/08/2026',
      vencimento: '30/08/2026',
      competencia: '1ª Quinzena Ago/2026',
      valor: 'R$ 19.890,00',
      status: 'Liquidado',
      nf: 'NF-e 004.755',
      itens: '14 bilhetes aéreos, 8 diárias hotel'
    }
  ];

  return (
    <div className="min-h-screen bg-[#080a0f] text-nc-warm pt-28 pb-20 selection:bg-nc-orange selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-3.5 bg-nc-surface/95 border border-nc-orange/40 text-white rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 size={18} className="text-nc-orange shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-nc-warm/70 hover:text-nc-orange transition-colors"
          >
            <ArrowLeft size={16} /> Voltar ao site principal
          </button>

          <div className="flex items-center gap-2 text-xs text-nc-warm/50 font-mono">
            <span>NC Turismo</span>
            <span aria-hidden="true">/</span>
            <span className="text-nc-orange font-bold">Área do Cliente</span>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-nc-surface via-[#0e131d] to-nc-surface border border-white/10 p-8 md:p-12 mb-10 overflow-hidden shadow-2xl">
          {/* Subtle Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-nc-orange/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono uppercase tracking-[0.16em] text-nc-orange font-bold">
                Portal do Cliente & Viajante
              </span>
              <span className="text-xs text-nc-warm/40 font-mono hidden sm:inline">|</span>
              <span className="text-xs text-nc-warm/50 font-mono hidden sm:inline">Conexão Segura TLS 256-bit</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-tight mb-4">
              Área do Cliente <span className="text-nc-orange">NC Turismo</span>
            </h1>

            <p className="text-base md:text-lg text-nc-warm/80 leading-relaxed mb-6">
              Acesso unificado aos motores corporativos de reserva (OBTs), emissão de 2ª via de faturas, consulta de vouchers e atendimento prioritário para sua empresa.
            </p>

            {/* Quick Status Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
              <div>
                <span className="block text-nc-warm/50 font-mono">SISTEMAS OBT</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 100% Operacional
                </span>
              </div>
              <div>
                <span className="block text-nc-warm/50 font-mono">FATURAMENTO</span>
                <span className="font-bold text-white mt-0.5 block">Conciliação 24/7</span>
              </div>
              <div>
                <span className="block text-nc-warm/50 font-mono">PLANTÃO 24H</span>
                <span className="font-bold text-nc-orange mt-0.5 block">(41) 3323-2000</span>
              </div>
              <div>
                <span className="block text-nc-warm/50 font-mono">SEGURANÇA</span>
                <span className="font-bold text-white mt-0.5 block">LGPD & Compliance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 p-1.5 bg-[#0f131c] border border-white/10 rounded-2xl mb-8 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('sistemas')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'sistemas'
                ? 'bg-nc-orange text-nc-space shadow-md font-bold'
                : 'text-nc-warm/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <KeyRound size={16} /> Sistemas & OBTs
          </button>

          <button
            onClick={() => setActiveTab('faturas')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'faturas'
                ? 'bg-nc-orange text-nc-space shadow-md font-bold'
                : 'text-nc-warm/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Receipt size={16} /> 2ª Via de Faturas & Extratos
          </button>

          <button
            onClick={() => setActiveTab('itinerario')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'itinerario'
                ? 'bg-nc-orange text-nc-space shadow-md font-bold'
                : 'text-nc-warm/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Plane size={16} /> Consulta de Itinerário
          </button>

          <button
            onClick={() => setActiveTab('suporte')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'suporte'
                ? 'bg-nc-orange text-nc-space shadow-md font-bold'
                : 'text-nc-warm/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Headphones size={16} /> Plantão 24h & Suporte
          </button>

          <button
            onClick={() => setActiveTab('primeiro-acesso')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'primeiro-acesso'
                ? 'bg-nc-orange text-nc-space shadow-md font-bold'
                : 'text-nc-warm/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserCheck size={16} /> Solicitar Acesso
          </button>
        </div>

        {/* =========================================================================
            TAB 1: SISTEMAS & OBTS
           ========================================================================= */}
        {activeTab === 'sistemas' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                Acesse o Motor de Viagens da sua Empresa
              </h2>
              <p className="text-sm text-nc-warm/70">
                Selecione a plataforma corporativa contratada pela sua organização para emitir passagens aéreas, reservar hotéis ou aprovar viagens de sua equipe.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* OBT 1: NC Travel Hub / Reserve / Argo */}
              <div className="bg-nc-surface border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-nc-orange/50 transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-nc-orange/10 border border-nc-orange/20 flex items-center justify-center text-nc-orange">
                      <Plane size={24} />
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-nc-orange transition-colors mb-2">
                    NC Corporate OBT (Reserve / Argo)
                  </h3>
                  <p className="text-xs text-nc-warm/70 leading-relaxed mb-6">
                    Ambiente corporativo padrão para pesquisa, cotação, reserva e fluxo de aprovação com aplicação rigorosa das políticas da sua empresa.
                  </p>

                  <div className="space-y-2 text-xs text-nc-warm/60 mb-6 font-mono">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Emissão:</span>
                      <span className="text-white">Voos, Hotéis, Carros</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Aprovação:</span>
                      <span className="text-white">Fluxos Multinível</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tarifas:</span>
                      <span className="text-white">Acordos Corporativos</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setObtModal({
                    systemName: 'NC Corporate OBT (Reserve / Argo)',
                    description: 'Acesse o ambiente de emissão com seu login corporativo padrão.',
                    isOpen: true
                  })}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-nc-orange text-nc-space font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-md"
                >
                  <Lock size={14} /> Acessar Sistema <ArrowRight size={14} />
                </button>
              </div>

              {/* OBT 2: NC Analytics & BI */}
              <div className="bg-nc-surface border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-nc-orange/50 transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Building2 size={24} />
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                      Gestores & CFO
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-nc-orange transition-colors mb-2">
                    NC BI & Relatórios Gerenciais
                  </h3>
                  <p className="text-xs text-nc-warm/70 leading-relaxed mb-6">
                    Painel executivo com indicadores de saving, compliance de antecedência de compra, despesas por centro de custo e pegada de carbono (ESG).
                  </p>

                  <div className="space-y-2 text-xs text-nc-warm/60 mb-6 font-mono">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Atualização:</span>
                      <span className="text-white">Tempo Real</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Exportação:</span>
                      <span className="text-white">Excel, PDF e PowerBI</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Controle:</span>
                      <span className="text-white">Saving Realizado</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setObtModal({
                    systemName: 'Portal NC BI Executivo',
                    description: 'Painel restrito a gestores cadastrados e diretores financeiros.',
                    isOpen: true
                  })}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white hover:text-nc-space text-white font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <Lock size={14} /> Acessar Painel BI <ArrowRight size={14} />
                </button>
              </div>

              {/* OBT 3: Benefícios em Viagens */}
              <div className="bg-nc-surface border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-nc-orange/50 transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-nc-orange/10 border border-nc-orange/20 flex items-center justify-center text-nc-orange">
                      <CreditCard size={24} />
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-nc-orange bg-nc-orange/10 px-2.5 py-1 rounded-md border border-nc-orange/20">
                      Colaboradores
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-nc-orange transition-colors mb-2">
                    NC Benefícios em Viagens (Lazer)
                  </h3>
                  <p className="text-xs text-nc-warm/70 leading-relaxed mb-6">
                    Portal exclusivo de descontos e vantagens para colaboradores de empresas clientes viajarem a lazer com tarifas negociadas pela NC Turismo.
                  </p>

                  <div className="space-y-2 text-xs text-nc-warm/60 mb-6 font-mono">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Ambiente:</span>
                      <span className="text-nc-orange">beneficios.ncturismo.com.br/b2c/</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Tarifas:</span>
                      <span className="text-white">Negociadas com operadoras</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Suporte:</span>
                      <span className="text-white">Consultoria Dedicada</span>
                    </div>
                  </div>
                </div>

                <a
                  href="#beneficios"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenBeneficios) {
                      onOpenBeneficios();
                    } else {
                      window.location.hash = '#beneficios';
                    }
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-nc-orange/20 hover:bg-nc-orange hover:text-nc-space text-nc-orange font-bold text-xs uppercase tracking-wider transition-all border border-nc-orange/30"
                >
                  Acessar Ambiente de Benefícios <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Support Callout */}
            <div className="p-6 rounded-2xl bg-[#0f131d] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-nc-orange shrink-0">
                  <Headphones size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Não encontrou o link do sistema da sua empresa?</h4>
                  <p className="text-xs text-nc-warm/60">
                    Sua organização pode possuir uma URL dedicada (ex: Lemontech, Concur, Argo Dedicado ou WTS). Fale diretamente com seu Gestor de Contas NC.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('suporte')}
                className="shrink-0 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white hover:text-nc-space text-xs font-bold uppercase tracking-wider transition-all"
              >
                Falar com a Central
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: 2ª VIA DE FATURAS & EXTRATOS
           ========================================================================= */}
        {activeTab === 'faturas' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                Consulta e 2ª Via de Faturamento Corporativo
              </h2>
              <p className="text-sm text-nc-warm/70">
                Acesse faturas quinzenais, notas fiscais eletrônicas (NF-e) e relatórios analíticos de despesas para a conciliação do departamento financeiro.
              </p>
            </div>

            {/* Filter / Search Form */}
            <div className="bg-nc-surface border border-white/10 rounded-2xl p-6 md:p-8">
              <form onSubmit={handleSearchFaturas} className="flex flex-col md:flex-row items-end gap-4">
                <div className="flex-1 w-full">
                  <label htmlFor="cnpj" className="block text-xs font-mono uppercase tracking-wider text-nc-warm/70 mb-2">
                    CNPJ da Empresa ou Código da Fatura
                  </label>
                  <div className="relative">
                    <input
                      id="cnpj"
                      type="text"
                      value={cnpjInput}
                      onChange={(e) => setCnpjInput(e.target.value)}
                      placeholder="00.000.000/0001-00 ou FAT-2026-XXXX"
                      required
                      className="w-full bg-[#0a0d14] border border-white/15 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-nc-orange font-mono"
                    />
                    <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-nc-warm/40" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSearchingFaturas}
                  className="w-full md:w-auto px-8 py-3.5 bg-nc-orange text-nc-space font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {isSearchingFaturas ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Buscando...
                    </>
                  ) : (
                    <>
                      <Search size={16} /> Consultar Faturas
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Invoices Result Table */}
            {hasSearchedFaturas && (
              <div className="bg-nc-surface border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Extrato de Faturamentos Recentes
                    </h3>
                    <p className="text-xs text-nc-warm/60">
                      Documento: <span className="font-mono text-white">{cnpjInput}</span> · NC Turismo Ltda.
                    </p>
                  </div>
                  <button
                    onClick={() => showToast('Relatório de conciliação analítico gerado com sucesso.')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white hover:text-nc-space rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    <Download size={14} /> Baixar Relatório Consolidado (XLS)
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0b0e14] text-nc-warm/60 font-mono uppercase tracking-wider border-b border-white/10">
                      <tr>
                        <th className="py-4 px-6">Fatura / NF</th>
                        <th className="py-4 px-6">Competência</th>
                        <th className="py-4 px-6">Emissão / Vencimento</th>
                        <th className="py-4 px-6">Valor Total</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {mockInvoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-6">
                            <span className="font-mono font-bold text-white block">{inv.id}</span>
                            <span className="text-[11px] text-nc-warm/50 font-mono">{inv.nf}</span>
                          </td>
                          <td className="py-4 px-6 text-nc-warm/80">
                            <span className="font-medium block">{inv.competencia}</span>
                            <span className="text-[11px] text-nc-warm/50">{inv.itens}</span>
                          </td>
                          <td className="py-4 px-6 font-mono">
                            <span className="text-nc-warm/70 block">Em: {inv.emissao}</span>
                            <span className="text-white font-bold block">Venc: {inv.vencimento}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-mono font-bold text-base text-nc-orange">
                              {inv.valor}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            {inv.status === 'Liquidado' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 size={12} /> Liquidado
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                <Clock size={12} /> Em Aberto
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <button
                              onClick={() => showToast(`2ª via do boleto para ${inv.id} baixada.`)}
                              className="px-3 py-1.5 rounded-lg bg-nc-orange/20 hover:bg-nc-orange hover:text-nc-space text-nc-orange font-bold text-[11px] uppercase tracking-wider transition-all inline-flex items-center gap-1"
                              title="Baixar 2ª via do Boleto Bancário"
                            >
                              <Download size={12} /> Boleto
                            </button>
                            <button
                              onClick={() => showToast(`XML e PDF da ${inv.nf} baixados.`)}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/20 text-nc-warm/80 font-bold text-[11px] uppercase tracking-wider transition-all inline-flex items-center gap-1"
                              title="Baixar Nota Fiscal Eletrônica"
                            >
                              <FileText size={12} /> NF-e
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-6 bg-[#0a0d14] border-t border-white/5 text-xs text-nc-warm/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-nc-orange shrink-0" />
                    <span>Dados protegidos por criptografia e faturados diretamente em nome da empresa cadastrada.</span>
                  </div>
                  <div className="font-mono text-nc-warm/50">
                    Dúvidas financeiras: <span className="text-white">financeiro@ncturismo.com.br</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: CONSULTA DE ITINERÁRIO & VOUCHERS
           ========================================================================= */}
        {activeTab === 'itinerario' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                Consulta Rápida de Itinerário e Vouchers
              </h2>
              <p className="text-sm text-nc-warm/70">
                Viajante ou solicitante: consulte os detalhes completos do seu voo, hotel e traslado utilizando o código localizador da NC Turismo.
              </p>
            </div>

            {/* Search Locator Box */}
            <div className="bg-nc-surface border border-white/10 rounded-2xl p-6 md:p-8">
              <form onSubmit={handleSearchItinerary} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label htmlFor="locator" className="block text-xs font-mono uppercase tracking-wider text-nc-warm/70 mb-2">
                    Código Localizador (6 caracteres)
                  </label>
                  <input
                    id="locator"
                    type="text"
                    value={locatorInput}
                    onChange={(e) => setLocatorInput(e.target.value.toUpperCase())}
                    placeholder="Ex: NC849K"
                    maxLength={10}
                    required
                    className="w-full bg-[#0a0d14] border border-white/15 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-nc-orange font-mono uppercase"
                  />
                </div>

                <div>
                  <label htmlFor="lastname" className="block text-xs font-mono uppercase tracking-wider text-nc-warm/70 mb-2">
                    Sobrenome do Passageiro
                  </label>
                  <input
                    id="lastname"
                    type="text"
                    value={lastNameInput}
                    onChange={(e) => setLastNameInput(e.target.value)}
                    placeholder="Ex: Silva"
                    required
                    className="w-full bg-[#0a0d14] border border-white/15 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-nc-orange"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSearchingItinerary}
                    className="w-full py-3.5 bg-nc-orange text-nc-space font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSearchingItinerary ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" /> Localizando...
                      </>
                    ) : (
                      <>
                        <Search size={16} /> Consultar Itinerário
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Itinerary Result Display */}
            {hasSearchedItinerary && (
              <div className="space-y-6">
                {/* Header Ticket Info */}
                <div className="bg-nc-surface border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono uppercase text-nc-orange font-bold">Localizador</span>
                        <span className="font-mono text-lg font-extrabold text-white px-3 py-0.5 bg-white/10 rounded-md">
                          {locatorInput}
                        </span>
                      </div>
                      <p className="text-sm text-nc-warm/80">
                        Passageiro: <strong className="text-white">Carlos Eduardo {lastNameInput}</strong> · Bilhete Emitido (GOL Linhas Aéreas)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showToast('Voucher e comprovante de reserva baixados em PDF.')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white hover:text-nc-space text-xs font-bold uppercase tracking-wider transition-all"
                      >
                        <Download size={14} /> Baixar Voucher (PDF)
                      </button>
                      <button
                        onClick={() => showToast('Itinerário enviado para o WhatsApp cadastrado.')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-nc-orange text-nc-space hover:bg-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                      >
                        <Send size={14} /> Enviar p/ WhatsApp
                      </button>
                    </div>
                  </div>

                  {/* Flight Segment Card */}
                  <div className="pt-6">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase text-nc-warm/50 mb-4">
                      <Plane size={14} className="text-nc-orange" /> Trecho Aéreo Confirmado
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-[#090c12] border border-white/10 items-center">
                      <div>
                        <span className="text-xs text-nc-warm/50 font-mono block">ORIGEM</span>
                        <h4 className="text-2xl font-bold text-white font-mono">CWB · 07:15</h4>
                        <p className="text-xs text-nc-warm/70">Afonso Pena (Curitiba/PR)</p>
                        <span className="text-xs text-nc-warm/50 mt-1 block">28 de Setembro de 2026</span>
                      </div>

                      <div className="flex flex-col items-center justify-center text-center">
                        <span className="text-xs text-nc-warm/50 font-mono mb-1">Duração: 1h 10m · Direto</span>
                        <div className="w-full flex items-center gap-2">
                          <div className="h-0.5 flex-1 bg-white/10"></div>
                          <Plane size={16} className="text-nc-orange transform rotate-90" />
                          <div className="h-0.5 flex-1 bg-white/10"></div>
                        </div>
                        <span className="text-xs text-nc-orange font-mono font-bold mt-1">Voo G3 1240 · Assento 4C</span>
                      </div>

                      <div className="md:text-right">
                        <span className="text-xs text-nc-warm/50 font-mono block">DESTINO</span>
                        <h4 className="text-2xl font-bold text-white font-mono">CGH · 08:25</h4>
                        <p className="text-xs text-nc-warm/70">Congonhas (São Paulo/SP)</p>
                        <span className="text-xs text-nc-warm/50 mt-1 block">28 de Setembro de 2026</span>
                      </div>
                    </div>
                  </div>

                  {/* Hotel Segment Card */}
                  <div className="pt-6">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase text-nc-warm/50 mb-4">
                      <Hotel size={14} className="text-nc-orange" /> Hospedagem Corporativa Confirmada
                    </div>

                    <div className="p-6 rounded-2xl bg-[#090c12] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold text-white">Blue Tree Premium Faria Lima</h4>
                        <p className="text-xs text-nc-warm/70">
                          Av. Brigadeiro Faria Lima, 3989 - Itaim Bibi, São Paulo - SP
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs font-mono text-nc-warm/60 pt-2">
                          <span>Check-in: <strong className="text-white">28/09 · 14h</strong></span>
                          <span>Check-out: <strong className="text-white">30/09 · 12h</strong></span>
                          <span>Regime: <strong className="text-white">Café da Manhã Incluso</strong></span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 size={14} /> Voucher Confirmado
                        </span>
                        <span className="text-[11px] text-nc-warm/50 block mt-1 font-mono">Faturamento Direto NC Turismo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 4: PLANTÃO 24H & SUPORTE EMERGENCIAL
           ========================================================================= */}
        {activeTab === 'suporte' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                Plantão Emergencial 24 Horas & Suporte Consultivo
              </h2>
              <p className="text-sm text-nc-warm/70">
                A NC Turismo não deixa você conversando com robôs. Nossa equipe humana de consultores seniores está a postos para intercorrências, reacomodações e emissões emergenciais.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Emergency Hotline */}
              <div className="bg-nc-surface border border-nc-orange/30 rounded-2xl p-6 relative overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-nc-orange/10 border border-nc-orange/30 flex items-center justify-center text-nc-orange mb-4">
                  <Phone size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Plantão Telefônico 24h</h3>
                <p className="text-xs text-nc-warm/70 leading-relaxed mb-6">
                  Linha direta exclusiva para passageiros em trânsito, cancelamentos de voos, perdas de conexão e situações críticas.
                </p>

                <div className="space-y-3 font-mono text-sm">
                  <div className="p-3 bg-[#0a0d14] rounded-xl border border-white/5">
                    <span className="text-[11px] text-nc-warm/50 block">CURITIBA & NACIONAL:</span>
                    <a href="tel:+554133232000" className="text-nc-orange font-bold hover:underline text-base">
                      (41) 3323-2000
                    </a>
                  </div>
                  <div className="p-3 bg-[#0a0d14] rounded-xl border border-white/5">
                    <span className="text-[11px] text-nc-warm/50 block">CENTRAL 0800 GRATUITA:</span>
                    <a href="tel:08007212000" className="text-white font-bold hover:underline text-base">
                      0800 721 2000
                    </a>
                  </div>
                </div>
              </div>

              {/* WhatsApp Business */}
              <div className="bg-nc-surface border border-white/10 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                  <Send size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">WhatsApp Corporativo</h3>
                <p className="text-xs text-nc-warm/70 leading-relaxed mb-6">
                  Envie mensagens, fotos de cartões de embarque ou solicitações de check-in para nosso time de suporte.
                </p>

                <a
                  href="https://wa.me/5541991234567?text=Ol%C3%A1%2C%20sou%20cliente%20NC%20Turismo%20e%20preciso%20de%20suporte%20na%20minha%20viagem."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
                >
                  <Send size={14} /> Chamar no WhatsApp
                </a>

                <p className="text-[11px] text-nc-warm/40 text-center mt-3 font-mono">
                  Horário comercial + escalonamento de plantão noturno
                </p>
              </div>

              {/* Account Management & Helpdesk */}
              <div className="bg-nc-surface border border-white/10 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                  <Mail size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Gestão de Contas & E-mail</h3>
                <p className="text-xs text-nc-warm/70 leading-relaxed mb-6">
                  Abertura de chamados estruturados para revisão de políticas de viagens, parametrização de novos aprovadores e dúvidas.
                </p>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-[#0a0d14] rounded-xl border border-white/5">
                    <span className="text-[11px] text-nc-warm/50 block">CORPORATE & EMISSÕES:</span>
                    <span className="text-white font-bold">corporativo@ncturismo.com.br</span>
                  </div>
                  <div className="p-3 bg-[#0a0d14] rounded-xl border border-white/5">
                    <span className="text-[11px] text-nc-warm/50 block">PLANTÃO 24 HORAS:</span>
                    <span className="text-nc-orange font-bold">plantao@ncturismo.com.br</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SLA Guarantee Box */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-nc-surface via-[#121622] to-nc-surface border border-white/10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase text-nc-orange font-bold">
                    Acordo de Nível de Serviço (SLA)
                  </span>
                  <h4 className="text-xl font-bold text-white">Compromisso de Resposta Imediata</h4>
                  <p className="text-xs md:text-sm text-nc-warm/70 max-w-2xl leading-relaxed">
                    Clientes contratados contam com tempo de primeira resposta inferior a 15 minutos em horário de plantão e acompanhamento proativo de voos através de nosso radar de desvios.
                  </p>
                </div>
                <button
                  onClick={() => showToast('Canal prioritário acionado. Um consultor entrará em contato em minutos.')}
                  className="shrink-0 px-6 py-3.5 bg-nc-orange text-nc-space font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-md"
                >
                  Acionar Suporte Prioritário
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: SOLICITAR ACESSO / PRIMEIRO ACESSO
           ========================================================================= */}
        {activeTab === 'primeiro-acesso' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                Solicitação de Credencial de Acesso
              </h2>
              <p className="text-sm text-nc-warm/70">
                Se sua empresa já é conveniada à NC Turismo e você precisa de um novo usuário para emitir ou aprovar viagens, preencha o formulário para cadastro imediato.
              </p>
            </div>

            <div className="bg-nc-surface border border-white/10 rounded-2xl p-6 md:p-10 max-w-2xl">
              {requestSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Solicitação Recebida com Sucesso!</h3>
                  <p className="text-sm text-nc-warm/70 max-w-md mx-auto leading-relaxed">
                    Nossa equipe de implantação validará os dados junto ao gestor da conta <strong className="text-white">{requestForm.empresa || 'sua empresa'}</strong>. As credenciais e instruções de acesso serão enviadas para <strong className="text-nc-orange">{requestForm.email || 'seu e-mail'}</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setRequestSubmitted(false);
                      setActiveTab('sistemas');
                    }}
                    className="mt-4 px-6 py-3 bg-nc-orange text-nc-space font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all"
                  >
                    Voltar aos Sistemas
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="req-nome" className="block text-xs font-mono uppercase text-nc-warm/70 mb-2">
                        Nome Completo <span className="text-nc-orange">*</span>
                      </label>
                      <input
                        id="req-nome"
                        type="text"
                        required
                        value={requestForm.nome}
                        onChange={(e) => setRequestForm({ ...requestForm, nome: e.target.value })}
                        placeholder="Ex: Mariana Castro"
                        className="w-full bg-[#0a0d14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-nc-orange"
                      />
                    </div>
                    <div>
                      <label htmlFor="req-email" className="block text-xs font-mono uppercase text-nc-warm/70 mb-2">
                        E-mail Corporativo <span className="text-nc-orange">*</span>
                      </label>
                      <input
                        id="req-email"
                        type="email"
                        required
                        value={requestForm.email}
                        onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                        placeholder="nome@suaempresa.com.br"
                        className="w-full bg-[#0a0d14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-nc-orange"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="req-empresa" className="block text-xs font-mono uppercase text-nc-warm/70 mb-2">
                        Nome da Empresa <span className="text-nc-orange">*</span>
                      </label>
                      <input
                        id="req-empresa"
                        type="text"
                        required
                        value={requestForm.empresa}
                        onChange={(e) => setRequestForm({ ...requestForm, empresa: e.target.value })}
                        placeholder="Razão Social ou Nome Fantasia"
                        className="w-full bg-[#0a0d14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-nc-orange"
                      />
                    </div>
                    <div>
                      <label htmlFor="req-gestor" className="block text-xs font-mono uppercase text-nc-warm/70 mb-2">
                        Gestor ou Aprovador Responsável
                      </label>
                      <input
                        id="req-gestor"
                        type="text"
                        value={requestForm.gestor}
                        onChange={(e) => setRequestForm({ ...requestForm, gestor: e.target.value })}
                        placeholder="Nome do diretor / gerente"
                        className="w-full bg-[#0a0d14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-nc-orange"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="req-tipo" className="block text-xs font-mono uppercase text-nc-warm/70 mb-2">
                      Perfil de Acesso Desejado
                    </label>
                    <select
                      id="req-tipo"
                      value={requestForm.tipoAcesso}
                      onChange={(e) => setRequestForm({ ...requestForm, tipoAcesso: e.target.value })}
                      className="w-full bg-[#0a0d14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-nc-orange"
                    >
                      <option value="viajante">Viajante (Pesquisa e Solicitação de Viagem)</option>
                      <option value="solicitante">Secretária / Solicitante (Emissão para Terceiros)</option>
                      <option value="aprovador">Aprovador / Gestor de Centro de Custo</option>
                      <option value="financeiro">Financeiro (Acesso a Faturas e Relatórios)</option>
                    </select>
                  </div>

                  <p className="text-xs text-nc-warm/50 leading-relaxed">
                    Ao enviar esta solicitação, seus dados serão tratados conforme a nossa Política de Privacidade para criação das permissões corporativas acordadas no contrato de prestação de serviços.
                  </p>

                  <button
                    type="submit"
                    className="w-full py-4 bg-nc-orange text-nc-space font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-lg"
                  >
                    Enviar Solicitação de Credencial
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>

      {/* =========================================================================
          OBT QUICK ACCESS MODAL
         ========================================================================= */}
      {obtModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-nc-surface border border-white/15 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-xs font-mono uppercase tracking-wider text-nc-orange font-bold">
                  Autenticação Corporativa
                </span>
              </div>
              <button
                onClick={() => setObtModal({ ...obtModal, isOpen: false })}
                className="text-nc-warm/50 hover:text-white p-1 rounded-lg transition-colors"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{obtModal.systemName}</h3>
            <p className="text-xs text-nc-warm/70 mb-6">{obtModal.description}</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast(`Redirecionando com segurança para o ambiente corporativo de ${obtModal.systemName}...`);
                setObtModal({ ...obtModal, isOpen: false });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-mono uppercase text-nc-warm/70 mb-1.5">
                  E-mail Corporativo ou Usuário
                </label>
                <input
                  type="text"
                  required
                  placeholder="usuario@suaempresa.com.br"
                  className="w-full bg-[#0a0d14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-nc-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-nc-warm/70 mb-1.5">
                  Senha
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#0a0d14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-nc-orange"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-nc-warm/60">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded bg-[#0a0d14] border-white/20 text-nc-orange focus:ring-0" />
                  <span>Lembrar usuário</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setObtModal({ ...obtModal, isOpen: false });
                    setActiveTab('suporte');
                  }}
                  className="text-nc-orange hover:underline"
                >
                  Esqueci a senha
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-nc-orange text-nc-space font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-md"
              >
                Entrar no Sistema
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <span className="text-xs text-nc-warm/40 font-mono">
                Precisa de novo acesso?{' '}
                <button
                  onClick={() => {
                    setObtModal({ ...obtModal, isOpen: false });
                    setActiveTab('primeiro-acesso');
                  }}
                  className="text-nc-orange hover:underline"
                >
                  Solicite aqui
                </button>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Institutional Footer for the Client Portal */}
      <footer className="mt-20 pt-10 border-t border-white/5 text-xs text-nc-warm/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="NC Turismo" className="w-[120px] h-auto object-contain" />
            <span className="text-nc-warm/30">| We Are Travel · Portal do Cliente</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => onOpenLegalTab && onOpenLegalTab('privacidade')}
              className="hover:text-nc-orange transition-colors"
            >
              Privacidade
            </button>
            <button
              onClick={() => onOpenLegalTab && onOpenLegalTab('termos')}
              className="hover:text-nc-orange transition-colors"
            >
              Termos de Uso
            </button>
            <button
              onClick={() => onOpenLegalTab && onOpenLegalTab('beneficios')}
              className="hover:text-nc-orange transition-colors"
            >
              Benefícios em Viagens
            </button>
          </div>

          <div>
            © {new Date().getFullYear()} NC Turismo Ltda. CNPJ 81.102.709/0001-08
          </div>
        </div>
      </footer>
    </div>
  );
};
