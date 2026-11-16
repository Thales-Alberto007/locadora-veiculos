import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    if (erro.response && erro.response.status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = "/login";
    }

    return Promise.reject(erro);
  }
);

export function pegarMensagemErro(erro) {
  if (erro.response && erro.response.data && erro.response.data.erro) {
    return erro.response.data.erro;
  }

  return "Não foi possível conectar com o servidor";
}

export default api;
