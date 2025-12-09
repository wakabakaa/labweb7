# Використовуємо легку версію Node.js
FROM node:18-alpine

# Створюємо робочу папку всередині контейнера
WORKDIR /app

# Копіюємо файли налаштувань (package.json та lock файл)
COPY package*.json ./

# Встановлюємо залежності (clean install для CI)
RUN npm ci

# Копіюємо весь інший код
COPY . .

# Відкриваємо порт 3000
EXPOSE 3000

# Команда запуску
CMD ["npm", "start"]