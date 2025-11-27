import express from "express";
import cors from "cors";
import { client } from "./src/common/db.js";

import peliculaRoutes from "./src/pelicula/routes.js";
import actorRoutes from "./src/actor/routes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).send("Bienvenido al cine Iplacex");
});

app.use("/api", peliculaRoutes);
app.use("/api", actorRoutes);

async function startServer() {
  try {
    await client.connect();
    console.log("🔌 Conectado exitosamente al clúster Atlas");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor Express escuchando en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB Atlas:", error);
  }
}

startServer();
