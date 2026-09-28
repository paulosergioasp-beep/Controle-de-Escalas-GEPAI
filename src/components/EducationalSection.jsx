import React from 'react';
import { BookOpen, ShieldAlert, Sparkles, Scale, Info } from 'lucide-react';

export default function EducationalSection() {
  return (
    <div className="insights-grid">
      <div className="insight-card">
        <h4>
          <Scale size={18} color="#818cf8" />
          Renda Fixa vs Renda Variável
        </h4>
        <p>
          A taxa Selic representa o juro básico da economia e referência para o CDI. Ela oferece previsibilidade e nunca tem rentabilidade nominal negativa em prazos mensais. Já as ações oscilam bastante no curto prazo, mas historicamente oferecem prêmio de risco e ganho real acima da inflação no longo prazo.
        </p>
      </div>

      <div className="insight-card">
        <h4>
          <Sparkles size={18} color="#34d399" />
          O Poder dos Dividendos Reinvestidos
        </h4>
        <p>
          Nas ações (como Petrobras, Vale, Itaú e Taesa), grande parte do retorno total acumulado decorre dos proventos (dividendos e JCP) reinvestidos para comprar mais ações a cada mês. Isso acelera o efeito "bola de neve" dos juros compostos.
        </p>
      </div>

      <div className="insight-card">
        <h4>
          <ShieldAlert size={18} color="#f59e0b" />
          Tributação (Imposto de Renda)
        </h4>
        <p>
          A renda fixa segue a tabela regressiva de IR (22,5% até 6 meses, 20% até 1 ano, 17,5% até 2 anos e 15% acima de 2 anos sobre o lucro). Ações são tributadas em 15% sobre o ganho de capital, com isenção mensal para vendas totais de até R$ 20.000,00 para pessoa física.
        </p>
      </div>
    </div>
  );
}
