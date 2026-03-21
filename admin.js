document.getElementById('form-add-produto').addEventListener('submit', async function (evento) {
    // Impede o recarregamento padrão da página ao enviar o formulário
    evento.preventDefault();

    const nome = document.getElementById('nome-produto').value;
    const fabricante = document.getElementById('nome-fabricante').value;
    const valor = parseFloat(document.getElementById('valor-produto').value);
    const imagem_url = document.getElementById('imagem-produto').value;

    const btnSalvar = document.querySelector('.btn-salvar');
    btnSalvar.innerText = "Salvando...";
    btnSalvar.disabled = true;

    try {
        const response = await fetch('http://localhost:3000/api/produto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                valor: valor,
                imagem_url: imagem_url,
                fabricante: fabricante
            })
        });

        const dados = await response.json();

        if (response.ok) {
            alert(dados.message + " (ID: " + dados.produtoId + ")");
            document.getElementById('form-add-produto').reset(); // Limpa os campos
        } else {
            alert("Erro: " + dados.message);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro de conexão com o servidor.");
    } finally {
        // Restaura o botão independente de dar certo ou errado
        btnSalvar.innerText = "Salvar no Banco de Dados";
        btnSalvar.disabled = false;
    }
});

document.addEventListener('DOMContentLoaded', carregarListaAdmin);

async function carregarListaAdmin() {
    const container = document.getElementById('lista-admin-produtos');
    
    try {
        // Aproveitamos a rota GET que você já tinha feito para a vitrine!
        const response = await fetch('http://localhost:3000/api/produto');
        const produtos = await response.json();

        container.innerHTML = ""; // Limpa o carregando

        produtos.forEach(produto => {
            container.innerHTML += `
                <div class="admin-item">
                    <span><strong>${produto.id}</strong> - ${produto.nome} (R$ ${produto.valor.toFixed(2)})</span>
                    <button class="btn-deletar" onclick="deletarProduto(${produto.id}, '${produto.nome}')">Excluir</button>
                </div>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar lista:", error);
        container.innerHTML = "Erro ao carregar os produtos.";
    }
}

async function deletarProduto(id, nome) {
    // Confirmação de segurança dupla (Sensor)
    if (!confirm(`Tem CERTEZA absoluta que deseja excluir o remédio "${nome}"? Essa ação não pode ser desfeita.`)) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/produto/${id}`, {
            method: 'DELETE'
        });

        const dados = await response.json();

        if (response.ok) {
            alert(dados.message);
            // Recarrega a lista para o item sumir da tela imediatamente
            carregarListaAdmin(); 
        } else {
            alert("Erro: " + dados.message);
        }
    } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Erro de conexão com o servidor.");
    }
}