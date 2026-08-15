import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative bg-neutral-950 text-white overflow-hidden py-16 sm:py-20 lg:py-24 border-b border-neutral-900">
      {/* Background Decorativo e Blur Dourado Sutil */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Lado Esquerdo: Mensagem de Boas-Vindas & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-xs font-semibold text-[#D4AF37]">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Coleção Exclusiva de Semijoias</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Elegância e Sofisticação em Dourado e Prata
            </h1>

            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Conheça nosso catálogo exclusivo de brincos, colares, pulseiras, anéis, tornozeleiras, relógios, piercings e conjuntos. Peças de alta qualidade em semijoias e aço inox com acabamento impecável para elevar a sua elegância.
            </p>

            {/* Ações / CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="#catalogos"
                className="w-full sm:w-auto inline-flex items-center justify-center font-semibold text-sm px-8 py-3.5 rounded-full bg-gold-gradient text-neutral-950 hover:scale-105 transition-luxury gap-2 shadow-md"
              >
                <span>Explorar Catálogos</span>
                <ArrowRight className="w-4 h-4 text-neutral-950" />
              </Link>

              <WhatsAppButton
                variant="outline"
                label="Atendimento Personalizado"
                className="w-full sm:w-auto text-white border-neutral-800 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10"
              />
            </div>
          </div>

          {/* Lado Direito: Imagem Principal de Destaque */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-neutral-900 shadow-xl group">
              <Image
                src="/images/hero-banner.png"
                alt="Semijoia Fina Aurum Co"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
