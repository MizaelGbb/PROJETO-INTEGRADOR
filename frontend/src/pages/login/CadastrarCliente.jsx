import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  CreditCard, 
  Save 
} from "lucide-react";
import "../../styles/login/CadastrarCliente.css"; // ⬅ Importando o CSS padronizado com o novo nome

export default function CadastrarCliente() { // ⬅ Nome da função atualizado
  const navigate = useNavigate();

  const estadoInicial = {
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    cpf: "",
  };

  const [form, setForm] = useState(estadoInicial);
  const [toast, setToast] = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

async function handleSubmit(e) {
  e.preventDefault();

    try {
      // 1️⃣ Cria usuário
      const userRes = await fetch("http://localhost:3000/auth/registrar", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          telefone: form.telefone,
          tipo: "cliente",
        }),
      });


      if (!userRes.ok) {
        throw new Error("Falha ao criar o usuário base.");
      }

      const user = await userRes.json();

      // 2️⃣ Cria cliente vinculando ao ID do usuário criado
      const clienteRes = await fetch("http://localhost:3000/cadastra/clientes", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id_usuario: user.id_usuario, // Puxa o ID gerado no passo 1
          cpf: form.cpf,
        }),
      });

      if (!clienteRes.ok) {
        throw new Error("Falha ao vincular o perfil de cliente.");
      }

      showToast("Cliente cadastrado com sucesso!");
      setForm(estadoInicial); // Limpa o formulário

      // Opcional: Redirecionar após sucesso. 
      // Se quiser que a pessoa continue na tela cadastrando mais, comente a linha abaixo.
      setTimeout(() => navigate("/login"), 1500); 

    } catch (err) {
      console.error(err);
      showToast("Erro ao cadastrar cliente. Verifique os dados.", "error");
    }
  }

  return (
    <div className="container">
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      <header className="header">
        <h1 className="title">Cadastrar Cliente</h1>
        <button className="voltarBtn" onClick={() => navigate("/login")}>
          <ArrowLeft size={20} /> Voltar ao Login
        </button>
      </header>

      <main>
        <div className="form-card">
          <form onSubmit={handleSubmit} className="form-grid">
            
            <div className="form-group span-2">
              <label className="form-label">
                <User size={18} /> Nome Completo
              </label>
              <input 
                className="form-input" 
                name="nome" 
                value={form.nome}
                placeholder="Ex: Carlos Eduardo Silva" 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail size={18} /> E-mail
              </label>
              <input 
                className="form-input" 
                type="email"
                name="email" 
                value={form.email}
                placeholder="carlos@exemplo.com" 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Phone size={18} /> Telefone
              </label>
              <input 
                className="form-input" 
                name="telefone" 
                value={form.telefone}
                placeholder="(11) 99999-9999" 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <CreditCard size={18} /> CPF
              </label>
              <input 
                className="form-input" 
                name="cpf" 
                value={form.cpf}
                placeholder="000.000.000-00" 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock size={18} /> Senha de Acesso
              </label>
              <input 
                className="form-input" 
                type="password" 
                name="senha" 
                value={form.senha}
                placeholder="Crie uma senha segura" 
                onChange={handleChange} 
                required 
              />
            </div>

            <button type="submit" className="btn-submit span-2">
              <Save size={20} /> Concluir Cadastro
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}