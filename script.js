/* ==========================================================================
   AUTOESCOLA SÃO GOTARDO - SCRIPT PRINCIPAL
   ========================================================================== */

const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbz26Dssa2Oh6hEo8dnEXXywmIl6EBbCb9Qv3UVRfr_If8oRA3PjNcf1CYAIgToxqNwy/exec';


// MATRIZ/ARRAY DE OBJETOS COM A GRADE DE VÍDEOS DE LEGISLAÇÃO
window.CURSO_LEGISLACAO = [];

async function carregarVideosDoBackend() {
    try {
        const response = await fetch(`${SHEET_API_URL}?acao=getVideos`);
        if (!response.ok) throw new Error('Falha na resposta da rede');
        const dados = await response.json();
        
        if (Array.isArray(dados)) {
            window.CURSO_LEGISLACAO = dados;
        }
    } catch (erro) {
        console.error("Erro ao carregar a lista de vídeos:", erro);
    }
}

// LISTA DE INSTRUTORES DA AUTOESCOLA
const INSTRUTORES = [
    { nome: "Instrutor Clesio", categoria: "Cat. A", descricao: "Aulas práticas para categoria A.", contato: "5534998432264" },
    { nome: "Instrutora Zelia", categoria: "Cat. B", descricao: "Aulas práticas para categoria B.", contato: "5534999586373" },
    { nome: "Instrutor Josiel", categoria: "Cat. B e D", descricao: "Aulas práticas para categoria B e D.", contato: "5534999448953" },
    { nome: "Instrutor Tony", categoria: "Cat. B", descricao: "Aulas práticas para categoria B.", contato: "5534997063579" },
    { nome: "Instrutor Geraldo", categoria: "Cat. B", descricao: "Aulas práticas para categoria B em Guarda dos Ferreiros.", contato: "5534988446439" },
    { nome: "Instrutor Paulinho", categoria: "Cat. B", descricao: "Aulas práticas para categoria B em Matutina/Tiros.", contato: "5534988091910" }

];

// UNIDADES/FILIAIS COM LINK DE MAPA
const FILIAIS = [
    { nome: "Matriz São Gotardo", endereco: "Praça Sao Geraldo, 01 - São Geraldo", fone: "(34) 3671-2274", mapUrl: "https://www.google.com/maps/embed?pb=!4v1791460729607!6m8!1m7!1sBEc9bw6FzN6EJq6fOko5dg!2m2!1d-19.314141647572!2d-46.04337342164749!3f295.0320322433566!4f-1.7416844721607845!5f0.7820865974627469" },
    { nome: "Filial Guarda dos Ferreiros", endereco: "Av. Hermenegildo José, 900 - Guarda dos Ferreiros", fone: "(34) 3671-6784", mapUrl: "https://www.google.com/maps/embed?pb=!4v1791399749044!6m8!1m7!1sIH4ZjxsUHVXmAA5Ii-IV2Q!2m2!1d-19.3716344883223!2d-46.13171576097766!3f331.051714928214!4f-1.5223808425475767!5f1.9585681834944655" },
    { nome: "Filial Tiros", endereco: "Rua Padre José Coelho, 948 - Tiros", fone: "(34) 3671-2274", mapUrl: "https://www.google.com/maps/embed?pb=!4v1791460993387!6m8!1m7!1sAbfAJSiWOuxM1Y3nPXrO7g!2m2!1d-19.00657879864913!2d-45.95985482029513!3f23.765212941384476!4f-4.04960012376192!5f1.0408644781871645" },   
];


// PREÇOS BASE DOS SERVIÇOS
const PRECOS_BASE = {
    'A': 811.86,
    'B': 811.86,
    'AB': 927.66,
    'ADC_A': 550.68,
    'ADC_B': 811.86,
    'REAB': 615.80    // Reciclagem 
};

// VALORES DAS AULAS PRÁTICAS
const VALORES_AULAS_EXTRAS = {
    'A': {
        '2': 380.00,  
        '5': 600.00,  
        '10': 900.00,   
        '20': 1600.00   
    },
    'B': {
        '2': 390.00,   
        '5': 650.00,  
        '10': 950.00,   
        '20': 1700.00  
    },
    'AB': {
        '2': 770.00,   
        '5': 1250.00,  
        '10': 1850.00,   
        '20': 3300.00,   
    },
    'REAB': {
        '2': 0.0,
        '5': 0.0,
        '10': 0.0,
        '20': 0.0
    }
};

