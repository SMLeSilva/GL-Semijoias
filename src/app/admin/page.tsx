'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ItemVenda,
  ResumoFinanceiro,
} from '@/types/admin';
import {
  getAdminItems,
  addAdminItem,
  updateAdminItem,
  deleteAdminItem,
  importAdminItems,
  registrarVenda,
  calculateResumoFinanceiro,
} from '@/lib/adminStorage';
import {
  DollarSign,
  TrendingUp,
  PackageCheck,
  Plus,
  Search,
  Trash2,
  ShoppingBag,
  X,
  Filter,
  RefreshCw,
  Sparkles,
  Boxes,
  CheckCircle2,
  Table,
  Calculator,
} from 'lucide-react';

export default function AdminPage() {
  const [items, setItems] = useState<ItemVenda[]>([]);
  const [search, setSearch] = useState('');
  const [filterEstoque, setFilterEstoque] = useState<'TODOS' | 'DISPONIVEL' | 'ESGOTADO'>('TODOS');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Modais
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemVenda | null>(null);

  const [isVendaModalOpen, setIsVendaModalOpen] = useState(false);
  const [selectedVendaItem, setSelectedVendaItem] = useState<ItemVenda | null>(null);

  // Form de Produto (Novo / Editar Modal)
  const [formNome, setFormNome] = useState('');
  const [formValor, setFormValor] = useState('');
  const [formLucro, setFormLucro] = useState('');
  const [formEstoqueAtual, setFormEstoqueAtual] = useState('10');
  const [formObservacao, setFormObservacao] = useState('');
  const [formCategorySlug, setFormCategorySlug] = useState('brincos');

  // Form de Registrar Venda
  const [vendaQtd, setVendaQtd] = useState('1');

  // Ref de Input para Import CSV
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setItems(getAdminItems());
  }, []);

  const refreshData = () => {
    setItems(getAdminItems());
  };

  const showToast = (message: string) => {
    setSaveToast(message);
    setTimeout(() => {
      setSaveToast(null);
    }, 2500);
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

  // --- Handlers de Edição Direta estilo Excel ---
  const handleCellChange = (id: number, field: keyof ItemVenda, value: any) => {
    setItems((prevItems) => {
      const updated = prevItems.map((item) => {
        if (item.id === id) {
          const newItem = { ...item, [field]: value };
          // Recalcular custo se valor ou lucro mudar
          if (field === 'valor' || field === 'lucro') {
            const val = field === 'valor' ? Number(value) : item.valor;
            const luc = field === 'lucro' ? Number(value) : item.lucro;
            newItem.custo = Math.max(0, val - luc);
          }
          updateAdminItem(newItem);
          return newItem;
        }
        return item;
      });
      return updated;
    });
    showToast('Alteração salva ✓');
  };

  const handleAddQuickRow = () => {
    const newItem = addAdminItem({
      nome: 'Novo Modelo (Edite aqui)',
      valor: 100.00,
      lucro: 50.00,
      estoqueAtual: 5,
      custo: 50.00,
      observacao: '',
      categorySlug: 'brincos',
    });
    refreshData();
    showToast(`Nova linha #${newItem.id} adicionada!`);
  };

  // Exportar para CSV (Excel UTF-8 com BOM)
  const handleExportCSV = () => {
    const headers = ['Código', 'Nome', 'Categoria', 'Estoque', 'QtdVendida', 'ValorUnitario', 'LucroUnitario', 'CustoUnitario', 'Observacao'];
    const rows = items.map((i) => [
      i.id,
      `"${(i.nome || '').replace(/"/g, '""')}"`,
      `"${i.categorySlug || 'brincos'}"`,
      i.estoqueAtual,
      i.qtdVendida,
      i.valor,
      i.lucro,
      i.custo ?? (i.valor - i.lucro),
      `"${(i.observacao || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `semijoias_estoque_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Planilha CSV baixada para Excel!');
  };

  // Importar de CSV
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        if (!text) return;

        const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '');
        if (lines.length <= 1) return;

        const separator = lines[0].includes(';') ? ';' : ',';
        const importedItems: ItemVenda[] = [];

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(separator).map((c) => c.trim().replace(/^"|"$/g, ''));
          if (cols.length < 2) continue;

          const id = parseInt(cols[0], 10) || (100 + i);
          const nome = cols[1] || `Produto ${id}`;
          const categorySlug = cols[2] || 'brincos';
          const estoqueAtual = parseInt(cols[3], 10) || 0;
          const qtdVendida = parseInt(cols[4], 10) || 0;
          const valor = parseFloat(cols[5]?.replace(',', '.')) || 0;
          const lucro = parseFloat(cols[6]?.replace(',', '.')) || 0;
          const custo = cols[7] ? parseFloat(cols[7].replace(',', '.')) : (valor - lucro);
          const observacao = cols[8] || '';

          importedItems.push({
            id,
            nome,
            categorySlug,
            estoqueAtual,
            qtdVendida,
            valor,
            lucro,
            custo,
            valorPago: qtdVendida * valor,
            observacao,
            historicoVendas: [],
          });
        }

        if (importedItems.length > 0) {
          importAdminItems(importedItems);
          refreshData();
          showToast(`${importedItems.length} modelos importados do CSV!`);
        }
      } catch (err) {
        alert('Erro ao processar arquivo CSV. Certifique-se de que é uma planilha CSV válida.');
      }
    };
    reader.readAsText(file, 'UTF-8');
    if (e.target) e.target.value = '';
  };

  // --- Handlers do Modal Tradicional ---
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
      showToast('Modelo atualizado!');
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
      showToast('Novo modelo cadastrado!');
    }

    setIsItemModalOpen(false);
    refreshData();
  };

  const handleDelete = (id: number) => {
    if (confirm(`Tem certeza que deseja excluir o modelo #${id}?`)) {
      deleteAdminItem(id);
      refreshData();
      showToast(`Modelo #${id} excluído.`);
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
    showToast(`Venda de ${q} un gravada no histórico!`);
  };

  const fmt = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Valores dinâmicos da venda no modal
  const qVenda = parseInt(vendaQtd, 10) || 0;
  const faturamentoVendaCalc = selectedVendaItem ? qVenda * selectedVendaItem.valor : 0;
  const lucroVendaCalc = selectedVendaItem ? qVenda * selectedVendaItem.lucro : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast flutuante de confirmação estilo Excel */}
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-neutral-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Cabeçalho Principal */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-2">
            Painel de Controle de Estoque & Vendas
            <Sparkles className="w-6 h-6 text-[#D4AF37]" />
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Gestão simplificada de modelos, edição rápida de valores e saldo de estoque
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Botão Adicionar Modelo */}
          <button
            onClick={handleAddQuickRow}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs transition-all shadow-md active:scale-95"
            title="Inserir novo modelo na tabela"
          >
            <Plus className="w-4 h-4" />
            <span>+ Adicionar Modelo</span>
          </button>

          {/* Atualizar / Recarregar */}
          <button
            onClick={refreshData}
            className="p-2 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 transition-colors"
            title="Atualizar Dados"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Busca e Filtros */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código, nome ou notas..."
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

      {/* TABELA PRINCIPAL DE EDIÇÃO DIRETA ESTILO EXCEL */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-neutral-950 text-neutral-400 uppercase font-semibold text-[11px] border-b border-neutral-800 tracking-wider">
              <tr>
                <th className="py-3.5 px-3 border-r border-neutral-800/80 w-16 text-center">Código</th>
                <th className="py-3.5 px-4 border-r border-neutral-800/80 min-w-[220px]">Nome do Modelo</th>
                <th className="py-3.5 px-3 border-r border-neutral-800/80 w-32">Categoria</th>
                <th className="py-3.5 px-3 border-r border-neutral-800/80 w-24 text-center">Estoque</th>
                <th className="py-3.5 px-3 border-r border-neutral-800/80 w-24 text-center">Vendas</th>
                <th className="py-3.5 px-3 border-r border-neutral-800/80 w-36 min-w-[140px] text-right">Valor Un. (R$)</th>
                <th className="py-3.5 px-3 border-r border-neutral-800/80 w-36 min-w-[140px] text-right">Lucro Un. (R$)</th>
                <th className="py-3.5 px-3 border-r border-neutral-800/80 w-32 min-w-[125px] text-right text-neutral-500">
                  <span className="flex items-center justify-end gap-1" title="Fórmula Excel: Custo = Valor - Lucro">
                    <Calculator className="w-3 h-3 text-[#D4AF37]" /> Custo (fx)
                  </span>
                </th>
                <th className="py-3.5 px-3 border-r border-neutral-800/80 w-36 min-w-[140px] text-right">Total Faturado</th>
                <th className="py-3.5 px-3 border-r border-neutral-800/80 w-36 min-w-[140px] text-right text-[#D4AF37]">Total Lucro</th>
                <th className="py-3.5 px-4 border-r border-neutral-800/80 min-w-[180px]">Observações / Gaveta</th>
                <th className="py-3.5 px-4 text-center w-28">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/70 font-sans text-[12px]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-neutral-500">
                    Nenhum modelo cadastrado. Clique em <strong>"+ Linha Rápida"</strong> para começar!
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const custoCalc = item.custo ?? Math.max(0, item.valor - item.lucro);
                  const totalFaturadoItem = item.qtdVendida * item.valor;
                  const totalLucroItem = item.qtdVendida * item.lucro;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-neutral-800/30 transition-colors group border-b border-neutral-800/40"
                    >
                      {/* CÓDIGO (Readonly) */}
                      <td className="py-2.5 px-3 border-r border-neutral-800/50 font-mono font-bold text-[#D4AF37] text-center bg-neutral-950/40">
                        #{item.id}
                      </td>

                      {/* NOME DO MODELO (Input Direto) */}
                      <td className="py-1.5 px-2 border-r border-neutral-800/50">
                        <input
                          type="text"
                          value={item.nome}
                          onChange={(e) => handleCellChange(item.id, 'nome', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') e.currentTarget.blur();
                          }}
                          className="w-full bg-transparent hover:bg-neutral-950 focus:bg-neutral-950 border border-transparent hover:border-neutral-800 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-white font-medium focus:outline-none transition-all"
                          placeholder="Nome do produto..."
                        />
                      </td>

                      {/* CATEGORIA (Select Direto) */}
                      <td className="py-1.5 px-2 border-r border-neutral-800/50">
                        <select
                          value={item.categorySlug || 'brincos'}
                          onChange={(e) => handleCellChange(item.id, 'categorySlug', e.target.value)}
                          className="w-full bg-transparent hover:bg-neutral-950 focus:bg-neutral-950 border border-transparent hover:border-neutral-800 focus:border-[#D4AF37] text-neutral-300 rounded-lg px-2 py-1.5 text-xs sm:text-sm focus:outline-none transition-all"
                        >
                          <option value="brincos" className="bg-neutral-900 text-white">Brincos</option>
                          <option value="colares" className="bg-neutral-900 text-white">Colares</option>
                          <option value="pulseiras" className="bg-neutral-900 text-white">Pulseiras</option>
                          <option value="aneis" className="bg-neutral-900 text-white">Anéis</option>
                          <option value="tornozeleiras" className="bg-neutral-900 text-white">Tornozeleiras</option>
                          <option value="conjuntos" className="bg-neutral-900 text-white">Conjuntos</option>
                        </select>
                      </td>

                      {/* ESTOQUE ATUAL (Input Number Direto com badge visual) */}
                      <td className="py-1.5 px-2 border-r border-neutral-800/50 text-center">
                        <div className="flex items-center justify-center">
                          <input
                            type="number"
                            min="0"
                            value={item.estoqueAtual}
                            onChange={(e) => handleCellChange(item.id, 'estoqueAtual', parseInt(e.target.value, 10) || 0)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') e.currentTarget.blur();
                            }}
                            className={`w-20 text-center font-bold font-mono rounded-lg px-2 py-1.5 text-xs sm:text-sm focus:outline-none transition-all ${
                              item.estoqueAtual > 0
                                ? 'bg-sky-500/10 border border-sky-500/30 text-sky-400 focus:bg-neutral-950 focus:border-sky-500'
                                : 'bg-rose-500/10 border border-rose-500/30 text-rose-400 focus:bg-neutral-950 focus:border-rose-500'
                            }`}
                          />
                        </div>
                      </td>

                      {/* QTD VENDIDA (Readonly) */}
                      <td className="py-2.5 px-3 border-r border-neutral-800/50 text-center font-mono">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold inline-flex items-center gap-1">
                          <PackageCheck className="w-3.5 h-3.5" />
                          {item.qtdVendida} un
                        </span>
                      </td>

                      {/* VALOR UNITÁRIO (Input Number Direto - Amplo) */}
                      <td className="py-1.5 px-2 border-r border-neutral-800/50">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.valor}
                          onChange={(e) => handleCellChange(item.id, 'valor', parseFloat(e.target.value) || 0)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') e.currentTarget.blur();
                          }}
                          className="w-full text-right bg-neutral-950/40 hover:bg-neutral-950 focus:bg-neutral-950 border border-neutral-800/60 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-lg px-3 py-1.5 text-xs sm:text-sm text-white font-mono font-bold focus:outline-none transition-all"
                        />
                      </td>

                      {/* LUCRO UNITÁRIO (Input Number Direto - Amplo) */}
                      <td className="py-1.5 px-2 border-r border-neutral-800/50">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.lucro}
                          onChange={(e) => handleCellChange(item.id, 'lucro', parseFloat(e.target.value) || 0)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') e.currentTarget.blur();
                          }}
                          className="w-full text-right bg-neutral-950/40 hover:bg-neutral-950 focus:bg-neutral-950 border border-neutral-800/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-emerald-400 font-mono font-bold focus:outline-none transition-all"
                        />
                      </td>

                      {/* CUSTO UNITÁRIO (Fórmula Automática = Valor - Lucro) */}
                      <td className="py-2.5 px-3 border-r border-neutral-800/50 text-right font-mono text-xs sm:text-sm text-neutral-400 bg-neutral-950/20 font-medium">
                        {fmt(custoCalc)}
                      </td>

                      {/* TOTAL FATURADO (Calculado) */}
                      <td className="py-2.5 px-3 border-r border-neutral-800/50 text-right font-mono text-xs sm:text-sm font-bold text-white">
                        {fmt(totalFaturadoItem)}
                      </td>

                      {/* TOTAL LUCRO (Calculado) */}
                      <td className="py-2.5 px-3 border-r border-neutral-800/50 text-right font-mono text-xs sm:text-sm font-bold text-[#D4AF37]">
                        {fmt(totalLucroItem)}
                      </td>

                      {/* OBSERVAÇÕES / GAVETA (Input Direto) */}
                      <td className="py-1.5 px-2 border-r border-neutral-800/50">
                        <input
                          type="text"
                          value={item.observacao || ''}
                          onChange={(e) => handleCellChange(item.id, 'observacao', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') e.currentTarget.blur();
                          }}
                          placeholder="Anotações de localização..."
                          className="w-full bg-transparent hover:bg-neutral-950 focus:bg-neutral-950 border border-transparent hover:border-neutral-800 focus:border-neutral-600 rounded-lg px-2.5 py-1 text-xs text-neutral-300 placeholder:text-neutral-600 focus:outline-none transition-all"
                        />
                      </td>

                      {/* AÇÕES (Vender / Excluir) */}
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenVendaModal(item)}
                            disabled={item.estoqueAtual === 0}
                            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                              item.estoqueAtual > 0
                                ? 'bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-neutral-950'
                                : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                            }`}
                            title={item.estoqueAtual > 0 ? 'Registrar Venda' : 'Estoque Esgotado'}
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                            title="Excluir Linha"
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

        {/* Rodapé da Tabela: Linha para Inserção Rápida */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
          <button
            onClick={handleAddQuickRow}
            className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-neutral-900 border border-dashed border-emerald-500/30"
          >
            <Plus className="w-4 h-4" />
            <span>+ Adicionar Novo Modelo</span>
          </button>
          <span className="text-[11px] text-neutral-500 font-mono">
            Total de linhas: {filteredItems.length} modelo(s)
          </span>
        </div>
      </div>

      {/* --- MODAL NOVO / EDITAR MODELO (OPCIONAL/SUPORTE) --- */}
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
                Você também pode editar diretamente em qualquer célula da planilha!
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
