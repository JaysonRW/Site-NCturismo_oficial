import React, { useState, useEffect } from 'react';
import {
  PropostaComercial,
  PropostaModulo,
  PropostaItemComercial,
  DEFAULT_PROPOSTA_MODULOS,
  DEFAULT_ETAPAS_IMPLANTACAO,
  DEFAULT_ITENS_COMERCIAIS,
  DEFAULT_TERMOS_PROPOSTA,
  PROPOSTAS_SQL_SCHEMA,
  getPropostasComerciais,
  savePropostaComercial,
  deletePropostaComercial,
  getLeadsParcerias,
  LeadParceria
} from '../lib/supabase';
import { PropostaApresentacaoView } from './PropostaApresentacaoView';
import {
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  Database,
  Edit3,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  FileText,
  Handshake,
  Layers,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Share2,
  Sliders,
  Sparkles,
  Trash2,
  UploadCloud,
  UserCheck,
  Users,
  ArrowLeft,
  DollarSign,
  ShieldCheck
} from 'lucide-react';

interface AdminPropostasManagerProps {
  notify: (message: string, type?: 'success' | 'error') => void;
}

export const AdminPropostasManager: React.FC<AdminPropostasManagerProps> = ({ notify }) => {
  const [propostas, setPropostas] = useState<PropostaComercial[]>([]);
  const [leads, setLeads] = useState<LeadParceria[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PropostaComercial['status']>('all');

  // View modes: 'list' | 'edit' | 'preview'
  const [viewMode, setViewMode] = useState<'list' | 'edit' | 'preview'>('list');
  const [editorStep, setEditorStep] = useState<'cliente' | 'textos' | 'produtos' | 'comercial'>('cliente');
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showImportLeadModal, setShowImportLeadModal] = useState(false);

  // Current editing proposal state
  const createBlankProposal = (nextNumber: number): PropostaComercial => {
    const year = new Date().getFullYear();
    const padded = String(nextNumber).padStart(3, '0');
    return {
      id: `prop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      codigo_proposta: `NC-${year}-${padded}`,
      status: 'rascunho',
      cliente_nome: '',
      cliente_cnpj: '',
      cliente_segmento: 'Corporativo / Serviços',
      cliente_logo_url: '',
      cliente_volume_mensal: 'Sob dimensionamento',
      contato_nome: '',
      contato_cargo: 'Diretoria / Gestão de Viagens',
      contato_email: '',
      contato_telefone: '',
      consultor_nome: 'Equipe Executiva NC Turismo',
      consultor_cargo: 'Consultoria de Viagens & Gestão de Despesas B2B',
      consultor_email: 'corporativo@ncturismo.com.br',
      consultor_telefone: '(41) 3281-1153',
      data_emissao: new Date().toISOString().slice(0, 10),
      validade_dias: 15,
      titulo_apresentacao: 'Proposta de Gestão Consultiva de Viagens, Despesas & Ativos Tecnológicos',
      subtitulo_apresentacao:
        'Da primeira reserva à gestão completa: governança financeira, tecnologia OBT/Expense integrada ao seu ERP e suporte humano 24/7 com a solidez de 37 anos da NC Turismo.',
      carta_introducao:
        'Prezada Diretoria,\n\nÉ uma satisfação apresentar a proposta estruturada da NC Turismo para apoiar a gestão de viagens e despesas corporativas da sua organização.\n\nCom 37 anos de atuação no mercado brasileiro, unimos nossos ativos tecnológicos (plataformas OBT, Gestão de Despesas e BI Executivo) a um atendimento consultivo 100% próprio. Nosso objetivo é proporcionar controle financeiro absoluto, redução comprovada de custos (saving) e tranquilidade total para seus viajantes e gestores.',
      diagnostico_cenario:
        'Através da nossa metodologia consultiva, estruturamos fluxos digitais que eliminam planilhas manuais, centralizam prestações de contas, aplicam preventivamente a política de viagens da empresa e integram os centros de custo diretamente ao seu sistema financeiro/ERP.',
      objetivos_estrategicos: [
        'Reduzir o custo médio de emissões aéreas e hoteleiras com tarifas negociadas e engenharia de rotas',
        'Automatizar a prestação de contas e gestão de despesas corporativas com leitura OCR e integração ao ERP',
        'Garantir governança total com fluxos de aprovação multinível e controle por centro de custo no OBT',
        'Oferecer suporte emergencial 24/7 com equipe sênior 100% própria da NC Turismo'
      ],
      modulos: JSON.parse(JSON.stringify(DEFAULT_PROPOSTA_MODULOS)),
      metodologia_texto:
        'Nossa implantação segue um cronograma assistido em 4 etapas, garantindo transição segura, sem interrupção operacional e com treinamento completo para sua equipe.',
      etapas_implantacao: JSON.parse(JSON.stringify(DEFAULT_ETAPAS_IMPLANTACAO)),
      modelo_remuneracao_resumo:
        'Modelo comercial transparente e escalável, com bonificação integral do setup de implantação das plataformas e acesso imediato ao programa de benefícios.',
      itens_comerciais: JSON.parse(JSON.stringify(DEFAULT_ITENS_COMERCIAIS)),
      beneficio_especial_destaque:
        'Condição Especial: Elegibilidade a até 12 meses de benefícios para sua empresa + Cupons Mensais NC Turismo.',
      termos_condicoes: DEFAULT_TERMOS_PROPOSTA,
      observacoes_finais:
        'Todos os parâmetros técnicos, integrações e fluxos de alçada podem ser customizados sob medida durante o kickoff de implantação.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  };

  const [currentProposta, setCurrentProposta] = useState<PropostaComercial>(() => createBlankProposal(1));

  const loadAll = async () => {
    setLoading(true);
    try {
      const [propList, leadList] = await Promise.all([
        getPropostasComerciais(),
        getLeadsParcerias()
      ]);
      setPropostas(propList);
      setLeads(leadList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleStartNew = () => {
    const nextNum = propostas.length + 1;
    setCurrentProposta(createBlankProposal(nextNum));
    setEditorStep('cliente');
    setViewMode('edit');
  };

  const handleEditProposta = (prop: PropostaComercial) => {
    setCurrentProposta(JSON.parse(JSON.stringify(prop)));
    setEditorStep('cliente');
    setViewMode('edit');
  };

  const handlePreviewProposta = (prop: PropostaComercial) => {
    setCurrentProposta(JSON.parse(JSON.stringify(prop)));
    setViewMode('preview');
  };

  const handleDuplicateProposta = async (prop: PropostaComercial) => {
    const nextNum = propostas.length + 1;
    const year = new Date().getFullYear();
    const copy: PropostaComercial = {
      ...JSON.parse(JSON.stringify(prop)),
      id: `prop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      codigo_proposta: `NC-${year}-${String(nextNum).padStart(3, '0')}`,
      cliente_nome: `${prop.cliente_nome} (Cópia)`,
      status: 'rascunho',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    await savePropostaComercial(copy);
    await loadAll();
    notify('Proposta duplicada com sucesso! Você já pode editá-la.');
  };

  const handleDeleteProposta = async (id: string) => {
    if (!window.confirm('Deseja realmente excluir esta proposta comercial?')) return;
    await deletePropostaComercial(id);
    await loadAll();
    notify('Proposta comercial removida.');
  };

  const handleSaveCurrent = async (goToPreview = false) => {
    if (!currentProposta.cliente_nome.trim()) {
      notify('Informe o nome da empresa/cliente na Aba 1 antes de salvar.', 'error');
      setEditorStep('cliente');
      return;
    }

    setSaving(true);
    try {
      const res = await savePropostaComercial(currentProposta);
      await loadAll();
      if (res.syncedSupabase) {
        notify('Proposta salva e sincronizada no banco Supabase com sucesso!');
      } else {
        notify('Proposta salva com sucesso! (Para persistir na nuvem, aplique o Script SQL da tabela propostas_comerciais).');
      }
      if (goToPreview) {
        setViewMode('preview');
      }
    } catch (e: any) {
      notify('Erro ao salvar proposta: ' + (e?.message || 'Tente novamente'), 'error');
    } finally {
      setSaving(false);
    }
  };

  // Upload client logo as Base64 data URL so it works immediately without external storage setup
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      notify('A imagem da logo deve ter no máximo 2MB.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCurrentProposta((prev) => ({
          ...prev,
          cliente_logo_url: reader.result as string
        }));
        notify('Logo do cliente carregada e padronizada com sucesso!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Pre-fill from an existing Lead
  const handleApplyLead = (lead: LeadParceria) => {
    setCurrentProposta((prev) => ({
      ...prev,
      cliente_nome: lead.empresa || prev.cliente_nome,
      contato_nome: lead.nome || prev.contato_nome,
      contato_cargo: lead.cargo || prev.contato_cargo,
      contato_email: lead.email || prev.contato_email,
      contato_telefone: lead.telefone || prev.contato_telefone,
      cliente_segmento: lead.tipo_organizacao || prev.cliente_segmento,
      cliente_volume_mensal: lead.quantidade_pessoas ? `${lead.quantidade_pessoas} colaboradores/viajantes` : prev.cliente_volume_mensal,
      carta_introducao: `Prezado(a) ${lead.nome} e Diretoria da ${lead.empresa},\n\nÉ uma honra apresentar a proposta consultiva da NC Turismo desenhada especificamente para apoiar a gestão de viagens, despesas e benefícios da ${lead.empresa}.\n\nCom 37 anos de atuação sólida no mercado brasileiro, combinamos nossos ativos tecnológicos (OBT, Expense Management e BI Executivo) a um atendimento consultivo 100% próprio, garantindo governança, redução real de custos e suporte 24/7.`
    }));
    setShowImportLeadModal(false);
    notify(`Dados de "${lead.empresa}" importados para a proposta!`);
  };

  // Quick text presets for commercial speed
  const applyTextPreset = (presetType: 'despesas' | 'completo' | 'beneficios') => {
    if (presetType === 'despesas') {
      setCurrentProposta((prev) => ({
        ...prev,
        titulo_apresentacao: `Proposta de Gestão de Despesas (Expense) & Integração Corporativa — ${prev.cliente_nome || 'Sua Empresa'}`,
        subtitulo_apresentacao: 'Digitalização de ponta a ponta da prestação de contas, conciliação de cartões/adiantamentos e integração contábil com seu ERP.',
        diagnostico_cenario: 'Focamos esta proposta na eliminação definitiva de planilhas manuais, recibos físicos extraviados e retrabalho na conferência financeira. Com os ativos de Expense Management e OBT da NC Turismo, cada despesa de viagem nasce vinculada ao centro de custo correto e dentro da alçada aprovada.'
      }));
      notify('Template focado em Gestão de Despesas & ERP aplicado!');
    } else if (presetType === 'completo') {
      setCurrentProposta((prev) => ({
        ...prev,
        titulo_apresentacao: `Proposta de Gestão Consultiva 360°: Viagens, Despesas & Ativos OBT — ${prev.cliente_nome || 'Sua Empresa'}`,
        subtitulo_apresentacao: 'Agenciamento corporativo completo, plataformas OBT líderes, BI em tempo real e atendimento humano 24/7 com 37 anos de excelência.',
        diagnostico_cenario: 'Estruturamos uma solução completa que une nossos programas de autoatendimento corporativo (OBT e Gestão de Despesas) à curadoria sênior da equipe NC Turismo, reduzindo o ticket médio das viagens e garantindo compliance em 100% das emissões.'
      }));
      notify('Template Consultivo 360° (Viagens + Despesas + Ativos) aplicado!');
    } else {
      setCurrentProposta((prev) => ({
        ...prev,
        titulo_apresentacao: `Programa Corporativo de Viagens & Benefícios NC Turismo — ${prev.cliente_nome || 'Sua Empresa'}`,
        subtitulo_apresentacao: 'Eficiência nas viagens a negócios combinada a Cupons Mensais e condições exclusivas para colaboradores.',
        diagnostico_cenario: 'Além de organizar e reduzir custos nas reservas corporativas da empresa, esta proposta ativa o programa de Benefícios NC Turismo e Cupons Mensais, gerando valor imediato para diretoria e colaboradores.'
      }));
      notify('Template Viagens + Benefícios & Cupons aplicado!');
    }
  };

  // Module helpers
  const toggleModulo = (id: string) => {
    setCurrentProposta((prev) => ({
      ...prev,
      modulos: prev.modulos.map((m) => (m.id === id ? { ...m, selecionado: !m.selecionado } : m))
    }));
  };

  const updateModuloField = (id: string, field: keyof PropostaModulo, value: any) => {
    setCurrentProposta((prev) => ({
      ...prev,
      modulos: prev.modulos.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    }));
  };

  const handleAddCustomModulo = () => {
    const nextCode = String(currentProposta.modulos.length + 1).padStart(2, '0');
    const newMod: PropostaModulo = {
      id: `mod_custom_${Date.now()}`,
      codigo: nextCode,
      categoria: 'custom',
      titulo: 'Solução / Programa Customizado NC Turismo',
      subtitulo: 'Escopo dedicado desenhado para a operação do cliente',
      ativo_programa: 'Ativo / Serviço Personalizado NC',
      descricao: 'Descreva aqui como este ativo, programa ou serviço consultivo da NC Turismo atenderá a necessidade específica deste cliente.',
      entregaveis: [
        'Parametrização dedicada conforme regras de negócio do cliente',
        'Acompanhamento executivo com indicadores de performance (SLA)'
      ],
      selecionado: true,
      destaque: 'Escopo Sob Medida'
    };
    setCurrentProposta((prev) => ({
      ...prev,
      modulos: [...prev.modulos, newMod]
    }));
    notify('Novo módulo consultivo adicionado ao final da lista!');
  };

  const handleRemoveModulo = (id: string) => {
    setCurrentProposta((prev) => ({
      ...prev,
      modulos: prev.modulos.filter((m) => m.id !== id)
    }));
  };

  // Commercial items helpers
  const handleAddItemComercial = () => {
    const newItem: PropostaItemComercial = {
      id: `item_${Date.now()}`,
      item: 'Novo Item ou Programa Consultivo',
      modelo: 'Sob Medida / Fee',
      valor: 'A definir',
      observacao: 'Condição comercial personalizada'
    };
    setCurrentProposta((prev) => ({
      ...prev,
      itens_comerciais: [...prev.itens_comerciais, newItem]
    }));
  };

  const handleUpdateItemComercial = (id: string, field: keyof PropostaItemComercial, value: string) => {
    setCurrentProposta((prev) => ({
      ...prev,
      itens_comerciais: prev.itens_comerciais.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    }));
  };

  const handleRemoveItemComercial = (id: string) => {
    setCurrentProposta((prev) => ({
      ...prev,
      itens_comerciais: prev.itens_comerciais.filter((it) => it.id !== id)
    }));
  };

  const filteredPropostas = propostas.filter((p) => {
    const matchesSearch =
      p.cliente_nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.codigo_proposta.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.contato_nome || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: PropostaComercial['status']) => {
    switch (status) {
      case 'aprovada':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'enviada':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'em_negociacao':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'arquivada':
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
      default:
        return 'bg-white/10 text-nc-warm/80 border-white/15';
    }
  };

  const getStatusLabel = (status: PropostaComercial['status']) => {
    switch (status) {
      case 'aprovada':
        return 'Aprovada / Fechada';
      case 'enviada':
        return 'Enviada ao Cliente';
      case 'em_negociacao':
        return 'Em Negociação';
      case 'arquivada':
        return 'Arquivada';
      default:
        return 'Rascunho em Edição';
    }
  };

  // ============================================================================
  // RENDER MODE 1: PREVIEW PADRONIZADO DA APRESENTAÇÃO EXECUTIVA
  // ============================================================================
  if (viewMode === 'preview') {
    return (
      <div className="rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
        <PropostaApresentacaoView
          proposta={currentProposta}
          isPublicView={false}
          onBack={() => setViewMode('list')}
          onEdit={() => setViewMode('edit')}
        />
      </div>
    );
  }

  // ============================================================================
  // RENDER MODE 2: EDITOR COMPLETO DE PROPOSTA COMERCIAL
  // ============================================================================
  if (viewMode === 'edit') {
    return (
      <div className="space-y-6">
        {/* Top Editor Header */}
        <div className="bg-[#0c0e12] border border-white/10 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('list')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-nc-warm/70 hover:text-white transition-colors cursor-pointer"
              title="Voltar para a lista de propostas"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-md bg-nc-orange/15 border border-nc-orange/30 text-nc-orange font-mono text-xs font-bold">
                  {currentProposta.codigo_proposta}
                </span>
                <h2 className="text-lg md:text-xl font-bold text-white">
                  {currentProposta.cliente_nome ? `Proposta: ${currentProposta.cliente_nome}` : 'Elaborar Nova Apresentação Comercial'}
                </h2>
              </div>
              <p className="text-xs text-nc-warm/60 mt-0.5">
                Personalize a logo do cliente, selecione os produtos consultivos/ativos da NC Turismo e edite textos e termos.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {leads.length > 0 && (
              <button
                type="button"
                onClick={() => setShowImportLeadModal(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-nc-warm transition-all cursor-pointer"
              >
                <Users size={14} className="text-nc-orange" />
                <span>Puxar Dados de Lead</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSaveCurrent(false)}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              <Check size={14} />
              <span>{saving ? 'Salvando...' : 'Salvar Proposta'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSaveCurrent(true)}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#DB8902] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:brightness-105 transition-all cursor-pointer disabled:opacity-50"
            >
              <Eye size={15} />
              <span>Salvar & Ver Apresentação Pronta</span>
            </button>
          </div>
        </div>

        {/* Modal to Import from Existing Lead */}
        {showImportLeadModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#11141c] border border-white/15 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users size={18} className="text-nc-orange" />
                  Importar Dados de um Lead Recebido
                </h3>
                <button
                  onClick={() => setShowImportLeadModal(false)}
                  className="text-xs text-nc-warm/60 hover:text-white"
                >
                  Fechar ✕
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between gap-4 transition-colors"
                  >
                    <div>
                      <div className="text-sm font-bold text-white">{lead.empresa}</div>
                      <div className="text-xs text-nc-warm/70">
                        Contato: {lead.nome} · {lead.email} · {lead.telefone}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyLead(lead)}
                      className="px-3 py-1.5 rounded-lg bg-nc-orange text-nc-space text-xs font-bold shrink-0 cursor-pointer"
                    >
                      Usar Cliente
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step Navigation Bar (4 Steps) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              id: 'cliente',
              step: '1. Cliente & Logo',
              desc: 'Dados da empresa, decisor e padronização visual',
              icon: Building2
            },
            {
              id: 'produtos',
              step: '2. Produtos & Ativos NC',
              desc: 'Gestão de despesas, OBT, BI, Atendimento e Benefícios',
              icon: Layers
            },
            {
              id: 'textos',
              step: '3. Elaboração & Textos',
              desc: 'Carta executiva, diagnóstico e metas estratégicas',
              icon: Edit3
            },
            {
              id: 'comercial',
              step: '4. Comercial & Termos',
              desc: 'Investimento, cronograma de implantação e cláusulas',
              icon: DollarSign
            }
          ].map((tab) => {
            const IconComp = tab.icon;
            const active = editorStep === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setEditorStep(tab.id as any)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                  active
                    ? 'bg-gradient-to-br from-[#C8102E]/25 to-[#DB8902]/20 border-nc-orange text-white shadow-lg'
                    : 'bg-[#0c0e12] border-white/10 text-nc-warm/70 hover:text-white hover:border-white/20'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    active ? 'bg-nc-orange text-nc-space font-bold' : 'bg-white/5 text-nc-warm/60'
                  }`}
                >
                  <IconComp size={18} />
                </div>
                <div>
                  <div className="text-xs md:text-sm font-bold text-white">{tab.step}</div>
                  <div className="text-[11px] text-nc-warm/60 leading-snug mt-0.5">{tab.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* =====================================================================
            STEP 1: DADOS DO CLIENTE, LOGO & PADRONIZAÇÃO VISUAL
           ===================================================================== */}
        {editorStep === 'cliente' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Client & Contact Fields */}
            <div className="lg:col-span-7 bg-[#0c0e12] border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 size={18} className="text-nc-orange" />
                  Identificação do Cliente & Decisor
                </h3>
                <p className="text-xs text-nc-warm/60 mt-0.5">
                  Estes dados serão aplicados automaticamente na capa, no cabeçalho padronizado e no termo de aceite.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-nc-warm/80 mb-1.5">
                    Nome da Empresa / Organização Cliente *
                  </label>
                  <input
                    type="text"
                    value={currentProposta.cliente_nome}
                    onChange={(e) => setCurrentProposta((p) => ({ ...p, cliente_nome: e.target.value }))}
                    placeholder="Ex: Grupo Industrial Paranaense S.A."
                    className="w-full h-11 bg-[#13161c] border border-white/15 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-nc-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-nc-warm/80 mb-1.5">
                    CNPJ (Opcional)
                  </label>
                  <input
                    type="text"
                    value={currentProposta.cliente_cnpj || ''}
                    onChange={(e) => setCurrentProposta((p) => ({ ...p, cliente_cnpj: e.target.value }))}
                    placeholder="00.000.000/0001-00"
                    className="w-full h-11 bg-[#13161c] border border-white/15 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-nc-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-nc-warm/80 mb-1.5">
                    Segmento / Setor de Atuação
                  </label>
                  <input
                    type="text"
                    value={currentProposta.cliente_segmento || ''}
                    onChange={(e) => setCurrentProposta((p) => ({ ...p, cliente_segmento: e.target.value }))}
                    placeholder="Ex: Indústria, Agronegócio, Tecnologia, Saúde..."
                    className="w-full h-11 bg-[#13161c] border border-white/15 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-nc-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-nc-warm/80 mb-1.5">
                    Nome do Contato / Decisor Principal *
                  </label>
                  <input
                    type="text"
                    value={currentProposta.contato_nome}
                    onChange={(e) => setCurrentProposta((p) => ({ ...p, contato_nome: e.target.value }))}
                    placeholder="Ex: Carlos Eduardo Mendes"
                    className="w-full h-11 bg-[#13161c] border border-white/15 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-nc-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-nc-warm/80 mb-1.5">
                    Cargo / Departamento
                  </label>
                  <input
                    type="text"
                    value={currentProposta.contato_cargo || ''}
                    onChange={(e) => setCurrentProposta((p) => ({ ...p, contato_cargo: e.target.value }))}
                    placeholder="Ex: Diretor Financeiro (CFO) / Gestor de Viagens"
                    className="w-full h-11 bg-[#13161c] border border-white/15 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-nc-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-nc-warm/80 mb-1.5">
                    E-mail Corporativo do Cliente
                  </label>
                  <input
                    type="email"
                    value={currentProposta.contato_email || ''}
                    onChange={(e) => setCurrentProposta((p) => ({ ...p, contato_email: e.target.value }))}
                    placeholder="contato@empresa.com.br"
                    className="w-full h-11 bg-[#13161c] border border-white/15 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-nc-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-nc-warm/80 mb-1.5">
                    Telefone / WhatsApp do Cliente
                  </label>
                  <input
                    type="text"
                    value={currentProposta.contato_telefone || ''}
                    onChange={(e) => setCurrentProposta((p) => ({ ...p, contato_telefone: e.target.value }))}
                    placeholder="(41) 99999-0000"
                    className="w-full h-11 bg-[#13161c] border border-white/15 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-nc-orange"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-nc-warm/80 mb-1.5">
                    Volume Estimado de Viagens / Porte da Operação
                  </label>
                  <input
                    type="text"
                    value={currentProposta.cliente_volume_mensal || ''}
                    onChange={(e) => setCurrentProposta((p) => ({ ...p, cliente_volume_mensal: e.target.value }))}
                    placeholder="Ex: R$ 50.000/mês ou 80 viajantes frequentes"
                    className="w-full h-11 bg-[#13161c] border border-white/15 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-nc-orange"
                  />
                </div>
              </div>

              {/* Dados do Consultor NC e Controle da Proposta */}
              <div className="pt-6 border-t border-white/10 space-y-4">
                <h4 className="text-xs uppercase tracking-wider font-bold text-nc-orange">
                  Dados do Executivo NC Turismo & Controle do Documento
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] text-nc-warm/70 mb-1">Código da Proposta</label>
                    <input
                      type="text"
                      value={currentProposta.codigo_proposta}
                      onChange={(e) => setCurrentProposta((p) => ({ ...p, codigo_proposta: e.target.value }))}
                      className="w-full h-10 bg-[#13161c] border border-white/15 rounded-xl px-3 text-xs font-mono text-nc-orange font-bold focus:outline-none focus:border-nc-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-nc-warm/70 mb-1">Data de Emissão</label>
                    <input
                      type="date"
                      value={currentProposta.data_emissao}
                      onChange={(e) => setCurrentProposta((p) => ({ ...p, data_emissao: e.target.value }))}
                      className="w-full h-10 bg-[#13161c] border border-white/15 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-nc-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-nc-warm/70 mb-1">Status Comercial</label>
                    <select
                      value={currentProposta.status}
                      onChange={(e) => setCurrentProposta((p) => ({ ...p, status: e.target.value as any }))}
                      className="w-full h-10 bg-[#13161c] border border-white/15 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-nc-orange"
                    >
                      <option value="rascunho">Rascunho em Edição</option>
                      <option value="enviada">Enviada ao Cliente</option>
                      <option value="em_negociacao">Em Negociação</option>
                      <option value="aprovada">Aprovada / Fechada</option>
                      <option value="arquivada">Arquivada</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-nc-warm/70 mb-1">Executivo / Consultor NC</label>
                    <input
                      type="text"
                      value={currentProposta.consultor_nome}
                      onChange={(e) => setCurrentProposta((p) => ({ ...p, consultor_nome: e.target.value }))}
                      className="w-full h-10 bg-[#13161c] border border-white/15 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-nc-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-nc-warm/70 mb-1">E-mail do Consultor NC</label>
                    <input
                      type="text"
                      value={currentProposta.consultor_email}
                      onChange={(e) => setCurrentProposta((p) => ({ ...p, consultor_email: e.target.value }))}
                      className="w-full h-10 bg-[#13161c] border border-white/15 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-nc-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-nc-warm/70 mb-1">Telefone / WhatsApp NC</label>
                    <input
                      type="text"
                      value={currentProposta.consultor_telefone}
                      onChange={(e) => setCurrentProposta((p) => ({ ...p, consultor_telefone: e.target.value }))}
                      className="w-full h-10 bg-[#13161c] border border-white/15 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-nc-orange"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Client Logo Upload & Co-Branded Preview */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#0c0e12] border border-white/10 rounded-2xl p-6 space-y-5">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles size={18} className="text-nc-orange" />
                    Logo do Cliente & Padronização Visual
                  </h3>
                  <p className="text-xs text-nc-warm/60 mt-1">
                    Envie o arquivo de imagem da logo do cliente (PNG, SVG, JPG) ou cole o link. A proposta exibirá automaticamente as marcas lado a lado.
                  </p>
                </div>

                {/* Live Co-Branded Header Preview */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-white via-[#FFFDFB] to-[#FFF4E5] text-[#0F172A] border border-amber-200/80 shadow-inner space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                    Preview do Cabeçalho Padronizado da Proposta:
                  </span>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
                      <img
                        src="/assets/aistudio/Logos-nc-turismo-icone_-_Copia_3bd41d50.png"
                        alt="NC Turismo"
                        className="w-8 h-8 object-contain"
                      />
                      <div>
                        <span className="block text-xs font-extrabold text-[#0F172A] leading-none">NC TURISMO</span>
                        <span className="block text-[9px] font-bold text-[#C8102E] uppercase mt-0.5">37 Anos</span>
                      </div>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-amber-100 text-[#DB8902] flex items-center justify-center">
                      <Handshake size={14} />
                    </div>

                    <div className="flex items-center gap-2.5 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs flex-1 min-w-[140px]">
                      {currentProposta.cliente_logo_url ? (
                        <img
                          src={currentProposta.cliente_logo_url}
                          alt="Logo Cliente"
                          className="max-h-8 max-w-[110px] object-contain"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {(currentProposta.cliente_nome || 'CL').substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="truncate">
                        <span className="block text-[9px] uppercase text-slate-400">Cliente</span>
                        <span className="block text-xs font-bold text-[#0F172A] truncate">
                          {currentProposta.cliente_nome || 'Nome da Empresa'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Upload Box */}
                <div className="space-y-3">
                  <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/20 hover:border-nc-orange rounded-2xl p-6 text-center cursor-pointer bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                    <UploadCloud size={26} className="text-nc-orange" />
                    <span className="text-xs font-bold text-white">
                      Clique para enviar a Logo do Cliente do seu computador
                    </span>
                    <span className="text-[11px] text-nc-warm/50">
                      PNG com fundo transparente, SVG, JPG ou WebP (Máx. 2MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div>
                    <label className="block text-[11px] text-nc-warm/60 mb-1">
                      Ou cole a URL direta da logo do cliente:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={currentProposta.cliente_logo_url || ''}
                        onChange={(e) => setCurrentProposta((p) => ({ ...p, cliente_logo_url: e.target.value }))}
                        placeholder="https://site-do-cliente.com.br/logo.png"
                        className="flex-1 h-10 bg-[#13161c] border border-white/15 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-nc-orange"
                      />
                      {currentProposta.cliente_logo_url && (
                        <button
                          type="button"
                          onClick={() => setCurrentProposta((p) => ({ ...p, cliente_logo_url: '' }))}
                          className="px-3 h-10 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 text-xs font-bold cursor-pointer"
                        >
                          Remover
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditorStep('produtos')}
                    className="w-full py-3 rounded-xl bg-nc-orange text-nc-space font-bold text-xs uppercase tracking-wider hover:brightness-105 transition-all cursor-pointer"
                  >
                    Avançar para Etapa 2: Produtos Consultivos & Ativos &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            STEP 2: PRODUTOS CONSULTIVOS, ATIVOS & PROGRAMAS NC TURISMO
           ===================================================================== */}
        {editorStep === 'produtos' && (
          <div className="bg-[#0c0e12] border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                  <Layers size={18} className="text-nc-orange" />
                  Portfólio Consultivo: Gestão de Despesas, Ativos OBT & Programas NC Turismo
                </h3>
                <p className="text-xs text-nc-warm/60 mt-0.5">
                  Marque os produtos que farão parte desta proposta e personalize os textos, ativos ou entregáveis se desejar.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddCustomModulo}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-nc-orange text-nc-space font-bold text-xs uppercase tracking-wider hover:brightness-105 transition-all cursor-pointer"
              >
                <Plus size={15} />
                <span>Adicionar Produto / Ativo Customizado</span>
              </button>
            </div>

            <div className="space-y-5">
              {currentProposta.modulos.map((mod, idx) => (
                <div
                  key={mod.id}
                  className={`rounded-2xl border p-5 transition-all space-y-4 ${
                    mod.selecionado
                      ? 'bg-[#131720] border-nc-orange/50 shadow-md'
                      : 'bg-[#0e1015] border-white/10 opacity-60'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mod.selecionado}
                        onChange={() => toggleModulo(mod.id)}
                        className="w-5 h-5 rounded accent-[#DB8902] cursor-pointer"
                      />
                      <span className="px-2.5 py-1 rounded-lg bg-nc-orange/15 text-nc-orange font-mono text-xs font-bold">
                        Módulo 0{idx + 1}
                      </span>
                      <span className="text-sm md:text-base font-bold text-white">
                        {mod.titulo}
                      </span>
                    </label>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-nc-warm/50">
                        {mod.selecionado ? '✓ Incluído na Apresentação' : 'Oculto nesta Proposta'}
                      </span>
                      {mod.categoria === 'custom' && (
                        <button
                          type="button"
                          onClick={() => handleRemoveModulo(mod.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs cursor-pointer"
                          title="Excluir módulo customizado"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {mod.selecionado && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/10">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-nc-warm/60 mb-1">
                          Título do Produto / Solução Consultiva
                        </label>
                        <input
                          type="text"
                          value={mod.titulo}
                          onChange={(e) => updateModuloField(mod.id, 'titulo', e.target.value)}
                          className="w-full h-10 bg-[#0c0e12] border border-white/15 rounded-xl px-3 text-xs md:text-sm font-bold text-white focus:outline-none focus:border-nc-orange"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-nc-warm/60 mb-1">
                          Ativo Tecnológico / Programa Utilizado
                        </label>
                        <input
                          type="text"
                          value={mod.ativo_programa}
                          onChange={(e) => updateModuloField(mod.id, 'ativo_programa', e.target.value)}
                          placeholder="Ex: Argo Travel & Expense, WTS Corporate, BI NC..."
                          className="w-full h-10 bg-[#0c0e12] border border-white/15 rounded-xl px-3 text-xs text-nc-orange font-semibold focus:outline-none focus:border-nc-orange"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-nc-warm/60 mb-1">
                          Subtítulo de Apoio
                        </label>
                        <input
                          type="text"
                          value={mod.subtitulo}
                          onChange={(e) => updateModuloField(mod.id, 'subtitulo', e.target.value)}
                          className="w-full h-10 bg-[#0c0e12] border border-white/15 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-nc-orange"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-nc-warm/60 mb-1">
                          Selo de Ganho / Destaque Executivo
                        </label>
                        <input
                          type="text"
                          value={mod.destaque || ''}
                          onChange={(e) => updateModuloField(mod.id, 'destaque', e.target.value)}
                          placeholder="Ex: Até 65% menos tempo operacional"
                          className="w-full h-10 bg-[#0c0e12] border border-white/15 rounded-xl px-3 text-xs text-emerald-400 font-semibold focus:outline-none focus:border-nc-orange"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[11px] uppercase tracking-wider text-nc-warm/60 mb-1">
                          Descrição Consultiva do Produto
                        </label>
                        <textarea
                          rows={2}
                          value={mod.descricao}
                          onChange={(e) => updateModuloField(mod.id, 'descricao', e.target.value)}
                          className="w-full bg-[#0c0e12] border border-white/15 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-nc-orange"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[11px] uppercase tracking-wider text-nc-warm/60 mb-1">
                          Entregáveis Inclusos (1 item por linha)
                        </label>
                        <textarea
                          rows={4}
                          value={(mod.entregaveis || []).join('\n')}
                          onChange={(e) =>
                            updateModuloField(
                              mod.id,
                              'entregaveis',
                              e.target.value.split('\n').filter((line) => line.trim() !== '')
                            )
                          }
                          className="w-full bg-[#0c0e12] border border-white/15 rounded-xl p-3 text-xs text-nc-warm/90 font-mono leading-relaxed focus:outline-none focus:border-nc-orange"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setEditorStep('cliente')}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white cursor-pointer"
              >
                &larr; Voltar para Cliente & Logo
              </button>
              <button
                type="button"
                onClick={() => setEditorStep('textos')}
                className="px-6 py-3 rounded-xl bg-nc-orange text-nc-space font-bold text-xs uppercase tracking-wider hover:brightness-105 transition-all cursor-pointer"
              >
                Avançar para Etapa 3: Elaboração de Textos &rarr;
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            STEP 3: ELABORAÇÃO DA PROPOSTA, CARTA EXECUTIVA & DIAGNÓSTICO
           ===================================================================== */}
        {editorStep === 'textos' && (
          <div className="bg-[#0c0e12] border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                  <Edit3 size={18} className="text-nc-orange" />
                  Elaboração de Textos, Carta Executiva & Diagnóstico do Cliente
                </h3>
                <p className="text-xs text-nc-warm/60 mt-0.5">
                  Digite livremente os textos da apresentação ou aplique um dos modelos consultivos rápidos ao lado.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-nc-warm/50 mr-1">Modelos Rápidos:</span>
                <button
                  type="button"
                  onClick={() => applyTextPreset('despesas')}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-amber-300 cursor-pointer"
                >
                  Foco Gestão de Despesas & ERP
                </button>
                <button
                  type="button"
                  onClick={() => applyTextPreset('completo')}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white cursor-pointer"
                >
                  Gestão Consultiva 360° (OBT + Expense)
                </button>
                <button
                  type="button"
                  onClick={() => applyTextPreset('beneficios')}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-emerald-300 cursor-pointer"
                >
                  Corporativo + Cupons & Benefícios
                </button>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-nc-warm/80 mb-1.5">
                  Título Principal da Apresentação Comercial
                </label>
                <input
                  type="text"
                  value={currentProposta.titulo_apresentacao}
                  onChange={(e) => setCurrentProposta((p) => ({ ...p, titulo_apresentacao: e.target.value }))}
                  className="w-full h-11 bg-[#13161c] border border-white/15 rounded-xl px-4 text-sm font-bold text-white focus:outline-none focus:border-nc-orange"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-nc-warm/80 mb-1.5">
                  Subtítulo / Conceito Central da Proposta
                </label>
                <textarea
                  rows={2}
                  value={currentProposta.subtitulo_apresentacao}
                  onChange={(e) => setCurrentProposta((p) => ({ ...p, subtitulo_apresentacao: e.target.value }))}
                  className="w-full bg-[#13161c] border border-white/15 rounded-xl p-3.5 text-xs md:text-sm text-white focus:outline-none focus:border-nc-orange"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-nc-warm/80 mb-1.5">
                  Carta de Apresentação Executiva (Introdução Personalizada)
                </label>
                <textarea
                  rows={6}
                  value={currentProposta.carta_introducao}
                  onChange={(e) => setCurrentProposta((p) => ({ ...p, carta_introducao: e.target.value }))}
                  placeholder="Escreva a mensagem de abertura endereçada à diretoria ou gestor do cliente..."
                  className="w-full bg-[#13161c] border border-white/15 rounded-xl p-4 text-xs md:text-sm text-white leading-relaxed focus:outline-none focus:border-nc-orange"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-nc-warm/80 mb-1.5">
                  Diagnóstico Consultivo & Cenário Operacional
                </label>
                <textarea
                  rows={4}
                  value={currentProposta.diagnostico_cenario}
                  onChange={(e) => setCurrentProposta((p) => ({ ...p, diagnostico_cenario: e.target.value }))}
                  placeholder="Descreva as dores que a NC Turismo vai resolver neste cliente (ex: redução de planilhas, integração ERP, saving tarifário)..."
                  className="w-full bg-[#13161c] border border-white/15 rounded-xl p-4 text-xs md:text-sm text-white leading-relaxed focus:outline-none focus:border-nc-orange"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-nc-warm/80 mb-1.5">
                  Objetivos Estratégicos & Metas de Valor (1 objetivo por linha)
                </label>
                <textarea
                  rows={4}
                  value={(currentProposta.objetivos_estrategicos || []).join('\n')}
                  onChange={(e) =>
                    setCurrentProposta((p) => ({
                      ...p,
                      objetivos_estrategicos: e.target.value.split('\n').filter((line) => line.trim() !== '')
                    }))
                  }
                  className="w-full bg-[#13161c] border border-white/15 rounded-xl p-4 text-xs md:text-sm text-nc-warm font-mono leading-relaxed focus:outline-none focus:border-nc-orange"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setEditorStep('produtos')}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white cursor-pointer"
              >
                &larr; Voltar para Produtos & Ativos
              </button>
              <button
                type="button"
                onClick={() => setEditorStep('comercial')}
                className="px-6 py-3 rounded-xl bg-nc-orange text-nc-space font-bold text-xs uppercase tracking-wider hover:brightness-105 transition-all cursor-pointer"
              >
                Avançar para Etapa 4: Condições Comerciais & Termos &rarr;
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            STEP 4: CONDIÇÕES COMERCIAIS, INVESTIMENTO & TERMOS
           ===================================================================== */}
        {editorStep === 'comercial' && (
          <div className="bg-[#0c0e12] border border-white/10 rounded-2xl p-6 space-y-8">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                <DollarSign size={18} className="text-nc-orange" />
                Condições Comerciais, Precificação, Implantação & Termos
              </h3>
              <p className="text-xs text-nc-warm/60 mt-0.5">
                Ajuste a tabela de investimento/fees, destaque os benefícios de adesão e customize as cláusulas contratuais.
              </p>
            </div>

            {/* Resumo Comercial & Destaque de Benefício */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-nc-warm/80 mb-1.5">
                  Introdução ao Modelo de Remuneração
                </label>
                <textarea
                  rows={3}
                  value={currentProposta.modelo_remuneracao_resumo}
                  onChange={(e) => setCurrentProposta((p) => ({ ...p, modelo_remuneracao_resumo: e.target.value }))}
                  className="w-full bg-[#13161c] border border-white/15 rounded-xl p-3.5 text-xs text-white leading-relaxed focus:outline-none focus:border-nc-orange"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-amber-400 mb-1.5">
                  Destaque Especial de Benefício Comercial (Banner de Conversão)
                </label>
                <textarea
                  rows={3}
                  value={currentProposta.beneficio_especial_destaque || ''}
                  onChange={(e) => setCurrentProposta((p) => ({ ...p, beneficio_especial_destaque: e.target.value }))}
                  placeholder="Ex: Elegibilidade a até 12 meses de benefícios para sua empresa + Cupons Mensais NC Turismo."
                  className="w-full bg-[#13161c] border border-amber-500/30 rounded-xl p-3.5 text-xs text-amber-200 font-semibold leading-relaxed focus:outline-none focus:border-nc-orange"
                />
              </div>
            </div>

            {/* Tabela de Itens Comerciais */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs uppercase tracking-wider font-bold text-white">
                  Quadro de Investimento, Ativos & Condições Comerciais
                </h4>
                <button
                  type="button"
                  onClick={handleAddItemComercial}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-nc-orange/20 hover:bg-nc-orange/30 border border-nc-orange/40 text-nc-orange text-xs font-bold cursor-pointer"
                >
                  <Plus size={14} /> Adicionar Linha Comercial
                </button>
              </div>

              <div className="space-y-3">
                {currentProposta.itens_comerciais.map((it) => (
                  <div
                    key={it.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-xl bg-[#13161c] border border-white/10 items-center"
                  >
                    <div className="md:col-span-4">
                      <label className="block text-[10px] uppercase text-nc-warm/50 mb-1">Item / Serviço / Ativo</label>
                      <input
                        type="text"
                        value={it.item}
                        onChange={(e) => handleUpdateItemComercial(it.id, 'item', e.target.value)}
                        className="w-full h-9 bg-[#0c0e12] border border-white/10 rounded-lg px-3 text-xs text-white font-semibold"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[10px] uppercase text-nc-warm/50 mb-1">Modalidade</label>
                      <input
                        type="text"
                        value={it.modelo}
                        onChange={(e) => handleUpdateItemComercial(it.id, 'modelo', e.target.value)}
                        className="w-full h-9 bg-[#0c0e12] border border-white/10 rounded-lg px-3 text-xs text-nc-warm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] uppercase text-nc-warm/50 mb-1">Valor / Condição</label>
                      <input
                        type="text"
                        value={it.valor}
                        onChange={(e) => handleUpdateItemComercial(it.id, 'valor', e.target.value)}
                        className="w-full h-9 bg-[#0c0e12] border border-white/10 rounded-lg px-3 text-xs text-emerald-400 font-bold"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] uppercase text-nc-warm/50 mb-1">Observação</label>
                      <input
                        type="text"
                        value={it.observacao || ''}
                        onChange={(e) => handleUpdateItemComercial(it.id, 'observacao', e.target.value)}
                        className="w-full h-9 bg-[#0c0e12] border border-white/10 rounded-lg px-3 text-xs text-nc-warm/80"
                      />
                    </div>
                    <div className="md:col-span-1 flex justify-end pt-4">
                      <button
                        type="button"
                        onClick={() => handleRemoveItemComercial(it.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                        title="Remover item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Termos e Condições Gerais */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-nc-warm/80 mb-1.5">
                  Termos Comerciais, SLA Operacional, Faturamento & LGPD (Editável)
                </label>
                <textarea
                  rows={7}
                  value={currentProposta.termos_condicoes}
                  onChange={(e) => setCurrentProposta((p) => ({ ...p, termos_condicoes: e.target.value }))}
                  className="w-full bg-[#13161c] border border-white/15 rounded-xl p-4 text-xs text-white leading-relaxed focus:outline-none focus:border-nc-orange"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-nc-warm/80 mb-1.5">
                  Observações Finais / Notas Personalizadas
                </label>
                <textarea
                  rows={2}
                  value={currentProposta.observacoes_finais || ''}
                  onChange={(e) => setCurrentProposta((p) => ({ ...p, observacoes_finais: e.target.value }))}
                  className="w-full bg-[#13161c] border border-white/15 rounded-xl p-3.5 text-xs text-white leading-relaxed focus:outline-none focus:border-nc-orange"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap justify-between items-center gap-4">
              <button
                type="button"
                onClick={() => setEditorStep('textos')}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white cursor-pointer"
              >
                &larr; Voltar para Elaboração de Textos
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSaveCurrent(false)}
                  disabled={saving}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold cursor-pointer"
                >
                  Salvar Rascunho
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveCurrent(true)}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#DB8902] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-105 transition-all cursor-pointer"
                >
                  <Eye size={16} />
                  <span>Gerar & Visualizar Apresentação Padronizada</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // RENDER MODE 3: LISTAGEM DE PROPOSTAS & GERENCIADOR CENTRAL
  // ============================================================================
  return (
    <div className="space-y-6">
      {/* Top Banner & Primary CTA Button */}
      <div className="bg-gradient-to-r from-[#13161f] via-[#171218] to-[#191510] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nc-orange/15 border border-nc-orange/30 text-nc-orange text-xs font-bold uppercase tracking-wider">
            <Briefcase size={13} /> Gerador de Apresentações & Propostas B2B
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Apresentações Comerciais Padronizadas NC Turismo
          </h2>
          <p className="text-xs md:text-sm text-nc-warm/75 leading-relaxed">
            Elabore propostas consultivas com a <strong>Logo do Cliente</strong> ao lado da marca NC Turismo, selecione os produtos de <strong>Gestão de Despesas, Ativos OBT, BI e Agenciamento</strong>, personalize termos e exporte em PDF ou link direto.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowSqlModal(!showSqlModal)}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-nc-warm text-xs font-bold transition-all cursor-pointer"
          >
            <Database size={15} className="text-amber-400" />
            <span>Tabela SQL (Banco de Dados)</span>
          </button>

          <button
            type="button"
            onClick={handleStartNew}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#C8102E] to-[#DB8902] text-white font-bold text-xs md:text-sm uppercase tracking-wider shadow-xl shadow-red-500/20 hover:brightness-105 transition-all cursor-pointer"
          >
            <Plus size={18} />
            <span>Nova Apresentação Comercial</span>
          </button>
        </div>
      </div>

      {/* Collapsible SQL Schema Assistant for Supabase */}
      {showSqlModal && (
        <div className="bg-amber-950/30 border-2 border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-xl animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Database size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Estrutura da Tabela <code className="text-amber-300">public.propostas_comerciais</code> no PostgreSQL / Supabase
                </h3>
                <p className="text-xs text-nc-warm/80">
                  Copie o script SQL abaixo e execute no SQL Editor do Supabase para armazenar todas as propostas e logos na nuvem.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(PROPOSTAS_SQL_SCHEMA);
                  setCopiedSql(true);
                  notify('Script SQL da tabela propostas_comerciais copiado!');
                  setTimeout(() => setCopiedSql(false), 3000);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-nc-space font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all cursor-pointer"
              >
                {copiedSql ? <Check size={15} /> : <Copy size={15} />}
                <span>{copiedSql ? 'SQL Copiado!' : 'Copiar Script SQL'}</span>
              </button>

              <a
                href="https://supabase.com/dashboard/project/bfpwjtdhpxakarsjyklh/sql/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 font-bold text-xs uppercase tracking-wider transition-all"
              >
                <span>Abrir Supabase SQL</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <pre className="p-4 rounded-2xl bg-black/60 border border-white/10 text-[11px] font-mono text-amber-100/90 overflow-x-auto max-h-64 leading-relaxed">
            {PROPOSTAS_SQL_SCHEMA}
          </pre>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#0c0e12] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-nc-warm/50 font-semibold block mb-1">
              Total de Propostas
            </span>
            <span className="text-2xl font-bold text-white">{propostas.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-nc-orange/10 border border-nc-orange/20 text-nc-orange flex items-center justify-center">
            <FileText size={20} />
          </div>
        </div>

        <div className="bg-[#0c0e12] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-nc-warm/50 font-semibold block mb-1">
              Enviadas / Em Negociação
            </span>
            <span className="text-2xl font-bold text-blue-400">
              {propostas.filter((p) => p.status === 'enviada' || p.status === 'em_negociacao').length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Handshake size={20} />
          </div>
        </div>

        <div className="bg-[#0c0e12] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-nc-warm/50 font-semibold block mb-1">
              Propostas Aprovadas
            </span>
            <span className="text-2xl font-bold text-emerald-400">
              {propostas.filter((p) => p.status === 'aprovada').length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-[#0c0e12] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-nc-warm/50 font-semibold block mb-1">
              Ativos no Catálogo NC
            </span>
            <span className="text-sm font-bold text-nc-orange">7 Módulos Consultivos</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Layers size={20} />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0c0e12] border border-white/10 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-nc-warm/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar proposta por nome do cliente, código ou responsável..."
            className="w-full bg-[#13161c] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm text-white placeholder:text-nc-warm/40 focus:outline-none focus:border-nc-orange"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'rascunho', 'enviada', 'em_negociacao', 'aprovada'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-nc-orange text-nc-space'
                  : 'bg-white/5 text-nc-warm/70 hover:text-white'
              }`}
            >
              {st === 'all' ? 'Todas' : getStatusLabel(st)}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPropostas.map((prop) => {
          const activeModulesCount = (prop.modulos || []).filter((m) => m.selecionado).length;
          return (
            <div
              key={prop.id}
              className="bg-[#0c0e12] border border-white/10 hover:border-nc-orange/40 rounded-2xl p-6 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                {/* Client Logo or Avatar */}
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center p-2 border border-white/20 shrink-0 overflow-hidden">
                  {prop.cliente_logo_url ? (
                    <img
                      src={prop.cliente_logo_url}
                      alt={prop.cliente_nome}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-slate-900 font-extrabold text-base">
                      {(prop.cliente_nome || 'NC').substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-nc-orange">
                      {prop.codigo_proposta}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${getStatusBadge(
                        prop.status
                      )}`}
                    >
                      {getStatusLabel(prop.status)}
                    </span>
                    <span className="text-xs text-nc-warm/50 font-mono">
                      Emissão: {prop.data_emissao}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    {prop.cliente_nome}
                  </h3>

                  <p className="text-xs text-nc-warm/70 line-clamp-1">
                    {prop.titulo_apresentacao}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-nc-warm/60">
                    <span>
                      <strong>A/C:</strong> {prop.contato_nome || 'Diretoria'} {prop.contato_cargo ? `(${prop.contato_cargo})` : ''}
                    </span>
                    <span>•</span>
                    <span className="text-amber-300 font-semibold">
                      {activeModulesCount} Produtos/Ativos Consultivos no Escopo
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handlePreviewProposta(prop)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#DB8902] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-105 transition-all cursor-pointer"
                >
                  <Eye size={15} />
                  <span>Abrir Apresentação / PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleEditProposta(prop)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <Edit3 size={14} />
                  <span>Editar Proposta</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const url = `${window.location.origin}${window.location.pathname}#proposta/${prop.codigo_proposta || prop.id}`;
                    navigator.clipboard.writeText(url);
                    notify(`Link da apresentação (${prop.codigo_proposta}) copiado para enviar ao cliente!`);
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300 transition-colors cursor-pointer"
                  title="Copiar link público da apresentação para enviar ao cliente"
                >
                  <Share2 size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => handleDuplicateProposta(prop)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-nc-warm/80 hover:text-white transition-colors cursor-pointer"
                  title="Duplicar proposta como base para outro cliente"
                >
                  <Copy size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteProposta(prop.id)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/15 border border-white/10 text-nc-warm/60 hover:text-red-400 transition-colors cursor-pointer"
                  title="Excluir proposta"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
