FROM node:18-alpine

# Define o diretório de trabalho no contêiner
WORKDIR /app

# Copia os arquivos de configuração primeiro
COPY package*.json ./

# Instala dependências
RUN npm install --omit=dev

# Copia o restante do código
COPY . .

# Expõe a porta que o app usa (ajuste se não for 3000)
EXPOSE 3000

# Comando de inicialização
CMD ["node", "src/server.js"]
