import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-black px-4 py-16">
      <div className="text-center max-w-md space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>

        <h1 className="font-serif text-4xl font-bold text-white">
          Página não encontrada
        </h1>

        <p className="text-neutral-400 text-sm leading-relaxed">
          O catálogo ou categoria que você procurou não foi encontrado ou está temporariamente indisponível.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center font-semibold text-xs py-3 px-6 rounded-full bg-[#D4AF37] text-neutral-950 hover:bg-[#c49f27] hover:scale-105 active:scale-95 transition-luxury gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Início</span>
          </Link>

          <WhatsAppButton variant="outline" label="Falar no WhatsApp" className="text-xs py-3 px-6 w-full sm:w-auto" />
        </div>
      </div>
    </div>
  );
}
