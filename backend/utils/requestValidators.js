// Normaliza textos opcionales para evitar nulls o espacios innecesarios.
const cleanText = (value) => String(value || "").trim();

// Devuelve string vacio cuando el dato no viene informado.
const cleanOptionalText = (value) => cleanText(value);

// Completa correos sin dominio para mantener el comportamiento actual.
const normalizeEmail = (value) => {
  const email = cleanText(value).toLowerCase();
  return email && !email.includes("@") ? `${email}@gmail.com` : email;
};

// Valida el formato basico del correo.
const isValidEmail = (value) => /\S+@\S+\.\S+/.test(cleanText(value));

// Convierte a numero y valida enteros positivos.
const toPositiveInteger = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

// Convierte a numero y valida valores no negativos.
const toNonNegativeNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

// Valida fechas tipo YYYY-MM-DD.
const isValidDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(cleanText(value));

// Valida horas tipo HH:mm o HH:mm:ss.
const isValidTime = (value) => /^\d{2}:\d{2}(:\d{2})?$/.test(cleanText(value));

// Construye una respuesta uniforme para errores de validacion.
const validationError = (res, message, errors = {}) => {
  return res.status(400).json({
    success: false,
    message,
    errors
  });
};

module.exports = {
  cleanText,
  cleanOptionalText,
  normalizeEmail,
  isValidEmail,
  toPositiveInteger,
  toNonNegativeNumber,
  isValidDate,
  isValidTime,
  validationError
};
