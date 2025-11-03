import React, { useState, useMemo } from 'react'
import '../assets/styles/eventos.css'

export default function Eventos() {
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('Todos')
  const [eventoSelecionado, setEventoSelecionado] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [ordem, setOrdem] = useState('Mais recente')
  const [mostrarFiltrosAvancados, setMostrarFiltrosAvancados] = useState(false)
  const [filtrosAvancados, setFiltrosAvancados] = useState({
    dataEspecifica: '',
    dataInicio: '',
    dataFim: '',
    cidade: '',
    estado: '',
    pais: '',
    tipoPagamento: 'Todos'
  })

  const eventsPerPage = 20

  // Função para determinar o status baseado nas datas
  const getStatus = (event) => {
    const hoje = new Date()
    const startDate = new Date(event.startDate)
    const endDate = new Date(event.endDate)

    if (hoje < startDate) return 'Agendado'
    if (hoje >= startDate && hoje <= endDate) return 'Em andamento'
    return 'Encerrado'
  }

  // Eventos de exemplo com nova estrutura
  const eventos = useMemo(() => [
    {
      id: 1,
      name: 'Inova Brasília 2025',
      newUrl: 'https://www.ucb.br/eventos/inovabrasilia2025',
      startDate: '2025-11-02',
      endDate: '2025-11-05',
      eventsCategory: { name: 'Tecnologia & Inovação' },
      eventsHost: { name: 'UCB, SECTI-DF, JBS, Cargill, Agrit...' },
      paymentEventType: 'unpaid',
      cancelled: false,
      strippedDetail: 'Evento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.vento de Startup de tecnologia com foco em sustentabilidade, inovação e agricultura. Com apresentação de 16 startups que desenvolveram soluções para o agronegócio sustentável, com palestras, workshops e rodada de investimento.',
      eventsAddress: {
        city: 'Brasília',
        state: 'DF',
        country: 'Brasil'
      }
    },
    ...Array.from({ length: 500 }, (_, i) => ({
      id: 2 + i,
      name: `Evento Exemplo ${2 + i}`,
      newUrl: '#',
      startDate: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      endDate: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      eventsCategory: { name: ['Tecnologia', 'Negócios', 'Educação'][i % 3] },
      eventsHost: { name: 'Organizador Exemplo' },
      paymentEventType: i % 2 === 0 ? 'paid' : 'unpaid',
      cancelled: i % 10 === 0, // 10% dos eventos cancelados
      strippedDetail: 'Descrição resumida do evento de exemplo para preencher a lista.',
      eventsAddress: {
        city: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte'][i % 3],
        state: ['SP', 'RJ', 'MG'][i % 3],
        country: 'Brasil'
      }
    }))
  ], [])

  // Adicionar status aos eventos
  const eventosComStatus = useMemo(() =>
    eventos.map(event => ({
      ...event,
      status: getStatus(event)
    })), [eventos]
  )

  // Função para formatar data
  const formatarData = (dataISO) => {
    if (!dataISO) return ''
    const data = new Date(dataISO)
    return data.toLocaleDateString('pt-BR')
  }

  // Função para ordenar eventos por status e data
  const ordenarEventos = (eventosArray) => {
    const statusOrder = { 'Em andamento': 1, 'Agendado': 2, 'Encerrado': 3 }

    return [...eventosArray].sort((a, b) => {
      // Primeiro ordena pelo status
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status]
      }

      // Segundo ordena pela data de início
      const dataA = new Date(a.startDate)
      const dataB = new Date(b.startDate)

      return ordem === 'Mais antigo' ? dataB - dataA : dataA - dataB
    })
  }

// Função para normalizar texto (remover acentos e converter para minúsculo)
const normalizarTexto = (texto) => {
  if (!texto) return ''
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[ç]/g, 'c') // Converte ç para c
}

