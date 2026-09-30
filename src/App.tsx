/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { Hero } from './components/sections/Hero';
import { InfiniteMarquee } from './components/InfiniteMarquee';
import { Structure } from './components/sections/Structure';
import { CompanyVideo } from './components/sections/CompanyVideo';
import { Transformation } from './components/sections/Transformation';
import { SolutionsAccordion } from './components/sections/SolutionsAccordion';
import { ClientsCarousel } from './components/sections/ClientsCarousel';
import { HumanSupport } from './components/sections/HumanSupport';
import { FAQSection } from './components/sections/FAQSection';
import { Conversao } from './components/sections/Conversao';
import { SmoothScroll } from './components/SmoothScroll';
import { LegalPage } from './components/LegalPage';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { BlogListingView } from './components/BlogListingView';
import { BlogPostView } from './components/BlogPostView';
import { QuemSomosView } from './components/QuemSomosView';
import { ViagensCorporativasView } from './components/ViagensCorporativasView';
import { GestaoViagensView } from './components/GestaoViagensView';
import { GestaoDespesasView } from './components/GestaoDespesasView';
import { TecnologiaObtView } from './components/TecnologiaObtView';
import { Atendimento24hView } from './components/Atendimento24hView';
import { BiRelatoriosView } from './components/BiRelatoriosView';
import { ComplianceEsgView } from './components/ComplianceEsgView';
import { LazerView } from './components/LazerView';
import { BeneficiosViagensView } from './components/BeneficiosViagensView';
import { AreaDoClienteView } from './components/AreaDoClienteView';
import { BackToTopButton } from './components/BackToTopButton';
import { supabase } from './lib/supabase';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'quem-somos' | 'privacidade' | 'beneficios' | 'termos' | 'admin' | 'blog' | 'blog-post' | 'viagens-corporativas' | 'gestao-de-viagens' | 'gestao-de-despesas' | 'tecnologia-obt' | 'atendimento-24h' | 'bi-e-relatorios' | 'compliance-esg' | 'lazer' | 'area-cliente'>('home');
  const [session, setSession] = useState<any>(null);
  const [activeSlug, setActiveSlug] = useState<string>('sla-suporte-viagens-corporativas-atendimento');

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#quem-somos' || hash === '#quemsomos') {
        setCurrentView('quem-somos');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#viagens-corporativas' || hash === '#corporativo') {
        setCurrentView('viagens-corporativas');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (
        hash === '#gestao-de-viagens' || 
        hash === '#gestao-viagens' || 
        hash === '#gestaoviagens' || 
        hash === '#gestao'
      ) {
        setCurrentView('gestao-de-viagens');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (
        hash === '#gestao-de-despesas' || 
        hash === '#gestao-despesas' || 
        hash === '#despesas' || 
        hash === '#despesas-corporativas' ||
        hash === '#gestaodespesas'
      ) {
        setCurrentView('gestao-de-despesas');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (
        hash === '#tecnologia-obt' || 
        hash === '#tecnologia-e-obt' || 
        hash === '#tecnologia' || 
        hash === '#tecnologia-e-integracoes' || 
        hash === '#tecnologia-integracoes' || 
        hash === '#obt'
      ) {
        setCurrentView('tecnologia-obt');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (
        hash === '#atendimento-24h' || 
        hash === '#atendimento-24-horas' || 
        hash === '#atendimento24h' || 
        hash === '#atendimento24horas' || 
        hash === '#suporte-24h' || 
        hash === '#plantao-24h'
      ) {
        setCurrentView('atendimento-24h');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (
        hash === '#bi-e-relatorios' || 
        hash === '#bi-relatorios' || 
        hash === '#bi' || 
        hash === '#relatorios' || 
        hash === '#relatorios-gerenciais' ||
        hash === '#bie-relatorios'
      ) {
        setCurrentView('bi-e-relatorios');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (
        hash === '#compliance-esg' || 
        hash === '#compliance' || 
        hash === '#esg' || 
        hash === '#compliance-e-esg' || 
        hash === '#governanca-compliance'
      ) {
        setCurrentView('compliance-esg');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#lazer') {
        setCurrentView('lazer');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#privacidade') {
        setCurrentView('privacidade');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (
        hash === '#beneficios' || 
        hash === '#beneficios-viagens' || 
        hash === '#beneficios-em-viagens' || 
        hash === '#beneficios-e-parcerias' ||
        hash === '#beneficios-e-viagens'
      ) {
        setCurrentView('beneficios');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#termos') {
        setCurrentView('termos');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#legal-beneficios') {
        setCurrentView('termos');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#admin')) {
        setCurrentView('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#artigo/')) {
        const slug = window.location.hash.replace('#artigo/', '');
        setActiveSlug(slug);
        setCurrentView('blog-post');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#blog/') || hash.startsWith('#conhecimento/')) {
        const slug = window.location.hash.replace(/^#(blog|conhecimento)\//, '');
        setActiveSlug(slug);
        setCurrentView('blog-post');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#conhecimento' || hash === '#blog') {
        setCurrentView('blog');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (
        hash === '#area-cliente' || 
        hash === '#areadocliente' || 
        hash === '#portal-cliente' || 
        hash === '#portal' || 
        hash === '#cliente'
      ) {
        setCurrentView('area-cliente');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#plantao' || hash === '#suporte') {
        setCurrentView('home');
        setTimeout(() => {
          const el = document.getElementById('plantao') || document.getElementById('suporte') || document.getElementById('diagnostico');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (
        hash === '#solucoes' || 
        hash === '#diagnostico' || 
        hash === '#estrutura' || 
        hash === '#transformacao' ||
        hash === '#faq' ||
        hash === '#duvidas' ||
        hash === '#perguntas-frequentes'
      ) {
        setCurrentView('home');
        setTimeout(() => {
          const targetId = (hash === '#duvidas' || hash === '#perguntas-frequentes') ? 'faq' : hash.replace('#', '');
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (hash === '' || hash === '#') {
        setCurrentView('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleOpenLegal = (tab: 'privacidade' | 'beneficios' | 'termos') => {
    window.location.hash = tab;
    setCurrentView(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    window.location.hash = '';
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBlog = () => {
    window.location.hash = 'conhecimento';
    setCurrentView('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPost = (slug: string) => {
    window.location.hash = `artigo/${slug}`;
    setActiveSlug(slug);
    setCurrentView('blog-post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (target: string) => {
    const cleanTarget = target.startsWith('#') ? target.slice(1) : target;
    const lower = cleanTarget.toLowerCase();

    if (lower === 'quem-somos' || lower === 'quemsomos') {
      window.location.hash = '#quem-somos';
      setCurrentView('quem-somos');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (lower === 'viagens-corporativas' || lower === 'corporativo') {
      window.location.hash = '#viagens-corporativas';
      setCurrentView('viagens-corporativas');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      lower === 'gestao-de-viagens' || 
      lower === 'gestao-viagens' || 
      lower === 'gestaoviagens' || 
      lower === 'gestao'
    ) {
      window.location.hash = '#gestao-de-viagens';
      setCurrentView('gestao-de-viagens');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      lower === 'gestao-de-despesas' || 
      lower === 'gestao-despesas' || 
      lower === 'despesas' || 
      lower === 'despesas-corporativas' || 
      lower === 'gestaodespesas'
    ) {
      window.location.hash = '#gestao-de-despesas';
      setCurrentView('gestao-de-despesas');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      lower === 'tecnologia-obt' || 
      lower === 'tecnologia-e-obt' || 
      lower === 'tecnologia' || 
      lower === 'tecnologia-e-integracoes' || 
      lower === 'tecnologia-integracoes' || 
      lower === 'obt'
    ) {
      window.location.hash = '#tecnologia-obt';
      setCurrentView('tecnologia-obt');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      lower === 'atendimento-24h' || 
      lower === 'atendimento-24-horas' || 
      lower === 'atendimento24h' || 
      lower === 'atendimento24horas' || 
      lower === 'atendimento-24' ||
      lower === 'suporte-24h' || 
      lower === 'plantao-24h'
    ) {
      window.location.hash = '#atendimento-24h';
      setCurrentView('atendimento-24h');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      lower === 'bi-e-relatorios' || 
      lower === 'bi-relatorios' || 
      lower === 'bi' || 
      lower === 'relatorios' || 
      lower === 'relatorios-gerenciais' || 
      lower === 'bie-relatorios'
    ) {
      window.location.hash = '#bi-e-relatorios';
      setCurrentView('bi-e-relatorios');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      lower === 'compliance-esg' || 
      lower === 'compliance' || 
      lower === 'esg' || 
      lower === 'compliance-e-esg' || 
      lower === 'governanca-compliance'
    ) {
      window.location.hash = '#compliance-esg';
      setCurrentView('compliance-esg');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (lower === 'lazer') {
      window.location.hash = '#lazer';
      setCurrentView('lazer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      lower === 'beneficios' || 
      lower === 'beneficios-viagens' || 
      lower === 'beneficios-em-viagens' || 
      lower === 'beneficios-e-parcerias'
    ) {
      window.location.hash = '#beneficios';
      setCurrentView('beneficios');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (lower === 'conhecimento' || lower === 'blog') {
      window.location.hash = '#conhecimento';
      setCurrentView('blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      lower === 'area-cliente' || 
      lower === 'areadocliente' || 
      lower === 'portal-cliente' || 
      lower === 'portal' || 
      lower === 'cliente'
    ) {
      window.location.hash = '#area-cliente';
      setCurrentView('area-cliente');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (lower === 'privacidade' || lower === 'termos') {
      window.location.hash = `#${lower}`;
      setCurrentView(lower as any);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (lower.startsWith('artigo/')) {
      const slug = lower.replace('artigo/', '');
      setActiveSlug(slug);
      window.location.hash = `#artigo/${slug}`;
      setCurrentView('blog-post');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (lower === '' || lower === 'home') {
      handleBackToHome();
    } else {
      // Target is an anchor section on the home page
      window.location.hash = `#${cleanTarget}`;
      setCurrentView('home');
      setTimeout(() => {
        const targetId = (cleanTarget === 'duvidas' || cleanTarget === 'perguntas-frequentes') 
          ? 'faq' 
          : (cleanTarget === 'suporte' ? 'plantao' : cleanTarget);
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 120);
    }
  };

  if (currentView === 'admin') {
    if (!session) {
      return (
        <AdminLogin 
          onLoginSuccess={() => {
            // State will update via onAuthStateChange listener
          }}
          onBackToHome={handleBackToHome}
        />
      );
    }
    return (
      <AdminDashboard 
        onLogout={() => {
          setSession(null);
        }}
        onBackToHome={handleBackToHome}
      />
    );
  }

  if (currentView === 'viagens-corporativas') {
    return (
      <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen font-sans selection:bg-[#C8102E] selection:text-white">
        <ScrollProgressBar />
        <Header onHomeClick={handleBackToHome} onNavigate={handleNavigate} currentView="corporativo" />
        <ViagensCorporativasView 
          onBackToHome={handleBackToHome}
          onOpenDiagnosis={() => {
            handleNavigate('#diagnostico');
          }}
          onSelectSolutionSection={(solutionId) => {
            if (solutionId === 'planejamento' || solutionId === 'gestao') {
              handleNavigate('gestao-de-viagens');
            } else if (solutionId === 'despesas') {
              handleNavigate('gestao-de-despesas');
            } else if (solutionId === 'tecnologia') {
              handleNavigate('tecnologia-obt');
            } else if (solutionId === 'atendimento' || solutionId === 'suporte') {
              handleNavigate('atendimento-24h');
            } else if (solutionId === 'bi' || solutionId === 'relatorios') {
              handleNavigate('bi-e-relatorios');
            } else {
              handleNavigate('#solucoes');
            }
          }}
        />
      </div>
    );
  }

  if (currentView === 'gestao-de-viagens') {
    return (
      <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen font-sans selection:bg-[#C8102E] selection:text-white">
        <ScrollProgressBar />
        <Header onHomeClick={handleBackToHome} onNavigate={handleNavigate} currentView="gestao-de-viagens" />
        <GestaoViagensView 
          onBackToHome={handleBackToHome}
          onOpenDiagnosis={() => {
            handleNavigate('#diagnostico');
          }}
          onOpenLegalTab={handleOpenLegal}
        />
      </div>
    );
  }

  if (currentView === 'gestao-de-despesas') {
    return (
      <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen font-sans selection:bg-[#C8102E] selection:text-white">
        <ScrollProgressBar />
        <Header onHomeClick={handleBackToHome} onNavigate={handleNavigate} currentView="gestao-de-despesas" />
        <GestaoDespesasView 
          onBackToHome={handleBackToHome}
          onOpenDiagnosis={() => {
            handleNavigate('#diagnostico');
          }}
          onOpenLegalTab={handleOpenLegal}
        />
      </div>
    );
  }

  if (currentView === 'tecnologia-obt') {
    return (
      <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen font-sans selection:bg-[#C8102E] selection:text-white">
        <ScrollProgressBar />
        <Header onHomeClick={handleBackToHome} onNavigate={handleNavigate} currentView="tecnologia-obt" />
        <TecnologiaObtView 
          onBackToHome={handleBackToHome}
          onOpenDiagnosis={() => {
            handleNavigate('#diagnostico');
          }}
          onOpenLegalTab={handleOpenLegal}
          onNavigateToSection={handleNavigate}
        />
      </div>
    );
  }

  if (currentView === 'atendimento-24h') {
    return (
      <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen font-sans selection:bg-[#C8102E] selection:text-white">
        <ScrollProgressBar />
        <Header onHomeClick={handleBackToHome} onNavigate={handleNavigate} currentView="atendimento-24h" />
        <Atendimento24hView 
          onBackToHome={handleBackToHome}
          onOpenDiagnosis={() => {
            handleNavigate('#diagnostico');
          }}
          onOpenLegalTab={handleOpenLegal}
          onNavigateToSection={handleNavigate}
        />
      </div>
    );
  }

  if (currentView === 'bi-e-relatorios') {
    return (
      <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen font-sans selection:bg-[#C8102E] selection:text-white">
        <ScrollProgressBar />
        <Header onHomeClick={handleBackToHome} onNavigate={handleNavigate} currentView="bi-e-relatorios" />
        <BiRelatoriosView 
          onBackToHome={handleBackToHome}
          onOpenDiagnosis={() => {
            handleNavigate('#diagnostico');
          }}
          onOpenLegalTab={handleOpenLegal}
          onNavigateToSection={handleNavigate}
        />
      </div>
    );
  }

  if (currentView === 'compliance-esg') {
    return (
      <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen font-sans selection:bg-[#C8102E] selection:text-white">
        <ScrollProgressBar />
        <Header onHomeClick={handleBackToHome} onNavigate={handleNavigate} currentView="compliance-esg" />
        <ComplianceEsgView 
          onBackToHome={handleBackToHome}
          onOpenDiagnosis={() => {
            handleNavigate('#diagnostico');
          }}
          onOpenLegalTab={handleOpenLegal}
          onNavigateToSection={handleNavigate}
        />
      </div>
    );
  }

  if (currentView === 'lazer') {
    return (
      <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen font-sans selection:bg-[#C8102E] selection:text-white">
        <ScrollProgressBar />
        <Header onHomeClick={handleBackToHome} onNavigate={handleNavigate} currentView="lazer" />
        <LazerView 
          onBackToHome={handleBackToHome}
          onOpenLegal={handleOpenLegal}
        />
      </div>
    );
  }

  if (currentView === 'quem-somos') {
    return (
      <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen font-sans selection:bg-[#C8102E] selection:text-white">
        <ScrollProgressBar />
        <SmoothScroll />
        <Header onHomeClick={handleBackToHome} onNavigate={handleNavigate} currentView="quem-somos" />
        <QuemSomosView 
          onBackToHome={handleBackToHome}
          onOpenSolutions={() => {
            handleNavigate('#solucoes');
          }}
          onOpenLegal={handleOpenLegal}
        />
      </div>
    );
  }

  if (currentView === 'blog') {
    return (
      <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen font-sans selection:bg-[#C8102E] selection:text-white">
        <ScrollProgressBar />
        <Header onHomeClick={handleBackToHome} onNavigate={handleNavigate} currentView="conhecimento" />
        <BlogListingView 
          onSelectPost={handleSelectPost} 
          onBackToHome={handleBackToHome} 
        />
      </div>
    );
  }

  if (currentView === 'blog-post') {
    return (
      <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen font-sans selection:bg-[#C8102E] selection:text-white">
        <ScrollProgressBar />
        <Header onHomeClick={handleBackToHome} onNavigate={handleNavigate} currentView="conhecimento" />
        <BlogPostView 
          slug={activeSlug}
          onBackToBlog={handleOpenBlog}
          onBackToHome={handleBackToHome}
        />
      </div>
    );
  }

  if (currentView === 'beneficios') {
    return (
      <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen font-sans selection:bg-[#C8102E] selection:text-white">
        <ScrollProgressBar />
        <Header onHomeClick={handleBackToHome} onNavigate={handleNavigate} currentView="beneficios" />
        <BeneficiosViagensView 
          onBackToHome={handleBackToHome}
          onOpenLegalTab={handleOpenLegal}
        />
      </div>
    );
  }

  if (currentView === 'area-cliente') {
    return (
      <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen font-sans selection:bg-[#C8102E] selection:text-white">
        <ScrollProgressBar />
        <Header onHomeClick={handleBackToHome} onNavigate={handleNavigate} currentView="area-cliente" />
        <AreaDoClienteView 
          onBackToHome={handleBackToHome}
          onOpenLegalTab={handleOpenLegal}
          onOpenBeneficios={() => {
            handleNavigate('beneficios');
          }}
        />
      </div>
    );
  }

  if (currentView !== 'home') {
    return (
      <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen font-sans selection:bg-[#C8102E] selection:text-white">
        <ScrollProgressBar />
        <Header onHomeClick={handleBackToHome} onNavigate={handleNavigate} currentView={currentView} />
        <LegalPage 
          initialTab={currentView as 'privacidade' | 'beneficios' | 'termos'} 
          onBackToHome={handleBackToHome} 
        />
      </div>
    );
  }

  return (
    <div className="bg-nc-space text-nc-warm min-h-screen font-sans selection:bg-nc-orange selection:text-white">
      <ScrollProgressBar />
      <SmoothScroll />
      <Header onHomeClick={handleBackToHome} onNavigate={handleNavigate} currentView="home" />
      <main id="main-content" className="relative w-full overflow-hidden">
        <Hero />
        <InfiniteMarquee />
        <Structure />
        <CompanyVideo />
        <Transformation />
        <SolutionsAccordion />
        <ClientsCarousel />
        <HumanSupport />
        <FAQSection />
        <Conversao 
          onOpenLegal={handleOpenLegal} 
          onOpenAreaCliente={() => {
            window.location.hash = 'area-cliente';
            setCurrentView('area-cliente');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </main>
      <BackToTopButton />
    </div>
  );
}
