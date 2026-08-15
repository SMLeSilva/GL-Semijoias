'use client';

import React, { useState, useEffect } from 'react';
import { Lock, X, KeyRound, AlertCircle, Sparkles } from 'lucide-react';
import { loginAdmin } from '@/lib/adminStorage';
import { useRouter } from 'next/navigation';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(pin)) {
      setError(false);
      onClose();
      router.push('/admin');
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl transition-transform ${
          shake ? 'animate-bounce' : ''
        }`}
      >
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ícone e Título */}
        <div className="text-center space-y-3 mb-6">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-amber-700 flex items-center justify-center text-neutral-950 shadow-lg shadow-[#D4AF37]/20">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-semibold text-white tracking-wide flex items-center justify-center gap-2">
              Acesso Restrito
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Digite a senha/PIN de administrador para acessar o painel de gestão
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
              PIN de Acesso
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Digite o PIN..."
              autoFocus
              maxLength={20}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-center tracking-widest text-lg text-white font-mono placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>PIN incorreto. Tente novamente.</span>
            </div>
          )}

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 px-4 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 text-xs font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#c49f27] text-neutral-950 font-semibold text-xs transition-all shadow-md shadow-[#D4AF37]/10 active:scale-95"
            >
              Acessar Painel
            </button>
          </div>
        </form>

        {/* Rodapé do Modal */}
        <div className="mt-6 pt-4 border-t border-neutral-800 text-center">
          <span className="text-[10px] text-neutral-500 tracking-wider uppercase">
            Acesso Restrito • Gestão de Estoque e Finanças
          </span>
        </div>
      </div>
    </div>
  );
};
