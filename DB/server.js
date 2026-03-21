require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verificarToken = require('./middleware/authMiddleware');
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

app.post('/api/pedido', verificarToken, (req, res) => {
    const { itens, valorTotal } = req.body;
    const usuarioId = req.usuarioId;
    const dataPedido = new Date().toLocaleString('pt-BR');

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        const sqlPedido = `INSERT INTO pedido (usuario_id, data_pedido, valor_total) VALUES (?, ?, ?)`;

        db.run(sqlPedido, [usuarioId, dataPedido, valorTotal], function (err) {
            if (err) {
                db.run("ROLLBACK");
                console.error("ERRO AO INSERIR PEDIDO:", err.message);
                return res.status(500).json({ message: "Erro ao criar pedido" });
            }

            const pedidoId = this.lastID;
            const sqlItens = `INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)`;

            let itensProcessados = 0;
            let houveErro = false;

            // Se o carrinho estiver vazio (segurança extra)
            if (itens.length === 0) {
                db.run("COMMIT");
                return res.status(201).json({ message: "Pedido vazio criado", pedidoId });
            }

            itens.forEach((item) => {
                db.run(sqlItens, [pedidoId, item.id, item.quantidade, item.preco], (err) => {
                    // O console SÓ PODE RODAR se o 'err' existir de verdade!
                    if (err) {
                        houveErro = true;
                        console.error("ERRO AO INSERIR ITEM:", err.message);
                    }

                    itensProcessados++;

                    if (itensProcessados === itens.length) {
                        if (houveErro) {
                            db.run("ROLLBACK");
                            if (!res.headersSent) return res.status(500).json({ message: "Erro nos itens" });
                        } else {
                            db.run("COMMIT");
                            if (!res.headersSent) return res.status(201).json({
                                message: "Pedido finalizado com sucesso!",
                                pedidoId: pedidoId
                            });
                        }
                    }
                });
            });
        });
    });
});

app.get('/api/pedido/:id', verificarToken, (req, res) => {
    const pedidoId = req.params.id;
    const usuarioId = req.usuarioId; // Segurança: Garante que o usuário só veja o próprio pedido

    // 1. Busca o cabeçalho do pedido
    db.get(`SELECT * FROM pedido WHERE id = ? AND usuario_id = ?`, [pedidoId, usuarioId], (err, pedido) => {
        if (err) return res.status(500).json({ message: "Erro no banco de dados" });
        if (!pedido) return res.status(404).json({ message: "Pedido não encontrado ou acesso negado." });

        // 2. Busca os itens fazendo um JOIN com a tabela de produtos para pegar o nome
        const sqlItens = `
            SELECT p.nome, ip.quantidade, ip.preco_unitario 
            FROM itens_pedido ip
            JOIN produto p ON ip.produto_id = p.id
            WHERE ip.pedido_id = ?
        `;

        db.all(sqlItens, [pedidoId], (err, itens) => {
            if (err) return res.status(500).json({ message: "Erro ao buscar itens do pedido" });
            
            // Devolve o pacote completo (Pedido + Itens)
            res.status(200).json({
                pedido: pedido,
                itens: itens
            });
        });
    });
});

app.get('/api/meus-pedidos', verificarToken, (req, res) => {
    const usuarioId = req.usuarioId; // O crachá dedurou quem é o usuário!

    // Buscamos apenas os pedidos deste usuário, ordenados do mais novo para o mais velho (DESC)
    const sql = `SELECT * FROM pedido WHERE usuario_id = ? ORDER BY id DESC`;

    db.all(sql, [usuarioId], (err, pedidos) => {
        if (err) {
            console.error("Erro ao buscar histórico:", err.message);
            return res.status(500).json({ message: "Erro ao buscar seus pedidos." });
        }
        
        // Devolvemos a lista (array) de pedidos para o front-end
        res.status(200).json(pedidos);
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});