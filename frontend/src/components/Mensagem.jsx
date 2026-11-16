function Mensagem({ texto, tipo }) {
  if (!texto) {
    return null;
  }

  return (
    <p className={`mensagem mensagem-${tipo}`} role={tipo === "erro" ? "alert" : "status"}>
      {texto}
    </p>
  );
}

export default Mensagem;
