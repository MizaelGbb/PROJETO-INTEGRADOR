import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import "../styles/CadastrarProduto.css";

export default function CadastrarProduto() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    categoria: "",
    custo: "0.00",
    venda: "0.00",
    qtdInicial: "0",
    qtdEstoque: "0",
    qtdMinima: "5",
  });

  const [categorias, setCategorias] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function carregarCategorias() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      "http://localhost:3000/cadastra/categorias",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao carregar categorias");
    }

    const data = await response.json();

    setCategorias(data);

  } catch (err) {
    console.error(err);
    alert("Erro ao carregar categorias.");
  }
  }

  useEffect(() => {
  carregarCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Usuário não autenticado!");
        return navigate("/");
      }

      const response = await fetch(
        "http://localhost:3000/cadastra/produtos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome: form.nome,
            id_categoria: parseInt(form.categoria),
            custo: parseFloat(form.custo),
            valor_final: parseFloat(form.venda),
            estoque_minimo: parseInt(form.qtdMinima),
            quantidade_atual: parseInt(form.qtdEstoque),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Erro ao cadastrar produto");
      }

      alert("✅ Produto cadastrado com sucesso!");

      navigate("/menu");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="prod-container">
      {/* HEADER */}
      <header className="prod-header">
        <button onClick={() => navigate("/menu")} className="prod-back-btn">
          <ArrowLeft size={16} /> Voltar ao Menu Geral
        </button>
        <h1 className="prod-title">CADASTRAR PRODUTO</h1>
      </header>

      {/* CARD PRINCIPAL */}
      <div className="prod-card">
        {/* FORMULÁRIO */}
        <form onSubmit={handleSubmit} className="prod-col-left">
          <div className="prod-group full-width">
            <label className="prod-label">Nome do Produto *</label>
            <input
              className="prod-input"
              name="nome"
              placeholder="Ex: Smartphone X"
              value={form.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="prod-group">
            <label className="prod-label">Categoria *</label>
            <select
              className="prod-input"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Selecione uma categoria...
              </option>

              {categorias.map((categoria) => (
                <option
                  key={categoria.id_categoria}
                  value={categoria.id_categoria}
                >
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="prod-group">
            <label className="prod-label">Custo (R$)</label>
            <input
              className="prod-input"
              name="custo"
              type="number"
              step="0.01"
              value={form.custo}
              onChange={handleChange}
            />
          </div>

          <div className="prod-group">
            <label className="prod-label">Valor de Venda (R$) *</label>
            <input
              className="prod-input"
              name="venda"
              type="number"
              step="0.01"
              value={form.venda}
              onChange={handleChange}
              required
            />
          </div>

          <div className="prod-group">
            <label className="prod-label">Quantidade Inicial</label>
            <input
              className="prod-input"
              name="qtdInicial"
              type="number"
              value={form.qtdInicial}
              onChange={handleChange}
            />
          </div>

          <div className="prod-group">
            <label className="prod-label">Quantidade em Estoque *</label>
            <input
              className="prod-input"
              name="qtdEstoque"
              type="number"
              value={form.qtdEstoque}
              onChange={handleChange}
              required
            />
          </div>

          <div className="prod-group">
            <label className="prod-label">Quantidade Mínima</label>
            <input
              className="prod-input"
              name="qtdMinima"
              type="number"
              value={form.qtdMinima}
              onChange={handleChange}
            />
          </div>

          {/* BOTÃO AGORA DENTRO DO FORM */}
          <button type="submit" className="prod-submit-btn">
            <Save size={18} /> CONFIRMAR CADASTRO
          </button>
        </form>

        {/* COLUNA DIREITA */}
        <div className="prod-col-right">
          <div className="prod-group full-width">
            <label className="prod-label">Foto do Produto</label>
            <div className="prod-image-box">
              <img
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=300"
                alt="Preview do Produto"
                className="prod-preview-img"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}