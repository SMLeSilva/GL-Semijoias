import { Category } from '@/types/catalog';

export const categories: Category[] = [
  {
    id: 'brincos',
    slug: 'brincos',
    name: 'Brincos',
    shortDescription: 'Modelos exclusivos e sofisticados para valorizar o seu estilo.',
    description: 'Explore nossa coleção exclusiva de brincos banhados a ouro e prata.',
    coverImage: '/images/brinco-borboleta.png',
    badgeText: 'Coleção Exclusiva',
    seoTitle: 'Catálogo de Brincos Banhados a Ouro 18k e Ródio | Semijoias Finas',
    seoDescription: 'Confira nossa seleção de brincos de luxo com banho refinado, pedras selecionadas e acabamento impecável.',
  },
  {
    id: 'colares',
    slug: 'colares',
    name: 'Colares',
    shortDescription: 'Peças versáteis e delicadas para enriquecer o seu visual.',
    description: 'Descubra a elegância atemporal dos nossos colares. Peças versáteis ideais para composições em camadas.',
    coverImage: '/images/colar-dourado-quadrado-pedras.png',
    badgeText: 'Mais Vendidos',
    seoTitle: 'Catálogo de Colares & Chokers Premium | Semijoias Banhadas',
    seoDescription: 'Colares femininos banhados a ouro 18k com zircônias e pedras. Peças refinadas para valorizar seu estilo.',
  },
  {
    id: 'pulseiras',
    slug: 'pulseiras',
    name: 'Pulseiras',
    shortDescription: 'Design elegante e moderno para complementar qualquer look.',
    description: 'Nossa linha de pulseiras combina charme e resistência.',
    coverImage: '/images/pulseira-inspiracao-pandora-prata.png',
    badgeText: 'Tendência 2026',
    seoTitle: 'Catálogo de Pulseiras & Braceletes de Luxo | Semijoias',
    seoDescription: 'Pulseiras finas e braceletes femininos banhados a ouro e prata. Design moderno e garantia de qualidade.',
  },
  {
    id: 'aneis',
    slug: 'aneis',
    name: 'Anéis',
    shortDescription: 'Modelos clássicos e contemporâneos com acabamento refinado.',
    description: 'Do clássico ao contemporâneo, nossos anéis trazem lapidação impecável e encaixe perfeito.',
    coverImage: '/images/anel-prego.png',
    badgeText: 'Design Autoral',
    seoTitle: 'Catálogo de Anéis Femininos Banhados a Ouro | Semijoias',
    seoDescription: 'Anéis solitários, aparadores e anéis cravejados com zircônia premium. Brilho incomparável e durabilidade.',
  },
  {
    id: 'relogios',
    slug: 'relogios',
    name: 'Relógios',
    shortDescription: 'Modelos clássicos e modernos em semijoia e aço inoxidável de alta durabilidade.',
    description: 'Nossa coleção de relógios combina precisão, requinte e resistência. Peças com acabamento de joalheria e opções em aço inoxidável e banhadas a ouro.',
    coverImage: '/images/relogio-redondo-dourado.png',
    badgeText: 'Precisão & Estilo',
    seoTitle: 'Catálogo de Relógios Femininos | Semijoias & Aço Inox',
    seoDescription: 'Relógios sofisticados em aço inox e banhados a ouro com maquinário de alta precisão e design refinado.',
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((cat) => cat.slug === slug);
}
