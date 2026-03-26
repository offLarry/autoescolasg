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
 * Mostra/Esconde a senha nos campos de input
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
 * Gerencia o Login e Registro comunicando-se com o Google Sheets
 */
async function handleAuth(e, tipo) {
    e.preventDefault();
    const msg = document.getElementById('authMessage');
    
    // Captura os dados dos inputs
    const email = tipo === 'login' ? document.getElementById('loginEmail').value : document.getElementById('regEmail').value;
    const senha = tipo === 'login' ? document.getElementById('loginPassword').value : document.getElementById('regPassword').value;
    const nome = tipo === 'registro' ? document.getElementById('regNome').value : "";

    if (msg) msg.innerText = "Aguarde...";

    // URL com timestamp para evitar cache do navegador
    const url = `${SHEET_API_URL}?acao=${tipo}&email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}&nome=${encodeURIComponent(nome)}&t=${new Date().getTime()}`;

    try {
        const response = await fetch(url);
        const result = await response.text();

        // CASO 1: LOGIN AUTORIZADO
        if (result.startsWith("autorizado")) {
            const partes = result.split("|");
            const nomeUser = partes[1];
            const liberado = partes[2];
            const progressoCSV = partes[3] || "0%"; // Valor vindo da Coluna F

            // Salva dados de sessão
            localStorage.setItem('usuario_logado', 'true');
            localStorage.setItem('user_name', nomeUser);
            localStorage.setItem('user_email', email); 
            localStorage.setItem('user_pass', senha);
            localStorage.setItem('permissao_curso', liberado);

            // --- RESTAURAÇÃO DE PROGRESSO ---
            // Converte a porcentagem (ex: "50%") em IDs de aulas (leg_1, leg_2...)
            const totalAulas = 4; // Deve ser o mesmo número de aulas do seu script.js
            const porcentagemNumerica = parseInt(progressoCSV) || 0;
            const qtdConcluida = Math.round((porcentagemNumerica / 100) * totalAulas);
            
            let aulasIds = [];
            for (let i = 1; i <= qtdConcluida; i++) {
                aulasIds.push(`leg_${i}`);
            }
            
            // Salva o array de aulas concluídas no formato que o script.js entende
            localStorage.setItem('aulas_concluidas', JSON.stringify(aulasIds));

            // Redireciona para o painel do aluno
            window.location.replace('index.html');

        } 
        // CASO 2: REGISTRO COM SUCESSO
        else if (result.includes("sucesso_registro")) {
            if (msg) msg.innerHTML = "<span style='color: #10b981;'>✅ Conta criada com sucesso! Faça login.</span>";
            switchTab('login');
        } 
        // CASO 3: ERROS (Email duplicado, senha errada, etc)
        else {
            if (msg) {
                if (result.includes("email_existente")) msg.innerText = "❌ Este e-mail já está cadastrado.";
                else if (result.includes("credenciais")) msg.innerText = "❌ E-mail ou senha incorretos.";
                else msg.innerText = "❌ Erro ao processar. Tente novamente.";
            }
        }
    } catch (err) {
        console.error("Erro na autenticação:", err);
        if (msg) msg.innerText = "⚠️ Erro de conexão com o servidor.";
    }
}

// Inicialização dos eventos
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => handleAuth(e, 'login'));
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => handleAuth(e, 'registro'));
    }
});
