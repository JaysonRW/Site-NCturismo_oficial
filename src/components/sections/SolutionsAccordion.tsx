import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const solutions = [
  {
    id: 'planejamento',
    title: 'Planejamento e política de viagens',
    content: 'Parametrizamos as regras da sua empresa no sistema. Aprovações, tetos de gastos e restrições são validados automaticamente, garantindo conformidade antes do orçamento ser comprometido.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'tecnologia',
    title: 'Tecnologia e integrações',
    content: 'Conectamos a gestão de viagens ao ecossistema da sua empresa. Uma plataforma que unifica solicitações e permite visualizar dados cruciais para a administração do negócio.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'atendimento',
    title: 'Atendimento 24h',
    content: 'Suporte humano especializado pronto para atuar em remarcações, cancelamentos e emergências, em qualquer lugar do mundo. Não deixamos seu executivo falando com robôs.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'compliance',
    title: 'Compliance e ESG',
    content: 'Garantimos rastreabilidade total de informações, alinhamento à LGPD e relatórios que podem apoiar as iniciativas de redução de impacto ambiental da sua corporação.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'bi',
    title: 'BI e relatórios',
    content: 'Transformamos dados em conhecimento. Dashboards customizáveis para acompanhar savings, principais rotas e centros de custo, fundamentando a tomada de decisão.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  }
];

export const SolutionsAccordion: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    
    // Configurações iniciais das camadas
    gsap.set('.sa-text-layer', { opacity: 0, y: 40 });
    gsap.set('.sa-text-layer:first-child', { opacity: 1, y: 0 });
    
    gsap.set('.sa-image-layer', { opacity: 0 });
    gsap.set('.sa-image-layer:first-child', { opacity: 1 });
    
    // Zoom inicial mais forte na imagem para permitir animação contínua
    gsap.set('.sa-image-layer img', { scale: 1.2 });
    gsap.set('.sa-image-layer:first-child img', { scale: 1 });
    
    gsap.set('.sa-mockup-wrapper', { 
      rotationY: -15, 
      rotationX: 8, 
      scale: 0.85,
      transformPerspective: 1200,
      transformOrigin: "center center"
    });

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=4000', // Altura de rolagem para 5 itens ficarem suaves
          pin: true,
          scrub: 1,
          anticipatePin: 1
        }
      });

      const texts = gsap.utils.toArray('.sa-text-layer');
      const images = gsap.utils.toArray('.sa-image-layer');
      const totalSteps = solutions.length;
      
      // Animação contínua do Mockup (Escala e rotação até o fim)
      tl.to('.sa-mockup-wrapper', {
        rotationY: 0,
        rotationX: 0,
        scale: 1.15, // Aproxima
        boxShadow: "0px 40px 80px rgba(0,0,0,0.15)",
        ease: 'none',
        duration: totalSteps
      }, 0);

      // Coreografia Scrubbing para textos e imagens (Fade in/out & Y slide sem sobreposição)
      texts.forEach((text: any, i: number) => {
        const imageLayer = images[i] as Element;
        const imgElement = imageLayer.querySelector('img');

        // Movimento contínuo suave (Ken Burns effect) da imagem enquanto está ativa
        tl.to(imgElement, {
          scale: i === 0 ? 1.1 : 1, // O primeiro já começa em 1, vai para 1.1. Os outros começam em 1.2, vão para 1.
          ease: 'none',
          duration: 1.5 // Duração estendida para cruzar com a próxima
        }, i);

        // Fade Out do elemento atual (sai antes do próximo entrar)
        if (i !== totalSteps - 1) {
          // O texto atual sai
          tl.to(text, { opacity: 0, y: -40, duration: 0.3, ease: 'power2.inOut' }, i + 0.6);
          // A imagem atual pode apenas manter-se no fundo ou dar um pequeno fade out mais tarde
          tl.to(imageLayer, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, i + 0.8);
        }
        
        // Fade In do elemento atual (entra só depois que o anterior saiu)
        if (i !== 0) {
          // O texto entra logo após o texto anterior sumir (anterior sumiu no i-0.4 + 0.3 = i-0.1)
          tl.to(text, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, i - 0.1);
          // A imagem faz crossfade com a anterior
          tl.to(imageLayer, { opacity: 1, duration: 0.5, ease: 'power2.inOut' }, i - 0.3);
        }
      });
    });

    // Fallback Mobile/Tablet (Mantém pinned mas com rolagem mais curta)
    mm.add('(max-width: 1023px)', () => {
      gsap.set('.sa-mockup-wrapper', { 
        rotationY: 0, 
        rotationX: 0, 
        scale: 1
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=2500',
          pin: true,
          scrub: 1,
        }
      });
      const texts = gsap.utils.toArray('.sa-text-layer');
      const images = gsap.utils.toArray('.sa-image-layer');
      const totalSteps = solutions.length;

      texts.forEach((text: any, i: number) => {
        const imageLayer = images[i] as Element;
        const imgElement = imageLayer.querySelector('img');

        // Movimento da imagem no mobile também
        tl.to(imgElement, {
          scale: i === 0 ? 1.1 : 1,
          ease: 'none',
          duration: 1.5
        }, i);

        // Fade Out sequencial
        if (i !== totalSteps - 1) {
          tl.to(text, { opacity: 0, y: -40, duration: 0.3, ease: 'power2.inOut' }, i + 0.6);
          tl.to(imageLayer, { opacity: 0, duration: 0.4, ease: 'power2.inOut' }, i + 0.8);
        }

        // Fade In sequencial
        if (i !== 0) {
          tl.to(text, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, i - 0.1);
          tl.to(imageLayer, { opacity: 1, duration: 0.4, ease: 'power2.inOut' }, i - 0.3);
        }
      });
    });

  }, { scope: containerRef });

  return (
    <section id="solucoes" ref={containerRef} className="relative w-full h-screen overflow-hidden bg-white">
      
      {/* Background Complementar - Transição suave do #F8F9FA (da seção anterior) para o Branco */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#F8F9FA] via-white to-white pointer-events-none"></div>

      <div className="absolute inset-0 max-w-[1536px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center z-10">
        
        {/* Textos da Esquerda (Absolute container) */}
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col justify-center pt-24 lg:pt-0 relative">
          
          <div className="mb-8 lg:mb-16 relative z-20">
            <h2 className="text-[#0F172A] text-3xl md:text-5xl lg:text-[56px] font-bold leading-[1.1] tracking-tight max-w-xl">
              Soluções completas para a sua corporação.
            </h2>
          </div>

          <div className="relative h-[250px] w-full max-w-lg z-20">
            {solutions.map((item, index) => (
              <div 
                key={item.id} 
                className="sa-text-layer absolute top-0 left-0 w-full"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-nc-orange font-bold text-lg">0{index + 1}</span>
                  <div className="h-[1px] w-12 bg-nc-orange/30"></div>
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold text-[#0F172A] mb-4">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-base md:text-lg lg:text-xl leading-relaxed">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
          
        </div>

        {/* Mockup Central/Direita */}
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex items-start lg:items-center justify-center relative">
          
          <div className="sa-mockup-wrapper relative w-[95%] md:w-[70%] lg:w-[80%] aspect-video lg:aspect-[4/3] rounded-[24px] lg:rounded-[32px] overflow-hidden bg-slate-100 border border-slate-200 shadow-2xl">
            {solutions.map((item) => (
              <div key={`img-${item.id}`} className="sa-image-layer absolute inset-0 w-full h-full">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradiente escuro para dar contraste se necessário */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/30 to-transparent mix-blend-multiply"></div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
