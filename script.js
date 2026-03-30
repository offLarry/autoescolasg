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

// --- 2. FUNÇÃO TROCA DE FILIAL (MAPA) ---
function alterarMapa(elemento, urlMapa) {
    // 1. Atualiza o iframe do mapa
    const mapa = document.getElementById('mapaInterativo');
    if (mapa) mapa.src = urlMapa;

    // 2. Remove a classe 'active-map' de todos os cards
    document.querySelectorAll('.filial-card-small').forEach(card => {
        card.classList.remove('active-map');
    });

    // 3. Adiciona a classe no card clicado
    elemento.classList.add('active-map');
}

// --- 3. FUNÇÃO UNIFICADA DE INTERFACE ---
function atualizarTudo() {
    const concluidas = JSON.parse(localStorage.getItem('aulas_concluidas')) || [];
    const nome = localStorage.getItem('user_name') || 'Aluno';
    const logado = localStorage.getItem('usuario_logado') === 'true';

    const aulasLeg = concluidas.filter(id => id.startsWith('leg_')).length;
    const porcLeg = Math.min(Math.round((aulasLeg / 4) * 100), 100);

    const aulasDef = concluidas.filter(id => id.startsWith('def_')).length;
    const porcDef = Math.min(Math.round((aulasDef / 3) * 100), 100);

    // Atualiza Nomes e Visibilidade do Dashboard na Home
    const elNome = document.getElementById('displayNome') || document.getElementById('home-nome-aluno');
    if (elNome) elNome.innerText = nome.split(' ')[0];

    const dashboard = document.getElementById('student-dashboard');
    if (dashboard) {
        if (logado) dashboard.classList.remove('student-dashboard-hidden');
        else dashboard.classList.add('student-dashboard-hidden');
    }

    // Atualiza Progresso Módulo 1 (Suporta index e painel)
    const txtM1 = document.getElementById('porcentagemTexto') || document.getElementById('home-porcentagem');
    const barM1 = document.getElementById('barraProgresso') || document.getElementById('home-barra-fill');
    if (txtM1) txtM1.innerText = porcLeg + "%";
    if (barM1) barM1.style.width = porcLeg + "%";

    // Atualiza Módulo 2
    const txtM2 = document.getElementById('porcentagemDef');
    const barM2 = document.getElementById('barraDef');
    if (txtM2) txtM2.innerText = porcDef + "%";
    if (barM2) barM2.style.width = porcDef + "%";

    // Lógica de Bloqueio
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

// --- 4. CARREGAMENTO DINÂMICO DE AULAS ---
function renderizarListaAulas() {
    const container = document.getElementById('listaAulas');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const modulo = urlParams.get('mod');
    const aulasParaExibir = (modulo === 'def') ? CURSO_DIRECAO : CURSO_LEGISLACAO;
    const concluidas = JSON.parse(localStorage.getItem('aulas_concluidas')) || [];

    container.innerHTML = aulasParaExibir.map(aula => {
        const check = concluidas.includes(aula.id);
        return `
            <div class="aula-item ${check ? 'concluida' : ''}" onclick="carregarVideo('${aula.url}', '${aula.id}')">
                <i class="fas ${check ? 'fa-check-circle' : 'fa-play-circle'}"></i>
                <span>${aula.title}</span>
            </div>
        `;
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
});

function logout() { localStorage.clear(); window.location.href = 'index.html'; }
