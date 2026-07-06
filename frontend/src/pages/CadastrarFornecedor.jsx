import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Building2, 
  Save, 
  Eraser, 
  Phone, 
  Mail, 
  CreditCard 
} from "lucide-react"; 
import "../styles/CadastrarFornecedor.css";

function CadastrarFornecedor() {
  const navigate = useNavigate();
  const API_URL = "http://localhost:3000/cadastra/fornecedores";

  // Alinhado estritamente com os campos do modelo Sequelize
  const estadoInicial = {
    nome: "",
    email: "",
    telefone: "",
    cnpj: ""
  };

  const [form, setForm] = useState(estadoInicial);
  const [fornecedores, setFornecedores] = useState([]);
  const [toast, setToast] = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  const carregarFornecedores = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(API_URL, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.status === 401) {
        showToast("Sessão expirada. Faça login novamente.", "error");
        navigate("/login");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setFornecedores(data);
      }
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
    }
  };

  useEffect(() => {
    carregarFornecedores();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function limparFormulario() {
    setForm(estadoInicial);
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
        showToast("Você não tem permissão para cadastrar fornecedores.", "error");
        return;
      }

      if (!response.ok) throw new Error("Erro na requisição");

      showToast("Fornecedor cadastrado com sucesso!");
      limparFormulario();
      carregarFornecedores();

    } catch (err) {
      showToast("Erro ao cadastrar fornecedor", "error");
    }
  }

  return (
    <div className="container">
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      <header className="header">
        <h1 className="title">
          <span style={{ color: "#ff5500", marginRight: "8px" }}>🚚</span> CADASTRAR FORNECEDOR
        </h1>
        <button className="voltarBtn" onClick={() => navigate("/menu")}>
          <ArrowLeft size={16} /> Voltar ao Menu Geral
        </button>
      </header>

      <main>
        <div className="form-card">
          <div className="card-banner">
            <Building2 size={32} />
            <div>
              <p className="banner-subtitle">Gerenciamento de Fornecedores</p>
              <h2 className="banner-title">Novo Fornecedor</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="form-grid">
            
            <h2 className="section-header">
              Dados Obrigatórios
            </h2>

            {/* Nome ocupa 2 colunas para manter o equilíbrio visual */}
            <div className="form-group span-2">
              <label className="form-label">Nome / Razão Social *</label>
              <input 
                className="form-input" 
                placeholder="Nome completo ou Razão Social" 
                name="nome" 
                value={form.nome} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group span-1">
              <label className="form-label">CNPJ *</label>
              <input 
                className="form-input" 
                placeholder="Apenas os 14 números" 
                name="cnpj" 
                maxLength="14"
                value={form.cnpj} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group span-2">
              <label className="form-label">E-mail *</label>
              <input 
                className="form-input" 
                type="email"
                placeholder="contato@fornecedor.com" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group span-1">
              <label className="form-label">Telefone *</label>
              <input 
                className="form-input" 
                placeholder="(00) 0000-0000" 
                name="telefone" 
                value={form.telefone} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-clear" onClick={limparFormulario}>
                <Eraser size={16} /> Limpar Formulário
              </button>
              <button type="submit" className="btn-submit">
                <Save size={16} /> Salvar Fornecedor
              </button>
            </div>

          </form>
        </div>

        <hr style={{ border: "1px solid #eaedf1", margin: "40px 0" }} />

        <h2 className="list-title">Fornecedores Cadastrados</h2>

        <ul className="supplier-list">
          {fornecedores.length > 0 ? (
            fornecedores.map((f) => (
              <li className="supplier-item" key={f.id_fornecedor || f.id}>
                <div className="supplier-header">
                  <span className="supplier-name">{f.nome}</span>
                </div>
                <div className="supplier-details">
                  <span><CreditCard size={16} color="#7e8a96" /> CNPJ: {f.cnpj}</span>
                  <span><Phone size={16} color="#7e8a96" /> {f.telefone}</span>
                  <span><Mail size={16} color="#7e8a96" /> {f.email}</span>
                </div>
              </li>
            ))
          ) : (
            <p style={{ color: "#7e8a96" }}>Nenhum fornecedor cadastrado no momento.</p>
          )}
        </ul>
      </main>
    </div>
  );
}

export default CadastrarFornecedor;