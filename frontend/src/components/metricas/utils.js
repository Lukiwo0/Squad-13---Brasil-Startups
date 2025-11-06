import jsPDF from 'jspdf';

// Funções utilitárias para métricas
export const calcularRegioes = (estados) => {
  const regioesMap = {
    'SP': 'Sudeste', 'RJ': 'Sudeste', 'MG': 'Sudeste', 'ES': 'Sudeste',
    'RS': 'Sul', 'SC': 'Sul', 'PR': 'Sul',
    'DF': 'Centro-Oeste', 'GO': 'Centro-Oeste', 'MT': 'Centro-Oeste', 'MS': 'Centro-Oeste',
    'BA': 'Nordeste', 'PE': 'Nordeste', 'CE': 'Nordeste', 'MA': 'Nordeste', 'PB': 'Nordeste',
    'RN': 'Nordeste', 'AL': 'Nordeste', 'SE': 'Nordeste', 'PI': 'Nordeste',
    'AM': 'Norte', 'PA': 'Norte', 'RO': 'Norte', 'AC': 'Norte', 'RR': 'Norte', 'AP': 'Norte', 'TO': 'Norte'
  };

  const regioes = {};
  
  estados.forEach(estado => {
    const regiao = regioesMap[estado.estado] || 'Desconhecido/Não informado';
    regioes[regiao] = (regioes[regiao] || 0) + estado.quantidade;
  });

  const total = estados.reduce((sum, estado) => sum + estado.quantidade, 0);
  
  return Object.entries(regioes).map(([regiao, quantidade]) => ({
    regiao,
    quantidade,
    percentual: total > 0 ? ((quantidade / total) * 100).toFixed(1) : '0'
  })).sort((a, b) => b.quantidade - a.quantidade);
};

