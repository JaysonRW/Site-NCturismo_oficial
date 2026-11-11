export type AppViewName =
  | 'home'
  | 'quem-somos'
  | 'privacidade'
  | 'beneficios'
  | 'termos'
  | 'admin'
  | 'blog'
  | 'blog-post'
  | 'viagens-corporativas'
  | 'gestao-de-viagens'
  | 'gestao-de-despesas'
  | 'tecnologia-obt'
  | 'atendimento-24h'
  | 'bi-e-relatorios'
  | 'compliance-esg'
  | 'lazer'
  | 'area-cliente'
  | 'proposta'
  | 'rodoviario';

export interface SeoRouteDefinition {
  view: AppViewName;
  canonicalPath: string;
  title: string;
  description: string;
  sitelinkLabel?: string;
  indexable: boolean;
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly';
}

export const SEO_ROUTES: Record<AppViewName, SeoRouteDefinition> = {
  home: {
    view: 'home',
    canonicalPath: '/',
    title: 'NC Turismo | Gestão Inteligente de Viagens Corporativas',
    description:
      'Gestão de viagens corporativas com tecnologia OBT, BI, controle de despesas e atendimento humano 24h para sua empresa avançar com confiança.',
    indexable: true,
    priority: 1.0,
    changefreq: 'weekly',
  },
  'viagens-corporativas': {
    view: 'viagens-corporativas',
    canonicalPath: '/viagens-corporativas',
    title: 'Viagens Corporativas e Soluções B2B | NC Turismo',
    description:
      'Estrutura completa de viagens corporativas: política de viagens, redução de custos, tecnologia OBT, relatórios gerenciais e suporte 24/7.',
    sitelinkLabel: 'Viagens Corporativas',
    indexable: true,
    priority: 0.9,
    changefreq: 'weekly',
  },
  'gestao-de-viagens': {
    view: 'gestao-de-viagens',
    canonicalPath: '/gestao-de-viagens',
    title: 'Gestão de Viagens Corporativas de Ponta a Ponta | NC Turismo',
    description:
      'Planejamento, governança, SLA ágil e negociação com fornecedores para otimizar o orçamento de viagens da sua empresa.',
    sitelinkLabel: 'Gestão de Viagens',
    indexable: true,
    priority: 0.9,
    changefreq: 'weekly',
  },
  'gestao-de-despesas': {
    view: 'gestao-de-despesas',
    canonicalPath: '/gestao-de-despesas',
    title: 'Gestão de Despesas e Conciliação Corporativa | NC Turismo',
    description:
      'Controle financeiro por centro de custo, auditoria de tarifas, adiantamentos, reembolsos e conciliação automatizada de viagens.',
    sitelinkLabel: 'Gestão de Despesas',
    indexable: true,
    priority: 0.85,
    changefreq: 'monthly',
  },
  'tecnologia-obt': {
    view: 'tecnologia-obt',
    canonicalPath: '/tecnologia-obt',
    title: 'Tecnologia OBT e Integrações Corporativas | NC Turismo',
    description:
      'Self-booking corporativo (OBT), fluxos de aprovação multinível, integração ERP/RH e experiência mobile para viajantes e gestores.',
    sitelinkLabel: 'Tecnologia e OBT',
    indexable: true,
    priority: 0.85,
    changefreq: 'monthly',
  },
  'bi-e-relatorios': {
    view: 'bi-e-relatorios',
    canonicalPath: '/bi-e-relatorios',
    title: 'BI e Relatórios Gerenciais de Viagens | NC Turismo',
    description:
      'Dashboards executivos, indicadores de saving, antecedência de compra, emissões de CO₂ e inteligência analítica para tomada de decisão.',
    sitelinkLabel: 'BI e Relatórios',
    indexable: true,
    priority: 0.85,
    changefreq: 'monthly',
  },
  'atendimento-24h': {
    view: 'atendimento-24h',
    canonicalPath: '/atendimento-24h',
    title: 'Atendimento Humano 24h e Plantão Próprio | NC Turismo',
    description:
      'Suporte emergencial 24/7 com consultores sêniores da própria NC Turismo, sem filas de URA ou terceirização.',
    sitelinkLabel: 'Atendimento 24h',
    indexable: true,
    priority: 0.85,
    changefreq: 'monthly',
  },
  'compliance-esg': {
    view: 'compliance-esg',
    canonicalPath: '/compliance-esg',
    title: 'Governança, Compliance, LGPD e ESG | NC Turismo',
    description:
      'Segurança de pagamentos, proteção de dados (LGPD), rastreabilidade de operações e responsabilidade socioambiental nas viagens corporativas.',
    sitelinkLabel: 'Compliance e ESG',
    indexable: true,
    priority: 0.85,
    changefreq: 'monthly',
  },
  beneficios: {
    view: 'beneficios',
    canonicalPath: '/beneficios',
    title: 'NC Partners | Benefícios em Viagens para Colaboradores',
    description:
      'Clube de vantagens e condições exclusivas em viagens de lazer para colaboradores, associados e cooperados de empresas parceiras.',
    sitelinkLabel: 'Benefícios e Parcerias',
    indexable: true,
    priority: 0.9,
    changefreq: 'weekly',
  },
  lazer: {
    view: 'lazer',
    canonicalPath: '/lazer',
    title: 'Viagens de Lazer e Roteiros Sob Medida | NC Turismo',
    description:
      'Curadoria exclusiva de destinos nacionais e internacionais, pacotes personalizados e assessoria completa para suas férias.',
    sitelinkLabel: 'Lazer e Roteiros',
    indexable: true,
    priority: 0.85,
    changefreq: 'weekly',
  },
  blog: {
    view: 'blog',
    canonicalPath: '/conhecimento',
    title: 'Conhecimento NC | Conteúdos sobre Viagens Corporativas',
    description:
      'Artigos, guias práticos, indicadores de mercado e melhores práticas em gestão de viagens corporativas, SLA, OBT e redução de custos.',
    sitelinkLabel: 'Conhecimento NC',
    indexable: true,
    priority: 0.85,
    changefreq: 'weekly',
  },
  'blog-post': {
    view: 'blog-post',
    canonicalPath: '/artigo',
    title: 'Artigo Especializado | Conhecimento NC Turismo',
    description:
      'Insights estratégicos e boas práticas em gestão de viagens corporativas pela equipe de especialistas da NC Turismo.',
    indexable: true,
    priority: 0.75,
    changefreq: 'monthly',
  },
  'quem-somos': {
    view: 'quem-somos',
    canonicalPath: '/quem-somos',
    title: 'Quem Somos | Mais de 35 Anos de Tradição — NC Turismo',
    description:
      'Conheça a história, a estrutura própria em Curitiba e a evolução da NC Turismo na gestão inteligente de viagens corporativas e lazer.',
    sitelinkLabel: 'Quem Somos',
    indexable: true,
    priority: 0.8,
    changefreq: 'monthly',
  },
  'area-cliente': {
    view: 'area-cliente',
    canonicalPath: '/area-cliente',
    title: 'Área do Cliente e Portal OBT | NC Turismo',
    description:
      'Acesso rápido aos sistemas de self-booking corporativo (OBT), relatórios gerenciais, segunda via de bilhetes e plantão 24h.',
    sitelinkLabel: 'Área do Cliente',
    indexable: true,
    priority: 0.8,
    changefreq: 'monthly',
  },
  privacidade: {
    view: 'privacidade',
    canonicalPath: '/privacidade',
    title: 'Política de Privacidade e Proteção de Dados | NC Turismo',
    description:
      'Diretrizes de privacidade, segurança da informação e conformidade com a Lei Geral de Proteção de Dados (LGPD) da NC Turismo.',
    indexable: true,
    priority: 0.5,
    changefreq: 'monthly',
  },
  termos: {
    view: 'termos',
    canonicalPath: '/termos',
    title: 'Termos de Uso e Condições Gerais | NC Turismo',
    description:
      'Termos e condições gerais de utilização dos canais digitais, serviços de agenciamento e programas de benefícios da NC Turismo.',
    indexable: true,
    priority: 0.5,
    changefreq: 'monthly',
  },
  rodoviario: {
    view: 'rodoviario',
    canonicalPath: '/rodoviario',
    title: 'Portal Rodoviário Nacional • Consulta e Seleção de Assentos | NC Turismo',
    description:
      'Pesquisa rodoviária nacional com mapa de poltronas em tempo real em mais de 300 viações brasileiras.',
    indexable: false, // Oculto do sitemap público até conclusão dos testes em produção
    priority: 0.7,
    changefreq: 'weekly',
  },
  proposta: {
    view: 'proposta',
    canonicalPath: '/proposta',
    title: 'Proposta Comercial Executiva | NC Turismo',
    description: 'Apresentação executiva personalizada de gestão de viagens corporativas NC Turismo.',
    indexable: false,
    priority: 0.3,
    changefreq: 'monthly',
  },
  admin: {
    view: 'admin',
    canonicalPath: '/admin',
    title: 'Painel Administrativo | NC Turismo',
    description: 'Acesso restrito à gestão de conteúdo e indicadores da NC Turismo.',
    indexable: false,
    priority: 0.1,
    changefreq: 'monthly',
  },
};

