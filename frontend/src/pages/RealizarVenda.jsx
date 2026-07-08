import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, CheckCircle, Trash2, Search } from "lucide-react";
import "../styles/RealizarVenda.css";

export default function RealizarVenda() {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);
  const [cpf, setCpf] = useState("");
  const [cliente, setCliente] = useState(null);

  const API = "http://localhost:3000/cadastra";

  const getAuth = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const buscarCliente = async () => {
    if (!cpf.trim()) return;

    try {
      const response = await fetch(`${API}/clientes/cpf/${cpf}`, {
        headers: getAuth(),
      });

      if (response.status === 401) {
        alert("Sessão expirada.");
        navigate("/login");
        return;
      }

      if (!response.ok) throw new Error("Cliente não encontrado");

      const data = await response.json();
      setCliente(data);

      console.log("CLIENTE:", data); 

      alert("Cliente encontrado!");
    } catch (err) {
      alert(err.message);
      setCliente(null);
    }
  };

  const handleAddItem = async () => {
    if (!inputValue.trim()) return;

    let productCode = inputValue.trim();
    let quantity = 1;

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

    try {
      const response = await fetch(`${API}/produtos/${productCode}`, {
        headers: getAuth(),
      });

      if (response.status === 401) {
        alert("Sessão expirada.");
        navigate("/login");
        return;
      }

      if (!response.ok) throw new Error("Produto não encontrado");

      const product = await response.json();

      setItems((prev) => [
        ...prev,
        {
          id: Date.now(),
          id_produto: product.id_produto,
          name: product.nome,
          quantity,
          unitPrice: Number(product.preco_final || product.valor_final),
        },
      ]);

      setInputValue("");
    } catch (error) {
      alert(`Produto não encontrado: ${productCode}`);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAddItem();
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  async function finalizarVenda() {
  const token = localStorage.getItem("token");

  if (!cliente || !cliente.id_usuario) {
    alert("Busque um cliente válido antes de finalizar");
    return;
  }

  if (items.length === 0) {
    alert("Adicione produtos");
    return;
  }

  const produtosFormatados = items.map((item) => ({
    id_produto: item.id_produto,
    quantidade: item.quantity,
  }));

  try {
    const response = await fetch(`${API}/vendas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_cliente: cliente.id_usuario, 
        produtos: produtosFormatados,
        forma_de_pagamento: "Dinheiro",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.erro || errorData.message || "Erro ao finalizar venda");
    }

    alert("Venda realizada com sucesso!");

    setItems([]);
    setInputValue("");
    setCliente(null);
    setCpf("");
  } catch (err) {
    alert(`Erro ao finalizar venda: ${err.message}`);
  }
}

  const total = items.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice,
    0
  );

  return (
    <div className="venda-page-wrapper">
      <div className="venda-header">
        <button onClick={() => navigate("/menu")} className="venda-back-btn">
          <ArrowLeft size={18} />
          Voltar ao Menu
        </button>

        <h1 className="venda-title">Realizar Venda</h1>
      </div>

      <div className="venda-main-card">
        {/* ESQUERDA */}
        <div className="venda-col-left">
          {/* CPF */}
          <div className="venda-search-container">
            <input
              type="text"
              placeholder="Digite o CPF do cliente"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="venda-input"
            />
            <button onClick={buscarCliente} className="venda-include-btn">
              Buscar Cliente
            </button>
          </div>

          {cliente && (
            <p style={{ marginBottom: "15px", fontWeight: "bold", color: "#1e66ff" }}>
              ✓ Cliente Selecionado — ID: {cliente.id_usuario}
              {cliente.nome && ` | Nome: ${cliente.nome}`}
              {" | CPF: "}{cliente.cpf}
            </p>
          )}

          {/* PRODUTO */}
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

          {/* TABELA */}
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
                      <td>R$ {item.unitPrice.toFixed(2)}</td>
                      <td className="font-bold">
                        R$ {(item.quantity * item.unitPrice).toFixed(2)}
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

        {/* DIREITA */}
        <div className="venda-col-right">
          <div className="venda-logo-box">
            <div className="venda-avatar-wrapper">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150"
                alt="Logo"
                className="venda-avatar-img"
              />
            </div>
            <h2 className="venda-store-name">TechStore Ltda.</h2>
          </div>

          <div className="venda-total-box">
            <p className="venda-total-label">VALOR TOTAL DA COMPRA</p>
            <h2 className="venda-total-value">
              R$ {total.toFixed(2)}
            </h2>

            <button
              disabled={items.length === 0 || !cliente}
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
