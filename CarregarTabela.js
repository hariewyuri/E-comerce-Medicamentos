async function carregarDados() {
    try {
        const response = await fetch('http://localhost:3000/api/produto');
        const produto = await response.json();
        
        const container = document.querySelector('.body_products');

        produto.forEach(item => {
            cardHTML = `
                <style>
                @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');
                .product_card {
                    font-family: 'Open Sans', sans-serif;
                    width: 280px;
                    height: 440px;
                    background: #ffffff;
                    border-radius: 4px;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
                    padding: 16px;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }
                .product_image {
                    width: 100%;
                    height: 180px;
                    object-fit: contain;
                    margin-bottom: 16px;
                }
                .product_title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #3f4a59;
                    line-height: 1.4;
                    margin: 0 0 16px 0;
                }
                .price_main-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                }

                .current_price {
                    font-size: 22px;
                    font-weight: 900;
                    color: #ff6500;
                }
                .payment_method {
                    font-size: 13px;
                    color: #7f858d;
                    line-height: 1.5;
                    margin-bottom: 20px;
                }
                .buy-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 30px;
                    margin-bottom: 15px;
                    height: 35px;
                    gap: 8px;
                    background-color: #ff6500;
                    color: #fff;
                    border: none;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .buy-button-icon-svg {
                    fill: #fff;
                    width: 20px;
                    height: 20px;
                }
            </style>
            <div class="product_card">
                <img class="product_image" src="${item.imagem_url}" alt=""><!-- Inserir caminho da imagem -->
                <h3 class="product_title">${item.nome}}</h3><!-- Colocar a variavel de título -->
                <div class="price_main_row">
                    <span class="current_price">R$ ${Number(item.valor).toFixed(2)}<!-- Colocar a variavel de valor --></span>
                </div>
                <div class="payment_method">
                    À vista no PIX<br>
                    ou até <strong>10x de R$ 414,90</strong>
                </div>
                <button class="buy-button">
                <svg class="buy-button-icon-svg" viewBox="0 0 24 24">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
                </svg>
                    COMPRAR
                </div>
            `;
            container.innerHTML += cardHTML; //Adiciona aos já existentes no ForEach
        });
        // container.innerHTML = cardHTML; //Sobrescreve no forEach

    } catch (error) {
        console.error("Erro ao carregar a tabela:", error);
    }
}

// A função de deletar precisa estar no escopo global para o botão funcionar
async function deletarRemedio(id) {
    if (confirm("Deseja realmente excluir este item?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/medicamentos/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert("Remédio excluído com sucesso!");
                carregarDados(); // Recarrega a tabela sem precisar dar F5 na página inteira
            } else {
                alert("Erro ao excluir o item.");
            }
        } catch (error) {
            console.error("Erro na requisição DELETE:", error);
        }
    }
}

// Inicia o carregamento
carregarDados();

async function cadastrarRemedio() {
    const nome = document.getElementById('nome').value;
    const fabricante = document.getElementById('fabricante').value;
    const valor = document.getElementById('valor').value;
    const forma_uso = document.getElementById('forma_uso').value;

    if (!nome.trim() || !fabricante.trim() || !valor.trim() || !forma_uso.trim()) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    const novoRemedio = { nome, fabricante, valor, forma_uso };

    try {
        const response = await fetch('http://localhost:3000/api/medicamentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoRemedio)
        });

        if (response.ok) {
            alert("Cadastrado com sucesso!");
            // Limpa os campos
            document.getElementById('nome').value = "";
            document.getElementById('fabricante').value = "";
            document.getElementById('valor').value = "";
            document.getElementById('forma_uso').value = "";
            
            carregarDados(); // Atualiza a tabela na hora
        }
    } catch (error) {
        console.error("Erro ao cadastrar:", error);
    }
}