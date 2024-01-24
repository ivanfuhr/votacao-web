# Passo 1: Definir a imagem base com Node.js
FROM node:20.10-alpine as build-step

# Definir o diretório de trabalho no contêiner
WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar os arquivos 'package.json' e 'pnpm-lock.yaml'
COPY package.json pnpm-lock.yaml /app/

# Instalar as dependências do projeto
RUN pnpm install

# Copiar os arquivos e pastas do projeto para o diretório de trabalho (exceto o que estiver listado em .dockerignore)
COPY . /app

# Construir a aplicação para produção
RUN pnpm build:prod

# Passo 2: Preparar a imagem de produção
FROM nginx:alpine

# Copiar os arquivos de build do estágio anterior para a pasta de servir do nginx
COPY --from=build-step /app/dist/web/browser /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]
