import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  BookOpen
} from 'lucide-react';
import { supabase, Post } from '../lib/supabase';
import { SocialShareBar } from './SocialShareBar';

interface BlogListingViewProps {
  onSelectPost: (slug: string) => void;
  onBackToHome: () => void;
}

export const BlogListingView: React.FC<BlogListingViewProps> = ({ 
  onSelectPost, 
  onBackToHome 
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Hardcoded flagship post from user reference as fallback/flagship
  const fallbackFlagship: Post = {
    id: 'post-sla-flagship',
    title: 'SLA e suporte em viagens corporativas: por que atendimento ainda importa',
    slug: 'sla-suporte-viagens-corporativas-atendimento',
    excerpt: 'Mesmo em operações digitalizadas, viagens corporativas ainda exigem resposta, orientação e suporte quando algo sai do planejado.',
    content: '',
    category_id: null,
    author_id: null,
    cover_image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop',
    reading_time_minutes: 7,
    status: 'published',
    published_at: '2026-09-21T12:00:00Z',
    featured: true,
    created_at: '2026-09-21T12:00:00Z',
    updated_at: '2026-09-21T12:00:00Z',
    category: {
      id: 'cat-1',
      name: 'Atendimento e Governança',
      slug: 'atendimento-e-governanca',
      created_at: '2026-09-21T12:00:00Z'
    }
  };

  const fallbackAdditionalPosts: Post[] = [
    {
      id: 'post-2',
      slug: 'como-reduzir-custos-politica-viagens',
      title: '5 Estratégias para Reduzir Custos de Viagens Corporativas sem Perder Agilidade',
      excerpt: 'Como estruturar janelas de antecedência, acordos corporativos e políticas dinâmicas para gerar até 25% de saving real no orçamento anual.',
      content: '',
      category_id: null,
      author_id: null,
      cover_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
      reading_time_minutes: 5,
      status: 'published',
      published_at: '2026-09-18T10:00:00Z',
      featured: false,
      created_at: '2026-09-18T10:00:00Z',
      updated_at: '2026-09-18T10:00:00Z',
      category: {
        id: 'cat-2',
        name: 'Gestão e Custos',
        slug: 'gestao-e-custos',
        created_at: '2026-09-18T10:00:00Z'
      }
    },
    {
      id: 'post-3',
      slug: 'duty-of-care-seguranca-viajante',
      title: 'Duty of Care na Prática: A Responsabilidade Corporativa com Colaboradores em Deslocamento',
      excerpt: 'Entenda os aspectos jurídicos, operacionais e de gestão de riscos fundamentais para proteger equipes em viagens nacionais e internacionais.',
      content: '',
      category_id: null,
      author_id: null,
      cover_image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200&auto=format&fit=crop',
      reading_time_minutes: 6,
      status: 'published',
      published_at: '2026-09-15T10:00:00Z',
      featured: false,
      created_at: '2026-09-15T10:00:00Z',
      updated_at: '2026-09-15T10:00:00Z',
      category: {
        id: 'cat-3',
        name: 'Segurança e Riscos',
        slug: 'seguranca-e-riscos',
        created_at: '2026-09-15T10:00:00Z'
      }
    }
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            category:categories(*),
            author:authors(*)
          `)
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (error) {
          console.warn('Usando artigos estáticos de referência:', error);
          setPosts([fallbackFlagship, ...fallbackAdditionalPosts]);
        } else if (data && data.length > 0) {
          // Check if user's db already contains the SLA post, otherwise merge fallback
          const hasSla = data.some(p => p.slug === fallbackFlagship.slug);
          if (!hasSla) {
            setPosts([fallbackFlagship, ...data]);
          } else {
            setPosts(data);
          }
        } else {
          setPosts([fallbackFlagship, ...fallbackAdditionalPosts]);
        }
      } catch (err) {
        setPosts([fallbackFlagship, ...fallbackAdditionalPosts]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const categories = [
    { id: 'todos', name: 'Todos os Artigos' },
    { id: 'Atendimento e Governança', name: 'Atendimento & Governança' },
    { id: 'Gestão e Custos', name: 'Gestão & Custos' },
    { id: 'Segurança e Riscos', name: 'Segurança & Riscos' }
  ];

  const filteredPosts = posts.filter(post => {
    const titleMatch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const excerptMatch = post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const catName = post.category?.name || 'Geral';
    const categoryMatch = selectedCategory === 'todos' || catName === selectedCategory;
    return (titleMatch || excerptMatch) && categoryMatch;
  });

  const featuredPost = filteredPosts.find(p => p.featured) || filteredPosts[0] || fallbackFlagship;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#C8102E] selection:text-white pt-28 pb-24 relative overflow-hidden">
      {/* Soft ambient warm atmospheric glows - subtle, soft, zero visual fatigue */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-red-100/30 via-orange-50/20 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 right-0 w-[500px] h-[500px] bg-gradient-to-l from-amber-100/25 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Breadcrumbs */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 mb-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3 text-xs uppercase tracking-wider font-semibold">
            <button 
              onClick={onBackToHome}
              className="text-slate-500 hover:text-[#C8102E] transition-colors cursor-pointer"
            >
              Início
            </button>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-[#C8102E] font-bold">Centro de Conhecimento NC</span>
          </div>

          <a 
            href="#admin" 
            className="text-[11px] text-slate-500 hover:text-[#C8102E] transition-colors flex items-center gap-1 font-medium bg-white px-3 py-1.5 rounded-full border border-slate-200/80 shadow-2xs hover:border-red-200"
          >
            <span>Acesso Redação</span>
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 mb-12">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 border border-red-200/80 text-[#C8102E] text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles size={14} className="text-[#DB8902]" />
            NC Knowledge Hub · We Are Travel &amp; Expense
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#0F172A] tracking-tight leading-[1.1]">
            Centro de Conhecimento <span className="bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] bg-clip-text text-transparent">&amp; Artigos</span>
          </h1>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed font-normal">
            Insights estratégicos, governança, SLA e as melhores práticas para diretores financeiros, gestores de viagens e lideranças de compras.
          </p>
        </div>
      </div>

      {/* Featured Big Article Card (Visual com harmonia quente editorial, vibrante e acolhedor) */}
      {featuredPost && (
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
          <div 
            onClick={() => onSelectPost(featuredPost.slug)}
            className="cursor-pointer group relative rounded-[28px] border border-red-200/80 hover:border-red-300 transition-all p-8 md:p-14 shadow-lg shadow-red-500/5 hover:shadow-2xl hover:shadow-red-500/10 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFDFB 40%, #FFF6EE 100%)'
            }}
          >
            {/* Top Bar Indicator */}
            <div 
              className="w-[88px] h-[5px] rounded-full mb-6"
              style={{ background: 'linear-gradient(90deg, #C8102E, #DB8902)' }}
            />

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span 
                className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-red-50 to-orange-50 text-[#C8102E] border border-red-200/90 shadow-2xs"
              >
                Artigo em Destaque
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {featuredPost.category?.name || 'Atendimento e Governança'}
              </span>
            </div>

            <h2 className="text-2xl md:text-4xl lg:text-[40px] font-bold text-[#0F172A] group-hover:text-[#C8102E] transition-colors leading-[1.15] mb-4 max-w-4xl">
              {featuredPost.title}
            </h2>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-3xl mb-8 font-normal">
              {featuredPost.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200/80 text-xs md:text-sm text-slate-500">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2 font-medium">
                  <Clock size={15} className="text-[#DB8902]" />
                  {featuredPost.reading_time_minutes || 7} min de leitura
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <Building2 size={15} className="text-[#C8102E]" />
                  Por NC Turismo
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="hidden sm:flex items-center gap-2"
                >
                  <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Compartilhar:</span>
                  <SocialShareBar
                    url={typeof window !== 'undefined' ? `${window.location.origin}/#blog/${featuredPost.slug}` : undefined}
                    title={featuredPost.title}
                    summary={featuredPost.excerpt}
                    variant="compact"
                  />
                </div>

                <div className="inline-flex items-center gap-2 text-[#0F172A] font-bold text-xs uppercase tracking-wider group-hover:text-[#C8102E] transition-colors">
                  <span>Ler artigo</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-[#C8102E]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 mb-10">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white/95 backdrop-blur-sm border border-slate-200/90 p-3.5 rounded-2xl shadow-sm">
          {/* Categories Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#C8102E] to-[#B8001F] text-white font-bold shadow-md shadow-red-500/25 border border-transparent'
                    : 'bg-slate-50/80 hover:bg-red-50/50 border border-slate-200/80 hover:border-red-200 text-slate-600 hover:text-[#C8102E]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[270px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar artigos..."
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#C8102E] focus:bg-white focus:ring-2 focus:ring-red-100 shadow-2xs transition-all"
            />
          </div>
        </div>
      </div>

      {/* Grid of Articles */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((art) => (
            <div
              key={art.id}
              onClick={() => onSelectPost(art.slug)}
              className="cursor-pointer group bg-white border border-slate-200/90 hover:border-red-300 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col shadow-sm hover:shadow-xl hover:shadow-red-500/5 hover:-translate-y-1"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={art.cover_image || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop'}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-bold text-[#C8102E] border border-red-100 shadow-xs">
                  {art.category?.name || 'Conhecimento'}
                </div>
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-[#DB8902]" />
                      {art.reading_time_minutes || 5} min
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>
                      {art.published_at 
                        ? new Date(art.published_at).toLocaleDateString('pt-BR') 
                        : 'Setembro 2026'}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-[#0F172A] group-hover:text-[#C8102E] transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center"
                  >
                    <SocialShareBar
                      url={typeof window !== 'undefined' ? `${window.location.origin}/#blog/${art.slug}` : undefined}
                      title={art.title}
                      summary={art.excerpt}
                      variant="compact"
                    />
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8102E] group-hover:text-[#9E0A22] transition-colors shrink-0">
                    <span>Ler</span>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
