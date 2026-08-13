import { Product } from '@/types/catalog';

export const products: Product[] = [
  // BRINCOS
  {
    id: 'brinco-argola-cravejada',
    slug: 'brinco-argola-cravejada-zirconias',
    name: 'Argola Tubo Cravejada Zircônias Luxo',
    categorySlug: 'brincos',
    categoryName: 'Brincos',
    bathInfo: 'Banhado a Ouro 18k (10 Milésimos) + Verniz Suíço',
    price: 189.90,
    description: 'Argola elegante com fecho click de altíssima segurança. Cravejada frontalmente com zircônias lapidadas de alto brilho.',
    features: ['Hipoalergênico (Sem Níquel)', 'Fecho Click de Alta Pressão', 'Zircônias Premium 5A'],
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: true,
    inStock: true,
    code: 'BR-101',
  },
  {
    id: 'brinco-ear-cuff-gota',
    slug: 'brinco-ear-cuff-gota-rodio',
    name: 'Ear Cuff Gotas Cristal Ródio',
    categorySlug: 'brincos',
    categoryName: 'Brincos',
    bathInfo: 'Banho de Ródio Branco Premium',
    price: 149.00,
    description: 'Design moderno que acompanha a curvatura da orelha. Acompanha tarraxa sutiã de orelha para sustentação perfeita.',
    features: ['Design Ergonômico', 'Acabamento Espelhado', 'Leve e Confortável'],
    images: [
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: true,
    inStock: true,
    code: 'BR-102',
  },
  {
    id: 'brinco-gota-classica',
    slug: 'brinco-gota-fusion-esmeralda',
    name: 'Brinco Gota Pedra Fusion Esmeralda',
    categorySlug: 'brincos',
    categoryName: 'Brincos',
    bathInfo: 'Banhado a Ouro 18k com Duplo Selamento',
    priceConsult: true,
    description: 'Gota imponente em cristal pedra fusion cor esmeralda, cercada por microzircônias cristal. Peça marcante para festas e eventos.',
    features: ['Pedra Fusion Exclusiva', 'Brilho Intenso', 'Tarraxa Borboleta Reforçada'],
    images: [
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: false,
    inStock: true,
    code: 'BR-103',
  },

  // COLARES
  {
    id: 'colar-riviera-zirconia',
    slug: 'colar-riviera-cravejado-ouro-18k',
    name: 'Colar Riviera Zircônias 3mm Ouro 18k',
    categorySlug: 'colares',
    categoryName: 'Colares',
    bathInfo: 'Banhado a Ouro 18k (10 Camadas Premium)',
    price: 279.90,
    description: 'Riviera clássica com zircônias quadradas de 3mm. Caimento fluido no colo e fecho gaveta com trava dupla de segurança.',
    features: ['Comprimento 40cm + Extensor 5cm', 'Fecho Joalheria com Dupla Trava', 'Brilho Contínuo 360°'],
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: true,
    inStock: true,
    code: 'CL-201',
  },
  {
    id: 'colar-gravatinha-perola',
    slug: 'colar-gravatinha-perola-natural',
    name: 'Colar Gravatinha com Pérola Natural',
    categorySlug: 'colares',
    categoryName: 'Colares',
    bathInfo: 'Banhado a Ouro 18k Hipoalergênico',
    price: 199.00,
    description: 'Design refinado e minimalista em formato Y com pérola de água doce na ponta. Perfeito para decotes profundos e camisas.',
    features: ['Pérola Cultivada de Água Doce', 'Corrente Veneziana Fina', 'Ajuste de Altura'],
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: false,
    inStock: true,
    code: 'CL-202',
  },
  {
    id: 'choker-fita-laminada',
    slug: 'choker-fita-laminada-ouro',
    name: 'Choker Fita Cobra Laminada 4mm',
    categorySlug: 'colares',
    categoryName: 'Colares',
    bathInfo: 'Banhado a Ouro 18k com Brilho Espelhado',
    price: 169.90,
    description: 'Malha de fita plana com reflexo acetinado incomparável. Uma das peças mais desejadas para composição de mix modernos.',
    features: ['Largura 4mm', 'Flexibilidade Anatomica', 'Acabamento em Verniz Italiano'],
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: true,
    inStock: true,
    code: 'CL-203',
  },

  // PULSEIRAS
  {
    id: 'pulseira-bracelete-prego',
    slug: 'bracelete-design-cravejado',
    name: 'Bracelete Estruturado Cravejado Ouro 18k',
    categorySlug: 'pulseiras',
    categoryName: 'Pulseiras',
    bathInfo: 'Banhado a Ouro 18k Alta Espessura',
    price: 249.00,
    description: 'Bracelete rígido com fecho lateral de mola invisível. Destaque em pontas cravejadas com microzircônias cristal.',
    features: ['Diâmetro 6cm (Anatômico)', 'Fecho com Mola Interna', 'Resistência Superior'],
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: true,
    inStock: true,
    code: 'PS-301',
  },
  {
    id: 'pulseira-elos-portugueses',
    slug: 'pulseira-elos-portugueses-pingentes',
    name: 'Pulseira Elos Portugueses com Charms',
    categorySlug: 'pulseiras',
    categoryName: 'Pulseiras',
    bathInfo: 'Banhado a Ouro 18k 10 Milésimos',
    price: 189.90,
    description: 'Elos redondos robustos acompanhados de pequenos pingentes de medalhas e corações com fecho boia marcante.',
    features: ['Fecho Boia de Destaque', 'Elos Vazados Polidos', 'Excelente Caimento'],
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: false,
    inStock: true,
    code: 'PS-302',
  },

  // ANÉIS
  {
    id: 'anel-solitario-classico',
    slug: 'anel-solitario-zirconia-giga',
    name: 'Anel Solitário Zircônia Central 8mm',
    categorySlug: 'aneis',
    categoryName: 'Anéis',
    bathInfo: 'Banhado a Ouro 18k + Ródio nas Garras',
    price: 139.90,
    description: 'O solitário inesquecível. Pedra central de 8mm cravada em 6 garras com ródio branco para potencializar o brilho da zircônia.',
    features: ['Zircônia Diamantada 8mm', 'Garras em Ródio Branco', 'Aro Confortável Concurvado'],
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: true,
    inStock: true,
    code: 'AN-401',
  },
  {
    id: 'anel-aparador-duplo',
    slug: 'anel-aparador-meia-alianca-zirconia',
    name: 'Anel Aparador Meia Aliança Zircônias',
    categorySlug: 'aneis',
    categoryName: 'Anéis',
    bathInfo: 'Banhado a Ouro 18k Hipoalergênico',
    price: 119.90,
    description: 'Anel meia aliança fino cravejado com fileira dupla de microzircônias. Perfeito para usar junto com alianças ou solitários.',
    features: ['Cravação Micro-Pavê', 'Perfil Fino e Confortável', 'Combinação Versátil'],
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: false,
    inStock: true,
    code: 'AN-402',
  },

  // TORNOZELEIRAS
  {
    id: 'tornozeleira-pontos-de-luz',
    slug: 'tornozeleira-pontos-de-luz-ouro',
    name: 'Tornozeleira Pontos de Luz Zircônia',
    categorySlug: 'tornozeleiras',
    categoryName: 'Tornozeleiras',
    bathInfo: 'Banhado a Ouro 18k com Camada Hipoalergênica',
    price: 129.90,
    description: 'Corrente singapura refinada intercalada com 5 zircônias pendentes que refletem luz a cada passo.',
    features: ['Comprimento 22cm + 5cm Extensor', 'Resistente ao Suor e Uso Diário', 'Zircônias Pendentes'],
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: true,
    inStock: true,
    code: 'TR-501',
  },
  {
    id: 'tornozeleira-coracoes',
    slug: 'tornozeleira-coracoes-vazados',
    name: 'Tornozeleira Elos Corações Vazados',
    categorySlug: 'tornozeleiras',
    categoryName: 'Tornozeleiras',
    bathInfo: 'Banhado a Ouro 18k 10 Milésimos',
    price: 115.00,
    description: 'Design romântico com corações sequenciais polidos. Leve e ajustável para máximo conforto no tornozelo.',
    features: ['Fecho Lagosta Seguro', 'Extensor com Gota na Ponta', 'Acabamento Polido'],
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: false,
    inStock: true,
    code: 'TR-502',
  },

  // CONJUNTOS
  {
    id: 'conjunto-gota-cristal',
    slug: 'conjunto-colar-brinco-gota-zirconia',
    name: 'Conjunto Colar e Brinco Gota Cristal Luxo',
    categorySlug: 'conjuntos',
    categoryName: 'Conjuntos',
    bathInfo: 'Banhado a Ouro 18k (10 Milésimos de Alta Otimização)',
    price: 299.90,
    description: 'Conjunto completo composto por colar com pingente gota e par de brincos no mesmo formato. Acompanha caixinha aveludada de presente.',
    features: ['Acompanha Embalagem Presenteável', 'Zircônias Lapidação Gota'],
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: true,
    inStock: true,
    code: 'CJ-601',
  },
  {
    id: 'conjunto-perolas-classico',
    slug: 'conjunto-perolas-ouro-18k',
    name: 'Conjunto Colar e Brinco Pérolas Naturais',
    categorySlug: 'conjuntos',
    categoryName: 'Conjuntos',
    bathInfo: 'Banhado a Ouro 18k Hipoalergênico',
    priceConsult: true,
    description: 'A elegância clássica das pérolas de água doce combinada com detalhes folheados a ouro 18k. Um presente inesquecível.',
    features: ['Pérolas Naturais Selecionadas', 'Design Atemporal', 'Edição Limitada'],
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: true,
    inStock: true,
    code: 'CJ-602',
  },
];

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((item) => item.categorySlug === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((item) => item.isFeatured);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((item) => item.slug === slug);
}
