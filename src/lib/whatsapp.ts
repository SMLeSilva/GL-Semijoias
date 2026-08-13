import { brandConfig } from '@/data/brand';

interface WhatsAppMessageParams {
  productName?: string;
  categoryName?: string;
  code?: string;
  bathInfo?: string;
}

export function createWhatsAppLink({
  productName,
  categoryName,
}: WhatsAppMessageParams = {}): string {
  const number = brandConfig.whatsappNumber.replace(/\D/g, '');
  let message = 'Oiie! Gostaria de saber mais sobre as semijoias do catálogo!';

  if (productName) {
    message = `Oiie! Gostaria de saber mais sobre a peça: ${productName}!`;
  } else if (categoryName) {
    message = `Oiie! Gostaria de saber mais sobre a categoria ${categoryName}!`;
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
