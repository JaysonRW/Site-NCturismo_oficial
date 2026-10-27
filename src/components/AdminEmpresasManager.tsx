import React, { useState, useEffect } from 'react';
import { 
  EmpresaConveniada, 
  getEmpresasConveniadas, 
  saveEmpresaConveniada, 
  toggleEmpresaStatus, 
  deleteEmpresaConveniada,
  SolicitacaoCodigo,
  getSolicitacoesCodigo,
  updateSolicitacaoStatus
} from '../lib/supabase';
import { 
  Building2, 
  Plus, 
  Search, 
  KeyRound, 
  Copy, 
  Check, 
  Trash2, 
  Power, 
  Edit3, 
  Users, 
  Mail, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  RefreshCw,
  Percent,
  AlertTriangle
} from 'lucide-react';

interface AdminEmpresasManagerProps {
  notify: (message: string, type?: 'success' | 'error') => void;
}

export const AdminEmpresasManager: React.FC<AdminEmpresasManagerProps> = ({ notify }) => {
  const [empresas, setEmpresas] = useState<EmpresaConveniada[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoCodigo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'empresas' | 'solicitacoes'>('empresas');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal de Criação / Edição de Empresa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    codigo_acesso: '',
    dominio_email: '',
    desconto_percentual: 10,
    tipo: 'empresa' as EmpresaConveniada['tipo'],
    ativa: true,
    total_beneficiados_estimado: 100,
    contato_rh_nome: '',
    contato_rh_email: '',
    contato_rh_telefone: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [empData, solData] = await Promise.all([
        getEmpresasConveniadas(),
        getSolicitacoesCodigo()
      ]);
      setEmpresas(empData);
      setSolicitacoes(solData);
    } catch (err) {
      console.error(err);
      notify('Erro ao carregar dados de empresas conveniadas', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleEmpresas = () => loadData();
    window.addEventListener('nc_empresas_updated', handleEmpresas);
    window.addEventListener('nc_solicitacoes_updated', handleEmpresas);
    return () => {
      window.removeEventListener('nc_empresas_updated', handleEmpresas);
      window.removeEventListener('nc_solicitacoes_updated', handleEmpresas);
    };
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    notify(`Código "${code}" copiado para a área de transferência!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleGenerateCode = () => {
    const cleanName = formData.nome
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z0-9]/g, '');

    const prefix = cleanName.length >= 3 ? cleanName.substring(0, 8) : 'PARCEIRO';
    const year = new Date().getFullYear();
    const generated = `NC-${prefix}-${year}`;
    setFormData(prev => ({ ...prev, codigo_acesso: generated }));
    notify(`Código sugerido: ${generated}`);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      nome: '',
      cnpj: '',
      codigo_acesso: '',
      dominio_email: '',
      desconto_percentual: 10,
      tipo: 'empresa',
      ativa: true,
      total_beneficiados_estimado: 100,
      contato_rh_nome: '',
      contato_rh_email: '',
      contato_rh_telefone: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp: EmpresaConveniada) => {
    setEditingId(emp.id);
    setFormData({
      nome: emp.nome,
      cnpj: emp.cnpj || '',
      codigo_acesso: emp.codigo_acesso,
      dominio_email: emp.dominio_email || '',
      desconto_percentual: emp.desconto_percentual || 10,
      tipo: emp.tipo,
      ativa: emp.ativa,
      total_beneficiados_estimado: emp.total_beneficiados_estimado || 0,
      contato_rh_nome: emp.contato_rh_nome || '',
      contato_rh_email: emp.contato_rh_email || '',
      contato_rh_telefone: emp.contato_rh_telefone || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim() || !formData.codigo_acesso.trim()) {
      notify('Preencha o Nome e o Código Único da Empresa', 'error');
      return;
    }

    try {
      await saveEmpresaConveniada({
        id: editingId || undefined,
        nome: formData.nome.trim(),
        cnpj: formData.cnpj.trim() || undefined,
        codigo_acesso: formData.codigo_acesso.trim().toUpperCase(),
        dominio_email: formData.dominio_email.trim() || undefined,
        desconto_percentual: Number(formData.desconto_percentual),
        tipo: formData.tipo,
        ativa: formData.ativa,
        total_beneficiados_estimado: Number(formData.total_beneficiados_estimado),
        contato_rh_nome: formData.contato_rh_nome.trim() || undefined,
        contato_rh_email: formData.contato_rh_email.trim() || undefined,
        contato_rh_telefone: formData.contato_rh_telefone.trim() || undefined,
      });

      notify(editingId ? 'Empresa conveniada atualizada!' : 'Nova empresa conveniada cadastrada com sucesso!');
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      notify('Erro ao salvar empresa conveniada', 'error');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleEmpresaStatus(id, !currentStatus);
      notify(`Status do convênio alterado para ${!currentStatus ? 'Ativo' : 'Pausado'}`);
      loadData();
    } catch {
      notify('Erro ao atualizar status', 'error');
    }
  };

  const handleDelete = async (id: string, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o convênio da "${nome}"?`)) return;
    try {
      await deleteEmpresaConveniada(id);
      notify(`Empresa "${nome}" excluída com sucesso`);
      loadData();
    } catch {
      notify('Erro ao excluir empresa', 'error');
    }
  };

  const handleSolicitacaoStatus = async (id: string, newStatus: SolicitacaoCodigo['status']) => {
    try {
      await updateSolicitacaoStatus(id, newStatus);
      notify(`Solicitação marcada como ${newStatus === 'atendido' ? 'Atendida' : 'Pendente'}`);
      loadData();
    } catch {
      notify('Erro ao atualizar solicitação', 'error');
    }
  };

  const filteredEmpresas = empresas.filter(emp => 
    emp.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.codigo_acesso.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (emp.contato_rh_nome && emp.contato_rh_nome.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pendingSolicitacoesCount = solicitacoes.filter(s => s.status === 'pendente').length;

  return (
    <div className="space-y-6">

      {/* TOP SUB-NAV */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSubTab('empresas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'empresas'
                ? 'bg-nc-orange text-nc-space shadow-md'
                : 'bg-white/5 text-nc-warm/70 hover:text-white'
            }`}
          >
            <Building2 size={15} />
            <span>Empresas & Códigos Ativos ({empresas.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('solicitacoes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${
              activeSubTab === 'solicitacoes'
                ? 'bg-nc-orange text-nc-space shadow-md'
                : 'bg-white/5 text-nc-warm/70 hover:text-white'
            }`}
          >
            <Clock size={15} />
            <span>Solicitações de Código Esquecido</span>
            {pendingSolicitacoesCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                {pendingSolicitacoesCount}
              </span>
            )}
          </button>
        </div>

        {activeSubTab === 'empresas' && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#DB8902] hover:brightness-110 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Cadastrar Nova Empresa Conveniada</span>
          </button>
        )}
      </div>

      {activeSubTab === 'empresas' ? (
        <>
          {/* SEARCH & FILTERS */}
          <div className="flex items-center justify-between gap-4 bg-[#0c0e12] border border-white/10 p-4 rounded-2xl">
            <div className="relative w-full md:w-96">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-nc-warm/40" />
              <input
                type="text"
                placeholder="Buscar empresa por nome ou código único..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#13161c] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-nc-warm/30 focus:outline-none focus:border-nc-orange"
              />
            </div>

            <div className="text-xs text-nc-warm/50 font-mono hidden sm:block">
              Total de conveniadas: <strong className="text-white">{empresas.length}</strong> (Ativas: {empresas.filter(e => e.ativa).length})
            </div>
          </div>

          {/* TABLE OF CONVENIADAS */}
          <div className="bg-[#0c0e12] border border-white/10 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-nc-warm/50 text-sm">
                <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-nc-orange" />
                Carregando empresas conveniadas...
              </div>
            ) : filteredEmpresas.length === 0 ? (
              <div className="p-12 text-center text-nc-warm/50 text-sm space-y-2">
                <Building2 size={32} className="mx-auto text-white/20 mb-2" />
                <p className="font-semibold text-white">Nenhuma empresa encontrada</p>
                <p className="text-xs text-nc-warm/40">Cadastre uma nova parceira no botão acima.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-nc-warm/50 font-semibold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Empresa / Tipo</th>
                      <th className="py-3.5 px-4">Código Único de Acesso</th>
                      <th className="py-3.5 px-4">Benefício / Desconto</th>
                      <th className="py-3.5 px-4">Contato RH / Benefícios</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-6 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-nc-warm/80">
                    {filteredEmpresas.map(emp => (
                      <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-bold text-white text-sm">
                            {emp.nome}
                          </div>
                          <div className="text-nc-warm/50 font-mono text-[11px] flex items-center gap-2 mt-0.5">
                            <span className="capitalize">{emp.tipo}</span>
                            {emp.cnpj && <span>• CNPJ: {emp.cnpj}</span>}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-mono font-bold text-xs text-amber-400">
                            <KeyRound size={13} className="text-amber-400" />
                            <span>{emp.codigo_acesso}</span>
                            <button
                              onClick={() => handleCopy(emp.codigo_acesso)}
                              className="text-white/60 hover:text-white transition-colors p-0.5 ml-1"
                              title="Copiar código"
                            >
                              {copiedCode === emp.codigo_acesso ? (
                                <Check size={12} className="text-emerald-400" />
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="text-white font-bold flex items-center gap-1">
                            <Percent size={13} className="text-[#25D366]" />
                            <span>{emp.desconto_percentual || 10}% de desconto</span>
                          </div>
                          <div className="text-nc-warm/50 text-[11px]">
                            ~{emp.total_beneficiados_estimado || 0} beneficiários
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          {emp.contato_rh_nome ? (
                            <div className="space-y-0.5">
                              <div className="text-white font-medium">{emp.contato_rh_nome}</div>
                              <div className="text-[11px] text-nc-warm/60 truncate max-w-[160px]">{emp.contato_rh_email || emp.contato_rh_telefone}</div>
                            </div>
                          ) : (
                            <span className="text-nc-warm/40 italic">Não cadastrado</span>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleToggleStatus(emp.id, emp.ativa)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                              emp.ativa
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20 hover:bg-zinc-500/20'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${emp.ativa ? 'bg-emerald-400' : 'bg-zinc-400'}`} />
                            {emp.ativa ? 'Ativo' : 'Pausado'}
                          </button>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(emp)}
                              className="p-2 rounded-lg bg-white/5 hover:bg-nc-orange hover:text-nc-space text-nc-warm/80 transition-colors"
                              title="Editar empresa"
                            >
                              <Edit3 size={14} />
                            </button>

                            <button
                              onClick={() => handleDelete(emp.id, emp.nome)}
                              className="p-2 rounded-lg bg-white/5 hover:bg-red-500 hover:text-white text-nc-warm/80 transition-colors"
                              title="Excluir convênio"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        /* TAB: SOLICITAÇÕES DE CÓDIGO ESQUECIDO */
        <div className="bg-[#0c0e12] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-4 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Solicitações de Colaboradores (Esqueci meu código)</h4>
              <p className="text-xs text-nc-warm/50">Colaboradores que solicitaram seu código de acesso pelo portal de benefícios.</p>
            </div>
            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs flex items-center gap-1.5"
            >
              <RefreshCw size={13} />
              <span>Atualizar</span>
            </button>
          </div>

          {solicitacoes.length === 0 ? (
            <div className="p-12 text-center text-nc-warm/50 text-sm">
              <CheckCircle2 size={32} className="mx-auto text-emerald-400/40 mb-2" />
              <p className="font-semibold text-white">Nenhuma solicitação pendente</p>
              <p className="text-xs text-nc-warm/40">Todas as solicitações de colaboradores foram atendidas.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-nc-warm/50 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Colaborador / Empresa</th>
                    <th className="py-3 px-4">Contato</th>
                    <th className="py-3 px-4">Data Solicitação</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-6 text-right">Ação Direta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-nc-warm/80">
                  {solicitacoes.map(sol => {
                    const matchedEmpresa = empresas.find(e => 
                      e.nome.toLowerCase().includes(sol.nome_empresa.toLowerCase()) ||
                      sol.nome_empresa.toLowerCase().includes(e.nome.toLowerCase())
                    );

                    const replyMsg = `Olá ${sol.nome_colaborador}! Sou da equipe de atendimento da NC Turismo. Você solicitou o código de acesso para os benefícios de viagens da ${sol.nome_empresa}.${
                      matchedEmpresa 
                        ? `\n\nSeu código de acesso exclusivo é: *${matchedEmpresa.codigo_acesso}*.\nVocê pode acessar diretamente em: http://beneficios.ncturismo.com.br/b2c/`
                        : `\n\nEstamos localizando seu convênio e já retornamos!`
                    }`;

                    const digits = (sol.telefone || '').replace(/\D/g, '');
                    const phoneWithCountry = digits.startsWith('55') ? digits : `55${digits}`;
                    const whatsappLink = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(replyMsg)}`;

                    return (
                      <tr key={sol.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-sm">
                            {sol.nome_colaborador}
                          </div>
                          <div className="text-amber-400 font-medium">
                            Empresa: {sol.nome_empresa}
                          </div>
                          {matchedEmpresa && (
                            <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                              Código correspondente: {matchedEmpresa.codigo_acesso}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-mono">
                          <div className="text-white">{sol.telefone || '-'}</div>
                          <div className="text-nc-warm/60 text-[11px]">{sol.email_corporativo}</div>
                        </td>

                        <td className="py-3.5 px-4 text-nc-warm/60">
                          {new Date(sol.created_at).toLocaleString('pt-BR')}
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleSolicitacaoStatus(sol.id, sol.status === 'pendente' ? 'atendido' : 'pendente')}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                              sol.status === 'atendido'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${sol.status === 'atendido' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                            {sol.status === 'atendido' ? 'Atendido' : 'Pendente'}
                          </button>
                        </td>

                        <td className="py-3.5 px-6 text-right">
                          <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              if (sol.status === 'pendente') handleSolicitacaoStatus(sol.id, 'atendido');
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs"
                          >
                            <MessageCircle size={14} />
                            <span>Responder no WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL CRIAR / EDITAR EMPRESA */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-[#0F131A] border border-white/15 rounded-3xl p-6 md:p-8 space-y-6 text-white shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#DB8902] flex items-center justify-center text-white">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingId ? 'Editar Empresa Conveniada' : 'Cadastrar Empresa Conveniada'}
                  </h3>
                  <p className="text-xs text-nc-warm/60">
                    Defina o código exclusivo para os colaboradores
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white/60 hover:text-white p-2 rounded-xl bg-white/5"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-nc-warm/70 uppercase tracking-wider font-semibold mb-1">
                  Nome da Empresa / Entidade *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Nome da Empresa ou Entidade Parceira"
                  value={formData.nome}
                  onChange={e => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full bg-[#13161c] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-nc-orange text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-nc-warm/70 uppercase tracking-wider font-semibold mb-1">
                    Tipo de Organização
                  </label>
                  <select
                    value={formData.tipo}
                    onChange={e => setFormData({ ...formData, tipo: e.target.value as any })}
                    className="w-full bg-[#13161c] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-nc-orange"
                  >
                    <option value="empresa">Empresa Privada</option>
                    <option value="associacao">Associação</option>
                    <option value="cooperativa">Cooperativa</option>
                    <option value="federacao">Federação / Entidade</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-nc-warm/70 uppercase tracking-wider font-semibold mb-1">
                    CNPJ (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="00.000.000/0000-00"
                    value={formData.cnpj}
                    onChange={e => setFormData({ ...formData, cnpj: e.target.value })}
                    className="w-full bg-[#13161c] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-nc-orange font-mono"
                  />
                </div>
              </div>

              {/* Código Único com Gerador Automático */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-nc-warm/70 uppercase tracking-wider font-semibold">
                    Código Único de Acesso *
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="text-[11px] text-nc-orange hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles size={12} />
                    <span>Sugerir Código</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Ex: NC-PARCEIRO-2026"
                  value={formData.codigo_acesso}
                  onChange={e => setFormData({ ...formData, codigo_acesso: e.target.value.toUpperCase() })}
                  className="w-full bg-[#13161c] border border-amber-500/30 rounded-xl px-4 py-2.5 text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-nc-warm/70 uppercase tracking-wider font-semibold mb-1">
                    Desconto do Convênio (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.desconto_percentual}
                    onChange={e => setFormData({ ...formData, desconto_percentual: Number(e.target.value) })}
                    className="w-full bg-[#13161c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-nc-orange"
                  />
                </div>

                <div>
                  <label className="block text-nc-warm/70 uppercase tracking-wider font-semibold mb-1">
                    Qtd. Beneficiários Estimada
                  </label>
                  <input
                    type="number"
                    value={formData.total_beneficiados_estimado}
                    onChange={e => setFormData({ ...formData, total_beneficiados_estimado: Number(e.target.value) })}
                    className="w-full bg-[#13161c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-nc-orange"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 space-y-3">
                <span className="text-nc-warm/50 font-bold uppercase tracking-wider block">
                  Contato de RH / Gestão da Parceria (Opcional):
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Nome do Gestor"
                    value={formData.contato_rh_nome}
                    onChange={e => setFormData({ ...formData, contato_rh_nome: e.target.value })}
                    className="bg-[#13161c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-nc-orange text-xs"
                  />
                  <input
                    type="email"
                    placeholder="E-mail RH"
                    value={formData.contato_rh_email}
                    onChange={e => setFormData({ ...formData, contato_rh_email: e.target.value })}
                    className="bg-[#13161c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-nc-orange text-xs"
                  />
                  <input
                    type="tel"
                    placeholder="Telefone RH"
                    value={formData.contato_rh_telefone}
                    onChange={e => setFormData({ ...formData, contato_rh_telefone: e.target.value })}
                    className="bg-[#13161c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-nc-orange text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#DB8902] hover:brightness-110 text-white font-bold shadow-md cursor-pointer"
                >
                  {editingId ? 'Salvar Alterações' : 'Cadastrar Empresa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
