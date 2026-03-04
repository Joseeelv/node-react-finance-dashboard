FROM node:20-alpine

WORKDIR /app/backend

# Instalar pnpm
RUN npm install -g pnpm

# Copiar package files
COPY backend/package.json backend/pnpm-lock.yaml ./
COPY backend/prisma ./prisma/

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY backend/src ./src
COPY backend/tsconfig.json backend/prisma.config.ts ./

# Build
RUN npm run test

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["pnpm", "dev"]
