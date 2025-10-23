import React, { useState, useMemo } from 'react'
import '../assets/styles/eventos.css'

export default function Eventos() {
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('Todos')
  const [eventoSelecionado, setEventoSelecionado] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [ordem, setOrdem] = useState('Mais recente') // 'Mais recente' ou 'Mais antigo'
  const eventsPerPage = 20

  // Eventos de exemplo
  const eventos = useMemo(() => [
    {
      id: 1,
      titulo: 'Inova Brasília 2025',
      status: 'Em andamento',
      organizador: 'UCB, SECTI-DF, JBS, Cargill, Agrit...',
      horario: '13h às 19h',
      dataInicio: '20/09/2025',
      dataFim: '23/09/2025',
      local: 'UCB - Universidade Católica de Brasília',
      endereco: 'QS 07, Lote 01, Taguatinga Sul - Taguatinga, Brasília - DF, 71966-700',
      descricao: 'Evento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.',
      link: 'https://www.ucb.br/eventos/inovabrasilia2025',
    },
    {
      id: 101,
      titulo: 'Testando o tamanho do titulo pra ver se fica ruim',
      status: 'Em andamento',
      organizador: 'UCB, SECTI-DF, JBS, Cargill, Agrit...',
      horario: '13h às 19h',
      dataInicio: '20/10/2025',
      dataFim: '23/10/2025',
      local: 'UCB - Universidade Católica de Brasília',
      endereco: 'QS 07, Lote 01, Taguatinga Sul - Taguatinga, Brasília - DF, 71966-700',
      descricao: 'Evento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.',
      link: 'https://www.ucb.br/eventos/inovabrasilia2025',
    },
    {
      id: 2,
      titulo: 'Tech Summit Goiânia',
      status: 'Agendado',
      organizador: 'Prefeitura de Goiânia, Sebrae, IFG',
      horario: '09h às 18h',
      dataInicio: '05/11/2025',
      dataFim: '07/11/2025',
      local: 'Centro de Convenções de Goiânia',
      endereco: 'Rua 4, nº 1400 - Setor Central, Goiânia - GO, 74020-060',
      descricao: 'Conferência regional sobre inovação, startups e empreendedorismo tecnológico. Evento voltado para profissionais e estudantes interessados em networking e troca de conhecimento sobre o ecossistema de inovação do Centro-Oeste.',
      link: 'https://techsummitgoiania.com.br',
    },
    {
      id: 3,
      titulo: 'Hackathon Cerrado Tech',
      status: 'Encerrado',
      organizador: 'SENAI Goiás, UFG, GynTech',
      horario: '08h às 20h',
      dataInicio: '15/07/2025',
      dataFim: '17/07/2025',
      local: 'Parque Tecnológico Samambaia - Goiânia',
      endereco: 'Av. Esperança, s/n, Campus Samambaia - Goiânia, GO',
      descricao: 'Hackathon que reuniu programadores, designers e empreendedores para criar soluções inovadoras em tecnologia sustentável. Foram 48h de imersão e pitch final com investidores regionais.',
      link: 'https://cerradotechhackathon.com.br',
    },
    ...Array.from({ length: 500 }, (_, i) => ({
      id: 4 + i,
      titulo: `Evento Exemplo ${4 + i}`,
      status: ['Em andamento', 'Agendado', 'Encerrado'][(i + 1) % 3],
      organizador: 'Organizador Exemplo',
      horario: '10h às 17h',
      dataInicio: '01/12/2025',
      dataFim: '01/12/2025',
      local: 'Local Exemplo',
      endereco: 'Endereço Exemplo, Cidade, UF',
      descricao: 'Descrição resumida do evento de exemplo para preencher a lista.',
      link: '#',
    })),
  ], [])

  // Função para ordenar eventos por status e data
  const ordenarEventos = (eventosArray) => {
    const statusOrder = { 'Em andamento': 1, 'Agendado': 2, 'Encerrado': 3 }

    return [...eventosArray].sort((a, b) => {
      // Primeiro ordena pelo status
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status]
      }

      // Segundo ordena pela data de início
      const parseData = (str) => {
        const [dia, mes, ano] = str.split('/')
        return new Date(ano, mes - 1, dia)
      }

      const dataA = parseData(a.dataInicio)
      const dataB = parseData(b.dataInicio)

      return ordem === 'Mais antigo' ? dataB - dataA : dataA - dataB
    })
  }

  // Filtros de busca e status
  const eventosFiltrados = useMemo(() => {
    return eventos.filter(
      (ev) =>
        (filtroStatus === 'Todos' || ev.status === filtroStatus) &&
        ev.titulo.toLowerCase().includes(busca.toLowerCase())
    )
  }, [eventos, filtroStatus, busca])

  // Paginação
  const eventosFiltradosOrdenados = ordenarEventos(eventosFiltrados)
  const totalPages = Math.ceil(eventosFiltradosOrdenados.length / eventsPerPage)
  const indexOfLastEvent = currentPage * eventsPerPage
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage
  const currentEvents = eventosFiltradosOrdenados.slice(indexOfFirstEvent, indexOfLastEvent)

  const abrirPopup = (evento) => setEventoSelecionado(evento)
  const fecharPopup = () => setEventoSelecionado(null)

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getPageNumbers = () => {
    const maxButtons = 7
    if (totalPages <= maxButtons) return [...Array(totalPages)].map((_, i) => i + 1)

    const pages = []
    const left = Math.max(1, currentPage - 2)
    const right = Math.min(totalPages, currentPage + 2)

    if (left > 1) pages.push(1)
    if (left > 2) pages.push('...')

    for (let p = left; p <= right; p++) pages.push(p)

    if (right < totalPages - 1) pages.push('...')
    if (right < totalPages) pages.push(totalPages)

    return pages
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'Em andamento': return 'status-azul'
      case 'Agendado': return 'status-azul-escuro'
      case 'Encerrado': return 'status-cinza'
      default: return ''
    }
  }

  return (
    <div className="eventos-wrapper">

      {/* Filtros */}
      <div className="filtros-container">
        <input
          type="text"
          placeholder="Pesquise o nome do evento..."
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value)
            setCurrentPage(1)
          }}
        />
        <select
          value={filtroStatus}
          onChange={(e) => {
            setFiltroStatus(e.target.value)
            setCurrentPage(1)
          }}
        >
          <option value="Todos">Todos</option>
          <option value="Em andamento">Em andamento</option>
          <option value="Agendado">Agendado</option>
          <option value="Encerrado">Encerrado</option>
        </select>
        <select
          value={ordem}
          onChange={(e) => {
            setOrdem(e.target.value)
            setCurrentPage(1)
          }}
        >
          <option value="Mais recente">Mais recente → Mais antigo</option>
          <option value="Mais antigo">Mais antigo → Mais recente</option>
        </select>
      </div>

      {/* Cards */}
      <div className="eventos-container">
        {currentEvents.map((ev) => (
          <div key={ev.id} className="evento-card">
            <h2>{ev.titulo}</h2>
            <button className={`status-btn ${getStatusClass(ev.status)}`}>{ev.status}</button>
            <p className="organizador"><strong>Organizador(es):</strong> {ev.organizador}</p>
            <br />
            <p className="horario"><strong>Horário:</strong> {ev.horario}</p>
            <p className="data">
              <strong>Data:</strong>{' '}
              {ev.dataFim && ev.dataInicio !== ev.dataFim
                ? `${ev.dataInicio} até ${ev.dataFim}`
                : ev.dataInicio}
            </p>
            <br />
            <p className="local"><strong>Local:</strong> {ev.local}</p>
            <p className="endereco"><strong>Endereço:</strong> {ev.endereco}</p>
            <br />
            <p className="descricao"><strong>Descrição:</strong> {ev.descricao}</p>
            <br />
            <p>
              <strong>Link para inscrição:</strong>{' '}
              <a href={ev.link} target="_blank" rel="noopener noreferrer">CLIQUE AQUI</a>
            </p>
            <button className="ler-mais-btn" onClick={() => abrirPopup(ev)}>Ler mais</button>
          </div>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >Anterior</button>

          {getPageNumbers().map((p, idx) =>
            p === '...' ? <span key={`dots-${idx}`} className="dots">...</span> :
              <button
                key={p}
                className={`page-btn ${currentPage === p ? 'active' : ''}`}
                onClick={() => handlePageChange(p)}
              >{p}</button>
          )}

          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >Próximo</button>
        </div>
      )}

      {/* Popup */}
      {eventoSelecionado && (
        <div className="popup-overlay" onClick={fecharPopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>{eventoSelecionado.titulo}</h2>
            <p><strong>Status:</strong> {eventoSelecionado.status}</p>
            <p><strong>Organizador:</strong> {eventoSelecionado.organizador}</p>
            <p><strong>Horário:</strong> {eventoSelecionado.horario}</p>
            <p>
              <strong>Data:</strong>{' '}
              {eventoSelecionado.dataFim && eventoSelecionado.dataInicio !== eventoSelecionado.dataFim
                ? `${eventoSelecionado.dataInicio} até ${eventoSelecionado.dataFim}`
                : eventoSelecionado.dataInicio}
            </p>
            <p><strong>Local:</strong> {eventoSelecionado.local}</p>
            <p><strong>Endereço:</strong> {eventoSelecionado.endereco}</p>
            <p><strong>Descrição:</strong> {eventoSelecionado.descricao}</p>
            <p>
              <strong>Link:</strong>{' '}
              <a href={eventoSelecionado.link} target="_blank" rel="noopener noreferrer">{eventoSelecionado.link}</a>
            </p>
            <button className="fechar-btn" onClick={fecharPopup}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  )
}
