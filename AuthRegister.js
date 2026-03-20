async function auth(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {

            localStorage.setItem('token_farmacia', data.token);
            localStorage.setItem('nome_usuario', data.nomeUsuario);
            alert("Login bem-sucedido!");
            window.location.href = 'Index.html';
        } else {
            alert("Falha no login: " + (data.message || "Credenciais inválidas"));
        }

    } catch (error) {
        console.error("Erro na autenticação:", error);
    }
}

async function register(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('http://localhost:3000/api/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });

        const data = await response.text();

        if (response.ok) {
            alert("Cadastro realizado! Agora faça o login.");
            window.location.href = 'login.html';
        } else {
            alert("Erro no cadastro: " + data);
        }
    } catch (error) {
        console.error("Erro ao conectar com o servidor: ", error);
    }
}

document.getElementById('formLogin')?.addEventListener('submit', auth);
document.getElementById('formCadastro')?.addEventListener('submit', register);