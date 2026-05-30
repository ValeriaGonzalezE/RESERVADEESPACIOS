const {
  cleanOptionalText,
  cleanText,
  isValidEmail,
  normalizeEmail,
  validationError
} = require("../utils/requestValidators");

exports.enviarContacto = (req, res) => {
  const nombre = cleanText(req.body.nombre);
  const telefono = cleanOptionalText(req.body.telefono);
  const email = normalizeEmail(req.body.email);
  const mensaje = cleanText(req.body.mensaje);

  if (!nombre || !telefono || !email || !mensaje) {
    return validationError(res, "Todos los campos son obligatorios", {
      nombre: !nombre ? ["El nombre es obligatorio"] : undefined,
      telefono: !telefono ? ["El telefono es obligatorio"] : undefined,
      email: !email ? ["El correo es obligatorio"] : undefined,
      mensaje: !mensaje ? ["El mensaje es obligatorio"] : undefined
    });
  }

  if (!isValidEmail(email)) {
    return validationError(res, "Ingresa un correo valido", {
      email: ["Correo invalido"]
    });
  }

  // AQUI AGREGAS LA VALIDACION DE BACKEND DEL CAMPO NUEVO.
  // Ejemplo edad mayor a 18:
   const edad = Number(req.body.edad);
    if (!Number.isInteger(edad) || edad <= 18) {
      return validationError(res, "La edad debe ser mayor a 18", {
         edad: ["La edad debe ser mayor a 18"]
     });
   }
  //
  // Ejemplo texto mayor a 50 caracteres:
  // const descripcion = cleanText(req.body.descripcion);
  // if (descripcion.length <= 50) {
  //   return validationError(res, "El texto debe tener mas de 50 caracteres", {
  //     descripcion: ["Minimo 51 caracteres"]
  //   });
  // }

  // Simula guardar en base de datos sin depender de ningun modelo.
  return res.json({
    success: true,
    message: "Mensaje recibido por el backend",
    data: {
      nombre,
      telefono,
      email,
      mensaje,
      edad
    }
  });
};
