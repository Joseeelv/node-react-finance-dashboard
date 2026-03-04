FROM node:20-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar package files
COPY package.json pnpm-lock.yaml ./
COPY backend/package.json backend/pnpm-lock.yaml ./backend/
COPY backend/prisma ./backend/prisma/

# Instalar dependencias
RUN pnpm install

# Copiar código fuente
COPY backend/src ./backend/src
COPY backend/tsconfig.json backend/prisma.config.ts ./backend/

# Exponer puerto
EXPOSE 3000

# Comando de inicio
WORKDIR /app/backend
CMD ["pnpm", "dev"]
