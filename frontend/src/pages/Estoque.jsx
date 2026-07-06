import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Estoque.css"; 

function Estoque() {
  const navigate = useNavigate();
  const API_URL = "http://localhost:3000/cadastra/produtos";

  const [busca, setBusca] = useState("");
  const [estoque, setEstoque] = useState([]); 
  const [erro, setErro] = useState(null);

  const carregarEstoque = async () => {
    const token = localStorage.getItem("token"); 
    try {
      const response = await fetch(API_URL, {
        headers: { "Authorization": `Bearer ${token}` }
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

  useEffect(() => { carregarEstoque(); }, []);

  const filtrado = estoque.filter(p =>
    p.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    // 1. Adicionada a classe .container
    <div className="container"> 
      
      {/* 2. Estrutura do .header e .title */}
      <header className="header">
        <h1 className="title">Estoque</h1>
        <button onClick={() => navigate("/menu")} className="voltarBtn">
          ⬅ Voltar ao Menu
        </button>
      </header>

      {/* 3. Estrutura da .toolbar e .searchInput */}
      <div className="toolbar">
        <input
          type="text"
          placeholder="Buscar produto pelo nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="searchInput"
        />
      </div>

      {erro && <p className="text-danger" style={{ marginBottom: "16px" }}>{erro}</p>}

      {/* 4. Estrutura do .tableWrapper e .table (Removido o border="1" antigo) */}
      <div className="tableWrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID / Código</th>
              <th>Nome</th>
              <th>Qtd Atual</th>
              <th>Mínimo</th>
              <th>Preço</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filtrado.length > 0 ? (
              filtrado.map(p => {
                // Lógica de status inteligente baseada nas suas classes de badge
                let badgeClass = "badge-normal";
                let statusText = "OK";
                let isCritical = false;

                if (p.estoque === 0) {
                  badgeClass = "badge-esgotado";
                  statusText = "Esgotado";
                  isCritical = true;
                } else if (p.estoque < p.minimo) {
                  badgeClass = "badge-baixo";
                  statusText = "Baixo";
                  isCritical = true;
                } else if (p.estoque === p.minimo) {
                  badgeClass = "badge-atencao";
                  statusText = "Atenção";
                }

                return (
                  <tr key={p.id || p._id}>
                    <td>{p.codigo || p.id || p._id}</td>
                    {/* Se o estoque estiver baixo, o nome ganha a classe text-danger do seu CSS */}
                    <td className={isCritical ? "text-danger" : ""}>{p.nome}</td>
                    <td><strong>{p.estoque}</strong></td>
                    <td>{p.minimo}</td>
                    <td>R$ {p.preco}</td>
                    <td>
                      {/* Aplicando os seus lindos badges coloridos aqui */}
                      <span className={`badge ${badgeClass}`}>
                        {statusText}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "32px", color: "#7e8a96" }}>
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