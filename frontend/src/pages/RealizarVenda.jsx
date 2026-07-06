import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, CheckCircle, Trash2, Search } from "lucide-react";
import "../styles/RealizarVenda.css"; // Certifique-se de que o nome do arquivo CSS bate com o seu

export default function RealizarVenda() {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);

  // URL do backend integrada aos produtos
  const API_URL = "http://localhost:3000/cadastra/produtos";
  const handleAddItem = async () => {
    if (!inputValue.trim()) return;

    let productCode = inputValue.trim();
    let quantity = 1;

    // Lógica para capturar multiplicador (ex: *2 1001 ou 2* 1001)
    if (productCode.includes("*")) {
      const parts = productCode.split("*");

      if (!isNaN(Number(parts[0].trim()))) {
        quantity = Number(parts[0].trim());
        productCode = parts[1].trim();
      } else if (!isNaN(Number(parts[1].trim()))) {
        quantity = Number(parts[1].trim());
        productCode = parts[0].trim();
      }
    }

    const token = localStorage.getItem("token");

    try {
      // Busca o produto no banco de dados passando o Token JWT
      const response = await fetch(`${API_URL}/${productCode}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        alert("Sessão expirada. Faça login novamente.");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Produto não encontrado");
      }

      const product = await response.json();

      setItems((prev) => [
        ...prev,
        {
          id: Date.now(),
          id_produto: product.id_produto,
          name: product.nome,
          quantity,
          unitPrice: Number(product.valor_final),
        },
      ]);

      setInputValue("");

    } catch (error) {
      console.error(error);
      alert(`Produto não encontrado: ${productCode}`);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  async function finalizarVenda() {
  const token = localStorage.getItem("token");
  const id_usuario = localStorage.getItem("id_usuario");

  try {
    const response = await fetch("http://localhost:3000/cadastra/vendas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_usuario,
        forma_de_pagamento: "Dinheiro", // depois podemos deixar o usuário escolher
        valor_total: total,
        produtos: items,
      }),
    });

    if (!response.ok) {
      throw new Error("Erro ao finalizar venda");
    }

    alert("Venda realizada com sucesso!");

    setItems([]);
    setInputValue("");

  } catch (err) {
    console.error(err);
    alert("Erro ao finalizar venda.");
  }
}

  // Cálculo do Total
  const total = items.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice,
    0
  );

  return (
    <div className="venda-page-wrapper">
      
      {/* HEADER */}
      <div className="venda-header">
        <button onClick={() => navigate("/menu")} className="venda-back-btn">
          <ArrowLeft size={18} />
          Voltar ao Menu
        </button>

        <h1 className="venda-title">Realizar Venda</h1>
      </div>

      <div className="venda-main-card">

        {/* COLUNA ESQUERDA (Lista e Busca) */}
        <div className="venda-col-left">

          {/* INPUT DE BUSCA */}
          <div className="venda-search-container">
            <div className="venda-input-wrapper">
              <Search size={20} className="venda-search-icon" />
              <input
                type="text"
                placeholder="Código ou Nome (ex: *2 123)"
                className="venda-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>

            <button onClick={handleAddItem} className="venda-include-btn">
              <Plus size={18} /> Incluir
            </button>
          </div>

          {/* TABELA / CONTAINER DOS ITENS */}
          <div className="venda-table-container">
            <table className="venda-table">
              <thead>
                <tr>
                  <th style={{ width: "12%", textAlign: "center" }}>Qtd</th>
                  <th style={{ width: "48%" }}>Produto</th>
                  <th style={{ width: "20%" }}>V. Unitário</th>
                  <th style={{ width: "20%" }}>V. Total</th>
                  {items.length > 0 && <th style={{ width: "5%" }}></th>}
                </tr>
              </thead>

              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="venda-empty-state">
                        <Search size={40} className="venda-empty-icon" />
                        <p>Nenhum item adicionado à venda.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td className="text-center font-bold">{item.quantity}</td>
                      <td>{item.name}</td>
                      <td>R$ {item.unitPrice.toFixed(2).replace('.', ',')}</td>
                      <td className="font-bold">
                        R$ {(item.quantity * item.unitPrice).toFixed(2).replace('.', ',')}
                      </td>
                      <td>
                        <button onClick={() => removeItem(item.id)} className="venda-delete-btn">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* COLUNA DIREITA (Logo e Totalizadores) */}
        <div className="venda-col-right">

          {/* BOX DO LOGO */}
          <div className="venda-logo-box">
            <div className="venda-avatar-wrapper">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150" 
                alt="Logo TechStore"
                className="venda-avatar-img"
              />
            </div>
            <h2 className="venda-store-name">TechStore Ltda.</h2>
          </div>

          {/* BOX DO TOTAL */}
          <div className="venda-total-box">
            <p className="venda-total-label">VALOR TOTAL DA COMPRA</p>
            <h2 className="venda-total-value">R$ {total.toFixed(2).replace('.', ',')}</h2>

            <button
              disabled={items.length === 0}
              className="venda-finish-btn"
              onClick={finalizarVenda}
            >
              <CheckCircle size={20} />
              FINALIZAR VENDA
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}