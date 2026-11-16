import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Veiculos from "./pages/Veiculos";
import Locacoes from "./pages/Locacoes";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [usuario, setUsuario] = useState(localStorage.getItem("usuario"));
  const navigate = useNavigate();

  function entrar(novoToken, email) {
    localStorage.setItem("token", novoToken);
    localStorage.setItem("usuario", email);
    setToken(novoToken);
    setUsuario(email);
    navigate("/veiculos");
  }

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setToken(null);
    setUsuario(null);
    navigate("/login");
  }

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login entrar={entrar} />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar usuario={usuario} sair={sair} />
      <main className="conteudo">
        <Routes>
          <Route path="/veiculos" element={<Veiculos />} />
          <Route path="/locacoes" element={<Locacoes />} />
          <Route path="*" element={<Navigate to="/veiculos" />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
