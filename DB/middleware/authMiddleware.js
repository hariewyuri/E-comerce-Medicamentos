const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

function verificarToken(req, res, next) {
    // O token geralmente vem no cabeçalho 'Authorization'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Pega apenas a string após 'Bearer'

    if (!token) {
        return res.status(401).json({ message: "Acesso negado. Faça login para continuar." });
    }

    try {
        // Valida o token e extrai os dados (o ID do usuário que colocamos no login)
        const decoded = jwt.verify(token, SECRET_KEY);
        req.usuarioId = decoded.id; // Salva o ID na requisição para usar na hora de salvar o pedido
        next(); // Se estiver tudo ok, libera para a próxima função (a de salvar o pedido)
    } catch (error) {
        res.status(403).json({ message: "Token inválido ou expirado." });
    }
}

module.exports = verificarToken;