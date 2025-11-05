import express from "express";
import Event from "../db/Event.js";

const router = express.Router();

// Função utilitária para agrupar por chave
const agrupar = (arr, chave) =>
  arr.reduce((acc, item) => {
    const valor = item[chave] || "Não informado";
    acc[valor] = (acc[valor] || 0) + 1;
    return acc;
  }, {});

router.get("/dados-gerais", async (req, res) => {
  try {
    const eventos = await Event.find();
    const totalEventos = eventos.length;

    // Eventos por mês (baseado em startDate)
    const eventosPorMes = {};
    eventos.forEach(e => {
      const mes = new Date(e.startDate).getMonth() + 1;
      eventosPorMes[mes] = (eventosPorMes[mes] || 0) + 1;
    });

    const mediaMensal = totalEventos / Object.keys(eventosPorMes).length;

    const setoresMaisAtivos = agrupar(eventos, "eventsCategory");

    // Total de eventos pagos e gratuitos
    const pagos = eventos.filter(e => e.paymentEventType === "paid").length;
    const gratuitos = eventos.filter(e => e.paymentEventType !== "paid").length;

    // Quantos cancelados
    const cancelados = eventos.filter(e => e.cancelled).length;

    res.json({
      totalEventos,
      mediaMensal,
      eventosPorMes,
      setoresMaisAtivos,
      pagos,
      gratuitos,
      cancelados,
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao gerar métricas", detalhes: err.message });
  }
});

router.get("/analises", async (req, res) => {
  try {
    const eventos = await Event.find();

    const porCategoria = agrupar(eventos, "eventsCategory");
    const porTipoPagamento = agrupar(eventos, "paymentEventType");
    const porOrganizador = agrupar(eventos, "eventsHost");

    // Agrupar por estado
    const porEstado = eventos.reduce((acc, e) => {
      const estado = e.eventsAddress?.state || "Não informado";
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {});

    // Agrupar por cidade
    const porCidade = eventos.reduce((acc, e) => {
      const cidade = e.eventsAddress?.city || "Não informada";
      acc[cidade] = (acc[cidade] || 0) + 1;
      return acc;
    }, {});

    res.json({
      porCategoria,
      porTipoPagamento,
      porOrganizador,
      porEstado,
      porCidade,
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao gerar análises", detalhes: err.message });
  }
});

router.get("/relatorios", async (req, res) => {
  try {
    const eventos = await Event.find();

    const setores = agrupar(eventos, "eventsCategory");
    const setoresOrdenados = Object.entries(setores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const cidades = eventos.reduce((acc, e) => {
      const cidade = e.eventsAddress?.city || "Desconhecida";
      acc[cidade] = (acc[cidade] || 0) + 1;
      return acc;
    }, {});
    const cidadesTop5 = Object.entries(cidades)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const organizadores = agrupar(eventos, "eventsHost");
    const organizadoresTop5 = Object.entries(organizadores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Taxa de cancelamento
    const cancelados = eventos.filter(e => e.cancelled).length;
    const taxaCancelamento = ((cancelados / eventos.length) * 100).toFixed(2);

    res.json({
      setoresMaisAtivos: setoresOrdenados,
      regioesMaisAtivas: cidadesTop5,
      organizadoresMaisAtivos: organizadoresTop5,
      taxaCancelamento: `${taxaCancelamento}%`,
      tendencia: "Alta no número de eventos pagos e aumento de festivais de música.",
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao gerar relatórios", detalhes: err.message });
  }
});

export default router;
