const validate = (schema, source = "body") => (req, res, next) => {
  // Ejecuta la validación del esquema sobre el origen de los datos (body, query, params)
  const result = schema.safeParse(req[source]);

  // Si la validación falla, se detiene la petición
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Datos invalidos",
      // Devuelve errores detallados por campo
      errors: result.error.flatten().fieldErrors
    });
  }

  // Si todo es válido, reemplaza los datos originales por los validados y sanitizados
  req[source] = result.data;
  // Continúa al siguiente middleware o controller
  next();
};

module.exports = validate;