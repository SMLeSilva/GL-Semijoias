import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug, categories } from '@/data/categories';
import { getProductsByCategory } from '@/data/products';
import { ProductCard } from '@/components/catalog/ProductCard';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { ChevronRight, ArrowLeft, ShieldCheck, Sparkles, Gem } from 'lucide-react';

interface PageProps {
  params: Promise<{
    categoria: string;
  }>;
}

// Gerar rotas estáticas para todas as 6 categorias para alta performance
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
      title: `${category.name} | Catálogo de Semijoias Finas AURUM & CO.`,
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

  return (
    <div className="bg-neutral-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Navegação Hierárquica */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
          <Link href="/" className="hover:text-[#B8962E] transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Início</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-neutral-400" />
          <span className="text-neutral-900 font-medium">Catálogo de {category.name}</span>
        </nav>

        {/* Topo da Categoria (Header Banner) */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-neutral-100 shadow-sm mb-10 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#B8962E] bg-[#FBF8EE] border border-[#E6C875]/40 mb-3">
              <Gem className="w-3.5 h-3.5" />
              <span>Coleção Exclusiva</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight">
              Catálogo de {category.name}
            </h1>

            <p className="mt-4 text-neutral-600 text-sm sm:text-base leading-relaxed">
              {category.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-neutral-500 pt-4 border-t border-neutral-100">
              <span className="font-semibold text-[#B8962E]">
                {productsList.length} Peças Disponíveis
              </span>
            </div>
          </div>
        </div>

        {/* Listagem dos Produtos da Categoria */}
        {productsList.length > 0 ? (
          <div className="space-y-6">
            {productsList.map((product, idx) => (
              <ProductCard key={product.id} product={product} priorityImage={idx < 2} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-neutral-100 shadow-sm space-y-4">
            <p className="text-neutral-500 font-medium text-base">
              Novas peças em breve nesta categoria!
            </p>
            <p className="text-neutral-400 text-xs max-w-md mx-auto">
              Entre em contato conosco pelo WhatsApp para solicitar peças sob encomenda ou ver fotos de itens recém-chegados no estoque.
            </p>
            <WhatsAppButton categoryName={category.name} label="Consultar Peças em Estoque" />
          </div>
        )}

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
