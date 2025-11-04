import express from "express";
import Event from "../db/Event.js";

const router = express.Router();

const agrupar = (arr, chave) =>
    arr.reduce((acc, item) => {
        const valor = item[chave];
        acc[valor] = (acc[valor] || 0) + 1;
        return acc;
    }, {});

router.get("/dados-gerais", async (req, res) => {
    try {
        const eventos = await Event.find();

        const totalEventos = eventos.length;

        // Eventos por mês
        const eventosPorMes = {};
        eventos.forEach(e => {
            const mes = new Date(e.dataInicio).getMonth() + 1;
            eventosPorMes[mes] = (eventosPorMes[mes] || 0) + 1;
        });

        const mediaMensal = totalEventos / Object.keys(eventosPorMes).length;

        const setoresMaisAtivos = agrupar(eventos, "categoria");

        res.json({ totalEventos, mediaMensal, setoresMaisAtivos });
    } catch (err) {
        res.status(500).json({ error: "Erro ao gerar métricas", detalhes: err.message });
    }
});

router.get("/analises", async (req, res) => {
    try {
        const eventos = await Event.find();

        const porSetor = agrupar(eventos, "categoria");
        const porTipo = agrupar(eventos, "tipo");

        const porEstado = eventos.reduce((acc, e) => {
            const estado = e.local?.estado || "Não informado";
            acc[estado] = (acc[estado] || 0) + 1;
            return acc;
        }, {});

        res.json({
            porSetor,
            porTipo,
            porEstado,
        });
    } catch (err) {
        res.status(500).json({ error: "Erro ao gerar análises", detalhes: err.message });
    }
});

router.get("/relatorios", async (req, res) => {
    try {
        const eventos = await Event.find();

        const setores = agrupar(eventos, "categoria");
        const setoresOrdenados = Object.entries(setores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const porCidade = eventos.reduce((acc, e) => {
            const cidade = e.local?.cidade || "Desconhecida";
            acc[cidade] = (acc[cidade] || 0) + 1;
            return acc;
        }, {});

        res.json({
            setoresMaisAtivos: setoresOrdenados,
            regioesMaisAtivas: porCidade,
            tendencia: "Evolução positiva nos últimos meses (mock)",
        });
    } catch (err) {
        res.status(500).json({ error: "Erro ao gerar relatórios", detalhes: err.message });
    }
});

export default router;
