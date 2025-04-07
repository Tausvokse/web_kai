const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 3000;

// Налаштування middleware
app.use(express.json()); // Парсинг JSON-запитів
app.use(express.static(__dirname)); // Віддача статичних файлів (наприклад, index.html)

// Дозволяємо CORS для всіх джерел
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Шляхи до файлів зберігання
const jsonFilePath = path.join(__dirname, 'declarations.json');
const xmlFilePath = path.join(__dirname, 'declarations.xml');

// Ініціалізація файлів, якщо їх немає
async function initializeFiles() {
    try {
        await fs.access(jsonFilePath);
    } catch {
        await fs.writeFile(jsonFilePath, JSON.stringify([]));
    }
    
    try {
        await fs.access(xmlFilePath);
    } catch {
        await fs.writeFile(xmlFilePath, '<?xml version="1.0" encoding="UTF-8"?><declarations></declarations>');
    }
}
initializeFiles();

// POST: Створення нової декларації
app.post('/api/declaration', async (req, res) => {
    try {
        const declaration = { id: Date.now(), ...req.body }; // Додаємо унікальний ID
        
        // Збереження в JSON
        const jsonData = JSON.parse(await fs.readFile(jsonFilePath));
        jsonData.push(declaration);
        await fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2));
        
        // Збереження в XML
        const xmlData = await fs.readFile(xmlFilePath, 'utf8');
        const xmlEntry = `
    <declaration id="${declaration.id}">
        <surname>${declaration.surname}</surname>
        <name>${declaration.name}</name>
        <patronymic>${declaration.patronymic}</patronymic>
        <nativeLanguage>${declaration.nativeLanguage}</nativeLanguage>
        <visitPurpose>${declaration.visitPurpose}</visitPurpose>
        <cashAmount>${declaration.cashAmount}</cashAmount>
        <luggageInfo>${declaration.luggageInfo}</luggageInfo>
    </declaration>`;
        
        const newXml = xmlData.replace('</declarations>', `${xmlEntry}\n</declarations>`);
        await fs.writeFile(xmlFilePath, newXml);
        
        res.status(201).json(declaration); // Повертаємо створену декларацію
    } catch (error) {
        res.status(500).json({ error: error.message }); // Обробка помилок
    }
});

// GET: Отримання всіх декларацій
app.get('/api/declarations', async (req, res) => {
    try {
        const data = await fs.readFile(jsonFilePath);
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT: Оновлення декларації за ID
app.put('/api/declaration/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const jsonData = JSON.parse(await fs.readFile(jsonFilePath));
        const index = jsonData.findIndex(d => d.id === id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Декларацію не знайдено' });
        }
        
        jsonData[index] = { ...jsonData[index], ...req.body };
        await fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2));
        res.json(jsonData[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE: Видалення декларації за ID
app.delete('/api/declaration/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const jsonData = JSON.parse(await fs.readFile(jsonFilePath));
        const filteredData = jsonData.filter(d => d.id !== id);
        
        if (jsonData.length === filteredData.length) {
            return res.status(404).json({ error: 'Декларацію не знайдено' });
        }
        
        await fs.writeFile(jsonFilePath, JSON.stringify(filteredData, null, 2));
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер працює на http://localhost:${port}`);
});