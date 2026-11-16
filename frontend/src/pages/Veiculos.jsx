import { useEffect, useState } from "react";
import api, { pegarMensagemErro } from "../services/api";
import Mensagem from "../components/Mensagem";
import { formatarDinheiro } from "../utils/formatar";

function Veiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [soDisponiveis, setSoDisponiveis] = useState(false);
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [placa, setPlaca] = useState("");
  const [ano, setAno] = useState("");
  const [valorDiaria, setValorDiaria] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  async function carregarVeiculos() {
    try {
      const url = soDisponiveis ? "/veiculos?disponivel=true" : "/veiculos";
      const resposta = await api.get(url);
      setVeiculos(resposta.data);
    } catch (error) {
      setErro(pegarMensagemErro(error));
    }

    setCarregando(false);
  }

  useEffect(() => {
    carregarVeiculos();
  }, [soDisponiveis]);

  async function cadastrarVeiculo(e) {
    e.preventDefault();
    setMensagem("");
    setErro("");

    if (Number(valorDiaria) <= 0) {
      setErro("O valor da diária precisa ser maior que zero");
      return;
    }

    try {
      await api.post("/veiculos", {
        marca,
        modelo,
        placa: placa.toUpperCase(),
        ano: Number(ano),
        valorDiaria: Number(valorDiaria),
      });

      setMensagem("Veículo cadastrado!");
      setMarca("");
      setModelo("");
      setPlaca("");
      setAno("");
      setValorDiaria("");
      carregarVeiculos();
    } catch (error) {
      setErro(pegarMensagemErro(error));
    }
  }

  return (
    <div className="duas-colunas">
      <section className="cartao">
        <h2>Cadastrar veículo</h2>

        <form className="formulario" onSubmit={cadastrarVeiculo}>
          <label>
            Marca
            <input value={marca} onChange={(e) => setMarca(e.target.value)} required />
          </label>

          <label>
            Modelo
            <input value={modelo} onChange={(e) => setModelo(e.target.value)} required />
          </label>

          <div className="linha">
            <label>
              Placa
              <input value={placa} onChange={(e) => setPlaca(e.target.value)} maxLength={7} required />
            </label>

            <label>
              Ano
              <input type="number" value={ano} onChange={(e) => setAno(e.target.value)} min="1950" max="2100" required />
            </label>
          </div>

          <label>
            Valor da diária (R$)
            <input type="number" value={valorDiaria} onChange={(e) => setValorDiaria(e.target.value)} min="0.01" step="0.01" required />
          </label>

          <Mensagem texto={mensagem} tipo="sucesso" />
          <Mensagem texto={erro} tipo="erro" />

          <button type="submit">Cadastrar</button>
        </form>
      </section>

      <section className="cartao">
        <div className="titulo-lista">
          <h2>Veículos</h2>

          <label className="checkbox">
            <input type="checkbox" checked={soDisponiveis} onChange={(e) => setSoDisponiveis(e.target.checked)} />
            Só disponíveis
          </label>
        </div>

        {carregando && <p className="vazio">Carregando...</p>}

        {!carregando && veiculos.length === 0 && <p className="vazio">Nenhum veículo encontrado.</p>}

        <ul className="lista">
          {veiculos.map((veiculo) => (
            <li key={veiculo.id} className="item">
              <div>
                <strong>
                  {veiculo.marca} {veiculo.modelo}
                </strong>
                <span className="detalhe">
                  {veiculo.placa} · {veiculo.ano} · {formatarDinheiro(veiculo.valorDiaria)}/dia
                </span>
              </div>

              <span className={veiculo.disponivel ? "etiqueta etiqueta-verde" : "etiqueta etiqueta-cinza"}>
                {veiculo.disponivel ? "Disponível" : "Alugado"}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Veiculos;
