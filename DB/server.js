require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;
const app = express();
const port = process.env.PORT;

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

app.post('/api/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const sql = 'INSERT INTO usuario (nome , email, senha_hash) VALUES (?, ?, ?)';
    db.run(sql, [nome, email, senhaHash], (err) => {
        if (err) {
            console.error("ERRO NO SQLITE:", err.message);

            if (err.message.includes("UNIQUE constraint failed")) {
                return res.status(400).send("Este e-mail já está cadastrado.");
            }
            return res.status(500).send("Erro interno no banco de dados.");
        }
        res.status(201).send("Usuário criado com sucesso!");
    });
});

app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;

    db.get('SELECT * FROM usuario WHERE email = ?', [email], async (err, usuario) => {
        if (!usuario) return res.status(404).send("Usuário não encontrado");

        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaValida) return res.status(401).send("Senha Inválida.");

        const token = jwt.sign({ id: usuario.id }, SECRET_KEY, { expiresIn: '1h' });

        res.json({
            auth: true,
            token: token,
            nomeUsuario: usuario.nome
        });
    });
});

app.get('/api/produto/busca', (req, res) => {
    const termo = req.query.q;
    const sql = "SELECT * FROM produto WHERE nome LIKE ?";
    db.all(sql, [`%${termo}%`], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
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