// Crea el estado inicial de un formulario a partir de una lista de campos.
export const createFormState = (fields) => {
  return fields.reduce((accumulator, field) => {
    accumulator[field.model] = field.initialValue ?? "";
    return accumulator;
  }, {});
};

// Convierte un array de errores en un objeto facil de consumir por nombre de campo.
export const createErrorState = (fields) => {
  return fields.reduce((accumulator, field) => {
    accumulator[field.model] = "";
    return accumulator;
  }, {});
};

// Completa correos sin dominio para sostener el flujo existente.
export const normalizeEmail = (value) => {
  const email = String(value || "").trim();
  return email && !email.includes("@") ? `${email}@gmail.com` : email;
};

// Regla basica de correo para frontend.
export const isEmailValid = (value) => /\S+@\S+\.\S+/.test(String(value || "").trim());

// Limpia todos los mensajes de error del formulario.
export const resetErrors = (errors) => {
  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });
};
