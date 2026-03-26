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
 * Gerencia a Autenticação e Restauração de Dados
 */
async function handleAuth(e, tipo) {
    e.preventDefault();
    const msg = document.getElementById('authMessage');
    
    const email = tipo === 'login' ? document.getElementById('loginEmail').value : document.getElementById('regEmail').value;
    const senha = tipo === 'login' ? document.getElementById('loginPassword').value : document.getElementById('regPassword').value;
    const nome = tipo === 'registro' ? document.getElementById('regNome').value : "";

    if (msg) msg.innerText = "Verificando dados...";

    const url = `${SHEET_API_URL}?acao=${tipo}&email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}&nome=${encodeURIComponent(nome)}&t=${new Date().getTime()}`;

    try {
        const response = await fetch(url);
        const result = await response.text();

        if (result.startsWith("autorizado")) {
            const partes = result.split("|");
            const nomeUser = partes[1];
            const liberado = partes[2];
            const progressoPlanilha = partes[3] || "0"; 

            // 1. Limpa o LocalStorage para evitar conflito
            localStorage.clear();

            // 2. Salva dados básicos
            localStorage.setItem('usuario_logado', 'true');
            localStorage.setItem('user_name', nomeUser);
            localStorage.setItem('user_email', email); 
            localStorage.setItem('user_pass', senha);
            localStorage.setItem('permissao_curso', liberado);

            // 3. RESTAURAÇÃO DE PROGRESSO (TRATAMENTO DE DECIMAIS)
            const totalAulas = 4; // Ajuste conforme seu script.js
            let porcentagemFinal = 0;

            // Se o Google enviar "0.3" ou "1" (formato decimal da planilha)
            const valorNumerico = parseFloat(progressoPlanilha.toString().replace(',', '.'));
            
            if (!isNaN(valorNumerico)) {
                if (valorNumerico <= 1) {
                    // Caso seja 0.3, vira 30%
                    porcentagemFinal = valorNumerico * 100;
                } else {
                    // Caso seja 30 ou 100
                    porcentagemFinal = valorNumerico;
                }
            }

            const qtdConcluida = Math.round((porcentagemFinal / 100) * totalAulas);
            
            console.log(`Debug: Recebido ${progressoPlanilha} -> Calculado ${porcentagemFinal}% -> Aulas: ${qtdConcluida}`);

            let aulasIds = [];
            for (let i = 1; i <= qtdConcluida; i++) {
                aulasIds.push(`leg_${i}`);
            }
            
            localStorage.setItem('aulas_concluidas', JSON.stringify(aulasIds));

            // 4. Redireciona
            window.location.replace('index.html');

        } else if (result.includes("sucesso_registro")) {
            if (msg) msg.innerHTML = "<span style='color: #10b981;'>✅ Conta criada! Faça login.</span>";
            switchTab('login');
        } else {
            if (msg) msg.innerText = "❌ E-mail ou senha incorretos.";
        }
    } catch (err) {
        console.error(err);
        if (msg) msg.innerText = "⚠️ Erro de conexão com o servidor.";
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm')?.addEventListener('submit', (e) => handleAuth(e, 'login'));
    document.getElementById('registerForm')?.addEventListener('submit', (e) => handleAuth(e, 'registro'));
});
