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
        msg.innerText = "Aguarde um momento...";
        msg.style.color = "var(--primary)";
    }

    const dados = {
        acao: tipo,
        email: tipo === 'login' ? document.getElementById('loginEmail').value : document.getElementById('regEmail').value,
        senha: tipo === 'login' ? document.getElementById('loginPassword').value : document.getElementById('regPassword').value,
        nome: tipo === 'registro' ? document.getElementById('regNome').value : ""
    };

    try {
        const query = new URLSearchParams(dados).toString();
        const response = await fetch(`${SHEET_API_URL}?${query}`);
        const result = await response.text();

        // Verifica se o retorno indica sucesso
        if (result.includes("sucesso") || result.startsWith("autorizado")) {
            localStorage.setItem('usuario_logado', 'true');
            
            // Extrai o nome do utilizador se vier da API, senão usa o do input
            let nomeFinal = dados.nome || "Aluno";
            if (result.startsWith("autorizado")) {
                nomeFinal = result.split("|")[1] || "Aluno";
            }
            localStorage.setItem('user_name', nomeFinal);

            if (msg) {
                msg.innerText = "✅ Acesso permitido! Redirecionando...";
                msg.style.color = "#4ade80";
            }

            setTimeout(() => {
                window.location.replace('cursoshome.html');
            }, 800);
        } else {
            if (msg) {
                msg.innerText = "❌ Erro: E-mail ou senha inválidos.";
                msg.style.color = "#ef4444";
            }
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        if (msg) {
            msg.innerText = "⚠️ Erro de conexão com o servidor.";
            msg.style.color = "#f59e0b";
        }
    }
}

// Inicialização dos Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm')?.addEventListener('submit', (e) => handleAuth(e, 'login'));
    document.getElementById('registerForm')?.addEventListener('submit', (e) => handleAuth(e, 'registro'));
});
