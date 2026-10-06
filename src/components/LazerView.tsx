import React, { useState, useEffect } from 'react';
import { 
  LazerPackage, 
  LazerCategory, 
  getLazerPackages 
} from '../lib/supabase';
import { 
  Compass, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Plane, 
  Palmtree, 
  ShieldCheck, 
  HeartHandshake,
  ExternalLink,
  PhoneCall,
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Ship,
  Hotel,
  Tag,
  Check,
  X,
  MessageCircle,
  HelpCircle,
  SlidersHorizontal
} from 'lucide-react';

interface LazerViewProps {
  onBackToHome: () => void;
  onOpenLegal: (tab: 'privacidade' | 'beneficios' | 'termos') => void;
}

export const LazerView: React.FC<LazerViewProps> = ({
  onBackToHome,
  onOpenLegal
}) => {
  const [packages, setPackages] = useState<LazerPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<LazerPackage | null>(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceMax, setPriceMax] = useState<number>(15000);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const loadPackages = async () => {
      setLoading(true);
      try {
        const data = await getLazerPackages();
        setPackages(data);
      } catch (err) {
        console.error('Erro ao carregar pacotes de lazer:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPackages();
  }, []);

  const categories = [
    { id: 'all', label: 'Todas as Opções', icon: Compass },
    { id: 'promocoes', label: 'Promoções Especiais', icon: Tag },
    { id: 'cruzeiros', label: 'Cruzeiros Marítimos', icon: Ship },
    { id: 'resorts', label: 'Resorts All-Inclusive', icon: Hotel },
    { id: 'internacional', label: 'Internacional', icon: Plane },
    { id: 'nacional', label: 'Destinos Nacionais', icon: MapPin },
    { id: 'pacotes', label: 'Pacotes Completos', icon: Palmtree }
  ];

  // Filtering
  const activePackages = packages.filter(p => p.status === 'active');

  const filteredPackages = activePackages.filter(pkg => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      pkg.title.toLowerCase().includes(term) ||
      pkg.destination.toLowerCase().includes(term) ||
      pkg.description.toLowerCase().includes(term);

    const matchesCategory = selectedCategory === 'all' || pkg.category === selectedCategory;
    const matchesPrice = pkg.price_from <= priceMax;

    const matchesMonth = selectedMonth === 'all' || 
      pkg.departure_dates.toLowerCase().includes(selectedMonth.toLowerCase());

    return matchesSearch && matchesCategory && matchesPrice && matchesMonth;
  });

  const generateWhatsAppLink = (pkg: LazerPackage) => {
    const msg = `Olá! Vim pelo site da NC Turismo e gostaria de solicitar uma cotação/atendimento para o pacote: "${pkg.title}" (Destino: ${pkg.destination}, Datas: ${pkg.departure_dates}).`;
    return `https://wa.me/554132811153?text=${encodeURIComponent(msg)}`;
  };

  const generalWhatsAppUrl = "https://wa.me/554132811153?text=Ol%C3%A1%2C%20gostaria%20de%20montar%20um%20roteiro%20de%20viagem%20de%20lazer%20personalizado%20com%20a%20NC%20Turismo.";

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#C8102E] selection:text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-red-100/35 via-orange-50/20 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[600px] right-0 w-[550px] h-[600px] bg-gradient-to-l from-amber-100/25 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Header / Breadcrumbs */}
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-5">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-[#C8102E] transition-colors text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft size={16} /> Voltar à página principal
          </button>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/80 text-[#C8102E] text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Sparkles size={13} className="text-[#DB8902]" /> NC Lazer · Curadoria & Experiências
            </span>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="max-w-[1320px] mx-auto px-6 md:px-12 mb-12">
        <div 
          className="relative overflow-hidden rounded-[32px] border border-red-200/80 p-8 md:p-14 lg:p-16 shadow-xl shadow-red-500/5"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFDFB 45%, #FFF6EC 100%)'
          }}
        >
          {/* Top colored indicator bar */}
          <div 
            className="w-[88px] h-[5px] rounded-full mb-8"
            style={{ background: 'linear-gradient(90deg, #C8102E, #DB8902)' }}
          />

          <div className="max-w-3xl relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#C8102E] text-xs font-bold tracking-widest uppercase shadow-2xs">
              Viagens Exclusivas, Cruzeiros e Pacotes Selecionados
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
              Descubra o mundo com a curadoria e a segurança da <span className="bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] bg-clip-text text-transparent">NC Turismo</span>.
            </h1>

            <p className="text-base md:text-xl text-slate-600 leading-relaxed font-normal">
              Mais do que vender passagens e diárias, desenhamos viagens completas para quem valoriza conforto, tempo e tranquilidade. Escolha entre pacotes vigentes ou consulte nossos especialistas para um roteiro 100% exclusivo.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={generalWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:brightness-105 active:scale-[0.99] transition-all shadow-xl shadow-red-500/25 cursor-pointer"
              >
                <MessageCircle size={18} />
                <span>Montar Roteiro Personalizado</span>
              </a>

              <button
                onClick={() => onOpenLegal('beneficios')}
                className="inline-flex items-center gap-2 px-6 py-4 bg-white hover:bg-slate-50 text-[#0F172A] font-semibold text-sm rounded-xl border border-slate-200 transition-all shadow-2xs hover:border-slate-300 cursor-pointer"
              >
                <span>Portal de Convênios & Benefícios</span>
                <ExternalLink size={15} className="text-[#C8102E]" />
              </button>
            </div>

            {/* Mini Trust Stats */}
            <div className="pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl font-extrabold text-[#0F172A]">Até 10x</div>
                <div className="text-xs text-slate-500 mt-0.5">Sem juros no cartão</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[#C8102E]">Plantão 24h</div>
                <div className="text-xs text-slate-500 mt-0.5">Suporte durante a viagem</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[#DB8902]">Sede Própria</div>
                <div className="text-xs text-slate-500 mt-0.5">Atendimento em Curitiba</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[#0F172A]">Boutique</div>
                <div className="text-xs text-slate-500 mt-0.5">Hotéis & Guias auditados</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH & FILTERS BAR */}
      <section className="max-w-[1320px] mx-auto px-6 md:px-12 mb-10">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-sm space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] flex items-center gap-2">
                <Search size={22} className="text-[#C8102E]" />
                Encontre sua próxima experiência
              </h2>
              <p className="text-xs md:text-sm text-slate-500">
                Filtre por destino, tipo de viagem ou período de embarque desejado.
              </p>
            </div>

            <div className="text-xs text-slate-500 font-semibold bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
              {filteredPackages.length} {filteredPackages.length === 1 ? 'pacote disponível' : 'pacotes disponíveis'}
            </div>
          </div>

          {/* Search Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div className="lg:col-span-2 relative">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Destino ou Palavra-Chave
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ex: Santiago, Cruzeiro, Foz do Iguaçu, Cancun..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAFCFF] border border-slate-200 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Mês de Embarque */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Período / Mês
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAFCFF] border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:border-[#C8102E] cursor-pointer"
                >
                  <option value="all">Qualquer Período</option>
                  <option value="Outubro">Outubro 2026</option>
                  <option value="Novembro">Novembro 2026</option>
                  <option value="Dezembro">Dezembro 2026 / Férias</option>
                  <option value="Janeiro">Janeiro 2027 / Verão</option>
                  <option value="Fevereiro">Fevereiro 2027 / Carnaval</option>
                  <option value="Março">Março a Maio 2027</option>
                </select>
              </div>
            </div>

            {/* Preço Máximo */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Valor até
                </label>
                <span className="text-xs font-bold text-[#C8102E]">
                  R$ {priceMax.toLocaleString('pt-BR')}
                </span>
              </div>
              <input
                type="range"
                min="1500"
                max="15000"
                step="500"
                value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#C8102E] mt-3"
              />
            </div>

          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2">
            {categories.map(cat => {
              const IconComp = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#C8102E] to-[#DB8902] text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60'
                  }`}
                >
                  <IconComp size={14} className={isSelected ? 'text-white' : 'text-[#DB8902]'} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* PACKAGES SHOWCASE GRID */}
      <section className="max-w-[1320px] mx-auto px-6 md:px-12 mb-20">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-[#C8102E] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-500 font-medium">Carregando experiências e pacotes vigentes...</p>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-4">
            <Compass size={40} className="mx-auto text-slate-400" />
            <h3 className="text-lg font-bold text-[#0F172A]">Nenhum pacote encontrado com esses filtros</h3>
            <p className="text-sm text-slate-500">
              Experimente ampliar a faixa de preço ou limpar o termo de busca para visualizar todas as opções.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceMax(15000);
                setSelectedMonth('all');
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold uppercase text-[#0F172A] transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map(pkg => (
              <div
                key={pkg.id}
                className="group rounded-3xl bg-white border border-slate-200/90 hover:border-[#C8102E]/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
              >
                <div>
                  {/* Image banner */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <img
                      src={pkg.cover_image}
                      alt={pkg.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={e => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Category pill */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-[#0F172A] shadow-md border border-slate-200">
                        {pkg.category_label || pkg.category}
                      </span>
                    </div>

                    {/* Featured / Promo Badge */}
                    {pkg.badge && (
                      <div className="absolute top-3.5 right-3.5">
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#C8102E] to-[#DB8902] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                          {pkg.badge}
                        </span>
                      </div>
                    )}

                    {/* Destination tag on bottom of image */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-1.5 font-semibold drop-shadow-md truncate">
                        <MapPin size={14} className="text-[#DB8902] shrink-0" />
                        <span className="truncate">{pkg.destination}</span>
                      </div>

                      <span className="text-[11px] font-mono bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full shrink-0">
                        {pkg.duration_days} dias / {pkg.nights} noites
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg md:text-xl font-bold text-[#0F172A] group-hover:text-[#C8102E] transition-colors leading-snug line-clamp-2">
                      {pkg.title}
                    </h3>

                    {/* Dates */}
                    <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">
                      <Calendar size={14} className="text-[#DB8902] shrink-0" />
                      <span className="truncate">{pkg.departure_dates}</span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {pkg.description}
                    </p>

                    {/* Included micro-bullets */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Destaques inclusos:
                      </span>
                      {pkg.included_items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                          <Check size={13} className="text-[#C8102E] shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                      {pkg.included_items.length > 3 && (
                        <span className="text-[11px] text-[#DB8902] font-semibold block pt-0.5">
                          + {pkg.included_items.length - 3} outros itens inclusos
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing & Actions */}
                <div className="p-6 pt-0 space-y-4">
                  <div className="pt-4 border-t border-slate-100 flex items-end justify-between">
                    <div>
                      {pkg.price_original && pkg.price_original > pkg.price_from && (
                        <span className="text-xs text-slate-400 line-through block">
                          De R$ {pkg.price_original.toLocaleString('pt-BR')}
                        </span>
                      )}
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs text-slate-500">A partir de</span>
                        <span className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                          R$ {pkg.price_from.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#DB8902] block">
                        {pkg.installment_text}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedPackage(pkg)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold uppercase tracking-wider text-[#0F172A] hover:text-[#C8102E] transition-colors cursor-pointer"
                    >
                      Ver Detalhes
                    </button>
                  </div>

                  <a
                    href={generateWhatsAppLink(pkg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#DB8902] text-white font-bold text-xs uppercase tracking-wider hover:brightness-105 active:scale-[0.99] transition-all shadow-md shadow-red-500/15 cursor-pointer"
                  >
                    <MessageCircle size={16} />
                    <span>Solicitar Cotação / Reserva</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL DE DETALHES DO PACOTE */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              onClick={() => setSelectedPackage(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
            >
              <X size={18} />
            </button>

            {/* Modal Image Header */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 shrink-0">
              <img
                src={selectedPackage.cover_image}
                alt={selectedPackage.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="px-3 py-1 rounded-full bg-[#C8102E] text-white text-[11px] font-bold uppercase tracking-wider">
                  {selectedPackage.category_label || selectedPackage.category}
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-extrabold leading-tight">
                  {selectedPackage.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-200 font-medium">
                  <MapPin size={14} className="text-[#DB8902]" />
                  <span>{selectedPackage.destination}</span>
                  <span>·</span>
                  <Calendar size={14} className="text-[#DB8902]" />
                  <span>{selectedPackage.departure_dates}</span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6 flex-1">
              
              {/* Pricing highlight banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  {selectedPackage.price_original && selectedPackage.price_original > selectedPackage.price_from && (
                    <span className="text-xs text-slate-400 line-through block">
                      De R$ {selectedPackage.price_original.toLocaleString('pt-BR')}
                    </span>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-slate-600 font-medium">Valor promocional a partir de:</span>
                    <span className="text-2xl md:text-3xl font-extrabold text-[#C8102E]">
                      R$ {selectedPackage.price_from.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#DB8902]">
                    {selectedPackage.installment_text}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700 block">
                    Duração: {selectedPackage.duration_days} dias / {selectedPackage.nights} noites
                  </span>
                  {selectedPackage.valid_until && (
                    <span className="text-[11px] text-slate-500 block">
                      Tarifa válida até {new Date(selectedPackage.valid_until).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">
                  Sobre este Pacote
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedPackage.description}
                </p>
              </div>

              {/* Included Items */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">
                  Itens & Experiências Inclusas
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedPackage.included_items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800 font-medium">
                      <Check size={16} className="text-[#C8102E] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consultation note */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-[#DB8902] block">Datas flexíveis ou alterações de itinerário?</span>
                <p>Nossa equipe de lazer pode ajustar a quantidade de noites, classe de voo, upgrade de hotel ou passeios privativos sob medida para o seu grupo.</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={generateWhatsAppLink(selectedPackage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] text-white font-bold text-sm uppercase tracking-wider text-center hover:brightness-105 transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle size={18} />
                  <span>Falar com o Consultor deste Pacote</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedPackage(null)}
                  className="w-full sm:w-auto py-4 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Fechar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* DIFERENCIAIS DA CONSULTORIA NC LAZER */}
      <section className="max-w-[1320px] mx-auto px-6 md:px-12 mb-20">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 md:p-12 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DB8902] block">
              Diferenciais da Nossa Consultoria
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
              Por que viajar de férias com a NC Turismo?
            </h2>
            <p className="text-sm text-slate-600">
              O mesmo rigor, solidez e excelência que aplicamos nas viagens corporativas das maiores empresas do país, agora a serviço do seu descanso e da sua família.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FAFCFF] border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-[#C8102E] flex items-center justify-center">
                <Compass size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Curadoria Personalizada</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cada itinerário é desenhado de acordo com seus gostos, ritmo e expectativas, integrando passagens nas melhores classes, hotéis boutique, transfers privativos e passeios exclusivos.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFCFF] border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#DB8902] flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Plantão e Segurança 24h</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Viaje com total tranquilidade. Nossa equipe própria está sempre disponível para resolver remarcações, atrasos, dúvidas de documentação ou qualquer necessidade durante sua viagem.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFCFF] border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-[#C8102E] flex items-center justify-center">
                <HeartHandshake size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Benefícios Corporativos</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Integração com o ambiente de convênios da sua empresa ou associação para usufruir de condições comerciais e vantagens exclusivas em reservas e pacotes selecionados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BANNER CONVÊNIOS E BENEFÍCIOS */}
      <section className="max-w-[1320px] mx-auto px-6 md:px-12">
        <div 
          className="rounded-3xl p-8 md:p-12 border border-amber-200 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #FFFDFB 0%, #FFF4E5 40%, #FFE9CC 100%)'
          }}
        >
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#DB8902] block">
              Para Colaboradores e Associados
            </span>
            <h3 className="text-2xl md:text-3xl font-display font-extrabold text-[#0F172A]">
              Sua empresa ou entidade tem convênio com a NC?
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Acesse o ambiente exclusivo <span className="font-semibold text-[#0F172A]">beneficios.ncturismo.com.br</span> e aproveite tarifas e condições diferenciadas para viagens de férias e lazer de toda a sua família.
            </p>
          </div>
          <button
            onClick={() => onOpenLegal('beneficios')}
            className="shrink-0 px-8 py-4 bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:brightness-105 transition-all shadow-xl shadow-red-500/20 cursor-pointer"
          >
            Conhecer Benefícios & Parcerias →
          </button>
        </div>
      </section>

    </div>
  );
};