/**
 * Função de Segurança (Sanitização)
 */
function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"']/g, function(match) {
        const masks = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
        return masks[match];
    });
}


function calcularOrcamento() {
    const selectProc = document.getElementById('tipoProcesso');
    const selectAula = document.getElementById('selectNomeAula');
    
    if (!selectProc) return 0;
    
    const tipo = selectProc.value; // Exemplo: 'A', 'B', 'AB'
    const codAula = selectAula ? selectAula.value : '0';

    const valorBase = PRECOS_BASE[tipo] || 0.00;

    const tabelaAulasCategoria = VALORES_AULAS_EXTRAS[tipo] || VALORES_AULAS_EXTRAS['B'];

    const valorAdicional = tabelaAulasCategoria[codAula] || 0.00;
    
    const total = valorBase + valorAdicional;

    const display = document.getElementById('valorTotal');
    if (display) {
        display.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return total;
}

/**
 * Atualiza a legenda sobre qual pacote de aula foi escolhido
 */
function atualizarDetalheAula() {
    const selectAula = document.getElementById('selectNomeAula');
    const txtInfo = document.getElementById('txtInfoAula');
    
    if (selectAula && txtInfo) {
        const nomeAula = selectAula.options[selectAula.selectedIndex].text;
        txtInfo.textContent = `Selecionado: ${nomeAula}`;
    }
    calcularOrcamento();
}

/**
 * Monta a mensagem formatada e redireciona para o WhatsApp da Autoescola
 */
function finalizarNoWhats() {
    const selectProc = document.getElementById('tipoProcesso');
    const selectAula = document.getElementById('selectNomeAula');
    const nome = escapeHTML(document.getElementById('nomeCliente')?.value || 'Aluno');
    
    const servicoTexto = selectProc ? selectProc.options[selectProc.selectedIndex].text : '';
    const aulaTexto = selectAula ? selectAula.options[selectAula.selectedIndex].text : '';
    const valor = document.getElementById('valorTotal')?.innerText || '';

    const texto = `Olá! Meu nome é ${nome}. Fiz uma simulação no site da Autoescola São Gotardo:%0A%0A` +
                  `*Serviço:* ${encodeURIComponent(servicoTexto)}%0A` +
                  `*Aulas:* ${encodeURIComponent(aulaTexto)}%0A` +
                  `*Valor Estimado:* ${encodeURIComponent(valor)}%0A%0A` +
                  `Gostaria de mais informações para dar início ao processo!`;

    const fone = "553436712274";
    window.open(`https://wa.me/${fone}?text=${texto}`, '_blank');
}


function salvarOrcamento() {
    const nomeInput = document.getElementById('nomeCliente');
    const nome = escapeHTML(nomeInput?.value.trim() || '');
    const selectProc = document.getElementById('tipoProcesso');
    const selectAula = document.getElementById('selectNomeAula');
    
    const servicoTexto = selectProc ? selectProc.options[selectProc.selectedIndex].text : '';
    const aulaTexto = selectAula ? selectAula.options[selectAula.selectedIndex].text : '';
    const valor = calcularOrcamento();

    if (!nome) {
        alert('Por favor, informe seu nome para salvar o orçamento.');
        nomeInput?.focus();
        return;
    }

    const orcamentoObj = {
        cliente: nome,
        servico: servicoTexto,
        aula: aulaTexto,
        valorTotal: valor,
        data: new Date().toLocaleDateString('pt-BR')
    };

    localStorage.setItem('ultimo_orcamento', JSON.stringify(orcamentoObj));
    alert('✅ Orçamento salvo no navegador com sucesso!');
}


function imprimirOrcamento() {
    const nomeInput = document.getElementById('nomeCliente');
    const nome = escapeHTML(nomeInput?.value.trim() || '');
    const selectProc = document.getElementById('tipoProcesso');
    const selectAula = document.getElementById('selectNomeAula');
    
    const servicoTexto = selectProc ? selectProc.options[selectProc.selectedIndex].text : '';
    const aulaTexto = selectAula ? selectAula.options[selectAula.selectedIndex].text : '';
    const valor = calcularOrcamento();

    if (!nome) {
        alert('Por favor, digite seu nome antes de imprimir.');
        nomeInput?.focus();
        return;
    }

    // Injeta os dados na div #printArea
    document.getElementById('printNome').textContent = nome;
    document.getElementById('printServico').textContent = servicoTexto;
    document.getElementById('printAula').textContent = aulaTexto;
    document.getElementById('printData').textContent = new Date().toLocaleDateString('pt-BR');
    document.getElementById('printValor').textContent = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    window.print(); // Abre a tela de impressão do sistema operacional
}

/**
 * Gera um PDF A4 com 4 cópias do orçamento (2x2) para imprimir e recortar
 */
function baixarPDF4PorFolha() {
    const nomeInput = document.getElementById('nomeCliente');
    const nome = (nomeInput?.value.trim() || '');
    const selectProc = document.getElementById('tipoProcesso');
    const selectAula = document.getElementById('selectNomeAula');

    if (!nome) {
        alert('Por favor, informe seu nome para gerar o PDF.');
        nomeInput?.focus();
        return;
    }
    if (!window.jspdf) {
        alert('Não foi possível carregar o gerador de PDF. Verifique sua conexão e tente novamente.');
        return;
    }

    const servico = selectProc ? selectProc.options[selectProc.selectedIndex].text : '';
    const aula = selectAula ? selectAula.options[selectAula.selectedIndex].text : '';
    const valor = calcularOrcamento().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const data = new Date().toLocaleDateString('pt-BR');

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    const W = 210, H = 297;
    const cw = W / 2, ch = H / 2;   // cada cupom ocupa 1/4 da folha
    const pad = 9;

    function desenharCupom(x, y) {
        const ix = x + pad;            // início do texto
        const iw = cw - pad * 2;       // largura útil
        let cy = y + pad + 4;

        // Cabeçalho
        doc.setTextColor(0);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text('AUTOESCOLA SÃO GOTARDO', x + cw / 2, cy, { align: 'center' });
        cy += 5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('Simulação de Orçamento para Formação de Condutores', x + cw / 2, cy, { align: 'center' });
        cy += 4;
        doc.setDrawColor(0);
        doc.setLineWidth(0.3);
        doc.line(ix, cy, ix + iw, cy);
        cy += 7;

        // Campos
        const campos = [
            ['Cliente', nome],
            ['Serviço', servico],
            ['Aulas extras', aula],
            ['Emissão', data]
        ];
        campos.forEach(([rotulo, texto]) => {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.text(rotulo + ':', ix, cy);
            doc.setFont('helvetica', 'normal');
            const linhas = doc.splitTextToSize(texto, iw);
            doc.text(linhas, ix, cy + 4.5);
            cy += 4.5 + linhas.length * 4 + 3;
        });

        // Total
        cy += 2;
        doc.setLineWidth(0.3);
        doc.line(ix, cy, ix + iw, cy);
        cy += 8;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('VALOR TOTAL ESTIMADO', x + cw / 2, cy, { align: 'center' });
        cy += 9;
        doc.setFontSize(18);
        doc.text(valor, x + cw / 2, cy, { align: 'center' });
        cy += 9;

        // Rodapé
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        const nota = doc.splitTextToSize('Valores calculados com base nas taxas atuais. Condições sujeitas a consulta exata no balcão.', iw);
        doc.text(nota, x + cw / 2, cy, { align: 'center' });
        doc.text('Tel: (34) 3671-2274', x + cw / 2, y + ch - pad, { align: 'center' });
    }

    // 4 cupons (2 colunas x 2 linhas)
    for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 2; c++) {
            desenharCupom(c * cw, r * ch);
        }
    }

    // Linhas de corte tracejadas
    doc.setDrawColor(150);
    doc.setLineWidth(0.2);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(cw, 0, cw, H);
    doc.line(0, ch, W, ch);
    doc.setLineDashPattern([], 0);

    const nomeArquivo = 'orcamento-' + nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.pdf';
    doc.save(nomeArquivo);
}

