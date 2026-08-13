import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { PublicLayoutShell } from '@/components/layout/PublicLayoutShell';
import { brandConfig } from '@/data/brand';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'GL Semijoias Finas | Catálogo de Semijoias Banhadas a Ouro 18k e Ródio',
    template: '%s | GL Semijoias Finas',
  },
  description:
    'Catálogo online de semijoias finas. Brincos, colares, pulseiras, anéis, tornozeleiras e conjuntos banhados a ouro 18k com acabamento de alta joalheria e tecnologia hipoalergênica.',
  keywords: [
    'semijoias',
    'catálogo de semijoias',
    'semijoias banhadas a ouro 18k',
    'brincos banhados',
    'colares femininos',
    'pulseiras riviera',
    'anéis solitários',
    'tornozeleiras delicadas',
    'conjuntos de semijoias',
    'semijoias hipoalergênicas',
  ],
  authors: [{ name: brandConfig.name }],
  openGraph: {
    title: 'GL Semijoias Finas | Catálogo Premium de Semijoias Finas',
    description:
      'Descubra peças exclusivas com acabamento de alta joalheria. Solicite orçamentos diretamente via WhatsApp.',
    siteName: brandConfig.name,
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GL Semijoias Finas | Catálogo de Semijoias Finas',
    description: 'Semijoias banhadas a ouro 18k e ródio branco com acabamento de alta joalheria.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/images/favicon-circle.png',
    apple: '/images/favicon-circle.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" className={`${cormorant.variable} ${plusJakarta.variable} scroll-smooth`}>
      <body className="flex flex-col min-h-screen bg-white text-neutral-900 antialiased selection:bg-[#D4AF37] selection:text-white">
        <PublicLayoutShell>{children}</PublicLayoutShell>
      </body>
    </html>
  );
}
