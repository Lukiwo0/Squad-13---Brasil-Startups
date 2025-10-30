import React, { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Eventos from "./pages/Eventos.jsx";
import Metricas from "./pages/Metricas.jsx";
import RelatorioPage from "./pages/RelatorioPage.jsx";
import "./assets/styles/variables.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [paginaAtual, setPaginaAtual] = useState("eventos");

  return (
    <BrowserRouter>
      <Navbar paginaAtual={paginaAtual} setPaginaAtual={setPaginaAtual} />

      <main>
        <Routes>
          <Route path="/" element={<Eventos />} />
          <Route path="/metricas" element={<Metricas />} />
          <Route path="/relatorio" element={<RelatorioPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
