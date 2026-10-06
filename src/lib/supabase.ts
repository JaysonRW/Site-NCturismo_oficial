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

export const getLazerPackages = async (): Promise<LazerPackage[]> => {
  // 1. Tenta carregar do Supabase
  try {
    const { data, error } = await supabase
      .from('lazer_packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      // Atualiza cache local
      localStorage.setItem('nc_lazer_packages', JSON.stringify(data));
      return data as LazerPackage[];
    }
  } catch (e) {
    // continua para o fallback
  }

  // 2. Fallback para localStorage
  try {
    const cached = localStorage.getItem('nc_lazer_packages');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // continua para inicial
  }

  // 3. Fallback inicial com pacotes padrão
  localStorage.setItem('nc_lazer_packages', JSON.stringify(INITIAL_LAZER_PACKAGES));
  return INITIAL_LAZER_PACKAGES;
};

export const saveLazerPackage = async (pkg: LazerPackage): Promise<LazerPackage> => {
  const currentPackages = await getLazerPackages();
  const exists = currentPackages.some(p => p.id === pkg.id);
  
  let updatedList: LazerPackage[];
  if (exists) {
    updatedList = currentPackages.map(p => p.id === pkg.id ? { ...pkg, updated_at: new Date().toISOString() } : p);
  } else {
    updatedList = [{ ...pkg, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, ...currentPackages];
  }

  // Salva no cache do localStorage
  try {
    localStorage.setItem('nc_lazer_packages', JSON.stringify(updatedList));
  } catch (err) {
    console.error('Erro ao salvar no localStorage:', err);
  }

  // Tenta persistir no Supabase (se existir a tabela)
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
    localStorage.setItem('nc_lazer_packages', JSON.stringify(updatedList));
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

