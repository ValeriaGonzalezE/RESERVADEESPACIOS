// CONFIGURACIÓN DE MULTER
const multer = require("multer");
const path = require("path");

// CONFIGURACIÓN DEL STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // DESTINO DEL ARCHIVO
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // NOMBRE DEL ARCHIVO
  }
});

// FILTRO DE ARCHIVOS
const fileFilter = (req, file, cb) => {
  // Si el archivo NO es una imagen, se rechaza
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Solo se permiten imagenes"));
  }

  cb(null, true);
};

// EXPORTACIÓN DE MULTER CONFIGURADO
module.exports = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});
