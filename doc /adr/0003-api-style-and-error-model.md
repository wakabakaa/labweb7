# 3. Стиль API та модель помилок

Date: 2025-12-09
Status: Accepted

## Decision
* Стиль: REST JSON.
* Успішна відповідь: `{ "status": "success", "data": ... }`
* Помилка: `{ "status": "error", "error": "Опис помилки" }`
* HTTP коди: 
  - 200 OK, 201 Created
  - 400 Bad Request (валідація)
  - 404 Not Found
  - 500 Server Error