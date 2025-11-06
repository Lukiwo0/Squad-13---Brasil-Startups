import React, { useState, useEffect } from 'react';

const RelatoriosInvestidores = ({ metricasData, dadosGerais }) => {
  const [showExplicacao, setShowExplicacao] = useState(false);

  // Verificar se os dados existem
  if (!metricasData || !metricasData.geolocalizacao || !metricasData.dadosGerais) {
    return (
      <section className="secao-metricas">
        <h2>💼 Relatório para Investidores</h2>
        <div className="erro-carregamento">
          <p>Dados não disponíveis para o relatório</p>
        </div>
      </section>
    );
  }

  // Filtrar regiões conhecidas com fallback seguro
  const regioesConhecidas = (metricasData.geolocalizacao.regioes || []).filter(
    regiao => regiao &&
      !regiao.regiao?.includes('Desconhecido') &&
      !regiao.regiao?.includes('Não informado') &&
      !regiao.regiao?.includes('Outros')
  );

  const regiaoPrincipal = regioesConhecidas[0];
  const segundaRegiao = regioesConhecidas[1];
  // const terceiraRegiao = regioesConhecidas[2];

  // Calcular métricas reais com fallbacks
  const crescimentoMensal = metricasData.dadosGerais.mediaMensal ?
    parseFloat(metricasData.dadosGerais.mediaMensal).toFixed(1) : '0.0';

  const diversificacaoGeografica = regioesConhecidas.length;

  const taxaEngajamento = metricasData.dadosGerais.totalEventos > 0 ?
    ((metricasData.dadosGerais.gratuitos / metricasData.dadosGerais.totalEventos) * 100).toFixed(1) : '0.0';

  const estabilidade = metricasData.dadosGerais.taxaCancelamento ?
    (100 - parseFloat(metricasData.dadosGerais.taxaCancelamento)).toFixed(1) : '100.0';

  return (
    <section className="secao-metricas">
      {/* <h2>💼 Relatório para Investidores</h2> */}
      <div className="relatorio-header-with-button">
        <h2>💼 Relatório para Investidores

          <button
            className="btn-explicacao"
            onClick={() => setShowExplicacao(!showExplicacao)}
          >
            📊 Como é calculado?
          </button>
        </h2>

      </div>

      {/* Modal de Explicação */}
      {showExplicacao && (
        <div className="explicacao-modal">
          <div className="explicacao-content">
            <h3>📈 Metodologia do Relatório</h3>
            <div className="explicacao-grid">
              <div className="explicacao-item">
                <h4>📊 Crescimento Mensal</h4>
                <p>Média real de eventos criados por mês na plataforma. Indica a capacidade de geração contínua de conteúdo.</p>
              </div>
              <div className="explicacao-item">
                <h4>🎯 Taxa de Engajamento</h4>
                <p>Percentual de eventos gratuitos vs totais. Alta taxa indica forte potencial de captação de usuários. Baixa taxa indica forte foco em monetização</p>
              </div>
              <div className="explicacao-item">
                <h4>⚖️ Estabilidade</h4>
                <p>Inverso da taxa de cancelamento. Mostra a retenção e saúde da base de eventos na plataforma.</p>
              </div>
              <div className="explicacao-item">
                <h4>🌎 Diversificação Regional</h4>
                <p>Número de regiões com presença ativa. Maior diversificação = menor dependência de um único mercado.</p>
              </div>
            </div>
            <button
              className="btn-fechar"
              onClick={() => setShowExplicacao(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <div className="relatorio-investidores">
        <div className="relatorio-header">
          <div className="relatorio-info">
            <div className="relatorio-titulo">Relatório de Performance</div>
            <div className="relatorio-periodo">Análise Consolidada</div>
          </div>
          <div className="relatorio-total">
            {metricasData.dadosGerais.totalEventos || 0} Eventos
          </div>
        </div>

        <div className="resumo-executivo">
          <h4>📋 Resumo Executivo</h4>
          <div className="resumo-content">
            <p>
              Plataforma com <strong>{metricasData.dadosGerais.totalEventos || 0} eventos cadastrados</strong>,
              gerando em média <strong>{crescimentoMensal} novos eventos por mês</strong>.
              Atuação em <strong>{diversificacaoGeografica} regiões</strong>
              {regiaoPrincipal && (
                <> com concentração em <strong>{regiaoPrincipal.regiao}</strong> ({regiaoPrincipal.percentual}% dos eventos)</>
              )}.
            </p>
            <p>
              <strong>Modelo equilibrado:</strong> {taxaEngajamento}% de eventos gratuitos para atrair usuários
              e {metricasData.dadosGerais.pagos || 0} eventos pagos como base de monetização.
            </p>
          </div>
        </div>

        <div className="relatorio-content">
          <div className="metricas-chave">
            <h4>📊 Indicadores de Performance</h4>
            <div className="indicadores-grid">
              <div className="indicador-card">
                <div className="indicador-valor">{crescimentoMensal}</div>
                <div className="indicador-label">Eventos/Mês</div>
                <div className="indicador-descricao">Média de novos eventos mensais</div>
              </div>
              <div className="indicador-card">
                <div className="indicador-valor">{diversificacaoGeografica}</div>
                <div className="indicador-label">Regiões</div>
                <div className="indicador-descricao">Diversificação geográfica</div>
              </div>
              <div className="indicador-card">
                <div className="indicador-valor">{taxaEngajamento}%</div>
                <div className="indicador-label">Engajamento</div>
                <div className="indicador-descricao">Eventos gratuitos (captação)</div>
              </div>
              <div className="indicador-card">
                <div className="indicador-valor">{estabilidade}%</div>
                <div className="indicador-label">Estabilidade</div>
                <div className="indicador-descricao">Retenção de eventos</div>
              </div>
            </div>
          </div>

          <div className="oportunidades">
            <h4>🎯 Oportunidades Estratégicas</h4>
            <div className="oportunidades-lista">
              <div className="oportunidade-item destaque">
                <strong>Expansão de Mercado:</strong> {segundaRegiao ? `Crescer na região ${segundaRegiao.regiao}` : 'Explorar novas regiões'} para reduzir dependência regional
              </div>
              <div className="oportunidade-item">
                <strong>Monetização da Base:</strong> Desenvolver features premium para os {metricasData.dadosGerais.pagos || 0} eventos pagos existentes
              </div>
              <div className="oportunidade-item">
                <strong>Conversão de Usuários:</strong> Transformar parte dos {metricasData.dadosGerais.gratuitos || 0} eventos gratuitos em receita
              </div>
            </div>
          </div>
        </div>

        <div className="analise-mercado">
          <h4>🏢 Análise de Mercado</h4>
          <div className="mercado-grid">
            <div className="mercado-item">
              <h5>📍 Cobertura Regional Atual</h5>
              <div className="cobertura-lista">
                {regioesConhecidas.slice(0, 3).map((regiao, index) => (
                  <div key={regiao.regiao} className="cobertura-item">
                    <span className="cobertura-posicao">{index + 1}º</span>
                    <span className="cobertura-regiao">{regiao.regiao}</span>
                    <span className="cobertura-percentual">{regiao.percentual}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mercado-item">
              <h5>📈 Potencial de Crescimento</h5>
              <div className="crescimento-metricas">
                <div className="crescimento-item">
                  <span className="crescimento-label">Mercado Atual</span>
                  <span className="crescimento-dado">{regiaoPrincipal?.regiao || 'N/A'}</span>
                  <span className="crescimento-destaque">{regiaoPrincipal?.percentual || '0'}%</span>
                </div>
                {segundaRegiao && (
                  <div className="crescimento-item">
                    <span className="crescimento-label">Próxima Fronteira</span>
                    <span className="crescimento-dado">{segundaRegiao.regiao}</span>
                    <span className="crescimento-destaque">{segundaRegiao.percentual}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="analise-risco">
          <h4>⚠️ Análise de Risco</h4>
          <div className="risco-grid">
            <div className="risco-item baixo">
              <div className="risco-titulo">Risco de Concentração</div>
              <div className="risco-descricao">Baixo - Presença em múltiplas regiões reduz dependência de um único mercado</div>
            </div>
            <div className="risco-item medio">
              <div className="risco-titulo">Risco de Monetização</div>
              <div className="risco-descricao">Médio - Base de eventos pagos pode ser expandida com novas features</div>
            </div>
            <div className="risco-item baixo">
              <div className="risco-titulo">Risco de Engajamento</div>
              <div className="risco-descricao">Baixo - Alta taxa de eventos gratuitos indica boa captação de usuários</div>
            </div>
          </div>
        </div>

        <div className="recomendacoes">
          <h4>🚀 Plano de Ação Recomendado</h4>
          <div className="recomendacoes-lista">
            <div className="recomendacao-item">
              <strong>1. Diversificação Regional (3-6 meses):</strong> Investir em marketing e parcerias na {segundaRegiao?.regiao || 'segunda maior região'} para equilibrar a base
            </div>
            <div className="recomendacao-item">
              <strong>2. Produtos Premium (6-12 meses):</strong> Desenvolver planos assinatura e features avançadas para aumentar receita por evento
            </div>
            <div className="recomendacao-item">
              <strong>3. Programa de Fidelidade (1-3 meses):</strong> Criar incentivos para conversão de eventos gratuitos em pagos
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RelatoriosInvestidores;