export const formatarDadosMetricas = (dadosGerais, analises, relatorios) => {
  if (!dadosGerais || !analises || !relatorios) return null;

  // Converter setoresMaisAtivos para array ordenado
  const setoresArray = Object.entries(dadosGerais.setoresMaisAtivos || {})
    .map(([categoria, quantidade]) => ({ categoria, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade);

  // Converter porEstado para array
  const distribuicaoEstados = Object.entries(analises.porEstado || {})
    .map(([estado, quantidade]) => ({ 
      estado, 
      quantidade,
      percentual: dadosGerais.totalEventos > 0 ? ((quantidade / dadosGerais.totalEventos) * 100).toFixed(1) : '0'
    }))
    .sort((a, b) => b.quantidade - a.quantidade);

  // Converter porCidade para array
  const cidadesTop = Object.entries(analises.porCidade || {})
    .map(([cidade, quantidade]) => ({ cidade, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 6);

  const regioes = calcularRegioes(distribuicaoEstados);

  return {
    dadosGerais: {
      totalEventos: dadosGerais.totalEventos,
      mediaMensal: dadosGerais.mediaMensal?.toFixed(1) || '0',
      pagos: dadosGerais.pagos,
      gratuitos: dadosGerais.gratuitos,
      cancelados: dadosGerais.cancelados || 0,
      taxaCancelamento: relatorios.taxaCancelamento || '0%',
      eventosPorMes: dadosGerais.eventosPorMes || {}
    },
    
    categorias: {
      todas: setoresArray,
      top5: setoresArray.slice(0, 5)
    },
    
    geolocalizacao: {
      estados: distribuicaoEstados.slice(0, 8),
      cidades: cidadesTop,
      regioes
    },
    
    organizadores: {
      top: relatorios.organizadoresMaisAtivos || []
    },
    
    tendencias: {
      principal: relatorios.tendencia,
      setoresTop: relatorios.setoresMaisAtivos || []
    },
    
    dadosGraficos: {
      categorias: setoresArray.slice(0, 6),
      estados: distribuicaoEstados.slice(0, 6),
      cidades: cidadesTop,
      regioes,
      tiposPagamento: [
        { tipo: 'Pagos', quantidade: dadosGerais.pagos, percentual: dadosGerais.totalEventos > 0 ? ((dadosGerais.pagos / dadosGerais.totalEventos) * 100).toFixed(1) : '0' },
        { tipo: 'Gratuitos', quantidade: dadosGerais.gratuitos, percentual: dadosGerais.totalEventos > 0 ? ((dadosGerais.gratuitos / dadosGerais.totalEventos) * 100).toFixed(1) : '0' }
      ]
    }
  };
};

export const exportarPDF = (metricasData, dadosGerais) => {
  try {
    const doc = new jsPDF();
    
    // Configurações iniciais
    doc.setFont('helvetica');
    doc.setFontSize(20);
    
    // Título principal
    doc.text('Relatório Completo - Dashboard de Métricas', 20, 30);
    doc.setFontSize(12);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, 20, 40);
    doc.text('Sistema de Gestão de Eventos', 20, 47);
    
    let yPosition = 60;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    // Função para verificar e adicionar nova página
    const checkPageBreak = (spaceNeeded = 10) => {
      if (yPosition + spaceNeeded > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // Função para adicionar seção
    const addSection = (title, content) => {
      checkPageBreak(20);
      
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text(title, margin, yPosition);
      yPosition += 10;
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      
      content();
      
      yPosition += 10;
    };

    // ===== SEÇÃO 1: DADOS GERAIS =====
    addSection('DADOS GERAIS', () => {
      const totalEventos = parseInt(metricasData.dadosGerais.totalEventos) || 0;
      const pagos = parseInt(metricasData.dadosGerais.pagos) || 0;
      const gratuitos = parseInt(metricasData.dadosGerais.gratuitos) || 0;
      const percentualPagos = totalEventos > 0 ? ((pagos / totalEventos) * 100).toFixed(1) : '0';
      const percentualGratuitos = totalEventos > 0 ? ((gratuitos / totalEventos) * 100).toFixed(1) : '0';
      
      const dados = [
        `Total de Eventos: ${totalEventos}`,
        `Média Mensal: ${parseFloat(metricasData.dadosGerais.mediaMensal || 0).toFixed(1)} eventos/mês`,
        `Eventos Pagos: ${pagos} (${percentualPagos}%)`,
        `Eventos Gratuitos: ${gratuitos} (${percentualGratuitos}%)`,
        `Taxa de Cancelamento: ${metricasData.dadosGerais.taxaCancelamento || '0'}%`,
        `Estabilidade: ${(100 - parseFloat(metricasData.dadosGerais.taxaCancelamento || 0)).toFixed(1)}%`
      ];

      dados.forEach(text => {
        checkPageBreak(8);
        doc.text(`• ${text}`, margin, yPosition);
        yPosition += 6;
      });
    });

    // ===== SEÇÃO 2: MÉTRICAS PRINCIPAIS =====
    addSection('MÉTRICAS PRINCIPAIS', () => {
      const metricas = [
        'Crescimento da Plataforma: Base sólida com diversificação regional',
        'Engajamento de Usuários: Alta taxa de eventos gratuitos para captação',
        'Monetização: Base consistente de eventos pagos',
        'Estabilidade: Baixa taxa de cancelamento'
      ];

      metricas.forEach(text => {
        checkPageBreak(8);
        doc.text(`• ${text}`, margin, yPosition);
        yPosition += 6;
      });
    });

    // ===== SEÇÃO 3: DISTRIBUIÇÃO POR CATEGORIA =====
    if (metricasData?.categorias?.top5?.length > 0) {
      addSection('DISTRIBUIÇÃO POR CATEGORIA', () => {
        const totalEventos = parseInt(metricasData.dadosGerais.totalEventos) || 1;
        
        metricasData.categorias.top5.forEach((categoria, index) => {
          checkPageBreak(8);
          const percentual = ((categoria.quantidade / totalEventos) * 100).toFixed(1);
          doc.text(`${index + 1}. ${categoria.categoria}: ${categoria.quantidade} eventos (${percentual}%)`, margin, yPosition);
          yPosition += 6;
        });
      });
    }

    // ===== SEÇÃO 4: DISTRIBUIÇÃO GEOGRÁFICA =====
    if (metricasData?.geolocalizacao?.regioes?.length > 0) {
      addSection('DISTRIBUIÇÃO GEOGRÁFICA - REGIÕES', () => {
        const regioesConhecidas = metricasData.geolocalizacao.regioes.filter(
          regiao => !regiao.regiao?.includes('Desconhecido') && 
                   !regiao.regiao?.includes('Não informado')
        );

        regioesConhecidas.forEach((regiao, index) => {
          checkPageBreak(8);
          doc.text(`${index + 1}. ${regiao.regiao}: ${regiao.percentual}% dos eventos`, margin, yPosition);
          yPosition += 6;
        });

        yPosition += 5;
        
        // Estados (top 5)
        if (metricasData.geolocalizacao.estados?.length > 0) {
          checkPageBreak(12);
          doc.setFont(undefined, 'bold');
          doc.text('Estados Mais Ativos:', margin, yPosition);
          yPosition += 6;
          doc.setFont(undefined, 'normal');
          
          metricasData.geolocalizacao.estados.slice(0, 5).forEach((estado, index) => {
            checkPageBreak(8);
            doc.text(`${index + 1}. ${estado.estado}: ${estado.quantidade} eventos (${estado.percentual}%)`, margin + 5, yPosition);
            yPosition += 6;
          });
        }
      });
    }

    // ===== SEÇÃO 5: ORGANIZADORES =====
    if (metricasData?.organizadores?.top?.length > 0) {
      addSection('ORGANIZADORES MAIS ATIVOS', () => {
        metricasData.organizadores.top.slice(0, 5).forEach(([organizador, quantidade], index) => {
          checkPageBreak(8);
          const orgText = `${index + 1}. ${organizador}: ${quantidade} eventos`;
          const lines = doc.splitTextToSize(orgText, 160);
          lines.forEach(line => {
            doc.text(line, margin, yPosition);
            yPosition += 6;
          });
        });
      });
    }

    // ===== SEÇÃO 6: ANÁLISE PARA INVESTIDORES =====
    addSection('RELATÓRIO PARA INVESTIDORES', () => {
      const regioesConhecidas = metricasData.geolocalizacao.regioes?.filter(
        regiao => !regiao.regiao?.includes('Desconhecido') && 
                 !regiao.regiao?.includes('Não informado')
      ) || [];
      
      const regiaoPrincipal = regioesConhecidas[0];
      const segundaRegiao = regioesConhecidas[1];
      const totalEventos = parseInt(metricasData.dadosGerais.totalEventos) || 0;
      const eventosPagos = parseInt(metricasData.dadosGerais.pagos) || 0;
      const eventosGratuitos = parseInt(metricasData.dadosGerais.gratuitos) || 0;
      const taxaEngajamento = totalEventos > 0 ? ((eventosGratuitos / totalEventos) * 100).toFixed(1) : '0.0';

      const analise = [
        'RESUMO EXECUTIVO:',
        `Plataforma com ${totalEventos} eventos, média de ${parseFloat(metricasData.dadosGerais.mediaMensal || 0).toFixed(1)} eventos/mês`,
        `Atuação em ${regioesConhecidas.length} regiões${regiaoPrincipal ? `, foco em ${regiaoPrincipal.regiao} (${regiaoPrincipal.percentual}%)` : ''}`,
        `Modelo: ${taxaEngajamento}% gratuitos (captação) + ${eventosPagos} pagos (monetização)`,
        '',
        'INDICADORES-CHAVE:',
        `• Crescimento Mensal: ${parseFloat(metricasData.dadosGerais.mediaMensal || 0).toFixed(1)} eventos/mês`,
        `• Diversificação: ${regioesConhecidas.length} regiões`,
        `• Engajamento: ${taxaEngajamento}% eventos gratuitos`,
        `• Estabilidade: ${(100 - parseFloat(metricasData.dadosGerais.taxaCancelamento || 0)).toFixed(1)}%`,
        '',
        'OPORTUNIDADES:',
        `• Expansão em: ${segundaRegiao?.regiao || 'novas regiões'}`,
        `• Monetização da base: ${eventosPagos} eventos pagos`,
        `• Conversão: ${eventosGratuitos} eventos gratuitos`,
        '',
        'RECOMENDAÇÕES:',
        '1. Diversificação regional (3-6 meses)',
        '2. Produtos premium (6-12 meses)',
        '3. Programa de fidelidade (1-3 meses)'
      ];

      analise.forEach(text => {
        checkPageBreak(6);
        if (text.includes('RESUMO') || text.includes('INDICADORES') || text.includes('OPORTUNIDADES') || text.includes('RECOMENDAÇÕES')) {
          doc.setFont(undefined, 'bold');
          doc.text(text, margin, yPosition);
          doc.setFont(undefined, 'normal');
        } else if (text === '') {
          // Espaço em branco
          yPosition += 3;
        } else {
          doc.text(text, margin + (text.startsWith('•') || text.startsWith('1.') || text.startsWith('2.') || text.startsWith('3.') ? 5 : 0), yPosition);
        }
        yPosition += 6;
      });
    });

    // ===== SEÇÃO 7: EVOLUÇÃO MENSAL =====
    if (dadosGerais?.eventosPorMes?.length > 0) {
      addSection('EVOLUÇÃO MENSAL DE EVENTOS', () => {
        dadosGerais.eventosPorMes.forEach((mes, index) => {
          checkPageBreak(8);
          doc.text(`• ${mes.mes}: ${mes.quantidade} eventos`, margin, yPosition);
          yPosition += 6;
        });

        // Estatísticas da evolução
        const quantidades = dadosGerais.eventosPorMes.map(mes => mes.quantidade);
        const media = quantidades.reduce((a, b) => a + b, 0) / quantidades.length;
        const max = Math.max(...quantidades);
        const min = Math.min(...quantidades);
        
        checkPageBreak(15);
        doc.setFont(undefined, 'bold');
        doc.text('Estatísticas:', margin, yPosition);
        yPosition += 6;
        doc.setFont(undefined, 'normal');
        
        doc.text(`Média: ${media.toFixed(1)} eventos/mês`, margin + 5, yPosition);
        yPosition += 6;
        doc.text(`Máximo: ${max} eventos`, margin + 5, yPosition);
        yPosition += 6;
        doc.text(`Mínimo: ${min} eventos`, margin + 5, yPosition);
      });
    }

    // ===== RODAPÉ =====
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Página ${i} de ${totalPages} - Sistema de Gestão de Eventos`, margin, pageHeight - 10);
    }

    // Salvar PDF
    doc.save(`relatorio-completo-metricas-${new Date().toISOString().split('T')[0]}.pdf`);
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Erro ao gerar o PDF. Verifique o console para mais detalhes.');
  }
};