// Filtros de busca e status
const eventosFiltrados = useMemo(() => {
  return eventosComStatus.filter((event) => {
    // Filtro por busca no título
    const buscaMatch = normalizarTexto(event.name).includes(normalizarTexto(busca))
    
    // Filtro por status
    const statusMatch = filtroStatus === 'Todos' || event.status === filtroStatus
    
    // Filtros avançados
    const dataEspecificaMatch = !filtrosAvancados.dataEspecifica || 
      (formatarData(event.startDate) === formatarData(filtrosAvancados.dataEspecifica) ||
       formatarData(event.endDate) === formatarData(filtrosAvancados.dataEspecifica))
    
    const dataPeriodoMatch = !filtrosAvancados.dataInicio || !filtrosAvancados.dataFim || 
      (new Date(event.startDate) >= new Date(filtrosAvancados.dataInicio) &&
       new Date(event.endDate) <= new Date(filtrosAvancados.dataFim))
    
    const cidadeMatch = !filtrosAvancados.cidade || 
      normalizarTexto(event.eventsAddress?.city).includes(normalizarTexto(filtrosAvancados.cidade))
    
    const estadoMatch = !filtrosAvancados.estado || 
      normalizarTexto(event.eventsAddress?.state).includes(normalizarTexto(filtrosAvancados.estado))
    
    const paisMatch = !filtrosAvancados.pais || 
      normalizarTexto(event.eventsAddress?.country).includes(normalizarTexto(filtrosAvancados.pais))
    
    const pagamentoMatch = filtrosAvancados.tipoPagamento === 'Todos' || 
      event.paymentEventType === filtrosAvancados.tipoPagamento

    return buscaMatch && statusMatch && dataEspecificaMatch && dataPeriodoMatch && 
           cidadeMatch && estadoMatch && paisMatch && pagamentoMatch
  })
}, [eventosComStatus, filtroStatus, busca, filtrosAvancados])

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

  const limparFiltrosAvancados = () => {
    setFiltrosAvancados({
      dataEspecifica: '',
      dataInicio: '',
      dataFim: '',
      cidade: '',
      estado: '',
      pais: '',
      tipoPagamento: 'Todos'
    })
  }

  // Função para adicionar ao Google Agenda (exemplo)
  const adicionarAoGoogleAgenda = () => {
    const eventosParaAgenda = currentEvents.slice(0, 5) // Limite do Google Agenda
    alert(`Adicionando ${eventosParaAgenda.length} eventos ao Google Agenda...`)
    // Aqui você implementaria a lógica real de integração com o Google Agenda
  }

  return (
    <div className="eventos-wrapper">

      {/* Filtros */}
      <div className="filtros-container">
        <div className="busca-container">
          <input
            type="text"
            placeholder="Pesquise o nome do evento..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value)
              setCurrentPage(1)
            }}
          />
          <button
            className={`filtro-icon ${mostrarFiltrosAvancados ? 'ativo' : ''}`}
            onClick={() => setMostrarFiltrosAvancados(!mostrarFiltrosAvancados)}
          >
            <span className="material-symbols-outlined">
              filter_alt
            </span>
          </button>
        </div>
      </div>

      {/* Filtros Avançados */}
      {mostrarFiltrosAvancados && (
        <div className="filtros-avancados">
          <div className="filtros-grid">

            <div className="filtro-group">
              <label>Status:</label>
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
            </div>

            <div className="filtro-group">
              <label>Ordenar por:</label>
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

            <div className="filtro-group">
              <label>Data específica:</label>
              <input
                type="date"
                value={filtrosAvancados.dataEspecifica}
                onChange={(e) => {
                  setFiltrosAvancados(prev => ({
                    ...prev,
                    dataEspecifica: e.target.value,
                    dataInicio: '', // Limpa período quando seleciona data específica
                    dataFim: ''
                  }))
                  setCurrentPage(1)
                }}
              />
            </div>

            <div className="filtro-group">
              <label>Período - Início:</label>
              <input
                type="date"
                value={filtrosAvancados.dataInicio}
                onChange={(e) => {
                  setFiltrosAvancados(prev => ({
                    ...prev,
                    dataInicio: e.target.value,
                    dataEspecifica: '' // Limpa data específica quando seleciona período
                  }))
                  setCurrentPage(1)
                }}
              />
            </div>

            <div className="filtro-group">
              <label>Período - Fim:</label>
              <input
                type="date"
                value={filtrosAvancados.dataFim}
                onChange={(e) => {
                  setFiltrosAvancados(prev => ({
                    ...prev,
                    dataFim: e.target.value,
                    dataEspecifica: '' // Limpa data específica quando seleciona período
                  }))
                  setCurrentPage(1)
                }}
              />
            </div>

            <div className="filtro-group">
              <label>Cidade:</label>
              <input
                type="text"
                placeholder="Filtrar por cidade..."
                value={filtrosAvancados.cidade}
                onChange={(e) => {
                  setFiltrosAvancados(prev => ({ ...prev, cidade: e.target.value }))
                  setCurrentPage(1)
                }}
              />
            </div>

            <div className="filtro-group">
              <label>Estado:</label>
              <input
                type="text"
                placeholder="Filtrar por estado..."
                value={filtrosAvancados.estado}
                onChange={(e) => {
                  setFiltrosAvancados(prev => ({ ...prev, estado: e.target.value }))
                  setCurrentPage(1)
                }}
              />
            </div>

            <div className="filtro-group">
              <label>País:</label>
              <input
                type="text"
                placeholder="Filtrar por país..."
                value={filtrosAvancados.pais}
                onChange={(e) => {
                  setFiltrosAvancados(prev => ({ ...prev, pais: e.target.value }))
                  setCurrentPage(1)
                }}
              />
            </div>

            <div className="filtro-group">
              <label>Tipo de Pagamento:</label>
              <select
                value={filtrosAvancados.tipoPagamento}
                onChange={(e) => {
                  setFiltrosAvancados(prev => ({ ...prev, tipoPagamento: e.target.value }))
                  setCurrentPage(1)
                }}
              >
                <option value="Todos">Todos</option>
                <option value="paid">Pago</option>
                <option value="unpaid">Gratuito</option>
              </select>
            </div>
          </div>

          {/* Botão Adicionar ao Google Agenda */}
          <div className="acoes-filtros">
            <button
              onClick={adicionarAoGoogleAgenda}
              className="botao-google-agenda"
            >
              Adicionar ao Google Agenda ({Math.min(currentEvents.length, 5)} eventos)
            </button>

            <button
              onClick={limparFiltrosAvancados}
              className="botao-limpar-filtros"
            >
              Limpar Filtros
            </button>
          </div>

          {/* Informação sobre limite do Google Agenda */}
          <div className="info-limite">
            * O Google Agenda permite adicionar até 5 eventos por vez
          </div>
        </div>
      )}

      {/* Contagem de resultados e mensagem */}
      <div className="resultados-info">
        {eventosFiltradosOrdenados.length === 0 ? (
          <div className="nenhum-evento">
            <h3>Nenhum evento encontrado</h3>
            <p>Tente ajustar os filtros ou termos de busca</p>
          </div>
        ) : (
          <p className="contagem-resultados">
            {eventosFiltradosOrdenados.length} evento{eventosFiltradosOrdenados.length !== 1 ? 's' : ''} encontrado{eventosFiltradosOrdenados.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Cards - só mostra se houver resultados */}
      {eventosFiltradosOrdenados.length > 0 && (
        <>
          <div className="eventos-container">
            {currentEvents.map((event) => (
              <div key={event.id} className="evento-card">
                <h2>{event.name}</h2>
                <button className={`status-btn ${getStatusClass(event.status)}`}>{event.status}</button>

                <p className="data">
                  <strong>Data:</strong>{' '}
                  {event.endDate && event.startDate !== event.endDate
                    ? `${formatarData(event.startDate)} até ${formatarData(event.endDate)}`
                    : formatarData(event.startDate)}
                </p>

                <p className="tipo-pagamento">
                  <strong>Tipo:</strong> {event.paymentEventType === 'paid' ? 'Pago' : 'Gratuito'}
                </p>

                <p className="local">
                  <strong>Local:</strong> {event.eventsAddress ?
                    `${event.eventsAddress.city || ''}${event.eventsAddress.state ? ', ' + event.eventsAddress.state : ''}${event.eventsAddress.country ? ', ' + event.eventsAddress.country : ''}`
                    : 'Local não informado'}
                </p>

                <p className="descricao">
                  <strong>Descrição:</strong> {event.strippedDetail}
                </p>

                <p>
                  <strong>Link para inscrição:</strong>{' '}
                  <a href={event.newUrl} target="_blank" rel="noopener noreferrer">CLIQUE AQUI</a>
                </p>

                <button className="ler-mais-btn" onClick={() => abrirPopup(event)}>Ler mais</button>
              </div>
            ))}
          </div>

          {/* Paginação - só mostra se houver resultados */}
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
        </>
      )}

      {/* Popup */}
      {eventoSelecionado && (
        <div className="popup-overlay" onClick={fecharPopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>{eventoSelecionado.name}</h2>

            <div className="popup-body">
              {eventoSelecionado.cancelled && (
                <div style={{
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  marginBottom: '1rem',
                  fontWeight: 'bold'
                }}>
                  ⚠️ EVENTO CANCELADO
                </div>
              )}

              <p><strong>Status:</strong> {eventoSelecionado.status}</p>

              <p>
                <strong>Data:</strong>{' '}
                {eventoSelecionado.endDate && eventoSelecionado.startDate !== eventoSelecionado.endDate
                  ? `${formatarData(eventoSelecionado.startDate)} até ${formatarData(eventoSelecionado.endDate)}`
                  : formatarData(eventoSelecionado.startDate)}
              </p>

              <p><strong>Categoria:</strong> {eventoSelecionado.eventsCategory?.name || 'Não informada'}</p>

              <p><strong>Organizador:</strong> {eventoSelecionado.eventsHost?.name || 'Não informado'}</p>

              <p><strong>Tipo de Pagamento:</strong> {eventoSelecionado.paymentEventType === 'paid' ? 'Pago' : 'Gratuito'}</p>

              <p><strong>Cancelado:</strong> {eventoSelecionado.cancelled ? 'Sim' : 'Não'}</p>

              <p><strong>Local:</strong> {eventoSelecionado.eventsAddress ?
                `${eventoSelecionado.eventsAddress.city || ''}${eventoSelecionado.eventsAddress.state ? ', ' + eventoSelecionado.eventsAddress.state : ''}${eventoSelecionado.eventsAddress.country ? ', ' + eventoSelecionado.eventsAddress.country : ''}`
                : 'Local não informado'}</p>

              <p><strong>Descrição:</strong> {eventoSelecionado.strippedDetail}</p>

              <p>
                <strong>Link para inscrição:</strong>{' '}
                <a href={eventoSelecionado.newUrl} target="_blank" rel="noopener noreferrer">{eventoSelecionado.newUrl}</a>
              </p>
            </div>

            <button className="fechar-btn" onClick={fecharPopup}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  )
}