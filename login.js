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
    const urlFinal = `${SHEET_API_URL}?acao=${tipo}&email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}&nome=${encodeURIComponent(nome)}`;

    try {
        // IMPORTANTE: Requisição simples (GET) sem headers para o Google não bloquear
        const response = await fetch(urlFinal, { method: 'GET' });
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
            localStorage.setItem('usuario_logado', 'true');
            localStorage.setItem('user_name', partes[1] || "Aluno");
            localStorage.setItem('user_email', email); // Onde 'email' é o valor vindo do input
            localStorage.setItem('permissao_curso', partes[2] || "NÃO");

            if (msg) {
                msg.innerText = "✅ Login realizado! Entrando...";
                msg.style.color = "#4ade80";
            }
            setTimeout(() => window.location.replace('cursoshome.html'), 800);

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
