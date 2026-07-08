import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Estoque.css";

function Estoque() {
  const navigate = useNavigate();

  const API_URL = "http://localhost:3000/cadastra/produtos";

  const [busca, setBusca] = useState("");
  const [estoque, setEstoque] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  const carregarEstoque = async () => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        alert("Sessão expirada.");
        navigate("/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Erro ao carregar estoque");
      }

      setEstoque(data);

    } catch (error) {
      console.error(error);
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  const carregarCategorias = async () => {
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

  } catch (error) {
    console.error(error);
  }
  };

  useEffect(() => {
  carregarEstoque();
  carregarCategorias();
  }, []);

  const filtrado = useMemo(() => {
  return estoque.filter((p) => {

    const nomeOk = p.nome
      ?.toLowerCase()
      .includes(busca.toLowerCase());

    const categoriaOk =
      categoriaSelecionada === "" ||
      p.id_categoria === Number(categoriaSelecionada);

    return nomeOk && categoriaOk;

  });
  }, [estoque, busca, categoriaSelecionada]);

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
          placeholder="Buscar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="searchInput"
        />

        <select
          className="searchInput"
          value={categoriaSelecionada}
          onChange={(e) => setCategoriaSelecionada(e.target.value)}
        >
          <option value="">
            Todas as categorias
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

      {erro && <p className="text-danger">{erro}</p>}
      {loading && <p>Carregando...</p>}

      <div className="tableWrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Quantidade</th>
              <th>Preço</th>
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

                  {/* PREÇO */}
                  <td>
                    {p.preco_final !== p.preco_original && (
                      <div style={{
                        fontSize: "12px",
                        textDecoration: "line-through",
                        color: "#888"
                      }}>
                        R$ {Number(p.preco_original).toFixed(2)}
                      </div>
                    )}

                    <div>
                      R$ {Number(p.preco_final).toFixed(2)}
                    </div>
                  </td>

                  <td>{p.categoria?.nome || "Sem categoria"}</td>
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
