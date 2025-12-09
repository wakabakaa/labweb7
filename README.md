## Запуск локально
1. `npm install`
2. `npm start`

## CI/CD
Проєкт використовує GitHub Actions.
- При кожному пуші запускаються тести (`npm test`).
- Якщо тести успішні, збирається Docker-образ і пушиться в GHCR (GitHub Container Registry).