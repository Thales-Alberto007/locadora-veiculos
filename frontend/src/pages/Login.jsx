import { useState } from "react";
import { Link } from "react-router-dom";
import api, { pegarMensagemErro } from "../services/api";
import Mensagem from "../components/Mensagem";

function Login({ entrar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function fazerLogin(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const resposta = await api.post("/auth/login", { email, senha });
      entrar(resposta.data.token, email);
    } catch (error) {
      setErro(pegarMensagemErro(error));
    }

    setCarregando(false);
  }

  return (
    <div className="pagina-centro">
      <form className="cartao formulario" onSubmit={fazerLogin}>
        <h1>Entrar</h1>
        <p className="subtitulo">Locadora de Veículos</p>

        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label>
          Senha
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </label>

        <Mensagem texto={erro} tipo="erro" />

        <button type="submit" disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>

        <p className="rodape-form">
          Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
