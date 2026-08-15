'use client';

import React, { useState } from 'react';
import { Product, Category } from '@/types/catalog';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Sparkles, ShieldCheck, Layers } from 'lucide-react';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';

interface CategoryProductGridProps {
  category: Category;
  products: Product[];
}

export const CategoryProductGrid: React.FC<CategoryProductGridProps> = ({
  category,
  products,
}) => {
  const [activeTab, setActiveTab] = useState<'todos' | 'semijoia' | 'inox'>('todos');

  if (products.length === 0) {
    return (
      <div className="bg-neutral-950 rounded-2xl p-12 text-center border border-neutral-900 shadow-sm space-y-4">
        <p className="text-neutral-300 font-medium text-base">
          Novas peças em breve no catálogo de {category.name}!
        </p>
        <p className="text-neutral-500 text-xs max-w-md mx-auto">
          Entre em contato pelo WhatsApp para solicitar fotos de peças recém-chegadas em semijoias ou aço inox.
        </p>
        <WhatsAppButton categoryName={category.name} label="Consultar Peças em Estoque" />
      </div>
    );
  }

  const semijoiaProducts = products.filter((p) => p.material !== 'inox');
  const inoxProducts = products.filter((p) => p.material === 'inox');

  return (
    <div className="space-y-10">
      {/* Abas Interativas de Filtro Rápido */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 backdrop-blur-md gap-1.5 shadow-lg">
          <button
            onClick={() => setActiveTab('todos')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'todos'
                ? 'bg-gold-gradient text-neutral-950 shadow-md shadow-[#D4AF37]/20 scale-105'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Todos</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'todos' ? 'bg-neutral-950 text-white' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('semijoia')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'semijoia'
                ? 'bg-[#D4AF37] text-neutral-950 shadow-md shadow-[#D4AF37]/20 scale-105'
                : 'text-neutral-400 hover:text-[#D4AF37] hover:bg-neutral-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Semijoias</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'semijoia' ? 'bg-neutral-950 text-[#D4AF37]' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {semijoiaProducts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inox')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'inox'
                ? 'bg-neutral-100 text-neutral-950 shadow-md shadow-white/20 scale-105'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Aço Inox</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'inox' ? 'bg-neutral-950 text-white' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {inoxProducts.length}
            </span>
          </button>
        </div>
      </div>

      {/* Conteúdo: Seção Semijoias */}
      {(activeTab === 'todos' || activeTab === 'semijoia') && (
        <section className="space-y-6 pt-2">
          {/* Cabeçalho da Divisão de Semijoias */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  {category.name} em Semijoias
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Peças banhadas com design elegante
                </p>
              </div>
            </div>

            <span className="self-start sm:self-auto text-xs font-semibold px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
              {semijoiaProducts.length} {semijoiaProducts.length === 1 ? 'modelo' : 'modelos'}
            </span>
          </div>

          {/* Lista de Produtos Semijoia */}
          {semijoiaProducts.length > 0 ? (
            <div className="space-y-6">
              {semijoiaProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} priorityImage={idx === 0} />
              ))}
            </div>
          ) : (
            <div className="bg-neutral-950 rounded-2xl p-8 text-center border border-neutral-900">
              <p className="text-neutral-400 text-sm">
                Nenhum produto de semijoia cadastrado no momento nesta categoria.
              </p>
            </div>
          )}
        </section>
      )}

      {/* Divisor Visual no Modo 'Todos' */}
      {activeTab === 'todos' && semijoiaProducts.length > 0 && inoxProducts.length > 0 && (
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-black px-4 text-xs font-mono uppercase tracking-widest text-neutral-500">
              Coleção em Aço Inox
            </span>
          </div>
        </div>
      )}

      {/* Conteúdo: Seção Aço Inox */}
      {(activeTab === 'todos' || activeTab === 'inox') && (
        <section className="space-y-6 pt-2">
          {/* Cabeçalho da Divisão de Aço Inox */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  {category.name} em Aço Inox
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Peças resistentes e duráveis em aço inoxidável
                </p>
              </div>
            </div>

            <span className="self-start sm:self-auto text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {inoxProducts.length} {inoxProducts.length === 1 ? 'modelo' : 'modelos'}
            </span>
          </div>

          {/* Lista de Produtos Aço Inox */}
          {inoxProducts.length > 0 ? (
            <div className="space-y-6">
              {inoxProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} priorityImage={idx === 0 && activeTab === 'inox'} />
              ))}
            </div>
          ) : (
            <div className="bg-neutral-950 rounded-2xl p-8 text-center border border-neutral-900">
              <p className="text-neutral-400 text-sm">
                Nenhum produto de aço inox cadastrado no momento nesta categoria.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
