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
          ? 'bg-[#F5F5F5]/95 backdrop-blur-md shadow-sm py-3 border-b border-[#E6DCC8]'
          : 'bg-[#F5F5F5] py-4 border-b border-[#E6DCC8]'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo da Marca */}
          <Link href="/" className="flex items-center group">
            <img
              src="/images/logo-transparent.png"
              alt={brandConfig.name}
              className="h-16 sm:h-24 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium tracking-wide">
            <Link
              href="/"
              className={`transition-colors hover:text-[#B8962E] py-1 ${pathname === '/' ? 'text-[#B8962E] border-b-2 border-[#D4AF37]' : 'text-neutral-800'
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
                  className={`transition-colors hover:text-[#B8962E] py-1 ${isActive ? 'text-[#B8962E] border-b-2 border-[#D4AF37]' : 'text-neutral-800'
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
            className="md:hidden p-2 text-neutral-800 hover:text-[#B8962E] transition-colors focus:outline-none flex flex-col justify-center items-center w-10 h-10 gap-1.5"
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
        <div className="fixed inset-0 z-50 md:hidden bg-neutral-900/50 backdrop-blur-sm transition-opacity">
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center">
                  <img
                    src="/images/logo-transparent.png"
                    alt={brandConfig.name}
                    className="h-14 sm:h-16 w-auto object-contain"
                  />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-neutral-500 hover:text-neutral-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Categorias e Links */}
              <div className="mt-6 flex flex-col gap-1">
                <p className="text-xs uppercase tracking-widest text-[#B8962E] font-semibold px-2 mb-2">
                  Navegação
                </p>
                <Link
                  href="/"
                  className={`flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors ${pathname === '/' ? 'bg-[#FBF8EE] text-[#B8962E]' : 'text-neutral-800 hover:bg-neutral-50'
                    }`}
                >
                  <span>Página Inicial</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </Link>

                <p className="text-xs uppercase tracking-widest text-[#B8962E] font-semibold px-2 mt-5 mb-2">
                  Catálogo por Categorias
                </p>
                {categories.map((category) => {
                  const href = `/${category.slug}`;
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={category.id}
                      href={href}
                      className={`flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#FBF8EE] text-[#B8962E]' : 'text-neutral-800 hover:bg-neutral-50'
                        }`}
                    >
                      <span>{category.name}</span>
                      <ChevronRight className="w-4 h-4 text-neutral-400" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Footer do Menu Mobile */}
            <div className="pt-6 border-t border-neutral-100 mt-6 space-y-4">
              <div className="flex items-center gap-3 text-xs text-neutral-600">
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
