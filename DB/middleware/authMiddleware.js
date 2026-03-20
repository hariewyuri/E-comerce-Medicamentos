const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // O ESCUDO TRASEIRO
    if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ message: "Acesso negado. Faça login." });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.usuarioId = decoded.id;
        next();
    } catch (error) {
        console.error("Motivo do erro 403 (JWT):", error.message); 
        
        res.status(403).json({ message: "Token inválido ou expirado." });
    }
}

module.exports = verificarToken;