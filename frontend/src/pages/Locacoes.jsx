import { useEffect, useState } from "react";
import api, { pegarMensagemErro } from "../services/api";
import Mensagem from "../components/Mensagem";
import { formatarDinheiro, formatarData, formatarDataHora } from "../utils/formatar";

function Locacoes() {
  const [veiculos, setVeiculos] = useState([]);
  const [locacoes, setLocacoes] = useState([]);
  const [veiculoId, setVeiculoId] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataPrevistaDevolucao, setDataPrevistaDevolucao] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function carregarDados() {
    try {
      const respostaVeiculos = await api.get("/veiculos?disponivel=true");
      const respostaLocacoes = await api.get("/locacoes");
      setVeiculos(respostaVeiculos.data);
      setLocacoes(respostaLocacoes.data);
    } catch (error) {
      setErro(pegarMensagemErro(error));
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function registrar(e) {
    e.preventDefault();
    setMensagem("");
    setErro("");

    if (dataPrevistaDevolucao <= dataInicio) {
      setErro("A data de devolução precisa ser depois da data de início");
      return;
    }

    setEnviando(true);

    try {
      await api.post("/locacoes", {
        veiculoId: Number(veiculoId),
        dataInicio,
        dataPrevistaDevolucao,
      });

      setMensagem("Locação registrada!");
      setVeiculoId("");
      setDataInicio("");
      setDataPrevistaDevolucao("");
      carregarDados();
    } catch (error) {
      setErro(pegarMensagemErro(error));
      carregarDados();
    }

    setEnviando(false);
  }

  async function finalizar(id) {
    setMensagem("");
    setErro("");

    try {
      await api.patch(`/locacoes/${id}/finalizar`);
      setMensagem("Locação finalizada! O veículo está disponível de novo.");
      carregarDados();
    } catch (error) {
      setErro(pegarMensagemErro(error));
    }
  }

  const ativas = locacoes.filter((locacao) => locacao.status === "ATIVA");
  const finalizadas = locacoes.filter((locacao) => locacao.status === "FINALIZADA");

  return (
    <div className="duas-colunas">
      <section className="cartao">
        <h2>Nova locação</h2>

        <form className="formulario" onSubmit={registrar}>
          <label>
            Veículo
            <select value={veiculoId} onChange={(e) => setVeiculoId(e.target.value)} required>
              <option value="">Escolha um veículo</option>
              {veiculos.map((veiculo) => (
                <option key={veiculo.id} value={veiculo.id}>
                  {veiculo.marca} {veiculo.modelo} - {veiculo.placa} ({formatarDinheiro(veiculo.valorDiaria)}/dia)
                </option>
              ))}
            </select>
          </label>

          <div className="linha">
            <label>
              Data de início
              <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} required />
            </label>

            <label>
              Devolução prevista
              <input type="date" value={dataPrevistaDevolucao} onChange={(e) => setDataPrevistaDevolucao(e.target.value)} required />
            </label>
          </div>

          <Mensagem texto={mensagem} tipo="sucesso" />
          <Mensagem texto={erro} tipo="erro" />

          <button type="submit" disabled={enviando}>
            {enviando ? "Registrando..." : "Registrar locação"}
          </button>
        </form>
      </section>

      <section className="cartao">
        <h2>Minhas locações</h2>

        <h3>Ativas</h3>
        {ativas.length === 0 && <p className="vazio">Nenhuma locação ativa.</p>}

        <ul className="lista">
          {ativas.map((locacao) => (
            <li key={locacao.id} className="item">
              <div>
                <strong>
                  {locacao.veiculo.marca} {locacao.veiculo.modelo}
                </strong>
                <span className="detalhe">
                  {formatarData(locacao.dataInicio)} até {formatarData(locacao.dataPrevistaDevolucao)} · {formatarDinheiro(locacao.valorTotal)}
                </span>
              </div>

              <button className="botao-secundario" onClick={() => finalizar(locacao.id)}>
                Finalizar
              </button>
            </li>
          ))}
        </ul>

        <h3>Histórico</h3>
        {finalizadas.length === 0 && <p className="vazio">Nenhuma locação finalizada.</p>}

        <ul className="lista">
          {finalizadas.map((locacao) => (
            <li key={locacao.id} className="item">
              <div>
                <strong>
                  {locacao.veiculo.marca} {locacao.veiculo.modelo}
                </strong>
                <span className="detalhe">
                  {formatarData(locacao.dataInicio)} até {formatarData(locacao.dataPrevistaDevolucao)} · devolvido em {formatarDataHora(locacao.dataDevolucao)} · {formatarDinheiro(locacao.valorTotal)}
                </span>
              </div>

              <span className="etiqueta etiqueta-cinza">Finalizada</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Locacoes;
