require("dotenv").config();

const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const tratarErros = require("./middlewares/tratarErros");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

app.use(tratarErros);

const porta = process.env.PORT || 3333;

app.listen(porta, () => {
  console.log("Servidor rodando na porta " + porta);
});
