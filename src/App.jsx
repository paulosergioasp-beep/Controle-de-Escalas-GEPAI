import React, { useState, useMemo } from 'react';
import Header from './components/Header.jsx';
import ControlsSection from './components/ControlsSection.jsx';
import WinnerBanner from './components/WinnerBanner.jsx';
import KpiCards from './components/KpiCards.jsx';
import ChartSection from './components/ChartSection.jsx';
import DataTable from './components/DataTable.jsx';
import EducationalSection from './components/EducationalSection.jsx';
import { AVAILABLE_STOCKS } from './data/stocksData.js';
import { calculateComparison } from './utils/calculator.js';
import './App.css';

export default function App() {
  // Parâmetros principais com padrões especificados pelo usuário
  const [selectedTicker, setSelectedTicker] = useState('PETR4');
  const [selectedHorizon, setSelectedHorizon] = useState(24); // 24 meses (2 anos) padrão
  const [initialAmount, setInitialAmount] = useState(10000); // R$ 10.000 padrão
  const [monthlyAmount, setMonthlyAmount] = useState(500); // R$ 500 padrão

  // Modo de simulação customizada
  const [isCustomSimulation, setIsCustomSimulation] = useState(false);
  const [customSelicAnnual, setCustomSelicAnnual] = useState(10.75); // 10.75% a.a.
  const [customStockAnnual, setCustomStockAnnual] = useState(15.0); // 15.0% a.a.

  // Informações da ação selecionada
  const stockInfo = useMemo(() => {
    return AVAILABLE_STOCKS.find(s => s.ticker === selectedTicker) || AVAILABLE_STOCKS[0];
  }, [selectedTicker]);

  // Cálculo da simulação financeira
  const comparison = useMemo(() => {
    return calculateComparison({
      ticker: selectedTicker,
      horizonMonths: selectedHorizon,
      initialAmount,
      monthlyAmount,
      isCustomSimulation,
      customSelicAnnual,
      customStockAnnual
    });
  }, [
    selectedTicker,
    selectedHorizon,
    initialAmount,
    monthlyAmount,
    isCustomSimulation,
    customSelicAnnual,
    customStockAnnual
  ]);

  return (
    <div className="container">
      <Header />

      <main>
        {/* Painel de Controles e Seleção */}
        <ControlsSection
          selectedTicker={selectedTicker}
          setSelectedTicker={setSelectedTicker}
          selectedHorizon={selectedHorizon}
          setSelectedHorizon={setSelectedHorizon}
          initialAmount={initialAmount}
          setInitialAmount={setInitialAmount}
          monthlyAmount={monthlyAmount}
          setMonthlyAmount={setMonthlyAmount}
          isCustomSimulation={isCustomSimulation}
          setIsCustomSimulation={setIsCustomSimulation}
          customSelicAnnual={customSelicAnnual}
          setCustomSelicAnnual={setCustomSelicAnnual}
          customStockAnnual={customStockAnnual}
          setCustomStockAnnual={setCustomStockAnnual}
        />

        {/* Banner Vencedor e Destaque da Simulação */}
        <WinnerBanner
          comparison={comparison}
          stockInfo={stockInfo}
        />

        {/* Cards de Resumo e Métricas (KPIs) */}
        <KpiCards
          comparison={comparison}
          stockInfo={stockInfo}
          initialAmount={initialAmount}
          monthlyAmount={monthlyAmount}
        />

        {/* Gráfico Interativo com Linhas e Gradiente */}
        <ChartSection
          timeline={comparison.timeline}
          stockInfo={stockInfo}
          isCustomSimulation={isCustomSimulation}
        />

        {/* Tabela de Detalhamento Mês a Mês com Exportação CSV */}
        <DataTable
          timeline={comparison.timeline}
          stockInfo={stockInfo}
        />

        {/* Seção Educacional e Contextualização Financeira */}
        <EducationalSection />
      </main>

      <footer className="app-footer">
        <p>
          Comparador Selic vs Ações B3 &bull; Simulador para fins educacionais e de análise histórica. Retornos passados não garantem rentabilidade futura.
        </p>
      </footer>
    </div>
  );
}
