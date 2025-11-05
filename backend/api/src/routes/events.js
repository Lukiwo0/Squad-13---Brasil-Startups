import express from "express";
import Event from "../db/Event.js";

const router = express.Router();

// GET /events - lista todos os eventos
router.get("/", async (req, res) => {
  try {
    const eventos = await Event.find({});
    const formatados = eventos.map(e => ({
      id: e.id,
      nome: e.name,
      categoria: e.eventsCategory,
      organizador: e.eventsHost,
      pago: e.paymentEventType === "paid",
      inicio: e.startDate,
      fim: e.endDate,
      cidade: e.eventsAddress?.city,
      estado: e.eventsAddress?.state,
      pais: e.eventsAddress?.country,
      descricao: e.strippedDetail,
      url: e.newUrl,
    }));
    res.json(formatados);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar eventos", detalhes: err.message });
  }
});

export default router;
