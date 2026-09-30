import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Leaf, 
  FileCheck2, 
  Lock, 
  Scale, 
  Users, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Building2, 
  CheckCircle2, 
  Eye, 
  Layers, 
  Globe, 
  FileText, 
  Fingerprint, 
  AlertCircle,
  Award
} from 'lucide-react';

interface ComplianceEsgViewProps {
  onBackToHome: () => void;
  onOpenDiagnosis: () => void;
  onOpenLegalTab?: (tab: string) => void;
  onNavigateToSection?: (target: string) => void;
}

export const ComplianceEsgView: React.FC<ComplianceEsgViewProps> = ({
  onBackToHome,
  onOpenDiagnosis,
  onOpenLegalTab,
  onNavigateToSection
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [activeCategory, setActiveCategory] = useState<'todos' | 'governanca' | 'seguranca' | 'esg'>('todos');

  // 5 Pilares de "O que entregamos"
  const entregas = [
    {
      num: '01',
      tag: 'Governança Corporativa',
      category: 'governanca',
      icon: Scale,
      badge: 'Alçadas & Processos',
      title: 'Processos, responsabilidades e controles',
      desc: 'Estruturação formal de alçadas de decisão, documentação rastreável e segregação rigorosa de funções operacionais.',
      whatsappMsg: 'Olá, gostaria de saber mais sobre governança corporativa na gestão de viagens com a NC Turismo.',
      items: [
        'Processos operacionais e financeiros estruturados',
        'Transparência e prestação de contas integral',
        'Definição clara de papéis e responsabilidades',
        'Controles internos para mitigação de fraudes e desvios'
      ]
    },
    {
      num: '02',
      tag: 'Proteção de Dados e Privacidade',
      category: 'seguranca',
      icon: Fingerprint,
      badge: 'LGPD Compliance',
      title: 'Tratamento responsável das informações',
      desc: 'Adequação irrestrita à Lei Geral de Proteção de Dados (Lei 13.709/2018), com guarda segura de dados sensíveis de viajantes.',
      whatsappMsg: 'Olá, gostaria de saber mais sobre as práticas de privacidade e LGPD da NC Turismo.',
      items: [
        'Conformidade técnica e jurídica com a LGPD',
        'Tratamento responsável e justificado das informações pessoais',
        'Criptografia na guarda de documentos e dados cadastrais',
        'Boas práticas de privacidade incorporadas ao dia a dia'
      ]
    },
    {
      num: '03',
      tag: 'Segurança da Informação',
      category: 'seguranca',
      icon: Lock,
      badge: 'PCI DSS Certificado',
      title: 'Controle, monitoramento e continuidade',
      desc: 'Ambiente tecnológico homologado com os mais altos padrões de segurança de pagamentos e tráfego de dados.',
      whatsappMsg: 'Olá, gostaria de saber mais sobre a certificação PCI DSS e segurança da informação da NC Turismo.',
      items: [
        'Ambiente transacional com certificação PCI DSS',
        'Processos contínuos de controle e monitoramento de rede',
        'Proteção ativa de dados corporativos e financeiros',
        'Planos de contingência e atenção à continuidade operacional',
        'Gestão responsável e confidencialidade estrita de dados'
      ]
    },
    {
      num: '04',
      tag: 'Compliance Corporativo',
      category: 'governanca',
      icon: FileCheck2,
      badge: 'Auditoria Pronta',
      title: 'Conformidade, auditoria e rastreabilidade',
      desc: 'Histórico auditável de cada reserva, alteração e aprovação para comitês internos, conselhos e auditorias externas.',
      whatsappMsg: 'Olá, quero entender o suporte a processos de auditoria e compliance oferecido pela NC Turismo.',
      items: [
        'Conformidade com políticas e limites internos de cada cliente',
        'Apoio técnico ágil em processos de auditoria interna e externa',
        'Rastreabilidade total das operações com logs imutáveis',
        'Mais segurança jurídica para clientes corporativos e parceiros'
      ]
    },
    {
      num: '05',
      tag: 'Responsabilidade ESG',
      category: 'esg',
      icon: Leaf,
      badge: 'Sustentabilidade & Ética',
      title: 'Sustentabilidade, pessoas e ética',
      desc: 'Compromisso com o meio ambiente, valorização dos colaboradores e conduta ética em todas as relações com fornecedores.',
      whatsappMsg: 'Olá, quero conhecer as iniciativas de ESG e relatórios de carbono da NC Turismo.',
      items: [
        'Compromisso com práticas sustentáveis e mensuração de impacto',
        'Valorização contínua das pessoas e diversidade no ambiente de trabalho',
        'Relacionamento ético, transparente e íntegro com fornecedores',
        'Evolução contínua em governança e responsabilidade socioambiental'
      ]
    }
  ];

  const filteredEntregas = activeCategory === 'todos'
    ? entregas
    : entregas.filter(e => e.category === activeCategory);

  // 5 Benefícios para sua empresa
  const beneficios = [
    {
      title: 'Mais segurança na contratação',
      desc: 'Processos e práticas auditadas que respaldam decisões corporativas com tranquilidade jurídica e operacional.',
      badge: 'Segurança Jurídica',
      icon: ShieldCheck
    },
    {
      title: 'Maior transparência operacional',
      desc: 'Clareza cristalina nos fluxos, aprovações, responsabilidades e controles financeiros sem zonas cinzentas.',
      badge: 'Transparência',
      icon: Eye
    },
    {
      title: 'Apoio a processos de auditoria e homologação',
      desc: 'Documentação, rastreabilidade e conformidade prontas para aprovar seu processo de homologação em grandes empresas multinacionais.',
      badge: 'Homologação Rápida',
      icon: FileCheck2
    },
    {
      title: 'Proteção das informações corporativas',
      desc: 'Conformidade estrita com requisitos de privacidade, segurança da informação, certificação PCI DSS e LGPD.',
      badge: 'Blindagem de Dados',
      icon: Lock
    },
    {
      title: 'Relacionamentos comerciais mais confiáveis',
      desc: 'Mais estabilidade e previsibilidade para clientes, fornecedores e departamentos de compras, controladoria e RH.',
      badge: 'Parceria de Longo Prazo',
      icon: Users
    }
  ];

  // 4 Pilares de Certificação e Conformidade
  const selosConformidade = [
    {
      nome: 'PCI DSS Compliant',
      tag: 'Segurança de Pagamentos',
      desc: 'Padrão internacional de segurança da informação para organizações que lidam com cartões de crédito e pagamentos virtuais.',
      icon: Lock,
      status: 'Certificado & Ativo'
    },
    {
      nome: 'Conformidade LGPD',
      tag: 'Privacidade de Dados',
      desc: 'Adequação total à Lei Geral de Proteção de Dados (Lei 13.709/2018), com encarregado DPO e política de privacidade transparente.',
      icon: Fingerprint,
      status: 'Homologado'
    },
    {
      nome: 'Trilha de Auditoria 100%',
      tag: 'Governança & Rastreabilidade',
      desc: 'Todos os registros de emissões, alterações, cancelamentos e aprovações contam com carimbo de tempo e usuário responsável.',
      icon: FileCheck2,
      status: 'Auditável'
    },
    {
      nome: 'Indicadores ESG & CO₂',
      tag: 'Responsabilidade Ambiental',
      desc: 'Relatórios gerenciais com estimativa de emissão de carbono por trecho aéreo para apoiar o balanço de sustentabilidade do cliente.',
      icon: Leaf,
      status: 'Relatórios Disponíveis'
    }
  ];

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#C8102E] selection:text-white relative overflow-hidden">
      {/* Soft atmospheric background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-red-100/30 via-orange-50/20 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[600px] right-0 w-[550px] h-[600px] bg-gradient-to-l from-amber-100/25 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-0 w-[600px] h-[600px] bg-gradient-to-r from-red-100/20 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Header / Breadcrumb */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-5">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-[#C8102E] transition-colors text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft size={16} /> Voltar à página principal
          </button>

          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/80 text-[#C8102E] text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Scale size={13} className="text-[#DB8902]" /> Soluções Corporativas · Compliance e ESG
          </span>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
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
              NC Turismo · Governança, Compliance e Responsabilidade
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
              Governança, transparência e responsabilidade para <span className="bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] bg-clip-text text-transparent">apoiar sua operação</span>.
            </h1>

            <p className="text-base md:text-xl text-slate-600 leading-relaxed font-normal">
              Empresas modernas exigem cada vez mais segurança, conformidade e responsabilidade de seus fornecedores. A NC Turismo atua com foco em boas práticas de governança, proteção de dados, conformidade operacional e responsabilidade corporativa.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="https://wa.me/554132811153?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20NC%20Turismo%20e%20gostaria%20de%20saber%20mais%20sobre%20Compliance%20e%20ESG."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:brightness-105 active:scale-[0.99] transition-all shadow-xl shadow-red-500/25 cursor-pointer"
              >
                <MessageCircle size={18} />
                <span>Falar com a NC Turismo</span>
              </a>

              <a
                href="#beneficios-nc"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('beneficios-nc');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-4 bg-white hover:bg-slate-50 text-[#0F172A] font-semibold text-sm rounded-xl border border-slate-200 transition-all shadow-2xs hover:border-slate-300 cursor-pointer"
              >
                <span>Ver benefícios corporativos</span>
                <ArrowRight size={16} className="text-[#C8102E]" />
              </a>

              <button
                onClick={onOpenDiagnosis}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#C8102E] py-2 px-3 transition-colors cursor-pointer"
              >
                Solicitar Parecer de Homologação &rarr;
              </button>
            </div>

            {/* Micro Metrics Bar */}
            <div className="pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">PCI DSS</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Certificação Global</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#C8102E] tracking-tight">100% LGPD</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Conformidade Legal</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#DB8902] tracking-tight">Rastreável</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Trilha de Auditoria</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">ESG Ready</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Relatório de Emissões</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPROMISSO INSTITUCIONAL */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-8 md:p-12 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DB8902]">
              Compromisso Institucional · Princípios Inegociáveis
            </span>
            <span className="h-1 w-8 bg-[#DB8902] rounded-full" />
          </div>

          <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight leading-snug">
            Relações comerciais mais transparentes, seguras e sustentáveis
          </h2>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-4xl">
            A NC Turismo contribui para relações comerciais mais transparentes e sustentáveis por meio de processos estruturados, controles internos, atenção à proteção de dados e compromisso com a evolução contínua.
          </p>

          {/* Destaque / Citação */}
          <div className="border-l-4 border-[#C8102E] bg-gradient-to-r from-red-50/60 to-transparent pl-6 pr-4 py-4 rounded-r-2xl">
            <p className="text-[#0F172A] font-semibold text-lg md:text-xl italic leading-relaxed">
              &ldquo;Nosso compromisso é apoiar clientes, colaboradores e parceiros por meio de processos estruturados e da busca contínua por evolução.&rdquo;
            </p>
          </div>

          {/* Grid de 4 Pilares de Homologação */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {selosConformidade.map((selo, idx) => {
              const IconComp = selo.icon;
              return (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl bg-[#FAFCFF] border border-slate-200/80 space-y-2 hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-[#C8102E] flex items-center justify-center">
                        <IconComp size={16} />
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {selo.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#0F172A]">{selo.nome}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{selo.desc}</p>
                  </div>
                  <span className="text-[10px] font-mono text-[#DB8902] font-bold block pt-2 border-t border-slate-100">
                    {selo.tag}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* O QUE ENTREGAMOS (5 PILARES COM RECURSOS) */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="bg-gradient-to-b from-[#FFFDFB] to-[#F8FAFC] border border-slate-200/90 rounded-[28px] p-8 md:p-12 shadow-sm space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200/80">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C8102E] block">
                O que entregamos · Pilares de Conformidade
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight">
                Práticas que fortalecem a confiança na operação
              </h2>
              <p className="text-slate-600 text-sm md:text-base">
                Conheça as diretrizes operacionais, tecnológicas e éticas implementadas pela NC Turismo para proteger sua empresa.
              </p>
            </div>

            {/* Filtros interativos */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'todos', label: 'Todos os Pilares (5)' },
                { id: 'governanca', label: 'Governança & Compliance' },
                { id: 'seguranca', label: 'Segurança & LGPD' },
                { id: 'esg', label: 'ESG & Sustentabilidade' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-[#C8102E] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid dos 5 Pilares */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntregas.map((entrega) => {
              const IconComp = entrega.icon;
              return (
                <div
                  key={entrega.num}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 flex flex-col justify-between hover:border-[#C8102E]/40 hover:shadow-md transition-all group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Top Tag & Number */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#DB8902]">
                        {entrega.num} · {entrega.tag}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-50 text-[#C8102E] border border-red-200/60">
                        {entrega.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 text-[#C8102E] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <IconComp size={22} />
                      </div>
                      <h3 className="text-lg font-bold text-[#0F172A] leading-snug group-hover:text-[#C8102E] transition-colors">
                        {entrega.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {entrega.desc}
                    </p>

                    {/* Bullet List */}
                    <div className="pt-4 border-t border-slate-100 space-y-2.5">
                      {entrega.items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                          <Check size={14} className="text-[#C8102E] shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action WhatsApp */}
                  <div className="pt-5 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={`https://wa.me/554132811153?text=${encodeURIComponent(entrega.whatsappMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8102E] hover:text-[#DB8902] transition-colors cursor-pointer"
                    >
                      <MessageCircle size={14} />
                      <span>Saiba mais sobre {entrega.tag}</span>
                    </a>
                    <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-1 group-hover:text-[#C8102E] transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* BENEFÍCIOS PARA SUA EMPRESA (id="beneficios-nc") */}
      <section id="beneficios-nc" className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16 scroll-mt-28">
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-8 md:p-12 shadow-sm space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DB8902] block">
              Benefícios para sua empresa
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight">
              Mais segurança, transparência e confiança na contratação
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Entenda como uma governança madura protege seu departamento de compras e garante aprovações ágeis nos comitês de homologação.
            </p>
          </div>

          {/* Grid de 5 Benefícios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            {beneficios.map((ben, idx) => {
              const BenIcon = ben.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#FAFCFF] border-l-4 border-l-[#C8102E] border border-slate-200/80 rounded-xl p-5 space-y-3 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-[#C8102E] border border-red-200/60">
                        {ben.badge}
                      </span>
                      <BenIcon size={16} className="text-[#DB8902]" />
                    </div>

                    <strong className="block text-base font-bold text-[#0F172A] leading-snug">
                      {ben.title}
                    </strong>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {ben.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* COMPROMISSO COM A EVOLUÇÃO CONTÍNUA */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-8 md:p-12 shadow-sm space-y-6">
          <div className="space-y-3 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C8102E] block">
              Compromisso com a evolução contínua
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight leading-snug">
              Governança, compliance e ESG são temas em constante desenvolvimento
            </h2>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              Por isso, investimos continuamente em processos, tecnologia e boas práticas para fortalecer nossa atuação e apoiar as necessidades de clientes cada vez mais exigentes.
            </p>
          </div>

          <div className="border-l-4 border-[#DB8902] bg-gradient-to-r from-amber-50/60 to-transparent pl-6 pr-4 py-4 rounded-r-2xl">
            <p className="text-[#0F172A] font-semibold text-lg md:text-xl italic leading-relaxed">
              &ldquo;Porque governança não é apenas uma exigência de mercado. É a base para relações de longo prazo.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* BANNER CTA DE ALTA CONVERSÃO */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 mb-16">
        <div 
          className="relative overflow-hidden rounded-[32px] p-8 md:p-14 lg:p-16 text-center space-y-8 shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #FFFDFB 0%, #FFF4E5 40%, #FFE9CC 100%)',
            border: '1px solid rgba(219, 137, 2, 0.35)'
          }}
        >
          {/* Ambient spots */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-red-200/30 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-amber-200/40 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-amber-200 text-[#DB8902] text-xs font-bold uppercase tracking-widest shadow-2xs">
              <Sparkles size={13} className="text-[#C8102E]" /> Compliance & Governança · NC Turismo
            </span>

            <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-extrabold text-[#0F172A] tracking-tight leading-tight">
              Confiança construída com processos, pessoas e responsabilidade
            </h2>

            <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal">
              Mais do que atender viagens corporativas, buscamos construir relações duradouras baseadas em transparência, segurança, conformidade e compromisso com a evolução contínua.
            </p>

            <p className="text-base md:text-lg text-slate-800 font-semibold italic">
              Porque governança não é apenas uma exigência de mercado. É a base para relações de longo prazo.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <a
              href="https://wa.me/554132811153?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20NC%20Turismo%20e%20gostaria%20de%20saber%20mais%20sobre%20Compliance%20e%20ESG."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:brightness-105 active:scale-[0.99] transition-all shadow-xl shadow-red-500/25 cursor-pointer"
            >
              <MessageCircle size={18} />
              <span>Falar com a NC Turismo</span>
            </a>

            <button
              onClick={onOpenDiagnosis}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-[#0F172A] font-bold text-sm uppercase tracking-wider rounded-xl border border-slate-300 hover:border-slate-400 transition-all shadow-md cursor-pointer"
            >
              <span>Solicitar Kit de Homologação</span>
              <ArrowRight size={16} className="text-[#C8102E]" />
            </button>
          </div>

          {/* Micro Footer */}
          <div className="pt-6 border-t border-amber-200/60 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 relative z-10">
            <a href="tel:04132811153" className="inline-flex items-center gap-2 hover:text-[#C8102E] transition-colors font-medium">
              <Phone size={14} className="text-[#DB8902]" /> (41) 3281-1153
            </a>
            <a href="mailto:corporativo@ncturismo.com.br" className="inline-flex items-center gap-2 hover:text-[#C8102E] transition-colors font-medium">
              <Mail size={14} className="text-[#DB8902]" /> corporativo@ncturismo.com.br
            </a>
            <span className="inline-flex items-center gap-2 font-medium">
              <MapPin size={14} className="text-[#DB8902]" /> Centro · Curitiba / PR
            </span>
          </div>

        </div>
      </section>

    </div>
  );
};
