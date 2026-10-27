import React, { useState, useEffect } from 'react';
import { MessageCircle, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Building2, Users, Mail } from 'lucide-react';
import { saveLeadParceria } from '../lib/supabase';

export type LeadInteresse = 
  | 'gestao-viagens'
  | 'beneficios-parcerias'
  | 'eventos-mice'
  | 'viagens-lazer'
  | 'outro';

export interface LeadFormData {
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  cargo: string;
  interesse: LeadInteresse;
  // Campos condicionais para "Benefícios e Parcerias"
  tipoOrganizacao?: string;
  publicoBeneficiado?: string;
  quantidadePessoas?: string;
  // Tracking oculto
  origem_pagina: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  privacidadeAceita: boolean;
}

interface LeadFormProps {
  defaultInteresse?: LeadInteresse;
  sourceContext?: string;
  onOpenLegal?: (tab: 'privacidade' | 'beneficios' | 'termos') => void;
  className?: string;
  theme?: 'dark' | 'light';
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'b2b-simple';
  submitLabel?: string;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  defaultInteresse = 'gestao-viagens',
  sourceContext = 'geral',
  onOpenLegal,
  className = '',
  theme = 'dark',
  title,
  subtitle,
  variant = 'default',
  submitLabel
}) => {
  const [formData, setFormData] = useState<LeadFormData>({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    cargo: '',
    interesse: defaultInteresse,
    tipoOrganizacao: '',
    publicoBeneficiado: '',
    quantidadePessoas: '',
    origem_pagina: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: '',
    privacidadeAceita: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Captura automática de Tracking (Origem e Parâmetros UTM)
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      setFormData(prev => ({
        ...prev,
        origem_pagina: window.location.pathname + window.location.hash || sourceContext,
        utm_source: searchParams.get('utm_source') || '',
        utm_medium: searchParams.get('utm_medium') || '',
        utm_campaign: searchParams.get('utm_campaign') || '',
        utm_term: searchParams.get('utm_term') || '',
        utm_content: searchParams.get('utm_content') || ''
      }));
    } catch {
      // Ignora erro em ambientes sem window
    }
  }, [sourceContext]);

  // Se a prop defaultInteresse mudar, atualiza o form
  useEffect(() => {
    if (defaultInteresse) {
      setFormData(prev => ({ ...prev, interesse: defaultInteresse }));
    }
  }, [defaultInteresse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Grava no banco de dados Supabase e no localStorage via helper
      await saveLeadParceria({
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        empresa: formData.empresa,
        cargo: formData.cargo,
        interesse: formData.interesse,
        tipo_organizacao: formData.tipoOrganizacao,
        publico_beneficiado: formData.publicoBeneficiado,
        quantidade_pessoas: formData.quantidadePessoas,
        origem_pagina: formData.origem_pagina,
        utm_source: formData.utm_source,
        utm_medium: formData.utm_medium,
        utm_campaign: formData.utm_campaign,
        utm_term: formData.utm_term,
        utm_content: formData.utm_content,
        privacidade_aceita: formData.privacidadeAceita,
        status: 'novo'
      });
    } catch (err) {
      console.warn('Erro ao salvar lead:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 500);
  };

  // Gerador de mensagem formatada para o WhatsApp comercial (41 99683-0144)
  const generateWhatsAppUrl = () => {
    if (variant === 'b2b-simple') {
      const msg = `Olá equipe NC Turismo! Quero conhecer o programa de benefícios e parcerias.\n\n*Nome:* ${formData.nome}\n*Empresa/Entidade:* ${formData.empresa}\n*Cargo/Área:* ${formData.cargo || 'Não informado'}\n*WhatsApp:* ${formData.telefone}\n*E-mail:* ${formData.email}`;
      return `https://wa.me/5541996830144?text=${encodeURIComponent(msg)}`;
    }

    let msg = `Olá equipe NC Turismo! Acabei de enviar meus dados pelo site.\n\n*Nome:* ${formData.nome}\n*Empresa/Org:* ${formData.empresa}\n*Cargo:* ${formData.cargo}\n*Telefone:* ${formData.telefone}\n*E-mail:* ${formData.email}\n*Interesse:* `;
    
    switch (formData.interesse) {
      case 'beneficios-parcerias':
        msg += `Benefícios e Parcerias (NC Partners)\n*Tipo de Organização:* ${formData.tipoOrganizacao || 'Não informado'}\n*Público Beneficiado:* ${formData.publicoBeneficiado || 'Não informado'}\n*Qtd. Pessoas:* ${formData.quantidadePessoas || 'Não informado'}`;
        break;
      case 'gestao-viagens':
        msg += `Gestão de Viagens Corporativas`;
        break;
      case 'eventos-mice':
        msg += `Eventos e Grupos / MICE`;
        break;
      case 'viagens-lazer':
        msg += `Viagens de Lazer`;
        break;
      default:
        msg += `Outro assunto`;
    }

    return `https://wa.me/5541996830144?text=${encodeURIComponent(msg)}`;
  };

  const generateMailtoUrl = () => {
    const subject = `Novo Lead de Parceria: ${formData.empresa} (${formData.nome})`;
    const body = `Olá equipe NC Turismo,\n\nRecebemos uma nova solicitação no site:\n\nNome: ${formData.nome}\nEmpresa/Entidade: ${formData.empresa}\nCargo/Área: ${formData.cargo || '-'}\nE-mail: ${formData.email}\nWhatsApp: ${formData.telefone}\nInteresse: ${formData.interesse}\nOrigem: ${formData.origem_pagina}\nUTM Source: ${formData.utm_source || '-'}\n`;
    return `mailto:atendimento@ncturismo.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const isDark = theme === 'dark';

  return (
    <div className={`rounded-3xl p-6 md:p-10 transition-all ${
      isDark 
        ? 'bg-[#0F131A] border border-white/10 shadow-2xl text-white' 
        : 'bg-white border border-slate-200/90 shadow-xl text-[#0F172A]'
    } ${className}`}>
      
      {submitted ? (
        <div className="py-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className={`text-2xl font-bold font-display ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
              Solicitação Enviada com Sucesso!
            </h3>
            <p className={`text-sm ${isDark ? 'text-nc-warm/70' : 'text-slate-600'}`}>
              Seus dados foram registrados com segurança em nosso sistema e direcionados para <span className="font-semibold text-emerald-500">atendimento@ncturismo.com.br</span>. Nossa equipe comercial entrará em contato em breve.
            </p>
          </div>

          {/* Chamada para Ação Solicitada: Pós-envio WhatsApp para 41 99683-0144 */}
          <div className={`p-6 rounded-2xl border max-w-md mx-auto space-y-3 ${
            isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
          }`}>
            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
              Prefere agilidade máxima ou falar agora?
            </p>
            
            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:brightness-105 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <MessageCircle size={18} />
              <span>Prefere falar agora? Chame a NC pelo WhatsApp</span>
            </a>

            <a
              href={generateMailtoUrl()}
              className={`inline-flex items-center justify-center gap-2 text-xs font-medium py-2 px-4 rounded-xl transition-colors ${
                isDark ? 'text-white/70 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Mail size={14} />
              <span>Enviar cópia para atendimento@ncturismo.com.br</span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setFormData(prev => ({
                ...prev,
                nome: '',
                email: '',
                telefone: '',
                empresa: '',
                cargo: ''
              }));
            }}
            className={`text-xs font-semibold underline transition-colors cursor-pointer ${
              isDark ? 'text-nc-warm/50 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Enviar outra solicitação
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {(title || subtitle) && (
            <div className="space-y-1 mb-6">
              {title && (
                <h3 className={`text-xl md:text-2xl font-bold font-display ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className={`text-xs md:text-sm ${isDark ? 'text-nc-warm/60' : 'text-slate-500'}`}>
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Inputs Ocultos de Rastreamento (Tracking) */}
          <input type="hidden" name="origem_pagina" value={formData.origem_pagina} />
          <input type="hidden" name="utm_source" value={formData.utm_source} />
          <input type="hidden" name="utm_medium" value={formData.utm_medium} />
          <input type="hidden" name="utm_campaign" value={formData.utm_campaign} />
          <input type="hidden" name="utm_term" value={formData.utm_term} />
          <input type="hidden" name="utm_content" value={formData.utm_content} />

          {variant === 'b2b-simple' ? (
            /* MODO SIMPLIFICADO B2B (ETAPA 3): Alinhamento simétrico em 2 colunas + linha dedicada para Cargo/área */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col justify-end">
                <label className={`flex items-center justify-between gap-1 text-xs uppercase tracking-wider font-semibold mb-2 ${
                  isDark ? 'text-nc-warm/80' : 'text-slate-700'
                }`}>
                  <span>Nome <span className="text-[#C8102E]">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Seu nome completo"
                  value={formData.nome}
                  onChange={e => setFormData({ ...formData, nome: e.target.value })}
                  className={`w-full h-12 px-4 rounded-xl text-sm transition-all focus:outline-none ${
                    isDark
                      ? 'bg-[#151A24] border border-white/10 text-white placeholder:text-nc-warm/30 focus:border-[#DB8902]'
                      : 'bg-slate-50 border border-slate-200 text-[#0F172A] placeholder:text-slate-400 focus:border-[#C8102E] focus:bg-white'
                  }`}
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className={`flex items-center justify-between gap-1 text-xs uppercase tracking-wider font-semibold mb-2 ${
                  isDark ? 'text-nc-warm/80' : 'text-slate-700'
                }`}>
                  <span>Empresa / Entidade <span className="text-[#C8102E]">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nome da empresa ou entidade"
                  value={formData.empresa}
                  onChange={e => setFormData({ ...formData, empresa: e.target.value })}
                  className={`w-full h-12 px-4 rounded-xl text-sm transition-all focus:outline-none ${
                    isDark
                      ? 'bg-[#151A24] border border-white/10 text-white placeholder:text-nc-warm/30 focus:border-[#DB8902]'
                      : 'bg-slate-50 border border-slate-200 text-[#0F172A] placeholder:text-slate-400 focus:border-[#C8102E] focus:bg-white'
                  }`}
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className={`flex items-center justify-between gap-1 text-xs uppercase tracking-wider font-semibold mb-2 ${
                  isDark ? 'text-nc-warm/80' : 'text-slate-700'
                }`}>
                  <span>E-mail <span className="text-[#C8102E]">*</span></span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="seu.email@empresa.com.br"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full h-12 px-4 rounded-xl text-sm transition-all focus:outline-none ${
                    isDark
                      ? 'bg-[#151A24] border border-white/10 text-white placeholder:text-nc-warm/30 focus:border-[#DB8902]'
                      : 'bg-slate-50 border border-slate-200 text-[#0F172A] placeholder:text-slate-400 focus:border-[#C8102E] focus:bg-white'
                  }`}
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className={`flex items-center justify-between gap-1 text-xs uppercase tracking-wider font-semibold mb-2 ${
                  isDark ? 'text-nc-warm/80' : 'text-slate-700'
                }`}>
                  <span>WhatsApp <span className="text-[#C8102E]">*</span></span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={e => setFormData({ ...formData, telefone: e.target.value })}
                  className={`w-full h-12 px-4 rounded-xl text-sm transition-all focus:outline-none ${
                    isDark
                      ? 'bg-[#151A24] border border-white/10 text-white placeholder:text-nc-warm/30 focus:border-[#DB8902]'
                      : 'bg-slate-50 border border-slate-200 text-[#0F172A] placeholder:text-slate-400 focus:border-[#C8102E] focus:bg-white'
                  }`}
                />
              </div>

              <div className="sm:col-span-2 flex flex-col justify-end">
                <label className={`flex items-center justify-between gap-2 text-xs uppercase tracking-wider font-semibold mb-2 ${
                  isDark ? 'text-nc-warm/80' : 'text-slate-700'
                }`}>
                  <span>Cargo ou Área</span>
                  <span className={`text-[11px] font-normal normal-case tracking-normal ${isDark ? 'text-nc-warm/40' : 'text-slate-400'}`}>
                    Opcional
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Recursos Humanos (RH), Diretoria, Compras, Presidência..."
                  value={formData.cargo}
                  onChange={e => setFormData({ ...formData, cargo: e.target.value })}
                  className={`w-full h-12 px-4 rounded-xl text-sm transition-all focus:outline-none ${
                    isDark
                      ? 'bg-[#151A24] border border-white/10 text-white placeholder:text-nc-warm/30 focus:border-[#DB8902]'
                      : 'bg-slate-50 border border-slate-200 text-[#0F172A] placeholder:text-slate-400 focus:border-[#C8102E] focus:bg-white'
                  }`}
                />
              </div>
            </div>
          ) : (
            <>
              {/* GRADE SIMÉTRICA DE 2 COLUNAS PARA ALINHAMENTO PERFEITO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col justify-end">
                  <label className={`block text-xs uppercase tracking-wider font-semibold mb-2 ${
                    isDark ? 'text-nc-warm/80' : 'text-slate-700'
                  }`}>
                    Nome completo <span className="text-[#C8102E]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome completo"
                    value={formData.nome}
                    onChange={e => setFormData({ ...formData, nome: e.target.value })}
                    className={`w-full h-12 px-4 rounded-xl text-sm transition-all focus:outline-none ${
                      isDark
                        ? 'bg-[#151A24] border border-white/10 text-white placeholder:text-nc-warm/30 focus:border-[#DB8902]'
                        : 'bg-slate-50 border border-slate-200 text-[#0F172A] placeholder:text-slate-400 focus:border-[#C8102E] focus:bg-white'
                    }`}
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className={`block text-xs uppercase tracking-wider font-semibold mb-2 ${
                    isDark ? 'text-nc-warm/80' : 'text-slate-700'
                  }`}>
                    E-mail corporativo / pessoal <span className="text-[#C8102E]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="seu.email@empresa.com.br"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full h-12 px-4 rounded-xl text-sm transition-all focus:outline-none ${
                      isDark
                        ? 'bg-[#151A24] border border-white/10 text-white placeholder:text-nc-warm/30 focus:border-[#DB8902]'
                        : 'bg-slate-50 border border-slate-200 text-[#0F172A] placeholder:text-slate-400 focus:border-[#C8102E] focus:bg-white'
                    }`}
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className={`block text-xs uppercase tracking-wider font-semibold mb-2 ${
                    isDark ? 'text-nc-warm/80' : 'text-slate-700'
                  }`}>
                    Telefone / WhatsApp <span className="text-[#C8102E]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={e => setFormData({ ...formData, telefone: e.target.value })}
                    className={`w-full h-12 px-4 rounded-xl text-sm transition-all focus:outline-none ${
                      isDark
                        ? 'bg-[#151A24] border border-white/10 text-white placeholder:text-nc-warm/30 focus:border-[#DB8902]'
                        : 'bg-slate-50 border border-slate-200 text-[#0F172A] placeholder:text-slate-400 focus:border-[#C8102E] focus:bg-white'
                    }`}
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className={`block text-xs uppercase tracking-wider font-semibold mb-2 ${
                    isDark ? 'text-nc-warm/80' : 'text-slate-700'
                  }`}>
                    Empresa ou organização <span className="text-[#C8102E]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nome da empresa ou entidade"
                    value={formData.empresa}
                    onChange={e => setFormData({ ...formData, empresa: e.target.value })}
                    className={`w-full h-12 px-4 rounded-xl text-sm transition-all focus:outline-none ${
                      isDark
                        ? 'bg-[#151A24] border border-white/10 text-white placeholder:text-nc-warm/30 focus:border-[#DB8902]'
                        : 'bg-slate-50 border border-slate-200 text-[#0F172A] placeholder:text-slate-400 focus:border-[#C8102E] focus:bg-white'
                    }`}
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className={`block text-xs uppercase tracking-wider font-semibold mb-2 ${
                    isDark ? 'text-nc-warm/80' : 'text-slate-700'
                  }`}>
                    Cargo / Área <span className="text-[#C8102E]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Diretor, RH, Gestor"
                    value={formData.cargo}
                    onChange={e => setFormData({ ...formData, cargo: e.target.value })}
                    className={`w-full h-12 px-4 rounded-xl text-sm transition-all focus:outline-none ${
                      isDark
                        ? 'bg-[#151A24] border border-white/10 text-white placeholder:text-nc-warm/30 focus:border-[#DB8902]'
                        : 'bg-slate-50 border border-slate-200 text-[#0F172A] placeholder:text-slate-400 focus:border-[#C8102E] focus:bg-white'
                    }`}
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className={`block text-xs uppercase tracking-wider font-semibold mb-2 ${
                    isDark ? 'text-nc-warm/80' : 'text-slate-700'
                  }`}>
                    Tenho interesse em: <span className="text-[#C8102E]">*</span>
                  </label>
                  <select
                    value={formData.interesse}
                    onChange={e => setFormData({ ...formData, interesse: e.target.value as LeadInteresse })}
                    className={`w-full h-12 px-4 rounded-xl text-sm font-medium transition-all focus:outline-none cursor-pointer ${
                      isDark
                        ? 'bg-[#151A24] border border-white/10 text-white focus:border-[#DB8902]'
                        : 'bg-slate-50 border border-slate-200 text-[#0F172A] focus:border-[#C8102E] focus:bg-white'
                    }`}
                  >
                    <option value="gestao-viagens">Gestão de viagens corporativas</option>
                    <option value="beneficios-parcerias">Benefícios e Parcerias (NC Partners)</option>
                    <option value="eventos-mice">Eventos e grupos / MICE</option>
                    <option value="viagens-lazer">Viagens de lazer</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>

              {/* 4. CAMPOS CONDICIONAIS: Se o interesse for "Benefícios e Parcerias" */}
              {formData.interesse === 'beneficios-parcerias' && (
                <div className={`p-5 md:p-6 rounded-2xl border space-y-5 animate-in fade-in slide-in-from-top-2 duration-200 ${
                  isDark
                    ? 'bg-gradient-to-br from-amber-500/10 via-red-500/5 to-transparent border-[#DB8902]/30'
                    : 'bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-white border-amber-300'
                }`}>
                  <div className="flex items-center gap-2 pb-1 border-b border-amber-500/20">
                    <Sparkles size={16} className="text-[#DB8902]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#DB8902]">
                      Informações sobre a Parceria / NC Partners
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Tipo de organização */}
                    <div className="flex flex-col justify-end">
                      <label className={`block text-xs uppercase tracking-wider font-semibold mb-2 ${
                        isDark ? 'text-nc-warm/80' : 'text-slate-700'
                      }`}>
                        Tipo de organização <span className="text-[#C8102E]">*</span>
                      </label>
                      <select
                        required
                        value={formData.tipoOrganizacao}
                        onChange={e => setFormData({ ...formData, tipoOrganizacao: e.target.value })}
                        className={`w-full h-12 px-4 rounded-xl text-sm transition-all focus:outline-none cursor-pointer ${
                          isDark
                            ? 'bg-[#151A24] border border-white/10 text-white focus:border-[#DB8902]'
                            : 'bg-white border border-slate-200 text-[#0F172A] focus:border-[#C8102E]'
                        }`}
                      >
                        <option value="">Selecione o tipo</option>
                        <option value="Empresa">Empresa Privada</option>
                        <option value="Associação">Associação</option>
                        <option value="Federação">Federação</option>
                        <option value="Cooperativa">Cooperativa</option>
                        <option value="Outra">Outra</option>
                      </select>
                    </div>

                    {/* Público que pretende beneficiar */}
                    <div className="flex flex-col justify-end">
                      <label className={`block text-xs uppercase tracking-wider font-semibold mb-2 ${
                        isDark ? 'text-nc-warm/80' : 'text-slate-700'
                      }`}>
                        Público que pretende beneficiar <span className="text-[#C8102E]">*</span>
                      </label>
                      <select
                        required
                        value={formData.publicoBeneficiado}
                        onChange={e => setFormData({ ...formData, publicoBeneficiado: e.target.value })}
                        className={`w-full h-12 px-4 rounded-xl text-sm transition-all focus:outline-none cursor-pointer ${
                          isDark
                            ? 'bg-[#151A24] border border-white/10 text-white focus:border-[#DB8902]'
                            : 'bg-white border border-slate-200 text-[#0F172A] focus:border-[#C8102E]'
                        }`}
                      >
                        <option value="">Selecione o público</option>
                        <option value="Colaboradores">Colaboradores (Empresa)</option>
                        <option value="Associados">Associados</option>
                        <option value="Cooperados">Cooperados</option>
                        <option value="Membros">Membros / Filiados</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                  </div>

                  {/* Quantidade aproximada de pessoas beneficiadas */}
                  <div className="flex flex-col justify-end">
                    <label className={`block text-xs uppercase tracking-wider font-semibold mb-2 ${
                      isDark ? 'text-nc-warm/80' : 'text-slate-700'
                    }`}>
                      Quantidade aproximada de pessoas beneficiadas <span className="text-[#C8102E]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 50 a 200 pessoas, 500 associados, etc."
                      value={formData.quantidadePessoas}
                      onChange={e => setFormData({ ...formData, quantidadePessoas: e.target.value })}
                      className={`w-full h-12 px-4 rounded-xl text-sm transition-all focus:outline-none ${
                        isDark
                          ? 'bg-[#151A24] border border-white/10 text-white placeholder:text-nc-warm/30 focus:border-[#DB8902]'
                          : 'bg-white border border-slate-200 text-[#0F172A] placeholder:text-slate-400 focus:border-[#C8102E]'
                      }`}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* 5. Privacidade Simplificada (Texto e link obrigatórios solicitados) */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer group select-none">
              <input
                type="checkbox"
                required
                checked={formData.privacidadeAceita}
                onChange={e => setFormData({ ...formData, privacidadeAceita: e.target.checked })}
                className="mt-1 w-4 h-4 rounded text-[#C8102E] accent-[#C8102E] focus:ring-[#C8102E] cursor-pointer shrink-0"
              />
              <span className={`text-xs leading-relaxed ${isDark ? 'text-nc-warm/70' : 'text-slate-600'}`}>
                Li e estou ciente da{' '}
                <a
                  href="#privacidade"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenLegal) onOpenLegal('privacidade');
                    else window.location.hash = '#privacidade';
                  }}
                  className="text-[#C8102E] hover:underline font-semibold"
                >
                  Política de Privacidade
                </a>{' '}
                da NC Turismo.
              </span>
            </label>
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-8 rounded-xl font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-[#C8102E] via-[#D32F2F] to-[#DB8902] hover:brightness-110 active:scale-[0.99] text-white transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Enviando dados...</span>
              </>
            ) : (
              <>
                <span>{submitLabel || (variant === 'b2b-simple' ? 'Quero conhecer o programa' : 'Enviar Solicitação')}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      )}

    </div>
  );
};
