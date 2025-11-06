import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "../assets/styles/metricas.css"; // usa o mesmo CSS das métricas

export default function RelatorioPage() {
  const eventos = [
    {
      id: 1,
      title: "Startup Summit",
      date: "2025-03-10",
      city: "São Paulo",
      state: "SP",
      sector: "Tecnologia",
      type: "Conferência",
      source: "LinkedIn",
      attendees: 250,
    },
    {
      id: 2,
      title: "Meetup HealthTech",
      date: "2025-05-05",
      city: "Curitiba",
      state: "PR",
      sector: "Saúde",
      type: "Meetup",
      source: "Eventbrite",
      attendees: 80,
    },
    {
      id: 3,
      title: "AgroTech Brasil",
      date: "2025-07-12",
      city: "Ribeirão Preto",
      state: "SP",
      sector: "Agronegócio",
      type: "Feira",
      source: "Instagram",
      attendees: 150,
    },
    {
      id: 4,
      title: "EduCon Summit",
      date: "2025-08-22",
      city: "Porto Alegre",
      state: "RS",
      sector: "Educação",
      type: "Conferência",
      source: "Sympla",
      attendees: 120,
    },
  ];

  const dadosSetor = eventos.map((e) => ({
    name: e.sector,
    value: e.attendees,
  }));

  const dadosTipo = [
    { name: "Conferência", value: 2 },
    { name: "Meetup", value: 1 },
    { name: "Feira", value: 1 },
  ];

  const cores = ["#007bff", "#28a745", "#ffc107", "#17a2b8"];

  return (
    <div className="metricas-container">
      {/* Cabeçalho */}
      <div className="metricas-header">
        <h1>📈 Relatórios de Eventos Corporativos</h1>
        <p>
          Visualize e analise informações detalhadas sobre os eventos
          corporativos cadastrados.
        </p>
      </div>

      {/* Cards principais */}
      <div className="metricas-principais">
        <div className="card-metrica grande">
          <h3>Total de Eventos</h3>
          <div className="valor">{eventos.length}</div>
          <div className="descricao">cadastrados</div>
        </div>

        <div className="card-metrica">
          <h3>Total de Participantes</h3>
          <div className="valor">
            {eventos.reduce((acc, e) => acc + e.attendees, 0)}
          </div>
          <div className="descricao">pessoas</div>
        </div>

        <div className="card-metrica">
          <h3>Cidades Envolvidas</h3>
          <div className="valor">
            {new Set(eventos.map((e) => e.city)).size}
          </div>
          <div className="descricao">locais únicos</div>
        </div>

        <div className="card-metrica">
          <h3>Fontes de Dados</h3>
          <div className="valor">
            {new Set(eventos.map((e) => e.source)).size}
          </div>
          <div className="descricao">plataformas</div>
        </div>
      </div>

      {/* Gráficos */}
      <section className="secao-metricas">
        <h2>📊 Análises Visuais</h2>
        <div className="grid-duas-colunas">
          <div className="card-metrica">
            <h4>Participantes por Setor</h4>
            <BarChart width={400} height={250} data={dadosSetor}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#007bff" radius={[5, 5, 0, 0]} />
            </BarChart>
          </div>

          <div className="card-metrica">
            <h4>Distribuição por Tipo de Evento</h4>
            <PieChart width={400} height={250}>
              <Pie
                data={dadosTipo}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {dadosTipo.map((_, index) => (
                  <Cell key={index} fill={cores[index % cores.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      </section>

      {/* Lista de eventos */}
      <section className="secao-metricas">
        <h2>📅 Eventos Registrados</h2>
        <div className="lista-simples">
          {eventos.map((evento) => (
            <div key={evento.id} className="item-lista">
              <span className="label">
                <strong>{evento.title}</strong> — {evento.type}
              </span>
              <span className="valor">
                {evento.city}/{evento.state}
              </span>
              <span className="percentual">{evento.attendees} participantes</span>
            </div>
          ))}
        </div>
      </section>

      {/* Insights */}
      <section className="secao-metricas">
        <h2>💡 Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>🏆 Maior Público</h4>
            <p>
              O evento <strong>Startup Summit</strong> teve o maior número de
              participantes (250).
            </p>
          </div>
          <div className="insight-card">
            <h4>🌎 Maior Concentração</h4>
            <p>
              O estado de <strong>São Paulo</strong> aparece em 2 eventos,
              concentrando boa parte do público.
            </p>
          </div>
          <div className="insight-card">
            <h4>📈 Tendência</h4>
            <p>
              Eventos de <strong>Tecnologia</strong> continuam sendo os mais
              populares.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
