import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Filter,
  Download,
  DollarSign,
  CalendarDays,
  ShoppingBag,
  Clock
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

import "../styles/RelatorioVendas.css";

// ================== MOCK DATA (Fallback) ==================
const mockVendasMensais = [
  { mes: "Jan", vendas: 38000, pedidos: 130 },
  { mes: "Fev", vendas: 42000, pedidos: 145 },
  { mes: "Mar", vendas: 51000, pedidos: 180 },
  { mes: "Abr", vendas: 48000, pedidos: 165 },
  { mes: "Mai", vendas: 55000, pedidos: 210 },
  { mes: "Jun", vendas: 65200, affiliate: 240 },
];

const mockTopProdutos = [
  { id: 1, nome: "Smartphone Samsung Galaxy S23", cat: "Eletrônicos", qtd: 87, total: 434913.00, var: 12 },
  { id: 2, nome: "Carregador Turbo 25W", cat: "Acessórios", qtd: 214, total: 27792.60, var: 5 },
  { id: 3, nome: "Película de Vidro (S23)", cat: "Acessórios", qtd: 310, total: 9269.00, var: -3 },
  { id: 4, nome: "Fone de Ouvido Bluetooth XY", cat: "Acessórios", qtd: 76, total: 15192.40, var: 0 },
  { id: 5, nome: "Capa Protetora Transparente", cat: "Capinhas", qtd: 198, total: 9880.20, var: 8 },
];

const mockUltimasVendas = [
  { id: "V-00238", data: "25/06/2026 14:32", cliente: "João Mendes", itens: 3, total: 5249.80, pag: "Cartão Crédito", class: "pay-credit" },
  { id: "V-00237", data: "25/06/2026 13:15", cliente: "Maria Oliveira", itens: 1, total: 199.90, pag: "PIX", class: "pay-pix" },
  { id: "V-00236", data: "25/06/2026 11:47", cliente: "Carlos Souza", itens: 5, total: 289.50, pag: "Dinheiro", class: "pay-money" },
  { id: "V-00235", data: "24/06/2026 17:03", cliente: "Ana Lima", itens: 2, total: 5128.90, pag: "Cartão Crédito", class: "pay-credit" },
  { id: "V-00234", data: "24/06/2026 15:28", cliente: "Pedro Costa", itens: 1, total: 129.90, pag: "PIX", class: "pay-pix" },
];


// ================== CARD COMPONENT ==================
function StatCard({ label, value, sub, trend, active }) {
  return (
    <div className={`kpi-card ${active ? 'active' : 'neutral'}`}>
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">{value}</p>

      {trend !== undefined ? (
        <div className={`kpi-trend ${trend > 0 ? 'trend-up' : trend < 0 ? 'trend-down' : 'trend-neutral'}`}>
          {trend > 0 ? <TrendingUp size={14} /> : trend < 0 ? <TrendingDown size={14} /> : <Minus size={14} />}
          <span>{trend > 0 ? `+${trend}%` : `${trend}%`} {sub}</span>
        </div>
      ) : (
        <div className="kpi-trend trend-neutral">
          <span>{sub}</span>
        </div>
      )}
    </div>
  );
}


