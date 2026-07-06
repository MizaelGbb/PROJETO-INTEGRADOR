import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  PackagePlus, 
  Hash, 
  DollarSign, 
  FileText, 
  Save 
} from "lucide-react";
import "../styles/IncluirProdutos.css";

function IncluirProdutos() {
  const navigate = useNavigate();
  
  // ⚠️ ATENÇÃO: Ajuste esta URL para a rota correta do seu backend
  const API_URL = "http://localhost:3000/entradas";

  const estadoInicial = {
    produto: "",
    quantidade: "",
    custo: "",
    observacoes: ""
  };

  const [form, setForm] = useState(estadoInicial);
  const [toast, setToast] = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

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
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (response.status === 401) {
        showToast("Sessão expirada. Faça login novamente.", "error");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Erro na requisição");
      }

      showToast("Entrada de estoque registrada com sucesso!");
      setForm(estadoInicial); // Limpa o formulário

    } catch (err) {
      showToast("Erro ao registrar entrada", "error");
      console.error(err);
    }
  }

  return (
    <div className="container">
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      <header className="header">
        <h1 className="title">Entrada de Estoque</h1>
        <button className="voltarBtn" onClick={() => navigate("/menu")}>
          <ArrowLeft size={20} /> Voltar ao Menu
        </button>
      </header>

      <main>
        <div className="form-card">
          <form onSubmit={handleSubmit} className="form-grid">
            
            <div className="form-group span-2">
              <label className="form-label">
                <PackagePlus size={18} /> Nome / ID do Produto
              </label>
              <input 
                className="form-input" 
                name="produto" 
                value={form.produto}
                placeholder="Ex: Capa Protetora Transparente" 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Hash size={18} /> Quantidade
              </label>
              <input 
                className="form-input" 
                name="quantidade" 
                type="number" 
                value={form.quantidade}
                placeholder="0" 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <DollarSign size={18} /> Custo Unitário (R$)
              </label>
              <input 
                className="form-input" 
                name="custo" 
                type="number" 
                step="0.01"
                value={form.custo}
                placeholder="0.00" 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group span-2">
              <label className="form-label">
                <FileText size={18} /> Observações
              </label>
              <textarea 
                className="form-input" 
                name="observacoes" 
                value={form.observacoes}
                placeholder="Motivo da entrada, número da nota fiscal, etc..." 
                onChange={handleChange} 
              />
            </div>

            <button type="submit" className="btn-submit span-2">
              <Save size={20} /> Registrar Entrada
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}

export default IncluirProdutos;