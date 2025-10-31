import React, { useState } from 'react';
import '../assets/styles/metricas.css';

const Metricas = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('6meses');

  // Dados mockados baseados nas informações do Sympla
  const metricasData = {
    eventos: {
      totalUltimos6Meses: 147,
      mediaMensal: 24.5,
      distribuicaoEstados: [
        { estado: 'SP', quantidade: 67, percentual: 45.6 },
        { estado: 'RJ', quantidade: 23, percentual: 15.6 },
        { estado: 'MG', quantidade: 18, percentual: 12.2 },
        { estado: 'RS', quantidade: 15, percentual: 10.2 },
        { estado: 'PR', quantidade: 12, percentual: 8.2 },
        { estado: 'DF', quantidade: 8, percentual: 5.4 },
        { estado: 'Outros', quantidade: 4, percentual: 2.7 }
      ],
      crescimento: 15.3,
      tiposCategorias: [
        { categoria: 'Tecnologia & Inovação', quantidade: 45 },
        { categoria: 'Negócios & Empreendedorismo', quantidade: 38 },
        { categoria: 'Agro', quantidade: 25 },
        { categoria: 'Educação', quantidade: 22 },
        { categoria: 'Saúde', quantidade: 17 }
      ],
      modalidade: [
        { tipo: 'Presencial', quantidade: 89, percentual: 60.5 },
        { tipo: 'Online', quantidade: 45, percentual: 30.6 },
        { tipo: 'Híbrido', quantidade: 13, percentual: 8.8 }
      ]
    },
    
    setoresEmergentes: {
      topTecnologias: [
        { tecnologia: 'Inteligência Artificial', eventos: 34, crescimento: 42 },
        { tecnologia: 'Agrotech', eventos: 25, crescimento: 38 },
        { tecnologia: 'IoT & Drones', eventos: 18, crescimento: 29 },
        { tecnologia: 'Realidade Aumentada/Virtual', eventos: 12, crescimento: 25 },
        { tecnologia: 'Blockchain', eventos: 8, crescimento: 18 }
      ],
      eventosPorPorte: [
        { porte: 'Pequeno (até 100 pessoas)', quantidade: 78 },
        { porte: 'Médio (100-500 pessoas)', quantidade: 45 },
        { porte: 'Grande (500+ pessoas)', quantidade: 24 }
      ]
    },
    
    geolocalizacao: {
      cidadesMaisAtivas: [
        { cidade: 'São Paulo', estado: 'SP', eventos: 45 },
        { cidade: 'Rio de Janeiro', estado: 'RJ', eventos: 23 },
        { cidade: 'Belo Horizonte', estado: 'MG', eventos: 18 },
        { cidade: 'Porto Alegre', estado: 'RS', eventos: 15 },
        { cidade: 'Curitiba', estado: 'PR', eventos: 12 },
        { cidade: 'Brasília', estado: 'DF', eventos: 8 }
      ],
      regioes: [
        { regiao: 'Sudeste', quantidade: 86, percentual: 58.5 },
        { regiao: 'Sul', quantidade: 27, percentual: 18.4 },
        { regiao: 'Centro-Oeste', quantidade: 18, percentual: 12.2 },
        { regiao: 'Nordeste', quantidade: 12, percentual: 8.2 },
        { regiao: 'Norte', quantidade: 4, percentual: 2.7 }
      ]
    },
    
    economicos: {
      distribuicaoPrecos: [
        { faixa: 'Gratuito', quantidade: 56, percentual: 38.1 },
        { faixa: 'Até R$ 50', quantidade: 45, percentual: 30.6 },
        { faixa: 'R$ 51 - R$ 200', quantidade: 32, percentual: 21.8 },
        { faixa: 'Acima de R$ 200', quantidade: 14, percentual: 9.5 }
      ],
      metodosPagamento: [
        { metodo: 'Cartão de Crédito', percentual: 78 },
        { metodo: 'PIX', percentual: 65 },
        { metodo: 'Boleto', percentual: 42 },
        { metodo: 'Apple Pay', percentual: 15 },
        { metodo: 'Google Pay', percentual: 8 }
      ]
    }
  };

  return (
    <div className="metricas-container">
      <div className="metricas-header">
        <h1>📊 Métricas do Ecossistema de Startups</h1>
        <p>Análises baseadas nos dados coletados do Sympla</p>
        
        <div className="filtros-periodo">
          <button 
            className={periodoSelecionado === '3meses' ? 'ativo' : ''}
            onClick={() => setPeriodoSelecionado('3meses')}
          >
            3 Meses
          </button>
          <button 
            className={periodoSelecionado === '6meses' ? 'ativo' : ''}
            onClick={() => setPeriodoSelecionado('6meses')}
          >
            6 Meses
          </button>
          <button 
            className={periodoSelecionado === '12meses' ? 'ativo' : ''}
            onClick={() => setPeriodoSelecionado('12meses')}
          >
            12 Meses
          </button>
        </div>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="metricas-principais">
        <div className="card-metrica grande">
          <h3>Total de Eventos</h3>
          <div className="valor">{metricasData.eventos.totalUltimos6Meses}</div>
          <div className="variacao positiva">+{metricasData.eventos.crescimento}% vs período anterior</div>
        </div>
        
        <div className="card-metrica">
          <h3>Média Mensal</h3>
          <div className="valor">{metricasData.eventos.mediaMensal}</div>
          <div className="descricao">eventos/mês</div>
        </div>
        
        <div className="card-metrica">
          <h3>Presencial vs Online</h3>
          <div className="valor">{metricasData.eventos.modalidade[0].percentual}%</div>
          <div className="descricao">eventos presenciais</div>
        </div>
        
        <div className="card-metrica">
          <h3>Eventos Gratuitos</h3>
          <div className="valor">{metricasData.economicos.distribuicaoPrecos[0].percentual}%</div>
          <div className="descricao">do total</div>
        </div>
      </div>

      {/* Seção de Distribuição Geográfica */}
      <section className="secao-metricas">
        <h2>📍 Distribuição Geográfica</h2>
        
        <div className="grid-duas-colunas">
          <div className="card-metrica">
            <h4>Estados com Mais Eventos</h4>
            <div className="lista-ranking">
              {metricasData.eventos.distribuicaoEstados.map((estado, index) => (
                <div key={estado.estado} className="item-ranking">
                  <span className="posicao">{index + 1}</span>
                  <span className="nome">{estado.estado}</span>
                  <span className="valor">{estado.quantidade}</span>
                  <span className="percentual">{estado.percentual}%</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card-metrica">
            <h4>Distribuição por Região</h4>
            <div className="lista-simples">
              {metricasData.geolocalizacao.regioes.map(regiao => (
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
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Categorias e Tecnologias */}
      <section className="secao-metricas">
        <h2>🚀 Setores em Alta</h2>
        
        <div className="grid-duas-colunas">
          <div className="card-metrica">
            <h4>Categorias Mais Populares</h4>
            <div className="lista-simples">
              {metricasData.eventos.tiposCategorias.map(categoria => (
                <div key={categoria.categoria} className="item-lista">
                  <span className="label">{categoria.categoria}</span>
                  <span className="valor">{categoria.quantidade} eventos</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card-metrica">
            <h4>Tecnologias Emergentes</h4>
            <div className="lista-simples">
              {metricasData.setoresEmergentes.topTecnologias.map(tech => (
                <div key={tech.tecnologia} className="item-lista">
                  <span className="label">{tech.tecnologia}</span>
                  <span className="valor">{tech.eventos} eventos</span>
                  <span className="variacao positiva">+{tech.crescimento}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Dados Econômicos */}
      <section className="secao-metricas">
        <h2>💳 Aspectos Econômicos</h2>
        
        <div className="grid-duas-colunas">
          <div className="card-metrica">
            <h4>Distribuição de Preços</h4>
            <div className="lista-simples">
              {metricasData.economicos.distribuicaoPrecos.map(faixa => (
                <div key={faixa.faixa} className="item-lista">
                  <span className="label">{faixa.faixa}</span>
                  <div className="barra-container">
                    <div 
                      className="barra-progresso" 
                      style={{width: `${faixa.percentual}%`}}
                    ></div>
                  </div>
                  <span className="valor">{faixa.percentual}%</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card-metrica">
            <h4>Métodos de Pagamento Mais Usados</h4>
            <div className="lista-simples">
              {metricasData.economicos.metodosPagamento.map(metodo => (
                <div key={metodo.metodo} className="item-lista">
                  <span className="label">{metodo.metodo}</span>
                  <div className="barra-container">
                    <div 
                      className="barra-progresso" 
                      style={{width: `${metodo.percentual}%`}}
                    ></div>
                  </div>
                  <span className="valor">{metodo.percentual}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Insights */}
      <section className="secao-metricas">
        <h2>💡 Insights e Tendências</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>🎯 Tendência Principal</h4>
            <p>Eventos de <strong>Inteligência Artificial</strong> apresentam o maior crescimento (+42%) no último semestre</p>
          </div>
          <div className="insight-card">
            <h4>📍 Concentração Geográfica</h4>
            <p><strong>Sudeste</strong> concentra 58.5% de todos os eventos de startups no Brasil</p>
          </div>
          <div className="insight-card">
            <h4>💰 Acessibilidade</h4>
            <p>38.1% dos eventos são <strong>gratuitos</strong>, facilitando o acesso ao ecossistema</p>
          </div>
          <div className="insight-card">
            <h4>🏙️ Modalidade</h4>
            <p>Eventos <strong>presenciais</strong> ainda predominam (60.5%), mas os online crescem rapidamente</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Metricas;