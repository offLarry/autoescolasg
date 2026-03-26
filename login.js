const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzVtKRAkHOo_n8MT1rbi0RFUbQqOhmHZdvIlYBrEA943lPdQ-z2W_MzzYqMMfqcCadG/exec';

function switchTab(mode) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const msg = document.getElementById('authMessage');
    
    if (msg) msg.innerText = "";

    if (mode === 'login') {
        loginForm?.classList.remove('hidden');
        registerForm?.classList.add('hidden');
        tabLogin?.classList.add('active');
        tabRegister?.classList.remove('active');
    } else {
        loginForm?.classList.add('hidden');
        registerForm?.classList.remove('hidden');
        tabLogin?.classList.remove('active');
        tabRegister?.classList.add('active');
    }
}

function togglePassword(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = document.getElementById(iconId);
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

async function handleAuth(e, tipo) {
    e.preventDefault();
    const msg = document.getElementById('authMessage');
    
    if (msg) {
        msg.innerText = "Processando... aguarde.";
        msg.style.color = "var(--primary)";
    }

    // Captura os dados dos inputs
    const email = tipo === 'login' ? document.getElementById('loginEmail').value : document.getElementById('regEmail').value;
    const senha = tipo === 'login' ? document.getElementById('loginPassword').value : document.getElementById('regPassword').value;
    const nome = tipo === 'registro' ? document.getElementById('regNome').value : "";

    // CONSTRUÇÃO DA URL (O segredo para não dar erro de CORS)
// Dentro da sua handleAuth, altere a linha do fetch:
    const urlFinal = `${SHEET_API_URL}?acao=${tipo}&email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}&nome=${encodeURIComponent(nome)}&t=${new Date().getTime()}`; // Adicionamos um timestamp &t=...
    
    try {
        const response = await fetch(urlFinal, {
            method: 'GET',
            mode: 'cors', // Adicione explicitamente
            redirect: 'follow' // Instrua o navegador a seguir o redirecionamento do Google
        });
        const result = await response.text();

        if (result.includes("sucesso_registro")) {
            if (msg) {
                msg.innerText = "✅ Conta criada com sucesso! Faça seu login.";
                msg.style.color = "#4ade80";
            }
            document.getElementById('registerForm').reset();
            setTimeout(() => switchTab('login'), 1500);

        } else if (result.startsWith("autorizado")) {
            const partes = result.split("|");
            const nome = partes[1];
            const liberado = partes[2];
            const progressoVindoDoSheets = partes[3]; // Ex: "25%"
        
            localStorage.setItem('usuario_logado', 'true');
            localStorage.setItem('user_name', nome);
            localStorage.setItem('permissao_curso', liberado);
            
            // Converte a porcentagem (ex: "25%") em IDs de aula para o sistema entender
            // Se o progresso for 25% de 4 aulas, vamos simular que ele concluiu a aula 1
            if (progressoVindoDoSheets !== "0%") {
                const numAulas = 4; // Total de aulas que você tem
                const valorNumerico = parseInt(progressoVindoDoSheets);
                const quantConcluida = Math.round((valorNumerico / 100) * numAulas);
                
                let aulasIds = [];
                for(let i=1; i <= quantConcluida; i++) {
                    aulasIds.push(`leg_${i}`); // Gera ids leg_1, leg_2, etc
                }
                localStorage.setItem('aulas_concluidas', JSON.stringify(aulasIds));
            }
            if (msg) {
                msg.innerText = "✅ Login realizado! Entrando...";
                msg.style.color = "#4ade80";
            }
            setTimeout(() => window.location.replace('cursoshome.html'), 200);

        } else if (result === "erro_email_existente") {
            msg.innerText = "❌ Este e-mail já está cadastrado.";
            msg.style.color = "#f59e0b";
        } else {
            msg.innerText = "❌ E-mail ou senha incorretos.";
            msg.style.color = "#ef4444";
        }
    } catch (error) {
        console.error("Erro técnico:", error);
        if (msg) {
            msg.innerText = "⚠️ Erro de conexão. Verifique se a API está ativa.";
            msg.style.color = "#f59e0b";
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm')?.addEventListener('submit', (e) => handleAuth(e, 'login'));
    document.getElementById('registerForm')?.addEventListener('submit', (e) => handleAuth(e, 'registro'));
});
