import React from 'react';
import { 
  Wallet, 
  Landmark, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  Percent
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/calculator.js';

export default function KpiCards({ comparison, stockInfo, initialAmount, monthlyAmount }) {
  const { totalInvested, selic, stock, months, years } = comparison;

  const totalMonthlyContributed = totalInvested - initialAmount;

  return (
    <div className="kpi-grid">
      {/* CARD 1: TOTAL INVESTIDO */}
      <div className="kpi-card kpi-card-invested">
        <div className="kpi-card-header">
          <div className="kpi-title-row">
            <div className="kpi-icon-pill" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
              <Wallet size={18} />
            </div>
            <h3>Total Investido</h3>
          </div>
          <span className="kpi-type-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            Desembolso
          </span>
        </div>

        <div className="kpi-main-stat">
          <span className="kpi-label">Capital Próprio Alocado</span>
          <div className="kpi-balance">{formatCurrency(totalInvested)}</div>
          <div className="kpi-return-chip" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8' }}>
            <span>{months} parcelas mensais</span>
          </div>
        </div>

        <div className="kpi-stats-list">
          <div className="kpi-stat-row">
            <span className="kpi-stat-label">Aplicação Inicial:</span>
            <span className="kpi-stat-value">{formatCurrency(initialAmount)}</span>
          </div>
          <div className="kpi-stat-row">
            <span className="kpi-stat-label">Soma dos Aportes:</span>
            <span className="kpi-stat-value">{formatCurrency(totalMonthlyContributed)}</span>
          </div>
          <div className="kpi-stat-row">
            <span className="kpi-stat-label">Aporte Mensal:</span>
            <span className="kpi-stat-value">{formatCurrency(monthlyAmount)} / mês</span>
          </div>
        </div>
      </div>

      {/* CARD 2: TAXA SELIC */}
      <div className="kpi-card kpi-card-selic">
        <div className="kpi-card-header">
          <div className="kpi-title-row">
            <div className="kpi-icon-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <Landmark size={18} />
            </div>
            <h3>Taxa Selic (CDI)</h3>
          </div>
          <span className="kpi-type-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            Renda Fixa
          </span>
        </div>

        <div className="kpi-main-stat">
          <span className="kpi-label">Patrimônio Bruto Acumulado</span>
          <div className="kpi-balance" style={{ color: '#34d399' }}>
            {formatCurrency(selic.finalBalance)}
          </div>
          <div className="kpi-return-chip chip-positive">
            <ArrowUpRight size={15} />
            <span>{formatPercent(selic.totalReturnPct)} (+{formatCurrency(selic.grossProfit)})</span>
          </div>
        </div>

        <div className="kpi-stats-list">
          <div className="kpi-stat-row">
            <span className="kpi-stat-label">Retorno Anualizado (CAGR):</span>
            <span className="kpi-stat-value" style={{ color: '#34d399' }}>{formatPercent(selic.cagr, false)} a.a.</span>
          </div>
          <div className="kpi-stat-row">
            <span className="kpi-stat-label">IR Estimado ({selic.taxRate}%):</span>
            <span className="kpi-stat-value" style={{ color: '#f87171' }}>-{formatCurrency(selic.taxR$)}</span>
          </div>
          <div className="kpi-stat-row">
            <span className="kpi-stat-label">Saldo Líquido Estimado:</span>
            <span className="kpi-stat-value">{formatCurrency(selic.netBalance)}</span>
          </div>
          <div className="kpi-stat-row">
            <span className="kpi-stat-label">Volatilidade Negativa:</span>
            <span className="kpi-stat-value" style={{ color: '#34d399' }}>0 meses (100% positivo)</span>
          </div>
        </div>
      </div>

      {/* CARD 3: AÇÃO ESCOLHIDA */}
      <div className="kpi-card kpi-card-stock">
        <div className="kpi-card-header">
          <div className="kpi-title-row">
            <div className="kpi-icon-pill" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <TrendingUp size={18} />
            </div>
            <h3>{stockInfo.ticker}</h3>
          </div>
          <span className="kpi-type-badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc' }}>
            Ações B3
          </span>
        </div>

        <div className="kpi-main-stat">
          <span className="kpi-label">Patrimônio Bruto Acumulado</span>
          <div className="kpi-balance" style={{ color: stock.grossProfit >= 0 ? '#818cf8' : '#fb7185' }}>
            {formatCurrency(stock.finalBalance)}
          </div>
          <div className={`kpi-return-chip ${stock.totalReturnPct >= 0 ? 'chip-positive' : 'chip-negative'}`}>
            {stock.totalReturnPct >= 0 ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
            <span>{formatPercent(stock.totalReturnPct)} ({formatCurrency(stock.grossProfit)})</span>
          </div>
        </div>

        <div className="kpi-stats-list">
          <div className="kpi-stat-row">
            <span className="kpi-stat-label">Retorno Anualizado (CAGR):</span>
            <span className="kpi-stat-value" style={{ color: stock.cagr >= 0 ? '#818cf8' : '#fb7185' }}>
              {formatPercent(stock.cagr, false)} a.a.
            </span>
          </div>
          <div className="kpi-stat-row">
            <span className="kpi-stat-label">Meses Positivos / Negativos:</span>
            <span className="kpi-stat-value">{stock.positiveMonths} pos / {stock.negativeMonths} neg</span>
          </div>
          <div className="kpi-stat-row">
            <span className="kpi-stat-label">Maior Queda (Drawdown):</span>
            <span className="kpi-stat-value" style={{ color: '#fb7185' }}>-{stock.maxDrawdownPct.toFixed(1)}%</span>
          </div>
          <div className="kpi-stat-row">
            <span className="kpi-stat-label">Melhor Mês:</span>
            <span className="kpi-stat-value" style={{ color: '#34d399' }}>
              +{stock.bestMonth.pct.toFixed(1)}% ({stock.bestMonth.label})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
