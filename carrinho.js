function adicionarAoCarrinho(id, nome, preco, imagem) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho_farmacia')) || [];

    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            id: id,
            nome: nome,
            preco: preco,
            imagem_url: imagem,
            quantidade: 1
        });
    }

    localStorage.setItem('carrinho_farmacia', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
}

function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho_farmacia')) || [];
    const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    document.getElementById('cart-count').innerText = totalItens;
}

document.addEventListener('DOMContentLoaded', renderizarCarrinho);


function renderizarCarrinho() {
    // 1. Lê o carrinho do LocalStorage
    const carrinho = JSON.parse(localStorage.getItem('carrinho_farmacia')) || [];
    const container = document.getElementById('container-itens-carrinho');


    // Elementos do Resumo
    const valorProdutosHtml = document.getElementById('valor-produtos-resumo');
    const valorTotalHtml = document.getElementById('valor-total-resumo');

    container.innerHTML = ""; // Limpa antes de renderizar

    let totalProdutos = 0;
    const FRETE_FIXO = 15.00; // Simulação de frete

    if (carrinho.length === 0) {
        container.innerHTML = "<p>Seu carrinho está vazio.</p>";
        valorProdutosHtml.innerText = "R$ 0,00";
        valorTotalHtml.innerText = "R$ 0,00";
        return;
    }

    carrinho.forEach(item => {
        const subtotalItem = item.preco * item.quantidade;
        totalProdutos += subtotalItem;

        const cardHTML = `
            <div class="cart_item_card">
                <img class="cart_item_image" src="${item.imagem_url}" alt="${item.nome}">
                
                <div class="cart_item_info" style="margin-left: 2vw; color: black;">
                    <span class="product_title"><strong style="font-weight: 400;">${item.nome}<strong></span>
                    <p class="payment_method" style="text-align: left; font-weight: 300;">Quantidade: ${item.quantidade}</p>
                </div>

                <div class="cart_item_price">
                    R$ ${subtotalItem.toFixed(2)}
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });

    // 3. Atualiza o Resumo na Direita (Medida de Desempenho)
    valorProdutosHtml.innerText = `R$ ${totalProdutos.toFixed(2)}`;
    const totalCompra = totalProdutos + FRETE_FIXO;
    valorTotalHtml.innerText = `R$ ${totalCompra.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', atualizarContadorCarrinho);