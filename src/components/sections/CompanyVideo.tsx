import React, { useState } from 'react';
import { Play, Sparkles, ShieldCheck, Building2, Headphones, ArrowRight, MessageCircle } from 'lucide-react';

interface CompanyVideoProps {
  onOpenConsultant?: () => void;
}

export const CompanyVideo: React.FC<CompanyVideoProps> = ({ onOpenConsultant }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = 'gtU0AVaPSnU';
  const whatsappUrl = "https://wa.me/554132811153?text=Ol%C3%A1%2C%20assisti%20ao%20v%C3%ADdeo%20da%20NC%20Turismo%20e%20gostaria%20de%20conversar%20sobre%20as%20viagens%20da%20minha%20empresa.";

  return (
    <section id="apresentacao-video" className="relative py-20 md:py-28 bg-[#0B0D13] text-white overflow-hidden border-t border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-red-600/15 via-[#DB8902]/15 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C8102E]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-[1320px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header da Seção */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles size={14} className="text-[#DB8902]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#DB8902]">
              Vídeo Institucional · Conheça a NC Turismo
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.15]">
            Estrutura real, tecnologia ágil e{' '}
            <span className="bg-gradient-to-r from-[#C8102E] via-[#E53935] to-[#DB8902] bg-clip-text text-transparent">
              presença de verdade
            </span>.
          </h2>

          <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Dê o play e conheça os bastidores da agência que conecta pessoas, empresas e destinos com atendimento consultivo, inovação e solidez.
          </p>
        </div>

        {/* Video Player Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Outer glowing border card */}
          <div className="p-1 md:p-2 rounded-3xl md:rounded-[32px] bg-gradient-to-b from-white/15 via-white/5 to-white/0 shadow-[0_20px_80px_rgba(0,0,0,0.8)] border border-white/10">
            <div className="relative aspect-video w-full rounded-2xl md:rounded-[26px] overflow-hidden bg-black shadow-2xl">
              
              {!isPlaying ? (
                /* Custom Poster & Play Trigger (Fast Initial Load) */
                <div 
                  onClick={() => setIsPlaying(true)}
                  className="group relative w-full h-full cursor-pointer overflow-hidden flex items-center justify-center select-none"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setIsPlaying(true);
                    }
                  }}
                  aria-label="Assistir ao vídeo de apresentação da NC Turismo"
                >
                  {/* YouTube High-Resolution Thumbnail */}
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt="Vídeo de apresentação da NC Turismo"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback para HQ default caso maxres não esteja disponível
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.85] group-hover:brightness-95"
                  />

                  {/* Gradient overlays for cinematic contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 group-hover:via-black/20 transition-all duration-300" />

                  {/* Play Button Pulsing Aura */}
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#C8102E] to-[#DB8902] opacity-40 blur-lg group-hover:opacity-75 group-hover:scale-125 transition-all duration-500 animate-pulse" />
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] text-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/20">
                        <Play size={32} className="fill-white translate-x-0.5 text-white" />
                      </div>
                    </div>

                    <div className="text-center space-y-1">
                      <span className="text-white font-bold text-sm sm:text-base tracking-wider uppercase drop-shadow-md">
                        Assistir Apresentação
                      </span>
                      <p className="text-xs text-white/70 font-medium">
                        Conheça o DNA e a estrutura da NC Turismo
                      </p>
                    </div>
                  </div>

                  {/* Bottom badge overlay */}
                  <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-mono font-medium">
                      HD 1080p
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#C8102E]/80 backdrop-blur-md border border-white/10 text-white text-xs font-semibold">
                      Vídeo Oficial
                    </span>
                  </div>

                </div>
              ) : (
                /* Embedded YouTube Player on Play */
                <iframe
                  className="w-full h-full border-0"
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  title="Apresentação Institucional NC Turismo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}

            </div>
          </div>

          {/* Micro Highlights & CTA Bar below video */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3.5 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-[#C8102E]/15 border border-[#C8102E]/30 text-[#C8102E] flex items-center justify-center shrink-0">
                <Building2 size={20} />
              </div>
              <div>
                <div className="text-white font-bold text-sm leading-tight">Sede Própria em Curitiba</div>
                <div className="text-xs text-slate-400">Estrutura física e portas abertas</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3.5 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-[#DB8902]/15 border border-[#DB8902]/30 text-[#DB8902] flex items-center justify-center shrink-0">
                <Headphones size={20} />
              </div>
              <div>
                <div className="text-white font-bold text-sm leading-tight">Plantão Humanizado 24/7</div>
                <div className="text-xs text-slate-400">Especialistas prontos para atender</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-3 backdrop-blur-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="text-white font-bold text-sm leading-tight">Gestão & Governança</div>
                  <div className="text-xs text-slate-400">Até 30% de economia</div>
                </div>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#C8102E] border border-white/10 hover:border-transparent text-white flex items-center justify-center transition-all cursor-pointer"
                title="Falar com a equipe"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
