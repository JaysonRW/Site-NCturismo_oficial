import React from 'react';
import { Headphones, ArrowRight, ShieldCheck, Clock, MapPin, Sparkles } from 'lucide-react';

export const HumanSupport: React.FC = () => {
  return (
    <section id="plantao" className="relative w-full py-20 md:py-28 overflow-hidden bg-[#08090C] border-t border-white/5">
      
      {/* BACKGROUND - LAYER 1: PHOTOGRAPHY & AMBIENCE */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="/fachada.png" 
          alt="Fachada NC Turismo" 
          className="w-full h-full object-cover object-center opacity-25 filter brightness-75 scale-100"
        />
        {/* Gradients and Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-[#08090C]/85 to-[#08090C]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090C] via-transparent to-[#08090C]/80" />
      </div>

      {/* MIDGROUND - LAYER 2: SUBTLE GRID */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="hs-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#ffffff" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#hs-dots)" />
        </svg>
      </div>

      {/* LIGHT GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-[#C8102E]/10 via-[#DB8902]/10 to-transparent blur-[120px] rounded-full pointer-events-none z-0" />

      {/* EDITORIAL UI (Top markers) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10 relative z-20 flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#DB8902] animate-pulse" />
          <p className="text-[10px] md:text-xs text-nc-warm/60 tracking-[0.25em] font-semibold uppercase font-mono">
            NC Turismo · Continuidade Operacional
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DB8902]/15 border border-[#DB8902]/30 text-[#DB8902] text-xs font-mono font-bold tracking-wider">
            <Clock size={12} /> Plantão 24/7
          </span>
          <span className="text-[10px] text-nc-warm/40 tracking-wider uppercase font-mono hidden sm:inline-block">
            Onde você estiver · Sempre com você
          </span>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        
        {/* Headlines */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-nc-warm/80 uppercase tracking-widest">
            <ShieldCheck size={14} className="text-[#DB8902]" /> Suporte Humano Especializado
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.12]">
            Quando os planos mudam,{' '}
            <span className="text-white block sm:inline">a viagem </span>
            <span className="bg-gradient-to-r from-[#C8102E] via-[#DB8902] to-[#F59E0B] bg-clip-text text-transparent font-extrabold">
              continua.
            </span>
          </h2>
          
          <p className="text-nc-warm/80 text-base md:text-xl font-light max-w-2xl mx-auto leading-relaxed pt-2">
            Imprevistos fazem parte da jornada. Nossa equipe permanece ao lado do viajante para orientar, reorganizar bilhetes, conexões e hotéis com agilidade e atendimento humanizado.
          </p>
        </div>

        {/* STATIC VISUAL ROUTE (Sem pin/scroll scrubbing) */}
        <div className="w-full max-w-3xl my-10 p-6 md:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 bg-[#DB8902]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Route Visualizer */}
          <div className="relative w-full h-[140px] md:h-[180px]">
            <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible">
              
              {/* Planned route dashed line */}
              <path 
                d="M 100,140 Q 300,20 700,100" 
                fill="none" 
                stroke="#334155" 
                strokeWidth="2.5" 
                strokeDasharray="6,6" 
              />

              {/* Resolved / New Route Solid Amber line */}
              <path 
                d="M 350,65 Q 460,140 540,150 Q 620,155 700,100" 
                fill="none" 
                stroke="#DB8902" 
                strokeWidth="3" 
                strokeDasharray="6,4" 
              />

              {/* Origin (CWB) */}
              <circle cx="100" cy="140" r="5" fill="#DB8902" />
              <text x="100" y="165" fill="white" fontSize="13" textAnchor="middle" fontWeight="bold">CWB</text>
              <text x="100" y="180" fill="#94A3B8" fontSize="10" textAnchor="middle" letterSpacing="0.05em">Curitiba</text>

              {/* Alert / Re-routing point */}
              <g transform="translate(350, 65)">
                <circle cx="0" cy="0" r="13" fill="#0F172A" stroke="#EF4444" strokeWidth="2" />
                <text x="0" y="4" fill="#EF4444" fontSize="13" textAnchor="middle" fontWeight="bold">!</text>
                <text x="0" y="24" fill="#EF4444" fontSize="9" textAnchor="middle" fontWeight="bold" letterSpacing="0.1em">ALTERAÇÃO</text>
              </g>

              {/* Alternative connection point (LIS) */}
              <g transform="translate(540, 150)">
                <circle cx="0" cy="0" r="5" fill="#0F172A" stroke="#DB8902" strokeWidth="2" />
                <text x="0" y="22" fill="white" fontSize="13" textAnchor="middle" fontWeight="bold">LIS</text>
                <text x="0" y="36" fill="#94A3B8" fontSize="10" textAnchor="middle">Lisboa</text>
              </g>

              {/* Destination (MAD) */}
              <g transform="translate(700, 100)">
                <circle cx="0" cy="0" r="6" fill="#22C55E" />
                <text x="0" y="25" fill="white" fontSize="13" textAnchor="middle" fontWeight="bold">MAD</text>
                <text x="0" y="40" fill="#94A3B8" fontSize="10" textAnchor="middle" letterSpacing="0.05em">Madri</text>
              </g>

              {/* Airplane at Destination */}
              <g transform="translate(670, 95) rotate(-15)">
                <svg x="-12" y="-12" width="24" height="24" viewBox="0 0 24 24" fill="#DB8902">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
              </g>

            </svg>
          </div>

          {/* Micro Legend & Status Pill */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs text-nc-warm/70">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-0.5 bg-slate-500 inline-block" /> Rota Original
              </span>
              <span className="flex items-center gap-1.5 text-[#DB8902]">
                <span className="w-3 h-0.5 bg-[#DB8902] inline-block" /> Nova Rota Resolvida pela NC
              </span>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-medium text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Passageiro Conectado & Seguro
            </span>
          </div>

        </div>

        {/* BOTTOM CALL TO ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-2">
          <a
            href="https://wa.me/554132811153?text=Ol%C3%A1%2C%20preciso%20de%20atendimento%20do%20Plant%C3%A3o%2024h%20da%20NC%20Turismo."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] text-white font-bold text-sm uppercase tracking-wider rounded-full hover:brightness-105 active:scale-[0.99] transition-all shadow-xl shadow-red-500/20 cursor-pointer"
          >
            <Headphones size={18} />
            <span>Acionar Suporte 24h</span>
            <ArrowRight size={16} />
          </a>

          <a 
            href="#diagnostico" 
            className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm transition-colors cursor-pointer"
          >
            <span>Conhecer Gestão Corporativa</span>
            <ArrowRight size={14} className="text-[#DB8902]" />
          </a>
        </div>

      </div>
    </section>
  );
};
