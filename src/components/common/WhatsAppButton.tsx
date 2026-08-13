'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { createWhatsAppLink } from '@/lib/whatsapp';

interface WhatsAppButtonProps {
  productName?: string;
  categoryName?: string;
  code?: string;
  bathInfo?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'floating';
  label?: string;
  className?: string;
  fullWidth?: boolean;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  productName,
  categoryName,
  code,
  bathInfo,
  variant = 'primary',
  label,
  className = '',
  fullWidth = false,
}) => {
  const href = createWhatsAppLink({ productName, categoryName, code, bathInfo });
  const text = label || (productName ? 'Solicitar pelo WhatsApp' : 'Falar no WhatsApp');

  if (variant === 'floating') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Atendimento via WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl transition-luxury hover:scale-110 group border-2 border-white"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
        <span className="absolute right-16 bg-neutral-900 text-white text-xs px-3 py-1.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          Atendimento Direto
        </span>
      </a>
    );
  }

  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-luxury cursor-pointer shadow-sm text-sm py-3 px-6 gap-2.5';
  let variantStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-gold-gradient text-neutral-950 font-semibold hover:shadow-md hover:brightness-105 active:scale-95 border border-[#D4AF37]';
      break;
    case 'secondary':
      variantStyles = 'bg-neutral-900 text-white hover:bg-neutral-800 active:scale-95';
      break;
    case 'outline':
      variantStyles = 'bg-transparent text-neutral-900 border border-neutral-300 hover:border-[#D4AF37] hover:text-[#B8962E] hover:bg-[#FBF8EE]';
      break;
  }

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${variantStyles} ${widthStyle} ${className}`}
    >
      <MessageCircle className="w-5 h-5 text-current shrink-0" />
      <span>{text}</span>
    </a>
  );
};
