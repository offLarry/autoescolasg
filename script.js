// --- 1. CONFIGURAÇÕES E DADOS ---
const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzVtKRAkHOo_n8MT1rbi0RFUbQqOhmHZdvIlYBrEA943lPdQ-z2W_MzzYqMMfqcCadG/exec';

const CURSO_LEGISLACAO = [
    { id: 'leg_1', title: '01. Introdução à Legislação', url: 'https://www.dropbox.com/scl/fi/q670pw9onlsoup0uwu9uh/01-Legisla-o-EDIT.mp4?rlkey=fgkfqvnpv2cbeb8ue2garx9j5&st=f4ke17tn&raw=1' },
    { id: 'leg_2', title: '02. Legislação', url: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=soyxz0mt&raw=1' },
    { id: 'leg_3', title: '03. Legislação', url: 'https://www.dropbox.com/scl/fi/2v3a9lvtu0hma4ktojjlq/03-LEGISLA-O.mp4?rlkey=5giu774jbf1mmdf2x8v9paqkw&st=nwfle0xb&raw=1' },
    { id: 'leg_4', title: '04. Legislação', url: 'https://www.dropbox.com/scl/fi/pc4c6x8cafki0bc8tikhm/04-LEGISLA-O.mp4?rlkey=mzs0ps4nyyb23qm1gqvqtwz78&st=xu6qxslh&raw=1' },

    { id: 'leg_5', title: '05. Introdução à Sinalização', url: 'https://www.dropbox.com/scl/fi/k3w63lrirvstkoi0abfav/05-SINALIZA-O.mp4?rlkey=9yrqojpomtc7ti2wied7sk1wx&st=l7zgv1l9&raw=1' },
    { id: 'leg_6', title: '06. Sinalização', url: 'https://www.dropbox.com/scl/fi/h5k0i6p3qld5s3mlpkq1s/06-SINALIZA-O.mp4?rlkey=tykepxntrqpxjtletnbwr68ra&st=x9g2nly6&raw=1' },
    { id: 'leg_7', title: '07 Sinalização', url: 'https://www.dropbox.com/scl/fi/wdcw32037vhnd4no2koso/07-SINALIZA-O.mp4?rlkey=d3hvj93zwoq400lz2h7eqo7yx&st=t08ph9e1&raw=1' },
    { id: 'leg_8', title: '08. Sinalização', url: 'https://www.dropbox.com/scl/fi/05cs21an3v96znuyxt1s1/08-SINALIZA-O.mp4?rlkey=jeqagbfl1uu38n0kqy160x8ss&st=nurxqroc&raw=1' },

    { id: 'leg_9', title:  '09. Infrações e Penalidades', url: 'https://www.dropbox.com/scl/fi/t50k8f0hfj3aslb2vbdq5/09-INFRA-ES.mp4?rlkey=cnh8bx1vgab6nxv52guvqm876&st=rrhfjpdj&raw=1' },
    { id: 'leg_10', title: '10. Infrações e Penalidades', url: 'https://www.dropbox.com/scl/fi/qbn5nzpcaztmit709s1xc/10-INFRA-ES.mp4?rlkey=wkuiu73lcn3lw30qhji51gh0j&st=yz501tj8&raw=1' },
    { id: 'leg_11', title: '11. Infrações e Penalidades', url: 'https://www.dropbox.com/scl/fi/fjasegp1qr5ripw18tq13/11-INFRA-ES.mp4?rlkey=wghwksy0otf3i3e8mua3ozqkq&st=xisbvwe8&raw=1' },
    { id: 'leg_12', title: '12. Infrações e Penalidades', url: 'https://www.dropbox.com/scl/fi/ywz1vllesjrlnbi9mh47o/12-INFRA-ES.mp4?rlkey=dlbhx8qchguspl0eut16c71fd&st=ehy5a1vp&raw=1' },

    { id: 'leg_13', title: '13. Normas e Condutas', url: 'https://www.dropbox.com/scl/fi/uhagyy8h8skjb1asg8kng/13-NORMAS.mp4?rlkey=y6l4eqtby3ou7nql3ds095jtw&st=ta33la6d&raw=1' },
    { id: 'leg_14', title: '14. Normas e Condutas', url: 'https://www.dropbox.com/scl/fi/pvgsqlqqniiefkdcw3lqz/14-NORMAS.mp4?rlkey=9x6nc1x0xur0hfjqq9wray905&st=o1na1fay&raw=1' },
    { id: 'leg_15', title: '15. Normas e Condutas', url: 'https://www.dropbox.com/scl/fi/kyiukhe0gi14cvm8eszdw/15-NORMAS.mp4?rlkey=ak3me9abl9h7jc98ppe6rre3e&st=ze8h8lau&raw=1' },
    { id: 'leg_16', title: '16. Normas e Condutas', url: 'https://www.dropbox.com/scl/fi/qwi1zrjjn1sh209jkmzlw/16-NORMAS.mp4?rlkey=f0ozn5z6dx5nmp8duffiv412k&st=ew0srpyq&raw=1' },
    { id: 'leg_17', title: '17. Normas e Condutas', url: 'https://www.dropbox.com/scl/fi/dfxcalvctqn9pyy5rd569/17-NORMAS-QUEST-ES-cut.com.mp4?rlkey=73lpri4slwe24s2w0r4wesp1n&st=4ycp207b&raw=1' },

    { id: 'leg_18', title: '18. Direção Defensiva', url: 'https://www.dropbox.com/scl/fi/9hp1nt9b08546gu1229p7/18-DIRE-O-DEFENSIVA.mp4?rlkey=p2p4gwpnbo3p4nygc12rw8trx&st=cm6lcuqe&raw=1' },
    { id: 'leg_19', title: '19. Direção Defensiva', url: 'https://www.dropbox.com/scl/fi/9ch9zi0xd2w97ybvt9uaj/19-DIRE-O-DEFENSIVA.mp4?rlkey=3n1cjfxc1r0yz1y9i8lui81jh&st=smw9o5kz&raw=1' },
    { id: 'leg_20', title: '20. Direção Defensiva', url: 'https://www.dropbox.com/scl/fi/q670pw9onlsoup0uwu9uh/01-Legisla-o-EDIT.mp4?rlkey=fgkfqvnpv2cbeb8ue2garx9j5&st=9eftivl1&raw=1' },
    { id: 'leg_21', title: '21. Direção Defensiva', url: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' },

    { id: 'leg_22', title: '22. Primeiros Socorros', url: 'https://www.dropbox.com/scl/fi/8eh70ydl7nw0b3tkj41qu/24-PRIMEIROS-SOCORROS.mp4?rlkey=4rnirtm44t99owt5rc87m513g&st=gbark4md&raw=1' },
    { id: 'leg_23', title: '23. Primeiros Socorros', url: 'https://www.dropbox.com/scl/fi/0v4coveq5b7h7etojsvkn/25-PRIMEIROS-SOCORROS.mp4?rlkey=os8eo3z7ansascflh29e1vh1n&st=iq7yopg1&raw=1' },
    { id: 'leg_24', title: '24. Primeiros Socorros', url: 'https://www.dropbox.com/scl/fi/aqmvod20rt7xhkjqvc54c/26-PRIMEIROS-SOCORROS.mp4?rlkey=jaizi1ifkkd3t3h3lmjefk42a&st=7dbyuhng&raw=1' },
    { id: 'leg_25', title: '25. Primeiros Socorros', url: 'https://www.dropbox.com/scl/fi/uleso3vy033f6r2r86boh/27-PRIMEIROS-SOCORROS-cut.mp4?rlkey=xdrlfufqidartr4y2jmdjvdsf&st=as8gs13l&raw=1' },

    { id: 'leg_26', title: '26. Meio Ambiente', url: 'https://www.dropbox.com/scl/fi/qm2usit08vbn754reepf0/28-MEIO-AMBIENTE.mp4?rlkey=9cy1en3ljg2vaxcoqkzwunpj8&st=q36qwtlw&raw=1' },
    { id: 'leg_27', title: '27. Meio Ambiente', url: 'https://www.dropbox.com/scl/fi/ze1oxs3ycax4suwnn1bum/29-MEIO-AMBIENTE.mp4?rlkey=ztuin39vu2if216tx52vqv4uz&st=29c5ji&raw=1' },

    { id: 'leg_28', title: '28. Mecânica', url: 'https://www.dropbox.com/scl/fi/tkeuf9l70691ih6u0j7s7/30-MEC-NICA.mp4?rlkey=t0l7d2nnh8haaz3hvo64cxkqk&st=ll8itt8m&raw=1' },
    { id: 'leg_29', title: '29. Mecânica', url: 'https://www.dropbox.com/scl/fi/oe6nr8sy506vcn722w5oo/31-MEC-NICA.mp4?rlkey=1vdi44d00368aw75afrfy37es&st=v1x7mfzo&raw=1' },
    { id: 'leg_30', title: '30. Mecânica', url: 'https://www.dropbox.com/scl/fi/s44zst06jes84sjvfc9sd/32-MEC-NICA.mp4?rlkey=rgrtvn7v0zbijbscxav3xx922&st=qifdf215&raw=1' },
    { id: 'leg_31', title: '31. Mecânica', url: 'https://www.dropbox.com/scl/fi/6121osnobovdbxbs9bx7q/33-MEC-NICA-QUEST-ES-cut.mp4?rlkey=ecr148b6dwz6dkxr2bmr0stsf&st=2c5at6xz&raw=1' },
];

const CURSO_DIRECAO = [
    { id: 'def_1', title: '01. Conceitos de Direção Defensiva', url: 'URL_VIDEO_1' },
    { id: 'def_2', title: '02. Elementos da Direção Defensiva', url: 'URL_VIDEO_2' },
    { id: 'def_3', title: '03. Condições Adversas', url: 'URL_VIDEO_3' },
];


function finalizarNoWhats() {
    const tipo = document.getElementById('tipoProcesso').value;
    const categoria = document.querySelector('input[name="cat"]:checked').value;
    const valor = document.getElementById('valorTotal').innerText;
    
    // Texto formatado para o WhatsApp
    const texto = `Olá! Fiz uma simulação no site da Autoescola São Gotardo:%0A%0A` +
                  `*Processo:* ${tipo}%0A` +
                  `*Categoria:* ${categoria}%0A` +
                  `*Valor Estimado:* ${valor}%0A%0A` +
                  `Gostaria de mais informações!`;

    const fone = "553436712274";
    window.open(`https://wa.me/${fone}?text=${texto}`, '_blank');
}

// --- 2. LÓGICA DE ANIMAÇÃO (REVEAL) - CORREÇÃO DO FOOTER ---
function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
            el.classList.add("active");
        }
    });
}

