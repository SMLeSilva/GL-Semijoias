import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Category } from '@/types/catalog';

interface CategoryCardProps {
  category: Category;
  index: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, index }) => {
  const isEven = index % 2 === 0;

  return (
    <div className="group bg-neutral-950 rounded-2xl border border-neutral-900 shadow-sm hover:border-[#D4AF37]/30 transition-luxury overflow-hidden my-6">
      <div
        className={`flex flex-col ${
          isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
        } items-stretch min-h-[320px]`}
      >
        {/* Lado Esquerdo: Conteúdo Textual e Botão Dourado */}
        <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-neutral-950 z-10">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
              {category.name}
            </h3>
            <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xl">
              {category.shortDescription}
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-neutral-900 flex items-center justify-between">
            <Link
              href={`/${category.slug}`}
              className="inline-flex items-center justify-center font-semibold text-sm px-6 py-3 rounded-full bg-gold-gradient text-neutral-950 hover:shadow-md hover:scale-105 active:scale-95 transition-luxury gap-2 group/btn"
            >
              <span>Ver Catálogo</span>
              <ArrowRight className="w-4 h-4 text-neutral-950 group-hover/btn:translate-x-1 transition-transform" />
            </Link>

            <span className="text-xs text-neutral-500 font-medium hidden sm:inline-block">
              Peças Exclusivas
            </span>
          </div>
        </div>

        {/* Lado Direito: Card Visual da Imagem */}
        <div className="lg:w-2/5 relative min-h-[240px] lg:min-h-full image-zoom-container bg-neutral-950 overflow-hidden">
          <Image
            src={category.coverImage}
            alt={`Capa do catálogo de ${category.name}`}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            priority={index < 2}
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          {/* Overlay de gradiente suave */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
          <div className="absolute bottom-3 left-4 lg:hidden text-white font-serif font-bold text-xl drop-shadow-md">
            {category.name}
          </div>
        </div>
      </div>
    </div>
  );
};
