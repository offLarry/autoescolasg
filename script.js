// --- 1. CONFIGURAÇÕES E DADOS ---
const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzVtKRAkHOo_n8MT1rbi0RFUbQqOhmHZdvIlYBrEA943lPdQ-z2W_MzzYqMMfqcCadG/exec';

const CURSO_LEGISLACAO = [
    { id: 'leg_1', title: '01. Introdução à Legislação', url: 'https://www.dropbox.com/scl/fi/q670pw9onlsoup0uwu9uh/01-Legisla-o-EDIT.mp4?rlkey=fgkfqvnpv2cbeb8ue2garx9j5&st=9eftivl1&raw=1' },
    { id: 'leg_2', title: '02. Legislação', url: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' },
    { id: 'leg_3', title: '03. Legislação', url: 'https://www.dropbox.com/scl/fi/q670pw9onlsoup0uwu9uh/01-Legisla-o-EDIT.mp4?rlkey=fgkfqvnpv2cbeb8ue2garx9j5&st=9eftivl1&raw=1' },
    { id: 'leg_4', title: '04. Legislação', url: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' },

    { id: 'leg_5', title: '05. Introdução à Sinalização', url: 'https://www.dropbox.com/scl/fi/k3w63lrirvstkoi0abfav/05-SINALIZA-O.mp4?rlkey=9yrqojpomtc7ti2wied7sk1wx&st=l7zgv1l9&raw=1' },
    { id: 'leg_6', title: '06. Sinalização', url: 'https://www.dropbox.com/scl/fi/h5k0i6p3qld5s3mlpkq1s/06-SINALIZA-O.mp4?rlkey=tykepxntrqpxjtletnbwr68ra&st=x9g2nly6&raw=1' },
    { id: 'leg_7', title: '07 Sinalização', url: 'https://www.dropbox.com/scl/fi/wdcw32037vhnd4no2koso/07-SINALIZA-O.mp4?rlkey=d3hvj93zwoq400lz2h7eqo7yx&st=t08ph9e1&raw=1' },
    { id: 'leg_8', title: '08. Sinalização', url: 'https://www.dropbox.com/scl/fi/05cs21an3v96znuyxt1s1/08-SINALIZA-O.mp4?rlkey=jeqagbfl1uu38n0kqy160x8ss&st=nurxqroc&raw=1' },

    { id: 'leg_9', title:  '09. Infrações e Penalidades', url: 'https://www.dropbox.com/scl/fi/va827yqp7a36oj1qvp7hk/09-INFRA-ES.mp4?rlkey=f2m041w9zar4lh04f040f0cvx&st=b2gw1fwn&raw=1' },
    { id: 'leg_10', title: '10. Infrações e Penalidades', url: 'https://www.dropbox.com/scl/fi/1i96iu1gzdjb2rrw2jq9p/10-INFRA-ES.mp4?rlkey=7xnldn35yxsjgpoqq9i20vsee&st=a6hard5y&raw=1' },
    { id: 'leg_11', title: '11. Infrações e Penalidades', url: 'https://www.dropbox.com/scl/fi/dfxtfkagy7ekv04vq4y1s/11-INFRA-ES.mp4?rlkey=a9dtcfrkdq2vfje6fyveqf9qj&st=nvmn2agw&raw=1' },
    { id: 'leg_12', title: '12. Infrações e Penalidades', url: 'https://www.dropbox.com/scl/fi/eyqbltxxfgvomy0t34y7w/12-INFRA-ES.mp4?rlkey=pzr1uhx3aow2t84rxzie6rxby&st=tr535ria&raw=1' },

    { id: 'leg_13', title: '13. Introdução à Legislação', url: 'https://www.dropbox.com/scl/fi/q670pw9onlsoup0uwu9uh/01-Legisla-o-EDIT.mp4?rlkey=fgkfqvnpv2cbeb8ue2garx9j5&st=9eftivl1&raw=1' },
    { id: 'leg_14', title: '14. Normas de Circulação', url: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' },
    { id: 'leg_15', title: '15. Sinalização Vertical', url: 'https://www.dropbox.com/scl/fi/q670pw9onlsoup0uwu9uh/01-Legisla-o-EDIT.mp4?rlkey=fgkfqvnpv2cbeb8ue2garx9j5&st=9eftivl1&raw=1' },
    { id: 'leg_16', title: '16. Sinalização Horizontal', url: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' },

    { id: 'leg_17', title: '17. Introdução à Legislação', url: 'https://www.dropbox.com/scl/fi/q670pw9onlsoup0uwu9uh/01-Legisla-o-EDIT.mp4?rlkey=fgkfqvnpv2cbeb8ue2garx9j5&st=9eftivl1&raw=1' },
    { id: 'leg_18', title: '18. Normas de Circulação', url: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' },
    { id: 'leg_19', title: '19. Sinalização Vertical', url: 'https://www.dropbox.com/scl/fi/q670pw9onlsoup0uwu9uh/01-Legisla-o-EDIT.mp4?rlkey=fgkfqvnpv2cbeb8ue2garx9j5&st=9eftivl1&raw=1' },
    { id: 'leg_20', title: '20. Sinalização Horizontal', url: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' },

    { id: 'leg_21', title: '21. Introdução à Legislação', url: 'https://www.dropbox.com/scl/fi/q670pw9onlsoup0uwu9uh/01-Legisla-o-EDIT.mp4?rlkey=fgkfqvnpv2cbeb8ue2garx9j5&st=9eftivl1&raw=1' },
    { id: 'leg_22', title: '22. Normas de Circulação', url: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' },
    { id: 'leg_23', title: '23. Sinalização Vertical', url: 'https://www.dropbox.com/scl/fi/q670pw9onlsoup0uwu9uh/01-Legisla-o-EDIT.mp4?rlkey=fgkfqvnpv2cbeb8ue2garx9j5&st=9eftivl1&raw=1' },
    { id: 'leg_24', title: '24. Sinalização Horizontal', url: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' },

    { id: 'leg_25', title: '25. Introdução à Legislação', url: 'https://www.dropbox.com/scl/fi/q670pw9onlsoup0uwu9uh/01-Legisla-o-EDIT.mp4?rlkey=fgkfqvnpv2cbeb8ue2garx9j5&st=9eftivl1&raw=1' },
    { id: 'leg_26', title: '26. Normas de Circulação', url: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' },
    { id: 'leg_27', title: '27. Sinalização Vertical', url: 'https://www.dropbox.com/scl/fi/q670pw9onlsoup0uwu9uh/01-Legisla-o-EDIT.mp4?rlkey=fgkfqvnpv2cbeb8ue2garx9j5&st=9eftivl1&raw=1' },
    { id: 'leg_28', title: '28. Sinalização Horizontal', url: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' },


    { id: 'leg_29', title: '29. Introdução à Legislação', url: 'https://www.dropbox.com/scl/fi/q670pw9onlsoup0uwu9uh/01-Legisla-o-EDIT.mp4?rlkey=fgkfqvnpv2cbeb8ue2garx9j5&st=9eftivl1&raw=1' },
    { id: 'leg_30', title: '30. Normas de Circulação', url: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' },
    { id: 'leg_31', title: '31. Sinalização Vertical', url: 'https://www.dropbox.com/scl/fi/q670pw9onlsoup0uwu9uh/01-Legisla-o-EDIT.mp4?rlkey=fgkfqvnpv2cbeb8ue2garx9j5&st=9eftivl1&raw=1' },
    { id: 'leg_32', title: '32. Sinalização Horizontal', url: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' },
];

const CURSO_DIRECAO = [
    { id: 'def_1', title: '01. Conceitos de Direção Defensiva', url: 'URL_DO_VIDEO_DEF_1' },
    { id: 'def_2', title: '02. Elementos da Direção Defensiva', url: 'URL_DO_VIDEO_DEF_2' },
    { id: 'def_3', title: '03. Condições Adversas', url: 'URL_DO_VIDEO_DEF_3' },
];

// --- 2. LÓGICA DO SIMULADOR DE ORÇAMENTO (INDEX) ---
const PRECOS = {
    primeira: { A: 1200, B: 1500, AB: 2200, D: 1875 },
    adicao: { A: 900, B: 1100},
    mudanca: {D: 1875 }
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
    const msg = encodeURIComponent(`Olá! Fiz uma simulação no site:\nProcesso: ${tipo}\nCategoria: ${categoria}\nValor Estimado: ${valor}`);
    window.open(`https://wa.me/553436712274?text=${msg}`, '_blank');
}

// --- 3. LÓGICA DO MAPA (FILIAIS) ---
function alterarMapa(elemento, urlMapa) {
    const mapa = document.getElementById('mapaInterativo');
    if (mapa) mapa.src = urlMapa;
    document.querySelectorAll('.filial-card-small').forEach(card => card.classList.remove('active-map'));
    elemento.classList.add('active-map');
}

// --- 4. INTERFACE E PROGRESSO (CORRIGIDO) ---

function atualizarProgressoGeral() {
    // Agora focado apenas no curso de Legislação para bater com o card da CursosHome
    const totalAulas = CURSO_LEGISLACAO.length;
    const concluidas = JSON.parse(localStorage.getItem('aulas_concluidas')) || [];
    const concluidasLeg = concluidas.filter(id => id.startsWith('leg_')).length;
    
    const porcentagem = totalAulas > 0 ? Math.round((concluidasLeg / totalAulas) * 100) : 0;
    
    const barra = document.getElementById('barra-progresso-total');
    const texto = document.getElementById('texto-progresso-total');
    
    if (barra) barra.style.width = porcentagem + "%";
    if (texto) texto.innerText = porcentagem + "%";
}

function atualizarTudo() {
    const concluidas = JSON.parse(localStorage.getItem('aulas_concluidas')) || [];
    const nome = localStorage.getItem('user_name') || 'Aluno';
    const logado = localStorage.getItem('usuario_logado') === 'true';

    // Cálculos Dinâmicos baseados no .length (Sem números fixos)
    const aulasLeg = concluidas.filter(id => id.startsWith('leg_')).length;
    const porcLeg = CURSO_LEGISLACAO.length > 0 ? Math.min(Math.round((aulasLeg / CURSO_LEGISLACAO.length) * 100), 100) : 0;
    
    const aulasDef = concluidas.filter(id => id.startsWith('def_')).length;
    const porcDef = CURSO_DIRECAO.length > 0 ? Math.min(Math.round((aulasDef / CURSO_DIRECAO.length) * 100), 100) : 0;

    const elNome = document.getElementById('displayNome') || document.getElementById('home-nome-aluno');
    if (elNome) elNome.innerText = nome.split(' ')[0];

    const dashboard = document.getElementById('student-dashboard');
    if (dashboard) dashboard.classList.toggle('student-dashboard-hidden', !logado);

    // Módulo 1 (Legislação) - Sincronizado com a Index e CursosHome
    const txtM1 = document.getElementById('porcentagemTexto') || document.getElementById('home-porcentagem');
    const barM1 = document.getElementById('barraProgresso') || document.getElementById('home-barra-fill');
    if (txtM1) txtM1.innerText = porcLeg + "%";
    if (barM1) barM1.style.width = porcLeg + "%";

    // Módulo 2 (Direção)
    const txtM2 = document.getElementById('porcentagemDef');
    const barM2 = document.getElementById('barraDef');
    if (txtM2) txtM2.innerText = porcDef + "%";
    if (barM2) barM2.style.width = porcDef + "%";

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

function ajustarCategoriasDisponiveis() {
    const tipo = document.getElementById('tipoProcesso').value;
    
    // Seletores dos wrappers (as labels)
    const cardA = document.getElementById('cat-A-wrapper');
    const cardB = document.getElementById('cat-B-wrapper');
    const cardAB = document.getElementById('cat-AB-wrapper');
    const cardD = document.getElementById('cat-D-wrapper');

    // Reseta todos para visível primeiro
    [cardA, cardB, cardAB, cardD].forEach(el => el.style.display = "block");

    if (tipo === 'adicao') {
        // Na adição, geralmente não se adiciona "AB" de uma vez ou "D" (que é mudança)
        cardAB.style.display = "none";
        cardD.style.display = "none";
        
        // Garante que uma opção válida esteja marcada
        document.querySelector('input[value="A"]').checked = true;
    } 
    else if (tipo === 'mudanca') {
        // Mudança geralmente é para categoria profissional (D)
        cardA.style.display = "none";
        cardB.style.display = "none";
        cardAB.style.display = "none";
        
        document.querySelector('input[value="D"]').checked = true;
    }
    
    // Atualiza o preço após esconder as opções
    atualizarOrcamento();
}

// --- 5. INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    atualizarTudo();
    renderizarListaAulas();
    atualizarProgressoGeral();
    document.getElementById('tipoProcesso').addEventListener('change', ajustarCategoriasDisponiveis);
    // Listeners do Simulador
    document.getElementById('tipoProcesso')?.addEventListener('change', atualizarOrcamento);
    document.querySelectorAll('input[name="cat"]').forEach(input => {
        input.addEventListener('change', atualizarOrcamento);
    });
    atualizarOrcamento(); 
});

document.addEventListener('DOMContentLoaded', () => {
    const permissao = localStorage.getItem('permissao_curso');
    const areaLiberada = document.getElementById('cursoLiberado');
    const areaBloqueada = document.getElementById('cursoBloqueado');
    const statusBadge = document.getElementById('status-badge');
    const textoProgresso = document.getElementById('texto-progresso-total');

    if (permissao === "SIM") {
        areaLiberada.classList.remove('hidden');
        areaBloqueada.classList.add('hidden');

        // LÓGICA DE TROCA DE TEXTO
        // Esperamos um pequeno tempo para o script.js calcular o valor
        setTimeout(() => {
            const porcentagem = parseInt(textoProgresso.innerText);
            
            if (porcentagem >= 100) {
                statusBadge.innerText = "Completo";
                statusBadge.style.background = "var(--success)"; // Opcional: mudar cor para verde
            } else {
                statusBadge.innerText = "Em Progresso";
                statusBadge.style.background = "var(--primary)"; // Cor padrão
            }
        }, 100);

    } else {
        areaLiberada.classList.add('hidden');
        areaBloqueada.classList.remove('hidden');
    }
});
function logout() { localStorage.clear(); window.location.href = 'index.html'; }
