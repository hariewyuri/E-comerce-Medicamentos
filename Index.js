document.addEventListener('DOMContentLoaded', verificarEstadoLogin);

function verificarEstadoLogin() {
    const token = localStorage.getItem('token_farmacia');
    const btnUsuario = document.getElementById('btn-usuario');
    const dropdownUsuario = document.getElementById('dropdown-usuario');

    if (token) {
        // --- ESTADO LOGADO ---
        // Muda o texto do botão (Se você salvar o nome do usuário no login, pode colocar aqui)
        btnUsuario.innerHTML = 'Minha Conta ▼';
        // O dropdown já vai funcionar via CSS no hover
    } else {
        // --- ESTADO DESLOGADO ---
        btnUsuario.innerHTML = 'Entrar / Cadastrar';

        // Remove a lista suspensa do HTML para ninguém ver as opções
        dropdownUsuario.style.display = 'none';

        // Transforma o container inteiro em um link gigante para a tela de login
        document.getElementById('container-usuario').onclick = function () {
            window.location.href = 'login.html';
        };
    }
}

function fazerLogout() {
    // Confirmação para evitar cliques acidentais
    if (confirm("Tem certeza que deseja sair?")) {
        localStorage.removeItem('token_farmacia');
        // Se quiser limpar o carrinho ao sair, descomente a linha abaixo:
        // localStorage.removeItem('carrinho_farmacia'); 

        alert("Deslogado com sucesso!");
        window.location.href = 'index.html'; // Manda de volta pra vitrine
    }
}