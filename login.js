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
 * Gerencia a Autenticação e Restauração de Dados
 */
async function handleAuth(e, tipo) {
    e.preventDefault();
    const msg = document.getElementById('authMessage');
    
    const email = tipo === 'login' ? document.getElementById('loginEmail').value : document.getElementById('regEmail').value;
    const senha = tipo === 'login' ? document.getElementById('loginPassword').value : document.getElementById('regPassword').value;
    const nome = tipo === 'registro' ? document.getElementById('regNome').value : "";

    if (msg) msg.innerText = "Verificando dados...";

    // URL com timestamp para evitar cache e garantir dados novos do Google
    const url = `${SHEET_API_URL}?acao=${tipo}&email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}&nome=${encodeURIComponent(nome)}&t=${new Date().getTime()}`;

    try {
        const response = await fetch(url);
        const result = await response.text();

        // --- SUCESSO NO LOGIN ---
        if (result.startsWith("autorizado")) {
            const partes = result.split("|");
            const nomeUser = partes[1];
            const liberado = partes[2];
            const progressoPlanilha = partes[3] || "0%"; 

            // 1. Limpa o LocalStorage para evitar conflito com dados de outros usuários
            localStorage.clear();

            // 2. Salva os dados de sessão
            localStorage.setItem('usuario_logado', 'true');
            localStorage.setItem('user_name', nomeUser);
            localStorage.setItem('user_email', email); 
            localStorage.setItem('user_pass', senha);
            localStorage.setItem('permissao_curso', liberado);

            // 3. RESTAURAÇÃO DE PROGRESSO (CONVERSÃO MATEMÁTICA)
            // Transformamos a porcentagem (ex: "75%") de volta em IDs de aulas concluídas
            const totalAulas = 4; // Certifique-se que este número é igual ao total no seu script.js
            const porcentagemNumerica = parseInt(progressoPlanilha) || 0;
            const qtdConcluida = Math.round((porcentagemNumerica / 100) * totalAulas);
            
            let aulasRestauradas = [];
            for (let i = 1; i <= qtdConcluida; i++) {
                aulasRestauradas.push(`leg_${i}`); // Gera ['leg_1', 'leg_2', ...]
            }
            
            // Salva o array reconstruído para o script.js ler na Home
            localStorage.setItem('aulas_concluidas', JSON.stringify(aulasRestauradas));

            // Redireciona para o Painel
            window.location.replace('index.html');

        } 
        // --- SUCESSO NO REGISTRO ---
        else if (result.includes("sucesso_registro")) {
            if (msg) msg.innerHTML = "<span style='color: #10b981;'>✅ Conta criada! Agora faça o login.</span>";
            switchTab('login');
        } 
        // --- TRATAMENTO DE ERROS ---
        else {
            if (msg) {
                if (result.includes("email_existente")) msg.innerText = "❌ Este e-mail já está em uso.";
                else if (result.includes("credenciais")) msg.innerText = "❌ E-mail ou senha incorretos.";
                else msg.innerText = "❌ Erro no servidor. Tente novamente.";
            }
        }
    } catch (err) {
        console.error("Erro na requisição:", err);
        if (msg) msg.innerText = "⚠️ Erro de conexão. Verifique sua internet.";
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm')?.addEventListener('submit', (e) => handleAuth(e, 'login'));
    document.getElementById('registerForm')?.addEventListener('submit', (e) => handleAuth(e, 'registro'));
});
