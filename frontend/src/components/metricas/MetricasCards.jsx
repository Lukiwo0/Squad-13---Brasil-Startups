import React from 'react';

const MetricasCards = ({ metricasData, dadosGerais }) => {
  const percentualGratuitos = dadosGerais.totalEventos > 0 ? 
    ((metricasData.dadosGerais.gratuitos / dadosGerais.totalEventos) * 100).toFixed(1) : '0';
  
  const percentualPagos = dadosGerais.totalEventos > 0 ? 
    ((metricasData.dadosGerais.pagos / dadosGerais.totalEventos) * 100).toFixed(1) : '0';

  return (
    <section className="secao-metricas">
      <h2>📈 Métricas Principais</h2>
      
      <div className="metricas-principais">
        <div className="card-metrica grande">
          <h3>Total de Eventos</h3>
          <div className="valor">{metricasData.dadosGerais.totalEventos}</div>
          <div className="descricao">eventos cadastrados no sistema</div>
          <div className="info-adicional">
            <span className="info-item">📅 {metricasData.dadosGerais.mediaMensal}/mês</span>
          </div>
        </div>
        
        <div className="card-metrica">
          <h3>Distribuição</h3>
          <div className="distribuicao-container">
            <div className="distribuicao-item">
              <span className="distribuicao-label">🎫 Total </span>
              <span className="distribuicao-valor">{metricasData.dadosGerais.pagos + metricasData.dadosGerais.gratuitos}</span>
            </div>
            <div className="distribuicao-item">
              <span className="distribuicao-label">💰 Pagos </span>
              <span className="distribuicao-valor">{metricasData.dadosGerais.pagos}</span>
              <span className="distribuicao-percentual">{percentualPagos}%</span>
            </div>
            <div className="distribuicao-item">
              <span className="distribuicao-label">🎁 Gratuitos </span>
              <span className="distribuicao-valor">{metricasData.dadosGerais.gratuitos}</span>
              <span className="distribuicao-percentual">{percentualGratuitos}%</span>
            </div>
          </div>
        </div>
        
        <div className="card-metrica">
          <h3>Taxa de Cancelamento</h3>
          <div className="valor">{metricasData.dadosGerais.taxaCancelamento}</div>
          <div className="descricao">{metricasData.dadosGerais.cancelados} eventos cancelados</div>
        </div>
        
        <div className="card-metrica">
          <h3>Região Principal</h3>
          <div className="valor">{metricasData.geolocalizacao.regioes[0]?.regiao}</div>
          <div className="descricao">{metricasData.geolocalizacao.regioes[0]?.percentual}% dos eventos</div>
        </div>
      </div>
    </section>
  );
};

export default MetricasCards;