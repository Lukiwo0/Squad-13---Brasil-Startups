import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    titulo: String,
    dataInicio: Date,
    dataFim: Date,
    descricao: String,
    categoria: String,
    tipo: String,
    organizador: String,
    imagem: String,
    url: String,
    local: {
        estado: String,
        cidade: String,
    },
});

export default mongoose.model("Event", eventSchema);
