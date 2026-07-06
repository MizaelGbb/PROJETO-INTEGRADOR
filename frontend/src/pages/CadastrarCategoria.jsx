import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  FolderOpen, 
  AlignLeft, 
  Save, 
  Tags 
} from "lucide-react"; // Importando os ícones
import "../styles/CadastrarCategoria.css"; // Importando o CSS

function CadastrarCategoria() {
  const navigate = useNavigate();

  // URL do seu backend
  const API_URL = "http://localhost:3000/cadastra/categorias"; 

  const [form, setForm] = useState({
    nome: "",
    descricao: ""
  });

  const [categorias, setCategorias] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const carregarCategorias = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(API_URL, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        showToast("Sessão expirada. Faça login novamente.", "error");
        navigate("/login");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setCategorias(data);
      }
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  useEffect(() => {
    carregarCategorias();
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
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(form)
      });

      if (response.status === 401) {
        showToast("Você não tem permissão para cadastrar categorias.", "error");
        return;
      }

      if (!response.ok) {
        throw new Error("Erro na requisição");
      }

      showToast("Categoria cadastrada com sucesso!");

      setForm({
        nome: "",
        descricao: ""
      });

      carregarCategorias();

    } catch (err) {
      showToast("Erro ao cadastrar categoria", "error");
    }
  }

  return (
    <div className="container">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      <header className="header">
        <h1 className="title">Cadastrar Categoria</h1>
        <button className="voltarBtn" onClick={() => navigate("/menu")}>
          <ArrowLeft size={20} /> Voltar ao Menu
        </button>
      </header>

      <main>
        {/* Formulário */}
        <div className="form-card">
          <form onSubmit={handleSubmit} className="form-grid">
            
            <div className="form-group">
              <label className="form-label">
                <FolderOpen size={18} /> Nome da Categoria
              </label>
              <input
                className="form-input"
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Ex: Capinhas de Celular"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <AlignLeft size={18} /> Descrição (Opcional)
              </label>
              <textarea
                className="form-input"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Detalhes sobre os produtos desta categoria..."
              />
            </div>

            <button type="submit" className="btn-submit">
              <Save size={20} /> Salvar Categoria
            </button>
          </form>
        </div>

        {/* Listagem */}
        <h2 className="list-title">Categorias Cadastradas</h2>

        <ul className="category-list">
          {categorias.length > 0 ? (
            categorias.map((cat) => (
              <li className="category-card" key={cat.id || cat._id}>
                <div className="category-header">
                  <Tags size={20} />
                  <span>{cat.nome}</span>
                </div>
                {cat.descricao && (
                  <p className="category-desc">{cat.descricao}</p>
                )}
              </li>
            ))
          ) : (
            <p style={{ color: "#7e8a96" }}>Nenhuma categoria encontrada no sistema.</p>
          )}
        </ul>
      </main>
    </div>
  );
}

export default CadastrarCategoria;