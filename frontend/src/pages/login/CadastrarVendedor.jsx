import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Lock, UserPlus } from "lucide-react";
import "../../styles/login/CadastrarVendedor.css";

export default function CadastrarVendedor() {
const navigate = useNavigate();

const estadoInicial = {
nome: "",
email: "",
telefone: "",
senha: "",
tipo: "vendedor",
};

const [form, setForm] = useState(estadoInicial);
const [toast, setToast] = useState(null);
const [loading, setLoading] = useState(false);

function showToast(msg, type = "success") {
setToast({ msg, type });
setTimeout(() => setToast(null), 3000);
}

function handleChange(e) {
setForm({ ...form, [e.target.name]: e.target.value });
}

async function handleSubmit(e) {
e.preventDefault();
if (loading) return;
    const token = localStorage.getItem("token");


setLoading(true);

try {
  const res = await fetch("http://localhost:3000/cadastra/vendedores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      nome: form.nome.trim(),
      email: form.email.trim(),
      senha: form.senha,
      telefone: form.telefone,
      tipo: form.tipo, // vendedor ou gerente
    }),
  });

  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("Resposta não é JSON:", text);
    throw new Error("Erro no servidor");
  }

  if (!res.ok) {
    throw new Error(data.erro || "Erro ao cadastrar");
  }

  showToast("Cadastro realizado com sucesso!");
  setForm(estadoInicial);

  setTimeout(() => navigate("/menu"), 1500);

} catch (err) {
  console.error(err);
  showToast(err.message, "error");
} finally {
  setLoading(false);
}

}

return ( <div className="container">
{toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

  <header className="header">
    <h1 className="title">Cadastrar Funcionário</h1>
    <button className="voltarBtn" onClick={() => navigate("/menu")}>
      <ArrowLeft size={20} /> Voltar
    </button>
  </header>

  <main>
    <div className="form-card">
      <form onSubmit={handleSubmit} className="form-grid">

        <div className="form-group">
          <label className="form-label"><User size={18}/> Nome</label>
          <input className="form-input" name="nome" value={form.nome} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label className="form-label"><Mail size={18}/> Email</label>
          <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label className="form-label"><Phone size={18}/> Telefone</label>
          <input className="form-input" name="telefone" value={form.telefone} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label"><Lock size={18}/> Senha</label>
          <input className="form-input" type="password" name="senha" value={form.senha} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label className="form-label">Tipo de Usuário</label>
          <select className="form-input" name="tipo" value={form.tipo} onChange={handleChange}>
            <option value="vendedor">Vendedor</option>
            <option value="gerente">Gerente</option>
          </select>
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          <UserPlus size={20}/> {loading ? "Salvando..." : "Cadastrar"}
        </button>

      </form>
    </div>
  </main>
</div>

);
}
