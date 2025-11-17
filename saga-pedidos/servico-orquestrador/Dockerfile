FROM node:20-alpine

# diretório de trabalho
WORKDIR /app

# copia package.json e instala deps
COPY package.json package-lock.json* ./ 
RUN npm install --production

# copia o código
COPY . .

# expõe porta (vai ser mapeada no compose)
EXPOSE 3000

CMD ["npm", "start"]
