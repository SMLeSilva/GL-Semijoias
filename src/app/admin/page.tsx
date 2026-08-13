'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ItemVenda,
  ResumoFinanceiro,
} from '@/types/admin';
import {
  getAdminItems,
  addAdminItem,
  updateAdminItem,
  deleteAdminItem,
  registrarVenda,
  calculateResumoFinanceiro,
} from '@/lib/adminStorage';
import {
  DollarSign,
  TrendingUp,
  PackageCheck,
  Plus,
  Search,
  Edit2,
  Trash2,
  ShoppingBag,
  X,
  Filter,
  RefreshCw,
  Sparkles,
  Boxes,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function AdminPage() {
  const [items, setItems] = useState<ItemVenda[]>([]);
  const [search, setSearch] = useState('');
  const [filterEstoque, setFilterEstoque] = useState<'TODOS' | 'DISPONIVEL' | 'ESGOTADO'>('TODOS');

  // Modais
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemVenda | null>(null);

  const [isVendaModalOpen, setIsVendaModalOpen] = useState(false);
  const [selectedVendaItem, setSelectedVendaItem] = useState<ItemVenda | null>(null);

  // Form de Produto (Novo / Editar)
  const [formNome, setFormNome] = useState('');
  const [formValor, setFormValor] = useState('');
  const [formLucro, setFormLucro] = useState('');
  const [formEstoqueAtual, setFormEstoqueAtual] = useState('10');
  const [formObservacao, setFormObservacao] = useState('');
  const [formCategorySlug, setFormCategorySlug] = useState('brincos');

  // Form de Registrar Venda (Somente quantidade!)
  const [vendaQtd, setVendaQtd] = useState('1');

  useEffect(() => {
    setItems(getAdminItems());
  }, []);

  const refreshData = () => {
    setItems(getAdminItems());
  };

  const resumo: ResumoFinanceiro = useMemo(() => {
    return calculateResumoFinanceiro(items);
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.nome.toLowerCase().includes(search.toLowerCase()) ||
        String(item.id).includes(search) ||
        (item.observacao && item.observacao.toLowerCase().includes(search.toLowerCase()));

      let matchesEstoque = true;
      if (filterEstoque === 'DISPONIVEL') matchesEstoque = item.estoqueAtual > 0;
      if (filterEstoque === 'ESGOTADO') matchesEstoque = item.estoqueAtual === 0;

      return matchesSearch && matchesEstoque;
    });
  }, [items, search, filterEstoque]);

  // --- Handlers do Produto ---
  const handleOpenNewItem = () => {
    setEditingItem(null);
    setFormNome('');
    setFormValor('');
    setFormLucro('');
    setFormEstoqueAtual('10');
    setFormObservacao('');
    setFormCategorySlug('brincos');
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: ItemVenda) => {
    setEditingItem(item);
    setFormNome(item.nome);
    setFormValor(String(item.valor));
    setFormLucro(String(item.lucro));
    setFormEstoqueAtual(String(item.estoqueAtual));
    setFormObservacao(item.observacao || '');
    setFormCategorySlug(item.categorySlug || 'brincos');
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(formValor) || 0;
    const luc = parseFloat(formLucro) || 0;
    const est = parseInt(formEstoqueAtual, 10) || 0;
    const cus = val - luc;

    if (editingItem) {
      updateAdminItem({
        ...editingItem,
        nome: formNome,
        valor: val,
        lucro: luc,
        estoqueAtual: est,
        custo: cus,
        observacao: formObservacao,
        categorySlug: formCategorySlug,
      });
    } else {
      addAdminItem({
        nome: formNome,
        valor: val,
        lucro: luc,
        estoqueAtual: est,
        custo: cus,
        observacao: formObservacao,
        categorySlug: formCategorySlug,
      });
    }

    setIsItemModalOpen(false);
    refreshData();
  };

  const handleDelete = (id: number) => {
    if (confirm(`Tem certeza que deseja excluir o modelo #${id}?`)) {
      deleteAdminItem(id);
      refreshData();
    }
  };

  // --- Handlers de Venda ---
  const handleOpenVendaModal = (item: ItemVenda) => {
    setSelectedVendaItem(item);
    setVendaQtd('1');
    setIsVendaModalOpen(true);
  };

  const handleSaveVenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendaItem) return;

    const q = parseInt(vendaQtd, 10) || 1;

    if (q > selectedVendaItem.estoqueAtual) {
      alert(`Quantidade a vender (${q}) maior do que o estoque disponível (${selectedVendaItem.estoqueAtual})!`);
      return;
    }

    registrarVenda(selectedVendaItem.id, q);

    setIsVendaModalOpen(false);
    refreshData();
  };

  const fmt = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Valores dinâmicos da venda no modal
  const qVenda = parseInt(vendaQtd, 10) || 0;
  const faturamentoVendaCalc = selectedVendaItem ? qVenda * selectedVendaItem.valor : 0;
  const lucroVendaCalc = selectedVendaItem ? qVenda * selectedVendaItem.lucro : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-2">
            Painel de Controle de Estoque & Vendas
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Gestão simplificada de modelos, saldo de estoque disponível e faturamento de vendas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            className="p-2.5 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 transition-colors"
            title="Atualizar Dados"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenNewItem}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c49f27] text-neutral-950 font-bold text-xs sm:text-sm shadow-lg shadow-[#D4AF37]/10 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Novo Modelo</span>
          </button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Faturamento Total */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Total Faturado
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-white tracking-tight">
              {fmt(resumo.totalFaturado)}
            </div>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              {resumo.qtdVendidosTotal} unidade(s) vendida(s)
            </p>
          </div>
        </div>

        {/* Lucro Acumulado */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Lucro Total Acumulado
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-white tracking-tight">
              {fmt(resumo.totalLucro)}
            </div>
            <p className="text-[11px] text-[#D4AF37] font-medium">
              Lucro líquido gerado pelas vendas
            </p>
          </div>
        </div>

        {/* Total em Caixa */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Total Pago Recebido
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-white tracking-tight">
              {fmt(resumo.totalPago)}
            </div>
            <p className="text-[11px] text-teal-400 font-medium">
              Confirmado em caixa
            </p>
          </div>
        </div>

        {/* Peças em Estoque */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Saldo em Estoque
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-sky-400 tracking-tight">
              {resumo.qtdEstoqueTotal} un
            </div>
            <p className="text-[11px] text-neutral-400 font-medium">
              Em {resumo.totalModelos} modelo(s) cadastrado(s)
            </p>
          </div>
        </div>
      </div>

      {/* Busca e Filtro */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código ou nome do produto..."
            className="w-full bg-neutral-950 border border-neutral-800 focus:border-[#D4AF37] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-xs font-medium text-neutral-400">Estoque:</span>
          <select
            value={filterEstoque}
            onChange={(e) => setFilterEstoque(e.target.value as any)}
            className="bg-neutral-950 border border-neutral-800 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="TODOS">Todos os Produtos ({resumo.totalModelos})</option>
            <option value="DISPONIVEL">Disponíveis no Estoque (&gt; 0)</option>
            <option value="ESGOTADO">Esgotados (0 un)</option>
          </select>
        </div>
      </div>

      {/* Tabela Principal Enxuta */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase font-semibold text-[11px] border-b border-neutral-800 tracking-wider">
              <tr>
                <th className="py-4 px-4">Código</th>
                <th className="py-4 px-4">Produto</th>
                <th className="py-4 px-4 text-center">Estoque Atual</th>
                <th className="py-4 px-4 text-center">Qtd Vendida</th>
                <th className="py-4 px-4">Valor Un.</th>
                <th className="py-4 px-4">Lucro Un.</th>
                <th className="py-4 px-4">Total Faturado</th>
                <th className="py-4 px-4 text-[#D4AF37]">Total Lucro</th>
                <th className="py-4 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono text-[12px]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-500 font-sans">
                    Nenhum produto cadastrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const totalFaturadoItem = item.qtdVendida * item.valor;
                  const totalLucroItem = item.qtdVendida * item.lucro;

                  return (
                    <tr key={item.id} className="hover:bg-neutral-800/40 transition-colors">
                      {/* CÓDIGO */}
                      <td className="py-3.5 px-4 font-bold text-[#D4AF37]">
                        #{item.id}
                      </td>

                      {/* NOME */}
                      <td className="py-3.5 px-4 font-sans font-medium text-white max-w-[240px] truncate" title={item.nome}>
                        {item.nome}
                      </td>

                      {/* ESTOQUE ATUAL */}
                      <td className="py-3.5 px-4 text-center font-sans">
                        {item.estoqueAtual > 0 ? (
                          <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold inline-flex items-center gap-1">
                            <Boxes className="w-3 h-3" />
                            {item.estoqueAtual} un
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold inline-flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Esgotado
                          </span>
                        )}
                      </td>

                      {/* QTD VENDIDA */}
                      <td className="py-3.5 px-4 text-center font-sans">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold inline-flex items-center gap-1">
                          <PackageCheck className="w-3 h-3" />
                          {item.qtdVendida} un
                        </span>
                      </td>

                      {/* VALOR UN */}
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {fmt(item.valor)}
                      </td>

                      {/* LUCRO UN */}
                      <td className="py-3.5 px-4 font-semibold text-emerald-400">
                        {fmt(item.lucro)}
                      </td>

                      {/* TOTAL FATURADO */}
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {fmt(totalFaturadoItem)}
                      </td>

                      {/* TOTAL LUCRO */}
                      <td className="py-3.5 px-4 font-semibold text-[#D4AF37]">
                        {fmt(totalLucroItem)}
                      </td>

                      {/* AÇÕES */}
                      <td className="py-3.5 px-4 text-right font-sans">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenVendaModal(item)}
                            disabled={item.estoqueAtual === 0}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                              item.estoqueAtual > 0
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-neutral-950 shadow-md active:scale-95'
                                : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                            }`}
                            title={item.estoqueAtual > 0 ? 'Registrar Venda' : 'Estoque Esgotado'}
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Vender</span>
                          </button>

                          <button
                            onClick={() => handleOpenEditItem(item)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                            title="Editar Modelo / Repor Estoque"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL NOVO / EDITAR MODELO --- */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setIsItemModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="font-serif text-xl font-bold text-white tracking-wide">
                {editingItem ? `Editar Modelo #${editingItem.id}` : 'Cadastrar Novo Modelo no Estoque'}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Configure os valores unitários e a quantidade disponível em estoque.
              </p>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Nome do Modelo / Peça
                </label>
                <input
                  type="text"
                  required
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  placeholder="Ex: Argola Tubo Cravejada Zircônias (BR-101)"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-sky-400 mb-1">
                    Estoque Atual
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formEstoqueAtual}
                    onChange={(e) => setFormEstoqueAtual(e.target.value)}
                    placeholder="10"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-sky-500 rounded-xl px-3 py-2.5 text-xs text-sky-300 font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Valor Un. (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formValor}
                    onChange={(e) => setFormValor(e.target.value)}
                    placeholder="189.90"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-[#D4AF37] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-emerald-400 mb-1">
                    Lucro Un. (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formLucro}
                    onChange={(e) => setFormLucro(e.target.value)}
                    placeholder="120.00"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-xs text-emerald-400 font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Categoria
                </label>
                <select
                  value={formCategorySlug}
                  onChange={(e) => setFormCategorySlug(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="brincos">Brincos</option>
                  <option value="colares">Colares</option>
                  <option value="pulseiras">Pulseiras</option>
                  <option value="aneis">Anéis</option>
                  <option value="tornozeleiras">Tornozeleiras</option>
                  <option value="conjuntos">Conjuntos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Observações
                </label>
                <textarea
                  rows={2}
                  value={formObservacao}
                  onChange={(e) => setFormObservacao(e.target.value)}
                  placeholder="Ex: Localizado na gaveta A2, banho com verniz italiano"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white text-xs font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c49f27] text-neutral-950 font-bold text-xs transition-all shadow-md"
                >
                  Salvar Modelo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL REGISTRAR VENDA ULTRA RÁPIDO --- */}
      {isVendaModalOpen && selectedVendaItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setIsVendaModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
                <ShoppingBag className="w-4 h-4" />
                Registrar Venda
              </div>
              <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                {selectedVendaItem.nome}
              </h3>
              <p className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
                <span>Preço Un: <strong className="text-white">{fmt(selectedVendaItem.valor)}</strong></span>
                <span>•</span>
                <span>Lucro Un: <strong className="text-emerald-400">{fmt(selectedVendaItem.lucro)}</strong></span>
                <span>•</span>
                <span>Estoque: <strong className="text-sky-400">{selectedVendaItem.estoqueAtual} un</strong></span>
              </p>
            </div>

            <form onSubmit={handleSaveVenda} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-emerald-400 mb-1.5 text-center">
                  Quantidade a Vender
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedVendaItem.estoqueAtual}
                  required
                  autoFocus
                  value={vendaQtd}
                  onChange={(e) => setVendaQtd(e.target.value)}
                  className="w-full bg-neutral-950 border border-emerald-500/60 focus:border-emerald-500 rounded-2xl px-4 py-3 text-center text-2xl text-emerald-400 font-bold font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Subtotal e Lucro Calculados em Tempo Real */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400">Total Faturado Nesta Venda:</span>
                  <span className="text-base font-bold text-[#D4AF37] font-mono">
                    {fmt(faturamentoVendaCalc)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-neutral-800/80 pt-2">
                  <span className="text-xs text-neutral-400">Lucro Gerado Nesta Venda:</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">
                    {fmt(lucroVendaCalc)}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsVendaModalOpen(false)}
                  className="w-1/2 py-3 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white text-xs font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  Confirmar Venda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
