const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const errorHandler = require("./middlewares/error.middleware");

const app = express();

// Configura middlewares globales para CORS y lectura de JSON o formularios.
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Publica la carpeta de uploads para servir imagenes por URL.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Monta los modulos principales de rutas del sistema.
app.use("/", require("./routes/auth.routes"));
app.use("/espacios", require("./routes/espacios.routes"));
app.use("/reservas", require("./routes/reservas.routes"));
app.use("/usuarios", require("./routes/usuarios.routes"));

// Deja el manejador de errores al final para atrapar fallos de las rutas.
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Inicia el servidor en el puerto definido por entorno o en el 3000 por defecto.
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
