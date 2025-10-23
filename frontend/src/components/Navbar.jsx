import React from 'react'
import '../assets/styles/navbar.css'

export default function Navbar({ paginaAtual, setPaginaAtual }) {
  return (
    <nav className="navbar">
      <button
        className={`nav-btn ${paginaAtual === 'eventos' ? 'ativo' : ''}`}
        onClick={() => setPaginaAtual('eventos')}
      >
        Eventos
      </button>
      <button
        className={`nav-btn ${paginaAtual === 'metricas' ? 'ativo' : ''}`}
        onClick={() => setPaginaAtual('metricas')}
      >
        Métricas
      </button>
    </nav>
  )
}
