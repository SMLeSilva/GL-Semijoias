import { ItemVenda, ResumoFinanceiro, StatusPagamento, RegistroVenda } from '@/types/admin';
import { supabase, isSupabaseConfigured, mapRowToItemVenda, mapItemVendaToRow, ProdutoRow } from './supabase';

const STORAGE_KEY_ITEMS = 'semijoias_admin_items_v4';
const STORAGE_KEY_AUTH = 'semijoias_admin_auth';

const DEFAULT_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || '1234';

// Sementes de dados iniciais para cada Modelo de Produto
export const INITIAL_ITEMS: ItemVenda[] = [];

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/* --- Leitura e Escrita Local (Fallback e Cache Rápido) --- */

export function getAdminItems(): ItemVenda[] {
  if (!isBrowser()) return INITIAL_ITEMS;

  try {
    const data = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(INITIAL_ITEMS));
      return INITIAL_ITEMS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler itens do cache local:', error);
    return INITIAL_ITEMS;
  }
}

export function saveAdminItems(items: ItemVenda[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  } catch (error) {
    console.error('Erro ao salvar itens no cache local:', error);
  }
}

/* --- Operações Integradas com Supabase (com fallback) --- */

export async function fetchAdminItemsAsync(): Promise<{ items: ItemVenda[]; isSupabase: boolean }> {
  if (!supabase || !isSupabaseConfigured) {
    return { items: getAdminItems(), isSupabase: false };
  }

  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.warn('Erro ao consultar Supabase, usando cache local:', error.message);
      return { items: getAdminItems(), isSupabase: false };
    }

    if (data && data.length > 0) {
      const items = data.map((row: ProdutoRow) => mapRowToItemVenda(row));
      saveAdminItems(items); // Sincroniza cache local
      return { items, isSupabase: true };
    }

    // Se a tabela estiver vazia, faz o seed inicial
    const seedRows = INITIAL_ITEMS.map(mapItemVendaToRow);
    const { error: insertError } = await supabase.from('produtos').insert(seedRows);
    if (!insertError) {
      saveAdminItems(INITIAL_ITEMS);
      return { items: INITIAL_ITEMS, isSupabase: true };
    }

    return { items: getAdminItems(), isSupabase: false };
  } catch (err) {
    console.error('Exceção ao buscar produtos do Supabase:', err);
    return { items: getAdminItems(), isSupabase: false };
  }
}

export async function addAdminItemAsync(
  newItem: Omit<ItemVenda, 'id' | 'qtdVendida' | 'valorPago'>
): Promise<ItemVenda> {
  const items = getAdminItems();
  const nextId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 101;
  const item: ItemVenda = {
    ...newItem,
    id: nextId,
    estoqueAtual: newItem.estoqueAtual ?? 1,
    qtdVendida: 0,
    valorPago: 0,
    historicoVendas: [],
    custo: newItem.custo ?? (newItem.valor - newItem.lucro),
  };

  const updated = [item, ...items];
  saveAdminItems(updated);

  if (supabase && isSupabaseConfigured) {
    try {
      const row = mapItemVendaToRow(item);
      const { error } = await supabase.from('produtos').insert([row]);
      if (error) {
        console.error('Erro ao inserir item no Supabase:', error.message);
      }
    } catch (err) {
      console.error('Erro ao conectar ao Supabase para inserção:', err);
    }
  }

  return item;
}

export async function updateAdminItemAsync(updatedItem: ItemVenda): Promise<void> {
  const items = getAdminItems();
  const index = items.findIndex((i) => i.id === updatedItem.id);
  const normalizedItem: ItemVenda = {
    ...updatedItem,
    custo: updatedItem.custo ?? (updatedItem.valor - updatedItem.lucro),
  };

  if (index !== -1) {
    items[index] = normalizedItem;
    saveAdminItems(items);
  }

  if (supabase && isSupabaseConfigured) {
    try {
      const row = mapItemVendaToRow(normalizedItem);
      const { error } = await supabase
        .from('produtos')
        .update(row)
        .eq('id', normalizedItem.id);
      if (error) {
        console.error('Erro ao atualizar item no Supabase:', error.message);
      }
    } catch (err) {
      console.error('Erro ao conectar ao Supabase para atualização:', err);
    }
  }
}

export async function deleteAdminItemAsync(id: number): Promise<void> {
  const items = getAdminItems();
  const updated = items.filter((i) => i.id !== id);
  saveAdminItems(updated);

  if (supabase && isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('produtos').delete().eq('id', id);
      if (error) {
        console.error('Erro ao deletar item no Supabase:', error.message);
      }
    } catch (err) {
      console.error('Erro ao conectar ao Supabase para exclusão:', err);
    }
  }
}

