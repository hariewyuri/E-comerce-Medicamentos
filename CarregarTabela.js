async function carregarDados() {
    try {
        const response = await fetch('http://localhost:3000/api/medicamentos');
        const medicamentos = await response.json();
        
        const corpo = document.getElementById('corpo-tabela');
        corpo.innerHTML = ""; // Limpa a tabela

        medicamentos.forEach(item => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${item.nome}</td>
                <td>${item.fabricante}</td>
                <td>R$ ${Number(item.valor).toFixed(2)}</td>
                <td>${item.forma_uso}</td>
                <td>
                    <button onclick="deletarRemedio(${item.id})" class="btn-excluir">
                        🗑️
                    </button>
                </td>
            `;
            corpo.appendChild(linha);
        });

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