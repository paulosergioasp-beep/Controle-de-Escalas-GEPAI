import React, { useEffect } from 'react';
import { Trophy, ShieldCheck, TrendingUp, Award, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency, formatPercent } from '../utils/calculator.js';

export default function WinnerBanner({ comparison, stockInfo }) {
  const { winner, diffBalance, diffPercent, months, years, selic, stock } = comparison;

  useEffect(() => {
    if (winner === 'stock' && diffPercent > 10) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#38bdf8']
      });
    }
  }, [comparison.ticker, comparison.months, comparison.totalInvested, winner]);

  const isStockWinner = winner === 'stock';
  const periodText = years >= 1 ? `${years} ano${years > 1 ? 's' : ''}` : `${months} meses`;

  return (
    <div className={`verdict-banner ${isStockWinner ? 'verdict-winner-stock' : 'verdict-winner-selic'}`}>
      <div className="verdict-left">
        <div className={`trophy-box ${isStockWinner ? 'trophy-stock' : 'trophy-selic'}`}>
          {isStockWinner ? <Trophy size={32} /> : <ShieldCheck size={32} />}
        </div>
        <div className="verdict-text">
          <h2>
            {isStockWinner ? (
              <>
                <span>Vitória de {stockInfo.ticker}!</span>
                <span className="brand-badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
                  Superou a Selic
                </span>
              </>
            ) : winner === 'selic' ? (
              <>
                <span>Vitória da Taxa Selic!</span>
                <span className="brand-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                  Renda Fixa Vencedora
                </span>
              </>
            ) : (
              <span>Empate Técnico</span>
            )}
          </h2>
          <p>
            {isStockWinner ? (
              <>
                No período de <strong>{periodText}</strong>, investir em <strong>{stockInfo.ticker} ({stockInfo.name})</strong> gerou um patrimônio final de <strong>{formatCurrency(stock.finalBalance)}</strong> contra <strong>{formatCurrency(selic.finalBalance)}</strong> da Selic com juros compostos e dividendos reinvestidos.
              </>
            ) : winner === 'selic' ? (
              <>
                No período de <strong>{periodText}</strong>, a estabilidade e os juros compostos da <strong>Taxa Selic</strong> superaram a volatilidade de <strong>{stockInfo.ticker}</strong>, entregando <strong>{formatCurrency(selic.finalBalance)}</strong> acumulados vs <strong>{formatCurrency(stock.finalBalance)}</strong> na ação.
              </>
            ) : (
              <>
                Ambos os investimentos tiveram desempenhos praticamente idênticos na janela de <strong>{periodText}</strong>.
              </>
            )}
          </p>
        </div>
      </div>

      <div className="verdict-right">
        <span className="diff-amount-label">Diferença de Patrimônio</span>
        <span className={`diff-amount-value ${isStockWinner ? 'diff-amount-stock' : 'diff-amount-selic'}`}>
          +{formatCurrency(diffBalance)}
        </span>
        <span className={`diff-percentage-tag ${isStockWinner ? 'diff-percentage-stock' : 'diff-percentage-selic'}`}>
          {isStockWinner ? `+${diffPercent.toFixed(1)}% vs Selic` : `+${Math.abs(diffPercent).toFixed(1)}% vs Ação`}
        </span>
      </div>
    </div>
  );
}
