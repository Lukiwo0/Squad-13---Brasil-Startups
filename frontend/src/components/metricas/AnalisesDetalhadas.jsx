import React from 'react';

const AnalisesDetalhadas = ({ metricasData, dadosGerais }) => {
  return (
    <section className="secao-metricas">
      <h2>🔍 Análises Detalhadas</h2>
      
      <div className="grid-duas-colunas">
        <div className="card-metrica">
          <h4>🏆 Top 5 Categorias</h4>
          <div className="lista-ranking">
            {metricasData.categorias.top5.map((categoria, index) => (
              <div key={categoria.categoria} className="item-ranking">
                <span className="posicao">{index + 1}</span>
                <span className="nome" title={categoria.categoria}>
                  {categoria.categoria}
                </span>
                <span className="valor">{categoria.quantidade}</span>
                <span className="percentual">
                  {((categoria.quantidade / dadosGerais.totalEventos) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card-metrica">
          <h4>📍 Top 5 Cidades</h4>
          <div className="lista-ranking">
            {metricasData.geolocalizacao.cidades.slice(0, 5).map((cidade, index) => (
              <div key={cidade.cidade} className="item-ranking">
                <span className="posicao">{index + 1}</span>
                <span className="nome" title={cidade.cidade}>
                  {cidade.cidade}
                </span>
                <span className="valor">{cidade.quantidade}</span>
                <span className="percentual">
                  {((cidade.quantidade / dadosGerais.totalEventos) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-duas-colunas">
        <div className="card-metrica">
          <h4>👥 Top Organizadores</h4>
          <div className="lista-simples">
            {metricasData.organizadores.top.map(([organizador, quantidade], index) => (
              <div key={organizador} className="item-lista">
                <span className="label" title={organizador}>
                  {organizador}
                </span>
                <span className="valor">{quantidade}</span>
                <span className="percentual">
                  {((quantidade / dadosGerais.totalEventos) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card-metrica">
          <h4>🌎 Distribuição por Região</h4>
          <div className="lista-simples">
            {metricasData.geolocalizacao.regioes
              .filter(regiao => !regiao.regiao.includes('Desconhecido') && !regiao.regiao.includes('Não informado'))
              .map(regiao => (
                <div key={regiao.regiao} className="item-lista">
                  <span className="label">{regiao.regiao}</span>
                  <div className="barra-container">
                    <div 
                      className="barra-progresso" 
                      style={{width: `${regiao.percentual}%`}}
                    ></div>
                  </div>
                  <span className="valor">{regiao.percentual}%</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalisesDetalhadas;