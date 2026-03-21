document.addEventListener('DOMContentLoaded', carregarNotaFiscal);

async function carregarNotaFiscal() {
    // 1. Pega o ID do pedido que está na URL (ex: sucesso.html?id=5)
    const urlParams = new URLSearchParams(window.location.search);
    const pedidoId = urlParams.get('id');
    const token = localStorage.getItem('token_farmacia');

    if (!pedidoId || !token) {
        alert("Acesso inválido.");
        window.location.href = 'index.html';
        return;
    }

    try {
        // 2. Busca os dados no seu Back-end
        const response = await fetch(`http://localhost:3000/api/pedido/${pedidoId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Erro ao buscar pedido");

        const dados = await response.json();
        
        // 3. Preenche a tela com os dados do banco
        document.getElementById('num-pedido').innerText = dados.pedido.id.toString().padStart(5, '0');
        document.getElementById('data-pedido').innerText = dados.pedido.data_pedido;
        document.getElementById('valor-total').innerText = `R$ ${dados.pedido.valor_total.toFixed(2)}`;

        // 4. Desenha a lista de itens
        const listaItens = document.getElementById('lista-itens');
        listaItens.innerHTML = "";

        dados.itens.forEach(item => {
            const subtotal = item.quantidade * item.preco_unitario;
            listaItens.innerHTML += `
                <div class="item-linha">
                    <span>${item.quantidade}x ${item.nome}</span>
                    <span>R$ ${subtotal.toFixed(2)}</span>
                </div>
            `;
        });

    } catch (error) {
        console.error(error);
        alert("Não foi possível carregar a nota fiscal.");
    }
}