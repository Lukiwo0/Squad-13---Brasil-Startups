import React, { useState, useMemo, useEffect } from 'react'
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
  const [eventos, setEventos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [eventosSelecionados, setEventosSelecionados] = useState(new Set())

  const eventsPerPage = 20

  // Buscar eventos da API
  useEffect(() => {
    const buscarEventos = async () => {
      try {
        setCarregando(true)
        setErro(null)
        const resposta = await fetch('http://localhost:3000/events')

        if (!resposta.ok) {
          throw new Error(`Erro HTTP: ${resposta.status}`)
        }

        const dados = await resposta.json()

        // Mapear os dados da API para a estrutura esperada pelo componente
        const eventosFormatados = dados.map(evento => ({
          id: evento.id,
          name: evento.nome,
          newUrl: evento.url,
          startDate: evento.inicio,
          endDate: evento.fim,
          eventsCategory: { name: evento.categoria },
          eventsHost: { name: evento.organizador },
          paymentEventType: evento.pago ? 'paid' : 'unpaid',
          cancelled: false,
          strippedDetail: evento.descricao,
          eventsAddress: {
            city: evento.cidade,
            state: evento.estado,
            country: evento.pais
          }
        }))

        setEventos(eventosFormatados)
      } catch (error) {
        console.error('Erro ao buscar eventos:', error)
        setErro(`Erro ao carregar eventos: ${error.message}`)
        setEventos([
          {
            id: 1,
            name: 'Evento de Exemplo (API Offline)',
            newUrl: '#',
            startDate: '2025-01-01',
            endDate: '2025-01-01',
            eventsCategory: { name: 'Exemplo' },
            eventsHost: { name: 'Organizador Exemplo' },
            paymentEventType: 'unpaid',
            cancelled: false,
            strippedDetail: 'Este é um evento de exemplo porque a API não está disponível.',
            eventsAddress: {
              city: 'São Paulo',
              state: 'SP',
              country: 'Brasil'
            }
          }
        ])
      } finally {
        setCarregando(false)
      }
    }

    buscarEventos()
  }, [])

  // Função para determinar o status baseado nas datas
  const getStatus = (event) => {
    const hoje = new Date()
    const startDate = new Date(event.startDate)
    const endDate = new Date(event.endDate)

    if (hoje < startDate) return 'Agendado'
    if (hoje >= startDate && hoje <= endDate) return 'Em andamento'
    return 'Encerrado'
  }

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

  // Função para formatar data no formato Google Calendar (YYYYMMDDTHHmmssZ)
  const formatarDataGoogleCalendar = (dataISO) => {
    if (!dataISO) return ''
    const data = new Date(dataISO)
    return data.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  }

  // Função para normalizar texto
  const normalizarTexto = (texto) => {
    if (!texto) return ''
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[ç]/g, 'c')
  }

  // Função para converter entidades HTML
  const converterEntidadesHTML = (texto) => {
    if (!texto) return '';
    return texto
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x200B;/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Função para criar URL do Google Agenda
  const criarUrlGoogleAgenda = (evento) => {
    const texto = encodeURIComponent(evento.name)
    const datas = `&dates=${formatarDataGoogleCalendar(evento.startDate)}/${formatarDataGoogleCalendar(evento.endDate || evento.startDate)}`
    const detalhes = encodeURIComponent(
      `${evento.strippedDetail || 'Evento encontrado através do sistema de busca.'}\n\n` +
      `Organizador: ${evento.eventsHost?.name || 'Não informado'}\n` +
      `Categoria: ${evento.eventsCategory?.name || 'Não informada'}\n` +
      `Tipo: ${evento.paymentEventType === 'paid' ? 'Pago' : 'Gratuito'}\n` +
      `Local: ${evento.eventsAddress ?
        `${evento.eventsAddress.city || ''}${evento.eventsAddress.state ? ', ' + evento.eventsAddress.state : ''}${evento.eventsAddress.country ? ', ' + evento.eventsAddress.country : ''}`
        : 'Local não informado'}\n` +
      `Link: ${evento.newUrl}`
    )
    const local = encodeURIComponent(
      evento.eventsAddress ?
        `${evento.eventsAddress.city || ''}${evento.eventsAddress.state ? ', ' + evento.eventsAddress.state : ''}${evento.eventsAddress.country ? ', ' + evento.eventsAddress.country : ''}`
        : ''
    )

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${texto}${datas}&details=${detalhes}&location=${local}`
  }

  // Função para adicionar evento ao Google Agenda
  const adicionarEventoGoogleAgenda = (evento) => {
    const url = criarUrlGoogleAgenda(evento)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  // Função para adicionar múltiplos eventos ao Google Agenda
  const adicionarMultiplosAoGoogleAgenda = () => {
    const eventosParaAgenda = currentEvents
      .filter(evento => eventosSelecionados.has(evento.id))
      .slice(0, 5) // Limite do Google Agenda

    if (eventosParaAgenda.length === 0) {
      alert('Selecione pelo menos um evento para adicionar ao Google Agenda!')
      return
    }

    // Abre cada evento em uma nova aba
    eventosParaAgenda.forEach((evento, index) => {
      setTimeout(() => {
        adicionarEventoGoogleAgenda(evento)
      }, index * 1000) // Delay de 1 segundo entre cada abertura
    })

    // Feedback para o usuário
    alert(`${eventosParaAgenda.length} eventos serão abertos no Google Agenda. \n\nPor favor, confirme a adição de cada evento individualmente.`)

    // Limpa seleção após adicionar
    setEventosSelecionados(new Set())
  }

  // Função para selecionar/deselecionar evento
  const toggleSelecionarEvento = (eventoId) => {
    const novosSelecionados = new Set(eventosSelecionados)
    if (novosSelecionados.has(eventoId)) {
      novosSelecionados.delete(eventoId)
    } else {
      if (novosSelecionados.size < 5) {
        novosSelecionados.add(eventoId)
      } else {
        alert('Você pode selecionar no máximo 5 eventos por vez!')
      }
    }
    setEventosSelecionados(novosSelecionados)
  }

  // Função para selecionar todos os eventos da página
  const selecionarTodosDaPagina = () => {
    const eventosDaPagina = currentEvents.map(event => event.id)
    const novosSelecionados = new Set(eventosSelecionados)

    // Adiciona apenas os que ainda não estão selecionados e não excede o limite
    eventosDaPagina.forEach(id => {
      if (novosSelecionados.size < 5 && !novosSelecionados.has(id)) {
        novosSelecionados.add(id)
      }
    })

    setEventosSelecionados(novosSelecionados)
  }

  // Função para limpar seleção
  const limparSelecao = () => {
    setEventosSelecionados(new Set())
  }

  // Resto do código permanece igual...
  const ordenarEventos = (eventosArray) => {
    const statusOrder = { 'Em andamento': 1, 'Agendado': 2, 'Encerrado': 3 }

    return [...eventosArray].sort((a, b) => {
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status]
      }
      const dataA = new Date(a.startDate)
      const dataB = new Date(b.startDate)
      return ordem === 'Mais antigo' ? dataB - dataA : dataA - dataB
    })
  }

  const eventosFiltrados = useMemo(() => {
    return eventosComStatus.filter((event) => {
      const buscaMatch = normalizarTexto(event.name).includes(normalizarTexto(busca))
      const statusMatch = filtroStatus === 'Todos' || event.status === filtroStatus
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

  if (carregando) {
    return (
      <div className="eventos-wrapper">
        <div className="carregando">
          <div className="spinner"></div>
          <h3>Carregando eventos...</h3>
          <p>Aguarde enquanto buscamos os dados mais recentes.</p>
        </div>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="eventos-wrapper">
        <div className="erro-carregamento">
          <h3>{erro}</h3>
          <p>Usando dados de exemplo para demonstração.</p>
        </div>
      </div>
    )
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

          {/* Controles de Seleção */}
          <div className="controles-selecao">
            <div className="info-selecao">
              <span>
                {eventosSelecionados.size} de {Math.min(currentEvents.length, 5)} eventos selecionados
              </span>
            </div>
            <div className="botoes-selecao">
              <button
                onClick={selecionarTodosDaPagina}
                className="botao-selecionar-todos"
                disabled={eventosSelecionados.size >= 5}
              >
                Selecionar Todos ({Math.min(currentEvents.length, 5)})
              </button>
              <button
                onClick={limparSelecao}
                className="botao-limpar-selecao"
              >
                Limpar Seleção
              </button>
            </div>
          </div>

          {/* Botão Adicionar ao Google Agenda */}
          <div className="acoes-filtros">
            <button
              onClick={adicionarMultiplosAoGoogleAgenda}
              className="botao-google-agenda"
              disabled={eventosSelecionados.size === 0}
            >
              📅 Adicionar ao Google Agenda ({eventosSelecionados.size} eventos)
            </button>

            <button
              onClick={limparFiltrosAvancados}
              className="botao-limpar-filtros"
            >
              Limpar Filtros
            </button>
          </div>

          <div className="info-limite">
            * Selecione até 5 eventos para adicionar ao Google Agenda
          </div>
        </div>
      )}

      {/* Contagem de resultados */}
      <div className="resultados-info">
        {eventosFiltradosOrdenados.length === 0 ? (
          <div className="nenhum-evento">
            <h3>Nenhum evento encontrado</h3>
            <p>Tente ajustar os filtros ou termos de busca</p>
          </div>
        ) : (
          <p className="contagem-resultados">
            {eventosFiltradosOrdenados.length} evento{eventosFiltradosOrdenados.length !== 1 ? 's' : ''} encontrado{eventosFiltradosOrdenados.length !== 1 ? 's' : ''}
            {eventosSelecionados.size > 0 && ` • ${eventosSelecionados.size} selecionado${eventosSelecionados.size !== 1 ? 's' : ''}`}
          </p>
        )}
      </div>

      {/* Cards dos Eventos */}
      {eventosFiltradosOrdenados.length > 0 && (
        <>
          <div className="eventos-container">
            {currentEvents.map((event) => (
              <div
                key={event.id}
                className={`evento-card ${mostrarFiltrosAvancados && eventosSelecionados.has(event.id) ? 'selecionado' : ''}`}
              >
                {/* Checkbox de seleção */}
                {mostrarFiltrosAvancados && (

                  <div className="selecao-evento">
                    <input
                      type="checkbox"
                      checked={eventosSelecionados.has(event.id)}
                      onChange={() => toggleSelecionarEvento(event.id)}
                      disabled={!eventosSelecionados.has(event.id) && eventosSelecionados.size >= 5}
                    />
                    <span className="label-selecao">Selecionar para Google Agenda</span>
                  </div>
                )}

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
                  <strong>Descrição:</strong> {converterEntidadesHTML(event.strippedDetail)}
                </p>

                <p>
                  <strong>Link para inscrição:</strong>{' '}
                  <a href={event.newUrl} target="_blank" rel="noopener noreferrer">CLIQUE AQUI</a>
                </p>

                <div className="botoes-acoes">
                  <button
                    className="botao-google-individual"
                    onClick={() => adicionarEventoGoogleAgenda(event)}
                  >
                    📅 Google Agenda
                  </button>
                  <button className="ler-mais-btn" onClick={() => abrirPopup(event)}>Ler mais</button>
                </div>
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

            <div className="botoes-popup">
              <button
                className="botao-google-popup"
                onClick={() => {
                  adicionarEventoGoogleAgenda(eventoSelecionado)
                  fecharPopup()
                }}
              >
                📅 Adicionar ao Google Agenda
              </button>
              <button className="fechar-btn" onClick={fecharPopup}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}






