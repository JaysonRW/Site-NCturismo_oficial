/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Header } from './components/Header';
import { Hero } from './components/sections/Hero';
import { Structure } from './components/sections/Structure';
import { Transformation } from './components/sections/Transformation';
import { SolutionsAccordion } from './components/sections/SolutionsAccordion';
import { ClientsCarousel } from './components/sections/ClientsCarousel';
import { HumanSupport } from './components/sections/HumanSupport';
import { Conversao } from './components/sections/Conversao';
import { SmoothScroll } from './components/SmoothScroll';

export default function App() {
  return (
    <div className="bg-nc-space text-nc-warm min-h-screen font-sans selection:bg-nc-orange selection:text-white">
      <SmoothScroll />
      <Header />
      
      <main id="main-content" className="relative w-full overflow-hidden">
        <Hero />
        <Structure />
        <Transformation />
        <SolutionsAccordion />
        <ClientsCarousel />
        <HumanSupport />
        <Conversao />
      </main>
    </div>
  );
}
