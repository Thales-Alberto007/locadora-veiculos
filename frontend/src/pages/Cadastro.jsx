import { useState } from "react";
import { Link } from "react-router-dom";
import api, { pegarMensagemErro } from "../services/api";
import Mensagem from "../components/Mensagem";

function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function cadastrar(e) {
    e.preventDefault();
    setMensagem("");
    setErro("");
    setCarregando(true);

    try {
      await api.post("/auth/cadastro", { nome, email, senha });
      setMensagem("Cadastro feito! Agora é só entrar.");
      setNome("");
      setEmail("");
      setSenha("");
    } catch (error) {
      setErro(pegarMensagemErro(error));
    }

    setCarregando(false);
  }

  return (
    <div className="pagina-centro">
      <form className="cartao formulario" onSubmit={cadastrar}>
        <h1>Criar conta</h1>
        <p className="subtitulo">Locadora de Veículos</p>

        <label>
          Nome
          <input value={nome} onChange={(e) => setNome(e.target.value)} required />
        </label>

        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label>
          Senha
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </label>

        <Mensagem texto={mensagem} tipo="sucesso" />
        <Mensagem texto={erro} tipo="erro" />

        <button type="submit" disabled={carregando}>
          {carregando ? "Cadastrando..." : "Cadastrar"}
        </button>

        <p className="rodape-form">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
}

export default Cadastro;
