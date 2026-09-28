import React, { useState } from 'react';
import { Download, Table, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/calculator.js';

export default function DataTable({ timeline, stockInfo }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // 12 meses por página (1 ano por página)

  // Total de páginas (exclui ponto inicial se quiser, ou inclui)
  const totalPages = Math.ceil(timeline.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentRows = timeline.slice(startIndex, startIndex + pageSize);

  // Exportar dados para CSV
  function handleDownloadCsv() {
    const headers = [
      'Mes',
      'Data/Rotulo',
      'Aporte (R$)',
      'Total Investido (R$)',
      'Selic Rend. Mes (%)',
      'Selic Lucro Mes (R$)',
      'Selic Saldo (R$)',
      'Acao Rend. Mes (%)',
      'Acao Lucro Mes (R$)',
      'Acao Saldo (R$)',
      'Diferenca (R$)'
    ];

    const rows = timeline.map(row => [
      row.monthIndex,
      row.label,
      row.contribution.toFixed(2),
      row.totalInvested.toFixed(2),
      row.selicReturnMonthPct.toFixed(2),
      row.selicProfitMonthR$.toFixed(2),
      row.selicBalance.toFixed(2),
      row.stockReturnMonthPct.toFixed(2),
      row.stockProfitMonthR$.toFixed(2),
      row.stockBalance.toFixed(2),
      (row.stockBalance - row.selicBalance).toFixed(2)
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(r => r.join(';'))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `comparativo_selic_vs_${stockInfo.ticker}_${timeline.length - 1}m.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="table-card">
      <div className="table-header">
        <div className="table-title">
          <h3>Detalhamento Mês a Mês</h3>
          <p>Acompanhe os rendimentos e a evolução do patrimônio em cada período</p>
        </div>

        <div className="table-actions">
          <button type="button" className="action-btn" onClick={handleDownloadCsv}>
            <Download size={15} />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="financial-table">
          <thead>
            <tr>
              <th>Mês</th>
              <th>Aporte</th>
              <th>Total Investido</th>
              <th>Selic (%)</th>
              <th>Saldo Selic</th>
              <th>{stockInfo.ticker} (%)</th>
              <th>Saldo {stockInfo.ticker}</th>
              <th>Diferença</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row) => {
              const diff = row.stockBalance - row.selicBalance;
              return (
                <tr key={row.monthIndex}>
                  <td>
                    <strong>{row.label}</strong>
                    {row.monthIndex === 0 && <span style={{ fontSize: '0.72rem', color: '#818cf8', marginLeft: 6 }}>(Aporte Inicial)</span>}
                  </td>
                  <td>{formatCurrency(row.contribution)}</td>
                  <td>{formatCurrency(row.totalInvested)}</td>
                  <td style={{ color: '#34d399' }}>
                    {row.monthIndex === 0 ? '-' : formatPercent(row.selicReturnMonthPct)}
                  </td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(row.selicBalance)}</td>
                  <td style={{ color: row.stockReturnMonthPct >= 0 ? '#818cf8' : '#fb7185' }}>
                    {row.monthIndex === 0 ? '-' : formatPercent(row.stockReturnMonthPct)}
                  </td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(row.stockBalance)}</td>
                  <td style={{ color: diff >= 0 ? '#818cf8' : '#34d399', fontWeight: 600 }}>
                    {diff >= 0 ? `+${formatCurrency(diff)}` : `-${formatCurrency(Math.abs(diff))}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="table-pagination">
          <span>
            Mostrando {startIndex + 1} a {Math.min(startIndex + pageSize, timeline.length)} de {timeline.length} registros
          </span>

          <div className="pagination-controls">
            <button
              type="button"
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft size={14} style={{ display: 'inline' }} /> Anterior
            </button>
            <span style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#94a3b8' }}>
              Página {currentPage} de {totalPages}
            </span>
            <button
              type="button"
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              Próxima <ChevronRight size={14} style={{ display: 'inline' }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
