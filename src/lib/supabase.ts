import { createClient } from '@supabase/supabase-js';
import { ItemVenda } from '@/types/admin';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Valida se as variáveis de ambiente foram configuradas
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('seu-projeto-aqui')
);

// Inicializa o cliente do Supabase
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Interface da tabela do Supabase (snake_case)
export interface ProdutoRow {
  id: number;
  nome: string;
  valor: number;
  custo: number;
  lucro: number;
  estoque_atual: number;
  qtd_vendida: number;
  valor_pago: number;
  forma_pagamento: string;
  status_pagamento: string;
  observacao: string;
  category_slug: string;
  category_name: string;
  historico_vendas: any[];
  created_at?: string;
}

// Converte do formato do Supabase (snake_case) para ItemVenda (camelCase)
export function mapRowToItemVenda(row: ProdutoRow): ItemVenda {
  return {
    id: Number(row.id),
    nome: row.nome || '',
    valor: Number(row.valor || 0),
    custo: row.custo !== null && row.custo !== undefined ? Number(row.custo) : Number(row.valor || 0) - Number(row.lucro || 0),
    lucro: Number(row.lucro || 0),
    estoqueAtual: Number(row.estoque_atual || 0),
    qtdVendida: Number(row.qtd_vendida || 0),
    valorPago: Number(row.valor_pago || 0),
    formaPagamento: row.forma_pagamento || '',
    statusPagamento: (row.status_pagamento as any) || 'PAGO',
    observacao: row.observacao || '',
    categorySlug: row.category_slug || '',
    categoryName: row.category_name || '',
    historicoVendas: Array.isArray(row.historico_vendas) ? row.historico_vendas : [],
  };
}

// Converte de ItemVenda (camelCase) para o formato do Supabase (snake_case)
export function mapItemVendaToRow(item: ItemVenda): ProdutoRow {
  return {
    id: Number(item.id),
    nome: item.nome,
    valor: Number(item.valor),
    custo: item.custo !== undefined ? Number(item.custo) : Number(item.valor) - Number(item.lucro),
    lucro: Number(item.lucro),
    estoque_atual: Number(item.estoqueAtual),
    qtd_vendida: Number(item.qtdVendida),
    valor_pago: Number(item.valorPago),
    forma_pagamento: item.formaPagamento || '',
    status_pagamento: item.statusPagamento || 'PAGO',
    observacao: item.observacao || '',
    category_slug: item.categorySlug || '',
    category_name: item.categoryName || '',
    historico_vendas: item.historicoVendas || [],
  };
}
