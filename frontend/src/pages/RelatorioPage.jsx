import React from "react";
import ReportLayout from "../components/ReportLayout";

export default function RelatorioPage() {
  // 🔹 Exemplo de dados estáticos (substitua futuramente por fetch da API)
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da página */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-700 mb-2">
            Relatórios de Eventos Corporativos
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Visualize, analise e exporte informações detalhadas sobre os eventos registrados. 
            Use os filtros abaixo para ajustar o período e categorias desejadas.
          </p>
        </header>

        {/* Componente do Relatório */}
        <ReportLayout events={eventos} title="📊 Análise Detalhada de Eventos 2025" />
      </div>
    </div>
  );
}
