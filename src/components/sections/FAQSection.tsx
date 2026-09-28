import React, { useState, useMemo, useEffect } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  Sparkles, 
  MessageSquare, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Cpu, 
  Clock, 
  BarChart3,
  Building2,
  FileQuestion,
  X
} from 'lucide-react';

export interface FAQItem {
  id: string;
  category: 'politicas' | 'tecnologia' | 'atendimento' | 'financeiro' | 'beneficios';
  categoryLabel: string;
  question: string;
  answer: string;
  highlights?: string[];
  icon: React.ElementType;
}

export const faqData: FAQItem[] = [
  {
    id: 'politica-viagens',
    category: 'politicas',
    categoryLabel: 'Governança & Políticas',
    question: 'Como funciona o planejamento e a parametrização de políticas de viagens corporativas na NC Turismo?',
    answer: 'Parametrizamos as regras exclusivas da sua organização no sistema OBT corporativo. Aprovações multiníveis, tetos tarifários por cargo/diretoria, antecedência mínima de compra e restrições são auditados em tempo real antes da emissão, evitando compras em não-conformidade e garantindo 100% de obediência ao orçamento aprovado.',
    highlights: [
      'Validação automática de centros de custo e alçadas de aprovação',
      'Bloqueio preventivo de desvios antes do débito financeiro',
      'Fluxos multiníveis configuráveis por filial ou diretoria'
    ],
    icon: ShieldCheck
  },
  {
    id: 'integracao-erp',
    category: 'tecnologia',
    categoryLabel: 'Tecnologia & ERP',
    question: 'Como a NC Turismo integra a gestão de viagens aos sistemas ERP e de RH corporativos?',
    answer: 'Conectamos nossa infraestrutura diretamente aos principais ERPs e plataformas de RH do mercado (como SAP, TOTVS Protheus/Datasul, Senior Sistemas, Workday e Oracle). Os dados de centros de custo, colaboradores e despesas são sincronizados continuamente via APIs homologadas e autenticação corporativa Single Sign-On (SSO), eliminando redigitação manual.',
    highlights: [
      'Conectores para SAP, TOTVS, Senior e Workday',
      'Autenticação corporativa integrada via SSO (SAML / OAuth2)',
      'Sincronização em tempo real de requisições e prestações de contas'
    ],
    icon: Cpu
  },
  {
    id: 'atendimento-plantao',
    category: 'atendimento',
    categoryLabel: 'Atendimento & Plantão 24h',
    question: 'Como opera o plantão consultivo humanizado 24 horas da NC Turismo?',
    answer: 'Nossos clientes corporativos contam com uma equipe própria de consultores seniores bilíngues em regime de plantão ininterrupto 24 horas por dia, 365 dias por ano. O tempo médio de resposta humana é inferior a 15 segundos, atuando com autonomia para remissões de urgência, cancelamentos, suporte em conexões perdidas e crises sem filas de espera ou robôs.',
    highlights: [
      'Tempo médio de resposta humano inferior a 15 segundos',
      'Plantão executivo próprio sem terceirização',
      'Suporte a qualquer hora via telefone, WhatsApp e e-mail'
    ],
    icon: Clock
  },
  {
    id: 'compliance-esg',
    category: 'politicas',
    categoryLabel: 'Governança & Políticas',
    question: 'Quais práticas de compliance, LGPD e sustentabilidade ESG são atendidas nas viagens corporativas?',
    answer: 'A NC Turismo adota rigorosa governança de dados em conformidade com a LGPD (Lei nº 13.709/2018), com rastreabilidade total e localização de passageiros em tempo real (duty of care). Além disso, disponibilizamos relatórios periódicos de pegada ecológica com cálculo de emissões de CO₂ por rota aérea e rodoviária para alimentar os relatórios de sustentabilidade e metas ESG da sua empresa.',
    highlights: [
      'Rastreamento em tempo real de passageiros em trânsito (Duty of Care)',
      'Cálculo e relatórios de pegada de carbono (CO₂) por trajeto',
      'Termos de consentimento e adequação jurídica formal à LGPD'
    ],
    icon: ShieldCheck
  },
  {
    id: 'bi-savings',
    category: 'financeiro',
    categoryLabel: 'Financeiro & Economia',
    question: 'Como os relatórios de BI estratégico geram economia de custos (savings) comprovados?',
    answer: 'Através de dashboards interativos e consultoria de dados trimestral, identificamos rotas frequentes, padrões de antecedência e dispersão tarifária. Com esse volume consolidado, nossa mesa de negociação intermedia tarifas-acordo corporativas com companhias aéreas e redes hoteleiras, proporcionando em média 22% de savings comprovados no budget anual.',
    highlights: [
      'Economia média comprovada de até 22% sobre a tarifa balcão',
      'Dashboards dinâmicos de savings obtidos vs. orçado',
      'Negociação de tarifas-acordo exclusivas com companhias aéreas e hotéis'
    ],
    icon: BarChart3
  },
  {
    id: 'implantacao-tempo',
    category: 'tecnologia',
    categoryLabel: 'Tecnologia & ERP',
    question: 'Quanto tempo leva o processo de implantação da NC Turismo em uma nova empresa?',
    answer: 'O onboarding corporativo padrão é estruturado em etapas ágeis e pode ser concluído entre 5 a 15 dias úteis, a depender da complexidade das políticas e integrações com o ERP. Nossa equipe cuida da parametrização das políticas, importação de usuários, treinamento das secretárias/solicitantes e testes assistidos de emissão.',
    highlights: [
      'Implantação assistida com gerente de contas dedicado',
      'Treinamentos gravados e presenciais/online para aprovadores e solicitantes',
      'Sem interrupção das viagens correntes durante a transição'
    ],
    icon: Building2
  },
  {
    id: 'faturamento-pagamento',
    category: 'financeiro',
    categoryLabel: 'Financeiro & Economia',
    question: 'Como funciona a conciliação de faturamento, prazos de pagamento e emissão de notas?',
    answer: 'Trabalhamos com faturamento corporativo quinzenal ou mensal mediante análise cadastral, emissão de faturas consolidadas por centro de custo, conciliação automática com cartão de crédito corporativo virtual (V-Card) e integração eletrônica de notas fiscais diretamente para a equipe financeira da sua empresa.',
    highlights: [
      'Faturas unificadas e detalhadas com número de bilhete e centro de custo',
      'Suporte a cartões corporativos virtuais (Ghost Card / V-Card)',
      'Acesso 24h via Portal do Cliente para download de 2ª via e extratos'
    ],
    icon: BarChart3
  },
  {
    id: 'beneficios-colaboradores',
    category: 'beneficios',
    categoryLabel: 'Benefícios em Viagens',
    question: 'Colaboradores e dependentes têm acesso a tarifas diferenciadas para viagens de lazer?',
    answer: 'Sim! Através da solução NC Benefícios em Viagens, colaboradores de empresas conveniadas e seus familiares têm acesso a um portal B2C exclusivo de lazer, com tarifas negociadas pela NC Turismo para pacotes, hotéis e passagens pessoais, sem misturar os custos com o orçamento corporativo da empresa.',
    highlights: [
      'Portal exclusivo de lazer para colaboradores e familiares',
      'Tarifas e condições negociadas junto a operadoras e hotéis',
      'Ambiente digital seguro e independente do faturamento corporativo'
    ],
    icon: Sparkles
  }
];

