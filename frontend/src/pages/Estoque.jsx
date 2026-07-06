import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Estoque.css";

function Estoque() {
  const navigate = useNavigate();

  const API_URL = "http://localhost:3000/cadastra/produtos";
  const API_CATEGORIAS = "http://localhost:3000/cadastra/categorias";

  const [busca, setBusca] = useState("");
  const [estoque, setEstoque] = useState([]);
  const [categorias, setCategorias] = useState({});
  const [erro, setErro] = useState(null);

  // 🔥 CARREGA CATEGORIAS E TRANSFORMA EM MAPA {id: nome}
  const carregarCategorias = async () => {
    try {
      const token = localStorage.getItem("token");

const response = await fetch(API_CATEGORIAS, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      if (response.ok) {
        const data = await response.json();

        const mapa = {};
        data.forEach((c) => {
          mapa[c.id_categoria] = c.nome;
        });

        setCategorias(mapa);
      }
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    }
  };

  const carregarEstoque = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        alert("Sessão expirada. Faça login novamente.");
        navigate("/login");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setEstoque(data);
      } else {
        setErro("Erro ao carregar os dados do estoque.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErro("Falha na comunicação com o servidor.");
    }
  };

  useEffect(() => {
    carregarCategorias();
    carregarEstoque();
  }, []);

  const filtrado = estoque.filter((p) =>
    p.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Produtos</h1>

        <button onClick={() => navigate("/menu")} className="voltarBtn">
          ⬅ Voltar ao Menu
        </button>
      </header>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Buscar produto pelo nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="searchInput"
        />
      </div>

      {erro && (
        <p className="text-danger" style={{ marginBottom: "16px" }}>
          {erro}
        </p>
      )}

      <div className="tableWrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Quantidade</th>
              <th>Custo</th>
              <th>Valor Final</th>
              <th>Categoria</th>
            </tr>
          </thead>

          <tbody>
            {filtrado.length > 0 ? (
              filtrado.map((p) => (
                <tr key={p.id_produto}>
                  <td>{p.id_produto}</td>
                  <td>{p.nome}</td>
                  <td>{p.quantidade_atual}</td>
                  <td>R$ {Number(p.custo).toFixed(2)}</td>
                  <td>R$ {Number(p.valor_final).toFixed(2)}</td>

                  {/* 🔥 NOME VINDO DO BANCO VIA API */}
                  <td>{categorias[p.id_categoria] || "Carregando..."}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "32px" }}>
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Estoque;