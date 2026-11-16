import { NavLink } from "react-router-dom";

function Navbar({ usuario, sair }) {
  return (
    <header className="navbar">
      <span className="logo">Locadora</span>

      <nav>
        <NavLink to="/veiculos">Veículos</NavLink>
        <NavLink to="/locacoes">Locações</NavLink>
      </nav>

      <div className="navbar-usuario">
        <span>{usuario}</span>
        <button className="botao-secundario" onClick={sair}>
          Sair
        </button>
      </div>
    </header>
  );
}

export default Navbar;
