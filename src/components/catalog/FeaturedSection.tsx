import React from 'react';
import { getFeaturedProducts } from '@/data/products';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Sparkles } from 'lucide-react';

export const FeaturedSection: React.FC = () => {
  const featured = getFeaturedProducts().slice(0, 4);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Seleção Exclusiva</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Peças em Destaque no Catálogo
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
            As semijoias mais procuradas por nossas clientes. Design autoral com banho premium de Ouro 18k e Ródio.
          </p>
        </div>

        <div className="space-y-6">
          {featured.map((product, idx) => (
            <ProductCard key={product.id} product={product} priorityImage={idx === 0} />
          ))}
        </div>
      </div>
    </section>
  );
};
