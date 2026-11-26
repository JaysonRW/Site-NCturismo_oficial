import React, { useState, useEffect, useMemo } from 'react';
import {
  RodoviarioOrder,
  getRodoviarioOrders,
} from '../lib/supabase';
import {
  Bus,
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  Armchair,
  DollarSign,
  Ticket,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

interface AdminRodoviarioOrdersManagerProps {
  notify: (message: string, type?: 'success' | 'error') => void;
}

const formatBRL = (value: number): string =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatOrderStatusLabel = (status: string): { label: string; badgeClass: string } => {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'paid' || normalized === 'confirmed') {
    return {
      label: 'Pago / Confirmado',
      badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    };
  }
  if (normalized === 'in_confirmation_process') {
    return {
      label: 'Em Confirmação',
      badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    };
  }
  if (normalized === 'canceled' || normalized === 'cancelled' || normalized === 'refunded') {
    return {
      label: 'Cancelado',
      badgeClass: 'bg-red-500/15 text-red-400 border-red-500/30',
    };
  }
  return {
    label: status || 'Registrado',
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  };
};

const formatPaymentLabel = (method: string | null): string => {
  if (method === 'pix') return 'PIX';
  if (method === 'creditCard') return 'Cartão de Crédito';
  if (method === 'preApproved') return 'Faturado / Pré-aprovado';
  return method || 'Não informado';
};

/**
 * Painel ADM para visualização e exportação das vendas rodoviárias (dados não sigilosos).
 */
