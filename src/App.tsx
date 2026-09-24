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
import { Transformation } from './components/sections/Transformation';
import { SolutionsAccordion } from './components/sections/SolutionsAccordion';
import { ClientsCarousel } from './components/sections/ClientsCarousel';
import { HumanSupport } from './components/sections/HumanSupport';
import { Conversao } from './components/sections/Conversao';
import { SmoothScroll } from './components/SmoothScroll';
import { LegalPage } from './components/LegalPage';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { BlogListingView } from './components/BlogListingView';
import { BlogPostView } from './components/BlogPostView';
import { QuemSomosView } from './components/QuemSomosView';
import { ViagensCorporativasView } from './components/ViagensCorporativasView';
import { LazerView } from './components/LazerView';
import { supabase } from './lib/supabase';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'quem-somos' | 'privacidade' | 'beneficios' | 'termos' | 'admin' | 'blog' | 'blog-post' | 'viagens-corporativas' | 'lazer'>('home');
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
      } else if (hash === '#lazer') {
        setCurrentView('lazer');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#privacidade') {
        setCurrentView('privacidade');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#beneficios') {
        setCurrentView('beneficios');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#termos') {
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
      } else if (hash === '#solucoes' || hash === '#diagnostico' || hash === '#estrutura' || hash === '#transformacao') {
        setCurrentView('home');
        setTimeout(() => {
          const el = document.getElementById(hash.replace('#', ''));
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
      <div className="bg-nc-space text-nc-warm min-h-screen font-sans selection:bg-nc-orange selection:text-white">
        <ScrollProgressBar />
        <Header onHomeClick={handleBackToHome} currentView="corporativo" />
        <ViagensCorporativasView 
          onBackToHome={handleBackToHome}
          onOpenDiagnosis={() => {
            window.location.hash = 'diagnostico';
            setCurrentView('home');
            setTimeout(() => {
              const el = document.getElementById('diagnostico');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          onSelectSolutionSection={(solutionId) => {
            window.location.hash = 'solucoes';
            setCurrentView('home');
            setTimeout(() => {
              const el = document.getElementById('solucoes');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        />
      </div>
    );
  }

  if (currentView === 'lazer') {
    return (
      <div className="bg-nc-space text-nc-warm min-h-screen font-sans selection:bg-nc-orange selection:text-white">
        <ScrollProgressBar />
        <Header onHomeClick={handleBackToHome} currentView="lazer" />
        <LazerView 
          onBackToHome={handleBackToHome}
          onOpenLegal={handleOpenLegal}
        />
      </div>
    );
  }

  if (currentView === 'quem-somos') {
    return (
      <div className="bg-nc-space text-nc-warm min-h-screen font-sans selection:bg-nc-orange selection:text-white">
        <ScrollProgressBar />
        <SmoothScroll />
        <Header onHomeClick={handleBackToHome} />
        <QuemSomosView 
          onBackToHome={handleBackToHome}
          onOpenSolutions={() => {
            window.location.hash = '#solucoes';
            setCurrentView('home');
            setTimeout(() => {
              const el = document.getElementById('solucoes');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          onOpenLegal={handleOpenLegal}
        />
      </div>
    );
  }

  if (currentView === 'blog') {
    return (
      <div className="bg-nc-space text-nc-warm min-h-screen font-sans selection:bg-nc-orange selection:text-white">
        <ScrollProgressBar />
        <Header onHomeClick={handleBackToHome} />
        <BlogListingView 
          onSelectPost={handleSelectPost} 
          onBackToHome={handleBackToHome} 
        />
      </div>
    );
  }

  if (currentView === 'blog-post') {
    return (
      <div className="bg-nc-space text-nc-warm min-h-screen font-sans selection:bg-nc-orange selection:text-white">
        <ScrollProgressBar />
        <Header onHomeClick={handleBackToHome} />
        <BlogPostView 
          slug={activeSlug}
          onBackToBlog={handleOpenBlog}
          onBackToHome={handleBackToHome}
        />
      </div>
    );
  }

  return (
    <div className="bg-nc-space text-nc-warm min-h-screen font-sans selection:bg-nc-orange selection:text-white">
      <ScrollProgressBar />
      {currentView === 'home' ? (
        <>
          <SmoothScroll />
          <Header />
          <main id="main-content" className="relative w-full overflow-hidden">
            <Hero />
            <InfiniteMarquee />
            <Structure />
            <Transformation />
            <SolutionsAccordion />
            <ClientsCarousel />
            <HumanSupport />
            <Conversao onOpenLegal={handleOpenLegal} />
          </main>
        </>
      ) : (
        <>
          <Header onHomeClick={handleBackToHome} />
          <LegalPage 
            initialTab={currentView as 'privacidade' | 'beneficios' | 'termos'} 
            onBackToHome={handleBackToHome} 
          />
        </>
      )}
    </div>
  );
}
