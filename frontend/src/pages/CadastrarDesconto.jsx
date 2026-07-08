import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Percent,
  Calendar,
  Tag,
  Activity,
  Save,
  Layers,
  ShoppingBag,
  DollarSign
} from "lucide-react";
import "../styles/CadastrarDesconto.css";

function CadastrarDesconto() {
  const navigate = useNavigate();
  const API_URL = "http://localhost:3000/cadastra/descontos";

  const estadoInicial = {
    data_inicio: "",
    data_fim: "",
    publico: "1",
    tipo_desconto: "categoria",
    id_categoria: "",
    porcentagem_desconto: "",
    id_produto: "",
    novo_valor: ""
  };

  const [form, setForm] = useState(estadoInicial);
  const [descontos, setDescontos] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const carregarDescontos = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        showToast("Sessão expirada. Faça login novamente.", "error");
        navigate("/login");
        return;
      }

      if (response.ok) {
        const data = await response.json();

        // ✅ CORREÇÃO AQUI
        setDescontos(data.descontos);
      }

    } catch (error) {
      console.error("Erro ao carregar descontos:", error);
      showToast("Erro ao carregar descontos", "error");
    }
  };

  useEffect(() => {
    carregarDescontos();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.status === 401) {
        showToast("Sessão expirada", "error");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.erro || "Erro ao criar desconto");
      }

      showToast("Desconto cadastrado com sucesso!");
      setForm(estadoInicial);
      carregarDescontos();

    } catch (err) {
      console.error(err);
      showToast(err.message, "error");
    }
  }

  return (
    <div className="container">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      <header className="header">
        <h1 className="title">Cadastrar Desconto</h1>
        <button className="voltarBtn" onClick={() => navigate("/menu")}>
          <ArrowLeft size={20} /> Voltar ao Menu
        </button>
      </header>

      <main>
        <div className="form-card">
          <form onSubmit={handleSubmit} className="form-grid">

            {/* DATA INICIO */}
            <div className="form-group">
              <label className="form-label">
                <Calendar size={18} /> Data Início *
              </label>
              <input
                className="form-input"
                type="date"
                name="data_inicio"
                value={form.data_inicio}
                onChange={handleChange}
                required
              />
            </div>

            {/* DATA FIM */}
            <div className="form-group">
              <label className="form-label">
                <Calendar size={18} /> Data Fim *
              </label>
              <input
                className="form-input"
                type="date"
                name="data_fim"
                value={form.data_fim}
                onChange={handleChange}
                required
              />
            </div>

            {/* PUBLICO */}
            <div className="form-group">
              <label className="form-label">
                <Activity size={18} /> Desconto Público?
              </label>
              <select
                className="form-input"
                name="publico"
                value={form.publico}
                onChange={handleChange}
              >
                <option value="1">Sim</option>
                <option value="0">Não</option>
              </select>
            </div>

            {/* TIPO */}
            <div className="form-group">
              <label className="form-label">
                <Tag size={18} /> Tipo de Desconto
              </label>
              <select
                className="form-input"
                name="tipo_desconto"
                value={form.tipo_desconto}
                onChange={handleChange}
              >
                <option value="categoria">Categoria</option>
                <option value="produto">Produto</option>
              </select>
            </div>

            {/* CATEGORIA */}
            {form.tipo_desconto === "categoria" && (
              <>
                <div className="form-group">
                  <label className="form-label">
                    <Layers size={18} /> ID Categoria
                  </label>
                  <input
                    className="form-input"
                    type="number"
                    name="id_categoria"
                    value={form.id_categoria}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Percent size={18} /> %
                  </label>
                  <input
                    className="form-input"
                    type="number"
                    name="porcentagem_desconto"
                    value={form.porcentagem_desconto}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            {/* PRODUTO */}
            {form.tipo_desconto === "produto" && (
              <>
                <div className="form-group">
                  <label className="form-label">
                    <ShoppingBag size={18} /> ID Produto
                  </label>
                  <input
                    className="form-input"
                    type="number"
                    name="id_produto"
                    value={form.id_produto}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <DollarSign size={18} /> Novo Valor
                  </label>
                  <input
                    className="form-input"
                    type="number"
                    step="0.01"
                    name="novo_valor"
                    value={form.novo_valor}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <button type="submit" className="btn-submit span-2">
              <Save size={20} /> Salvar
            </button>
          </form>
        </div>

        {/* LISTAGEM */}
        <h2 className="list-title">Descontos Ativos</h2>

        <ul className="discount-list">
          {descontos.length > 0 ? (
            descontos.map((desc) => (
              <li key={desc.id_desconto} className="discount-card">

                <div className="discount-header">
                  <span className="discount-name">
                    {desc.DescontoCategoria
                      ? `Categoria #${desc.DescontoCategoria.id_categoria}`
                      : `Produto #${desc.DescontoProduto?.id_produto}`}
                  </span>

                  <span className="discount-percent">
                    {desc.DescontoCategoria
                      ? `-${desc.DescontoCategoria.porcentagem_desconto}%`
                      : `R$ ${desc.DescontoProduto?.novo_valor}`}
                  </span>
                </div>

                <div className="discount-body">
                  <span>
                    {new Date(desc.data_inicio).toLocaleDateString("pt-BR")} até{" "}
                    {new Date(desc.data_fim).toLocaleDateString("pt-BR")}
                  </span>
                </div>

              </li>
            ))
          ) : (
            <p>Nenhum desconto cadastrado</p>
          )}
        </ul>
      </main>
    </div>
  );
}

export default CadastrarDesconto;
