
//Arquivo para rodar o servidor
import express from "express";
import cors from "cors";
import helmet from "helmet";

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Rota raiz só para confirmar que o servidor está rodando
server.get("/", (req, res) => {
  res.send("API está rodando!");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