// --- 3. SIMULADOR E MAPAS ---
const PRECOS = {
    primeira: { A: 1187, B: 1217, AB: 1693, D: 2346 },
    adicao: { A: 768, B: 798, AB: 0, D: 2346 },
    mudanca: { A: 0, B: 0, AB: 0, D: 2346 }
};

function atualizarOrcamento() {
    const tipo = document.getElementById('tipoProcesso')?.value;
    const categoria = document.querySelector('input[name="cat"]:checked')?.value;
    const display = document.getElementById('valorTotal');
    if (tipo && categoria && display) {
        const valor = PRECOS[tipo][categoria] || 0;
        display.innerText = valor > 0 ? `R$ ${valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : "0,00";
    }
}

function alterarMapa(elemento, urlMapa) {
    const mapa = document.getElementById('mapaInterativo');
    if (mapa) mapa.src = urlMapa;
    document.querySelectorAll('.filial-card-small').forEach(card => card.classList.remove('active-map'));
    elemento.classList.add('active-map');
}

// --- 4. PROGRESSO GERAL ---
function atualizarInterfaceGeral() {
    const concluidas = JSON.parse(localStorage.getItem('aulas_concluidas')) || [];
    const totalAulas = CURSO_LEGISLACAO.length + CURSO_DIRECAO.length;
    
    // Porcentagem Total (Home)
    const porcGeral = totalAulas > 0 ? Math.round((concluidas.length / totalAulas) * 100) : 0;
    const txtGeral = document.getElementById('home-porcentagem');
    const barGeral = document.getElementById('home-barra-fill');
    if (txtGeral) txtGeral.innerText = porcGeral + "%";
    if (barGeral) barGeral.style.width = porcGeral + "%";

    // Progresso Módulo 1
    const aulasM1 = concluidas.filter(id => id.startsWith('leg_')).length;
    const porcM1 = Math.round((aulasM1 / CURSO_LEGISLACAO.length) * 100);
    if(document.getElementById('porcentagemTexto')) document.getElementById('porcentagemTexto').innerText = porcM1 + "%";
    if(document.getElementById('barraProgresso')) document.getElementById('barraProgresso').style.width = porcM1 + "%";

    // Bloqueio Módulo 2
    const btnM2 = document.getElementById('btn-modulo-2');
    if (btnM2 && porcM1 < 100) {
        btnM2.innerHTML = '<i class="fas fa-lock"></i> Bloqueado';
        btnM2.style.pointerEvents = "none";
    } else if (btnM2) {
        btnM2.innerHTML = 'Acessar Módulo';
        btnM2.style.pointerEvents = "auto";
        btnM2.closest('.course-card').classList.remove('opacity-50');
    }
}

// --- 5. INICIALIZAÇÃO ---
window.addEventListener("scroll", reveal);

document.addEventListener('DOMContentLoaded', () => {
    // 1. Força o reveal inicial
    setTimeout(reveal, 500); 

    // 2. Verifica se o aluno está logado e mostra o dashboard
    const logado = localStorage.getItem('usuario_logado') === 'true';
    const dashboard = document.getElementById('student-dashboard');
    const navAuth = document.getElementById('nav-auth-container');

    if (logado && dashboard) {
        // Mostra o dashboard flutuante
        dashboard.classList.remove('student-dashboard-hidden');

        // Preenche o nome do aluno
        const nome = localStorage.getItem('user_name') || 'Aluno';
        const elNome = document.getElementById('home-nome-aluno');
        if (elNome) elNome.innerText = nome.split(' ')[0]; // Só o primeiro nome

        // Esconde o botão "Área do Aluno" da navbar (já está logado)
        if (navAuth) navAuth.style.display = 'none';
    }

    // 3. Atualiza progressos
    atualizarInterfaceGeral();

    // 4. Configura Simulador
    document.getElementById('tipoProcesso')?.addEventListener('change', atualizarOrcamento);
    document.querySelectorAll('input[name="cat"]').forEach(input => {
        input.addEventListener('change', atualizarOrcamento);
    });
    atualizarOrcamento();
});

function logout() { localStorage.clear(); window.location.href = 'index.html'; }
