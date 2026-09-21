/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/sections/Hero';
import { Structure } from './components/sections/Structure';
import { Transformation } from './components/sections/Transformation';
import { SolutionsAccordion } from './components/sections/SolutionsAccordion';
import { ClientsCarousel } from './components/sections/ClientsCarousel';
import { HumanSupport } from './components/sections/HumanSupport';
import { Conversao } from './components/sections/Conversao';
import { SmoothScroll } from './components/SmoothScroll';
import { LegalPage } from './components/LegalPage';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'privacidade' | 'beneficios' | 'termos'>('home');

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#privacidade') {
        setCurrentView('privacidade');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#beneficios') {
        setCurrentView('beneficios');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#termos') {
        setCurrentView('termos');
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

  return (
    <div className="bg-nc-space text-nc-warm min-h-screen font-sans selection:bg-nc-orange selection:text-white">
      {currentView === 'home' ? (
        <>
          <SmoothScroll />
          <Header />
          <main id="main-content" className="relative w-full overflow-hidden">
            <Hero />
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
            initialTab={currentView} 
            onBackToHome={handleBackToHome} 
          />
        </>
      )}
    </div>
  );
}
