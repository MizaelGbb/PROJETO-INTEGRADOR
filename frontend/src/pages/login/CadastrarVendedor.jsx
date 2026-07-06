import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Lock, UserPlus, Save } from "lucide-react";
import "../../styles/login/CadastrarVendedor.css";

export default function CadastrarVendedor() {
  const navigate = useNavigate();

  const estadoInicial = {
    nome: "",
    email: "",
    telefone: "",
    senha: "",
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

    const token = localStorage.getItem("token");

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
          tipo: "gerente",
        }),
      });


      if (!userRes.ok) {
        throw new Error("Falha ao criar o usuário base.");
      }
      const user = await userRes.json();

      // 2️⃣ Cria vendedor
      const vendRes = await fetch("http://localhost:3000/cadastra/vendedores", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id_usuario: user.id_usuario,
          tipo: "vendedor"
        }),
      });

      if (!vendRes.ok) throw new Error("Erro ao criar vendedor");

      showToast("Vendedor cadastrado com sucesso!");
      setForm(estadoInicial);
      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      console.error(err);
      showToast("Erro ao cadastrar vendedor", "error");
    }
  }

  return (
    <div className="container">
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      <header className="header">
        <h1 className="title">Cadastrar Vendedor</h1>
        <button className="voltarBtn" onClick={() => navigate("/menu")}>
          <ArrowLeft size={20} /> Voltar ao Menu
        </button>
      </header>

      <main>
        <div className="form-card">
          <form onSubmit={handleSubmit} className="form-grid">
            
            <div className="form-group">
              <label className="form-label"><User size={18} /> Nome Completo</label>
              <input className="form-input" name="nome" value={form.nome} placeholder="Ex: João da Silva" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label"><Mail size={18} /> E-mail</label>
              <input className="form-input" type="email" name="email" value={form.email} placeholder="joao@empresa.com" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label"><Phone size={18} /> Telefone</label>
              <input className="form-input" name="telefone" value={form.telefone} placeholder="(11) 99999-9999" onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label"><Lock size={18} /> Senha</label>
              <input className="form-input" type="password" name="senha" value={form.senha} placeholder="********" onChange={handleChange} required />
            </div>

            <button type="submit" className="btn-submit">
              <UserPlus size={20} /> Cadastrar Vendedor
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}