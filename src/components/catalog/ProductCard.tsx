'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Tag, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { Product } from '@/types/catalog';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';

interface ProductCardProps {
  product: Product;
  priorityImage?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priorityImage = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const hasMultipleImages = product.images && product.images.length > 1;

  return (
    <div className="bg-neutral-950 rounded-2xl border border-neutral-900 shadow-sm hover:border-[#D4AF37]/30 transition-luxury overflow-hidden flex flex-col md:flex-row my-6">
      {/* Lado Esquerdo: Foto do Produto em Destaque */}
      <div className="md:w-1/2 lg:w-5/12 relative min-h-[300px] md:min-h-[380px] bg-[#0D0D0D] image-zoom-container flex items-center justify-center p-4">
        {/* Badge de Banho / Destaque */}
        {product.isFeatured && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-neutral-900 text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-neutral-800">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Destaque
            </span>
          </div>
        )}

        {/* Setas de navegação de imagem */}
        {hasMultipleImages && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-900/90 text-white border border-neutral-800 shadow-md backdrop-blur-sm transition-all hover:bg-neutral-800 hover:scale-105 active:scale-95 z-20 focus:outline-none cursor-pointer"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-900/90 text-white border border-neutral-800 shadow-md backdrop-blur-sm transition-all hover:bg-neutral-800 hover:scale-105 active:scale-95 z-20 focus:outline-none cursor-pointer"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Componente <Image/> do Next.js */}
        <div className="relative w-full h-full min-h-[280px]">
          <Image
            key={currentImageIndex}
            src={product.images[currentImageIndex] || '/images/hero-banner.png'}
            alt={`${product.name} - Imagem ${currentImageIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            priority={priorityImage}
            className="object-cover object-center rounded-xl animate-fade-in"
          />
          
          {/* Indicadores de bolinha */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Ir para imagem ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lado Direito: Detalhes da Peça */}
      <div className="md:w-1/2 lg:w-7/12 p-6 sm:p-8 flex flex-col justify-between bg-neutral-950">
        <div>
          {/* Categoria e Material */}
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2 gap-2 flex-wrap">
            <span className="uppercase tracking-wider font-semibold text-[#D4AF37]">
              {product.categoryName}
            </span>

            {product.material === 'inox' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-900 border border-neutral-700 text-neutral-200">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Aço Inox
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Semijoia Banhada
              </span>
            )}
          </div>

          {/* Nome do Produto */}
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
            {product.name}
          </h3>

          {/* Descrição Curta */}
          <p className="mt-3 text-neutral-400 text-sm leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Rodapé do Card com Preço/Sob Consulta e Botão WhatsApp */}
        <div className="mt-6 pt-5 border-t border-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-neutral-500 block uppercase tracking-wider">
              Valor
            </span>
            {product.priceConsult || !product.price ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-md border border-[#D4AF37]/20 mt-1">
                <Tag className="w-3.5 h-3.5" />
                Sob Consulta
              </span>
            ) : (
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xs text-neutral-400 font-medium">R$</span>
                <span className="text-2xl font-bold font-serif text-white">
                  {product.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[11px] text-neutral-500 font-normal ml-1">
                  em até 3x sem juros
                </span>
              </div>
            )}
          </div>

          {/* Botão de Solicitação no WhatsApp com Mensagem Pré-formatada */}
          <WhatsAppButton
            productName={product.name}
            categoryName={product.categoryName}
            bathInfo={product.bathInfo}
            variant="primary"
            className="w-full sm:w-auto text-xs py-3 px-5 shadow-md"
          />
        </div>
      </div>
    </div>
  );
};
