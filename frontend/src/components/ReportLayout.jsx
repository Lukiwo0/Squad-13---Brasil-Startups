import React, { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid, Legend
} from "recharts";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// =========================
// COMPONENTE PRINCIPAL
// =========================
export default function ReportLayout({ events = [], title = "📊 Relatório de Análise de Eventos" }) {
  const [dateFrom, setDateFrom] = useState(earliestDate(events));
  const [dateTo, setDateTo] = useState(latestDate(events));
  const [city, setCity] = useState("");
  const [sector, setSector] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const cities = useMemo(() => uniqueSorted(events.map(e => e.city)), [events]);
  const sectors = useMemo(() => uniqueSorted(events.map(e => e.sector)), [events]);
  const types = useMemo(() => uniqueSorted(events.map(e => e.type)), [events]);

  const filtered = useMemo(() => {
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;
    return events
      .filter(e => {
        const d = new Date(e.date);
        if (from && d < startOfDay(from)) return false;
        if (to && d > endOfDay(to)) return false;
        if (city && e.city !== city) return false;
        if (sector && e.sector !== sector) return false;
        if (typeFilter && e.type !== typeFilter) return false;
        return true;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events, dateFrom, dateTo, city, sector, typeFilter]);

  const totalEvents = filtered.length;
  const eventsBySector = useMemo(() => countBy(filtered, "sector", "sector", "value"), [filtered]);
  const eventsByType = useMemo(() => countBy(filtered, "type", "name", "value"), [filtered]);
  const eventsByMonth = useMemo(() => countByMonth(filtered), [filtered]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const tableSlice = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  async function exportPDF() {
    const input = document.getElementById("report-root");
    if (!input) return;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`relatorio_eventos_${formatDateForFilename(new Date())}.pdf`);
  }

  function exportCSV() {
    const headers = ["id", "title", "date", "city", "state", "sector", "type", "source", "attendees"];
    const rows = filtered.map(e => headers.map(h => csvSafe(e[h])));
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `relatorio_eventos_${formatDateForFilename(new Date())}.csv`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 text-gray-800 font-inter">
      <div className="max-w-7xl mx-auto py-10 px-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">{title}</h1>
            <p className="text-sm text-gray-600 mt-1">
              Período: {dateFrom || "-"} — {dateTo || "-"}
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button onClick={exportCSV} className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              💾 Exportar CSV
            </button>
            <button onClick={exportPDF} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              📄 Exportar PDF
            </button>
          </div>
        </div>

        {/* FILTROS */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Input label="De" type="date" value={dateFrom} onChange={setDateFrom} />
            <Input label="Até" type="date" value={dateTo} onChange={setDateTo} />
            <Select label="Cidade" value={city} options={cities} onChange={setCity} />
            <Select label="Setor" value={sector} options={sectors} onChange={setSector} />
            <Select label="Tipo" value={typeFilter} options={types} onChange={setTypeFilter} />
          </div>
        </div>

        {/* CONTEÚDO DO RELATÓRIO */}
        <div id="report-root">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <KpiCard label="Total de eventos" value={totalEvents} icon="📅" />
            <KpiCard label="Cidades únicas" value={uniqueSorted(filtered.map(e => e.city)).length} icon="🏙️" />
            <KpiCard label="Período" value={`${dateFrom || "-"} — ${dateTo || "-"}`} icon="🕒" />
          </div>

          {/* GRÁFICOS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <ChartCard title="Eventos por Setor">
              <BarChartWrapper data={eventsBySector} xKey="sector" />
            </ChartCard>

            <ChartCard title="Distribuição por Tipo">
              <PieChartWrapper data={eventsByType} />
            </ChartCard>

            <ChartCard title="Evolução Mensal">
              <LineChartWrapper data={eventsByMonth} />
            </ChartCard>
          </div>

          {/* TABELA */}
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">📋 Tabela de Eventos</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border-collapse">
                <thead className="bg-gray-100">
                  <tr className="text-left border-b">
                    <th className="py-2 px-3">Data</th>
                    <th className="py-2 px-3">Título</th>
                    <th className="py-2 px-3">Cidade</th>
                    <th className="py-2 px-3">Setor</th>
                    <th className="py-2 px-3">Tipo</th>
                    <th className="py-2 px-3">Fonte</th>
                    <th className="py-2 px-3">Participantes</th>
                  </tr>
                </thead>
                <tbody>
                  {tableSlice.map((e, i) => (
                    <tr key={e.id} className={`${i % 2 ? "bg-gray-50" : "bg-white"} border-b hover:bg-blue-50`}>
                      <td className="py-2 px-3">{formatDateShort(e.date)}</td>
                      <td className="py-2 px-3 font-medium">{e.title}</td>
                      <td className="py-2 px-3">{e.city} / {e.state}</td>
                      <td className="py-2 px-3">{e.sector}</td>
                      <td className="py-2 px-3">{e.type}</td>
                      <td className="py-2 px-3">{e.source}</td>
                      <td className="py-2 px-3">{e.attendees ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            <div className="flex items-center justify-between mt-4 text-sm">
              <span className="text-gray-600">
                Mostrando {(currentPage - 1) * pageSize + 1} — {Math.min(currentPage * pageSize, filtered.length)} de {filtered.length}
              </span>
              <div className="flex gap-2">
                <button onClick={() => setPage(1)} className="px-2 py-1 border rounded">«</button>
                <button onClick={() => setPage(Math.max(1, currentPage - 1))} className="px-2 py-1 border rounded">‹</button>
                <span className="px-3">{currentPage} / {pageCount}</span>
                <button onClick={() => setPage(Math.min(pageCount, currentPage + 1))} className="px-2 py-1 border rounded">›</button>
                <button onClick={() => setPage(pageCount)} className="px-2 py-1 border rounded">»</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================
// SUBCOMPONENTES BONITOS
// =========================
const KpiCard = ({ label, value, icon }) => (
  <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
    <div className="flex items-center gap-3">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition">
    <h3 className="text-sm font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

const Input = ({ label, type, value, onChange }) => (
  <div>
    <label className="block text-xs text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

const Select = ({ label, value, options, onChange }) => (
  <div>
    <label className="block text-xs text-gray-600 mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option value="">Todos</option>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </div>
);

// =========================
// CHART WRAPPERS
// =========================
const BarChartWrapper = ({ data, xKey }) => (
  data.length ? (
    <ResponsiveContainer width="100%" height={230}>
      <BarChart data={data}>
        <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#3182CE" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  ) : <p className="text-sm text-gray-500">Sem dados</p>
);

const PieChartWrapper = ({ data }) => (
  data.length ? (
    <ResponsiveContainer width="100%" height={230}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
          {data.map((_, i) => <Cell key={i} fill={colorForIndex(i)} />)}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  ) : <p className="text-sm text-gray-500">Sem dados</p>
);

const LineChartWrapper = ({ data }) => (
  data.length ? (
    <ResponsiveContainer width="100%" height={230}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#2B6CB0" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  ) : <p className="text-sm text-gray-500">Sem dados</p>
);

// =========================
// HELPERS
// =========================
function earliestDate(events) {
  if (!events.length) return "";
  return new Date(Math.min(...events.map(e => new Date(e.date)))).toISOString().slice(0, 10);
}
function latestDate(events) {
  if (!events.length) return "";
  return new Date(Math.max(...events.map(e => new Date(e.date)))).toISOString().slice(0, 10);
}
function startOfDay(d) { const nd = new Date(d); nd.setHours(0, 0, 0, 0); return nd; }
function endOfDay(d) { const nd = new Date(d); nd.setHours(23, 59, 59, 999); return nd; }
function uniqueSorted(arr) { return Array.from(new Set(arr.filter(Boolean))).sort(); }
function csvSafe(v) { return `"${String(v || "").replace(/"/g, '""')}"`; }
function formatDateForFilename(d) { return d.toISOString().slice(0, 10).replace(/-/g, ""); }
function formatDateShort(iso) { return new Date(iso).toLocaleDateString(); }
function colorForIndex(i) {
  const palette = ["#4299E1", "#48BB78", "#F6AD55", "#9F7AEA", "#F56565", "#38B2AC"];
  return palette[i % palette.length];
}
function countBy(events, key, nameKey, valueKey) {
  const map = {};
  events.forEach(e => map[e[key]] = (map[e[key]] || 0) + 1);
  return Object.entries(map).map(([k, v]) => ({ [nameKey]: k, [valueKey]: v }));
}
function countByMonth(events) {
  const map = {};
  events.forEach(e => {
    const d = new Date(e.date);
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map[k] = (map[k] || 0) + 1;
  });
  return Object.entries(map)
    .map(([month, value]) => ({ month, value }))
    .sort((a, b) => a.month.localeCompare(b.month));
}
