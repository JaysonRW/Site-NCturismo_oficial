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
      className="relative w-full py-24 md:py-32 bg-[#F8FAFC] text-[#0F172A] border-t border-b border-slate-200/90 overflow-hidden"
      aria-label="Perguntas Frequentes (FAQ)"
    >
      {/* Schema.org FAQPage Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Background Ambience: Soft, luminous atmospheric glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-red-100/30 via-orange-50/20 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-l from-amber-100/25 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.25] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 border border-red-200/90 text-[#C8102E] text-xs font-bold uppercase tracking-wider shadow-2xs mb-4">
            <HelpCircle size={14} className="text-[#DB8902]" />
            Central de Dúvidas &amp; Perguntas Frequentes
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-[#0F172A] tracking-tight leading-[1.15] mb-4">
            Tudo o que você precisa saber sobre a gestão <span className="bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] bg-clip-text text-transparent">NC Turismo</span>.
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 font-normal leading-relaxed">
            Respostas transparentes e detalhadas sobre governança de políticas, integrações ERP, suporte emergencial 24h e geração de savings para sua empresa.
          </p>
        </div>

        {/* Search & Category Filter Strip */}
        <div className="max-w-4xl mx-auto mb-10 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Digite sua dúvida (ex: aprovação, ERP, plantão 24h, savings, LGPD)..."
              className="w-full bg-white text-[#0F172A] placeholder-slate-400 text-sm md:text-base pl-12 pr-10 py-3.5 rounded-2xl border border-slate-200 focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-red-100 transition-all shadow-sm"
              aria-label="Buscar dúvida frequente"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors text-xs cursor-pointer"
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
                      ? 'bg-gradient-to-r from-[#C8102E] to-[#DB8902] text-white shadow-md shadow-red-500/20 font-bold scale-[1.02] border border-transparent'
                      : 'bg-white hover:bg-red-50/50 text-slate-600 hover:text-[#C8102E] border border-slate-200/90 hover:border-red-200 shadow-2xs'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected 
                      ? 'bg-white/25 text-white font-bold' 
                      : 'bg-slate-100 text-slate-500'
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
            <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
              <FileQuestion className="w-10 h-10 text-[#DB8902] mx-auto" />
              <h4 className="text-base font-bold text-[#0F172A]">Nenhuma pergunta encontrada para sua busca</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Tente outros termos ou fale diretamente com um de nossos consultores corporativos.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('todas'); }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8102E] hover:underline pt-1 cursor-pointer"
              >
                Limpar filtros e ver todas as dúvidas &rarr;
              </button>
            </div>
          ) : (
            filteredFaqs.map((item) => {
              const isExpanded = expandedId === item.id;
              const ItemIcon = item.icon;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
                    isExpanded
                      ? 'bg-white border-2 border-[#C8102E]/70 shadow-xl shadow-red-500/5'
                      : 'bg-white hover:bg-slate-50/80 border-slate-200/90 hover:border-red-300 shadow-2xs hover:shadow-md'
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
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-2xs ${
                        isExpanded
                          ? 'bg-gradient-to-br from-[#C8102E] to-[#DB8902] text-white'
                          : 'bg-red-50 text-[#C8102E] border border-red-100 group-hover:bg-red-100/70'
                      }`}>
                        <ItemIcon size={18} />
                      </div>

                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#DB8902] font-bold block mb-1">
                          {item.categoryLabel}
                        </span>
                        <h3 className={`text-sm sm:text-base md:text-lg font-bold transition-colors leading-snug ${
                          isExpanded ? 'text-[#0F172A]' : 'text-slate-800 group-hover:text-[#C8102E]'
                        }`}>
                          {item.question}
                        </h3>
                      </div>
                    </div>

                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 mt-0.5 ${
                      isExpanded
                        ? 'rotate-180 bg-red-50 text-[#C8102E]'
                        : 'bg-slate-100 text-slate-400 group-hover:text-[#0F172A] group-hover:bg-slate-200'
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
                    <div className="px-5 pb-6 md:px-6 md:pb-7 pt-1 border-t border-slate-100 space-y-4">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {item.answer}
                      </p>

                      {item.highlights && item.highlights.length > 0 && (
                        <div 
                          className="p-4 rounded-xl space-y-2 border border-amber-200/80 shadow-2xs"
                          style={{
                            background: 'linear-gradient(135deg, #FFFDFB 0%, #FFF7EE 100%)'
                          }}
                        >
                          <span className="text-[11px] font-mono uppercase tracking-wider text-[#C8102E] font-bold block">
                            Destaques da Solução:
                          </span>
                          <ul className="space-y-1.5">
                            {item.highlights.map((hl, hIdx) => (
                              <li key={hIdx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                                <CheckCircle2 size={14} className="text-[#DB8902] shrink-0 mt-0.5" />
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
        <div 
          className="max-w-4xl mx-auto mt-14 p-6 sm:p-8 rounded-3xl border border-red-200/90 shadow-xl shadow-red-500/5 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF9F6 50%, #FFF4E8 100%)'
          }}
        >
          <div className="space-y-1.5 text-center md:text-left relative z-10">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C8102E] font-bold">
              Atendimento Especializado NC
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-[#0F172A]">
              Sua dúvida é específica ou necessita de proposta personalizada?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Nossa equipe consultiva está pronta para estruturar a política e o acordo corporativo ideal para sua empresa.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center relative z-10">
            <a
              href="https://wa.me/554132811167?text=Ol%C3%A1%2C%20gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20as%20solu%C3%A7%C3%B5es%20corporativas%20da%20NC%20Turismo."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] text-white font-bold text-xs uppercase tracking-wider hover:brightness-105 shadow-md shadow-red-500/20 transition-all cursor-pointer"
            >
              <MessageSquare size={16} />
              <span>Falar no WhatsApp</span>
            </a>

            <a
              href="tel:4132811167"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white hover:bg-red-50 text-slate-700 hover:text-[#C8102E] font-semibold text-xs tracking-wider border border-slate-200 hover:border-red-200 shadow-2xs transition-colors cursor-pointer"
            >
              <Phone size={14} className="text-[#DB8902]" />
              <span>(41) 3281-1167</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
