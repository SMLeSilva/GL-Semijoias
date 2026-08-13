import { ItemVenda, ResumoFinanceiro, StatusPagamento, RegistroVenda } from '@/types/admin';

const STORAGE_KEY_ITEMS = 'semijoias_admin_items_v4';
const STORAGE_KEY_PIN = 'semijoias_admin_pin';
const STORAGE_KEY_AUTH = 'semijoias_admin_auth';

const DEFAULT_PIN = '1234';

// Sementes de dados iniciais para cada Modelo de Produto
const INITIAL_ITEMS: ItemVenda[] = [
  {
    id: 101,
    nome: 'Argola Tubo Cravejada Zircônias Luxo (BR-101)',
    valor: 189.90,
    custo: 69.90,
    lucro: 120.00,
    estoqueAtual: 8,
    qtdVendida: 2,
    valorPago: 379.80,
    formaPagamento: 'PIX Integrado',
    statusPagamento: 'PAGO',
    observacao: 'Produto de altíssima saída no showroom',
    categorySlug: 'brincos',
    categoryName: 'Brincos',
    historicoVendas: [
      {
        id: 'v101-1',
        dataVenda: '2026-08-01',
        quantidade: 2,
        valorTotal: 379.80,
        formaPagamento: 'PIX Integrado',
        statusPagamento: 'PAGO',
        valorPago: 379.80,
        observacao: 'Cliente VIP - Venda presencial',
      },
    ],
  },
  {
    id: 102,
    nome: 'Ear Cuff Gotas Cristal Ródio (BR-102)',
    valor: 149.00,
    custo: 49.00,
    lucro: 100.00,
    estoqueAtual: 5,
    qtdVendida: 1,
    valorPago: 149.00,
    formaPagamento: 'PIX',
    statusPagamento: 'PAGO',
    observacao: 'Peça banhada a ródio branco',
    categorySlug: 'brincos',
    categoryName: 'Brincos',
    historicoVendas: [
      {
        id: 'v102-1',
        dataVenda: '2026-08-05',
        quantidade: 1,
        valorTotal: 149.00,
        formaPagamento: 'PIX',
        statusPagamento: 'PAGO',
        valorPago: 149.00,
        observacao: 'Venda enviada por correios',
      },
    ],
  },
  {
    id: 201,
    nome: 'Colar Riviera Zircônias 3mm Ouro 18k (CL-201)',
    valor: 279.90,
    custo: 99.90,
    lucro: 180.00,
    estoqueAtual: 4,
    qtdVendida: 1,
    valorPago: 279.90,
    formaPagamento: 'Cartão de Crédito 3x',
    statusPagamento: 'PAGO',
    observacao: 'Enviado por motoboy',
    categorySlug: 'colares',
    categoryName: 'Colares',
    historicoVendas: [
      {
        id: 'v201-1',
        dataVenda: '2026-08-10',
        quantidade: 1,
        valorTotal: 279.90,
        formaPagamento: 'Cartão de Crédito 3x',
        statusPagamento: 'PAGO',
        valorPago: 279.90,
        observacao: 'Enviado por motoboy',
      },
    ],
  },
  {
    id: 202,
    nome: 'Colar Gravatinha com Pérola Natural (CL-202)',
    valor: 199.00,
    custo: 79.00,
    lucro: 120.00,
    estoqueAtual: 6,
    qtdVendida: 1,
    valorPago: 199.00,
    formaPagamento: 'PIX',
    statusPagamento: 'PAGO',
    observacao: 'Reserva para entrega presencial',
    categorySlug: 'colares',
    categoryName: 'Colares',
    historicoVendas: [
      {
        id: 'v202-1',
        dataVenda: '2026-08-12',
        quantidade: 1,
        valorTotal: 199.00,
        formaPagamento: 'PIX',
        statusPagamento: 'PAGO',
        valorPago: 199.00,
        observacao: 'Venda presencial',
      },
    ],
  },
  {
    id: 301,
    nome: 'Bracelete Estruturado Cravejado Ouro 18k (PS-301)',
    valor: 249.00,
    custo: 89.00,
    lucro: 160.00,
    estoqueAtual: 10,
    qtdVendida: 0,
    valorPago: 0,
    formaPagamento: '',
    statusPagamento: 'PAGO',
    observacao: 'Peças no showroom principal',
    categorySlug: 'pulseiras',
    categoryName: 'Pulseiras',
    historicoVendas: [],
  },
  {
    id: 401,
    nome: 'Anel Solitário Zircônia Central 8mm (AN-401)',
    valor: 139.90,
    custo: 49.90,
    lucro: 90.00,
    estoqueAtual: 12,
    qtdVendida: 0,
    valorPago: 0,
    formaPagamento: '',
    statusPagamento: 'PAGO',
    observacao: 'Disponível no estoque (Aros variados)',
    categorySlug: 'aneis',
    categoryName: 'Anéis',
    historicoVendas: [],
  },
  {
    id: 601,
    nome: 'Conjunto Colar e Brinco Gota Cristal Luxo (CJ-601)',
    valor: 299.90,
    custo: 109.90,
    lucro: 190.00,
    estoqueAtual: 3,
    qtdVendida: 2,
    valorPago: 599.80,
    formaPagamento: 'PIX + Cartão',
    statusPagamento: 'PAGO',
    observacao: 'Acompanha caixinha aveludada',
    categorySlug: 'conjuntos',
    categoryName: 'Conjuntos',
    historicoVendas: [
      {
        id: 'v601-1',
        dataVenda: '2026-08-08',
        quantidade: 2,
        valorTotal: 599.80,
        formaPagamento: 'PIX + Cartão',
        statusPagamento: 'PAGO',
        valorPago: 599.80,
        observacao: 'Vendidas 2 unidades para presente',
      },
    ],
  },
];

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

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
    console.error('Erro ao ler itens do admin:', error);
    return INITIAL_ITEMS;
  }
}

export function saveAdminItems(items: ItemVenda[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  } catch (error) {
    console.error('Erro ao salvar itens do admin:', error);
  }
}

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
  return item;
}

export function updateAdminItem(updatedItem: ItemVenda): void {
  const items = getAdminItems();
  const index = items.findIndex((i) => i.id === updatedItem.id);
  if (index !== -1) {
    items[index] = {
      ...updatedItem,
      custo: updatedItem.custo ?? (updatedItem.valor - updatedItem.lucro),
    };
    saveAdminItems(items);
  }
}

export function deleteAdminItem(id: number): void {
  const items = getAdminItems();
  const updated = items.filter((i) => i.id !== id);
  saveAdminItems(updated);
}

// Registrar uma nova venda de X unidades de uma peça
export function registrarVenda(
  itemId: number,
  qtdAVender: number,
  dataVenda?: string
): void {
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

  items[index] = {
    ...item,
    estoqueAtual,
    qtdVendida,
    valorPago: novoValorPago,
    historicoVendas: historico,
  };

  saveAdminItems(items);
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
  if (!isBrowser()) return DEFAULT_PIN;
  return localStorage.getItem(STORAGE_KEY_PIN) || DEFAULT_PIN;
}

export function setAdminPin(newPin: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY_PIN, newPin);
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
