import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bfpwjtdhpxakarsjyklh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmcHdqdGRocHhha2Fyc2p5a2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5ODk2NTAsImV4cCI6MjEwNTU2NTY1MH0.lkrwOcej-nkAsy2WeHoXRP7czGa1xSvVnxsd7mLDt3U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface Author {
  id: string;
  name: string;
  role: string;
  avatar_url?: string;
  created_at?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  reading_time_minutes: number;
  status: 'draft' | 'published';
  published_at?: string;
  category_id?: string;
  author_id?: string;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
  // Joins
  category?: Category;
  author?: Author;
}

export interface TermsAcceptance {
  id: string;
  document_version: string;
  accepted_at: string;
  user_agent: string;
  ip_address?: string;
  target_url: string;
  source: string;
}

export const recordTermsAcceptance = async (acceptance: Omit<TermsAcceptance, 'id'>): Promise<TermsAcceptance> => {
  const localRecord: TermsAcceptance = {
    id: `acc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    ...acceptance,
  };

  // 1. Always save to localStorage for client-side audit durability
  try {
    const existing = JSON.parse(localStorage.getItem('nc_terms_acceptances') || '[]');
    localStorage.setItem('nc_terms_acceptances', JSON.stringify([localRecord, ...existing]));
    localStorage.setItem('nc_current_accepted_version', acceptance.document_version);
    localStorage.setItem('nc_last_accepted_at', acceptance.accepted_at);
  } catch (e) {
    console.error('Erro ao salvar aceite em localStorage:', e);
  }

  // 2. Also try to persist in Supabase if table exists
  try {
    const { error } = await supabase
      .from('terms_acceptances')
      .insert([localRecord]);
    if (error) {
      console.warn('Registro no Supabase (aviso de tabela/schema):', error.message);
    }
  } catch (err) {
    console.warn('Erro ao persistir no Supabase:', err);
  }

  return localRecord;
};

export const getTermsAcceptances = async (): Promise<TermsAcceptance[]> => {
  // Try Supabase first
  try {
    const { data, error } = await supabase
      .from('terms_acceptances')
      .select('*')
      .order('accepted_at', { ascending: false });
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {
    // ignore
  }

  // Fallback to localStorage
  try {
    return JSON.parse(localStorage.getItem('nc_terms_acceptances') || '[]');
  } catch {
    return [];
  }
};

// ==========================================
// MÓDULO DE LAZER & PROMOÇÕES DE VIAGEM
// ==========================================

export type LazerCategory = 'pacotes' | 'cruzeiros' | 'internacional' | 'nacional' | 'resorts' | 'promocoes';

export interface LazerPackage {
  id: string;
  title: string;
  destination: string;
  category: LazerCategory;
  category_label: string;
  cover_image: string;
  gallery_images?: string[];
  price_from: number;
  price_original?: number;
  installment_text: string; // Ex: "10x de R$ 389 sem juros"
  departure_dates: string; // Ex: "Outubro a Dezembro 2026" ou "Saída 15/11/2026"
  valid_until?: string; // Data limite da promoção
  duration_days: number;
  nights: number;
  status: 'active' | 'draft';
  badge?: string; // Ex: "Mais Procurado", "All-Inclusive", "Super Promoção", "Cruzeiro Exclusivo"
  included_items: string[]; // Ex: ["Passagem Aérea", "Hospedagem 4 estrelas", "Café da manhã", "Transfer privativo"]
  description: string;
  itinerary?: { day: string; title: string; desc: string }[];
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const INITIAL_LAZER_PACKAGES: LazerPackage[] = [
  {
    id: 'lazer-cruzeiro-costa-sul',
    title: 'Cruzeiro Costa Brasileira · Sol & Brisa dos Mares',
    destination: 'Santos, Ilhabela, Rio de Janeiro e Búzios',
    category: 'cruzeiros',
    category_label: 'Cruzeiros Marítimos',
    cover_image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=800&q=80'
    ],
    price_from: 3290,
    price_original: 4190,
    installment_text: '10x de R$ 329 sem juros',
    departure_dates: 'Novembro 2026 a Março 2027 (Saídas semanais)',
    valid_until: '2026-12-30',
    duration_days: 8,
    nights: 7,
    status: 'active',
    badge: 'Pensão Completa',
    included_items: [
      'Cabine externa com vista para o mar',
      'Todas as refeições a bordo inclusas',
      'Shows teatrais estilo Broadway e entretenimento',
      'Taxas portuárias e de serviços inclusas'
    ],
    description: 'Navegue pelas praias mais cobiçadas do litoral brasileiro com todo o conforto de um transatlântico moderno. Piscinas, gastronomia internacional e momentos inesquecíveis.',
    featured: true
  },
  {
    id: 'lazer-mendoza-santiago',
    title: 'Santiago & Rota dos Vinhos em Mendoza',
    destination: 'Chile & Argentina · Cordilheira dos Andes',
    category: 'internacional',
    category_label: 'Internacional',
    cover_image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&w=800&q=80'
    ],
    price_from: 4890,
    price_original: 5690,
    installment_text: '10x de R$ 489 sem juros',
    departure_dates: 'Saídas em Outubro e Novembro 2026',
    valid_until: '2026-11-20',
    duration_days: 7,
    nights: 6,
    status: 'active',
    badge: 'Experiência Gastronômica',
    included_items: [
      'Aéreo de ida e volta saindo de Curitiba ou SP',
      'Hospedagem em hotéis boutique 4 estrelas',
      'Degustação em 3 vinícolas premium com almoço harmonizado',
      'Guia bilíngue privativo e transfers executivos'
    ],
    description: 'Uma combinação sublime entre a modernidade de Santiago e os vinhedos aos pés da imponente Cordilheira dos Andes em Mendoza. Degustações exclusivas de Malbec e Carmenère.',
    featured: true
  },
  {
    id: 'lazer-resort-praia-forte',
    title: 'Resort All-Inclusive na Praia do Forte',
    destination: 'Litoral Norte da Bahia · Brasil',
    category: 'resorts',
    category_label: 'Resorts & Praias',
    cover_image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    price_from: 3950,
    price_original: 4700,
    installment_text: '10x de R$ 395 sem juros',
    departure_dates: 'Férias de Verão · Dezembro 2026 e Janeiro 2027',
    valid_until: '2026-12-15',
    duration_days: 6,
    nights: 5,
    status: 'active',
    badge: 'All-Inclusive Premium',
    included_items: [
      'Refeições e bebidas (alcoólicas e não alcoólicas) liberadas',
      'Complexo de piscinas de frente para a praia',
      'Passeio às piscinas naturais e Projeto Tamar',
      'Transfer privativo aeroporto de Salvador / Resort'
    ],
    description: 'Estrutura paradisíaca pé na areia com piscinas de borda infinita, gastronomia baiana e internacional sem limite de consumo e recreação completa para toda a família.',
    featured: true
  },
  {
    id: 'lazer-lisboa-porto',
    title: 'Portugal Autêntico: Lisboa, Sintra, Coimbra & Porto',
    destination: 'Portugal · Rota Histórica',
    category: 'internacional',
    category_label: 'Internacional',
    cover_image: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=1200&q=80',
    price_from: 7990,
    price_original: 9400,
    installment_text: '10x de R$ 799 sem juros',
    departure_dates: 'Primavera e Outono Europeu · Março a Maio 2027',
    valid_until: '2027-01-31',
    duration_days: 10,
    nights: 9,
    status: 'active',
    badge: 'Roteiro Clássico',
    included_items: [
      'Passagem aérea internacional ida e volta',
      'Hotéis selecionados com café da manhã diário',
      'Trem de alta velocidade Lisboa / Porto em primeira classe',
      'Passeio de barco Rabelo no Rio Douro com prova de Vinhos'
    ],
    description: 'Descubra a história dos navegadores, as ruelas de Alfama, os palácios de Sintra e as caves centenárias do Douro com assessoria e conforto incomparáveis.',
    featured: false
  },
  {
    id: 'lazer-foz-iguacu-boutique',
    title: 'Foz do Iguaçu Vip: Cataratas, Parque das Aves & Itaipu',
    destination: 'Paraná · Tríplice Fronteira',
    category: 'nacional',
    category_label: 'Nacional',
    cover_image: 'https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?auto=format&fit=crop&w=1200&q=80',
    price_from: 1890,
    price_original: 2450,
    installment_text: '10x de R$ 189 sem juros',
    departure_dates: 'Finais de semana e feriados 2026 / 2027',
    valid_until: '2026-12-20',
    duration_days: 4,
    nights: 3,
    status: 'active',
    badge: 'Super Promoção',
    included_items: [
      'Ingressos sem fila para as Cataratas do Iguaçu',
      'Hotel com parque aquático e piscinas aquecidas',
      'Jantar show com churrascaria tradicional',
      'Transfer in/out aeroporto de Foz do Iguaçu'
    ],
    description: 'Uma das Sete Maravilhas da Natureza em pacote sob medida com saídas confortáveis de Curitiba ou outras capitais. Ideal para uma escapada revigorante.',
    featured: false
  },
  {
    id: 'lazer-cancun-tulum',
    title: 'Caribe Mexicano: Cancún, Tulum & Ilha Cozumel',
    destination: 'México · Mar do Caribe',
    category: 'promocoes',
    category_label: 'Promoção Exclusiva',
    cover_image: 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=1200&q=80',
    price_from: 5690,
    price_original: 6990,
    installment_text: '10x de R$ 569 sem juros',
    departure_dates: 'Datas Flexíveis · Novembro 2026 a Junho 2027',
    valid_until: '2026-11-30',
    duration_days: 8,
    nights: 7,
    status: 'active',
    badge: 'Tarifa Especial',
    included_items: [
      'Passagem aérea com bagagem inclusa',
      'Resort 5 estrelas em Cancún com praia privada',
      'Excursão guiada às ruínas maias de Tulum',
      'Seguro viagem internacional com cobertura completa'
    ],
    description: 'Águas cristalinas em tons azul-turquesa, areias brancas, sítios arqueológicos misteriosos e a melhor hotelaria de praia das Américas.',
    featured: true
  }
];

const LAZER_STORAGE_KEY = 'nc_lazer_packages';
const LAZER_STORAGE_INIT_FLAG = 'nc_lazer_packages_initialized_v2';

export const getLazerPackages = async (): Promise<LazerPackage[]> => {
  // 1. Tenta carregar do Supabase caso a tabela exista
  try {
    const { data, error } = await supabase
      .from('lazer_packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      localStorage.setItem(LAZER_STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(LAZER_STORAGE_INIT_FLAG, 'true');
      return data as LazerPackage[];
    }
  } catch (e) {
    // continua para o fallback local
  }

  // 2. Se já inicializamos localmente, respeita estritamente o que o usuário alterou no cache
  try {
    const cached = localStorage.getItem(LAZER_STORAGE_KEY);
    const hasInitialized = localStorage.getItem(LAZER_STORAGE_INIT_FLAG);
    if (cached && hasInitialized) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        return parsed as LazerPackage[];
      }
    }
  } catch (e) {
    // continua para inicial
  }

  // 3. Primeira execução: semeia os pacotes padrão e marca a flag de inicializado
  try {
    localStorage.setItem(LAZER_STORAGE_KEY, JSON.stringify(INITIAL_LAZER_PACKAGES));
    localStorage.setItem(LAZER_STORAGE_INIT_FLAG, 'true');
  } catch (e) {
    // ignore
  }
  return INITIAL_LAZER_PACKAGES;
};

export const saveLazerPackage = async (pkg: LazerPackage): Promise<LazerPackage> => {
  const currentPackages = await getLazerPackages();
  const exists = currentPackages.some(p => p.id === pkg.id);
  
  let updatedList: LazerPackage[];
  if (exists) {
    updatedList = currentPackages.map(p => p.id === pkg.id ? { ...p, ...pkg, updated_at: new Date().toISOString() } : p);
  } else {
    updatedList = [{ ...pkg, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, ...currentPackages];
  }

  // Salva no cache do localStorage com a flag de inicializado
  try {
    localStorage.setItem(LAZER_STORAGE_KEY, JSON.stringify(updatedList));
    localStorage.setItem(LAZER_STORAGE_INIT_FLAG, 'true');
    // Dispara evento customizado para sincronizar componentes na mesma aba
    window.dispatchEvent(new Event('nc_lazer_updated'));
  } catch (err) {
    console.error('Erro ao salvar no localStorage:', err);
  }

  // Tenta persistir no Supabase (se a tabela existir)
  try {
    const { error } = await supabase
      .from('lazer_packages')
      .upsert(pkg, { onConflict: 'id' });
    if (error) {
      console.warn('Aviso ao sincronizar pacote no Supabase:', error.message);
    }
  } catch (err) {
    console.warn('Erro ao conectar ao Supabase para pacote:', err);
  }

  return pkg;
};

export const deleteLazerPackage = async (id: string): Promise<boolean> => {
  const currentPackages = await getLazerPackages();
  const updatedList = currentPackages.filter(p => p.id !== id);

  try {
    localStorage.setItem(LAZER_STORAGE_KEY, JSON.stringify(updatedList));
    localStorage.setItem(LAZER_STORAGE_INIT_FLAG, 'true');
    window.dispatchEvent(new Event('nc_lazer_updated'));
  } catch (e) {
    console.error(e);
  }

  try {
    await supabase.from('lazer_packages').delete().eq('id', id);
  } catch (e) {
    // ignora
  }

  return true;
};

// ==========================================
// MÓDULO DE LEADS & PARCERIAS (NC PARTNERS)
// ==========================================

export interface LeadParceria {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  cargo?: string;
  interesse: string;
  tipo_organizacao?: string;
  publico_beneficiado?: string;
  quantidade_pessoas?: string;
  origem_pagina?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  privacidade_aceita?: boolean;
  status: 'novo' | 'em_contato' | 'proposta_enviada' | 'convertido' | 'descartado';
  observacoes?: string;
  created_at: string;
  updated_at?: string;
}

export interface EmpresaConveniada {
  id: string;
  nome: string;
  cnpj?: string;
  codigo_acesso: string; // Ex: 'NC-TURISMO-VIP'
  dominio_email?: string;
  desconto_percentual?: number;
  tipo: 'empresa' | 'associacao' | 'cooperativa' | 'federacao' | 'outro';
  ativa: boolean;
  total_beneficiados_estimado?: number;
  contato_rh_nome?: string;
  contato_rh_email?: string;
  contato_rh_telefone?: string;
  created_at: string;
  updated_at?: string;
}

export interface SolicitacaoCodigo {
  id: string;
  nome_colaborador: string;
  email_corporativo: string;
  telefone?: string;
  nome_empresa: string;
  empresa_id?: string;
  status: 'pendente' | 'atendido' | 'invalido';
  created_at: string;
}

const LEADS_STORAGE_KEY = 'nc_leads_parcerias';
const EMPRESAS_STORAGE_KEY = 'nc_empresas_conveniadas';
const SOLICITACOES_STORAGE_KEY = 'nc_solicitacoes_codigo';

export const INITIAL_EMPRESAS_CONVENIADAS: EmpresaConveniada[] = [
  {
    id: 'emp-nc-turismo',
    nome: 'NC Turismo (Institucional)',
    codigo_acesso: 'NC-TURISMO-OFICIAL',
    tipo: 'empresa',
    ativa: true,
    desconto_percentual: 0,
    total_beneficiados_estimado: 50,
    created_at: '2026-01-01T00:00:00Z'
  }
];

// -------------------------------------------------------------
// OPERAÇÕES DE LEADS DE PARCERIA
// -------------------------------------------------------------

export const saveLeadParceria = async (leadData: Omit<LeadParceria, 'id' | 'created_at' | 'status'> & { status?: LeadParceria['status'] }): Promise<LeadParceria> => {
  const newLead: LeadParceria = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ...leadData,
    status: leadData.status || 'novo',
    created_at: new Date().toISOString()
  };

  // 1. Persistência local imediata
  try {
    const existing = JSON.parse(localStorage.getItem(LEADS_STORAGE_KEY) || '[]');
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify([newLead, ...existing]));
    window.dispatchEvent(new Event('nc_leads_updated'));
  } catch (e) {
    console.error('Erro ao salvar lead no localStorage:', e);
  }

  // 2. Persistência no Supabase
  try {
    const { error } = await supabase.from('leads_parcerias').insert([{
      nome: newLead.nome,
      email: newLead.email,
      telefone: newLead.telefone,
      empresa: newLead.empresa,
      cargo: newLead.cargo,
      interesse: newLead.interesse,
      tipo_organizacao: newLead.tipo_organizacao,
      publico_beneficiado: newLead.publico_beneficiado,
      quantidade_pessoas: newLead.quantidade_pessoas,
      origem_pagina: newLead.origem_pagina,
      utm_source: newLead.utm_source,
      utm_medium: newLead.utm_medium,
      utm_campaign: newLead.utm_campaign,
      utm_term: newLead.utm_term,
      utm_content: newLead.utm_content,
      privacidade_aceita: newLead.privacidade_aceita ?? true,
      status: newLead.status,
      created_at: newLead.created_at
    }]);

    if (error) {
      console.warn('Aviso ao sincronizar lead no Supabase:', error.message);
    }
  } catch (err) {
    console.warn('Erro ao conectar ao Supabase para lead:', err);
  }

  return newLead;
};

export const getLeadsParcerias = async (): Promise<LeadParceria[]> => {
  // 1. Tenta Supabase
  try {
    const { data, error } = await supabase
      .from('leads_parcerias')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      // Normaliza campos caso o banco use snake_case
      const formatted: LeadParceria[] = data.map((d: any) => ({
        id: d.id,
        nome: d.nome,
        email: d.email,
        telefone: d.telefone,
        empresa: d.empresa,
        cargo: d.cargo,
        interesse: d.interesse,
        tipo_organizacao: d.tipo_organizacao || d.tipoOrganizacao,
        publico_beneficiado: d.publico_beneficiado || d.publicoBeneficiado,
        quantidade_pessoas: d.quantidade_pessoas || d.quantidadePessoas,
        origem_pagina: d.origem_pagina || d.origemPagina,
        utm_source: d.utm_source,
        utm_medium: d.utm_medium,
        utm_campaign: d.utm_campaign,
        utm_term: d.utm_term,
        utm_content: d.utm_content,
        privacidade_aceita: d.privacidade_aceita,
        status: d.status || 'novo',
        observacoes: d.observacoes,
        created_at: d.created_at
      }));
      return formatted;
    }
  } catch (e) {
    // ignore
  }

  // 2. Fallback localStorage
  try {
    return JSON.parse(localStorage.getItem(LEADS_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

export const updateLeadStatus = async (id: string, status: LeadParceria['status'], observacoes?: string): Promise<boolean> => {
  // Atualiza local
  try {
    const current = JSON.parse(localStorage.getItem(LEADS_STORAGE_KEY) || '[]');
    const updated = current.map((l: LeadParceria) => l.id === id ? { ...l, status, observacoes: observacoes ?? l.observacoes } : l);
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('nc_leads_updated'));
  } catch (e) {
    console.error(e);
  }

  // Atualiza Supabase
  try {
    await supabase.from('leads_parcerias').update({ status, observacoes }).eq('id', id);
  } catch {
    // ignora
  }

  return true;
};

// -------------------------------------------------------------
// OPERAÇÕES DE EMPRESAS CONVENIADAS & CÓDIGOS DE ACESSO
// -------------------------------------------------------------

export const getEmpresasConveniadas = async (): Promise<EmpresaConveniada[]> => {
  // 1. Tenta Supabase
  try {
    const { data, error } = await supabase
      .from('empresas_conveniadas')
      .select('*')
      .order('nome', { ascending: true });

    if (!error && data && data.length > 0) {
      const formatted: EmpresaConveniada[] = data.map((d: any) => ({
        id: d.id,
        nome: d.nome,
        cnpj: d.cnpj,
        codigo_acesso: d.codigo_acesso || d.codigoAcesso,
        dominio_email: d.dominio_email || d.dominioEmail,
        desconto_percentual: Number(d.desconto_percentual ?? 10),
        tipo: d.tipo || 'empresa',
        ativa: d.ativa ?? true,
        total_beneficiados_estimado: d.total_beneficiados_estimado,
        contato_rh_nome: d.contato_rh_nome,
        contato_rh_email: d.contato_rh_email,
        contato_rh_telefone: d.contato_rh_telefone,
        created_at: d.created_at
      }));
      return formatted;
    }
  } catch (e) {
    // ignore
  }

  // 2. Fallback localStorage com seed padrão
  try {
    const stored = localStorage.getItem(EMPRESAS_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(EMPRESAS_STORAGE_KEY, JSON.stringify(INITIAL_EMPRESAS_CONVENIADAS));
      return INITIAL_EMPRESAS_CONVENIADAS;
    }
    return JSON.parse(stored);
  } catch {
    return INITIAL_EMPRESAS_CONVENIADAS;
  }
};

export const saveEmpresaConveniada = async (empresa: Omit<EmpresaConveniada, 'id' | 'created_at'> & { id?: string }): Promise<EmpresaConveniada> => {
  const currentList = await getEmpresasConveniadas();
  
  const formattedCode = empresa.codigo_acesso.trim().toUpperCase().replace(/\s+/g, '-');
  const targetId = empresa.id || `emp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  
  const savedEmpresa: EmpresaConveniada = {
    ...empresa,
    id: targetId,
    codigo_acesso: formattedCode,
    created_at: new Date().toISOString()
  };

  const existingIndex = currentList.findIndex(e => e.id === targetId);
  const updatedList = existingIndex >= 0 
    ? currentList.map(e => e.id === targetId ? savedEmpresa : e)
    : [savedEmpresa, ...currentList];

  try {
    localStorage.setItem(EMPRESAS_STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new Event('nc_empresas_updated'));
  } catch (err) {
    console.error(err);
  }

  try {
    await supabase.from('empresas_conveniadas').upsert({
      id: savedEmpresa.id,
      nome: savedEmpresa.nome,
      cnpj: savedEmpresa.cnpj,
      codigo_acesso: savedEmpresa.codigo_acesso,
      dominio_email: savedEmpresa.dominio_email,
      desconto_percentual: savedEmpresa.desconto_percentual,
      tipo: savedEmpresa.tipo,
      ativa: savedEmpresa.ativa,
      total_beneficiados_estimado: savedEmpresa.total_beneficiados_estimado,
      contato_rh_nome: savedEmpresa.contato_rh_nome,
      contato_rh_email: savedEmpresa.contato_rh_email,
      contato_rh_telefone: savedEmpresa.contato_rh_telefone,
    }, { onConflict: 'codigo_acesso' });
  } catch {
    // ignora
  }

  return savedEmpresa;
};

export const toggleEmpresaStatus = async (id: string, ativa: boolean): Promise<boolean> => {
  const currentList = await getEmpresasConveniadas();
  const updatedList = currentList.map(e => e.id === id ? { ...e, ativa } : e);
  
  try {
    localStorage.setItem(EMPRESAS_STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new Event('nc_empresas_updated'));
  } catch (e) {
    console.error(e);
  }

  try {
    await supabase.from('empresas_conveniadas').update({ ativa }).eq('id', id);
  } catch {
    // ignora
  }

  return true;
};

export const deleteEmpresaConveniada = async (id: string): Promise<boolean> => {
  const currentList = await getEmpresasConveniadas();
  const updatedList = currentList.filter(e => e.id !== id);

  try {
    localStorage.setItem(EMPRESAS_STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new Event('nc_empresas_updated'));
  } catch (e) {
    console.error(e);
  }

  try {
    await supabase.from('empresas_conveniadas').delete().eq('id', id);
  } catch {
    // ignora
  }

  return true;
};

export const validateEmpresaCodigo = async (codigo: string, nomeEmpresa?: string): Promise<{ valid: boolean; empresa?: EmpresaConveniada; message?: string }> => {
  const cleanCode = codigo.trim().toUpperCase();
  const empresas = await getEmpresasConveniadas();

  const found = empresas.find(e => e.codigo_acesso.toUpperCase() === cleanCode);

  if (!found) {
    return {
      valid: false,
      message: 'Código de convênio não encontrado. Verifique com o RH de sua empresa ou solicite o código abaixo.'
    };
  }

  if (!found.ativa) {
    return {
      valid: false,
      message: 'O convênio desta organização está temporariamente em revisão. Fale com nosso atendimento.'
    };
  }

  // Se o usuário digitou o nome da empresa e queremos alertar se divergir
  if (nomeEmpresa && nomeEmpresa.trim().length > 2) {
    const cleanName = nomeEmpresa.trim().toLowerCase();
    const targetName = found.nome.toLowerCase();
    if (!targetName.includes(cleanName) && !cleanName.includes(targetName)) {
      // Código válido mesmo com variação de grafia, apenas retorna a empresa identificada
    }
  }

  return {
    valid: true,
    empresa: found
  };
};

// -------------------------------------------------------------
// OPERAÇÕES DE RECUPERAÇÃO DE CÓDIGO
// -------------------------------------------------------------

export const saveSolicitacaoCodigo = async (data: Omit<SolicitacaoCodigo, 'id' | 'created_at' | 'status'>): Promise<SolicitacaoCodigo> => {
  const newSolicitacao: SolicitacaoCodigo = {
    id: `sol_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    ...data,
    status: 'pendente',
    created_at: new Date().toISOString()
  };

  try {
    const existing = JSON.parse(localStorage.getItem(SOLICITACOES_STORAGE_KEY) || '[]');
    localStorage.setItem(SOLICITACOES_STORAGE_KEY, JSON.stringify([newSolicitacao, ...existing]));
    window.dispatchEvent(new Event('nc_solicitacoes_updated'));
  } catch (e) {
    console.error(e);
  }

  try {
    await supabase.from('solicitacoes_codigo').insert([{
      nome_colaborador: newSolicitacao.nome_colaborador,
      email_corporativo: newSolicitacao.email_corporativo,
      telefone: newSolicitacao.telefone,
      nome_empresa: newSolicitacao.nome_empresa,
      status: newSolicitacao.status,
      created_at: newSolicitacao.created_at
    }]);
  } catch {
    // ignora
  }

  return newSolicitacao;
};

export const getSolicitacoesCodigo = async (): Promise<SolicitacaoCodigo[]> => {
  try {
    const { data, error } = await supabase
      .from('solicitacoes_codigo')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch {
    // ignora
  }

  try {
    return JSON.parse(localStorage.getItem(SOLICITACOES_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

export const updateSolicitacaoStatus = async (id: string, status: SolicitacaoCodigo['status']): Promise<boolean> => {
  try {
    const current = JSON.parse(localStorage.getItem(SOLICITACOES_STORAGE_KEY) || '[]');
    const updated = current.map((s: SolicitacaoCodigo) => s.id === id ? { ...s, status } : s);
    localStorage.setItem(SOLICITACOES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('nc_solicitacoes_updated'));
  } catch (e) {
    console.error(e);
  }

  try {
    await supabase.from('solicitacoes_codigo').update({ status }).eq('id', id);
  } catch {
    // ignora
  }

  return true;
};

// ==========================================
// MÓDULO DE APRESENTAÇÕES & PROPOSTAS COMERCIAIS B2B
// ==========================================

export interface PropostaModulo {
  id: string;
  codigo: string;
  categoria: 'despesas' | 'obt' | 'agenciamento' | 'bi' | 'atendimento' | 'beneficios' | 'custom';
  titulo: string;
  subtitulo: string;
  ativo_programa: string; // Ex: "Argo Travel & Expense", "WTS Corporate", "Clara TravelPay", "BI Proprietário NC"
  descricao: string;
  entregaveis: string[];
  selecionado: boolean;
  destaque?: string;
}

export interface PropostaItemComercial {
  id: string;
  item: string;
  modelo: string; // Ex: "Isento na Implantação", "Por Transação (Fee)", "Mensalidade Fixa", "Incluso no Escopo"
  valor: string;  // Ex: "R$ 0,00 (Bonificado)", "Sob Medida", "R$ 18,50 / emissão"
  observacao?: string;
}

export interface PropostaComercial {
  id: string;
  codigo_proposta: string; // Ex: "NC-PROP-2026-001"
  status: 'rascunho' | 'enviada' | 'em_negociacao' | 'aprovada' | 'arquivada';
  
  // Dados do Cliente & Padronização Visual
  cliente_nome: string;
  cliente_cnpj?: string;
  cliente_segmento?: string;
  cliente_logo_url?: string; // URL ou Base64 da logo do cliente
  cliente_volume_mensal?: string;
  contato_nome: string;
  contato_cargo?: string;
  contato_email?: string;
  contato_telefone?: string;

  // Dados do Executivo NC Responsável
  consultor_nome: string;
  consultor_cargo: string;
  consultor_email: string;
  consultor_telefone: string;
  data_emissao: string;
  validade_dias: number;

  // Textos Editáveis da Proposta (Elaboração Consultiva)
  titulo_apresentacao: string;
  subtitulo_apresentacao: string;
  carta_introducao: string;
  diagnostico_cenario: string;
  objetivos_estrategicos: string[];
  
  // Produtos Consultivos, Ativos e Programas NC Turismo
  modulos: PropostaModulo[];

  // Metodologia de Implantação / Cronograma
  metodologia_texto: string;
  etapas_implantacao: { fase: string; titulo: string; prazo: string; descricao: string }[];

  // Condições Comerciais & Termos Editáveis
  modelo_remuneracao_resumo: string;
  itens_comerciais: PropostaItemComercial[];
  beneficio_especial_destaque?: string; // Ex: "Até 12 meses de benefícios para sua empresa + Cupons Mensais"
  termos_condicoes: string;
  observacoes_finais?: string;

  created_at: string;
  updated_at: string;
}

export const DEFAULT_PROPOSTA_MODULOS: PropostaModulo[] = [
  {
    id: 'mod-gestao-despesas',
    codigo: '01',
    categoria: 'despesas',
    titulo: 'Gestão de Despesas Corporativas (Expense Management)',
    subtitulo: 'Digitalização de ponta a ponta da prestação de contas, adiantamentos e cartões',
    ativo_programa: 'Ecossistema Expense Sync · Leitura OCR & Conciliação ERP',
    descricao: 'Elimine planilhas manuais e recibos físicos. Nossa solução consultiva integra o ciclo completo de viagens à prestação de contas digital, com parametrização das regras fiscais e financeiras da sua empresa.',
    entregaveis: [
      'Prestação de contas 100% digital via smartphone com leitura automática (OCR) de recibos',
      'Gestão estruturada de adiantamentos, reembolsos, quilometragem e diárias',
      'Conciliação automática de faturas de cartões corporativos e bloqueio de duplicidades',
      'Rateio inteligente por múltiplos centros de custo, projetos ou unidades de negócio',
      'Integração contábil homologada com ERPs (SAP, TOTVS Protheus/Datasul, Senior, Oracle, Sankhya)'
    ],
    selecionado: true,
    destaque: 'Até 65% menos tempo operacional no financeiro'
  },
  {
    id: 'mod-ativos-obt',
    codigo: '02',
    categoria: 'obt',
    titulo: 'Ativos Tecnológicos & Plataforma OBT Corporativa',
    subtitulo: 'Autonomia para solicitar, cotar e aprovar viagens dentro da política da empresa',
    ativo_programa: 'Argo Travel & Expense / Reserve Corporate OBT',
    descricao: 'Disponibilizamos e parametrizamos os motores de reserva corporativa (OBT) líderes da América Latina, configurados sob medida para a hierarquia e as alçadas de aprovação da sua organização.',
    entregaveis: [
      'Parametrização preventiva de Políticas de Viagem (antecedência, limites de tarifa e classes)',
      'Fluxos de aprovação multinível (por centro de custo, valor ou alçada de diretoria) com aprovação em 1 clique',
      'Busca simultânea em múltiplos GDS e conexões diretas NDC com companhias aéreas e redes hoteleiras',
      'Aplicativo mobile nativo e portal web para solicitantes, secretárias, gestores e viajantes',
      'Rastreamento e reaproveitamento automático de bilhetes não voados (créditos aéreos)'
    ],
    selecionado: true,
    destaque: 'Zero divergência de alçadas e 100% de aderência à política'
  },
  {
    id: 'mod-agenciamento-consultivo',
    codigo: '03',
    categoria: 'agenciamento',
    titulo: 'Agenciamento Consultivo de Viagens 360° (37 Anos de Atuação)',
    subtitulo: 'Inteligência tarifária, negociações exclusivas e operação corporativa completa',
    ativo_programa: 'Consultoria Sênior NC Turismo · Aéreo, Hotelaria, Locação & Grupos',
    descricao: 'Mais do que tecnologia, entregamos curadoria humana e força de negociação construída em 37 anos de mercado. Atuamos ativamente na redução do custo médio por viagem (ticket médio) da sua empresa.',
    entregaveis: [
      'Emissão e gestão completa de passagens aéreas nacionais e internacionais, hotelaria, locação de veículos e transfers',
      'Negociação e aplicação de acordos corporativos tripartites com companhias aéreas e redes de hotéis',
      'Engenharia de rotas e sugestão proativa de tarifas comparativas (menor tarifa elegível)',
      'Logística especializada para eventos corporativos, treinamentos, feiras e deslocamento de equipes técnicas'
    ],
    selecionado: true,
    destaque: '37 anos de solidez e condições comerciais diferenciadas'
  },
  {
    id: 'mod-pagamentos-backoffice',
    codigo: '04',
    categoria: 'despesas',
    titulo: 'Meios de Pagamento & Backoffice Financeiro Unificado',
    subtitulo: 'Faturamento centralizado, cartões virtuais e auditoria contábil sem falhas',
    ativo_programa: 'WTS Corporate & Soluções VCN (Virtual Card Numbers)',
    descricao: 'Centralizamos o fluxo de pagamentos das viagens corporativas para eliminar adiantamentos inseguros e entregar faturas consolidadas, auditadas e prontas para a contabilidade.',
    entregaveis: [
      'Emissão de Cartões Virtuais (VCN) exclusivos por reserva de hotel ou aéreo com teto de gasto configurado',
      'Faturamento corporativo centralizado com faturas analíticas por centro de custo e nota fiscal unificada',
      'Auditoria preventiva de tarifas, taxas de embarque e franquias de bagagem antes do faturamento',
      'Portal do Cliente NC para emissão instantânea de 2ª via de faturas, boletos e relatórios operacionais'
    ],
    selecionado: true,
    destaque: 'Auditoria 100% rastreável e conciliação automatizada'
  },
  {
    id: 'mod-bi-analytics',
    codigo: '05',
    categoria: 'bi',
    titulo: 'Business Intelligence (BI Proprietário NC) & Governança ESG',
    subtitulo: 'Dashboards executivos em tempo real para CFOs, Compras e Gestores',
    ativo_programa: 'Portal NC Analytics & Relatórios de Saving',
    descricao: 'Transformamos dados operacionais em inteligência estratégica para a tomada de decisão da diretoria, demonstrando linha a linha a economia real gerada pela gestão da NC Turismo.',
    entregaveis: [
      'Painel executivo em tempo real com indicadores de Saving Realizado vs. Saving Perdido',
      'Análise de antecedência média de compra, share de fornecedores e ranking por departamento',
      'Mapeamento de exceções de política e motivos de reprovação/urgência',
      'Relatório de emissões de CO₂ (Pegada de Carbono) para matrizes de sustentabilidade e Compliance ESG',
      'Reuniões periódicas de Account Review (QBR) com apresentação de resultados e plano de ação'
    ],
    selecionado: true,
    destaque: 'Visibilidade executiva para redução contínua de custos'
  },
  {
    id: 'mod-atendimento-24h',
    codigo: '06',
    categoria: 'atendimento',
    titulo: 'Atendimento Humanizado & Plantão Emergencial 24/7 Próprio',
    subtitulo: 'Suporte sênior ininterrupto sem terceirização e sem robôs em momentos críticos',
    ativo_programa: 'Célula de Atendimento Dedicada & Plantão VIP 24/7 NC Turismo',
    descricao: 'Sabemos que imprevistos em viagens não têm hora para acontecer. Por isso, o plantão 24/7 da NC Turismo é operado exclusivamente por consultores seniores da nossa própria equipe.',
    entregaveis: [
      'Atendimento emergencial 24 horas por dia, 7 dias por semana (inclusive domingos e feriados)',
      'Suporte humano direto via WhatsApp e telefone sem filas de URA ou call centers terceirizados',
      'Reacomodação imediata em casos de cancelamento de voos, conexões perdidas ou alterações de agenda',
      'Atendimento VIP dedicado para Diretoria, Presidência e Conselheiros'
    ],
    selecionado: true,
    destaque: 'Equipe 100% própria NC Turismo — SLA prioritário'
  },
  {
    id: 'mod-beneficios-colaboradores',
    codigo: '07',
    categoria: 'beneficios',
    titulo: 'Benefícios NC Turismo & Cupons Mensais para a Empresa',
    subtitulo: 'Vantagens exclusivas em viagens corporativas e extensão para lazer dos colaboradores',
    ativo_programa: 'Portal de Benefícios NC Turismo & Cupons Mensais',
    descricao: 'Além da eficiência nas viagens a negócios, sua empresa passa a contar com o programa de Benefícios NC Turismo, agregando economia direta e valorização para toda a equipe sem custo adicional para o RH.',
    entregaveis: [
      'Cupons mensais de desconto para utilização em reservas e serviços de viagem',
      'Acesso ao Portal de Benefícios NC Turismo com condições diferenciadas em lazer para colaboradores',
      'Atendimento consultivo estendido para férias e viagens particulares de diretores e funcionários',
      'Elegibilidade ao programa especial de até 12 meses de benefícios corporativos'
    ],
    selecionado: true,
    destaque: 'Benefício de retenção e economia imediata sem custo ao RH'
  }
];

export const DEFAULT_ETAPAS_IMPLANTACAO = [
  {
    fase: 'Fase 01',
    titulo: 'Diagnóstico & Desenho da Política',
    prazo: 'Dias 1 a 3',
    descricao: 'Mapeamento dos centros de custo, hierarquia de aprovadores, regras de adiantamento/despesas e definição de SLAs.'
  },
  {
    fase: 'Fase 02',
    titulo: 'Parametrização de Ativos (OBT & Expense)',
    prazo: 'Dias 4 a 7',
    descricao: 'Configuração do sistema OBT e módulo de Gestão de Despesas, cadastro de usuários, cartões e integração com o ERP.'
  },
  {
    fase: 'Fase 03',
    titulo: 'Treinamento das Equipes & Gestores',
    prazo: 'Dias 8 a 10',
    descricao: 'Capacitação prática para solicitantes, viajantes, aprovadores e equipe financeira com material de apoio personalizado.'
  },
  {
    fase: 'Fase 04',
    titulo: 'Go-Live Assistido & Monitoramento BI',
    prazo: 'Dia 11 em diante',
    descricao: 'Início da operação com acompanhamento intensivo da célula sênior NC Turismo e ativação dos dashboards gerenciais.'
  }
];

export const DEFAULT_ITENS_COMERCIAIS: PropostaItemComercial[] = [
  {
    id: 'item-1',
    item: 'Setup, Parametrização do OBT e Implantação da Política de Viagens',
    modelo: 'Bonificado / Isento',
    valor: 'R$ 0,00',
    observacao: '100% custeado pela NC Turismo na assinatura da parceria'
  },
  {
    id: 'item-2',
    item: 'Treinamento de Solicitantes, Aprovadores e Equipe Financeira',
    modelo: 'Incluso no Escopo',
    valor: 'Incluso',
    observacao: 'Sessões online ou presenciais + manuais rápidos de uso'
  },
  {
    id: 'item-3',
    item: 'Acesso ao Portal NC BI Executivo & Relatórios de Saving/ESG',
    modelo: 'Incluso no Escopo',
    valor: 'Incluso',
    observacao: 'Acesso ilimitado para gestores e diretoria financeira'
  },
  {
    id: 'item-4',
    item: 'Agenciamento Consultivo (Emissão Aérea, Hotelaria e Locação) + Gestão de Despesas',
    modelo: 'Transaction Fee / Mensalidade Sob Medida',
    valor: 'Condição Especial Comercial',
    observacao: 'Elegível à campanha de até 12 meses de benefícios e cupons mensais'
  },
  {
    id: 'item-5',
    item: 'Suporte Emergencial 24/7 com Equipe Própria Sênior',
    modelo: 'Disponibilidade Integral',
    valor: 'Incluso',
    observacao: 'Acionamento direto via WhatsApp e telefone 24 horas'
  }
];

export const DEFAULT_TERMOS_PROPOSTA = `1. VALIDADE DA PROPOSTA: As condições técnicas e comerciais apresentadas neste documento têm validade de 15 (quinze) dias corridos a partir da data de emissão.
2. FATURAMENTO E CONCILIAÇÃO: Os serviços de agenciamento e reservas corporativas poderão ser faturados quinzenalmente ou mensalmente, mediante análise de crédito padrão, acompanhados de relatórios analíticos por centro de custo, solicitante e projeto, ou integrados via cartão corporativo/VCN.
3. NÍVEL DE SERVIÇO (SLA): A NC Turismo garante atendimento consultivo durante o horário comercial com tempo médio de resposta inferior a 30 minutos para cotações complexas, além de emissões online imediatas via OBT 24/7 e suporte emergencial humano 24 horas por dia, 7 dias por semana.
4. CONFIDENCIALIDADE E LGPD: Todas as informações cadastrais, dados de viajantes, políticas internas e relatórios financeiros tratados no escopo desta parceria seguem rigorosamente a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), com trilha de auditoria e criptografia de ponta a ponta.
5. AUSÊNCIA DE FIDELIDADE ABUSIVA: Nossa parceria é sustentada pela entrega contínua de resultado (saving, governança e satisfação dos viajantes), podendo o contrato ser ajustado conforme a evolução da demanda da empresa.`;

export const PROPOSTAS_SQL_SCHEMA = `-- ============================================================================
-- TABELA DE PROPOSTAS E APRESENTAÇÕES COMERCIAIS (NC TURISMO)
-- Execute este script no SQL Editor do seu projeto Supabase
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.propostas_comerciais (
  id TEXT PRIMARY KEY,
  codigo_proposta TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'enviada', 'em_negociacao', 'aprovada', 'arquivada')),
  
  -- Dados do Cliente e Padronizacao Visual
  cliente_nome TEXT NOT NULL,
  cliente_cnpj TEXT,
  cliente_segmento TEXT,
  cliente_logo_url TEXT,
  cliente_volume_mensal TEXT,
  contato_nome TEXT NOT NULL,
  contato_cargo TEXT,
  contato_email TEXT,
  contato_telefone TEXT,

  -- Dados do Consultor NC Turismo
  consultor_nome TEXT NOT NULL,
  consultor_cargo TEXT,
  consultor_email TEXT,
  consultor_telefone TEXT,
  data_emissao TEXT NOT NULL,
  validade_dias INT DEFAULT 15,

  -- Conteudo Consultivo e Textos Editaveis
  titulo_apresentacao TEXT NOT NULL,
  subtitulo_apresentacao TEXT,
  carta_introducao TEXT,
  diagnostico_cenario TEXT,
  objetivos_estrategicos JSONB DEFAULT '[]'::jsonb,
  
  -- Modulos, Produtos Consultivos, Ativos e Programas
  modulos JSONB DEFAULT '[]'::jsonb,

  -- Metodologia e Implantacao
  metodologia_texto TEXT,
  etapas_implantacao JSONB DEFAULT '[]'::jsonb,

  -- Condicoes Comerciais e Termos
  modelo_remuneracao_resumo TEXT,
  itens_comerciais JSONB DEFAULT '[]'::jsonb,
  beneficio_especial_destaque TEXT,
  termos_condicoes TEXT,
  observacoes_finais TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indices para busca rapida no painel administrativo e link compartilhavel
CREATE INDEX IF NOT EXISTS idx_propostas_codigo ON public.propostas_comerciais(codigo_proposta);
CREATE INDEX IF NOT EXISTS idx_propostas_cliente ON public.propostas_comerciais(cliente_nome);
CREATE INDEX IF NOT EXISTS idx_propostas_status ON public.propostas_comerciais(status);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.propostas_comerciais ENABLE ROW LEVEL SECURITY;

-- Politica de leitura publica (permite que o cliente visualize a apresentacao pelo link unico)
DROP POLICY IF EXISTS "Leitura publica de propostas por link" ON public.propostas_comerciais;
CREATE POLICY "Leitura publica de propostas por link"
  ON public.propostas_comerciais
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Politica de escrita/controle para o painel administrativo
DROP POLICY IF EXISTS "Controle total admin propostas comerciais" ON public.propostas_comerciais;
CREATE POLICY "Controle total admin propostas comerciais"
  ON public.propostas_comerciais
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);`;

const PROPOSTAS_STORAGE_KEY = 'nc_propostas_comerciais_v1';

export const INITIAL_PROPOSTAS_COMERCIAIS: PropostaComercial[] = [
  {
    id: 'prop-modelo-corporativo',
    codigo_proposta: 'NC-2026-001',
    status: 'enviada',
    cliente_nome: 'Grupo Industrial & Logística S.A. (Modelo Exemplo)',
    cliente_cnpj: '00.000.000/0001-00',
    cliente_segmento: 'Indústria & Operações',
    cliente_logo_url: '',
    cliente_volume_mensal: 'R$ 45.000 a R$ 80.000 / mês',
    contato_nome: 'Diretoria Financeira & Suprimentos',
    contato_cargo: 'CFO / Gestor de Viagens',
    contato_email: 'financeiro@empresaexemplo.com.br',
    contato_telefone: '(41) 99999-0000',
    consultor_nome: 'Equipe Executiva NC Turismo',
    consultor_cargo: 'Diretoria de Novos Negócios & Soluções Corporativas',
    consultor_email: 'corporativo@ncturismo.com.br',
    consultor_telefone: '(41) 3281-1153',
    data_emissao: new Date().toISOString().slice(0, 10),
    validade_dias: 15,
    titulo_apresentacao: 'Proposta de Gestão Consultiva de Viagens, Despesas & Ativos Tecnológicos',
    subtitulo_apresentacao: 'Da primeira reserva à gestão completa: governança financeira, tecnologia OBT/Expense integrada ao seu ERP e suporte humano 24/7 com a solidez de 37 anos da NC Turismo.',
    carta_introducao: 'Prezada Diretoria,\n\nÉ uma honra apresentar a proposta estruturada da NC Turismo para modernizar e otimizar a gestão de viagens e despesas corporativas da sua organização.\n\nCom 37 anos de atuação sólida no mercado brasileiro, combinamos plataformas tecnológicas líderes (OBT, Expense Management e BI Executivo) a um atendimento consultivo 100% próprio. Nosso compromisso é transformar o centro de despesas de mobilidade da sua empresa em uma operação enxuta, auditável, previsível e geradora de economia real (saving).',
    diagnostico_cenario: 'Identificamos que empresas em expansão frequentemente enfrentam desafios como: descentralização de solicitações, falta de visibilidade em tempo real por centro de custo, retrabalho manual na conferência de notas/reembolsos e perda de prazos tarifários por ausência de fluxos ágeis de aprovação. Nossa arquitetura consultiva elimina esses gargalos já nas primeiras semanas de implantação.',
    objetivos_estrategicos: [
      'Reduzir entre 15% e 28% o custo médio das viagens através de compras planejadas, acordos corporativos e engenharia tarifária',
      'Digitalizar 100% da prestação de contas e conciliação de despesas, reduzindo em até 65% o tempo operacional do departamento financeiro',
      'Garantir 100% de conformidade (compliance) com a Política de Viagens através de alçadas automáticas no sistema OBT',
      'Assegurar suporte emergencial humano 24/7 pela equipe própria da NC Turismo para total tranquilidade dos viajantes e executivos'
    ],
    modulos: DEFAULT_PROPOSTA_MODULOS,
    metodologia_texto: 'Nossa implantação segue uma metodologia ágil e assistida em 4 etapas, garantindo transição suave, sem interrupção das viagens em andamento e com adesão imediata dos colaboradores.',
    etapas_implantacao: DEFAULT_ETAPAS_IMPLANTACAO,
    modelo_remuneracao_resumo: 'Modelo transparente orientado à eficiência operacional, com isenção integral de taxas de setup/implantação da plataforma e acesso ao programa exclusivo de Cupons Mensais.',
    itens_comerciais: DEFAULT_ITENS_COMERCIAIS,
    beneficio_especial_destaque: 'Condição Especial de Adesão: Elegibilidade a até 12 meses de benefícios para sua empresa + Pacote de Cupons Mensais NC Turismo.',
    termos_condicoes: DEFAULT_TERMOS_PROPOSTA,
    observacoes_finais: 'Estamos à inteira disposição para ajustar qualquer parâmetro técnico, fluxo de aprovação ou condição comercial para atender com precisão à realidade da sua empresa.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const getPropostasComerciais = async (): Promise<PropostaComercial[]> => {
  // 1. Tenta carregar do Supabase
  try {
    const { data, error } = await supabase
      .from('propostas_comerciais')
      .select('*')
      .order('updated_at', { ascending: false });

    if (!error && data && data.length > 0) {
      localStorage.setItem(PROPOSTAS_STORAGE_KEY, JSON.stringify(data));
      return data as PropostaComercial[];
    }
  } catch {
    // fallback para localStorage
  }

  // 2. Fallback localStorage
  try {
    const cached = localStorage.getItem(PROPOSTAS_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as PropostaComercial[];
      }
    }
    localStorage.setItem(PROPOSTAS_STORAGE_KEY, JSON.stringify(INITIAL_PROPOSTAS_COMERCIAIS));
    return INITIAL_PROPOSTAS_COMERCIAIS;
  } catch {
    return INITIAL_PROPOSTAS_COMERCIAIS;
  }
};

export const getPropostaComercialById = async (idOrCode: string): Promise<PropostaComercial | null> => {
  const clean = idOrCode.trim();
  // 1. Tenta Supabase direto
  try {
    const { data, error } = await supabase
      .from('propostas_comerciais')
      .select('*')
      .or(`id.eq.${clean},codigo_proposta.eq.${clean}`)
      .limit(1);

    if (!error && data && data.length > 0) {
      return data[0] as PropostaComercial;
    }
  } catch {
    // fallback
  }

  const all = await getPropostasComerciais();
  return all.find(p => p.id === clean || p.codigo_proposta.toLowerCase() === clean.toLowerCase()) || null;
};

export const savePropostaComercial = async (proposta: PropostaComercial): Promise<{ proposta: PropostaComercial; syncedSupabase: boolean; errorMsg?: string }> => {
  const now = new Date().toISOString();
  const payload: PropostaComercial = {
    ...proposta,
    updated_at: now,
    created_at: proposta.created_at || now
  };

  // 1. Atualiza imediatamente no localStorage
  try {
    const currentList = await getPropostasComerciais();
    const exists = currentList.some(p => p.id === payload.id);
    const updatedList = exists
      ? currentList.map(p => p.id === payload.id ? payload : p)
      : [payload, ...currentList];

    localStorage.setItem(PROPOSTAS_STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new Event('nc_propostas_updated'));
  } catch (e) {
    console.error('Erro ao salvar proposta no localStorage:', e);
  }

  // 2. Persiste no Supabase se a tabela existir
  try {
    const { error } = await supabase
      .from('propostas_comerciais')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Aviso ao sincronizar proposta no Supabase:', error.message);
      return { proposta: payload, syncedSupabase: false, errorMsg: error.message };
    }
    return { proposta: payload, syncedSupabase: true };
  } catch (err: any) {
    return { proposta: payload, syncedSupabase: false, errorMsg: err?.message };
  }
};

export const deletePropostaComercial = async (id: string): Promise<boolean> => {
  try {
    const currentList = await getPropostasComerciais();
    const updatedList = currentList.filter(p => p.id !== id);
    localStorage.setItem(PROPOSTAS_STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new Event('nc_propostas_updated'));
  } catch (e) {
    console.error(e);
  }

  try {
    await supabase.from('propostas_comerciais').delete().eq('id', id);
  } catch {
    // ignora
  }

  return true;
};



