document.addEventListener('DOMContentLoaded', () => {
    const userArea = document.getElementById('user-area');
    const nomeCompleto = localStorage.getItem('nome_usuario');
    const token = localStorage.getItem('token_farmacia');

    if (token && nomeCompleto) {
        // Pega apenas o primeiro nome (Divide pelo espaço e pega a primeira parte)
        const primeiroNome = nomeCompleto.split(' ')[0];

        // Altera o conteúdo da div
        userArea.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Gluten:wght@100..900&family=IBM+Plex+Serif:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
                .box-saudacao {
                    display: flex;
                    align-items: center;
                }
                .saudacao {
                    text-align: left;
                    font-family: "Poppins", sans-serif;
                    font-weight: 500;
                    font-size: 14px;
                } .saudacao>strong {
                    text-align: left;
                    font-family: "Poppins", sans-serif;
                    font-size: 20px;
                 } a {
                    text-align: left;
                    font-family: "Poppins", sans-serif;
                    font-weight: 500;
                    font-size: 14px;
                    color: gray;
                    margin-left: 3vh;
                  }
            </style>
            <div class="box-saudacao">
                <span class="saudacao">Seja bem-vindo, <br><strong>${primeiroNome}!</strong></span>
                <a href="#" id="logout">Logout</a>
            </div>
        `;

        // Função para deslogar
        document.getElementById('logout').addEventListener('click', () => {
            localStorage.removeItem('token_farmacia');
            localStorage.removeItem('nome_usuario');
            window.location.reload();
        });
    }
});