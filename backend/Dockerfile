FROM node:20-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar package.json primero para aprovechar el cache de capas
COPY package.json ./

# Instalar dependencias
RUN pnpm install

# Copiar código fuente y configuración
COPY src ./src
COPY prisma ./prisma
COPY tsconfig.json ./
COPY prisma.config.ts ./

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["pnpm", "dev"]
