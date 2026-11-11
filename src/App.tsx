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
import { PropostaApresentacaoView } from './components/PropostaApresentacaoView';
import { RodoviarioView } from './components/RodoviarioView';
import { BackToTopButton } from './components/BackToTopButton';
import { supabase, getPropostaComercialById, PropostaComercial, INITIAL_PROPOSTAS_COMERCIAIS } from './lib/supabase';
import {
  AppViewName,
  resolveBrowserLocation,
  resolveTokenToRoute,
  applyClientSeoMetadata,
} from './lib/seoRoutes';

export default function App() {
  const [currentView, setCurrentView] = useState<AppViewName>('home');
  const [session, setSession] = useState<any>(null);
  const [activeSlug, setActiveSlug] = useState<string>('sla-suporte-viagens-corporativas-atendimento');
  const [activeProposta, setActiveProposta] = useState<PropostaComercial>(INITIAL_PROPOSTAS_COMERCIAIS[0]);
  const [propostaLoading, setPropostaLoading] = useState<boolean>(false);
  const [propostaNotFoundCode, setPropostaNotFoundCode] = useState<string | null>(null);

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
    const syncRouteFromLocation = () => {
      const match = resolveBrowserLocation(
        window.location.pathname,
        window.location.hash,
        window.location.search
      );

      // Se acessou uma página dedicada via hash legado (ex.: /#gestao-de-viagens ou /#proposta/NC-2026-002),
      // converte silenciosamente a URL para o caminho canônico (ex.: /?proposta=NC-2026-002) sem recarregar
      if (match.wasLegacyHash && !match.homeAnchorId && match.canonicalPath.startsWith('/')) {
        window.history.replaceState(null, '', match.canonicalPath);
      }

      if (match.slug) {
        setActiveSlug(match.slug);
      }

      if (match.propostaCode) {
        setPropostaLoading(true);
        setPropostaNotFoundCode(null);
        getPropostaComercialById(match.propostaCode)
          .then((found) => {
            if (found) {
              setActiveProposta(found);
              setPropostaNotFoundCode(null);
              document.title = `Proposta ${found.codigo_proposta} · ${found.cliente_nome} | NC Turismo`;
            } else {
              setPropostaNotFoundCode(match.propostaCode || null);
            }
          })
          .finally(() => {
            setPropostaLoading(false);
          });
      }

      setCurrentView(match.view);
      applyClientSeoMetadata(
        match.view,
        match.homeAnchorId ? '/' : match.canonicalPath
      );

      if (match.homeAnchorId) {
        setTimeout(() => {
          const el =
            document.getElementById(match.homeAnchorId!) ||
            (match.homeAnchorId === 'plantao' ? document.getElementById('diagnostico') : null);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    syncRouteFromLocation();
    window.addEventListener('popstate', syncRouteFromLocation);
    window.addEventListener('hashchange', syncRouteFromLocation);
    return () => {
      window.removeEventListener('popstate', syncRouteFromLocation);
      window.removeEventListener('hashchange', syncRouteFromLocation);
    };
  }, []);

  const pushCleanUrl = (path: string) => {
    const currentFull = window.location.pathname + window.location.search + window.location.hash;
    if (currentFull !== path) {
      window.history.pushState(null, '', path);
    }
  };

  const handleOpenLegal = (tab: 'privacidade' | 'beneficios' | 'termos') => {
    const targetPath = `/${tab}`;
    pushCleanUrl(targetPath);
    setCurrentView(tab);
    applyClientSeoMetadata(tab, targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    pushCleanUrl('/');
    setCurrentView('home');
    applyClientSeoMetadata('home', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBlog = () => {
    pushCleanUrl('/conhecimento');
    setCurrentView('blog');
    applyClientSeoMetadata('blog', '/conhecimento');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPost = (slug: string) => {
    const targetPath = `/artigo/${slug}`;
    pushCleanUrl(targetPath);
    setActiveSlug(slug);
    setCurrentView('blog-post');
    applyClientSeoMetadata('blog-post', targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (target: string) => {
    const match = resolveTokenToRoute(target, false);

    if (!match) {
      handleBackToHome();
      return;
    }

    if (match.slug) {
      setActiveSlug(match.slug);
    }

    if (match.propostaCode) {
      setPropostaLoading(true);
      setPropostaNotFoundCode(null);
      getPropostaComercialById(match.propostaCode)
        .then((found) => {
          if (found) {
            setActiveProposta(found);
            setPropostaNotFoundCode(null);
          } else {
            setPropostaNotFoundCode(match.propostaCode || null);
          }
        })
        .finally(() => {
          setPropostaLoading(false);
        });
    }

    if (match.homeAnchorId) {
      pushCleanUrl(`/#${match.homeAnchorId}`);
      setCurrentView('home');
      applyClientSeoMetadata('home', '/');
      setTimeout(() => {
        const el =
          document.getElementById(match.homeAnchorId!) ||
          (match.homeAnchorId === 'plantao' ? document.getElementById('diagnostico') : null);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 120);
      return;
    }

    pushCleanUrl(match.canonicalPath);
    setCurrentView(match.view);
    applyClientSeoMetadata(match.view, match.canonicalPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  if (currentView === 'proposta') {
    if (propostaLoading) {
      return (
        <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-6 text-white font-sans">
          <div className="w-12 h-12 rounded-2xl border-2 border-[#C8102E] border-t-amber-400 animate-spin mb-4" />
          <p className="text-sm font-bold tracking-wider uppercase text-amber-300">
            Carregando Proposta Comercial NC Turismo...
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Sincronizando dados, escopo consultivo e condições comerciais.
          </p>
        </div>
      );
    }
    return (
      <PropostaApresentacaoView
        proposta={activeProposta}
        notFoundCode={propostaNotFoundCode}
        isPublicView={true}
        onBack={handleBackToHome}
        onUpdateProposta={(updated) => setActiveProposta(updated)}
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

  if (currentView === 'rodoviario') {
    return (
      <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen font-sans selection:bg-[#C8102E] selection:text-white">
        <ScrollProgressBar />
        <Header onHomeClick={handleBackToHome} onNavigate={handleNavigate} currentView="rodoviario" />
        <RodoviarioView
          onBackToHome={handleBackToHome}
          onOpenDiagnosis={() => handleNavigate('#diagnostico')}
          onOpenBeneficios={() => handleNavigate('beneficios')}
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
          onNavigate={handleNavigate}
          onOpenAreaCliente={() => {
            handleNavigate('area-cliente');
          }}
        />
      </main>
      <BackToTopButton />
    </div>
  );
}
