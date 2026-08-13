export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  badgeText?: string;
  seoTitle: string;
  seoDescription: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  bathInfo: string; // Ex: "Banhado a Ouro 18k (10 Camadas)", "Ródio Branco Luxo", etc.
  price?: number;
  priceConsult?: boolean; // Se true, exibe "Sob consulta"
  description: string;
  features?: string[];
  images: string[];
  isFeatured?: boolean;
  inStock?: boolean;
  code?: string;
  guarantee?: string;
}

export interface BrandInfo {
  name: string;
  whatsappNumber: string; // Ex: "5519992519060"
  formattedPhone: string;
  instagram: string;
  email?: string;
  address?: string;
  warrantyPeriod?: string;
}