/**
 * Constrói os cartões de instrutores no HTML dinamicamente a partir da matriz INSTRUTORES
 */
function renderizarInstrutores() {
    const grid = document.getElementById('gridInstrutores');
    if (!grid) return;
    grid.innerHTML = '';

    INSTRUTORES.forEach(ins => {
        const card = document.createElement('div');
        card.className = 'instrutor-card';
        card.innerHTML = `
            <div>
                <div class="instrutor-img"><i class="fas fa-user-tie"></i></div>
                <h3>${escapeHTML(ins.nome)}</h3>
                <span class="badge">${escapeHTML(ins.categoria)}</span>
                <p>${escapeHTML(ins.descricao)}</p>
            </div>
            <a href="https://wa.me/${escapeHTML(ins.contato)}?text=Olá%20${encodeURIComponent(ins.nome)},%20gostaria%20de%20agendar%20uma%20aula" target="_blank" rel="noopener noreferrer" class="btn-contato-instrutor">
                <i class="fab fa-whatsapp"></i> Falar com Instrutor
            </a>
        `;
        grid.appendChild(card);
    });
}

/**
 * Constrói os botões das filiais e permite alternar o iframe do Google Maps ao clicar
 */
function renderizarFiliais() {
    const grid = document.getElementById('gridFiliais');
    if (!grid) return;
    grid.innerHTML = '';

    FILIAIS.forEach((filial, idx) => {
        const card = document.createElement('div');
        card.className = `filial-card-small ${idx === 0 ? 'active-map' : ''}`;
        card.innerHTML = `
            <div class="filial-info">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                    <h4>${escapeHTML(filial.nome)}</h4>
                    <p>${escapeHTML(filial.endereco)}</p>
                    <p><strong>Tel:</strong> ${escapeHTML(filial.fone)}</p>
                </div>
            </div>
            <i class="fas fa-chevron-right indicator"></i>
        `;
        // Ao clicar em uma filial, altera o mapa e o destaque do botão
        card.onclick = () => {
            document.querySelectorAll('.filial-card-small').forEach(c => c.classList.remove('active-map'));
            card.classList.add('active-map');
            const iframe = document.getElementById('iframeMapa');
            if (iframe) iframe.src = filial.mapUrl;
        };
        grid.appendChild(card);
    });
}

