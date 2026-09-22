import React, { useState, useEffect } from 'react';
import { supabase, Post, Category, Author } from '../lib/supabase';
import { 
  Building2, 
  LogOut, 
  Plus, 
  Search, 
  FileText, 
  Eye, 
  Edit3, 
  Trash2, 
  Check, 
  Clock, 
  Calendar, 
  Sparkles,
  ArrowLeft,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FolderOpen,
  Copy,
  Database,
  ExternalLink
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  onBackToHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onBackToHome }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [tableMissing, setTableMissing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Form state
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    category_id: '',
    author_id: '',
    reading_time_minutes: 5,
    status: 'draft' as 'draft' | 'published',
    featured: false
  });

  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch categories
      const { data: cats } = await supabase.from('categories').select('*').order('name');
      if (cats && cats.length > 0) setCategories(cats);

      // 2. Fetch authors
      const { data: auts } = await supabase.from('authors').select('*').order('name');
      if (auts && auts.length > 0) setAuthors(auts);

      // 3. Fetch posts with category and author joins
      const { data: postList, error } = await supabase
        .from('posts')
        .select(`
          *,
          category:categories(*),
          author:authors(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Erro ao carregar posts (tabelas podem ainda estar sendo criadas):', error);
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table') || error.message?.includes('posts')) {
          setTableMissing(true);
        }
      } else if (postList) {
        setTableMissing(false);
        setPosts(postList);
      }
    } catch (err: any) {
      console.error('Falha geral ao buscar dados do Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug === '' || prev.slug === generateSlug(prev.title) ? generateSlug(title) : prev.slug
    }));
  };

  const handleNewPost = () => {
    setEditingPostId(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      cover_image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop',
      category_id: categories[0]?.id || '',
      author_id: authors[0]?.id || '',
      reading_time_minutes: 5,
      status: 'draft',
      featured: false
    });
    setPreviewMode(false);
    setIsEditing(true);
  };

  const handleEditPost = (post: Post) => {
    setEditingPostId(post.id);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.cover_image || '',
      category_id: post.category_id || '',
      author_id: post.author_id || '',
      reading_time_minutes: post.reading_time_minutes || 5,
      status: post.status,
      featured: post.featured || false
    });
    setPreviewMode(false);
    setIsEditing(true);
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Tem certeza de que deseja excluir este artigo? Esta ação não pode ser desfeita.')) return;
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
      setPosts(prev => prev.filter(p => p.id !== id));
      notify('Artigo excluído com sucesso.');
    } catch (err: any) {
      notify('Erro ao excluir artigo: ' + err.message, 'error');
    }
  };

  const handleSavePost = async (publishImmediate = false) => {
    if (!formData.title.trim()) {
      notify('Por favor, informe o título do artigo.', 'error');
      return;
    }
    if (!formData.slug.trim()) {
      notify('O slug do artigo não pode estar vazio.', 'error');
      return;
    }

    setSaving(true);
    const newStatus = publishImmediate ? 'published' : formData.status;

    const payload: any = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      excerpt: formData.excerpt.trim(),
      content: formData.content,
      cover_image: formData.cover_image.trim(),
      reading_time_minutes: Number(formData.reading_time_minutes) || 5,
      status: newStatus,
      featured: formData.featured,
      category_id: formData.category_id || null,
      author_id: formData.author_id || null,
      updated_at: new Date().toISOString()
    };

    if (newStatus === 'published' && !editingPostId) {
      payload.published_at = new Date().toISOString();
    }

    try {
      if (editingPostId) {
        const { error } = await supabase
          .from('posts')
          .update(payload)
          .eq('id', editingPostId);
        if (error) throw error;
        notify('Artigo atualizado com sucesso!');
      } else {
        payload.created_at = new Date().toISOString();
        const { error } = await supabase.from('posts').insert([payload]);
        if (error) throw error;
        notify('Novo artigo salvo com sucesso!');
      }

      setIsEditing(false);
      loadData();
    } catch (err: any) {
      console.error('Erro ao salvar:', err);
      if (err.code === 'PGRST205' || err.message?.includes('Could not find the table') || err.message?.includes('posts')) {
        setTableMissing(true);
        notify('A tabela "posts" ainda não foi criada no Supabase! Copie o script SQL no alerta no topo para criar com 1 clique.', 'error');
      } else {
        notify('Erro ao salvar no banco: ' + (err.message || 'Verifique se as tabelas foram criadas no Supabase.'), 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPublished = posts.filter(p => p.status === 'published').length;
  const totalDrafts = posts.filter(p => p.status === 'draft').length;

  return (
    <div className="min-h-screen bg-[#090b0e] text-nc-warm selection:bg-nc-orange selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#0c0e12]/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-nc-warm/70 hover:text-white transition-colors"
              title="Voltar ao portal público"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-nc-orange/20 border border-nc-orange/30 flex items-center justify-center text-nc-orange font-bold">
                <Building2 size={18} />
              </div>
              <div>
                <h1 className="text-sm md:text-base font-bold text-white tracking-tight flex items-center gap-2">
                  NC Turismo <span className="text-nc-orange font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-nc-orange/10 border border-nc-orange/20">Admin CMS</span>
                </h1>
                <p className="text-[11px] text-nc-warm/50">PostgreSQL Cloud via Supabase</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-2 text-nc-warm/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="Recarregar dados"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/10 hover:border-red-500/20 text-xs font-semibold transition-all"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Desconectar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl border text-xs md:text-sm font-medium flex items-center gap-3 transition-all ${
          notification.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200' 
            : 'bg-red-950/90 border-red-500/40 text-red-200'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-400" /> : <AlertTriangle size={18} className="text-red-400" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* SQL Migration Assistant Alert */}
      {tableMissing && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="bg-amber-950/40 border-2 border-amber-500/40 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Database size={24} />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                    Tabela "posts" não encontrada no Supabase (Erro PGRST205)
                  </h3>
                  <p className="text-xs md:text-sm text-nc-warm/80">
                    Para que você possa salvar os artigos, precisamos criar as tabelas no seu banco PostgreSQL.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const sql = `-- 1. Habilitar extensoes
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Categorias
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Autores
CREATE TABLE IF NOT EXISTS public.authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de Artigos do Blog (posts)
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  reading_time_minutes INT DEFAULT 5,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMP WITH TIME ZONE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Habilitar Seguranca por Linha (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 6. Politicas de Acesso
CREATE POLICY "Artigos publicados sao publicos" ON public.posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Categorias sao publicas" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Autores sao publicos" ON public.authors
  FOR SELECT USING (true);

CREATE POLICY "Admin controle total posts" ON public.posts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin controle total categorias" ON public.categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);`;
                    navigator.clipboard.writeText(sql);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 3000);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-nc-space hover:bg-amber-400 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  {copiedSql ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedSql ? 'SQL Copiado!' : 'Copiar Script SQL'}</span>
                </button>

                <a
                  href="https://supabase.com/dashboard/project/bfpwjtdhpxakarsjyklh/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <span>Abrir SQL Editor</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <p className="text-xs text-nc-warm/70 bg-black/40 p-4 rounded-xl border border-white/5 font-mono">
              Passo a passo rápido: 1. Clique em "Copiar Script SQL" acima ➔ 2. Clique em "Abrir SQL Editor" ➔ 3. Cole o script e clique em "Run". Depois basta clicar em recarregar esta tela!
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {isEditing ? (
          /* ==================== EDITOR DE ARTIGO ==================== */
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-nc-warm/70 hover:text-white transition-colors"
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {editingPostId ? 'Editar Artigo' : 'Criar Novo Artigo'}
                  </h2>
                  <p className="text-xs text-nc-warm/60">Configure o conteúdo, capa e metadados para publicação</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                    previewMode 
                      ? 'bg-nc-orange text-nc-space border-nc-orange' 
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  <Eye size={14} />
                  {previewMode ? 'Voltar à Edição' : 'Pré-visualizar Artigo'}
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSavePost(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Salvar Rascunho'}
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSavePost(true)}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-nc-orange text-nc-space hover:bg-opacity-90 text-xs font-bold shadow-lg shadow-nc-orange/20 transition-all disabled:opacity-50"
                >
                  <Sparkles size={14} />
                  {saving ? 'Publicando...' : 'Publicar Agora'}
                </button>
              </div>
            </div>

            {previewMode ? (
              /* LIVE PREVIEW SCREEN */
              <div className="bg-[#0c0e12] border border-white/10 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nc-orange/10 border border-nc-orange/20 text-nc-orange text-xs font-semibold">
                  Preview do Artigo Público
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                  {formData.title || 'Título do Artigo em Destaque'}
                </h1>
                <p className="text-base md:text-lg text-nc-warm/80 leading-relaxed font-light">
                  {formData.excerpt || 'Resumo introdutório que engaja o leitor corporativo...'}
                </p>

                {formData.cover_image && (
                  <div className="w-full h-80 rounded-2xl overflow-hidden border border-white/10">
                    <img 
                      src={formData.cover_image} 
                      alt="Capa" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className="flex items-center gap-6 py-4 border-y border-white/10 text-xs text-nc-warm/60">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-nc-orange" />
                    <span>{formData.reading_time_minutes} min de leitura</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-nc-orange" />
                    <span>Hoje</span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none text-nc-warm/90 leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {formData.content || 'Escreva o corpo do artigo na aba de edição para vê-lo formatado aqui...'}
                </div>
              </div>
            ) : (
              /* FORM EDITOR */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Fields */}
                <div className="lg:col-span-2 space-y-5">
                  <div className="bg-[#0c0e12] border border-white/10 rounded-2xl p-6 space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-nc-warm/70 mb-2">
                        Título do Artigo *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={handleTitleChange}
                        placeholder="Ex: 5 Estratégias para Reduzir Custos em Viagens Corporativas sem Perder Conforto"
                        className="w-full bg-[#13161c] border border-white/10 rounded-xl px-4 py-3 text-base font-medium text-white placeholder:text-nc-warm/30 focus:outline-none focus:border-nc-orange"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-nc-warm/70 mb-2">
                        Slug amigável (URL) *
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-nc-warm/40 font-mono">/blog/</span>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }))}
                          placeholder="como-reduzir-custos-viagens"
                          className="flex-1 bg-[#13161c] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-nc-orange focus:outline-none focus:border-nc-orange"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-nc-warm/70 mb-2">
                        Resumo / Subtítulo (Excerpt) *
                      </label>
                      <textarea
                        rows={2}
                        value={formData.excerpt}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        placeholder="Breve resumo para os cards de listagem e indexação do Google..."
                        className="w-full bg-[#13161c] border border-white/10 rounded-xl p-3 text-xs md:text-sm text-white placeholder:text-nc-warm/30 focus:outline-none focus:border-nc-orange"
                      />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="bg-[#0c0e12] border border-white/10 rounded-2xl p-6 space-y-3">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-nc-warm/70">
                        Corpo do Artigo (Texto Completo)
                      </label>
                      <span className="text-[11px] text-nc-warm/40">Suporta quebras de parágrafo e listas</span>
                    </div>
                    <textarea
                      rows={14}
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Comece a redigir o artigo para o portal corporativo..."
                      className="w-full bg-[#13161c] border border-white/10 rounded-xl p-4 text-sm font-sans text-white placeholder:text-nc-warm/30 focus:outline-none focus:border-nc-orange leading-relaxed"
                    />
                  </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                  {/* Image Cover */}
                  <div className="bg-[#0c0e12] border border-white/10 rounded-2xl p-6 space-y-4">
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-white">Imagem de Capa</h3>
                    {formData.cover_image ? (
                      <div className="relative rounded-xl overflow-hidden border border-white/10 h-36">
                        <img 
                          src={formData.cover_image} 
                          alt="Capa" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, cover_image: '' }))}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-red-500 text-white transition-colors text-xs"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="border border-dashed border-white/20 rounded-xl p-6 text-center text-xs text-nc-warm/50 flex flex-col items-center gap-2">
                        <UploadCloud size={24} className="text-nc-orange" />
                        <span>Cole o link da imagem abaixo</span>
                      </div>
                    )}

                    <div>
                      <input
                        type="url"
                        value={formData.cover_image}
                        onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-[#13161c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-nc-orange"
                      />
                    </div>
                  </div>

                  {/* Taxonomy & Status */}
                  <div className="bg-[#0c0e12] border border-white/10 rounded-2xl p-6 space-y-4">
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-white">Configurações & Publicação</h3>

                    <div>
                      <label className="block text-xs text-nc-warm/70 mb-1.5">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e: any) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full bg-[#13161c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-nc-orange"
                      >
                        <option value="draft">Rascunho (Privado)</option>
                        <option value="published">Publicado (Visível no site)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-nc-warm/70 mb-1.5">Tempo estimado de leitura (minutos)</label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={formData.reading_time_minutes}
                        onChange={(e) => setFormData(prev => ({ ...prev, reading_time_minutes: Number(e.target.value) }))}
                        className="w-full bg-[#13161c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-nc-orange"
                      />
                    </div>

                    <label className="flex items-center gap-2.5 cursor-pointer pt-2">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="w-4 h-4 rounded text-nc-orange bg-black border-white/20 focus:ring-0"
                      />
                      <span className="text-xs text-white font-medium">Destacar no topo do Blog</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ==================== LISTAGEM DE ARTIGOS ==================== */
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#0c0e12] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-nc-warm/50 font-semibold block mb-1">
                    Artigos Publicados
                  </span>
                  <span className="text-2xl font-bold text-white">{totalPublished}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check size={20} />
                </div>
              </div>

              <div className="bg-[#0c0e12] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-nc-warm/50 font-semibold block mb-1">
                    Rascunhos em Edição
                  </span>
                  <span className="text-2xl font-bold text-white">{totalDrafts}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Edit3 size={18} />
                </div>
              </div>

              <div className="bg-[#0c0e12] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-nc-warm/50 font-semibold block mb-1">
                    Total no Supabase
                  </span>
                  <span className="text-2xl font-bold text-white">{posts.length}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-nc-orange/10 border border-nc-orange/20 text-nc-orange flex items-center justify-center">
                  <FolderOpen size={20} />
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-stretch sm:items-center bg-[#0c0e12] border border-white/10 p-4 rounded-2xl">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-nc-warm/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por título ou resumo..."
                    className="w-full bg-[#13161c] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs md:text-sm text-white placeholder:text-nc-warm/30 focus:outline-none focus:border-nc-orange"
                  />
                </div>

                <div className="flex items-center gap-1 bg-[#13161c] p-1 rounded-xl border border-white/5 text-xs">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${filterStatus === 'all' ? 'bg-white/10 text-white font-semibold' : 'text-nc-warm/60'}`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setFilterStatus('published')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${filterStatus === 'published' ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-nc-warm/60'}`}
                  >
                    Publicados
                  </button>
                  <button
                    onClick={() => setFilterStatus('draft')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${filterStatus === 'draft' ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'text-nc-warm/60'}`}
                  >
                    Rascunhos
                  </button>
                </div>
              </div>

              <button
                onClick={handleNewPost}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-nc-orange text-nc-space hover:bg-opacity-95 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-nc-orange/15"
              >
                <Plus size={16} />
                <span>Novo Artigo</span>
              </button>
            </div>

            {/* Posts Table / Cards */}
            {loading ? (
              <div className="py-20 text-center space-y-3">
                <RefreshCw size={24} className="animate-spin mx-auto text-nc-orange" />
                <p className="text-xs text-nc-warm/60">Carregando artigos do Supabase...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="py-20 text-center bg-[#0c0e12] border border-white/10 rounded-3xl p-8 space-y-4">
                <FileText size={36} className="mx-auto text-nc-warm/20" />
                <h3 className="text-base font-bold text-white">Nenhum artigo encontrado</h3>
                <p className="text-xs text-nc-warm/60 max-w-md mx-auto">
                  {posts.length === 0 
                    ? 'Seu banco de dados do Supabase ainda não possui artigos cadastrados. Clique no botão acima para criar seu primeiro post!' 
                    : 'Nenhum resultado corresponde à sua pesquisa com os filtros atuais.'}
                </p>
                {posts.length === 0 && (
                  <button
                    onClick={handleNewPost}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-nc-orange text-nc-space text-xs font-bold uppercase tracking-wider"
                  >
                    <Plus size={16} />
                    Criar primeiro artigo
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-[#0c0e12] border border-white/10 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs md:text-sm">
                    <thead className="bg-[#13161c] text-nc-warm/60 uppercase tracking-wider text-[11px] border-b border-white/10">
                      <tr>
                        <th className="py-4 px-6">Artigo</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-4">Tempo Leitura</th>
                        <th className="py-4 px-4">Data</th>
                        <th className="py-4 px-6 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {post.cover_image && (
                                <img
                                  src={post.cover_image}
                                  alt=""
                                  className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                              )}
                              <div className="min-w-0">
                                <h4 className="font-bold text-white group-hover:text-nc-orange transition-colors truncate max-w-md">
                                  {post.title}
                                </h4>
                                <span className="text-[11px] text-nc-warm/50 font-mono">
                                  /blog/{post.slug}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                              post.status === 'published'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${post.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                              {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-nc-warm/70">
                            {post.reading_time_minutes} min
                          </td>
                          <td className="py-4 px-4 text-nc-warm/60 text-xs">
                            {post.created_at ? new Date(post.created_at).toLocaleDateString('pt-BR') : '-'}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditPost(post)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-nc-orange hover:text-nc-space text-nc-warm/80 transition-colors"
                                title="Editar artigo"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-red-500 hover:text-white text-nc-warm/80 transition-colors"
                                title="Excluir artigo"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
