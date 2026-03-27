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

    if (msg) {
        msg.style.color = "#94a3b8";
        msg.innerText = "Verificando dados...";
    }

    // Adicionamos um timestamp para evitar cache do navegador
    const url = `${SHEET_API_URL}?acao=${tipo}&email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}&nome=${encodeURIComponent(nome)}&t=${new Date().getTime()}`;

    try {
        const response = await fetch(url);
        const result = await response.text();

        if (result.startsWith("autorizado")) {
            const partes = result.split("|");
            const nomeUser = partes[1];
            const liberado = partes[2];
            const progressoPlanilha = partes[3] || "0"; 

            // 1. Limpa o LocalStorage para evitar lixo de sessões anteriores
            localStorage.clear();

            // 2. Salva dados básicos de identificação
            localStorage.setItem('usuario_logado', 'true');
            localStorage.setItem('user_name', nomeUser);
            localStorage.setItem('user_email', email); 
            localStorage.setItem('user_pass', senha);
            localStorage.setItem('permissao_curso', liberado);

            // 3. PROCESSAMENTO DO PROGRESSO (Convertendo decimal da planilha em IDs de aula)
            const totalAulas = 4; // Ajuste para o número total de vídeos do seu curso
            let porcentagemFinal = 0;

            // Tratamento de segurança para números decimais (ex: 0.25 ou 0,25)
            const valorNumerico = parseFloat(progressoPlanilha.toString().replace(',', '.'));
            
            if (!isNaN(valorNumerico)) {
                if (valorNumerico > 0 && valorNumerico <= 1) {
                    // Se for 0.5 vira 50%
                    porcentagemFinal = valorNumerico * 100;
                } else {
                    // Se já for 50 vira 50%
                    porcentagemFinal = valorNumerico;
                }
            }

            // Calcula quantas aulas foram concluídas baseado na porcentagem
            const qtdConcluida = Math.round((porcentagemFinal / 100) * totalAulas);
            
            // Gera a lista de IDs de aulas (leg_1, leg_2...)
            let aulasIds = [];
            for (let i = 1; i <= qtdConcluida; i++) {
                aulasIds.push(`leg_${i}`);
            }
            
            // Salva o progresso restaurado no LocalStorage
            localStorage.setItem('aulas_concluidas', JSON.stringify(aulasIds));

            console.log(`Sucesso! Nome: ${nomeUser} | Progresso: ${porcentagemFinal}% | Aulas: ${aulasIds.length}`);

            // 4. Força atualização visual se os scripts da home estiverem carregados
            if (typeof atualizarProgressoVisual === 'function') {
                atualizarProgressoVisual();
            }

            // 5. Redireciona para a Home
            window.location.replace('index.html');

        } else if (result.includes("sucesso_registro")) {
            if (msg) {
                msg.innerHTML = "<span style='color: #10b981;'>✅ Conta criada! Faça login.</span>";
            }
            switchTab('login');
        } else {
            if (msg) {
                msg.style.color = "#ef4444";
                msg.innerText = "❌ E-mail ou senha incorretos.";
            }
        }
    } catch (err) {
        console.error("Erro no Fetch:", err);
        if (msg) {
            msg.style.color = "#ef4444";
            msg.innerText = "⚠️ Erro de conexão com o servidor.";
        }
    }
}

// Inicialização dos eventos
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm')?.addEventListener('submit', (e) => handleAuth(e, 'login'));
    document.getElementById('registerForm')?.addEventListener('submit', (e) => handleAuth(e, 'registro'));
});