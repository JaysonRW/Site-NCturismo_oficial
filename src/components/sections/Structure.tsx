import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Settings, BarChart2, Users as UsersIcon, ArrowRight, 
  Plane, Building, Car, ShieldCheck, Star, 
  PiggyBank, Clock, Users
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Coordenadas da linha do gráfico (baseado no path D do SVG)
const chartPoints = [
  { x: 0, y: 60 },
  { x: 30, y: 55 },
  { x: 60, y: 65 },
  { x: 100, y: 50 },
  { x: 140, y: 40 },
  { x: 160, y: 20 },
  { x: 190, y: 15 },
  { x: 200, y: 10 }
];

// Helper para descobrir o Y exato de acordo com a posição X
const getYForX = (targetX: number) => {
  for (let i = 0; i < chartPoints.length - 1; i++) {
    const p1 = chartPoints[i];
    const p2 = chartPoints[i + 1];
    if (targetX >= p1.x && targetX <= p2.x) {
      const progress = (targetX - p1.x) / (p2.x - p1.x);
      return p1.y + (p2.y - p1.y) * progress;
    }
  }
  return chartPoints[chartPoints.length - 1].y;
};

export const Structure: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs para a animação do gráfico
  const clipRef = useRef<SVGRectElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const tooltipGrpRef = useRef<SVGGElement>(null);
  const tooltipTextRef = useRef<SVGTextElement>(null);
  
  // Refs para a animação do donut (80%)
  const donutPathRef = useRef<SVGPathElement>(null);
  const donutTextRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
      }
    });

    // 1. Text elements
    tl.fromTo('.st-text',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );

    // 2. List items
    tl.fromTo('.st-list-item',
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
      "-=0.4"
    );

    // 3. Buttons
    tl.fromTo('.st-btn-group',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
      "-=0.2"
    );

    // 4. Cards pop in
    tl.fromTo('.st-card',
      { y: 40, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.2)' },
      "-=0.5"
    );

    // 5. Indicators strip
    tl.fromTo('.st-indicator-container',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
      "-=0.4"
    );

    // Continuous floating animation for cards
    gsap.to('.st-float-1', { y: -10, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.st-float-2', { y: -15, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.5 });
    gsap.to('.st-float-3', { y: -12, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
    gsap.to('.st-float-4', { y: -8, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.2 });

    // Chart dot scrub animation
    const proxy = { x: 0 };
    gsap.to(proxy, {
      x: 200, // end of the chart path X
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 40%',
        end: 'bottom 40%',
        scrub: 0.5,
      },
      onUpdate: () => {
        const currentX = proxy.x;
        const currentY = getYForX(currentX);

        if (clipRef.current) {
          clipRef.current.setAttribute('width', currentX.toString());
        }
        if (dotRef.current) {
          dotRef.current.setAttribute('cx', currentX.toString());
          dotRef.current.setAttribute('cy', currentY.toString());
        }
        if (tooltipGrpRef.current) {
          tooltipGrpRef.current.setAttribute('transform', `translate(${currentX}, ${currentY - 30})`);
        }
        if (tooltipTextRef.current) {
          const value = Math.floor(320 + (currentX / 200) * (721 - 320));
          tooltipTextRef.current.textContent = value.toString();
        }
      }
    });

    // Donut chart scrub animation
    const donutProxy = { val: 0 };
    gsap.to(donutProxy, {
      val: 80,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 40%',
        end: 'bottom 40%',
        scrub: 0.5,
      },
      onUpdate: () => {
        if (donutPathRef.current) {
          donutPathRef.current.setAttribute('stroke-dasharray', `${donutProxy.val}, 100`);
        }
        if (donutTextRef.current) {
          donutTextRef.current.textContent = `${Math.floor(donutProxy.val)}%`;
        }
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full relative bg-[#F8F9FA] overflow-hidden pt-20 pb-0">
      
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.85] mix-blend-multiply"
          style={{
            backgroundImage: "url('/backgound2.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            backgroundRepeat: 'no-repeat'
          }}
        />
        {/* Gradient mask to make text highly readable on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
      </div>

      {/* Main Grid */}
      <div className="max-w-[1536px] mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center min-h-[750px]">
        
        {/* Left Column (Content) */}
        <div className="lg:col-span-5 xl:col-span-6 flex flex-col justify-center py-10 lg:py-20 relative z-20">
          
          <div className="st-text flex items-center gap-3 mb-6">
            <span className="w-1 h-5 bg-nc-orange rounded-full"></span>
            <span className="text-[11px] md:text-sm font-bold tracking-[0.2em] text-[#64748B] uppercase">Gestão Inteligente de Viagens</span>
          </div>
          
          <h2 className="st-text text-[40px] md:text-[52px] xl:text-[60px] font-display font-extrabold leading-[1.05] text-[#0F172A] mb-6 tracking-tight">
            Mais controle,<br className="hidden md:block"/>
            mais economia,<br className="hidden md:block"/>
            <span className="text-[#DB8902]">menos trabalho.</span>
          </h2>

          <p className="st-text text-lg md:text-xl text-slate-600 mb-10 max-w-lg leading-relaxed font-medium">
            A NC Turismo conecta pessoas, tecnologia e atendimento especializado para simplificar a gestão de viagens da sua empresa.
          </p>

          <div className="flex flex-col gap-6 md:gap-8 mb-12">
            {/* Item 1 */}
            <div className="st-list-item flex gap-4 md:gap-5">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center flex-shrink-0 shadow-sm">
                <Settings className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A] text-base md:text-lg mb-0.5">Operação personalizada</h3>
                <p className="text-slate-500 font-medium text-sm md:text-base">Fluxos sob medida para a sua política de viagens.</p>
              </div>
            </div>
            {/* Item 2 */}
            <div className="st-list-item flex gap-4 md:gap-5">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center flex-shrink-0 shadow-sm">
                <BarChart2 className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A] text-base md:text-lg mb-0.5">Visão completa do gasto</h3>
                <p className="text-slate-500 font-medium text-sm md:text-base">Relatórios em tempo real e mais previsibilidade.</p>
              </div>
            </div>
            {/* Item 3 */}
            <div className="st-list-item flex gap-4 md:gap-5">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center flex-shrink-0 shadow-sm">
                <UsersIcon className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A] text-base md:text-lg mb-0.5">Atendimento que resolve</h3>
                <p className="text-slate-500 font-medium text-sm md:text-base">Equipe 24h pronta para te apoiar, sempre.</p>
              </div>
            </div>
          </div>

          <div className="st-btn-group flex flex-wrap items-center gap-6">
            <a href="#" className="bg-gradient-to-r from-[#DB8902] to-[#B36E00] hover:from-[#C77A00] hover:to-[#995E00] text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_10px_20px_-10px_rgba(219,137,2,0.8)]">
              Solicitar diagnóstico gratuito
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#" className="font-bold text-[#0F172A] hover:text-[#2563EB] flex items-center gap-2 transition-colors border-b-2 border-transparent hover:border-[#2563EB] pb-0.5">
              Conheça nossas soluções
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right Column (Visuals) */}
        <div className="lg:col-span-7 xl:col-span-6 relative h-[600px] lg:h-[800px] w-full mt-10 lg:mt-0 pointer-events-none select-none">
          
          {/* Floating text (Behind Woman) */}
          <div className="st-text absolute top-[5%] right-[5%] lg:right-[10%] lg:top-[4%] xl:top-[2%] xl:right-[12%] rotate-[-12deg] hidden md:block z-10 opacity-90">
             <p className="font-serif italic text-lg lg:text-[22px] text-[#334155] leading-tight text-center whitespace-nowrap">
               Sua próxima<br/>viagem, mais<br/>inteligente.
             </p>
             <svg className="absolute -bottom-1.5 right-[0px] w-14 lg:w-16 text-[#DB8902]" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M5,15 Q50,5 95,10" />
             </svg>
          </div>

          {/* Woman Character */}
          <img 
            src="/mulherNC2.png" 
            alt="Executiva NC Turismo" 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-auto lg:right-[15%] h-[90%] lg:h-[100%] object-contain z-20 drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]" 
          />

          {/* Floating Elements Container */}
          <div className="absolute inset-0 z-30">
            
            {/* Floating Card 1: Chart */}
            <div className="st-card st-float-1 absolute top-[5%] left-[0%] lg:left-[5%] bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] border border-white/60 w-[270px]">
              <h4 className="font-bold text-[#0F172A] text-[15px] mb-1.5">Viagens Aprovadas</h4>
              <div className="flex items-center gap-2 mb-4">
                 <span className="bg-[#3B82F6] text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l7-7 7 7M12 19V5"/></svg>
                    + 32%
                 </span>
                 <span className="text-[11px] text-slate-500 font-medium">vs. mês anterior</span>
              </div>
              <div className="relative h-[70px] w-full mt-2">
                <svg viewBox="0 0 200 80" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                   <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                         <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                      </linearGradient>
                      <clipPath id="chart-clip">
                        <rect ref={clipRef} x="0" y="0" width="0" height="80" />
                      </clipPath>
                   </defs>
                   <g clipPath="url(#chart-clip)">
                     <path d="M0,60 L30,55 L60,65 L100,50 L140,40 L160,20 L190,15 L200,10 L200,80 L0,80 Z" fill="url(#chartGrad)" />
                     <path d="M0,60 L30,55 L60,65 L100,50 L140,40 L160,20 L190,15 L200,10" fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                   </g>
                   <circle ref={dotRef} cx="0" cy="60" r="4.5" fill="#3B82F6" stroke="white" strokeWidth="2" />
                   <g ref={tooltipGrpRef} transform="translate(0, 30)">
                      <rect x="-16" y="-18" width="32" height="18" rx="4" fill="#3B82F6" />
                      <text ref={tooltipTextRef} x="0" y="-5" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">320</text>
                   </g>
                </svg>
              </div>
              <div className="flex justify-between mt-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">
                <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span>
              </div>
            </div>

            {/* Floating Card 2: 80% */}
            <div className="st-card st-float-2 absolute top-[45%] left-[-2%] lg:left-[8%] bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] border border-white/60 w-[130px] flex flex-col items-center justify-center">
               <div className="relative w-16 h-16 flex items-center justify-center mb-2">
                  <svg className="w-full h-full -rotate-90 drop-shadow-sm" viewBox="0 0 36 36">
                     <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#F1F5F9" strokeWidth="4" />
                     <path ref={donutPathRef} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1D4ED8" strokeWidth="4" strokeDasharray="0, 100" />
                  </svg>
                  <span ref={donutTextRef} className="absolute text-[15px] font-extrabold text-[#0F172A]">0%</span>
               </div>
               <span className="text-[11px] font-bold text-[#0F172A] text-center leading-snug">Processos<br/>autônomos</span>
            </div>

            {/* Floating Card 3: List */}
            <div className="st-card st-float-3 absolute top-[18%] right-[0%] lg:-right-[5%] bg-white/70 backdrop-blur-xl rounded-2xl p-2.5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] border border-white w-[260px]">
               {[
                 { icon: Plane, title: 'Emissão de passagens', desc: 'Mais agilidade' },
                 { icon: Building, title: 'Reservas de hospedagem', desc: 'Tarifas corporativas' },
                 { icon: Car, title: 'Locação de veículos', desc: 'Parceiros confiáveis' },
                 { icon: ShieldCheck, title: 'Gestão de despesas', desc: 'Conformidade e controle' }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-3 p-2.5 bg-transparent rounded-xl">
                    <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-[#2563EB]">
                       <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                       <h5 className="text-[13px] font-bold text-[#0F172A] leading-tight mb-0.5">{item.title}</h5>
                       <p className="text-[11px] text-slate-500 font-medium leading-none">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>

            {/* Floating Card 4: Support */}
            <div className="st-card st-float-4 absolute bottom-[15%] right-[5%] lg:-right-[2%] bg-[#212529] rounded-[20px] p-4 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)] border border-[#333A45] w-[320px] flex items-center justify-between">
               <div className="flex items-center gap-3.5">
                  <div className="text-[#F59E0B]">
                     <Star className="w-7 h-7 fill-[#F59E0B]" />
                  </div>
                  <div>
                     <h5 className="text-white font-bold text-[15px] leading-tight mb-0.5">Atendimento 24h</h5>
                     <p className="text-slate-400 text-[11px] font-medium">Onde sua empresa estiver</p>
                  </div>
               </div>
               <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-[#212529] overflow-hidden"><img src="https://i.pravatar.cc/100?img=47" alt="Agent" className="w-full h-full object-cover"/></div>
                  <div className="w-8 h-8 rounded-full border-2 border-[#212529] overflow-hidden"><img src="https://i.pravatar.cc/100?img=32" alt="Agent" className="w-full h-full object-cover"/></div>
                  <div className="w-8 h-8 rounded-full border-2 border-[#212529] overflow-hidden"><img src="https://i.pravatar.cc/100?img=68" alt="Agent" className="w-full h-full object-cover"/></div>
                  <div className="w-8 h-8 rounded-full border-2 border-[#212529] bg-[#333A45] flex items-center justify-center text-white text-[10px] font-bold">+</div>
               </div>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Indicators Strip */}
      <div className="st-indicator-container max-w-[1536px] mx-auto px-6 md:px-12 relative z-30 pb-16 -mt-16 md:-mt-10">
        <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl py-8 px-6 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-gray-200">
           
           <div className="flex items-center gap-4 lg:px-6">
              <div className="text-[#DB8902]"><PiggyBank className="w-10 h-10" strokeWidth={1.5} /></div>
              <div>
                 <h4 className="text-[#0F172A] font-bold text-lg leading-tight">Até 30%</h4>
                 <p className="text-slate-500 text-sm font-medium">de economia nas viagens</p>
              </div>
           </div>
           
           <div className="flex items-center gap-4 lg:px-6">
              <div className="text-[#DB8902]"><Clock className="w-10 h-10" strokeWidth={1.5} /></div>
              <div>
                 <h4 className="text-[#0F172A] font-bold text-lg leading-tight">24h</h4>
                 <p className="text-slate-500 text-sm font-medium">de suporte especializado</p>
              </div>
           </div>
           
           <div className="flex items-center gap-4 lg:px-6">
              <div className="text-[#DB8902]"><BarChart2 className="w-10 h-10" strokeWidth={1.5} /></div>
              <div>
                 <h4 className="text-[#0F172A] font-bold text-lg leading-tight">Relatórios em tempo real</h4>
                 <p className="text-slate-500 text-sm font-medium">mais controle e transparência</p>
              </div>
           </div>
           
           <div className="flex items-center gap-4 lg:px-6">
              <div className="text-[#DB8902]"><Users className="w-10 h-10" strokeWidth={1.5} /></div>
              <div>
                 <h4 className="text-[#0F172A] font-bold text-lg leading-tight">+ de 500 empresas</h4>
                 <p className="text-slate-500 text-sm font-medium">confiam na NC Turismo</p>
              </div>
           </div>

        </div>
      </div>

    </section>
  );
};

