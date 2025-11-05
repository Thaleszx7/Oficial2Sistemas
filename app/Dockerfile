FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Criar diretório para arquivos temporários
RUN mkdir -p /tmp/reports

# Expor porta
EXPOSE 3000

# Aguardar serviços estarem prontos e iniciar aplicação
CMD ["node", "src/server.js"]