const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./medicamentos.db');

// LER
app.get('/api/medicamentos', (req, res) => {
    db.all("SELECT * FROM medicamentos", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// CRIAR
app.post('/api/medicamentos', (req, res) => {
    const { nome, fabricante, valor, forma_uso } = req.body;
    const sql = `INSERT INTO medicamentos (nome, fabricante, valor, forma_uso) VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [nome, fabricante, valor, forma_uso], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

// DELETAR
app.delete('/api/medicamentos/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM medicamentos WHERE id = ?`, id, function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: "Removido com sucesso", rows: this.changes });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});