const categories = [
  { id: 'todas', label: 'Todas as Dúvidas' },
  { id: 'politicas', label: 'Governança & Políticas' },
  { id: 'tecnologia', label: 'Tecnologia & ERP' },
  { id: 'atendimento', label: 'Atendimento & Plantão' },
  { id: 'financeiro', label: 'Financeiro & Savings' },
  { id: 'beneficios', label: 'Benefícios em Viagens' }
] as const;

export const FAQSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(faqData[0].id);

  // Schema.org FAQPage Structured Data (JSON-LD) for Search Engine Rich Snippets
  const faqSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqData.map((item) => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': `${item.answer} ${item.highlights ? item.highlights.join(' ') : ''}`
      }
    }))
  }), []);

  // Filter items based on category and search query
  const filteredFaqs = useMemo(() => {
    return faqData.filter((item) => {
      const matchesCategory = selectedCategory === 'todas' || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;

      const matchesText = 
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.categoryLabel.toLowerCase().includes(query) ||
        item.highlights?.some(h => h.toLowerCase().includes(query));

      return matchesCategory && matchesText;
    });
  }, [selectedCategory, searchQuery]);

  const toggleAccordion = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <section 
      id="faq" 
      className="relative w-full py-24 md:py-32 bg-[#0B0D13] text-nc-warm border-t border-b border-white/10 overflow-hidden"
      aria-label="Perguntas Frequentes (FAQ)"
    >
      {/* Schema.org FAQPage Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Background Ambience */}
      <div className="absolute top-1/4 left-0 -translate-x-1/2 w-96 h-96 bg-nc-orange/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 translate-x-1/3 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-nc-orange/10 border border-nc-orange/30 text-nc-orange text-xs font-mono uppercase tracking-[0.14em] font-bold mb-4">
            <HelpCircle size={14} className="text-nc-orange" />
            Central de Dúvidas & Perguntas Frequentes
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.15] mb-4">
            Tudo o que você precisa saber sobre a gestão NC Turismo.
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-nc-warm/75 font-normal leading-relaxed">
            Respostas transparentes e detalhadas sobre governança de políticas, integrações ERP, suporte emergencial 24h e geração de savings para sua empresa.
          </p>
        </div>

        {/* Search & Category Filter Strip */}
        <div className="max-w-4xl mx-auto mb-10 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-nc-warm/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Digite sua dúvida (ex: aprovação, ERP, plantão 24h, savings, LGPD)..."
              className="w-full bg-[#121622] text-white placeholder-nc-warm/40 text-sm md:text-base pl-12 pr-10 py-3.5 rounded-2xl border border-white/10 focus:border-nc-orange focus:outline-none focus:ring-2 focus:ring-nc-orange/20 transition-all shadow-lg"
              aria-label="Buscar dúvida frequente"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-nc-warm/70 hover:text-white flex items-center justify-center transition-colors text-xs"
                title="Limpar busca"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Interactive Category Filter Pills (Wrap gracefully without archaic OS horizontal scrollbars) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1 pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              // Count matching questions for badge
              const count = cat.id === 'todas' 
                ? faqData.length 
                : faqData.filter(f => f.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-nc-orange text-nc-space shadow-md shadow-nc-orange/25 font-bold scale-[1.02]'
                      : 'bg-white/5 hover:bg-white/10 text-nc-warm/75 hover:text-white border border-white/5 hover:border-white/15'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected 
                      ? 'bg-nc-space/30 text-nc-space font-bold' 
                      : 'bg-white/10 text-nc-warm/60'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accordion Questions List */}
        <div className="max-w-4xl mx-auto space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="p-10 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-3">
              <FileQuestion className="w-10 h-10 text-nc-orange/60 mx-auto" />
              <h4 className="text-base font-bold text-white">Nenhuma pergunta encontrada para sua busca</h4>
              <p className="text-xs text-nc-warm/60 max-w-md mx-auto">
                Tente outros termos ou fale diretamente com um de nossos consultores corporativos.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('todas'); }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-nc-orange hover:underline pt-1"
              >
                Limpar filtros e ver todas as dúvidas &rarr;
              </button>
            </div>
          ) : (
            filteredFaqs.map((item, idx) => {
              const isExpanded = expandedId === item.id;
              const ItemIcon = item.icon;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
                    isExpanded
                      ? 'bg-[#121622] border-nc-orange/40 shadow-xl shadow-black/40'
                      : 'bg-[#0f121a]/80 hover:bg-[#121622]/90 border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Accordion Trigger Button */}
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`faq-answer-${item.id}`}
                    id={`faq-question-${item.id}`}
                    className="w-full p-5 md:p-6 text-left flex items-start justify-between gap-4 cursor-pointer select-none group"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isExpanded
                          ? 'bg-nc-orange text-nc-space'
                          : 'bg-white/5 text-nc-orange group-hover:bg-nc-orange/20'
                      }`}>
                        <ItemIcon size={18} />
                      </div>

                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-nc-orange/80 font-bold block mb-1">
                          {item.categoryLabel}
                        </span>
                        <h3 className={`text-sm sm:text-base md:text-lg font-bold transition-colors leading-snug ${
                          isExpanded ? 'text-white' : 'text-nc-warm/90 group-hover:text-white'
                        }`}>
                          {item.question}
                        </h3>
                      </div>
                    </div>

                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 mt-0.5 ${
                      isExpanded
                        ? 'rotate-180 bg-nc-orange/20 text-nc-orange'
                        : 'bg-white/5 text-nc-warm/50 group-hover:text-white group-hover:bg-white/10'
                    }`}>
                      <ChevronDown size={18} />
                    </div>
                  </button>

                  {/* Accordion Content Body */}
                  <div
                    id={`faq-answer-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-question-${item.id}`}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="px-5 pb-6 md:px-6 md:pb-7 pt-1 border-t border-white/5 space-y-4">
                      <p className="text-xs sm:text-sm text-nc-warm/85 leading-relaxed">
                        {item.answer}
                      </p>

                      {item.highlights && item.highlights.length > 0 && (
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-nc-orange font-bold block">
                            Destaques da Solução:
                          </span>
                          <ul className="space-y-1.5">
                            {item.highlights.map((hl, hIdx) => (
                              <li key={hIdx} className="flex items-start gap-2 text-xs text-nc-warm/80">
                                <CheckCircle2 size={14} className="text-nc-orange shrink-0 mt-0.5" />
                                <span>{hl}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Direct Contact / Still Have Questions Footer Card */}
        <div className="max-w-4xl mx-auto mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#141926] via-[#101420] to-[#141926] border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-xs font-mono uppercase tracking-wider text-nc-orange font-bold">
              Atendimento Especializado NC
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-white">
              Sua dúvida é específica ou necessita de proposta personalizada?
            </h4>
            <p className="text-xs sm:text-sm text-nc-warm/70">
              Nossa equipe consultiva está pronta para estruturar a política e o acordo corporativo ideal para sua empresa.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
            <a
              href="https://wa.me/554132811167?text=Ol%C3%A1%2C%20gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20as%20solu%C3%A7%C3%B5es%20corporativas%20da%20NC%20Turismo."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-nc-orange text-nc-space font-bold text-xs uppercase tracking-wider hover:bg-white hover:shadow-lg hover:shadow-nc-orange/20 transition-all cursor-pointer"
            >
              <MessageSquare size={16} />
              <span>Falar no WhatsApp</span>
            </a>

            <a
              href="tel:4132811167"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold text-xs tracking-wider border border-white/10 transition-colors"
            >
              <Phone size={14} className="text-nc-orange" />
              <span>(41) 3281-1167</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
