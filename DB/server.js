const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./E-comerce.db');


// LER
app.get('/api/produto', (req, res) => {
    db.all("SELECT * FROM produto", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/cadastro', async(req,res) =>{
    const {nome, email, senha_hash} = req.body;

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const sql = 'INSERT INTO usuario (nome , email, senha_hash) VALUES (?, ?, ?)';
    db.run(sql, [nome, email, senha_hash], (err) => {
        if (err) return res.status(500).send("Erro ao cadastrar.");
        res.status(201).send("Usuário criado com sucesso!");
    })
})

// CRIAR
// app.post('/api/medicamentos', (req, res) => {
//     const { nome, fabricante, valor, forma_uso } = req.body;
//     const sql = `INSERT INTO medicamentos (nome, fabricante, valor, forma_uso) VALUES (?, ?, ?, ?)`;
    
//     db.run(sql, [nome, fabricante, valor, forma_uso], function(err) {
//         if (err) {
//             return res.status(400).json({ error: err.message });
//         }
//         res.json({ id: this.lastID });
//     });
// });

// // DELETAR
// app.delete('/api/medicamentos/:id', (req, res) => {
//     const id = req.params.id;
//     db.run(`DELETE FROM medicamentos WHERE id = ?`, id, function(err) {
//         if (err) {
//             return res.status(400).json({ error: err.message });
//         }
//         res.json({ message: "Removido com sucesso", rows: this.changes });
//     });
// });

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});