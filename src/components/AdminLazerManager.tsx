import React, { useState } from 'react';
import { LazerPackage, LazerCategory, saveLazerPackage, deleteLazerPackage } from '../lib/supabase';
import { 
  Palmtree, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Sparkles, 
  Check, 
  X, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Ship, 
  Plane, 
  Globe, 
  Clock, 
  Copy, 
  CheckCircle2, 
  ExternalLink,
  Tag,
  ShieldCheck,
  Star
} from 'lucide-react';

interface AdminLazerManagerProps {
  packages: LazerPackage[];
  onRefresh: () => void;
  notify: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminLazerManager: React.FC<AdminLazerManagerProps> = ({ packages, onRefresh, notify }) => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft'>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const initialForm: Omit<LazerPackage, 'id'> = {
    title: '',
    destination: '',
    category: 'pacotes',
    category_label: 'Pacotes Completos',
    cover_image: '',
    gallery_images: [],
    price_from: 2500,
    price_original: 3200,
    installment_text: '10x sem juros',
    departure_dates: '',
    valid_until: '',
    duration_days: 7,
    nights: 6,
    status: 'active',
    badge: 'Destaque',
    included_items: ['Aéreo ida e volta', 'Hospedagem selecionada', 'Café da manhã', 'Transfer privativo'],
    description: '',
    featured: false
  };

  const [formData, setFormData] = useState<Omit<LazerPackage, 'id'>>(initialForm);
  const [includedItemInput, setIncludedItemInput] = useState('');

  const categoryLabels: Record<LazerCategory, string> = {
    pacotes: 'Pacotes Completos',
    cruzeiros: 'Cruzeiros Marítimos',
    internacional: 'Viagens Internacionais',
    nacional: 'Destinos Nacionais',
    resorts: 'Resorts & All-Inclusive',
    promocoes: 'Promoções Especiais'
  };

  const handleEdit = (pkg: LazerPackage) => {
    setEditingId(pkg.id);
    setFormData({
      title: pkg.title,
      destination: pkg.destination,
      category: pkg.category,
      category_label: pkg.category_label || categoryLabels[pkg.category],
      cover_image: pkg.cover_image,
      gallery_images: pkg.gallery_images || [],
      price_from: pkg.price_from,
      price_original: pkg.price_original || 0,
      installment_text: pkg.installment_text,
      departure_dates: pkg.departure_dates,
      valid_until: pkg.valid_until || '',
      duration_days: pkg.duration_days,
      nights: pkg.nights,
      status: pkg.status,
      badge: pkg.badge || '',
      included_items: pkg.included_items || [],
      description: pkg.description,
      featured: pkg.featured || false
    });
    setIsEditing(true);
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsEditing(true);
  };

  const handleDuplicate = async (pkg: LazerPackage) => {
    const duplicated: LazerPackage = {
      ...pkg,
      id: `lazer-${Date.now()}`,
      title: `${pkg.title} (Cópia)`,
      status: 'draft'
    };
    await saveLazerPackage(duplicated);
    notify('Oferta duplicada com sucesso como rascunho!');
    onRefresh();
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Tem certeza que deseja remover o pacote "${title}"?`)) {
      await deleteLazerPackage(id);
      notify('Pacote removido com sucesso!');
      onRefresh();
    }
  };

  const handleAddIncludedItem = () => {
    if (!includedItemInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      included_items: [...prev.included_items, includedItemInput.trim()]
    }));
    setIncludedItemInput('');
  };

  const handleRemoveIncludedItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      included_items: prev.included_items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.destination || !formData.cover_image) {
      notify('Preencha título, destino e link da imagem de capa.', 'error');
      return;
    }

    const payload: LazerPackage = {
      id: editingId || `pkg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...formData,
      category_label: categoryLabels[formData.category] || 'Viagem'
    };

    await saveLazerPackage(payload);
    notify(editingId ? 'Pacote atualizado com sucesso!' : 'Novo pacote cadastrado com sucesso!');
    setIsEditing(false);
    onRefresh();
  };

  const filtered = packages.filter(pkg => {
    const matchesSearch = pkg.title.toLowerCase().includes(search.toLowerCase()) ||
                          pkg.destination.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || pkg.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || pkg.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-red-500/10 via-amber-500/10 to-transparent border border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#C8102E]/20 text-[#C8102E]">
              <Palmtree size={20} />
            </span>
            <h2 className="text-xl font-bold text-white font-display">Gestão de Lazer, Promoções & Cruzeiros</h2>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            Cadastre pacotes, valores promocionais, períodos de vigência e fotos para alimentar a vitrine do cliente.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#DB8902] text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-red-500/20 transition-all cursor-pointer"
        >
          <Plus size={16} /> Cadastrar Nova Oferta
        </button>
      </div>

      {/* Editor Modal / View */}
      {isEditing && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#141824] border border-white/15 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#C8102E] animate-pulse" />
              <h3 className="text-lg md:text-xl font-bold text-white font-display">
                {editingId ? 'Editar Pacote de Viagem' : 'Cadastrar Novo Pacote de Viagem'}
              </h3>
            </div>
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Título */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Título da Oferta / Pacote *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cruzeiro Costa Brasileira · Sol & Brisa dos Mares"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#DB8902] focus:outline-none"
                />
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Categoria *
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as LazerCategory })}
                  className="w-full px-4 py-3 rounded-xl bg-[#1d2232] border border-white/10 text-white text-sm focus:border-[#DB8902] focus:outline-none"
                >
                  <option value="pacotes">Pacotes Completos</option>
                  <option value="cruzeiros">Cruzeiros Marítimos</option>
                  <option value="internacional">Internacional</option>
                  <option value="nacional">Nacional</option>
                  <option value="resorts">Resorts & All-Inclusive</option>
                  <option value="promocoes">Promoções Especiais</option>
                </select>
              </div>

              {/* Destino */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Destino / Localidade *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Santos, Búzios e Rio de Janeiro"
                  value={formData.destination}
                  onChange={e => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#DB8902] focus:outline-none"
                />
              </div>

              {/* Badge Promocional */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Badge / Selo em Destaque
                </label>
                <input
                  type="text"
                  placeholder="Ex: Pensão Completa, All-Inclusive, Super Promoção"
                  value={formData.badge}
                  onChange={e => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#DB8902] focus:outline-none"
                />
              </div>

              {/* Status & Destaque */}
              <div className="flex items-center gap-6 pt-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.status === 'active'}
                    onChange={e => setFormData({ ...formData, status: e.target.checked ? 'active' : 'draft' })}
                    className="w-4 h-4 rounded text-[#C8102E] accent-[#C8102E]"
                  />
                  <span>Ativo na vitrine</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm text-amber-400">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#DB8902] accent-[#DB8902]"
                  />
                  <span>Destacar no topo</span>
                </label>
              </div>

              {/* Imagem de Capa */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  URL da Imagem de Capa *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.cover_image}
                  onChange={e => setFormData({ ...formData, cover_image: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#DB8902] focus:outline-none"
                />
              </div>

              {/* Preço Original e Preço a partir de */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Preço A Partir De (R$) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.price_from}
                  onChange={e => setFormData({ ...formData, price_from: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#DB8902] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Preço De Tabela Anterior (Opcional, para "De / Por")
                </label>
                <input
                  type="number"
                  value={formData.price_original || ''}
                  onChange={e => setFormData({ ...formData, price_original: Number(e.target.value) })}
                  placeholder="Ex: 4200"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#DB8902] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Texto de Parcelamento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 10x de R$ 329 sem juros"
                  value={formData.installment_text}
                  onChange={e => setFormData({ ...formData, installment_text: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#DB8902] focus:outline-none"
                />
              </div>

              {/* Datas de Embarque / Vigência */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Datas Vigentes / Período de Embarque *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Saídas em Novembro e Dezembro 2026"
                  value={formData.departure_dates}
                  onChange={e => setFormData({ ...formData, departure_dates: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#DB8902] focus:outline-none"
                />
              </div>

              {/* Duração em Dias e Noites */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Duração (Dias e Noites)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Dias"
                    value={formData.duration_days}
                    onChange={e => setFormData({ ...formData, duration_days: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#DB8902] focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Noites"
                    value={formData.nights}
                    onChange={e => setFormData({ ...formData, nights: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#DB8902] focus:outline-none"
                  />
                </div>
              </div>

              {/* Validade da Promoção */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Validade da Tarifa (Opcional)
                </label>
                <input
                  type="date"
                  value={formData.valid_until}
                  onChange={e => setFormData({ ...formData, valid_until: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#DB8902] focus:outline-none"
                />
              </div>

            </div>

            {/* Descrição Completa */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Descrição do Pacote / Roteiro
              </label>
              <textarea
                rows={3}
                placeholder="Descreva a experiência, atrações e detalhes da viagem..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#DB8902] focus:outline-none"
              />
            </div>

            {/* Itens Inclusos */}
            <div className="space-y-3 p-5 rounded-2xl bg-white/5 border border-white/10">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Itens Inclusos no Pacote
              </label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Passagens aéreas de ida e volta, Taxas portuárias..."
                  value={includedItemInput}
                  onChange={e => setIncludedItemInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddIncludedItem();
                    }
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#DB8902] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddIncludedItem}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase transition-colors"
                >
                  Adicionar Item
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {formData.included_items.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs border border-white/10"
                  >
                    <Check size={12} className="text-emerald-400" />
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIncludedItem(idx)}
                      className="ml-1 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Preview da Capa */}
            {formData.cover_image && (
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-4">
                <img
                  src={formData.cover_image}
                  alt="Pré-visualização"
                  className="w-24 h-16 object-cover rounded-lg border border-white/20"
                  onError={e => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80';
                  }}
                />
                <div className="text-xs text-slate-300">
                  <span className="font-bold text-white block">Prévia da Capa</span>
                  <span>Verifique se o link da imagem carrega perfeitamente.</span>
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#DB8902] text-white text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-lg shadow-red-500/25 transition-all cursor-pointer"
              >
                Salvar Oferta
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por pacote ou destino..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#DB8902] focus:outline-none"
          />
        </div>

        {/* Filter Category */}
        <div>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#141824] border border-white/10 text-white text-sm focus:border-[#DB8902] focus:outline-none"
          >
            <option value="all">Todas as Categorias</option>
            <option value="cruzeiros">Cruzeiros Marítimos</option>
            <option value="internacional">Internacional</option>
            <option value="nacional">Nacional</option>
            <option value="resorts">Resorts & All-Inclusive</option>
            <option value="promocoes">Promoções Especiais</option>
            <option value="pacotes">Pacotes Completos</option>
          </select>
        </div>

        {/* Filter Status */}
        <div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className="w-full px-4 py-3 rounded-xl bg-[#141824] border border-white/10 text-white text-sm focus:border-[#DB8902] focus:outline-none"
          >
            <option value="all">Todos os Status ({packages.length})</option>
            <option value="active">Apenas Ativos na Vitrine ({packages.filter(p => p.status === 'active').length})</option>
            <option value="draft">Rascunhos / Pausados ({packages.filter(p => p.status === 'draft').length})</option>
          </select>
        </div>
      </div>

      {/* Listagem de Pacotes Cadastrados */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white/5 border border-white/10 text-slate-400 space-y-3">
            <Palmtree size={36} className="mx-auto text-slate-500 opacity-60" />
            <h4 className="text-base font-bold text-white">Nenhum pacote encontrado</h4>
            <p className="text-xs">Tente ajustar a busca ou cadastre uma nova oferta para a vitrine.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(pkg => (
              <div
                key={pkg.id}
                className="group rounded-2xl bg-[#141824] border border-white/10 hover:border-[#DB8902]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                    <img
                      src={pkg.cover_image}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Top tags */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white">
                        {pkg.category_label || pkg.category}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        pkg.status === 'active' 
                          ? 'bg-emerald-500/80 text-white' 
                          : 'bg-amber-500/80 text-black font-extrabold'
                      }`}>
                        {pkg.status === 'active' ? 'Ativo' : 'Rascunho'}
                      </span>
                    </div>

                    {/* Badge */}
                    {pkg.badge && (
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#C8102E] to-[#DB8902] text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                          {pkg.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-[#DB8902] font-semibold">
                      <MapPin size={13} />
                      <span className="truncate">{pkg.destination}</span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-[#DB8902] transition-colors line-clamp-2 leading-snug">
                      {pkg.title}
                    </h4>

                    {/* Dates and nights */}
                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 border-t border-white/5">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} /> {pkg.departure_dates}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="pt-2">
                      {pkg.price_original && pkg.price_original > pkg.price_from && (
                        <span className="text-xs text-slate-500 line-through block">
                          De R$ {pkg.price_original.toLocaleString('pt-BR')}
                        </span>
                      )}
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-slate-400">A partir de</span>
                        <span className="text-xl font-extrabold text-white">
                          R$ {pkg.price_from.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-[#DB8902]">
                        {pkg.installment_text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-[#C8102E]/20 text-slate-300 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1"
                      title="Editar pacote"
                    >
                      <Edit3 size={14} /> Editar
                    </button>
                    <button
                      onClick={() => handleDuplicate(pkg)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      title="Duplicar pacote"
                    >
                      <Copy size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(pkg.id, pkg.title)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                    title="Excluir pacote"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
