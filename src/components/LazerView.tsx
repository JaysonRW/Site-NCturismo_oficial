import React from 'react';
import { 
  Compass, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Plane, 
  Palmtree, 
  ShieldCheck, 
  HeartHandshake,
  ExternalLink,
  PhoneCall
} from 'lucide-react';

interface LazerViewProps {
  onBackToHome: () => void;
  onOpenLegal: (tab: 'privacidade' | 'beneficios' | 'termos') => void;
}

export const LazerView: React.FC<LazerViewProps> = ({
  onBackToHome,
  onOpenLegal
}) => {
  return (
    <div className="pt-28 pb-20 min-h-screen bg-nc-space text-nc-warm selection:bg-nc-orange selection:text-white">
      {/* Breadcrumb / Top bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-nc-warm/60 hover:text-white transition-colors text-xs font-mono uppercase tracking-wider"
          >
            <ArrowLeft size={16} /> Voltar à página principal
          </button>

          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nc-orange/10 border border-nc-orange/30 text-nc-orange text-xs font-mono font-medium">
            <Sparkles size={13} /> Consultoria Exclusiva de Lazer NC
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121620] via-nc-surface to-[#0d0f14] border border-white/10 p-8 md:p-16 lg:p-20 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-nc-warm/90 text-xs font-mono tracking-widest uppercase mb-6">
              NC Viagens de Lazer & Experiências
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.05] mb-6">
              LAZER SOB MEDIDA
            </h1>

            <p className="text-xl md:text-2xl text-nc-orange font-medium mb-6">
              Roteiros sob medida com a curadoria, a segurança e os 38 anos de solidez da NC Turismo.
            </p>

            <p className="text-base md:text-lg text-nc-warm/80 leading-relaxed mb-10">
              Não somos uma agência automatizada em massa ou um comparador genérico de passagens. Criamos experiências de viagem completas e exclusivas para viajantes exigentes, famílias e executivos, com suporte presencial em Curitiba e consultoria personalizada do embarque ao retorno.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#diagnostico"
                onClick={() => {
                  window.location.hash = 'diagnostico';
                }}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-nc-orange text-nc-space font-bold text-sm uppercase tracking-wider rounded-full hover:bg-white transition-all shadow-lg hover:shadow-nc-orange/20"
              >
                Falar com um Consultor de Lazer <ArrowRight size={16} />
              </a>

              <button
                onClick={() => onOpenLegal('beneficios')}
                className="inline-flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 text-white font-medium text-sm uppercase tracking-wider rounded-full hover:bg-white/10 transition-colors"
              >
                Acessar Portal de Benefícios & Convênios <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-nc-surface border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-nc-orange/10 border border-nc-orange/20 flex items-center justify-center text-nc-orange">
              <Compass size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Curadoria Personalizada</h3>
            <p className="text-sm text-nc-warm/75 leading-relaxed">
              Cada itinerário é desenhado de acordo com seus gostos, ritmo e expectativas, integrando passagens nas melhores classes, hotéis boutique, transfers privativos e passeios exclusivos.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-nc-surface border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-nc-orange/10 border border-nc-orange/20 flex items-center justify-center text-nc-orange">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Plantão e Segurança 24h</h3>
            <p className="text-sm text-nc-warm/75 leading-relaxed">
              Viaje com total tranquilidade. Nossa equipe está sempre disponível para resolver remarcações, atrasos, dúvidas de documentação ou qualquer necessidade durante sua viagem.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-nc-surface border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-nc-orange/10 border border-nc-orange/20 flex items-center justify-center text-nc-orange">
              <HeartHandshake size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Benefícios em Viagens</h3>
            <p className="text-sm text-nc-warm/75 leading-relaxed">
              Integração com o ambiente de convênios da sua empresa ou associação para usufruir de condições comerciais e vantagens exclusivas em reservas e pacotes selecionados.
            </p>
          </div>
        </div>
      </section>

      {/* Integration with Beneficios & Parcerias */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="rounded-3xl bg-gradient-to-r from-nc-surface via-[#181d28] to-nc-surface border border-white/10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-nc-orange">
              Para Colaboradores e Associados
            </span>
            <h3 className="text-2xl font-bold text-white">
              Sua empresa ou entidade tem convênio com a NC?
            </h3>
            <p className="text-sm text-nc-warm/80 leading-relaxed">
              Acesse o ambiente exclusivo <span className="text-white font-mono">beneficios.ncturismo.com.br</span> e aproveite tarifas e condições diferenciadas para viagens de férias e lazer de toda a família.
            </p>
          </div>
          <button
            onClick={() => onOpenLegal('beneficios')}
            className="shrink-0 px-8 py-4 bg-nc-orange text-nc-space font-bold text-sm uppercase tracking-wider rounded-full hover:bg-white transition-all shadow-xl"
          >
            Conhecer Benefícios & Parcerias →
          </button>
        </div>
      </section>
    </div>
  );
};
