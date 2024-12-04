FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY .env.example .env

EXPOSE 4000
EXPOSE 4001
CMD ["npm", "run", "start:dev"]
