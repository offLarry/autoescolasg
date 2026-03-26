// --- 1. CONFIGURAÇÕES DE DADOS ---
const CURSO_LEGISLACAO = [
    { id: 'leg_1', title: '01. Introdução à Legislação', url: 'https://www.dropbox.com/scl/fi/q670pw9onlsoup0uwu9uh/01-Legisla-o-EDIT.mp4?rlkey=fgkfqvnpv2cbeb8ue2garx9j5&st=9eftivl1&raw=1' },
    { id: 'leg_2', title: '02. Normas de Circulação', url: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' },
    { id: 'leg_3', title: '03. Sinalização Vertical', url: 'https://www.dropbox.com/scl/fi/q670pw9onlsoup0uwu9uh/01-Legisla-o-EDIT.mp4?rlkey=fgkfqvnpv2cbeb8ue2garx9j5&st=9eftivl1&raw=1' },
    { id: 'leg_4', title: '04. Sinalização Horizontal', url: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' }
];

// --- 2. LÓGICA DO SIMULADOR ---
function calcularOrcamento() {
    // Preços atualizados
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
        display.style.fontSize = "2.5rem";
    } else {
        display.innerText = `R$ ${valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        display.style.fontSize = "3.5rem";
    }
}

function finalizarNoWhats() {
    const tipoTxt = document.getElementById('tipoProcesso').options[document.getElementById('tipoProcesso').selectedIndex].text;
    const cat = document.querySelector('input[name="cat"]:checked')?.value || "";
    const valor = document.getElementById('valorTotal').innerText;
    
    const msg = `Olá! Usei o simulador do site e quero saber mais sobre: %0A✅ *${tipoTxt}* %0A🚗 *Categoria ${cat}* %0A💰 *Valor Estimado: ${valor}*`;
    window.open(`https://wa.me/5534998047604?text=${msg}`, '_blank');
}

// --- 3. PROGRESSO E USUÁRIO ---
function atualizarProgressoVisual() {
    const concluidas = JSON.parse(localStorage.getItem('aulas_concluidas')) || [];
    const porcentagem = Math.round((concluidas.length / CURSO_LEGISLACAO.length) * 100);

    const txt = document.getElementById('porcentagemTexto');
    const bar = document.getElementById('barraProgressoFill');
    
    if (txt) txt.innerText = `${porcentagem}%`;
    if (bar) bar.style.width = `${porcentagem}%`;
}

function concluirAulaAtiva() {
    const idAtual = localStorage.getItem('aula_atual_id');
    if (!idAtual) return;

    let concluidas = JSON.parse(localStorage.getItem('aulas_concluidas')) || [];
    if (!concluidas.includes(idAtual)) {
        concluidas.push(idAtual);
        localStorage.setItem('aulas_concluidas', JSON.stringify(concluidas));
        alert("Aula marcada como concluída! ✅");
        location.reload(); 
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// --- 4. INICIALIZAÇÃO ---
window.addEventListener('DOMContentLoaded', () => {
    // Nome do Aluno
    const nomeAluno = localStorage.getItem('user_name') || 'Aluno';
    const elNome = document.getElementById('displayNome');
    if (elNome) elNome.innerText = nomeAluno;

    atualizarProgressoVisual();

    // Eventos do Simulador
    if (document.getElementById('valorTotal')) {
        document.getElementById('tipoProcesso').addEventListener('change', calcularOrcamento);
        document.querySelectorAll('input[name="cat"]').forEach(input => {
            input.addEventListener('change', calcularOrcamento);
        });
        calcularOrcamento(); // Roda ao abrir a página
    }
});

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

// Chame essa função ao carregar a página index.html
document.addEventListener('DOMContentLoaded', () => {
    verificarPermissoes();
});

function verificarAcesso() {
    const estaLogado = localStorage.getItem('usuario_logado');
    const paginaAtual = window.location.pathname;

    // Se NÃO estiver logado e tentar acessar index ou cursos
    if (!estaLogado && (paginaAtual.includes('cursoshome.html') || paginaAtual.includes('cursos.html'))) {
        window.location.replace('login.html');
    }
}

// Executa assim que o script carrega
verificarAcesso();

// Proteção de Rota
(function verificarAcessoGeral() {
    const logado = localStorage.getItem('usuario_logado');
    const permissao = localStorage.getItem('permissao_curso');
    const paginaAtual = window.location.pathname;

    // Se não estiver logado, vai para o login
    if (!logado && !paginaAtual.includes('login.html') && !paginaAtual.includes('cursoshome.html')) {
        window.location.replace('index.html');
    }

    // Se tentar entrar em cursos.html sem permissão "SIM"
    if (paginaAtual.includes('cursos.html') && permissao !== "SIM") {
        alert("Acesso negado. Este curso não está liberado para você.");
        window.location.replace('index.html');
    }
})();