// Versões síncronas legadas para compatibilidade
export function addAdminItem(newItem: Omit<ItemVenda, 'id' | 'qtdVendida' | 'valorPago'>): ItemVenda {
  const items = getAdminItems();
  const nextId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 101;
  const item: ItemVenda = {
    ...newItem,
    id: nextId,
    estoqueAtual: newItem.estoqueAtual ?? 1,
    qtdVendida: 0,
    valorPago: 0,
    historicoVendas: [],
    custo: newItem.custo ?? (newItem.valor - newItem.lucro),
  };
  const updated = [item, ...items];
  saveAdminItems(updated);
  if (supabase && isSupabaseConfigured) {
    supabase.from('produtos').insert([mapItemVendaToRow(item)]).then();
  }
  return item;
}

export function updateAdminItem(updatedItem: ItemVenda): void {
  const items = getAdminItems();
  const index = items.findIndex((i) => i.id === updatedItem.id);
  if (index !== -1) {
    const item = {
      ...updatedItem,
      custo: updatedItem.custo ?? (updatedItem.valor - updatedItem.lucro),
    };
    items[index] = item;
    saveAdminItems(items);
    if (supabase && isSupabaseConfigured) {
      supabase.from('produtos').update(mapItemVendaToRow(item)).eq('id', item.id).then();
    }
  }
}

export function deleteAdminItem(id: number): void {
  const items = getAdminItems();
  const updated = items.filter((i) => i.id !== id);
  saveAdminItems(updated);
  if (supabase && isSupabaseConfigured) {
    supabase.from('produtos').delete().eq('id', id).then();
  }
}

export function importAdminItems(newItems: ItemVenda[]): void {
  saveAdminItems(newItems);
  if (supabase && isSupabaseConfigured) {
    const rows = newItems.map(mapItemVendaToRow);
    supabase.from('produtos').upsert(rows).then();
  }
}

// Registrar uma nova venda de X unidades de uma peça
export async function registrarVendaAsync(
  itemId: number,
  qtdAVender: number,
  dataVenda?: string
): Promise<void> {
  const items = getAdminItems();
  const index = items.findIndex((i) => i.id === itemId);
  if (index === -1) return;

  const item = items[index];
  const totalVenda = qtdAVender * item.valor;
  const dataHoje = dataVenda || new Date().toISOString().split('T')[0];

  const novaTransacao: RegistroVenda = {
    id: `v-${itemId}-${Date.now()}`,
    dataVenda: dataHoje,
    quantidade: qtdAVender,
    valorTotal: totalVenda,
    formaPagamento: 'Venda Direta',
    statusPagamento: 'PAGO',
    valorPago: totalVenda,
  };

  const estoqueAtual = Math.max(0, item.estoqueAtual - qtdAVender);
  const qtdVendida = item.qtdVendida + qtdAVender;
  const novoValorPago = (item.valorPago || 0) + totalVenda;
  const historico = [novaTransacao, ...(item.historicoVendas || [])];

  const updatedItem: ItemVenda = {
    ...item,
    estoqueAtual,
    qtdVendida,
    valorPago: novoValorPago,
    historicoVendas: historico,
  };

  items[index] = updatedItem;
  saveAdminItems(items);

  if (supabase && isSupabaseConfigured) {
    try {
      const row = mapItemVendaToRow(updatedItem);
      await supabase.from('produtos').update(row).eq('id', itemId);
    } catch (err) {
      console.error('Erro ao salvar venda no Supabase:', err);
    }
  }
}

export function registrarVenda(
  itemId: number,
  qtdAVender: number,
  dataVenda?: string
): void {
  registrarVendaAsync(itemId, qtdAVender, dataVenda).then();
}

export function calculateResumoFinanceiro(items: ItemVenda[]): ResumoFinanceiro {
  let totalFaturado = 0;
  let totalLucro = 0;
  let totalPago = 0;
  let qtdEstoqueTotal = 0;
  let qtdVendidosTotal = 0;

  items.forEach((item) => {
    const faturadoItem = item.qtdVendida * item.valor;
    const lucroItem = item.qtdVendida * item.lucro;

    totalFaturado += faturadoItem;
    totalLucro += lucroItem;
    totalPago += item.valorPago || faturadoItem;
    qtdEstoqueTotal += item.estoqueAtual || 0;
    qtdVendidosTotal += item.qtdVendida || 0;
  });

  return {
    totalFaturado,
    totalLucro,
    totalPago,
    qtdEstoqueTotal,
    qtdVendidosTotal,
    totalModelos: items.length,
  };
}

/* --- Autenticação & PIN --- */

export function getAdminPin(): string {
  return process.env.NEXT_PUBLIC_ADMIN_PIN || DEFAULT_PIN;
}

export function isAdminAuthenticated(): boolean {
  if (!isBrowser()) return false;
  const auth = localStorage.getItem(STORAGE_KEY_AUTH);
  if (auth === 'true') return true;
  return document.cookie.includes('semijoias_admin_auth=true');
}

export function loginAdmin(pinInput: string): boolean {
  const currentPin = getAdminPin();
  if (pinInput.trim() === currentPin.trim()) {
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEY_AUTH, 'true');
      document.cookie = 'semijoias_admin_auth=true; path=/; max-age=86400';
    }
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY_AUTH);
  document.cookie = 'semijoias_admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}
