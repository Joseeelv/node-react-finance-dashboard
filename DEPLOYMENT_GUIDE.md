# 🚀 Guía de Deployment - Supabase + Vercel

## 1️⃣ SETUP SUPABASE

### Paso 1: Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto:
   - Nombre: `finance-dashboard`
   - Región: La más cercana a tus usuarios
   - Database password: Guarda bien esta contraseña

### Paso 2: Obtener credenciales

1. Ve a **Project Settings > Database**
2. Copia la **Connection String** (formato psql)
3. También copia desde **Settings > API**:
   - Project URL
   - Anon Key

### Paso 3: Configurar Prisma con Supabase

En el archivo `.env` del backend:

```
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres?schema=public"
```

### Paso 4: Migrar la base de datos

```bash
cd backend
pnpm prisma migrate deploy
pnpm prisma db seed
```

---

## 2️⃣ SETUP FRONTEND EN VERCEL

### Paso 1: Preparar el proyecto

```bash
cd frontend
pnpm build  # Verificar que build funciona
```

### Paso 2: Crear archivo `.env.production`

```
VITE_API_URL=https://tu-backend.com/api
```

### Paso 3: Deployar a Vercel

**Opción A: Git (Recomendado)**

1. Sube tu código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Conecta tu repositorio
4. En **Root Directory**: `frontend/`
5. En **Build Command**: `pnpm build`
6. En **Output Directory**: `dist`
7. Agrega variables de entorno en **Settings > Environment Variables**
8. Deploy automático ✅

**Opción B: CLI**

```bash
npm install -g vercel
cd frontend
vercel --prod
```

---

## 3️⃣ SETUP BACKEND (OPCIONES)

### OPCIÓN A: Railway (⭐ Recomendado - más fácil)

**Paso 1: Crear proyecto**

1. Ve a [railway.app](https://railway.app)
2. Crea cuenta con GitHub
3. Nuevo proyecto → Selecciona tu repo

**Paso 2: Agregar plugin PostgreSQL**

- Click en PostgreSQL plugin
- Se agregará automáticamente
- Copiar `DATABASE_URL` (se setea automáticamente)

**Paso 3: Configurar Node.js**

```bash
# En la raíz del backend, crea vercel.json:
```

Ver archivo `backend/vercel.json` creado

**Paso 4: Variables de entorno en Railway**

- `NODE_ENV`: production
- `JWT_SECRET`: tu-secret-key-segura
- `PORT`: 3000 (automático)

**Paso 5: Deploy**

- Push a GitHub → Railway deployará automáticamente

---

### OPCIÓN B: Vercel Functions (Serverless)

**Requiere refactorización del código Express a Vercel Functions**
Más complejo, ver: https://vercel.com/docs/functions/nodejs

---

### OPCIÓN C: Render (Alternativa)

1. Ve a [render.com](https://render.com)
2. New Web Service → Conecta tu GitHub
3. Build Command: `pnpm install && pnpm build`
4. Start Command: `pnpm dev`
5. Agrega DATABASE_URL en Environment

---

## 4️⃣ VARIABLES DE ENTORNO

### Backend (Railway/Render)

```
DATABASE_URL=postgresql://...supabase...
JWT_SECRET=tu-secret-muy-seguro
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://tu-frontend.vercel.app
```

### Frontend (Vercel)

```
VITE_API_URL=https://tu-backend-railway.app/api
VITE_API_URL=https://tu-backend-render.com/api
```

---

## 5️⃣ LISTA DE VERIFICACIÓN

- [ ] Supabase proyecto creado
- [ ] DATABASE_URL copiada
- [ ] Migraciones ejecutadas en Supabase
- [ ] Variables de entorno en backend
- [ ] Build del frontend funciona: `pnpm build`
- [ ] Frontend deployado en Vercel
- [ ] Backend deployado en Railway/Render
- [ ] VITE_API_URL apunta al backend correcto
- [ ] CORS configurado en backend
- [ ] JWT_SECRET establecido

---

## 6️⃣ TROUBLESHOOTING

### "CORS error"

En `backend/src/index.ts`:

```typescript
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
```

### "DATABASE_URL inválido"

- Verifica la contraseña tenga caracteres especiales escapados
- Ejemplo: `@` → `%40`

### "JWT errors"

- Asegúrate que JWT_SECRET sea diferente en dev y prod
- Guarda la clave en Railway/Render, no en código

### "Build fails"

```bash
# Limpia cache y reinstala
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

---

## 7️⃣ PRÓXIMOS PASOS

1. Dominio personalizado en Vercel
2. SSL/HTTPS (automático)
3. Monitoreo con Sentry
4. CI/CD con GitHub Actions
5. Database backups automáticos
