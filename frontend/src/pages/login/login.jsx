import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import "../../styles/login/login.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    senha: "",
  });

  const [erro, setErro] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Login inválido");
      }

      const user = await res.json();

      localStorage.setItem("token", user.token);
      localStorage.setItem("id_usuario", user.id_usuario);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.tipo === "cliente") {
        navigate("/menu-cliente");
      } else if (user.tipo === "vendedor") {
        navigate("/menu");
      } else {
        navigate("/");
      }
    } catch (err) {
      setErro("Email ou senha inválidos");
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        
        <h1 className="login-title">Acessar Sistema</h1>
        <p className="login-subtitle">Entre com suas credenciais para continuar</p>

        {erro && (
          <div className="login-error-box">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="login-group">
            <label className="login-label">E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="seuemail@exemplo.com"
              value={form.email}
              onChange={handleChange}
              required
              className="login-input"
            />
          </div>

          <div className="login-group">
            <label className="login-label">Senha</label>
            <input
              type="password"
              name="senha"
              placeholder="••••••••"
              value={form.senha}
              onChange={handleChange}
              required
              className="login-input"
            />
          </div>

          <button type="submit" className="login-submit-btn">
            <LogIn size={18} /> Entrar
          </button>
        </form>

        <div className="login-divider">
          <span>ou</span>
        </div>

        {/* Botão de redirecionamento para o cadastro de clientes */}
        <button 
          onClick={() => navigate("/cadastrar-cliente")} 
          className="login-register-btn"
        >
          <UserPlus size={18} /> Criar Conta de Cliente
        </button>
        
      </div>
    </div>
  );
}