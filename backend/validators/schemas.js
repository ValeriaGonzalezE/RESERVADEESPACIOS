const { z } = require("zod");

// Convierte strings vacios en undefined para que los campos opcionales validen bien.
const emptyToUndefined = (value) => (value === "" ? undefined : value);

// Reglas base reutilizables para ids, textos, fechas y horas del sistema.
const id = z.coerce.number().int().positive();
const text = z.string().trim().min(1);
const optionalText = z.preprocess(emptyToUndefined, z.string().trim().optional());
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const time = z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/);

// Esquemas centrales que validan autenticacion, espacios, reservas y perfil.
const registerSchema = z.object({
  nombre: text.max(100),
  apellido: optionalText.default(""),
  email: z.string().trim().email().max(150),
  telefono: optionalText.default(""),
  password: z.string().min(8).max(100)
});

const loginSchema = z.object({
  codigo: text.max(150),
  password: z.string().min(1).max(100)
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().email().max(150)
});

const espacioQuerySchema = z.object({
  fecha: z.preprocess(emptyToUndefined, date.optional()),
  tipo: optionalText,
  pago: z.preprocess(emptyToUndefined, z.enum(["si", "no"]).optional())
});

const espacioSchema = z.object({
  nombre: text.max(100),
  tipo_id: id,
  capacidad: z.coerce.number().int().positive(),
  ubicacion: text.max(255),
  descripcion: optionalText.default(""),
  requiere_pago: z.enum(["si", "no"]).default("no"),
  precio: z.coerce.number().min(0).default(0)
});

const espacioUpdateSchema = espacioSchema.extend({
  estado: z.enum(["activo", "inactivo"]).default("activo")
});

const reservaSchema = z.object({
  espacio_id: id,
  fecha: date,
  hora_inicio: time,
  hora_fin: time
}).refine((data) => data.hora_inicio < data.hora_fin, {
  message: "La hora fin debe ser mayor que la hora inicio",
  path: ["hora_fin"]
});

const reservaDisponibilidadQuerySchema = z.object({
  espacio_id: id,
  fecha: date
});

const reservaUpdateSchema = z.object({
  fecha: date,
  hora_inicio: time,
  hora_fin: time
}).refine((data) => data.hora_inicio < data.hora_fin, {
  message: "La hora fin debe ser mayor que la hora inicio",
  path: ["hora_fin"]
});

const comentarioSchema = z.object({
  espacio_id: id,
  comentario: text.max(1000),
  estrellas: z.coerce.number().int().min(1).max(5)
});

const usuarioUpdateSchema = z.object({
  nombre: text.max(100),
  apellido: optionalText.default(""),
  email: z.string().trim().email().max(150),
  telefono: optionalText.default(""),
  foto: optionalText,
  password: z.preprocess(emptyToUndefined, z.string().min(8).max(100).optional())
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  espacioQuerySchema,
  espacioSchema,
  espacioUpdateSchema,
  reservaSchema,
  reservaDisponibilidadQuerySchema,
  reservaUpdateSchema,
  comentarioSchema,
  usuarioUpdateSchema
};
