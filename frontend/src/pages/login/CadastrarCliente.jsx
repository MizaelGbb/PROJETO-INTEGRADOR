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
import "../../styles/login/CadastrarCliente.css";

export default function CadastrarCliente() {
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

setLoading(true);

try {
  const res = await fetch("http://localhost:3000/cadastra/clientes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome: form.nome.trim(),
      email: form.email.trim(),
      senha: form.senha,
      telefone: form.telefone,
      cpf: form.cpf.replace(/\D/g, ""),
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.erro || "Erro ao cadastrar");
  }

  showToast("Cliente cadastrado com sucesso!");
  setForm(estadoInicial);

  setTimeout(() => navigate("/login"), 1500);

} catch (err) {
  console.error(err);
  showToast(err.message || "Erro ao cadastrar cliente", "error");
} finally {
  setLoading(false);
}
}

return ( <div className="container">
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
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <Lock size={18} /> Senha
          </label>
          <input
            className="form-input"
            type="password"
            name="senha"
            value={form.senha}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-submit span-2" disabled={loading}>
          <Save size={20} /> {loading ? "Cadastrando..." : "Concluir Cadastro"}
        </button>

      </form>
    </div>
  </main>
</div>

);
}
