'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { brandConfig } from '@/data/brand';
import { categories } from '@/data/categories';
import { AdminLoginModal } from '@/components/admin/AdminLoginModal';

const InstagramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const Footer: React.FC = () => {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Gatilho por 3 cliques rápidos no símbolo ©
  const handleCopyrightClick = () => {
    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current >= 3) {
      setIsAdminModalOpen(true);
      clickCountRef.current = 0;
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 1200);
    }
  };

  // Gatilho por atalho de teclado: Ctrl + Alt + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAdminModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <footer className="bg-neutral-950 text-white pt-16 pb-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Grid Principal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-neutral-800">
            {/* Coluna 1: Sobre a Marca */}
            <div className="space-y-4">
              <Link href="/" className="inline-block">
                <img
                  src="/images/logo-transparent.png"
                  alt={brandConfig.name}
                  className="h-16 sm:h-24 w-auto object-contain brightness-0 invert"
                />
              </Link>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Semijoias exclusivas banhadas a ouro 18k e ródio branco. Peças criadas com acabamento de alta joalheria e brilho intenso.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <a
                  href={`https://instagram.com/${brandConfig.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors"
                >
                  <InstagramIcon className="w-4.5 h-4.5" />
                </a>
                <a
                  href={`https://wa.me/${brandConfig.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-emerald-400 hover:border-emerald-500 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Coluna 2: Navegação por Categorias */}
            <div>
              <h4 className="font-serif text-lg font-semibold text-white tracking-wide mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                Catálogo de Peças
              </h4>
              <ul className="space-y-2.5 text-sm text-neutral-400">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/${cat.slug}`}
                      className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                    >
                      <span>{cat.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coluna 3: Atendimento */}
            <div>
              <h4 className="font-serif text-lg font-semibold text-white tracking-wide mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                Atendimento ao Cliente
              </h4>
              <div className="space-y-3 text-sm text-neutral-400">
                <a
                  href={`https://wa.me/${brandConfig.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-emerald-400 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-medium">{brandConfig.formattedPhone}</span>
                </a>
                <a
                  href={`https://instagram.com/${brandConfig.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-[#D4AF37] transition-colors"
                >
                  <InstagramIcon className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="text-xs font-medium">@{brandConfig.instagram}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Rodapé Inferior */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
            <p>
              <span
                onClick={handleCopyrightClick}
                title="Sua marca"
                className="cursor-default select-none transition-colors hover:text-neutral-400 inline-block active:scale-95"
              >
                ©
              </span>{' '}
              {new Date().getFullYear()} {brandConfig.name}. Todos os direitos reservados.
            </p>
            <p className="tracking-wide">
              Desenvolvido com <span className="text-[#D4AF37]">♥</span> para semijoias de alta performance.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de Autenticação Secreta */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </>
  );
};

