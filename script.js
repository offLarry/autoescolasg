// --- 1. CONFIGURAÇÕES E DADOS ---
const CURSO_LEGISLACAO = [
    { id: 'leg_1', title: '01. Introdução à Legislação' },
    { id: 'leg_2', title: '02. Normas de Circulação' },
    { id: 'leg_3', title: '03. Sinalização Vertical' },
    { id: 'leg_4', title: '04. Sinalização Horizontal' }
];

// --- 2. LÓGICA DO SIMULADOR DE ORÇAMENTO ---
function calcularOrcamento() {
    // Tabela de preços atualizada
    const tabela = {
        primeira: { A: 1550, B: 2100, AB: 3250, D: 0 },
        adicao:   { A: 1100, B: 1550, AB: 2400, D: 1750 },
        mudanca:  { A: 0,    B: 0,    AB: 0,    D: 1850 }
    };

    const selectProcesso = document.getElementById('tipoProcesso');
    const radioSelecionado = document.querySelector('input[name="cat"]:checked');
    const displayValor = document.getElementById('valorTotal');

    if (!selectProcesso || !radioSelecionado || !displayValor) return;

    const tipo = selectProcesso.value;
    const cat = radioSelecionado.value;
    const valor = tabela[tipo][cat] || 0;

    // Atualiza o ecrã com animação simples de texto
    if (valor === 0) {
        displayValor.innerText = "Consulte-nos";
        displayValor.style.fontSize = "2.2rem";
    } else {
        displayValor.innerText = `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        displayValor.style.fontSize = "3rem";
    }
}

// Envia os dados escolhidos para o WhatsApp
function finalizarNoWhats() {
    const tipoTexto = document.getElementById('tipoProcesso').options[document.getElementById('tipoProcesso').selectedIndex].text;
    const cat = document.querySelector('input[name="cat"]:checked')?.value || "";
    const valor = document.getElementById('valorTotal').innerText;
    
    const telefone = "5534998047604";
    const mensagem = `Olá! Usei o simulador no site e quero informações sobre:%0A✅ *${tipoTexto}*%0A🚗 *Categoria ${cat}*%0A💰 *Valor Estimado: ${valor}*`;
    
    window.open(`https://wa.me/${telefone}?text=${mensagem}`, '_blank');
}

// --- 3. GESTÃO DE PROGRESSO E UTILIZADOR ---
function carregarDadosUtilizador() {
    const nome = localStorage.getItem('user_name') || 'Aluno';
    const elNome = document.getElementById('displayNome');
    if (elNome) elNome.innerText = nome;
    
    atualizarBarraProgresso();
}

function atualizarBarraProgresso() {
    const aulasConcluidas = JSON.parse(localStorage.getItem('aulas_concluidas')) || [];
    const totalAulas = CURSO_LEGISLACAO.length;
    const percentagem = Math.round((aulasConcluidas.length / totalAulas) * 100);

    const barra = document.getElementById('barraProgressoFill');
    const texto = document.getElementById('porcentagemTexto');

    if (barra) barra.style.width = `${percentagem}%`;
    if (texto) texto.innerText = `${percentagem}%`;
}

// Função para ser usada na página de cursos (botão concluir)
function concluirAula(idAula) {
    let concluidas = JSON.parse(localStorage.getItem('aulas_concluidas')) || [];
    
    if (!concluidas.includes(idAula)) {
        concluidas.push(idAula);
        localStorage.setItem('aulas_concluidas', JSON.stringify(concluidas));
        alert("Aula concluída! Parabéns pelo progresso. ✅");
        atualizarBarraProgresso();
    }
}

// Logout do sistema
function logout() {
    localStorage.removeItem('usuario_logado');
    localStorage.removeItem('user_name');
    window.location.replace('login.html');
}

// --- 4. INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Verifica se está logado (proteção simples)


    // 2. Carrega nome e progresso
    carregarDadosUtilizador();

    // 3. Configura ouvintes do Simulador
    const selectProcesso = document.getElementById('tipoProcesso');
    const radiosCategoria = document.querySelectorAll('input[name="cat"]');

    if (selectProcesso) {
        selectProcesso.addEventListener('change', calcularOrcamento);
    }

    radiosCategoria.forEach(radio => {
        radio.addEventListener('change', () => {
            // Pequeno feedback visual ao clicar no card
            calcularOrcamento();
        });
    });

    // 4. Corre o cálculo inicial
    if (document.getElementById('valorTotal')) {
        calcularOrcamento();
    }
});