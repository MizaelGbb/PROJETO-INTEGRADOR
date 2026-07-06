import { useNavigate } from "react-router-dom";
import styles from "../styles/MenuGeral.module.css";

function MenuGeral() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className={styles.container}>
      {/* Cabeçalho */}
      <header className={styles.header}>
        <h1 className={styles.title}>BEM VIND@, GERENTE</h1>

        <button onClick={logout} className={styles.logoutBtn}>
          <span>↪</span> Sair do sistema
        </button>
      </header>

      {/* Grade de Botões */}
      <main className={styles.gridContainer}>
        <button
          onClick={() => navigate("/vender")}
          className={`${styles.card} ${styles.blue}`}
        >
          <span className={styles.icon}>🛒</span>
          <span className={styles.text}>VENDER</span>
        </button>

        <button
          onClick={() => navigate("/cadastrar-produto")}
          className={`${styles.card} ${styles.green}`}
        >
          <span className={styles.icon}>📦⁺</span>
          <span className={styles.text}>CADASTRAR PRODUTO</span>
        </button>

        <button
          onClick={() => navigate("/cadastrar-desconto")}
          className={`${styles.card} ${styles.purple}`}
        >
          <span className={styles.icon}>🏷️</span>
          <span className={styles.text}>CADASTRAR DESCONTO</span>
        </button>

        <button
          onClick={() => navigate("/categorias")}
          className={`${styles.card} ${styles.orange}`}
        >
          <span className={styles.icon}>☰</span>
          <span className={styles.text}>CATEGORIAS</span>
        </button>

        <button
          onClick={() => navigate("/incluir-produtos")}
          className={`${styles.card} ${styles.indigo}`}
        >
          <span className={styles.icon}>⊕</span>
          <span className={styles.text}>INCLUIR PRODUTOS</span>
        </button>

        <button
          onClick={() => navigate("/cadastrar-fornecedor")}
          className={`${styles.card} ${styles.gray}`}
        >
          <span className={styles.icon}>🚚</span>
          <span className={styles.text}>CADASTRAR FORNECEDOR</span>
        </button>

        <button
          onClick={() => navigate("/estoque")}
          className={`${styles.card} ${styles.teal}`}
        >
          <span className={styles.icon}>📦</span>
          <span className={styles.text}>ESTOQUE</span>
        </button>

        <button
          onClick={() => navigate("/relatorio-vendas")}
          className={`${styles.card} ${styles.gray}`}
        >
          <span className={styles.icon}>📊</span>
          <span className={styles.text}>RELATÓRIO DE VENDAS</span>
        </button>

        <button
          onClick={() => navigate("/cadastrar-vendedor")}
          className={`${styles.card} ${styles.pink}`}
        >
          <span className={styles.icon}>👤+</span>
          <span className={styles.text}>CADASTRAR VENDEDOR</span>
        </button>
      </main>
    </div>
  );
}

export default MenuGeral;