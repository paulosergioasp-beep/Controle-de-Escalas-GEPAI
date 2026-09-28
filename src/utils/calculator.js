import { HISTORICAL_SELIC_MONTHLY, STOCKS_HISTORICAL_MONTHLY, getMonthLabels } from '../data/stocksData.js';

/**
 * Realiza os cálculos comparativos entre Selic e a ação selecionada
 */
export function calculateComparison({
  ticker = 'PETR4',
  horizonMonths = 24,
  initialAmount = 10000,
  monthlyAmount = 500,
  isCustomSimulation = false,
  customSelicAnnual = 10.75,
  customStockAnnual = 15.0
}) {
  const initial = Math.max(0, Number(initialAmount) || 0);
  const monthly = Math.max(0, Number(monthlyAmount) || 0);
  const months = Number(horizonMonths) || 12;

  // Obter taxas mensais
  let selicRates = [];
  let stockRates = [];

  if (isCustomSimulation) {
    // Converte taxa anual nominal para taxa mensal efetiva equivalente
    const selicMonthlyRate = (Math.pow(1 + customSelicAnnual / 100, 1 / 12) - 1) * 100;
    const stockMonthlyRate = (Math.pow(1 + customStockAnnual / 100, 1 / 12) - 1) * 100;

    selicRates = Array(months).fill(selicMonthlyRate);
    stockRates = Array(months).fill(stockMonthlyRate);
  } else {
    // Histórico real: pega os últimos 'months'
    const fullSelic = HISTORICAL_SELIC_MONTHLY;
    const fullStock = STOCKS_HISTORICAL_MONTHLY[ticker] || STOCKS_HISTORICAL_MONTHLY['PETR4'];

    selicRates = fullSelic.slice(-months);
    stockRates = fullStock.slice(-months);
  }

  const labels = getMonthLabels(months);

  // Evolução mês a mês
  // Ponto 0 (Início)
  const timeline = [
    {
      monthIndex: 0,
      label: 'Início',
      contribution: initial,
      totalInvested: initial,
      selicBalance: initial,
      stockBalance: initial,
      selicReturnMonthPct: 0,
      stockReturnMonthPct: 0,
      selicProfitMonthR$: 0,
      stockProfitMonthR$: 0,
      selicCumulativeProfit: 0,
      stockCumulativeProfit: 0
    }
  ];

  let currentSelic = initial;
  let currentStock = initial;
  let totalInvested = initial;

  let stockPeak = initial;
  let maxStockDrawdown = 0;
  let stockPositiveMonths = 0;
  let stockNegativeMonths = 0;

  let bestStockMonth = { pct: -Infinity, label: '', index: 0 };
  let worstStockMonth = { pct: Infinity, label: '', index: 0 };

  for (let i = 0; i < months; i++) {
    const selicPct = selicRates[i];
    const stockPct = stockRates[i];
    const label = labels[i];

    // Adiciona aporte no início do mês
    const selicBase = currentSelic + monthly;
    const stockBase = currentStock + monthly;
    totalInvested += monthly;

    const selicProfitMonth = selicBase * (selicPct / 100);
    const stockProfitMonth = stockBase * (stockPct / 100);

    currentSelic = selicBase + selicProfitMonth;
    currentStock = Math.max(0, stockBase + stockProfitMonth);

    // Estatísticas de drawdown
    if (currentStock > stockPeak) {
      stockPeak = currentStock;
    }
    const currentDrawdown = stockPeak > 0 ? ((stockPeak - currentStock) / stockPeak) * 100 : 0;
    if (currentDrawdown > maxStockDrawdown) {
      maxStockDrawdown = currentDrawdown;
    }

    if (stockPct >= 0) stockPositiveMonths++;
    else stockNegativeMonths++;

    if (stockPct > bestStockMonth.pct) {
      bestStockMonth = { pct: stockPct, label, index: i + 1 };
    }
    if (stockPct < worstStockMonth.pct) {
      worstStockMonth = { pct: stockPct, label, index: i + 1 };
    }

    timeline.push({
      monthIndex: i + 1,
      label,
      contribution: monthly,
      totalInvested: Math.round(totalInvested * 100) / 100,
      selicBalance: Math.round(currentSelic * 100) / 100,
      stockBalance: Math.round(currentStock * 100) / 100,
      selicReturnMonthPct: Number(selicPct.toFixed(2)),
      stockReturnMonthPct: Number(stockPct.toFixed(2)),
      selicProfitMonthR$: Math.round(selicProfitMonth * 100) / 100,
      stockProfitMonthR$: Math.round(stockProfitMonth * 100) / 100,
      selicCumulativeProfit: Math.round((currentSelic - totalInvested) * 100) / 100,
      stockCumulativeProfit: Math.round((currentStock - totalInvested) * 100) / 100
    });
  }

  // Cálculos finais
  const selicGrossProfit = Math.max(0, currentSelic - totalInvested);
  const stockGrossProfit = currentStock - totalInvested;

  const selicTotalReturnPct = totalInvested > 0 ? (selicGrossProfit / totalInvested) * 100 : 0;
  const stockTotalReturnPct = totalInvested > 0 ? (stockGrossProfit / totalInvested) * 100 : 0;

  // Alíquota de IR para Renda Fixa (Tabela Regressiva da Receita Federal)
  // Até 180 dias: 22.5% | 181 a 360 dias: 20% | 361 a 720 dias: 17.5% | > 720 dias: 15%
  let selicTaxRate = 0.15;
  if (months <= 6) selicTaxRate = 0.225;
  else if (months <= 12) selicTaxRate = 0.175;
  else selicTaxRate = 0.15;

  const selicTaxR$ = selicGrossProfit * selicTaxRate;
  const selicNetProfit = selicGrossProfit - selicTaxR$;
  const selicNetBalance = currentSelic - selicTaxR$;
  const selicNetReturnPct = totalInvested > 0 ? (selicNetProfit / totalInvested) * 100 : 0;

  // Ações: 15% de IR sobre ganho de capital líquido (swing trade)
  const stockTaxRate = 0.15;
  const stockTaxR$ = stockGrossProfit > 0 ? stockGrossProfit * stockTaxRate : 0;
  const stockNetProfit = stockGrossProfit - stockTaxR$;
  const stockNetBalance = currentStock - stockTaxR$;
  const stockNetReturnPct = totalInvested > 0 ? (stockNetProfit / totalInvested) * 100 : 0;

  // Anualização simples de rentabilidade (CAGR)
  const years = months / 12;
  const selicCagr = years > 0 && currentSelic > 0 && totalInvested > 0
    ? (Math.pow(currentSelic / totalInvested, 1 / years) - 1) * 100
    : 0;
  const stockCagr = years > 0 && currentStock > 0 && totalInvested > 0
    ? (Math.pow(currentStock / totalInvested, 1 / years) - 1) * 100
    : 0;

  // Vencedor
  const diffBalance = Math.abs(currentStock - currentSelic);
  const diffPercent = currentSelic > 0 ? ((currentStock - currentSelic) / currentSelic) * 100 : 0;
  let winner = 'tie';
  if (currentStock > currentSelic + 0.01) winner = 'stock';
  else if (currentSelic > currentStock + 0.01) winner = 'selic';

  return {
    ticker,
    months,
    years,
    totalInvested: Math.round(totalInvested * 100) / 100,
    selic: {
      finalBalance: Math.round(currentSelic * 100) / 100,
      grossProfit: Math.round(selicGrossProfit * 100) / 100,
      totalReturnPct: Number(selicTotalReturnPct.toFixed(2)),
      cagr: Number(selicCagr.toFixed(2)),
      taxRate: Number((selicTaxRate * 100).toFixed(1)),
      taxR$: Math.round(selicTaxR$ * 100) / 100,
      netProfit: Math.round(selicNetProfit * 100) / 100,
      netBalance: Math.round(selicNetBalance * 100) / 100,
      netReturnPct: Number(selicNetReturnPct.toFixed(2))
    },
    stock: {
      finalBalance: Math.round(currentStock * 100) / 100,
      grossProfit: Math.round(stockGrossProfit * 100) / 100,
      totalReturnPct: Number(stockTotalReturnPct.toFixed(2)),
      cagr: Number(stockCagr.toFixed(2)),
      taxRate: Number((stockTaxRate * 100).toFixed(1)),
      taxR$: Math.round(stockTaxR$ * 100) / 100,
      netProfit: Math.round(stockNetProfit * 100) / 100,
      netBalance: Math.round(stockNetBalance * 100) / 100,
      netReturnPct: Number(stockNetReturnPct.toFixed(2)),
      maxDrawdownPct: Number(maxStockDrawdown.toFixed(2)),
      positiveMonths: stockPositiveMonths,
      negativeMonths: stockNegativeMonths,
      bestMonth: bestStockMonth,
      worstMonth: worstStockMonth
    },
    winner,
    diffBalance: Math.round(diffBalance * 100) / 100,
    diffPercent: Number(diffPercent.toFixed(2)),
    timeline
  };
}

/**
 * Formatador monetário brasileiro BRL
 */
export function formatCurrency(value) {
  if (value === undefined || value === null || isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Formatador percentual brasileiro
 */
export function formatPercent(value, showSign = true) {
  if (value === undefined || value === null || isNaN(value)) return '0,00%';
  const prefix = showSign && value > 0 ? '+' : '';
  return `${prefix}${new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)}%`;
}
