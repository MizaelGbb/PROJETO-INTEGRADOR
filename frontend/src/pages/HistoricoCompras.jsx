import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../styles/HistoricoCompras.module.css";

function HistoricoCompras() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [historico, setHistorico] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarHistorico();
  }, []);

  async function carregarHistorico() {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:3000/cadastra/clientes/${id}/historico`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        alert("Sessão expirada.");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Erro ao carregar histórico.");
      }

      const dados = await response.json();
      setHistorico(dados);
    } catch (err) {
      console.error(err);
      setErro("Não foi possível carregar o histórico.");
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Histórico de Compras</h1>

        <button
          className={styles.voltarBtn}
          onClick={() => navigate(-1)}
        >
          ⬅ Voltar
        </button>
      </header>

      {erro && <p className={styles.erro}>{erro}</p>}

      {historico.length === 0 ? (
        <div className={styles.semHistorico}>
          Nenhuma compra encontrada.
        </div>
      ) : (
        <div className={styles.cards}>
          {historico.map((venda) => (
            <div
              key={venda.id_venda}
              className={styles.card}
            >
              <div className={styles.cardHeader}>
                <h2>Venda #{venda.id_venda}</h2>

                <span className={styles.valor}>
                  R$ {Number(venda.valor_total).toFixed(2)}
                </span>
              </div>

              <p>
                <strong>Data:</strong>{" "}
                {new Date(venda.data).toLocaleDateString("pt-BR")}
              </p>

              <p>
                <strong>Pagamento:</strong>{" "}
                {venda.forma_de_pagamento}
              </p>

              <h3>Produtos</h3>

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                  </tr>
                </thead>

                <tbody>
                  {venda.produtos.map((produto) => (
                    <tr key={produto.id_produto}>
                      <td>{produto.nome}</td>

                      <td>
                        {produto.VendaProduto.quantidade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoricoCompras;