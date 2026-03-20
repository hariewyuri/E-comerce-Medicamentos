const inputBusca = document.getElementById('inputBusca');

async function carregarDados() {
    try {
        const response = await fetch('http://localhost:3000/api/produto');
        const produto = await response.json();

        const container = document.querySelector('.body_products');

        produto.forEach(item => {
            cardHTML = `
            <div class="product_card">
                <img class="product_image" src="${item.imagem_url}" alt=""><!-- Inserir caminho da imagem -->
                <span class="product_title">${item.nome}</span><!-- Colocar a variavel de título -->
                <div class="payment_method">
                    ${item.fabricante}
                </div>
                <div class="price_main_row">
                    <span class="current_price">R$ ${Number(item.valor).toFixed(2)}<!-- Colocar a variavel de valor --></span>
                </div>
                <div class="payment_method">
                    À vista no PIX<br>
                    ou até <strong>10x de R$ 414,90</strong>
                </div>
                <button class="buy-button" onclick="adicionarAoCarrinho(${item.id}, '${item.nome}', ${item.valor}, '${item.imagem_url}')">
                <svg class="buy-button-icon-svg" viewBox="0 0 24 24">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
                </svg>
                COMPRAR
                </button>
                </div>
            `;
            container.innerHTML += cardHTML; //Adiciona aos já existentes no ForEach
        });
        // container.innerHTML = cardHTML; //Sobrescreve no forEach

    } catch (error) {
        console.error("Erro ao carregar a tabela:", error);
    }
}

async function buscarProdutos() {
    const termo = inputBusca.value;

    try {
        const response = await fetch(`http://localhost:3000/api/produto/busca?q=${termo}`);
        const produtos = await response.json();

        const container = document.querySelector('.body_products');
        container.innerHTML = "";

        produtos.forEach(item => {
            cardHTML = `
            <div class="product_card">
                <img class="product_image" src="${item.imagem_url}" alt=""><!-- Inserir caminho da imagem -->
                <span class="product_title">${item.nome}</span><!-- Colocar a variavel de título -->
                <div class="payment_method">
                    ${item.fabricante}
                </div>
                <div class="price_main_row">
                    <span class="current_price">R$ ${Number(item.valor).toFixed(2)}<!-- Colocar a variavel de valor --></span>
                </div>
                <div class="payment_method">
                    À vista no PIX<br>
                    ou até <strong>10x de R$ 414,90</strong>
                </div>
                <button class="buy-button" onclick="adicionarAoCarrinho(${item.id}, '${item.nome}', ${item.valor}, '${item.imagem_url}')">
                <svg class="buy-button-icon-svg" viewBox="0 0 24 24">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
                </svg>
                COMPRAR
                </button>
                </div>
            `;
            container.innerHTML += cardHTML;
        });
    } catch (error) {
        console.error("Erro na busca:", error);
    }
} inputBusca.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') buscarProdutos();
});

carregarDados();
