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
    <div className="min-h-screen bg-[#090b0e] text-nc-warm selection:bg-nc-orange selection:text-white pt-28 pb-24">
      {/* Top Breadcrumbs */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 mb-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3 text-xs uppercase tracking-wider font-semibold">
            <button 
              onClick={onBackToHome}
              className="text-nc-warm/60 hover:text-white transition-colors"
            >
              Início
            </button>
            <ChevronRight size={14} className="text-nc-warm/30" />
            <span className="text-nc-orange">Centro de Conhecimento NC</span>
          </div>

          <a 
            href="#admin" 
            className="text-[11px] text-nc-warm/40 hover:text-nc-orange transition-colors flex items-center gap-1"
          >
            <span>Acesso Redação</span>
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 mb-12">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-nc-orange/10 border border-nc-orange/20 text-nc-orange text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={14} />
            NC Knowledge Hub · We Are Travel &amp; Expense
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Centro de Conhecimento <span className="text-nc-orange">&amp; Artigos</span>
          </h1>
          <p className="text-nc-warm/80 text-base md:text-lg leading-relaxed font-light">
            Insights estratégicos, governança, SLA e as melhores práticas para diretores financeiros, gestores de viagens e lideranças de compras.
          </p>
        </div>
      </div>

      {/* Featured Big Article Card (Visual inspirado na referência com gradiente e barra superior) */}
      {featuredPost && (
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
          <div 
            onClick={() => onSelectPost(featuredPost.slug)}
            className="cursor-pointer group relative rounded-[22px] border border-white/10 hover:border-nc-orange/50 transition-all p-8 md:p-14 shadow-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #151515 0%, #241717 55%, #3a2112 100%)'
            }}
          >
            {/* Top Bar Indicator */}
            <div 
              className="w-[76px] h-[4px] rounded-full mb-6"
              style={{ background: 'linear-gradient(90deg, #bd0f0f, #f28c28)' }}
            />

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span 
                className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: 'rgba(242, 140, 40, 0.12)',
                  color: '#f28c28',
                  border: '1px solid rgba(242, 140, 40, 0.35)'
                }}
              >
                Artigo em Destaque
              </span>
              <span className="text-xs text-nc-warm/60">
                {featuredPost.category?.name || 'Atendimento e Governança'}
              </span>
            </div>

            <h2 className="text-2xl md:text-4xl lg:text-[40px] font-bold text-white group-hover:text-nc-orange transition-colors leading-[1.15] mb-4 max-w-4xl">
              {featuredPost.title}
            </h2>

            <p className="text-nc-warm/80 text-sm md:text-base leading-relaxed max-w-3xl mb-8 font-light">
              {featuredPost.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs md:text-sm text-nc-warm/60">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2">
                  <Clock size={15} className="text-nc-orange" />
                  {featuredPost.reading_time_minutes || 7} min de leitura
                </span>
                <span className="flex items-center gap-2">
                  <Building2 size={15} className="text-nc-orange" />
                  Por NC Turismo
                </span>
              </div>

              <div className="inline-flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider group-hover:text-nc-orange transition-colors">
                <span>Ler artigo completo</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-nc-orange" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 mb-10">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#12141a] border border-white/10 p-4 rounded-2xl">
          {/* Categories Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-nc-orange text-nc-space font-bold shadow-md'
                    : 'text-nc-warm/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-nc-warm/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar artigos..."
              className="w-full bg-[#181a20] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs md:text-sm text-white placeholder:text-nc-warm/30 focus:outline-none focus:border-nc-orange transition-colors"
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
              className="cursor-pointer group bg-[#12141a] hover:bg-[#161820] border border-white/10 hover:border-nc-orange/40 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col shadow-lg"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={art.cover_image || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop'}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-nc-orange border border-white/10">
                  {art.category?.name || 'Conhecimento'}
                </div>
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-nc-warm/50 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-nc-orange" />
                      {art.reading_time_minutes || 5} min
                    </span>
                    <span>•</span>
                    <span>
                      {art.published_at 
                        ? new Date(art.published_at).toLocaleDateString('pt-BR') 
                        : 'Setembro 2026'}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-nc-orange transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs md:text-sm text-nc-warm/70 leading-relaxed font-light line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-nc-orange">
                  <span>Acessar artigo</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
