# Reserva de espacios

Aplicacion de reservas con backend Express/MySQL y frontend Vue 3 + Ionic + Pinia.

## Backend

```bash
cd backend
npm install
cp .env.example .env
npm start
```

Variables requeridas:

- `JWT_SECRET`
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `PORT`

## Frontend

```bash
cd reserva-espacios
npm install
cp .env.example .env
npm run dev
```

`VITE_API_URL` debe apuntar a la URL del backend.

## Seguridad implementada

- Registro/login con JWT.
- Passwords con bcrypt.
- Middleware de autenticacion.
- Middleware de roles y permisos por propietario/admin.
- Validacion de entrada con Zod.
- Interceptor de Axios para enviar `Authorization: Bearer <token>`.
- Controlador global de errores.

## Deploy

- Backend: `render.yaml`.
- Frontend: `reserva-espacios/vercel.json`.
