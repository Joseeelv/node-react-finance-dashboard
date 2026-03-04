FROM node:20-alpine

WORKDIR /app/frontend

# Instalar pnpm
RUN npm install -g pnpm

# Copiar package files
COPY frontend/package.json frontend/pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY frontend .

# Build
RUN pnpm build

# Instalar servidor estático
RUN npm install -g serve

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["serve", "-s", "dist", "-l", "3000"]
