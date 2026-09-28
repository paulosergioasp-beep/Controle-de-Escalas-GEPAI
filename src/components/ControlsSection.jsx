import React, { useState, useRef, useEffect } from 'react';
import { 
  SlidersHorizontal, 
  ChevronDown, 
  Search, 
  Calendar, 
  Wallet, 
  PiggyBank, 
  Sparkles,
  Flame,
  Mountain,
  Building2,
  Landmark,
  Cpu,
  Building,
  Zap,
  TrendingUp,
  Beer,
  Car,
  Shield,
  Sun,
  ShoppingBag,
  Shirt,
  PlusCircle
} from 'lucide-react';
import { AVAILABLE_STOCKS, HORIZONS } from '../data/stocksData.js';

// Mapeamento de ícones dinâmicos
const ICON_MAP = {
  Flame,
  Mountain,
  Building2,
  Landmark,
  Cpu,
  Building,
  Zap,
  TrendingUp,
  Beer,
  Car,
  Shield,
  Sun,
  ShoppingBag,
  Shirt,
  PlusCircle
};

export default function ControlsSection({
  selectedTicker,
  setSelectedTicker,
  selectedHorizon,
  setSelectedHorizon,
  initialAmount,
  setInitialAmount,
  monthlyAmount,
  setMonthlyAmount,
  isCustomSimulation,
  setIsCustomSimulation,
  customSelicAnnual,
  setCustomSelicAnnual,
  customStockAnnual,
  setCustomStockAnnual
}) {
  const [isStockDropdownOpen, setIsStockDropdownOpen] = useState(false);
  const [stockSearch, setStockSearch] = useState('');
  const dropdownRef = useRef(null);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsStockDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentStock = AVAILABLE_STOCKS.find(s => s.ticker === selectedTicker) || AVAILABLE_STOCKS[0];
  const IconComponent = ICON_MAP[currentStock.icon] || TrendingUp;

  const filteredStocks = AVAILABLE_STOCKS.filter(s => 
    s.ticker.toLowerCase().includes(stockSearch.toLowerCase()) ||
    s.name.toLowerCase().includes(stockSearch.toLowerCase()) ||
    s.sector.toLowerCase().includes(stockSearch.toLowerCase())
  );

  const initialPresets = [1000, 5000, 10000, 50000];
  const monthlyPresets = [200, 500, 1000, 2500];
  const popularTickers = ['PETR4', 'VALE3', 'ITUB4', 'BBAS3', 'WEGE3', 'PRIO3', 'TAEE11', 'MGLU3'];

  return (
    <section className="controls-card">
      <div className="controls-header">
        <div className="controls-title">
          <SlidersHorizontal size={20} color="#818cf8" />
          <span>Configuração da Simulação</span>
        </div>
        <div className="mode-toggle">
          <button
            type="button"
            className={`mode-btn ${!isCustomSimulation ? 'active' : ''}`}
            onClick={() => setIsCustomSimulation(false)}
          >
            Histórico Real B3
          </button>
          <button
            type="button"
            className={`mode-btn ${isCustomSimulation ? 'active' : ''}`}
            onClick={() => setIsCustomSimulation(true)}
          >
            <Sparkles size={13} style={{ display: 'inline', marginRight: 4 }} />
            Projeção Futura
          </button>
        </div>
      </div>

      <div className="controls-grid">
        {/* Seleção de Ação */}
        <div className="control-group" ref={dropdownRef}>
          <div className="control-label">
            <span>Ação da Bolsa (B3)</span>
            <span className="label-hint">Selecione ou busque</span>
          </div>

          <div className="stock-selector-container">
            <button
              type="button"
              className="stock-custom-select"
              onClick={() => setIsStockDropdownOpen(!isStockDropdownOpen)}
              aria-expanded={isStockDropdownOpen}
            >
              <div className="stock-active-item">
                <span className="ticker-pill">{currentStock.ticker}</span>
                <span className="stock-name-text">{currentStock.name}</span>
              </div>
              <ChevronDown size={18} color="#94a3b8" />
            </button>

            {isStockDropdownOpen && (
              <div className="stock-dropdown-menu">
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Buscar por código ou nome..."
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    className="stock-search-input"
                    autoFocus
                  />
                  <Search size={14} color="#64748b" style={{ position: 'absolute', right: 10, top: 10 }} />
                </div>

                {filteredStocks.map(stock => {
                  const ItemIcon = ICON_MAP[stock.icon] || TrendingUp;
                  return (
                    <div
                      key={stock.ticker}
                      className={`stock-option-row ${stock.ticker === selectedTicker ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedTicker(stock.ticker);
                        setIsStockDropdownOpen(false);
                        setStockSearch('');
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ItemIcon size={16} color={stock.color || '#818cf8'} />
                        <span style={{ fontWeight: 700, color: '#f8fafc' }}>{stock.ticker}</span>
                        <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{stock.name}</span>
                      </div>
                      <span className="stock-sector-tag">{stock.sector}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Seleção de Janela / Intervalo */}
        <div className="control-group">
          <div className="control-label">
            <span>Janela de Tempo</span>
            <span className="label-hint">Período retroativo</span>
          </div>

          <div className="horizon-buttons-grid">
            {HORIZONS.map(h => (
              <button
                key={h.id}
                type="button"
                className={`horizon-btn ${selectedHorizon === h.months ? 'active' : ''}`}
                onClick={() => setSelectedHorizon(h.months)}
              >
                <span className="horizon-title">{h.label}</span>
                <span className="horizon-subtitle">{h.months} meses</span>
              </button>
            ))}
          </div>
        </div>

        {/* Aplicação Inicial */}
        <div className="control-group">
          <div className="control-label">
            <span>Aplicação Inicial</span>
            <span className="label-hint">Valor único no mês 0</span>
          </div>

          <div className="input-with-icon">
            <span className="input-currency-symbol">R$</span>
            <input
              type="number"
              min="0"
              step="500"
              value={initialAmount}
              onChange={(e) => setInitialAmount(Math.max(0, Number(e.target.value) || 0))}
              className="currency-input"
            />
          </div>

          <div className="preset-chips">
            {initialPresets.map(preset => (
              <button
                key={preset}
                type="button"
                className="preset-chip"
                onClick={() => setInitialAmount(preset)}
              >
                R$ {preset.toLocaleString('pt-BR')}
              </button>
            ))}
          </div>
        </div>

        {/* Aporte Mensal */}
        <div className="control-group">
          <div className="control-label">
            <span>Aporte Mensal</span>
            <span className="label-hint">Investimento recorrente</span>
          </div>

          <div className="input-with-icon">
            <span className="input-currency-symbol">R$</span>
            <input
              type="number"
              min="0"
              step="100"
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(Math.max(0, Number(e.target.value) || 0))}
              className="currency-input"
            />
          </div>

          <div className="preset-chips">
            {monthlyPresets.map(preset => (
              <button
                key={preset}
                type="button"
                className="preset-chip"
                onClick={() => setMonthlyAmount(preset)}
              >
                R$ {preset.toLocaleString('pt-BR')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ações Mais Populares (Quick Chips) */}
      <div className="quick-stocks-row">
        <span className="quick-stocks-label">Atalhos rápidos:</span>
        {popularTickers.map(ticker => (
          <button
            key={ticker}
            type="button"
            className={`quick-stock-btn ${ticker === selectedTicker ? 'active' : ''}`}
            onClick={() => setSelectedTicker(ticker)}
          >
            {ticker}
          </button>
        ))}
      </div>

      {/* Gaveta de Simulação Customizada */}
      {isCustomSimulation && (
        <div className="simulation-drawer">
          <div className="control-group">
            <div className="control-label">
              <span>Taxa Selic Projetada (% a.a.)</span>
              <span className="label-hint">Taxa média anual esperada</span>
            </div>
            <div className="input-with-icon">
              <span className="input-currency-symbol">%</span>
              <input
                type="number"
                step="0.25"
                value={customSelicAnnual}
                onChange={(e) => setCustomSelicAnnual(Number(e.target.value))}
                className="currency-input"
              />
            </div>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>Retorno Esperado da Ação (% a.a.)</span>
              <span className="label-hint">Valorização + Dividend Yield</span>
            </div>
            <div className="input-with-icon">
              <span className="input-currency-symbol">%</span>
              <input
                type="number"
                step="0.5"
                value={customStockAnnual}
                onChange={(e) => setCustomStockAnnual(Number(e.target.value))}
                className="currency-input"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
