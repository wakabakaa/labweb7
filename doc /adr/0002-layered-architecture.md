# 2. Шарова архітектура

Date: 2025-12-09
Status: Accepted

## Context
Потрібно розділити бізнес-логіку від роботи з базою даних та HTTP запитами.

## Decision
Ми використовуємо 3 шари:
1. **API (Controller)**: Приймає HTTP запити (`server.js` або роутери).
2. **Service (Business Logic)**: Логіка обробки, валідація (`order.service.js`).
3. **Infrastructure/Domain**: Робота з БД (`order.repository.js`, `database.js`).

## Consequences
Залежності йдуть тільки зверху вниз: API -> Service -> Infrastructure.