export const AdminRodoviarioOrdersManager: React.FC<AdminRodoviarioOrdersManagerProps> = ({ notify }) => {
  const [orders, setOrders] = useState<RodoviarioOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'in_confirmation_process' | 'canceled'>('all');
  const [envFilter, setEnvFilter] = useState<'all' | 'production' | 'sandbox'>('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getRodoviarioOrders();
      setOrders(data);
    } catch (err: any) {
      console.error('Erro ao carregar pedidos rodoviários:', err);
      notify(err?.message || 'Erro ao carregar vendas rodoviárias', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return orders.filter((order) => {
      if (statusFilter !== 'all') {
        const st = String(order.status || '').toLowerCase();
        if (statusFilter === 'paid' && st !== 'paid' && st !== 'confirmed') return false;
        if (statusFilter === 'in_confirmation_process' && st !== 'in_confirmation_process') return false;
        if (statusFilter === 'canceled' && !['canceled', 'cancelled', 'refunded'].includes(st)) return false;
      }

      if (envFilter !== 'all' && order.qp_env !== envFilter) return false;

      if (!q) return true;

      const haystack = [
        order.qp_purchase_id ? String(order.qp_purchase_id) : '',
        order.external_id || '',
        order.origin_name,
        order.destination_name,
        order.company_name || '',
        order.seat_class || '',
        ...(order.passengers_names || []),
        ...(order.seats || []).map((s) => s.seatNumber),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [orders, searchQuery, statusFilter, envFilter]);

  const stats = useMemo(() => {
    const total = orders.length;
    const paid = orders.filter((o) => ['paid', 'confirmed'].includes(String(o.status).toLowerCase())).length;
    const pending = orders.filter((o) => String(o.status).toLowerCase() === 'in_confirmation_process').length;
    const totalRevenue = orders
      .filter((o) => !['canceled', 'cancelled', 'refunded'].includes(String(o.status).toLowerCase()))
      .reduce((acc, o) => acc + Number(o.total_price || 0), 0);
    return { total, paid, pending, totalRevenue };
  }, [orders]);

  const handleExportCsv = () => {
    if (filteredOrders.length === 0) {
      notify('Nenhum pedido disponível para exportação', 'error');
      return;
    }

    const headers = [
      'Data',
      'Pedido QP',
      'External ID',
      'Status',
      'Ambiente',
      'Origem',
      'Destino',
      'Data Viagem',
      'Horario',
      'Viacao',
      'Classe',
      'Passageiros',
      'Poltronas',
      'Pagamento',
      'Tarifa',
      'Taxas',
      'Seguro',
      'Total',
    ];

    const escapeCsv = (val: string) => `"${String(val || '').replace(/"/g, '""')}"`;

    const rows = filteredOrders.map((o) => [
      escapeCsv(new Date(o.created_at).toLocaleString('pt-BR')),
      escapeCsv(o.qp_purchase_id ? String(o.qp_purchase_id) : ''),
      escapeCsv(o.external_id || ''),
      escapeCsv(o.status),
      escapeCsv(o.qp_env),
      escapeCsv(o.origin_name),
      escapeCsv(o.destination_name),
      escapeCsv(o.departure_date || ''),
      escapeCsv(`${o.departure_time || ''} -> ${o.arrival_time || ''}`.trim()),
      escapeCsv(o.company_name || ''),
      escapeCsv(o.seat_class || ''),
      escapeCsv((o.passengers_names || []).join(' | ')),
      escapeCsv((o.seats || []).map((s) => `${s.leg.toUpperCase()}: ${s.seatNumber}`).join(' | ')),
      escapeCsv(formatPaymentLabel(o.payment_method)),
      escapeCsv(String(o.seat_price.toFixed(2))),
      escapeCsv(String(o.tax_price.toFixed(2))),
      escapeCsv(String(o.insurance_price.toFixed(2))),
      escapeCsv(String(o.total_price.toFixed(2))),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vendas_rodoviarias_nc_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify('Relatório CSV de vendas rodoviárias exportado com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0c0e12] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-nc-warm/50 font-semibold block mb-1">
              Total de Pedidos
            </span>
            <span className="text-2xl md:text-3xl font-bold text-white font-display">
              {stats.total}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
            <Ticket size={20} />
          </div>
        </div>

        <div className="bg-[#0c0e12] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold block mb-1">
              Pagos / Confirmados
            </span>
            <span className="text-2xl md:text-3xl font-bold text-emerald-400 font-display">
              {stats.paid}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-[#0c0e12] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold block mb-1">
              Em Confirmação
            </span>
            <span className="text-2xl md:text-3xl font-bold text-amber-400 font-display">
              {stats.pending}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-[#0c0e12] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-nc-orange font-semibold block mb-1">
              Volume Bruto (Ativos)
            </span>
            <span className="text-2xl font-bold text-white font-mono">
              {formatBRL(stats.totalRevenue)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-nc-orange/10 border border-nc-orange/20 flex items-center justify-center text-nc-orange">
            <DollarSign size={20} />
          </div>
        </div>
      </div>

      {/* PRIVACY NOTICE */}
      <div className="bg-[#0c0e12] border border-emerald-500/20 rounded-2xl px-4 py-3 flex items-center gap-3 text-xs text-nc-warm/80">
        <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
        <span>
          Registro conforme LGPD e PCI-DSS: apenas nomes dos passageiros, trecho, poltronas, status e valores são gravados (dados de cartão, CVV, CPF, RG e telefone nunca são persistidos).
        </span>
      </div>

      {/* FILTER & ACTIONS BAR */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#0c0e12] border border-white/10 p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-nc-warm/40" />
          <input
            type="text"
            placeholder="Buscar passageiro, destino, viação, poltrona ou ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#13161c] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-nc-warm/30 focus:outline-none focus:border-nc-orange"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-nc-warm/40" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[#13161c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-nc-orange"
            >
              <option value="all">Todos os Status ({orders.length})</option>
              <option value="paid">Pagos / Confirmados</option>
              <option value="in_confirmation_process">Em Confirmação</option>
              <option value="canceled">Cancelados</option>
            </select>
          </div>

          <select
            value={envFilter}
            onChange={(e) => setEnvFilter(e.target.value as any)}
            className="bg-[#13161c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-nc-orange"
          >
            <option value="all">Todos os Ambientes</option>
            <option value="production">Produção</option>
            <option value="sandbox">Sandbox</option>
          </select>

          <button
            type="button"
            onClick={fetchOrders}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-nc-warm/70 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Atualizar vendas"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            <Download size={14} />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-[#0c0e12] border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-nc-warm/50 text-sm">
            <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-nc-orange" />
            Carregando vendas rodoviárias do Supabase...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-nc-warm/50 text-sm space-y-2">
            <Bus size={32} className="mx-auto text-white/20 mb-2" />
            <p className="font-semibold text-white">Nenhuma compra rodoviária registrada</p>
            <p className="text-xs text-nc-warm/40 max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all' || envFilter !== 'all'
                ? 'Tente ajustar os filtros ou a busca acima.'
                : 'Assim que os clientes concluírem compras no Portal Rodoviário, os resumos aparecerão automaticamente aqui.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-nc-warm/50 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Pedido / Data</th>
                  <th className="py-3.5 px-4">Trecho &amp; Viação</th>
                  <th className="py-3.5 px-4">Passageiros &amp; Poltronas</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Valores</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-nc-warm/80">
                {filteredOrders.map((order) => {
                  const statusMeta = formatOrderStatusLabel(order.status);
                  const isCanceled = ['canceled', 'cancelled', 'refunded'].includes(
                    String(order.status || '').toLowerCase()
                  );
                  return (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors align-top">
                      <td className="py-4 px-4 space-y-1">
                        <div className="font-mono font-bold text-white text-sm">
                          {order.qp_purchase_id ? `#${order.qp_purchase_id}` : order.external_id || order.id.slice(0, 8)}
                        </div>
                        {order.external_id && order.qp_purchase_id && (
                          <div className="text-[11px] font-mono text-nc-warm/50">
                            {order.external_id}
                          </div>
                        )}
                        <div className="text-[11px] text-nc-warm/60">
                          {new Date(order.created_at).toLocaleDateString('pt-BR')}{' '}
                          {new Date(order.created_at).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-nc-warm/70">
                          <span>{formatPaymentLabel(order.payment_method)}</span>
                          <span>·</span>
                          <span>{order.qp_env}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 space-y-1">
                        <div className="font-bold text-white text-xs sm:text-sm">
                          {order.origin_name} → {order.destination_name}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap text-[11px] text-amber-400 font-semibold">
                          <span className="inline-flex items-center gap-1">
                            <Bus size={12} />
                            {order.company_name || 'Viação não informada'}
                          </span>
                          {order.seat_class && (
                            <span className="text-nc-warm/60 font-mono">
                              · {order.seat_class}
                            </span>
                          )}
                        </div>
                        {(order.departure_date || order.departure_time) && (
                          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-nc-warm/60">
                            <Calendar size={11} />
                            <span>
                              {order.departure_date || '-'}{' '}
                              {order.departure_time ? `(${order.departure_time} → ${order.arrival_time || ''})` : ''}
                            </span>
                          </div>
                        )}
                        {order.return_date && (
                          <div className="text-[10px] font-mono text-blue-300">
                            Volta prevista: {order.return_date}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4 space-y-1.5">
                        <div className="space-y-0.5">
                          {(order.passengers_names || []).map((name, idx) => (
                            <div key={idx} className="font-semibold text-white">
                              {name}
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(order.seats || []).map((s, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#C8102E]/20 border border-[#C8102E]/40 text-red-200 font-mono text-[11px] font-bold"
                            >
                              <Armchair size={11} />
                              <span>
                                {order.return_date ? `${s.leg.toUpperCase()} ` : ''}
                                {s.seatNumber}
                              </span>
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusMeta.badgeClass}`}
                        >
                          {isCanceled ? <XCircle size={12} /> : <CheckCircle2 size={12} />}
                          <span>{statusMeta.label}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right space-y-0.5">
                        <div className="font-mono font-bold text-white text-sm">
                          {formatBRL(order.total_price)}
                        </div>
                        <div className="text-[10px] font-mono text-nc-warm/50">
                          Tarifa: {formatBRL(order.seat_price)}
                        </div>
                        <div className="text-[10px] font-mono text-nc-warm/50">
                          Taxas: {formatBRL(order.tax_price)}
                          {order.insurance_price > 0 ? ` · Seguro: ${formatBRL(order.insurance_price)}` : ''}
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
    </div>
  );
};
