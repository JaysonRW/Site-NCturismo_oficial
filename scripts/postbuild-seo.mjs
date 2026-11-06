import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const baseIndexPath = path.join(distDir, 'index.html');

const SITE_ORIGIN = 'https://ncturismo.com.br';

/**
 * Definição de todas as rotas estáticas e SEO que devem ter diretórios físicos
 * gerados em dist/<rota>/index.html para funcionamento nativo em servidores
 * estáticos (Plesk / Nginx / Apache / CDN) sem depender de reescrita.
 */
const STATIC_ROUTES = [
  {
    path: '/viagens-corporativas',
    title: 'Viagens Corporativas e Soluções B2B | NC Turismo',
    description:
      'Estrutura completa de viagens corporativas: política de viagens, redução de custos, tecnologia OBT, relatórios gerenciais e suporte 24/7.',
    indexable: true,
    priority: 0.9,
    changefreq: 'weekly',
  },
  {
    path: '/gestao-de-viagens',
    title: 'Gestão de Viagens Corporativas de Ponta a Ponta | NC Turismo',
    description:
      'Planejamento, governança, SLA ágil e negociação com fornecedores para otimizar o orçamento de viagens da sua empresa.',
    indexable: true,
    priority: 0.9,
    changefreq: 'weekly',
  },
  {
    path: '/gestao-de-despesas',
    title: 'Gestão de Despesas e Conciliação Corporativa | NC Turismo',
    description:
      'Controle financeiro por centro de custo, auditoria de tarifas, adiantamentos, reembolsos e conciliação automatizada de viagens.',
    indexable: true,
    priority: 0.85,
    changefreq: 'monthly',
  },
  {
    path: '/tecnologia-obt',
    title: 'Tecnologia OBT e Integrações Corporativas | NC Turismo',
    description:
      'Self-booking corporativo (OBT), fluxos de aprovação multinível, integração ERP/RH e experiência mobile para viajantes e gestores.',
    indexable: true,
    priority: 0.85,
    changefreq: 'monthly',
  },
  {
    path: '/bi-e-relatorios',
    title: 'BI e Relatórios Gerenciais de Viagens | NC Turismo',
    description:
      'Dashboards executivos, indicadores de saving, antecedência de compra, emissões de CO₂ e inteligência analítica para tomada de decisão.',
    indexable: true,
    priority: 0.85,
    changefreq: 'monthly',
  },
  {
    path: '/atendimento-24h',
    title: 'Atendimento Humano 24h e Plantão Próprio | NC Turismo',
    description:
      'Suporte emergencial 24/7 com consultores sêniores da própria NC Turismo, sem filas de URA ou terceirização.',
    indexable: true,
    priority: 0.85,
    changefreq: 'monthly',
  },
  {
    path: '/compliance-esg',
    title: 'Governança, Compliance, LGPD e ESG | NC Turismo',
    description:
      'Segurança de pagamentos, proteção de dados (LGPD), rastreabilidade de operações e responsabilidade socioambiental nas viagens corporativas.',
    indexable: true,
    priority: 0.85,
    changefreq: 'monthly',
  },
  {
    path: '/beneficios',
    title: 'NC Partners | Benefícios em Viagens para Colaboradores',
    description:
      'Clube de vantagens e condições exclusivas em viagens de lazer para colaboradores, associados e cooperados de empresas parceiras.',
    indexable: true,
    priority: 0.9,
    changefreq: 'weekly',
  },
  {
    path: '/lazer',
    title: 'Viagens de Lazer e Roteiros Sob Medida | NC Turismo',
    description:
      'Curadoria exclusiva de destinos nacionais e internacionais, pacotes personalizados e assessoria completa para suas férias.',
    indexable: true,
    priority: 0.85,
    changefreq: 'weekly',
  },
  {
    path: '/conhecimento',
    title: 'Conhecimento NC | Conteúdos sobre Viagens Corporativas',
    description:
      'Artigos, guias práticos, indicadores de mercado e melhores práticas em gestão de viagens corporativas, SLA, OBT e redução de custos.',
    indexable: true,
    priority: 0.85,
    changefreq: 'weekly',
  },
  {
    path: '/quem-somos',
    title: 'Quem Somos | Mais de 35 Anos de Tradição — NC Turismo',
    description:
      'Conheça a história, a estrutura própria em Curitiba e a evolução da NC Turismo na gestão inteligente de viagens corporativas e lazer.',
    indexable: true,
    priority: 0.8,
    changefreq: 'monthly',
  },
  {
    path: '/area-cliente',
    title: 'Área do Cliente e Portal OBT | NC Turismo',
    description:
      'Acesso rápido aos sistemas de self-booking corporativo (OBT), relatórios gerenciais, segunda via de bilhetes e plantão 24h.',
    indexable: true,
    priority: 0.8,
    changefreq: 'monthly',
  },
  {
    path: '/privacidade',
    title: 'Política de Privacidade e Proteção de Dados | NC Turismo',
    description:
      'Diretrizes de privacidade, segurança da informação e conformidade com a Lei Geral de Proteção de Dados (LGPD) da NC Turismo.',
    indexable: true,
    priority: 0.5,
    changefreq: 'monthly',
  },
  {
    path: '/termos',
    title: 'Termos de Uso e Condições Gerais | NC Turismo',
    description:
      'Termos e condições gerais de utilização dos canais digitais, serviços de agenciamento e programas de benefícios da NC Turismo.',
    indexable: true,
    priority: 0.5,
    changefreq: 'monthly',
  },
  // Rota oculta do menu público durante homologação em produção, mas 100% funcional via URL direta
  {
    path: '/rodoviario',
    title: 'Portal Rodoviário Nacional • Consulta e Seleção de Assentos | NC Turismo',
    description:
      'Pesquisa rodoviária nacional com mapa de poltronas em tempo real em mais de 300 viações brasileiras.',
    indexable: false,
    priority: 0.7,
    changefreq: 'weekly',
  },
  // Rotas de apoio / internas
  {
    path: '/admin',
    title: 'Painel Administrativo | NC Turismo',
    description: 'Acesso restrito à gestão de conteúdo e indicadores da NC Turismo.',
    indexable: false,
    priority: 0.1,
    changefreq: 'monthly',
  },
  {
    path: '/proposta',
    title: 'Proposta Comercial Executiva | NC Turismo',
    description: 'Apresentação executiva personalizada de gestão de viagens corporativas NC Turismo.',
    indexable: false,
    priority: 0.3,
    changefreq: 'monthly',
  },
  // Artigos em destaque para pré-renderização estática
  {
    path: '/artigo/sla-suporte-viagens-corporativas-atendimento',
    title: 'SLA em Viagens Corporativas: O Impacto do Suporte 24h | Conhecimento NC',
    description:
      'Entenda como métricas reais de SLA e atendimento humano próprio 24/7 evitam prejuízos operacionais em viagens corporativas.',
    indexable: true,
    priority: 0.75,
    changefreq: 'monthly',
  },
  {
    path: '/artigo/como-reduzir-custos-viagens-corporativas-sem-perder-qualidade',
    title: 'Como Reduzir Custos em Viagens Corporativas sem Perder Qualidade | Conhecimento NC',
    description:
      'Estratégias práticas de antecedência de compra, política de viagens, OBT e negociação com fornecedores para gerar saving real.',
    indexable: true,
    priority: 0.75,
    changefreq: 'monthly',
  },
  {
    path: '/artigo/politica-de-viagens-corporativas-guia-definitivo',
    title: 'Política de Viagens Corporativas: Guia Definitivo para Gestores | Conhecimento NC',
    description:
      'Passo a passo para estruturar uma política de viagens clara, automatizada no OBT e com alta adesão dos colaboradores.',
    indexable: true,
    priority: 0.75,
    changefreq: 'monthly',
  },
  // Aliases de compatibilidade para links diretos
  {
    path: '/passagens-rodoviarias',
    canonicalOverride: '/rodoviario',
    title: 'Portal Rodoviário Nacional • Consulta e Seleção de Assentos | NC Turismo',
    description:
      'Pesquisa rodoviária nacional com mapa de poltronas em tempo real em mais de 300 viações brasileiras.',
    indexable: false,
    priority: 0.5,
    changefreq: 'weekly',
  },
  {
    path: '/onibus',
    canonicalOverride: '/rodoviario',
    title: 'Portal Rodoviário Nacional • Consulta e Seleção de Assentos | NC Turismo',
    description:
      'Pesquisa rodoviária nacional com mapa de poltronas em tempo real em mais de 300 viações brasileiras.',
    indexable: false,
    priority: 0.5,
    changefreq: 'weekly',
  },
  {
    path: '/blog',
    canonicalOverride: '/conhecimento',
    title: 'Conhecimento NC | Conteúdos sobre Viagens Corporativas',
    description:
      'Artigos, guias práticos, indicadores de mercado e melhores práticas em gestão de viagens corporativas, SLA, OBT e redução de custos.',
    indexable: false,
    priority: 0.5,
    changefreq: 'weekly',
  },
];

