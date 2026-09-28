import React from 'react';
import { TrendingUp, Landmark, ShieldCheck, Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="app-header">
      <div className="logo-wrapper">
        <div className="logo-icon-box">
          <TrendingUp size={28} />
        </div>
        <div className="brand-text">
          <h1>
            Selic vs Ações
            <span className="brand-badge">B3 & CDI</span>
          </h1>
          <p>Comparador de Rentabilidade Histórica com Aportes Mensais e Juros Compostos</p>
        </div>
      </div>

      <div className="header-badges">
        <div className="data-source-pill">
          <span className="pulse-dot"></span>
          <span>Dados Consolidados B3 & Bacen</span>
        </div>
      </div>
    </header>
  );
}
