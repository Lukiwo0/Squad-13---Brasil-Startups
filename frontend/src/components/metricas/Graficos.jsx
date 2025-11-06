import React, { useState } from 'react';

// Componente de Gráfico de Barras Horizontal
const GraficoBarras = ({ dados, titulo, cor = '#007bff', mostrarPercentual = true }) => {
  const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });
  const maxValor = Math.max(...dados.map(item => item.quantidade));

  const handleBarHover = (event, item, percentualTotal) => {
    setTooltip({
      visible: true,
      content: `${item.categoria || item.estado || item.tipo || item.cidade}: ${item.quantidade} eventos (${percentualTotal}%)`,
      x: event.clientX,
      y: event.clientY
    });
  };

  const handleBarLeave = () => {
    setTooltip({ visible: false, content: '', x: 0, y: 0 });
  };

  return (
    <div className="grafico-container">
      <h4>{titulo}</h4>
      <div className="grafico-barras">
        {dados.map((item, index) => {
          const percentual = maxValor > 0 ? (item.quantidade / maxValor) * 100 : 0;
          const percentualTotal = item.percentual || ((item.quantidade / dados.reduce((sum, i) => sum + i.quantidade, 0)) * 100).toFixed(1);
          const texto = item.categoria || item.estado || item.tipo || item.cidade;

          return (
            <div key={index} className="barra-item">
              <div className="barra-label">
                <span
                  className="label-text"
                  title={texto}
                >
                  {texto}
                </span>
                <span className="label-valor">{item.quantidade}</span>
              </div>
              <div
                className="barra-wrapper"
                onMouseMove={(e) => handleBarHover(e, item, percentualTotal)}
                onMouseLeave={handleBarLeave}
              >
                <div
                  className="barra"
                  style={{
                    width: `${percentual}%`,
                    backgroundColor: cor
                  }}
                >
                  {mostrarPercentual && percentual > 20 && (
                    <span className="barra-texto">{percentualTotal}%</span>
                  )}
                </div>
                {mostrarPercentual && percentual <= 20 && (
                  <span className="barra-texto-externo">{percentualTotal}%</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {tooltip.visible && (
        <div
          className="barra-tooltip"
          style={{
            left: `${tooltip.x + 15}px`,
            top: `${tooltip.y - 40}px`
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

// Componente de Gráfico de Pizza 
const GraficoPizza = ({ dados, titulo }) => {
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const total = dados?.reduce((sum, item) => sum + (item.quantidade || 0), 0) || 0;

  const cores = {
    'Pagos': '#007bff',
    'Gratuitos': '#28a745',
    'default': ['#007bff', '#28a745', '#dc3545', '#ffc107', '#6f42c1', '#e83e8c']
  };

  if (!dados || dados.length === 0 || total === 0) {
    return (
      <div className="grafico-container">
        <h4>{titulo}</h4>
        <div className="grafico-vazio">
          <p>Nenhum dado disponível para exibição</p>
        </div>
      </div>
    );
  }

  // Calcular as fatias
  const slices = [];
  let startAngle = 0;
  const radius = 80;
  const center = 90;

  dados.forEach((item, index) => {
    const percentual = total > 0 ? (item.quantidade / total) * 100 : 0;
    if (percentual > 0) {
      const angle = (percentual * 360) / 100;
      const endAngle = startAngle + angle;

      // Converter para coordenadas SVG
      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;

      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      slices.push({
        ...item,
        percentual,
        pathData,
        cor: cores[item.tipo] || cores.default[index % cores.default.length],
        index,
        startAngle,
        endAngle
      });

      startAngle = endAngle;
    }
  });

  return (
    <div className="grafico-container">
      <h4>{titulo}</h4>
      <div className="grafico-pizza">
        <div className="pizza-chart-svg">
          <svg width="180" height="180" viewBox="0 0 180 180">
            {slices.map((slice) => (
              <path
                key={slice.index}
                d={slice.pathData}
                fill={slice.cor}
                className={`pizza-slice-svg ${hoveredSlice === slice.index ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredSlice(slice.index)}
                onMouseLeave={() => setHoveredSlice(null)}
              />
            ))}
            <circle cx="90" cy="90" r="40" fill="white" className="pizza-centro-svg" />
          </svg>
          <div className="pizza-centro-texto">
            <span className="pizza-total">{total}</span>
            <span className="pizza-label">Total</span>
          </div>
        </div>

        <div className="pizza-legend">
          {slices.map((slice, index) => (
            <div
              key={index}
              className="legend-item"
              onMouseEnter={() => setHoveredSlice(slice.index)}
              onMouseLeave={() => setHoveredSlice(null)}
            >
              <span
                className="legend-color"
                style={{ backgroundColor: slice.cor }}
              />
              <span className="legend-label">
                {slice.tipo}
              </span>
              <span className="legend-value">
                {slice.percentual.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente de Evolução Mensal (simulado)
const GraficoEvolucaoMensal = ({ titulo, eventosPorMes }) => {
  // Se não houver dados da API, não mostrar o gráfico
  if (!eventosPorMes || Object.keys(eventosPorMes).length === 0) {
    return (
      <div className="grafico-container full-width">
        <h4>{titulo}</h4>
        <div className="grafico-vazio">
          <p>Dados de evolução mensal não disponíveis</p>
        </div>
      </div>
    );
  }

  // Converter os dados da API para o formato necessário
  const meses = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  const dadosMensais = meses.map((mesNome, index) => {
    const mesNumero = index + 1;
    return {
      mes: mesNome,
      eventos: eventosPorMes[mesNumero] || 0
    };
  });

  const maxEventos = Math.max(...dadosMensais.map(item => item.eventos));
  const minEventos = Math.min(...dadosMensais.map(item => item.eventos));
  const totalEventos = dadosMensais.reduce((sum, item) => sum + item.eventos, 0);
  const mediaMensal = (totalEventos / dadosMensais.filter(item => item.eventos > 0).length) || 0;

  // Encontrar pico e vale
  const pico = dadosMensais.reduce((max, item) => item.eventos > max.eventos ? item : max, dadosMensais[0]);
  const vale = dadosMensais.reduce((min, item) => item.eventos < min.eventos ? item : min, dadosMensais[0]);

  return (
    <div className="grafico-container full-width">
      <h4>{titulo}</h4>
      <div className="grafico-evolucao-simples">
        <div className="evolucao-header">
          <div className="evolucao-total">Total: {totalEventos} eventos</div>
          <div className="evolucao-media">Média: {mediaMensal.toFixed(1)}/mês</div>
        </div>

        <div className="evolucao-barras">
          {dadosMensais.map((mes, index) => {
            const altura = maxEventos > 0 ? ((mes.eventos / maxEventos) * 100) : 0;

            return (
              <div key={mes.mes} className="mes-item">
                <div
                  className="mes-barra"
                  style={{ height: `${altura}%` }}
                  title={`${mes.mes}: ${mes.eventos} eventos`}
                >
                  {mes.eventos > 0 && (
                    <span className="mes-valor">{mes.eventos}</span>
                  )}
                </div>
                <div className="mes-label">{mes.mes}</div>
              </div>
            );
          })}
        </div>

        <div className="evolucao-tendencias">
          <div className="tendencia-item">
            <span className="tendencia-label">📈 Pico:</span>
            <span className="tendencia-valor">{pico.mes} ({pico.eventos} eventos)</span>
          </div>
          <div className="tendencia-item">
            <span className="tendencia-label">📉 Vale:</span>
            <span className="tendencia-valor">{vale.mes} ({vale.eventos} eventos)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardGraficos = ({ dadosGraficos, eventosPorMes }) => {
  if (!dadosGraficos) return null;

  return (
    <section className="secao-metricas">
      <h2>📊 Dashboard Visual</h2>

      <div className="grid-graficos">
        <GraficoBarras
          dados={dadosGraficos.categorias}
          titulo="📈 Top Categorias"
          cor="#007bff"
          mostrarPercentual={true}
        />

        <GraficoPizza
          dados={dadosGraficos.tiposPagamento}
          titulo="💰 Distribuição por Tipo"
        />

        <GraficoBarras
          dados={dadosGraficos.estados}
          titulo="📍 Top Estados"
          cor="#28a745"
          mostrarPercentual={true}
        />
      </div>

      <div className="grafico-full-width">
        <GraficoEvolucaoMensal
          titulo="📅 Evolução Mensal de Eventos"
          eventosPorMes={eventosPorMes}
        />
      </div>
    </section>
  );
};


export default DashboardGraficos;