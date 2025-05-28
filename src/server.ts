// service.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { mainRouter } from "./routergs/main"; // ajuste o caminho conforme a estrutura do seu projeto

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Rota raiz
server.get("/", (req, res) => {
  res.send("API está rodando!");
});

// Usa as rotas da API
server.use("/api", mainRouter); // prefixo "/api"

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
