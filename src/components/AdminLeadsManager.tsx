import React, { useState, useEffect } from 'react';
import { 
  LeadParceria, 
  getLeadsParcerias, 
  updateLeadStatus 
} from '../lib/supabase';
import { 
  Search, 
  Filter, 
  Download, 
  Phone, 
  Mail, 
  MessageCircle, 
  Building2, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Tag,
  AlertCircle
} from 'lucide-react';

interface AdminLeadsManagerProps {
  notify: (message: string, type?: 'success' | 'error') => void;
}

export const AdminLeadsManager: React.FC<AdminLeadsManagerProps> = ({ notify }) => {
  const [leads, setLeads] = useState<LeadParceria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LeadParceria['status']>('all');
  const [selectedLead, setSelectedLead] = useState<LeadParceria | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await getLeadsParcerias();
      setLeads(data);
    } catch (err) {
      console.error(err);
      notify('Erro ao carregar lista de leads', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();

    const handleUpdate = () => fetchLeads();
    window.addEventListener('nc_leads_updated', handleUpdate);
    return () => window.removeEventListener('nc_leads_updated', handleUpdate);
  }, []);

  const handleStatusChange = async (id: string, newStatus: LeadParceria['status']) => {
    try {
      await updateLeadStatus(id, newStatus);
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
      }
      notify(`Status do lead atualizado para "${getStatusLabel(newStatus)}"`);
    } catch (err) {
      notify('Erro ao atualizar status', 'error');
    }
  };

  const getStatusLabel = (status: LeadParceria['status']) => {
    switch (status) {
      case 'novo': return 'Novo Lead';
      case 'em_contato': return 'Em Contato';
      case 'proposta_enviada': return 'Proposta Enviada';
      case 'convertido': return 'Parceria Firmada';
      case 'descartado': return 'Descartado';
      default: return status;
    }
  };

  const getStatusBadgeClass = (status: LeadParceria['status']) => {
    switch (status) {
      case 'novo':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'em_contato':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
      case 'proposta_enviada':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/30';
      case 'convertido':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      case 'descartado':
        return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/30';
      default:
        return 'bg-white/10 text-white';
    }
  };

  // Filtragem
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.empresa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.cargo && lead.cargo.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Métricas
  const totalLeads = leads.length;
  const novosCount = leads.filter(l => l.status === 'novo').length;
  const emContatoCount = leads.filter(l => l.status === 'em_contato').length;
  const convertidosCount = leads.filter(l => l.status === 'convertido').length;

  // Exportação CSV
  const handleExportCSV = () => {
    if (leads.length === 0) {
      notify('Nenhum lead disponível para exportação', 'error');
      return;
    }

    const headers = [
      'Data Cadastro',
      'Nome',
      'Empresa',
      'Cargo',
      'E-mail',
      'Telefone',
      'Interesse',
      'Tipo Organizacao',
      'Publico Beneficiado',
      'Qtd Pessoas',
      'Origem Pagina',
      'UTM Source',
      'UTM Campaign',
      'Status'
    ];

    const rows = leads.map(l => [
      `"${new Date(l.created_at).toLocaleString('pt-BR')}"`,
      `"${l.nome.replace(/"/g, '""')}"`,
      `"${l.empresa.replace(/"/g, '""')}"`,
      `"${(l.cargo || '').replace(/"/g, '""')}"`,
      `"${l.email}"`,
      `"${l.telefone}"`,
      `"${l.interesse}"`,
      `"${(l.tipo_organizacao || '').replace(/"/g, '""')}"`,
      `"${(l.publico_beneficiado || '').replace(/"/g, '""')}"`,
      `"${(l.quantidade_pessoas || '').replace(/"/g, '""')}"`,
      `"${(l.origem_pagina || '').replace(/"/g, '""')}"`,
      `"${(l.utm_source || '').replace(/"/g, '""')}"`,
      `"${(l.utm_campaign || '').replace(/"/g, '""')}"`,
      `"${l.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_nc_turismo_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify('Relatório de leads exportado com sucesso em CSV');
  };

  const getCleanPhoneForWhatsApp = (rawPhone: string) => {
    const digits = rawPhone.replace(/\D/g, '');
    if (digits.startsWith('55')) return digits;
    return `55${digits}`;
  };

  return (
    <div className="space-y-6">
      
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#0c0e12] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-nc-warm/50 font-semibold block mb-1">
              Total de Oportunidades
            </span>
            <span className="text-2xl md:text-3xl font-bold text-white font-display">
              {totalLeads}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-[#0c0e12] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold block mb-1">
              Novos (Aguardando Contato)
            </span>
            <span className="text-2xl md:text-3xl font-bold text-amber-400 font-display">
              {novosCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-[#0c0e12] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold block mb-1">
              Em Negociação
            </span>
            <span className="text-2xl md:text-3xl font-bold text-blue-400 font-display">
              {emContatoCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Phone size={20} />
          </div>
        </div>

        <div className="bg-[#0c0e12] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold block mb-1">
              Parcerias Firmadas
            </span>
            <span className="text-2xl md:text-3xl font-bold text-emerald-400 font-display">
              {convertidosCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* FILTER & ACTIONS BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0c0e12] border border-white/10 p-4 rounded-2xl">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-nc-warm/40" />
          <input
            type="text"
            placeholder="Buscar por nome, empresa, cargo ou e-mail..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#13161c] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-nc-warm/30 focus:outline-none focus:border-nc-orange"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-nc-warm/40" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="bg-[#13161c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-nc-orange"
            >
              <option value="all">Todos os Status ({leads.length})</option>
              <option value="novo">Novos ({leads.filter(l => l.status === 'novo').length})</option>
              <option value="em_contato">Em Contato</option>
              <option value="proposta_enviada">Proposta Enviada</option>
              <option value="convertido">Parceria Firmada</option>
              <option value="descartado">Descartados</option>
            </select>
          </div>

          <button
            onClick={fetchLeads}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-nc-warm/70 hover:text-white border border-white/10 transition-colors"
            title="Atualizar dados"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors"
          >
            <Download size={14} />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* LEADS TABLE */}
      <div className="bg-[#0c0e12] border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-nc-warm/50 text-sm">
            <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-nc-orange" />
            Carregando oportunidades de parcerias...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center text-nc-warm/50 text-sm space-y-2">
            <Building2 size={32} className="mx-auto text-white/20 mb-2" />
            <p className="font-semibold text-white">Nenhum lead encontrado</p>
            <p className="text-xs text-nc-warm/40">
              {searchQuery || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros ou a busca acima.' 
                : 'Os formulários enviados no site aparecerão automaticamente aqui.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-nc-warm/50 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Organização / Contato</th>
                  <th className="py-3.5 px-4">Interesse / Escopo</th>
                  <th className="py-3.5 px-4">Contato Direto</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Data / Origem</th>
                  <th className="py-3.5 px-6 text-right">Ações Rápidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-nc-warm/80">
                {filteredLeads.map(lead => {
                  const whatsappUrl = `https://wa.me/${getCleanPhoneForWhatsApp(lead.telefone)}?text=${encodeURIComponent(
                    `Olá ${lead.nome}! Sou da equipe de parcerias da NC Turismo. Recebemos sua solicitação para a empresa ${lead.empresa} e estou à disposição!`
                  )}`;
                  const mailtoUrl = `mailto:${lead.email}?subject=${encodeURIComponent(
                    `Parceria NC Turismo - ${lead.empresa}`
                  )}`;

                  return (
                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-bold text-white text-sm">
                          {lead.empresa}
                        </div>
                        <div className="text-nc-warm/70 font-medium">
                          {lead.nome} {lead.cargo ? `• ${lead.cargo}` : ''}
                        </div>
                        {lead.tipo_organizacao && (
                          <div className="text-[11px] text-amber-400 font-mono mt-0.5">
                            {lead.tipo_organizacao}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-white font-medium">
                          {lead.interesse === 'beneficios-parcerias' 
                            ? 'Benefícios & Parcerias (NC Partners)' 
                            : lead.interesse === 'gestao-viagens'
                            ? 'Gestão de Viagens Corporativas'
                            : lead.interesse}
                        </div>
                        {lead.publico_beneficiado && (
                          <div className="text-[11px] text-nc-warm/50 mt-0.5">
                            Público: {lead.publico_beneficiado} • Qtd: {lead.quantidade_pessoas || 'N/I'}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4 space-y-1">
                        <div className="font-mono text-white/90">
                          {lead.telefone}
                        </div>
                        <div className="text-[11px] text-nc-warm/60 truncate max-w-[180px]">
                          {lead.email}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <select
                          value={lead.status}
                          onChange={e => handleStatusChange(lead.id, e.target.value as any)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-semibold border bg-transparent focus:outline-none cursor-pointer ${getStatusBadgeClass(lead.status)}`}
                        >
                          <option value="novo" className="bg-[#0c0e12] text-white">Novo</option>
                          <option value="em_contato" className="bg-[#0c0e12] text-white">Em Contato</option>
                          <option value="proposta_enviada" className="bg-[#0c0e12] text-white">Proposta Enviada</option>
                          <option value="convertido" className="bg-[#0c0e12] text-white">Parceria Firmada</option>
                          <option value="descartado" className="bg-[#0c0e12] text-white">Descartado</option>
                        </select>
                      </td>

                      <td className="py-4 px-4 text-[11px]">
                        <div className="text-white/80">
                          {new Date(lead.created_at).toLocaleDateString('pt-BR')} {new Date(lead.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-nc-warm/50 font-mono truncate max-w-[140px]">
                          {lead.origem_pagina || 'Direto'}
                        </div>
                        {lead.utm_source && (
                          <div className="text-amber-400/80 font-mono text-[10px]">
                            utm: {lead.utm_source}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 transition-all"
                            title="Chamar no WhatsApp"
                          >
                            <MessageCircle size={15} />
                          </a>

                          <a
                            href={mailtoUrl}
                            className="p-2 rounded-lg bg-white/5 hover:bg-nc-orange text-nc-warm/80 hover:text-nc-space transition-all"
                            title="Enviar E-mail"
                          >
                            <Mail size={15} />
                          </a>

                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all text-xs font-semibold px-2.5"
                            title="Ver detalhes completos"
                          >
                            Ficha
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETALHES MODAL / FICHA DO LEAD */}
      {selectedLead && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedLead(null)}
        >
          <div 
            className="relative w-full max-w-xl bg-[#0F131A] border border-white/15 rounded-3xl p-6 md:p-8 space-y-6 text-white shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-nc-orange font-bold">
                  Ficha da Oportunidade
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedLead.empresa}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="text-white/60 hover:text-white p-2 rounded-xl bg-white/5"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-nc-warm/50 uppercase font-semibold">Contato:</span>
                <p className="font-bold text-white text-sm">{selectedLead.nome}</p>
                <p className="text-nc-warm/70">{selectedLead.cargo || 'Cargo não informado'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-nc-warm/50 uppercase font-semibold">Canais:</span>
                <p className="font-mono text-white">{selectedLead.telefone}</p>
                <p className="text-nc-warm/70 truncate">{selectedLead.email}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-nc-warm/50 uppercase font-semibold">Interesse Principal:</span>
                <p className="text-white font-medium">{selectedLead.interesse}</p>
                <p className="text-amber-400">{selectedLead.tipo_organizacao || 'Tipo não especificado'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-nc-warm/50 uppercase font-semibold">Volume Estimado:</span>
                <p className="text-white font-medium">{selectedLead.quantidade_pessoas || 'Não informado'}</p>
                <p className="text-nc-warm/70">Público: {selectedLead.publico_beneficiado || '-'}</p>
              </div>
            </div>

            {/* Tracking Context */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
              <span className="text-nc-warm/50 font-bold uppercase tracking-wider block">
                Origem & Rastreamento (UTM):
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-nc-warm/70">
                <div>Página: <span className="text-white">{selectedLead.origem_pagina || '-'}</span></div>
                <div>Source: <span className="text-amber-400">{selectedLead.utm_source || 'orgânico'}</span></div>
                <div>Medium: <span className="text-white">{selectedLead.utm_medium || '-'}</span></div>
                <div>Campaign: <span className="text-white">{selectedLead.utm_campaign || '-'}</span></div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${getCleanPhoneForWhatsApp(selectedLead.telefone)}?text=${encodeURIComponent(
                  `Olá ${selectedLead.nome}! Sou da equipe de parcerias da NC Turismo. Vamos conversar sobre o convênio da ${selectedLead.empresa}?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <MessageCircle size={15} />
                <span>Conversar no WhatsApp</span>
              </a>

              <a
                href={`mailto:${selectedLead.email}?subject=Proposta de Parceria NC Turismo - ${selectedLead.empresa}`}
                className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10"
              >
                <Mail size={15} />
                <span>Enviar E-mail</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
