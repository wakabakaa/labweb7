

// src/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); 
const path = require('path');

const app = express();
const port = 3000;

app.use(cors()); 
app.use(express.json()); // Обов'язково для роботи POST запитів

const dbPath = path.join(__dirname, 'restaurant.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => { // OPEN_READWRITE для запису
    if (err) {
        console.error("❌ Помилка БД:", err.message);
    } else {
        console.log('✅ Підключено до SQLite.');
    }
});

// ===============================================
// 1. Endpoint: GET /items (Меню)
// ===============================================
app.get('/items', (req, res) => {
    db.all('SELECT * FROM items', [], (err, rows) => {
        if (err) return res.status(500).json({error: err.message});
        res.json({data: rows});
    });
});

// ===============================================
// 2. Endpoint: GET /reservations (Всі бронювання)
// ===============================================
app.get('/reservations', (req, res) => {
    db.all('SELECT * FROM reservations', [], (err, rows) => {
        if (err) return res.status(500).json({error: err.message});
        res.json({data: rows});
    });
});

// ===============================================
// 3. Endpoint: POST /reservations (Створення)
// ===============================================
app.post('/reservations', (req, res) => {
    const { guest_name, room_number, check_in_date, check_out_date, status } = req.body;

    // ВАЛІДАЦІЯ: Перевіряємо, чи є обов'язкове поле guest_name
    if (!guest_name) {
        return res.status(400).json({ 
            status: "error",
            error: "Поле 'guest_name' є обов'язковим!" 
        });
    }

    const sql = `INSERT INTO reservations (guest_name, room_number, check_in_date, check_out_date, status) VALUES (?, ?, ?, ?, ?)`;
    const params = [guest_name, room_number, check_in_date, check_out_date, status || 'confirmed'];

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            status: "success",
            id: this.lastID, // ID нового запису
            guest_name: guest_name
        });
    });
});

// ===============================================
// 4. Endpoint: DELETE /reservations/:id (Видалення)
// ===============================================
app.delete('/reservations/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM reservations WHERE id = ?';
    
    db.run(sql, id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // this.changes показує кількість змінених (видалених) рядків
        if (this.changes === 0) {
            return res.status(404).json({ error: "Бронювання не знайдено." });
        }
        res.json({ 
            status: "success",
            message: "Бронювання успішно видалено", 
            deleted_id: id 
        });
    });
});

// ===============================================
// 5. Endpoint: GET /health (Health Check)
// ===============================================
app.get('/health', (req, res) => {
    res.json({ 
        status: 'UP', 
        timestamp: new Date().toISOString(),
        database: 'connected' 
    });
});

// ===============================================
// Експорт та Запуск
// ===============================================
module.exports = app;

if (require.main === module) {
    app.listen(port, () => {
        console.log(`🚀 Сервер працює на порту ${port}`);
        console.log(`➡️  Endpoints: GET/POST/DELETE /reservations, GET /items, GET /health`);
    });
}