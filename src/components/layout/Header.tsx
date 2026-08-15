'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, PhoneCall, ChevronRight } from 'lucide-react';
import { categories } from '@/data/categories';
import { brandConfig } from '@/data/brand';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fechar menu mobile ao trocar de rota
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled
          ? 'bg-black/95 backdrop-blur-md shadow-sm py-3 border-b border-neutral-900'
          : 'bg-black py-4 border-b border-neutral-900'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo da Marca */}
          <Link href="/" className="flex items-center group">
            <img
              src="/images/logo-transparent.png"
              alt={brandConfig.name}
              className="h-16 sm:h-24 w-auto object-contain transition-transform group-hover:scale-105 brightness-0 invert"
            />
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium tracking-wide">
            <Link
              href="/"
              className={`transition-colors hover:text-[#D4AF37] py-1 ${pathname === '/' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-neutral-300'
                }`}
            >
              Início
            </Link>

            {categories.map((category) => {
              const href = `/${category.slug}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={category.id}
                  href={href}
                  className={`transition-colors hover:text-[#D4AF37] py-1 ${isActive ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-neutral-300'
                    }`}
                >
                  {category.name}
                </Link>
              );
            })}
          </nav>

          {/* Botão de Contato WhatsApp Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <WhatsAppButton variant="secondary" label="Falar no WhatsApp" className="text-xs py-2.5 px-5" />
          </div>

          {/* Botão Hamburger Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-300 hover:text-[#D4AF37] transition-colors focus:outline-none flex flex-col justify-center items-center w-10 h-10 gap-1.5"
            aria-label={mobileMenuOpen ? 'Fechar Menu de Navegação' : 'Abrir Menu de Navegação'}
          >
            <span
              className={`w-6 h-0.5 bg-current transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
            />
            <span
              className={`w-6 h-0.5 bg-current transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-0' : ''
                }`}
            />
            <span
              className={`w-6 h-0.5 bg-current transition-all duration-300 ease-in-out ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-neutral-950 border-l border-neutral-900 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center">
                  <img
                    src="/images/logo-transparent.png"
                    alt={brandConfig.name}
                    className="h-14 sm:h-16 w-auto object-contain brightness-0 invert"
                  />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Categorias e Links */}
              <div className="mt-6 flex flex-col gap-1">
                <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold px-2 mb-2">
                  Navegação
                </p>
                <Link
                  href="/"
                  className={`flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors ${pathname === '/' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                    }`}
                >
                  <span>Página Inicial</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </Link>

                <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold px-2 mt-5 mb-2">
                  Catálogo por Categorias
                </p>
                {categories.map((category) => {
                  const href = `/${category.slug}`;
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={category.id}
                      href={href}
                      className={`flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                        }`}
                    >
                      <span>{category.name}</span>
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Footer do Menu Mobile */}
            <div className="pt-6 border-t border-neutral-900 mt-6 space-y-4">
              <div className="flex items-center gap-3 text-xs text-neutral-400">
                <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
                <span>Atendimento: {brandConfig.formattedPhone}</span>
              </div>
              <WhatsAppButton variant="secondary" fullWidth label="Atendimento via WhatsApp" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
