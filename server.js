const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path'); // Import path module

const app = express();

// Create connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'cm'
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Route to fetch all products
app.get('/api/products', (req, res) => {
    pool.query('SELECT * FROM products', (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error fetching products' });
        }
        res.json(results);
    });
});

// Route to add a new product
app.post('/api/products', (req, res) => {
    const { name, quantity, description } = req.body;
    pool.query('INSERT INTO products (name, quantity, description) VALUES (?, ?, ?)', [name, quantity, description], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error adding product' });
        }
        res.json({ message: 'Product added successfully' });
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
