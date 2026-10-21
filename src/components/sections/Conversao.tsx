import React from 'react';
import { MessageCircle } from 'lucide-react';
import { LeadForm } from '../LeadForm';

interface ConversaoProps {
  onOpenLegal?: (tab: 'privacidade' | 'beneficios' | 'termos') => void;
  onOpenAreaCliente?: () => void;
}

export const Conversao: React.FC<ConversaoProps> = ({ onOpenLegal, onOpenAreaCliente }) => {
  return (
    <>
      <section id="diagnostico" className="py-24 md:py-32 bg-[#0c0e12] relative z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          <div className="lg:w-5/12">
            <h2 className="text-white text-[32px] md:text-[48px] font-bold leading-[1.1] mb-8 font-display">
              Vamos organizar a próxima etapa da sua <span className="text-nc-orange">gestão de viagens?</span>
            </h2>
            <p className="text-nc-warm/70 text-lg mb-12">
              Inicie uma conversa com nossa equipe comercial e de parcerias. Entenderemos seu cenário atual para propor uma estrutura tecnológica e humana sob medida para sua organização.
            </p>

            <div className="bg-nc-surface border border-white/5 p-8 rounded-2xl">
              <h3 className="text-white font-semibold mb-2">Prefere mensagem direta?</h3>
              <p className="text-nc-warm/60 text-sm mb-6">Nosso canal comercial também está disponível via WhatsApp em horário comercial.</p>
              <a 
                href="https://wa.me/554132811153?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20um%20consultor%20da%20NC%20Turismo."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-nc-orange hover:text-white transition-colors font-medium text-sm uppercase tracking-wider"
              >
                <MessageCircle size={18} /> Iniciar no WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:w-7/12">
            <LeadForm 
              defaultInteresse="gestao-viagens"
              sourceContext="home_diagnostico"
              onOpenLegal={onOpenLegal}
              theme="dark"
              title="Solicite uma proposta ou diagnóstico gratuito"
              subtitle="Preencha os dados abaixo para receber o contato de um consultor especialista."
            />
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-nc-space border-t border-white/5 pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="mb-6">
                <img src="/logo.png" alt="NC Turismo" className="w-[158px] h-[58px] object-contain" />
              </div>
              <p className="text-nc-warm/60 text-sm mb-6">
                We Are Travel. Gestão inteligente de viagens corporativas.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Acesso Rápido</h4>
              <ul className="space-y-4 text-sm text-nc-warm/60">
                <li><a href="#viagens-corporativas" className="hover:text-nc-orange transition-colors">Corporativo</a></li>
                <li>
                  <a 
                    href="#beneficios" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (onOpenLegal) onOpenLegal('beneficios');
                      else window.location.hash = '#beneficios';
                    }} 
                    className="hover:text-nc-orange transition-colors"
                  >
                    Benefícios e Parcerias
                  </a>
                </li>
                <li><a href="#lazer" className="hover:text-nc-orange transition-colors">Lazer</a></li>
                <li><a href="#conhecimento" className="hover:text-nc-orange transition-colors">Conhecimento NC</a></li>
                <li><a href="#quem-somos" className="hover:text-nc-orange transition-colors">Quem Somos</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Serviços</h4>
              <ul className="space-y-4 text-sm text-nc-warm/60">
                <li>
                  <a 
                    href="#gestao-de-viagens"
                    className="hover:text-nc-orange transition-colors"
                  >
                    Gestão de Viagens
                  </a>
                </li>
                <li>
                  <a 
                    href="#area-cliente" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (onOpenAreaCliente) {
                        onOpenAreaCliente();
                      } else {
                        window.location.hash = '#area-cliente';
                      }
                    }}
                    className="hover:text-nc-orange transition-colors flex items-center gap-1.5"
                  >
                    <span>Área do Cliente</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="#plantao" 
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = '#plantao';
                      const el = document.getElementById('plantao');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-nc-orange transition-colors"
                  >
                    Plantão Emergencial
                  </a>
                </li>
                <li>
                  <a 
                    href="#faq" 
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = '#faq';
                      const el = document.getElementById('faq');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-nc-orange transition-colors"
                  >
                    Dúvidas Frequentes (FAQ)
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-nc-warm/60">
                <li>
                  <a 
                    href="#privacidade" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (onOpenLegal) {
                        onOpenLegal('privacidade');
                      } else {
                        window.location.hash = '#privacidade';
                      }
                    }}
                    className="hover:text-nc-orange transition-colors"
                  >
                    Política de Privacidade
                  </a>
                </li>
                <li>
                  <a 
                    href="#beneficios" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (onOpenLegal) {
                        onOpenLegal('beneficios');
                      } else {
                        window.location.hash = '#beneficios';
                      }
                    }}
                    className="hover:text-nc-orange transition-colors"
                  >
                    Benefícios em Viagens
                  </a>
                </li>
                <li>
                  <a 
                    href="#termos" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (onOpenLegal) {
                        onOpenLegal('termos');
                      } else {
                        window.location.hash = '#termos';
                      }
                    }}
                    className="hover:text-nc-orange transition-colors"
                  >
                    Termos de Uso
                  </a>
                </li>
                <li className="pt-1">
                  <a 
                    href="#admin" 
                    className="text-nc-warm/30 hover:text-nc-orange text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Área Administrativa</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80"></span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-nc-warm/40">
            <p>&copy; {new Date().getFullYear()} NC Turismo. Todos os direitos reservados.</p>
            <p>NC TURISMO LTDA. • CNPJ 81.102.709/0001-08 • Curitiba/PR</p>
          </div>
        </div>
      </footer>
    </>
  );
};
