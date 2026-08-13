export type StatusEstoque = 'DISPONIVEL' | 'ESGOTADO';
export type StatusPagamento = 'PAGO' | 'PENDENTE';

export interface RegistroVenda {
  id: string;
  dataVenda: string;
  quantidade: number;
  valorTotal: number;
  formaPagamento: string;
  statusPagamento: StatusPagamento;
  valorPago: number;
  observacao?: string;
}

export interface ItemVenda {
  id: number; // CÓDIGO DO PRODUTO (ex: 101)
  nome: string; // NOME DO PRODUTO
  valor: number; // VALOR UNITÁRIO (R$)
  custo?: number; // CUSTO UNITÁRIO (R$)
  lucro: number; // LUCRO UNITÁRIO (R$)
  estoqueAtual: number; // QUANTIDADE ATUAL DISPONÍVEL NO ESTOQUE
  qtdVendida: number; // QUANTIDADE TOTAL VENDIDA DAQUELA PEÇA
  historicoVendas?: RegistroVenda[]; // HISTÓRICO DE TRANSAÇÕES
  formaPagamento?: string; // ÚLTIMA FORMA DE PAGAMENTO USADA
  statusPagamento?: StatusPagamento; // STATUS PREDOMINANTE DE PAGAMENTO
  valorPago: number; // VALOR TOTAL PAGO ACUMULADO (R$)
  observacao?: string;
  categorySlug?: string;
  categoryName?: string;
}

export interface ResumoFinanceiro {
  totalFaturado: number;
  totalLucro: number;
  totalPago: number;
  qtdEstoqueTotal: number;
  qtdVendidosTotal: number;
  totalModelos: number;
}
