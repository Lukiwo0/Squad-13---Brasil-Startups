import React, { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Eventos from './pages/Eventos.jsx'
import Metricas from './pages/Metricas.jsx'
import './assets/styles/variables.css'

function App() {
  const [paginaAtual, setPaginaAtual] = useState('eventos')

  return (
    <div>
      <Navbar paginaAtual={paginaAtual} setPaginaAtual={setPaginaAtual} />

      <main>
        {paginaAtual === 'eventos' ? <Eventos /> : <Metricas />}
      </main>
    </div>
  )
}

export default App
