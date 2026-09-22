import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Lock, Mail, Eye, EyeOff, AlertCircle, Building2, CheckCircle2 } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setInfoMsg(null);

    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          onLoginSuccess();
        }
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        if (data.user && !data.session) {
          setInfoMsg('Cadastro realizado! Por favor, verifique o e-mail de confirmação ou faça login caso a confirmação esteja desativada no seu Supabase.');
        } else if (data.session) {
          onLoginSuccess();
        }
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
        if (error) throw error;
        setInfoMsg('Instruções de redefinição de senha foram enviadas para o seu e-mail.');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let message = err.message || 'Ocorreu um erro na autenticação.';
      if (message.includes('Invalid login credentials')) {
        message = 'E-mail ou senha incorretos. Verifique suas credenciais no Supabase Auth.';
      } else if (message.includes('Email not confirmed')) {
        message = 'E-mail ainda não confirmado. Verifique sua caixa de entrada.';
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0e12] text-nc-warm flex flex-col justify-center items-center px-6 py-12 selection:bg-nc-orange selection:text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-nc-orange/5 blur-[140px] pointer-events-none rounded-full" />

      {/* Top back button */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center z-10">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-nc-warm/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={15} className="text-nc-orange" />
          Voltar ao site público
        </button>

        <span className="text-[11px] font-mono text-nc-orange/80 bg-nc-orange/10 px-2.5 py-1 rounded-full border border-nc-orange/20">
          Supabase Connected
        </span>
      </div>

      {/* Card Form */}
      <div className="w-full max-w-md bg-nc-surface/90 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-nc-orange/15 border border-nc-orange/30 flex items-center justify-center text-nc-orange">
            <Building2 size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">NC Painel Administrativo</h1>
            <p className="text-xs text-nc-warm/60">Gestão de Conteúdo & Blog</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {infoMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2.5">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <p className="leading-relaxed">{infoMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-nc-warm/70 mb-2">
              E-mail corporativo
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-nc-warm/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mkt@ncturismo.com.br"
                className="w-full bg-[#0c0e12] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-nc-warm/30 focus:outline-none focus:border-nc-orange transition-colors"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-nc-warm/70">
                  Senha de acesso
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setErrorMsg(null); setInfoMsg(null); }}
                    className="text-xs text-nc-orange hover:underline"
                  >
                    Esqueceu?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-nc-warm/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0c0e12] border border-white/10 rounded-xl pl-11 pr-11 py-3 text-sm text-white placeholder:text-nc-warm/30 focus:outline-none focus:border-nc-orange transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-nc-warm/40 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-nc-orange text-nc-space font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-opacity-95 transition-all shadow-lg shadow-nc-orange/10 disabled:opacity-50 mt-2"
          >
            {loading ? (
              'Autenticando...'
            ) : mode === 'signin' ? (
              'Entrar no Painel'
            ) : mode === 'signup' ? (
              'Criar Conta de Administrador'
            ) : (
              'Enviar link de redefinição'
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-nc-warm/60">
          {mode === 'signin' ? (
            <>
              <span>Primeiro acesso?</span>
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(null); setInfoMsg(null); }}
                className="text-nc-orange font-semibold hover:underline"
              >
                Cadastrar membro
              </button>
            </>
          ) : (
            <>
              <span>Já possui credencial?</span>
              <button
                type="button"
                onClick={() => { setMode('signin'); setErrorMsg(null); setInfoMsg(null); }}
                className="text-nc-orange font-semibold hover:underline"
              >
                Fazer login
              </button>
            </>
          )}
        </div>
      </div>

      {/* Security notice */}
      <p className="text-[11px] text-nc-warm/40 text-center max-w-sm mt-8 z-10">
        Área restrita à equipe autorizada da NC Turismo. Todas as sessões e modificações são protegidas por Row Level Security no PostgreSQL.
      </p>
    </div>
  );
};
