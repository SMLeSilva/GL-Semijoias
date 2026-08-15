'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAdminAuthenticated, logoutAdmin, loginAdmin } from '@/lib/adminStorage';
import { ShieldCheck, LogOut, ArrowLeft, Lock, KeyRound, Sparkles } from 'lucide-react';
import { brandConfig } from '@/data/brand';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setAuthenticated(isAdminAuthenticated());
  }, []);

  const handleLogout = () => {
    logoutAdmin();
    setAuthenticated(false);
    router.push('/');
  };

  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(pinInput)) {
      setLoginError(false);
      setAuthenticated(true);
    } else {
      setLoginError(true);
    }
  };

  // Carregando estado inicial do cliente
  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-neutral-400">Verificando credenciais...</span>
        </div>
      </div>
    );
  }

  // Não Autenticado -> Exibe Tela de Bloqueio Direto
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="font-serif text-2xl font-bold tracking-wide">Acesso Restrito ao Admin</h1>
            <p className="text-xs text-neutral-400 mt-2">
              Esta área é restrita aos administradores de {brandConfig.name}. Digite a senha para continuar.
            </p>
          </div>

          <form onSubmit={handleInlineLogin} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if (loginError) setLoginError(false);
                  }}
                  placeholder="Digite a senha / PIN..."
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-center tracking-widest text-lg font-mono placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                />
              </div>
              {loginError && (
                <p className="text-xs text-rose-400 mt-2">Senha incorreta. Tente novamente.</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#D4AF37] hover:bg-[#c49f27] text-neutral-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-[#D4AF37]/10"
            >
              Entrar no Painel
            </button>
          </form>

          <div className="pt-4 border-t border-neutral-800 flex items-center justify-center">
            <Link
              href="/"
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para o Catálogo Público
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Autenticado -> Exibe o Layout Completo do Admin
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Navbar do Admin */}
      <header className="sticky top-0 z-40 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors"
              title="Ir para a loja pública"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="h-5 w-px bg-neutral-800 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-serif text-sm font-bold text-white tracking-wide block leading-tight">
                  {brandConfig.name} Admin
                </span>
                <span className="text-[10px] text-[#D4AF37] font-medium tracking-wider uppercase flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Gestão de Estoque & Vendas
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-300 hover:text-white text-xs font-medium transition-colors"
            >
              Ver Loja Pública
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-medium transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal do Painel */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
