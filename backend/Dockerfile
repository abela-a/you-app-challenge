# Gunakan Node.js LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Salin package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Salin seluruh proyek
COPY . .

# Jalankan aplikasi Nest.js
EXPOSE 4000
CMD ["npm", "run", "start:dev"]