function escapeAttr(str) {
  return String(str).replace(/"/g, '&quot;');
}

function customizeHtmlForRoute(baseHtml, route) {
  const canonicalPath = route.canonicalOverride || route.path;
  const fullCanonicalUrl = `${SITE_ORIGIN}${canonicalPath}`;

  let html = baseHtml
    .replace(/<title>.*?<\/title>/i, `<title>${escapeAttr(route.title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${escapeAttr(route.description)}" />`
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${escapeAttr(route.title)}" />`
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:description" content="${escapeAttr(route.description)}" />`
    )
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:url" content="${escapeAttr(fullCanonicalUrl)}" />`
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`
    )
    .replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${escapeAttr(fullCanonicalUrl)}" />`
    );

  if (!route.indexable) {
    html = html.replace(
      /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="robots" content="noindex, nofollow" />`
    );
  }

  return html;
}

function generateStaticSitemapAndRobots() {
  const today = new Date().toISOString().slice(0, 10);
  const indexableRoutes = [
    {
      path: '/',
      priority: 1.0,
      changefreq: 'weekly',
    },
    ...STATIC_ROUTES.filter((r) => r.indexable),
  ];

  const urlEntries = indexableRoutes.map(
    (r) => `  <url>
    <loc>${SITE_ORIGIN}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(2)}</priority>
  </url>`
  );

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>
`;

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /proposta
Disallow: /rodoviario

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');
}

function run() {
  if (!fs.existsSync(baseIndexPath)) {
    console.error('[postbuild-seo] dist/index.html não encontrado. Execute vite build primeiro.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(baseIndexPath, 'utf8');
  let generatedCount = 0;

  for (const route of STATIC_ROUTES) {
    const cleanRel = route.path.replace(/^\/+|\/+$/g, '');
    if (!cleanRel) continue;

    const targetDir = path.join(distDir, cleanRel);
    fs.mkdirSync(targetDir, { recursive: true });

    const routeHtml = customizeHtmlForRoute(baseHtml, route);
    fs.writeFileSync(path.join(targetDir, 'index.html'), routeHtml, 'utf8');
    generatedCount++;
  }

  generateStaticSitemapAndRobots();

  console.log(
    `[postbuild-seo] Sucesso: ${generatedCount} diretórios físicos de rotas gerados em dist/ (incluindo /rodoviario, /gestao-de-viagens, /lazer, etc.) + sitemap.xml e robots.txt.`
  );
}

run();
