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

  // Alinhado com as colunas reais do DER fornecido
  const estadoInicial = {
    data_inicio: "",
    data_fim: "",
    publico: "1", // 1 para Sim (público), 0 para Não
    tipo_desconto: "categoria", // Controla a herança/tipo na interface
    
    // Campos da especialização 'desconto_categoria'
    id_categoria: "",
    porcentagem_desconto: "",
    
    // Campos da especialização 'desconto_produto'
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
        setDescontos(data);
      }
    } catch (error) {
      console.error("Erro ao carregar descontos:", error);
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

    // Limpa os campos da modalidade que NÃO foi escolhida antes de enviar para a API
    const payload = {
      data_inicio: form.data_inicio,
      data_fim: form.data_fim,
      publico: form.publico,
      tipo_desconto: form.tipo_desconto,
      ...(form.tipo_desconto === "categoria" 
        ? { id_categoria: form.id_categoria, porcentagem_desconto: form.porcentagem_desconto }
        : { id_produto: form.id_produto, novo_valor: form.novo_valor }
      )
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 401) {
        showToast("Você não tem permissão para fazer isso.", "error");
        return;
      }

      if (!response.ok) throw new Error("Erro na requisição");

      showToast("Desconto cadastrado com sucesso!");
      setForm(estadoInicial);
      carregarDescontos();

    } catch (err) {
      showToast("Erro ao cadastrar desconto", "error");
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
            
            {/* Campos da Tabela Pai (desconto) */}
            <div className="form-group">
              <label className="form-label">
                <Calendar size={18} /> Data Início *
              </label>
              <input className="form-input" type="date" name="data_inicio" value={form.data_inicio} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar size={18} /> Data Fim *
              </label>
              <input className="form-input" type="date" name="data_fim" value={form.data_fim} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Activity size={18} /> Desconto Público?
              </label>
              <select className="form-input" name="publico" value={form.publico} onChange={handleChange}>
                <option value="1">Sim (Disponível no app)</option>
                <option value="0">Não (Restrito/Privado)</option>
              </select>
            </div>

            {/* Seletor de Especialização (Herança do DER) */}
            <div className="form-group">
              <label className="form-label">
                <Tag size={18} /> Aplicar Desconto em:
              </label>
              <select className="form-input" name="tipo_desconto" value={form.tipo_desconto} onChange={handleChange}>
                <option value="categoria">Categoria Inteira</option>
                <option value="produto">Produto Específico</option>
              </select>
            </div>

            {/* CONDICIONAL: SE FOR DESCONTO POR CATEGORIA */}
            {form.tipo_desconto === "categoria" ? (
              <>
                <div className="form-group">
                  <label className="form-label">
                    <Layers size={18} /> ID da Categoria *
                  </label>
                  <input className="form-input" type="number" name="id_categoria" value={form.id_categoria} placeholder="Ex: 3" onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Percent size={18} /> Porcentagem Desconto (%) *
                  </label>
                  <input className="form-input" type="number" name="porcentagem_desconto" value={form.porcentagem_desconto} placeholder="Ex: 15" onChange={handleChange} required />
                </div>
              </>
            ) : (
              /* CONDICIONAL: SE FOR DESCONTO POR PRODUTO */
              <>
                <div className="form-group">
                  <label className="form-label">
                    <ShoppingBag size={18} /> ID do Produto *
                  </label>
                  <input className="form-input" type="number" name="id_produto" value={form.id_produto} placeholder="Ex: 104" onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <DollarSign size={18} /> Novo Valor (R$) *
                  </label>
                  <input className="form-input" type="number" step="0.01" name="novo_valor" value={form.novo_valor} placeholder="Ex: 49.90" onChange={handleChange} required />
                </div>
              </>
            )}

            <button type="submit" className="btn-submit span-2">
              <Save size={20} /> Salvar Desconto
            </button>
          </form>
        </div>

        {/* Listagem Adaptada */}
        <h2 className="list-title">Descontos Ativos no Sistema</h2>
        
        <ul className="discount-list">
          {descontos.length > 0 ? (
            descontos.map((desc) => (
              <li className="discount-card" key={desc.id_desconto}>
                
                <div className="discount-header">
                  <div className="discount-title-group">
                    <span className="discount-name">
                      {desc.id_categoria ? `Desconto na Categoria #${desc.id_categoria}` : `Desconto no Produto #${desc.id_produto}`}
                    </span>
                    <span className="discount-coupon">
                      {desc.publico === 1 || desc.publico === "1" ? "Campanha Pública" : "Campanha Privada"}
                    </span>
                  </div>
                  <span className="discount-percent">
                    {desc.porcentagem_desconto ? `-${desc.porcentagem_desconto}%` : `R$ ${desc.novo_valor}`}
                  </span>
                </div>

                <div className="discount-body">
                  <span>
                    Vigência: {desc.data_inicio ? new Date(desc.data_inicio).toLocaleDateString('pt-BR') : 'N/A'} até {desc.data_fim ? new Date(desc.data_fim).toLocaleDateString('pt-BR') : 'N/A'}
                  </span>
                </div>

              </li>
            ))
          ) : (
            <p style={{ color: "#7e8a96" }}>Nenhum desconto encontrado no sistema.</p>
          )}
        </ul>
      </main>
    </div>
  );
}

export default CadastrarDesconto;