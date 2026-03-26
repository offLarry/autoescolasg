// --- CONFIGURAÇÃO ---
const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzVtKRAkHOo_n8MT1rbi0RFUbQqOhmHZdvIlYBrEA943lPdQ-z2W_MzzYqMMfqcCadG/exec';

/**
 * Alterna entre as abas de Login e Registro
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
 * Mostra/Esconde a senha
 */
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

/**
 * Lógica de Autenticação e Restauração de Dados
 */
async function handleAuth(e, tipo) {
    e.preventDefault();
    const msg = document.getElementById('authMessage');
    
    const email = tipo === 'login' ? document.getElementById('loginEmail').value : document.getElementById('regEmail').value;
    const senha = tipo === 'login' ? document.getElementById('loginPassword').value : document.getElementById('regPassword').value;
    const nome = tipo === 'registro' ? document.getElementById('regNome').value : "";

    if (msg) msg.innerText = "Processando...";

    const url = `${SHEET_API_URL}?acao=${tipo}&email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}&nome=${encodeURIComponent(nome)}&t=${new Date().getTime()}`;

    try {
        const response = await fetch(url);
        const result = await response.text();

        if (result.startsWith("autorizado")) {
            // A resposta do Google deve ser: autorizado|Nome|Liberado|Progresso
            const partes = result.split("|");
            const nomeUser = partes[1];
            const liberado = partes[2];
            const progressoPlanilha = partes[3] || "0%"; 

            // 1. Salva dados de sessão
            localStorage.setItem('usuario_logado', 'true');
            localStorage.setItem('user_name', nomeUser);
            localStorage.setItem('user_email', email); 
            localStorage.setItem('user_pass', senha);
            localStorage.setItem('permissao_curso', liberado);

            // 2. RESTAURAÇÃO DO PROGRESSO (O "PULO DO GATO")
            // Transformamos a string "50%" em IDs de aulas concluídas
            const totalAulas = 4; // Ajuste para o número real de aulas do seu script.js
            const porcentagemNumerica = parseInt(progressoPlanilha) || 0;
            const qtdConcluida = Math.round((porcentagemNumerica / 100) * totalAulas);
            
            let aulasIds = [];
            for (let i = 1; i <= qtdConcluida; i++) {
                aulasIds.push(`leg_${i}`); // Cria a lista ['leg_1', 'leg_2'...]
            }
            
            // Salva a lista de aulas de volta no navegador
            localStorage.setItem('aulas_concluidas', JSON.stringify(aulasIds));

            window.location.replace('index.html');

        } else if (result.includes("sucesso_registro")) {
            msg.innerText = "✅ Conta criada! Faça login.";
            switchTab('login');
        } else {
            msg.innerText = "❌ Dados incorretos ou erro no servidor.";
        }
    } catch (err) {
        msg.innerText = "⚠️ Erro de conexão.";
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm')?.addEventListener('submit', (e) => handleAuth(e, 'login'));
    document.getElementById('registerForm')?.addEventListener('submit', (e) => handleAuth(e, 'registro'));
});
