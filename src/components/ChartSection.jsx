import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { BarChart3, TrendingUp, Layers } from 'lucide-react';
import { formatCurrency } from '../utils/calculator.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ChartSection({ timeline, stockInfo, isCustomSimulation }) {
  const [chartMode, setChartMode] = useState('balance'); // 'balance' | 'profit'

  const labels = timeline.map(point => point.label);
  const investedData = timeline.map(point => point.totalInvested);
  const selicData = timeline.map(point => 
    chartMode === 'balance' ? point.selicBalance : point.selicCumulativeProfit
  );
  const stockData = timeline.map(point => 
    chartMode === 'balance' ? point.stockBalance : point.stockCumulativeProfit
  );

  const data = {
    labels,
    datasets: [
      {
        label: `${stockInfo.ticker} (${stockInfo.name})`,
        data: stockData,
        borderColor: '#818cf8',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 350);
          gradient.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.3,
        borderWidth: 2.5,
        pointRadius: timeline.length > 36 ? 0 : 3,
        pointHoverRadius: 6,
        pointBackgroundColor: '#818cf8'
      },
      {
        label: 'Taxa Selic (CDI Acumulado)',
        data: selicData,
        borderColor: '#34d399',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 350);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.3,
        borderWidth: 2.5,
        pointRadius: timeline.length > 36 ? 0 : 3,
        pointHoverRadius: 6,
        pointBackgroundColor: '#34d399'
      },
      ...(chartMode === 'balance' ? [
        {
          label: 'Total Investido (Aportes)',
          data: investedData,
          borderColor: '#64748b',
          borderDash: [6, 6],
          fill: false,
          tension: 0,
          borderWidth: 1.8,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointBackgroundColor: '#64748b'
        }
      ] : [])
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: false // Usamos nossa própria legenda estilizada
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          family: 'Outfit, sans-serif',
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          family: 'Plus Jakarta Sans, sans-serif',
          size: 12
        },
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
          drawBorder: false
        },
        ticks: {
          color: '#64748b',
          font: { size: 11 },
          maxRotation: 45,
          minRotation: 0,
          maxTicksLimit: 14
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#64748b',
          font: { size: 11 },
          callback: function (value) {
            if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `R$ ${(value / 1000).toFixed(0)}k`;
            return `R$ ${value}`;
          }
        }
      }
    }
  };

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div className="chart-title-box">
          <h3>
            {chartMode === 'balance' ? 'Evolução do Patrimônio Acumulado' : 'Lucro Acumulado Mês a Mês'}
          </h3>
          <p>
            Curva comparativa de crescimento com aportes mensais e reinvestimento
          </p>
        </div>

        <div className="chart-controls">
          <div className="mode-toggle">
            <button
              type="button"
              className={`mode-btn ${chartMode === 'balance' ? 'active' : ''}`}
              onClick={() => setChartMode('balance')}
            >
              Patrimônio Total
            </button>
            <button
              type="button"
              className={`mode-btn ${chartMode === 'profit' ? 'active' : ''}`}
              onClick={() => setChartMode('profit')}
            >
              Lucro Bruto
            </button>
          </div>
        </div>
      </div>

      <div className="chart-canvas-wrapper">
        <Line data={data} options={options} />
      </div>

      <div className="chart-legend-custom">
        <div className="legend-item">
          <span className="legend-color-dot" style={{ background: '#818cf8' }}></span>
          <span>{stockInfo.ticker} ({stockInfo.name})</span>
        </div>
        <div className="legend-item">
          <span className="legend-color-dot" style={{ background: '#34d399' }}></span>
          <span>Taxa Selic (CDI)</span>
        </div>
        {chartMode === 'balance' && (
          <div className="legend-item">
            <span className="legend-color-dot" style={{ background: '#64748b' }}></span>
            <span>Total Investido</span>
          </div>
        )}
      </div>
    </div>
  );
}
