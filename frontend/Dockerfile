# Gunakan Node.js LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Salin package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Salin seluruh proyek
COPY . .

# Build aplikasi Next.js
RUN npm run build

# Jalankan server Next.js
EXPOSE 3000
CMD ["npm", "start"]
