import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

interface ConversaoProps {
  onOpenLegal?: (tab: 'privacidade' | 'beneficios' | 'termos') => void;
}

export const Conversao: React.FC<ConversaoProps> = ({ onOpenLegal }) => {
  const [formStatus, setFormStatus] = useState<'idle' | 'demo'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Em modo protótipo sem backend, não simular envio real
    setFormStatus('demo');
  };

  return (
    <>
      <section id="diagnostico" className="py-24 md:py-32 bg-[#0c0e12] relative z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          <div className="lg:w-5/12">
            <h2 className="text-white text-[32px] md:text-[48px] font-bold leading-[1.1] mb-8">
              Vamos organizar a próxima etapa da sua <span className="text-nc-orange">gestão de viagens?</span>
            </h2>
            <p className="text-nc-warm/70 text-lg mb-12">
              Inicie uma conversa com nossa equipe comercial. Entenderemos seu cenário atual para propor uma estrutura tecnológica e humana adequada à sua empresa.
            </p>

            <div className="bg-nc-surface border border-white/5 p-8 rounded-2xl">
              <h3 className="text-white font-semibold mb-2">Prefere mensagem?</h3>
              <p className="text-nc-warm/60 text-sm mb-6">Nosso canal comercial também está disponível via WhatsApp em horário comercial.</p>
              <a 
                href="#whatsapp" 
                className="inline-flex items-center gap-2 text-nc-orange hover:text-white transition-colors font-medium text-sm uppercase tracking-wider"
              >
                <MessageCircle size={18} /> Iniciar no WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:w-7/12">
            <div className="bg-nc-space border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
              {formStatus === 'demo' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-nc-orange/20 text-nc-orange rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold">i</span>
                  </div>
                  <h3 className="text-white text-2xl font-bold mb-4">Modo Demonstração</h3>
                  <p className="text-nc-warm/70">
                    Este formulário está em modo de demonstração no protótipo. O envio não foi processado e os dados não foram armazenados. A integração com o sistema oficial de CRM da NC Turismo será feita na fase de desenvolvimento backend.
                  </p>
                  <button 
                    onClick={() => setFormStatus('idle')}
                    className="mt-8 px-6 py-3 bg-white/10 rounded-full text-white text-sm font-bold hover:bg-white/20 transition-colors"
                  >
                    Voltar ao formulário
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="nome" className="block text-nc-warm/80 text-sm font-medium mb-2">Nome <span className="text-nc-orange">*</span></label>
                      <input type="text" id="nome" required className="w-full bg-nc-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-nc-orange/50 transition-colors" />
                    </div>
                    <div>
                      <label htmlFor="empresa" className="block text-nc-warm/80 text-sm font-medium mb-2">Empresa <span className="text-nc-orange">*</span></label>
                      <input type="text" id="empresa" required className="w-full bg-nc-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-nc-orange/50 transition-colors" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-nc-warm/80 text-sm font-medium mb-2">E-mail corporativo <span className="text-nc-orange">*</span></label>
                      <input type="email" id="email" required className="w-full bg-nc-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-nc-orange/50 transition-colors" />
                    </div>
                    <div>
                      <label htmlFor="telefone" className="block text-nc-warm/80 text-sm font-medium mb-2">Telefone <span className="text-nc-orange">*</span></label>
                      <input type="tel" id="telefone" required className="w-full bg-nc-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-nc-orange/50 transition-colors" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="cidade" className="block text-nc-warm/80 text-sm font-medium mb-2">Cidade (Opcional)</label>
                      <input type="text" id="cidade" className="w-full bg-nc-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-nc-orange/50 transition-colors" />
                    </div>
                    <div>
                      <label htmlFor="volume" className="block text-nc-warm/80 text-sm font-medium mb-2">Volume de viagens / mês (Opcional)</label>
                      <select id="volume" className="w-full bg-nc-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-nc-orange/50 transition-colors appearance-none">
                        <option value="">Selecione uma faixa</option>
                        <option value="ate-10">Até 10 viagens</option>
                        <option value="11-50">11 a 50 viagens</option>
                        <option value="51-200">51 a 200 viagens</option>
                        <option value="mais-200">Mais de 200 viagens</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="desafio" className="block text-nc-warm/80 text-sm font-medium mb-2">Principal desafio hoje (Opcional)</label>
                    <textarea id="desafio" rows={3} className="w-full bg-nc-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-nc-orange/50 transition-colors resize-none"></textarea>
                  </div>

                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="consentimento" required className="mt-1 w-4 h-4 rounded bg-nc-surface border-white/10 text-nc-orange focus:ring-nc-orange/50" />
                    <label htmlFor="consentimento" className="text-sm text-nc-warm/60">
                      Concordo em fornecer meus dados para que a equipe comercial da NC Turismo entre em contato, em conformidade com a{' '}
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
                        className="text-nc-orange hover:underline font-medium"
                      >
                        Política de Privacidade
                      </a>.
                    </label>
                  </div>

                  <button type="submit" className="w-full md:w-auto px-10 py-4 bg-nc-orange rounded-full text-nc-space text-[14px] font-bold hover:bg-opacity-90 transition-all uppercase tracking-wider">
                    Solicitar contato
                  </button>
                </form>
              )}
            </div>
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
                <li><a href="#area-cliente" className="hover:text-nc-orange transition-colors">Área do Cliente</a></li>
                <li><a href="#plantao" className="hover:text-nc-orange transition-colors">Plantão Emergencial</a></li>
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
            <p>N C TURISMO LTDA. • CNPJ 81.102.709/0001-08 • Curitiba/PR</p>
          </div>
        </div>
      </footer>
    </>
  );
};