// ================== MAIN COMPONENT ==================
export default function RelatorioVendas() {
  const navigate = useNavigate();

  const [dados, setDados] = useState([]);
  const [topProdutos, setTopProdutos] = useState([]);
  const [ultimasVendas, setUltimasVendas] = useState([]);
  
  const [kpis, setKpis] = useState({
    vendas: "0,00",
    pedidos: 0,
    ticket: "0,00",
    produtos: 0,
  });

  useEffect(() => {
    async function fetchDados() {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:3000/relatorio", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Erro ao buscar relatório");

        const data = await res.json();

        setDados(data.vendasMensais || mockVendasMensais);
        setKpis(data.resumo || { vendas: "299.200,00", pedidos: "1.120", ticket: "267,14", produtos: "2.843" });
        setTopProdutos(data.topProdutos || mockTopProdutos);
        setUltimasVendas(data.ultimasVendas || mockUltimasVendas);

      } catch (err) {
        console.error("Usando dados mockados devido a erro na API:", err);
        setDados(mockVendasMensais);
        setKpis({ vendas: "299.200,00", pedidos: "1.120", ticket: "267,14", produtos: "2.843" });
        setTopProdutos(mockTopProdutos);
        setUltimasVendas(mockUltimasVendas);
      }
    }

    fetchDados();
  }, []);

  return (
    <div className="relatorio-wrapper">

      {/* HEADER */}
      <div className="relatorio-header">
        <button className="relatorio-back-btn" onClick={() => navigate("/menu")}>
          <ArrowLeft size={16} /> Voltar ao Menu Geral
        </button>

        <h1 className="relatorio-title">
          <BarChart3 size={24} /> Relatório de Vendas
        </h1>
      </div>

      {/* FILTROS */}
      <div className="relatorio-filters">
        <div className="filter-group-container">
          <div className="filter-group">
            <span className="filter-label">Período</span>
            <div className="filter-inputs-row">
              <input type="date" className="filter-input" defaultValue="2026-01-01" />
              <span style={{color: '#94a3b8', fontSize: 14}}>até</span>
              <input type="date" className="filter-input" defaultValue="2026-06-25" />
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Forma de Pagamento</span>
            <select className="filter-input" style={{width: 200}}>
              <option>Todas</option>
              <option>Cartão de Crédito</option>
              <option>PIX</option>
              <option>Dinheiro</option>
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button className="btn-filter"><Filter size={16} /> Filtrar</button>
          <button className="btn-export"><Download size={16} /> Exportar</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <StatCard label="Total em Vendas" value={`R$ ${kpis.vendas}`} sub="vs período anterior" trend={14.2} active={true} />
        <StatCard label="Pedidos Realizados" value={kpis.pedidos} sub="vs período anterior" trend={9.8} />
        <StatCard label="Ticket Médio" value={`R$ ${kpis.ticket}`} sub="vs período anterior" trend={-2.1} />
        <StatCard label="Produtos Vendidos" value={`${kpis.produtos} un.`} sub="em 6 meses" />
      </div>

      {/* GRÁFICOS */}
      <div className="charts-grid">
        
        {/* BARRAS */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title"><DollarSign size={18}/> Faturamento Mensal</h3>
            <span className="chart-badge">Jan - Jun 2026</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(val) => `R$${val/1000}k`} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: 8, border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
              <Bar dataKey="vendas" fill="#e11d48" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LINHA */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title"><ShoppingBag size={18}/> Quantidade de Pedidos</h3>
            <span className="chart-badge">Jan - Jun 2026</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
              <Tooltip contentStyle={{borderRadius: 8, border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
              <Line type="monotone" dataKey="pedidos" stroke="#e11d48" strokeWidth={3} dot={{r: 5, fill: '#e11d48', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 7}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PRODUTOS MAIS VENDIDOS */}
      <div className="table-section">
        <h3 className="table-section-title"><TrendingUp size={18} /> Produtos Mais Vendidos</h3>
        <div style={{overflowX: 'auto'}}>
          <table className="report-table">
            <thead>
              <tr>
                <th style={{width: '5%', textAlign: 'center'}}>#</th>
                <th style={{width: '35%'}}>Produto</th>
                <th style={{width: '20%'}}>Categoria</th>
                <th style={{width: '15%', textAlign: 'center'}}>Qtd. Vendida</th>
                <th style={{width: '15%', textAlign: 'right'}}>Total (R$)</th>
                <th style={{width: '10%', textAlign: 'center'}}>Variação</th>
              </tr>
            </thead>
            <tbody>
              {topProdutos.map((p, i) => (
                <tr key={p.id}>
                  <td style={{textAlign: 'center'}}>
                    <span className={`rank-badge rank-${i+1}`}>{i+1}</span>
                  </td>
                  <td style={{fontWeight: 600}}>{p.nome}</td>
                  <td style={{color: '#64748b'}}>{p.cat}</td>
                  <td style={{textAlign: 'center'}}>{p.qtd}</td>
                  <td style={{textAlign: 'right', fontWeight: 600}}>R$ {p.total.toFixed(2).replace('.', ',')}</td>
                  <td style={{textAlign: 'center'}}>
                    <span className={`var-badge ${p.var > 0 ? 'var-up' : p.var < 0 ? 'var-down' : 'var-neutral'}`}>
                      {p.var > 0 ? <TrendingUp size={12}/> : p.var < 0 ? <TrendingDown size={12}/> : <Minus size={12}/>}
                      {Math.abs(p.var)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ÚLTIMAS VENDAS */}
      <div className="table-section">
        <h3 className="table-section-title"><Clock size={18} /> Últimas Vendas Realizadas</h3>
        <div style={{overflowX: 'auto'}}>
          <table className="report-table">
            <thead>
              <tr>
                <th>Nº Venda</th>
                <th>Data / Hora</th>
                <th>Cliente</th>
                <th style={{textAlign: 'center'}}>Itens</th>
                <th style={{textAlign: 'right'}}>Total</th>
                <th style={{textAlign: 'center'}}>Pagamento</th>
              </tr>
            </thead>
            <tbody>
              {ultimasVendas.map((v) => (
                <tr key={v.id}>
                  <td style={{fontWeight: 600, color: '#e11d48'}}>{v.id}</td>
                  <td style={{color: '#64748b'}}>{v.data}</td>
                  <td style={{fontWeight: 500}}>{v.cliente}</td>
                  <td style={{textAlign: 'center'}}>{v.itens}</td>
                  <td style={{textAlign: 'right', fontWeight: 600}}>R$ {v.total.toFixed(2).replace('.', ',')}</td>
                  <td style={{textAlign: 'center'}}>
                    <span className={`pay-badge ${v.class}`}>{v.pag}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}