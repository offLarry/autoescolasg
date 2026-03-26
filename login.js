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
    
    // Limpa mensagens ao trocar de aba
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
 * Alterna a visibilidade da senha e troca o ícone do olhinho
 * @param {string} inputId - ID do campo de input
 * @param {string} iconId - ID do ícone <i>
 */
function togglePassword(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = document.getElementById(iconId);

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        // Troca o ícone para "olho cortado"
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        // Volta para o ícone de "olho aberto"
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
        msg.innerText = "Verificando dados...";
        msg.style.color = "var(--primary)";
    }

    // Coleta os dados dos inputs
    const email = tipo === 'login' ? document.getElementById('loginEmail').value : document.getElementById('regEmail').value;
    const senha = tipo === 'login' ? document.getElementById('loginPassword').value : document.getElementById('regPassword').value;
    const nome = tipo === 'registro' ? document.getElementById('regNome').value : "";

    // Monta a URL de forma segura
    const urlFinal = `${SHEET_API_URL}?acao=${tipo}&email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}&nome=${encodeURIComponent(nome)}`;

    try {
        // O modo 'cors' é essencial para o Google Apps Script
        const response = await fetch(urlFinal, { method: 'GET' });
        const result = await response.text();

        if (result.startsWith("autorizado") || result.includes("sucesso")) {
            const partes = result.split("|");
            
            // Salva os dados no navegador
            localStorage.setItem('usuario_logado', 'true');
            localStorage.setItem('user_name', partes[1] || nome || "Aluno");
            localStorage.setItem('permissao_curso', partes[2] || "NÃO");

            if (msg) {
                msg.innerText = "✅ Acesso permitido! Entrando...";
                msg.style.color = "#4ade80";
            }

            // Redireciona após um breve delay
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
        console.error("Erro detalhado:", error);
        if (msg) {
            msg.innerText = "⚠️ Erro de rede. Verifique sua conexão ou o link da API.";
            msg.style.color = "#f59e0b";
        }
    }
}

// Inicialização dos Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm')?.addEventListener('submit', (e) => handleAuth(e, 'login'));
    document.getElementById('registerForm')?.addEventListener('submit', (e) => handleAuth(e, 'registro'));
});
