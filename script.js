// --- 1. CONFIGURAÇÕES E DADOS ---
const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzVtKRAkHOo_n8MT1rbi0RFUbQqOhmHZdvIlYBrEA943lPdQ-z2W_MzzYqMMfqcCadG/exec';

const CURSO_LEGISLACAO = [
    { id: 'leg_1', title: '01. Introdução à Legislação', url: 'https://www.dropbox.com/scl/fi/q670pw9onlsoup0uwu9uh/01-Legisla-o-EDIT.mp4?rlkey=fgkfqvnpv2cbeb8ue2garx9j5&st=9eftivl1&raw=1' },
    { id: 'leg_2', title: '02. Normas de Circulação', url: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' },
    { id: 'leg_3', title: '03. Sinalização Vertical', url: 'https://www.dropbox.com/scl/fi/q670pw9onlsoup0uwu9uh/01-Legisla-o-EDIT.mp4?rlkey=fgkfqvnpv2cbeb8ue2garx9j5&st=9eftivl1&raw=1' },
    { id: 'leg_4', title: '04. Sinalização Horizontal', url: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' }
];

const CURSO_DIRECAO = [
    { id: 'def_1', title: '01. Conceitos de Direção Defensiva', url: 'LINK_VIDEO_DEF_1' },
    { id: 'def_2', title: '02. Elementos da Direção Defensiva', url: 'LINK_VIDEO_DEF_2' },
    { id: 'def_3', title: '03. Condições Adversas', url: 'LINK_VIDEO_DEF_3' },
];

// --- 2. LÓGICA DO SIMULADOR DE ORÇAMENTO (INDEX) ---
const PRECOS = {
    primeira: { A: 1200, B: 1500, AB: 2200, D: 0 },
    adicao: { A: 900, B: 1100, AB: 0, D: 0 },
    mudanca: { A: 0, B: 0, AB: 0, D: 1800 }
};

function atualizarOrcamento() {
    const tipo = document.getElementById('tipoProcesso')?.value;
    const categoria = document.querySelector('input[name="cat"]:checked')?.value;
    const display = document.getElementById('valorTotal');

    if (tipo && categoria && display) {
        const valor = PRECOS[tipo][categoria] || 0;
        display.innerText = valor > 0 ? `R$ ${valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : "Sob Consulta";
    }
}

function finalizarNoWhats() {
    const tipo = document.getElementById('tipoProcesso').value;
    const categoria = document.querySelector('input[name="cat"]:checked').value;
    const valor = document.getElementById('valorTotal').innerText;
    const msg = encodeURIComponent(`Olá! Fiz uma simulação no site:\nProcesso: ${tipo}\nCategoria: ${categoria}\nValor Estimado: ${valor}\nGostaria de mais informações.`);
    window.open(`https://wa.me/5534998047604?text=${msg}`, '_blank');
}

// --- 3. LÓGICA DO MAPA (FILIAIS) ---
function alterarMapa(elemento, urlMapa) {
    const mapa = document.getElementById('mapaInterativo');
    if (mapa) mapa.src = urlMapa;
    document.querySelectorAll('.filial-card-small').forEach(card => card.classList.remove('active-map'));
    elemento.classList.add('active-map');
}

// --- 4. INTERFACE E PROGRESSO (AULAS) ---
function atualizarTudo() {
   function atualizarTudo() {
    const concluidas = JSON.parse(localStorage.getItem('aulas_concluidas')) || [];
    const nome = localStorage.getItem('user_name') || 'Aluno';
    
    // 1. Defina o total de aulas de TODOS os módulos somados
    // Exemplo: 4 de Legislação + 3 de Direção = 7 aulas no total
    const totalAulasDoCurso = CURSO_LEGISLACAO.length + CURSO_DIRECAO.length;
    
    // 2. Conte quantas aulas o aluno concluiu no total
    const totalConcluidas = concluidas.length;
    
    // 3. Calcule a porcentagem geral
    const porcGeral = totalAulasDoCurso > 0 
        ? Math.min(Math.round((totalConcluidas / totalAulasDoCurso) * 100), 100) 
        : 0;

    // --- ATUALIZAÇÃO NA TELA ---

    // Atualiza o texto e a barra da HOMEPAGE (Geral)
    const txtGeral = document.getElementById('home-porcentagem'); 
    const barGeral = document.getElementById('home-barra-fill');
    
    if (txtGeral) txtGeral.innerText = porcGeral + "%";
    if (barGeral) barGeral.style.width = porcGeral + "%";

    // Mantém as atualizações individuais dos cards se você ainda quiser mostrá-las
    const aulasLeg = concluidas.filter(id => id.startsWith('leg_')).length;
    const porcLeg = Math.round((aulasLeg / CURSO_LEGISLACAO.length) * 100);
    
    const txtM1 = document.getElementById('porcentagemTexto');
    const barM1 = document.getElementById('barraProgresso');
    if (txtM1) txtM1.innerText = porcLeg + "%";
    if (barM1) barM1.style.width = porcLeg + "%";
       
    const btnM2 = document.getElementById('btn-modulo-2');
    const cardM2 = document.getElementById('modulo-2');
    if (cardM2 && btnM2) {
        if (porcLeg >= 100) {
            cardM2.classList.remove('opacity-50');
            cardM2.style.pointerEvents = "auto";
            btnM2.innerHTML = "Acessar Módulo";
        } else {
            cardM2.classList.add('opacity-50');
            cardM2.style.pointerEvents = "none";
            btnM2.innerHTML = '<i class="fas fa-lock"></i> Bloqueado';
        }
    }
}

function renderizarListaAulas() {
    const container = document.getElementById('listaAulas');
    if (!container) return;
    const urlParams = new URLSearchParams(window.location.search);
    const modulo = urlParams.get('mod');
    const aulasParaExibir = (modulo === 'def') ? CURSO_DIRECAO : CURSO_LEGISLACAO;
    const concluidas = JSON.parse(localStorage.getItem('aulas_concluidas')) || [];

    container.innerHTML = aulasParaExibir.map(aula => {
        const check = concluidas.includes(aula.id);
        return `<div class="aula-item ${check ? 'concluida' : ''}" onclick="carregarVideo('${aula.url}', '${aula.id}')">
            <i class="fas ${check ? 'fa-check-circle' : 'fa-play-circle'}"></i>
            <span>${aula.title}</span>
        </div>`;
    }).join('');
}

function carregarVideo(url, id) {
    const iframe = document.getElementById('videoPrincipal');
    if (iframe) iframe.src = url;
    localStorage.setItem('aula_atual_id', id);
}

// --- 5. INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    atualizarTudo();
    renderizarListaAulas();
    
    // Listeners para o Simulador
    document.getElementById('tipoProcesso')?.addEventListener('change', atualizarOrcamento);
    document.querySelectorAll('input[name="cat"]').forEach(input => {
        input.addEventListener('change', atualizarOrcamento);
    });
    atualizarOrcamento(); // Inicia com valor
});

function logout() { localStorage.clear(); window.location.href = 'index.html'; }
