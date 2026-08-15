import React from 'react';
import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryCard } from '@/components/catalog/CategoryCard';
import { FeaturedSection } from '@/components/catalog/FeaturedSection';
import { categories } from '@/data/categories';
import { Sparkles, ArrowDown } from 'lucide-react';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';

export default function HomePage() {
  return (
    <>
      {/* Banner Principal */}
      <HeroBanner />

      {/* Seção Principal: Listagem dos Catálogos (Categorias) em Cards Horizontais */}
      <section id="catalogos" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cabeçalho da Seção */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nossos Catálogos</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Explore Nossas Coleções de Semijoias & Aço Inox
            </h2>

            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              Navegue pelas nossas 8 categorias exclusivas com opções em semijoias banhadas a ouro e peças em aço inox.
            </p>

            <div className="pt-2 flex justify-center">
              <ArrowDown className="w-5 h-5 text-[#D4AF37] animate-bounce" />
            </div>
          </div>

          {/* Cards Horizontais de Categorias */}
          <div className="space-y-8">
            {categories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Peças em Destaque */}
      <FeaturedSection />

      {/* Seção de Chamada para Atendimento Direto */}
      <section className="bg-neutral-900 text-white py-16 border-t border-neutral-800">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <span className="text-[#D4AF37] uppercase tracking-widest font-semibold text-xs">
            Atendimento Exclusivo para Revenda ou Varejo
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">
            Procurando uma peça específica ou atendimento sob medida?
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto">
            Nossa equipe de consultoras de estilo está disponível em tempo real pelo WhatsApp para enviar fotos detalhadas, esclarecer dúvidas sobre banhos e aceitar solicitações.
          </p>
          <div className="pt-2 flex justify-center">
            <WhatsAppButton variant="primary" label="Falar Agora com uma Consultora" className="text-sm py-3.5 px-8" />
          </div>
        </div>
      </section>
    </>
  );
}
