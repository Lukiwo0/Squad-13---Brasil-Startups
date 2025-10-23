import React from 'react'
import '../assets/styles/metricas.css'

export default function Metricas() {
  const metricas = [
    { titulo: 'Eventos Totais', valor: 42 },
    { titulo: 'Setores Ativos', valor: 8 },
    { titulo: 'Cidades Cobertas', valor: 15 },
  ]

  return (
    <div className="metricas-container">
      {metricas.map((m, index) => (
        <div key={index} className="metrica-card">
          <h3>{m.titulo}</h3>
          <p>{m.valor}</p>
        </div>
      ))}
    </div>
  )
}
