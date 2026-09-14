import React from 'react';

export const HeroUI: React.FC = () => {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-8 h-screen flex flex-col justify-center pointer-events-none">
      <div className="max-w-[700px] mt-20 pointer-events-auto">
        <p className="text-[#DB8902] font-bold tracking-[3px] text-xs mb-6 uppercase">
          We Are Travel
        </p>
        <h1 className="text-white text-5xl md:text-[64px] font-medium leading-[1.15] tracking-[-1.5px] mb-8">
          Gestão inteligente <br />
          para viagens <br />
          corporativas.
        </h1>
        <p className="text-white/70 text-lg md:text-[19px] leading-[1.6] mb-12 max-w-lg">
          Tecnologia, atendimento e estratégia para empresas irem mais longe.
        </p>
        <div className="flex flex-col sm:flex-row gap-5">
          <button className="inline-flex items-center justify-center gap-3 px-10 py-[18px] bg-[#DB8902] rounded-full text-white text-[13px] uppercase tracking-[1.5px] font-bold hover:bg-[#b57100] transition-colors shadow-lg shadow-[#DB8902]/20">
            Solicitar diagnóstico <span className="opacity-90 font-normal text-lg leading-none">→</span>
          </button>
          <button className="inline-flex items-center justify-center gap-4 px-10 py-[18px] bg-transparent border border-white/20 rounded-full text-white/90 text-[13px] uppercase tracking-[1.5px] font-medium hover:border-white hover:bg-white/5 transition-all">
            Conheça a NC
          </button>
        </div>
      </div>
    </div>
  );
};
