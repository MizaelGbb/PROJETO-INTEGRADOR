
import { useNavigate } from "react-router-dom";
import styles from "../styles/MenuCliente.module.css";

function MenuCliente() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>BEM VIND@!</h1>

        <button
          onClick={logout}
          className={styles.logoutBtn}
        >
          ↪ Sair do sistema
        </button>
      </header>

      <main className={styles.gridContainer}>
        <button
            onClick={() => {
                const id = localStorage.getItem("id_usuario");
                navigate(`/clientes/${id}/historico`);
            }}
            className={`${styles.card} ${styles.blue}`}
        >
            <span className={styles.icon}>🛒</span>
            <span className={styles.text}>
                HISTÓRICO DE COMPRAS
            </span>
        </button>
      </main>
    </div>
  );
}

export default MenuCliente;