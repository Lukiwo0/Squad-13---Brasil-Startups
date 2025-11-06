import React, { useState, useEffect } from 'react';
import '../assets/styles/metricas.css';

// Components
import MetricasCards from '../components/metricas/MetricasCards';
import DashboardGraficos from '../components/metricas/Graficos';
import RelatoriosInvestidores from '../components/metricas/RelatoriosInvestidores';
import AnalisesDetalhadas from '../components/metricas/AnalisesDetalhadas';

// Utils
import { formatarDadosMetricas, exportarPDF } from '../components/metricas/utils';

const Metricas = () => {
  const [dadosGerais, setDadosGerais] = useState(null);
  const [analises, setAnalises] = useState(null);
  const [relatorios, setRelatorios] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // 🔹 Filtro de região (apenas para o gráfico)
  const [regiaoSelecionada, setRegiaoSelecionada] = useState('');
  const [dadosGraficoRegiao, setDadosGraficoRegiao] = useState(null);

  // Busca inicial de tudo (sem filtro)
  useEffect(() => {
    const buscarMetricas = async () => {
      try {
        setCarregando(true);
        setErro(null);

        const [respostaGerais, respostaAnalises, respostaRelatorios] = await Promise.all([
          fetch('http://localhost:3000/metricas/dados-gerais'),
          fetch('http://localhost:3000/metricas/analises'),
          fetch('http://localhost:3000/metricas/relatorios')
        ]);

        if (!respostaGerais.ok || !respostaAnalises.ok || !respostaRelatorios.ok) {
          throw new Error('Erro ao carregar métricas');
        }

        const dadosGerais = await respostaGerais.json();
        const dadosAnalises = await respostaAnalises.json();
        const dadosRelatorios = await respostaRelatorios.json();

        setDadosGerais(dadosGerais);
        setAnalises(dadosAnalises);
        setRelatorios(dadosRelatorios);

      } catch (error) {
        console.error('Erro ao buscar métricas:', error);
        setErro('Erro ao carregar dados das métricas. Tente novamente mais tarde.');
      } finally {
        setCarregando(false);
      }
    };

    buscarMetricas();
  }, []);

  // 🔹 Buscar apenas dados filtrados do gráfico por região
  useEffect(() => {
    const buscarGraficoPorRegiao = async () => {
      try {
        const query = regiaoSelecionada ? `?regiao=${regiaoSelecionada}` : '';
        const resposta = await fetch(`http://localhost:3000/metricas/dados-gerais${query}`);
        if (!resposta.ok) throw new Error('Erro ao buscar gráfico filtrado');
        const dados = await resposta.json();
        setDadosGraficoRegiao(dados.eventosPorMes); // Só o gráfico
      } catch (err) {
        console.error('Erro ao carregar gráfico por região:', err);
      }
    };

    buscarGraficoPorRegiao();
  }, [regiaoSelecionada]);

  const metricasData = formatarDadosMetricas(dadosGerais, analises, relatorios);

  const handleExportPDF = () => {
    if (metricasData && dadosGerais) {
      exportarPDF(metricasData, dadosGerais);
    }
  };

  if (carregando) {
    return (
      <div className="metricas-container">
        <div className="carregando">
          <div className="spinner"></div>
          <h3>Carregando métricas...</h3>
          <p>Aguarde enquanto buscamos os dados mais recentes.</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="metricas-container">
        <div className="erro-carregamento">
          <h3>{erro}</h3>
          <p>Verifique se o servidor está rodando na porta 3000.</p>
        </div>
      </div>
    );
  }

  if (!metricasData) {
    return (
      <div className="metricas-container">
        <div className="erro-carregamento">
          <h3>Nenhum dado disponível</h3>
          <p>Não foi possível carregar os dados das métricas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="metricas-container">
      <div className="metricas-header">
        <h1>📊 Dashboard de Análises</h1>
        <p>Métricas e insights baseados nos dados reais do sistema</p>

        <div className="header-actions-center">
          {/* 🔹 Filtro de região que atualiza só o gráfico */}
          <div className="filtro-regiao">
            <label htmlFor="regiao">Filtrar gráfico por região:</label>
            <select
              id="regiao"
              value={regiaoSelecionada}
              onChange={(e) => setRegiaoSelecionada(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="Norte">Norte</option>
              <option value="Nordeste">Nordeste</option>
              <option value="Centro-Oeste">Centro-Oeste</option>
              <option value="Sudeste">Sudeste</option>
              <option value="Sul">Sul</option>
            </select>
          </div>

          <button className="btn-exportar" onClick={handleExportPDF}>
            📄 Baixar Relatório em PDF
          </button>
        </div>
      </div>

      <MetricasCards metricasData={metricasData} dadosGerais={dadosGerais} />

      {/* 🔹 Aqui o gráfico usa os dados filtrados, se houver */}
      <DashboardGraficos
        dadosGraficos={metricasData.dadosGraficos}
        eventosPorMes={dadosGraficoRegiao || dadosGerais?.eventosPorMes}
      />

      <AnalisesDetalhadas metricasData={metricasData} dadosGerais={dadosGerais} />
      <RelatoriosInvestidores metricasData={metricasData} dadosGerais={dadosGerais} />
    </div>
  );
};

export default Metricas;
