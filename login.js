/* ==========================================================================
   AUTOESCOLA SÃO GOTARDO - LÓGICA DE LOGIN COM ALTERNÂNCIA E SUPORTE A TEMAS
   ========================================================================== */

// URL da API do Google Apps Script (Sua planilha funciona como banco de dados)
const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzVtKRAkHOo_n8MT1rbi0RFUbQqOhmHZdvIlYBrEA943lPdQ-z2W_MzzYqMMfqcCadG/exec';

/**
 * Inicializa e verifica o tema salvo no navegador do usuário
 */
function initThemeLogin() {
    // Lê o tema gravado no localStorage; se não houver, assume 'dark'
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            // Alterna o tema
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme); // Grava a escolha no navegador
            updateThemeIcon(newTheme);
        });
    }
}

/**
 * Atualiza o ícone (Sol ou Lua) conforme o tema
 */
function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

/**
 * Alterna a visualização entre as abas de 'Login' e 'Criar Conta'
 */
function switchTab(mode) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const msg = document.getElementById('authMessage');

    if (msg) msg.innerText = ""; // Limpa mensagens anteriores

    if (mode === 'login') {
        loginForm?.classList.remove('hidden');   // Mostra login
        registerForm?.classList.add('hidden');    // Esconde cadastro
        tabLogin?.classList.add('active');       // Destaca aba login
        tabRegister?.classList.remove('active');
    } else {
        loginForm?.classList.add('hidden');       // Esconde login
        registerForm?.classList.remove('hidden');// Mostra cadastro
        tabLogin?.classList.remove('active');
        tabRegister?.classList.add('active');    // Destaca aba cadastro
    }
}

/**
 * Mostra ou esconde a senha digitada
 */
function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input || !icon) return;

    if (input.type === 'password') {
        input.type = 'text';                    // Revela o texto da senha
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');    // Troca o ícone do olho
    } else {
        input.type = 'password';                // Oculta a senha
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

/**
 * Envia as credenciais de login ou cadastro para o servidor Google
 */
async function handleAuth(e, tipo) {
    e.preventDefault(); // Impede o formulário de recarregar a página
    const msg = document.getElementById('authMessage');

    // Captura os valores digitados nos inputs
    const emailInput = tipo === 'login' ? document.getElementById('loginEmail') : document.getElementById('regEmail');
    const senhaInput = tipo === 'login' ? document.getElementById('loginPassword') : document.getElementById('regPassword');
    const nomeInput = tipo === 'registro' ? document.getElementById('regNome') : null;

    const email = emailInput?.value.trim() || '';
    const senha = senhaInput?.value || '';
    const nome = nomeInput?.value.trim() || '';

    // Valida se os campos estão preenchidos
    if (!email || !senha) {
        if (msg) {
            msg.className = "auth-msg error";
            msg.innerText = "⚠️ Preencha todos os campos obrigatórios.";
        }
        return;
    }

    if (msg) {
        msg.className = "auth-msg info";
        msg.innerText = "⏳ Processando solicitação...";
    }

    // Monta a URL de requisição com parâmetros passados na requisição
    const url = `${SHEET_API_URL}?acao=${encodeURIComponent(tipo)}&email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}&nome=${encodeURIComponent(nome)}&t=${Date.now()}`;

    try {
        // Envia requisição HTTP para a planilha do Google
        const response = await fetch(url);
        const result = await response.text();

        // Se a resposta da planilha começar com "autorizado"
        if (result.startsWith("autorizado")) {
            const partes = result.split("|"); // Quebra a resposta separada por pipes |
            const nomeUser = partes[1] || "Aluno";
            const liberado = partes[2] || "sim";
            const progressoPlanilha = partes[3] || "0";

            localStorage.clear(); // Limpa sessões antigas

            // Salva as informações da sessão no navegador
            localStorage.setItem('usuario_logado', 'true');
            localStorage.setItem('user_name', nomeUser);
            localStorage.setItem('user_email', email);
            localStorage.setItem('permissao_curso', liberado);

            // Calcula quantas aulas o aluno já concluiu baseado na resposta
            const totalAulas = 31;
            let porcentagemFinal = 0;
            const valorNumerico = parseFloat(progressoPlanilha.toString().replace(',', '.'));

            if (!isNaN(valorNumerico)) {
                porcentagemFinal = (valorNumerico > 0 && valorNumerico <= 1) ? valorNumerico * 100 : valorNumerico;
            }

            const qtdConcluida = Math.round((porcentagemFinal / 100) * totalAulas);

            let aulasIds = [];
            for (let i = 1; i <= qtdConcluida; i++) {
                aulasIds.push(`leg_${i}`);
            }

            // Grava a lista de aulas concluídas
            localStorage.setItem('aulas_concluidas', JSON.stringify(aulasIds));

            if (msg) {
                msg.className = "auth-msg success";
                msg.innerText = "✅ Login realizado com sucesso! Redirecionando...";
            }

            // Redireciona o usuário para a página inicial após 0.8 segundos
            setTimeout(() => {
                window.location.replace('index.html');
            }, 800);

        } else if (result.includes("sucesso_registro")) {
            if (msg) {
                msg.className = "auth-msg success";
                msg.innerText = "✅ Conta criada com sucesso! Faça login.";
            }
            switchTab('login'); // Redireciona para a aba de login
        } else {
            if (msg) {
                msg.className = "auth-msg error";
                msg.innerText = "❌ Credenciais inválidas ou não cadastradas.";
            }
        }
    } catch (err) {
        console.error("Erro na autenticação:", err);
        if (msg) {
            msg.className = "auth-msg error";
            msg.innerText = "⚠️ Erro na conexão com o servidor.";
        }
    }
}

// Quando o HTML terminar de carregar, instala os ouvidores de evento nos formulários
document.addEventListener('DOMContentLoaded', () => {
    initThemeLogin();
    document.getElementById('loginForm')?.addEventListener('submit', (e) => handleAuth(e, 'login'));
    document.getElementById('registerForm')?.addEventListener('submit', (e) => handleAuth(e, 'registro'));
});