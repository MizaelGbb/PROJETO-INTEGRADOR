const API_URL = "http://localhost:3000";

export function getAlunos() {
  return fetch(`${API_URL}/api/alunos`);
}

export function criarAluno(dados, token) {
  return fetch(`${API_URL}/api/alunos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(dados)
  });
}