// URL da sua API no Google Apps Script
const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzVtKRAkHOo_n8MT1rbi0RFUbQqOhmHZdvIlYBrEA943lPdQ-z2W_MzzYqMMfqcCadG/exec';

/**
 * Alterna entre os formulários de Login e Cadastro
 */
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

/**
 * Alterna a visibilidade da senha
 */
function togglePassword(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = document.getElementById(iconId);

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}

/**
 * Processa a Autenticação (Login ou Registro)
 */
async function handleAuth(e, tipo) {
    e.preventDefault();
    const msg = document.getElementById('authMessage');
    
    if (msg) {
        msg.innerText = "Processando... aguarde.";
        msg.style.color = "var(--primary)";
    }

    // Captura os valores corretamente dependendo do formulário
    const email = tipo === 'login' ? document.getElementById('loginEmail').value : document.getElementById('regEmail').value;
    const senha = tipo === 'login' ? document.getElementById('loginPassword').value : document.getElementById('regPassword').value;
    const nome = tipo === 'registro' ? document.getElementById('regNome').value : "";

    // Monta a URL de forma simples para evitar erro de CORS do Google
    const urlFinal = `${SHEET_API_URL}?acao=${tipo}&email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}&nome=${encodeURIComponent(nome)}`;

    try {
        const response = await fetch(urlFinal);
        const result = await response.text();

        console.log("Resposta do Servidor:", result);

        if (result.includes("sucesso_registro")) {
            if (msg) {
                msg.innerText = "✅ Conta criada! Agora faça seu login.";
                msg.style.color = "#4ade80";
            }
            // Limpa o formulário e volta para aba de login
            document.getElementById('registerForm').reset();
            setTimeout(() => switchTab('login'), 2000);

        } else if (result.startsWith("autorizado")) {
            const partes = result.split("|");
            const nomeUsuario = partes[1];
            const permissaoCurso = partes[2];

            localStorage.setItem('usuario_logado', 'true');
            localStorage.setItem('user_name', nomeUsuario);
            localStorage.setItem('permissao_curso', permissaoCurso);

            if (msg) {
                msg.innerText = "✅ Login realizado! Entrando...";
                msg.style.color = "#4ade80";
            }

            setTimeout(() => {
                window.location.replace('index.html');
            }, 800);

        } else if (result === "erro_email_existente") {
            msg.innerText = "❌ Este e-mail já está cadastrado.";
            msg.style.color = "#f59e0b";
        } else {
            msg.innerText = "❌ E-mail ou senha incorretos.";
            msg.style.color = "#ef4444";
        }
    } catch (error) {
        console.error("Erro:", error);
        if (msg) {
            msg.innerText = "⚠️ Erro de conexão com o servidor.";
            msg.style.color = "#f59e0b";
        }
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm')?.addEventListener('submit', (e) => handleAuth(e, 'login'));
    document.getElementById('registerForm')?.addEventListener('submit', (e) => handleAuth(e, 'registro'));
});
