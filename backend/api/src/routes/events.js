import express from "express";
import Event from "../db/Event.js";

const router = express.Router();

// GET /events - lista todos os eventos
router.get("/", async (req, res) => {
    try {
        const eventos = await Event.find({});
        res.json(eventos);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar eventos", detalhes: err.message });
    }
});

export default router;
