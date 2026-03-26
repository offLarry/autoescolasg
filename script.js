// --- 1. CONFIGURAÇÕES E DADOS ---
const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzVtKRAkHOo_n8MT1rbi0RFUbQqOhmHZdvIlYBrEA943lPdQ-z2W_MzzYqMMfqcCadG/exec';

const CURSO_LEGISLACAO = [
    { id: 'leg_1', title: '01. Introdução à Legislação', url: 'https://www.dropbox.com/scl/fi/q670pw9onlsoup0uwu9uh/01-Legisla-o-EDIT.mp4?rlkey=fgkfqvnpv2cbeb8ue2garx9j5&st=9eftivl1&raw=1' },
    { id: 'leg_2', title: '02. Normas de Circulação', url: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' },
    { id: 'leg_3', title: '03. Sinalização Vertical', url: 'https://www.dropbox.com/scl/fi/q670pw9onlsoup0uwu9uh/01-Legisla-o-EDIT.mp4?rlkey=fgkfqvnpv2cbeb8ue2garx9j5&st=9eftivl1&raw=1' },
    { id: 'leg_4', title: '04. Sinalização Horizontal', url: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' }
];

// --- 2. SEGURANÇA E REDIRECIONAMENTO ---
(function verificarAcessoGeral() {
    const logado = localStorage.getItem('usuario_logado');
    const permissao = localStorage.getItem('permissao_curso');
    const paginaAtual = window.location.pathname.split("/").pop();
    const paginasPublicas = ['index.html', '', 'homepage.html']; 

    if (!logado && !paginasPublicas.includes(paginaAtual)) {
        window.location.replace('index.html');
        return;
    }

    if (paginaAtual === 'cursos.html' && permissao !== "SIM") {
        alert("Acesso negado. Este curso ainda não foi liberado para você.");
        window.location.replace('index.html');
    }
})();

// --- 3. FUNCIONALIDADES DE PROGRESSO (DATABASE) ---

async function sincronizarComNuvem() {
    const email = localStorage.getItem('user_email');
    const concluidas = JSON.parse(localStorage.getItem('aulas_concluidas')) || [];
    const porcentagem = Math.round((concluidas.length / CURSO_LEGISLACAO.length) * 100) + "%";

    if (!email) return false;

    const url = `${SHEET_API_URL}?acao=atualizarProgresso&email=${encodeURIComponent(email)}&progresso=${encodeURIComponent(porcentagem)}&t=${new Date().getTime()}`;

    try {
        const response = await fetch(url);
        const texto = await response.text();
        console.log("Sincronização:", texto);
        return texto.includes("progresso_salvo");
    } catch (error) {
        console.error("Erro ao sincronizar:", error);
        return false;
    }
}

async function concluirAulaAtiva(e) {
    if (e) e.preventDefault();
    
    const idAtual = localStorage.getItem('aula_atual_id');
    if (!idAtual) {
        alert("Selecione uma aula primeiro!");
        return;
    }

    let concluidas = JSON.parse(localStorage.getItem('aulas_concluidas')) || [];
    
    if (!concluidas.includes(idAtual)) {
        concluidas.push(idAtual);
        localStorage.setItem('aulas_concluidas', JSON.stringify(concluidas));
        
        atualizarProgressoVisual();
        
        // Exibe feedback visual de carregamento se desejar
        console.log("Enviando progresso...");
        
        const salvo = await sincronizarComNuvem();
        
        if (salvo) {
            alert("Aula concluída e salva na nuvem! ✅");
        } else {
            alert("Aula marcada localmente, mas houve erro na sincronização.");
        }
        location.reload(); 
    } else {
        alert("Esta aula já foi concluída anteriormente.");
    }
}

function atualizarProgressoVisual() {
    const concluidas = JSON.parse(localStorage.getItem('aulas_concluidas')) || [];
    const porcentagem = Math.round((concluidas.length / CURSO_LEGISLACAO.length) * 100);

    const txt = document.getElementById('porcentagemTexto');
    const bar = document.getElementById('barraProgressoFill');
    
    if (txt) txt.innerText = `${porcentagem}%`;
    if (bar) bar.style.width = `${porcentagem}%`;
}

// --- 4. CHECAGEM EM TEMPO REAL (ADMIN) ---

async function verificarLiberacaoEmTempoReal() {
    const email = localStorage.getItem('user_email');
    const senha = localStorage.getItem('user_pass');
    const statusAtual = localStorage.getItem('permissao_curso');

    // Só verifica se estiver logado e ainda não tiver acesso
    if (localStorage.getItem('usuario_logado') === 'true' && statusAtual !== 'SIM' && email) {
        const url = `${SHEET_API_URL}?acao=login&email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}&t=${new Date().getTime()}`;
        
        try {
            const response = await fetch(url);
            const result = await response.text();
            
            if (result.startsWith("autorizado")) {
                const partes = result.split("|");
                const novaPermissao = partes[2];

                if (novaPermissao === "SIM") {
                    localStorage.setItem('permissao_curso', 'SIM');
                    alert("🎉 Seu acesso ao curso foi liberado agora mesmo!");
                    verificarPermissoes(); // Atualiza os cards sem refresh
                }
            }
        } catch (e) {
            console.warn("Erro silencioso na checagem em tempo real.");
        }
    }
}

// Verifica a cada 30 segundos
setInterval(verificarLiberacaoEmTempoReal, 30000);

// --- 5. INTERFACE E CONTROLE ---

function verificarPermissoes() {
    const permissao = localStorage.getItem('permissao_curso');
    const cardCurso = document.getElementById('cardCursoLegislacao');
    const cardNegado = document.getElementById('cardAcessoNegado');

    if (permissao === "SIM") {
        cardCurso?.classList.remove('hidden');
        cardNegado?.classList.add('hidden');
    } else {
        cardCurso?.classList.add('hidden');
        cardNegado?.classList.remove('hidden');
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// --- 6. SIMULADOR DE ORÇAMENTO ---

function calcularOrcamento() {
    const tabela = {
        primeira: { A: 1550, B: 2100, AB: 3250, D: 0 },
        adicao:   { A: 1100, B: 1550, AB: 2400, D: 1750 },
        mudanca:  { A: 0,    B: 0,    AB: 0,    D: 1850 }
    };

    const selectProcesso = document.getElementById('tipoProcesso');
    if (!selectProcesso) return;

    const tipo = selectProcesso.value;
    const radioSelecionado = document.querySelector('input[name="cat"]:checked');
    const display = document.getElementById('valorTotal');
    
    if (!display || !radioSelecionado) return;

    const cat = radioSelecionado.value;
    const valor = tabela[tipo][cat] || 0;
    
    if (valor === 0) {
        display.innerText = "Consulte-nos";
    } else {
        display.innerText = `R$ ${valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    }
}

function finalizarNoWhats() {
    const tipoTxt = document.getElementById('tipoProcesso').options[document.getElementById('tipoProcesso').selectedIndex].text;
    const cat = document.querySelector('input[name="cat"]:checked')?.value || "";
    const valor = document.getElementById('valorTotal').innerText;
    
    const msg = `Olá! Usei o simulador do site e quero saber mais sobre: %0A✅ *${tipoTxt}* %0A🚗 *Categoria ${cat}* %0A💰 *Valor Estimado: ${valor}*`;
    window.open(`https://wa.me/5534998047604?text=${msg}`, '_blank');
}

// --- 7. INICIALIZAÇÃO ---

window.addEventListener('DOMContentLoaded', () => {
    // Exibir nome do usuário
    const elNome = document.getElementById('displayNome');
    if (elNome) elNome.innerText = localStorage.getItem('user_name') || 'Aluno';

    // Atualizar UI de progresso e permissões
    atualizarProgressoVisual();
    verificarPermissoes();

    // Configurar Simulador se estiver na página
    if (document.getElementById('valorTotal')) {
        document.getElementById('tipoProcesso').addEventListener('change', calcularOrcamento);
        document.querySelectorAll('input[name="cat"]').forEach(input => {
            input.addEventListener('change', calcularOrcamento);
        });
        calcularOrcamento();
    }
});