/**
 * Revela seções com animação suave conforme o usuário rola a página
 */
function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 80) {
            el.classList.add("active");
        }
    });
}

/**
 * Atualiza o progresso do aluno no Dashboard superior
 */
function atualizarInterfaceGeral() {
    const concluidas = JSON.parse(localStorage.getItem('aulas_concluidas')) || [];
    const totalAulas = CURSO_LEGISLACAO.length;
    
    // Porcentagem calculada: (aulas assistidas / total) * 100
    const porcGeral = totalAulas > 0 ? Math.round((concluidas.length / totalAulas) * 100) : 0;
    
    const txtGeral = document.getElementById('home-porcentagem');
    const barGeral = document.getElementById('home-barra-fill');
    if (txtGeral) txtGeral.innerText = porcGeral + "%";
    if (barGeral) barGeral.style.width = porcGeral + "%";
}

/**
 * Função de deslogar o aluno
 */
function logout() {
    localStorage.clear();               // Remove todas as informações gravadas
    window.location.replace('index.html'); // Recarrega a página inicial
}

/**
 * Inicializa e verifica o tema salvo no navegador do usuário
 */
function initThemeIndex() {
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

// Ouve o evento de rolagem do mouse/touch para ativar as animações
window.addEventListener("scroll", reveal);

// Executado automaticamente ao terminar de carregar o HTML
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(reveal, 300);

    const logado = localStorage.getItem('usuario_logado') === 'true';
    const dashboard = document.getElementById('student-dashboard');
    const navAuth = document.getElementById('nav-auth-container');

    // Se estiver logado, exibe o painel flutuante
    if (logado && dashboard) {
        dashboard.classList.remove('student-dashboard-hidden');
        const nome = localStorage.getItem('user_name') || 'Aluno';
        const elNome = document.getElementById('home-nome-aluno');
        if (elNome) elNome.innerText = escapeHTML(nome.split(' ')[0]);
        if (navAuth) navAuth.style.display = 'none'; // Oculta o botão "Área do Aluno" da navbar
    }

    calcularOrcamento();
    renderizarInstrutores();
    initThemeIndex();
    renderizarFiliais();
    atualizarInterfaceGeral();
    carregarVideosDoBackend();
});

