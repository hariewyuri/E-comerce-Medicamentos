document.addEventListener('DOMContentLoaded', carregarMeusPedidos);

async function carregarMeusPedidos() {
    const token = localStorage.getItem('token_farmacia');
    const container = document.getElementById('lista-meus-pedidos');

    // Blindagem Front-end: Sem crachá, sem acesso!
    if (!token) {
        alert("Você precisa estar logado para ver seus pedidos.");
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/meus-pedidos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const pedidos = await response.json();

            if (pedidos.length === 0) {
                container.innerHTML = `<div class="mensagem-vazio">Você ainda não fez nenhum pedido. 😢</div>`;
                return;
            }

            // Limpa o "Carregando..." e desenha os cards
            container.innerHTML = "";

            pedidos.forEach(pedido => {
                // Formata a data (se ela foi salva em formato ISO ou brasileiro)
                const dataFormatada = pedido.data_pedido.split(' ')[0]; // Pega só a parte da data, sem a hora

                const cardHTML = `
                    <div class="pedido-card">
                        <div class="pedido-info">
                            <h3>Pedido #${pedido.id.toString().padStart(5, '0')}</h3>
                            <p>📅 Realizado em: <strong>${dataFormatada}</strong></p>
                            <p>💰 Valor Total: <strong>R$ ${pedido.valor_total.toFixed(2)}</strong></p>
                            <span class="pedido-status">✅ Aprovado</span>
                        </div>
                        <div class="pedido-acoes">
                            <a href="sucesso.html?id=${pedido.id}" class="btn-ver-recibo">Ver Recibo</a>
                        </div>
                    </div>
                `;
                container.innerHTML += cardHTML;
            });

        } else {
            // Se o token expirou (Erro 401/403)
            alert("Sua sessão expirou. Faça login novamente.");
            localStorage.removeItem('token_farmacia');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        container.innerHTML = `<p style="color:red; text-align:center;">Erro ao conectar com o servidor.</p>`;
    }
}