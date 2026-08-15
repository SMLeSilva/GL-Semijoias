import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug, categories } from '@/data/categories';
import { getProductsByCategory } from '@/data/products';
import { CategoryProductGrid } from '@/components/catalog/CategoryProductGrid';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { ChevronRight, ArrowLeft, Gem, Sparkles, ShieldCheck } from 'lucide-react';

interface PageProps {
  params: Promise<{
    categoria: string;
  }>;
}

// Gerar rotas estáticas para todas as categorias para alta performance
export async function generateStaticParams() {
  return categories.map((cat) => ({
    categoria: cat.slug,
  }));
}

// Otimização de SEO Dinâmica por Categoria
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoria } = await params;
  const category = getCategoryBySlug(categoria);

  if (!category) {
    return {
      title: 'Categoria Não Encontrada | AURUM & CO.',
    };
  }

  return {
    title: category.seoTitle,
    description: category.seoDescription,
    openGraph: {
      title: `${category.name} | Catálogo de Semijoias Finas & Aço Inox`,
      description: category.seoDescription,
      images: [
        {
          url: category.coverImage,
          alt: `Catálogo de ${category.name}`,
        },
      ],
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { categoria } = await params;
  const category = getCategoryBySlug(categoria);

  if (!category) {
    notFound();
  }

  const productsList = getProductsByCategory(categoria);
  const semijoiasCount = productsList.filter((p) => p.material !== 'inox').length;
  const inoxCount = productsList.filter((p) => p.material === 'inox').length;

  return (
    <div className="bg-black min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Navegação Hierárquica */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
          <Link href="/" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Início</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-neutral-500" />
          <span className="text-neutral-100 font-medium">Catálogo de {category.name}</span>
        </nav>

        {/* Topo da Categoria (Header Banner) */}
        <div className="bg-neutral-950 rounded-2xl p-6 sm:p-10 border border-neutral-900 shadow-sm mb-10 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-3">
              <Gem className="w-3.5 h-3.5" />
              <span>Coleção Exclusiva</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Catálogo de {category.name}
            </h1>

            <p className="mt-4 text-neutral-400 text-sm sm:text-base leading-relaxed">
              {category.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-neutral-400 pt-4 border-t border-neutral-900">
              <span className="font-semibold text-white">
                {productsList.length} Peças no Total
              </span>
              <span className="inline-flex items-center gap-1.5 text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-lg border border-[#D4AF37]/20">
                <Sparkles className="w-3 h-3" /> {semijoiasCount} Semijoias
              </span>
              <span className="inline-flex items-center gap-1.5 text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                <ShieldCheck className="w-3 h-3" /> {inoxCount} em Aço Inox
              </span>
            </div>
          </div>
        </div>

        {/* Grid de Produtos com Abas e Divisões Organizadas */}
        <CategoryProductGrid category={category} products={productsList} />

        {/* Rodapé da Categoria com CTA para WhatsApp */}
        <div className="mt-16 bg-neutral-900 text-white rounded-2xl p-8 text-center space-y-4 border border-neutral-800 shadow-lg">
          <h3 className="font-serif text-2xl font-bold">
            Gostou de alguma peça do nosso catálogo de {category.name}?
          </h3>
          <p className="text-neutral-300 text-sm max-w-xl mx-auto">
            Clique no botão de solicitação do produto desejado ou fale com nossas consultoras para tirar dúvidas sobre banhos e prazos.
          </p>
          <div className="pt-2 flex justify-center">
            <WhatsAppButton
              categoryName={category.name}
              variant="primary"
              label={`Solicitar Catálogo Completo de ${category.name}`}
              className="text-xs py-3 px-6"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