export interface ResolvedRouteMatch {
  view: AppViewName;
  canonicalPath: string;
  slug?: string;
  propostaCode?: string;
  homeAnchorId?: string;
  wasLegacyHash?: boolean;
}

const HOME_SECTION_ANCHORS: Record<string, string> = {
  solucoes: 'solucoes',
  diagnostico: 'diagnostico',
  estrutura: 'estrutura',
  transformacao: 'transformacao',
  faq: 'faq',
  duvidas: 'faq',
  'perguntas-frequentes': 'faq',
  plantao: 'plantao',
  suporte: 'plantao',
};

/**
 * Resolve qualquer combinação de pathname (/gestao-de-viagens) ou hash legado (#gestao-de-viagens)
 * para a View correspondente, mantendo 100% de retrocompatibilidade.
 */
export function resolveTokenToRoute(rawToken: string, isFromHash = false): ResolvedRouteMatch | null {
  const cleaned = rawToken
    .trim()
    .replace(/^[#/]+/, '')
    .replace(/\/+$/, '');

  const lower = cleaned.toLowerCase();

  if (!lower || lower === 'home') {
    return { view: 'home', canonicalPath: '/', wasLegacyHash: isFromHash };
  }

  // Rotas dinâmicas: Artigos do Blog (/artigo/:slug, /blog/:slug, /conhecimento/:slug)
  if (lower.startsWith('artigo/') || lower.startsWith('blog/') || lower.startsWith('conhecimento/')) {
    const slug = cleaned.replace(/^(artigo|blog|conhecimento)\//i, '');
    if (slug) {
      return {
        view: 'blog-post',
        canonicalPath: `/artigo/${slug}`,
        slug,
        wasLegacyHash: isFromHash,
      };
    }
  }

  // Rotas dinâmicas: Proposta Comercial (/proposta/:code)
  if (lower.startsWith('proposta/')) {
    const code = decodeURIComponent(cleaned.replace(/^proposta\//i, '')).trim();
    if (code) {
      return {
        view: 'proposta',
        canonicalPath: `/?proposta=${encodeURIComponent(code)}`,
        propostaCode: code,
        wasLegacyHash: isFromHash,
      };
    }
  }
  if (lower === 'proposta') {
    return {
      view: 'proposta',
      canonicalPath: '/proposta',
      wasLegacyHash: isFromHash,
    };
  }

  // Admin
  if (lower === 'admin' || lower.startsWith('admin/')) {
    return { view: 'admin', canonicalPath: '/admin', wasLegacyHash: isFromHash };
  }

  // Âncoras de seções internas da página inicial (Home)
  if (HOME_SECTION_ANCHORS[lower]) {
    const targetId = HOME_SECTION_ANCHORS[lower];
    return {
      view: 'home',
      canonicalPath: `/#${targetId}`,
      homeAnchorId: targetId,
      wasLegacyHash: false,
    };
  }

  // Mapeamento de páginas dedicadas e seus aliases
  if (lower === 'quem-somos' || lower === 'quemsomos') {
    return { view: 'quem-somos', canonicalPath: '/quem-somos', wasLegacyHash: isFromHash };
  }
  if (lower === 'viagens-corporativas' || lower === 'corporativo') {
    return { view: 'viagens-corporativas', canonicalPath: '/viagens-corporativas', wasLegacyHash: isFromHash };
  }
  if (
    lower === 'gestao-de-viagens' ||
    lower === 'gestao-viagens' ||
    lower === 'gestaoviagens' ||
    lower === 'gestao'
  ) {
    return { view: 'gestao-de-viagens', canonicalPath: '/gestao-de-viagens', wasLegacyHash: isFromHash };
  }
  if (
    lower === 'gestao-de-despesas' ||
    lower === 'gestao-despesas' ||
    lower === 'despesas' ||
    lower === 'despesas-corporativas' ||
    lower === 'gestaodespesas'
  ) {
    return { view: 'gestao-de-despesas', canonicalPath: '/gestao-de-despesas', wasLegacyHash: isFromHash };
  }
  if (
    lower === 'tecnologia-obt' ||
    lower === 'tecnologia-e-obt' ||
    lower === 'tecnologia' ||
    lower === 'tecnologia-e-integracoes' ||
    lower === 'tecnologia-integracoes' ||
    lower === 'obt'
  ) {
    return { view: 'tecnologia-obt', canonicalPath: '/tecnologia-obt', wasLegacyHash: isFromHash };
  }
  if (
    lower === 'atendimento-24h' ||
    lower === 'atendimento-24-horas' ||
    lower === 'atendimento24h' ||
    lower === 'atendimento24horas' ||
    lower === 'atendimento-24' ||
    lower === 'suporte-24h' ||
    lower === 'plantao-24h'
  ) {
    return { view: 'atendimento-24h', canonicalPath: '/atendimento-24h', wasLegacyHash: isFromHash };
  }
  if (
    lower === 'bi-e-relatorios' ||
    lower === 'bi-relatorios' ||
    lower === 'bi' ||
    lower === 'relatorios' ||
    lower === 'relatorios-gerenciais' ||
    lower === 'bie-relatorios'
  ) {
    return { view: 'bi-e-relatorios', canonicalPath: '/bi-e-relatorios', wasLegacyHash: isFromHash };
  }
  if (
    lower === 'compliance-esg' ||
    lower === 'compliance' ||
    lower === 'esg' ||
    lower === 'compliance-e-esg' ||
    lower === 'governanca-compliance'
  ) {
    return { view: 'compliance-esg', canonicalPath: '/compliance-esg', wasLegacyHash: isFromHash };
  }
  if (lower === 'lazer') {
    return { view: 'lazer', canonicalPath: '/lazer', wasLegacyHash: isFromHash };
  }
  if (lower === 'rodoviario' || lower === 'passagens-rodoviarias' || lower === 'onibus') {
    return { view: 'rodoviario', canonicalPath: '/rodoviario', wasLegacyHash: isFromHash };
  }
  if (
    lower === 'beneficios' ||
    lower === 'beneficios-viagens' ||
    lower === 'beneficios-em-viagens' ||
    lower === 'beneficios-e-parcerias' ||
    lower === 'beneficios-e-viagens' ||
    lower === 'nc-partners' ||
    lower === 'ncpartners' ||
    lower === 'partners' ||
    lower === 'parcerias'
  ) {
    return { view: 'beneficios', canonicalPath: '/beneficios', wasLegacyHash: isFromHash };
  }
  if (lower === 'conhecimento' || lower === 'blog') {
    return { view: 'blog', canonicalPath: '/conhecimento', wasLegacyHash: isFromHash };
  }
  if (
    lower === 'area-cliente' ||
    lower === 'areadocliente' ||
    lower === 'portal-cliente' ||
    lower === 'portal' ||
    lower === 'cliente'
  ) {
    return { view: 'area-cliente', canonicalPath: '/area-cliente', wasLegacyHash: isFromHash };
  }
  if (lower === 'privacidade') {
    return { view: 'privacidade', canonicalPath: '/privacidade', wasLegacyHash: isFromHash };
  }
  if (lower === 'termos' || lower === 'legal-beneficios') {
    return { view: 'termos', canonicalPath: '/termos', wasLegacyHash: isFromHash };
  }

  return null;
}

/**
 * Resolve o estado atual do navegador (pathname + hash + search) priorizando:
 * 1. Parâmetro de query ?proposta=CODIGO (universal para qualquer servidor estático/Plesk)
 * 2. Hash legado (ex.: /#proposta/CODIGO ou /#gestao-de-viagens)
 * 3. Pathname limpo (ex.: /gestao-de-viagens ou /proposta/CODIGO)
 */
export function resolveBrowserLocation(pathname: string, hash: string, search?: string): ResolvedRouteMatch {
  const effectiveSearch =
    search !== undefined ? search : typeof window !== 'undefined' ? window.location.search : '';

  if (effectiveSearch) {
    try {
      const params = new URLSearchParams(effectiveSearch);
      const propParam = (params.get('proposta') || params.get('codigo') || '').trim();
      if (propParam) {
        return {
          view: 'proposta',
          canonicalPath: `/?proposta=${encodeURIComponent(propParam)}`,
          propostaCode: propParam,
          wasLegacyHash: false,
        };
      }
    } catch {
      // ignore invalid query params
    }
  }

  const cleanHash = (hash || '').replace(/^#/, '').trim();
  const cleanPath = (pathname || '/').replace(/^\/+|\/+$/g, '').trim();

  if (cleanHash) {
    const hashMatch = resolveTokenToRoute(cleanHash, true);
    if (hashMatch) {
      return hashMatch;
    }
  }

  if (cleanPath) {
    const pathMatch = resolveTokenToRoute(cleanPath, false);
    if (pathMatch) {
      return pathMatch;
    }
  }

  return { view: 'home', canonicalPath: '/' };
}

/**
 * Atualiza dinamicamente o <title>, <meta name="description">, OpenGraph e <link rel="canonical">
 * no navegador a cada troca de página.
 */
export function applyClientSeoMetadata(view: AppViewName, customPath?: string) {
  if (typeof document === 'undefined') return;
  const def = SEO_ROUTES[view] || SEO_ROUTES.home;
  const effectivePath = customPath || def.canonicalPath;
  const fullUrl = `${window.location.origin}${effectivePath === '/' ? '' : effectivePath}`;

  document.title = def.title;

  const setMeta = (selector: string, attrName: string, attrValue: string, content: string) => {
    let el = document.querySelector(selector) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('meta[name="description"]', 'name', 'description', def.description);
  setMeta('meta[property="og:title"]', 'property', 'og:title', def.title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', def.description);
  setMeta('meta[property="og:url"]', 'property', 'og:url', fullUrl);
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', def.title);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', def.description);

  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', fullUrl);
}
