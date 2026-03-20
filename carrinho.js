const lixeiraSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="trash-icon-svg">
        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
    </svg>
`;

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

    container.innerHTML = "";

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
        const iconeMenosOuLixeira = item.quantidade === 1
            ? lixeiraSVG
            : '-';

        const cardHTML = `
            <div class="cart_item_card">
                <img class="cart_item_image" src="${item.imagem_url}" alt="${item.nome}">
                
                <div class="cart_item_info">
                    <a class="product_title">${item.nome}</a>
                </div>
                <div class="controle-quantidade">
                    <button onclick="alterarQuantidade(${item.id}, 'diminuir')" class="btn-qty">
                        ${iconeMenosOuLixeira}
                    </button>
                    <span class="qty-numero">${item.quantidade}</span>
                    <button onclick="alterarQuantidade(${item.id}, 'aumentar')" class="btn-qty">+</button>
                </div>

                <div class="cart_item_price">
                    R$ ${(item.preco * item.quantidade).toFixed(2)}
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

function alterarQuantidade(id, acao) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho_farmacia')) || [];
    const index = carrinho.findIndex(item => item.id === id);

    if (index !== -1) {
        if (acao === 'aumentar') {
            carrinho[index].quantidade += 1;
        } else if (acao === 'diminuir') {
            if (carrinho[index].quantidade > 1) {
                carrinho[index].quantidade -= 1;
            } else {
                // Se a quantidade for 1 e clicar no botão, removemos o item (Ação da Lixeira)
                carrinho.splice(index, 1);
            }
        }

        // Salva e re-renderiza a página para atualizar os valores
        localStorage.setItem('carrinho_farmacia', JSON.stringify(carrinho));
        renderizarCarrinho(); // Chama a função que desenha a tela
        atualizarContadorCarrinho(); // Atualiza o ícone do topo
    }
}

async function finalizarPedido() {
    const token = localStorage.getItem('token_farmacia');
    const carrinho = JSON.parse(localStorage.getItem('carrinho_farmacia'));

    // O ESCUDO FRONTAL: Barra nulo de verdade e "nulo" em texto
    if (!token || token === 'null' || token === 'undefined' || token === '') {
        alert("Você precisa estar logado para finalizar a compra!");
        // Redireciona para o login e para a execução da função aqui (return)
        window.location.href = 'login.html';
        return; 
    }

    if (!carrinho || carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    try {
        const response = await fetch('http://localhost:3000/api/pedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                itens: carrinho, // Enviamos a lista para o servidor conferir
                valorTotal: calcularTotalDoCarrinho()
            })
        });

        if (response.ok) {
            const resultado = await response.json();
            alert("Pedido #" + resultado.pedidoId + " confirmado!");

            // 1. Limpa o carrinho para a próxima compra
            localStorage.removeItem('carrinho_farmacia');

            // 2. Redireciona para a página de sucesso ou nota fiscal
            window.location.href = `sucesso.html?id=${resultado.pedidoId}`;
        }
    } catch (error) {
        console.error("Erro ao enviar pedido:", error);
    }
}

function calcularTotalDoCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho_farmacia')) || [];
    const FRETE_FIXO = 15.00;

    const totalProdutos = carrinho.reduce((acumulador, item) => {
        return acumulador + (item.preco * item.quantidade);
    }, 0);

    return totalProdutos + FRETE_FIXO;
}