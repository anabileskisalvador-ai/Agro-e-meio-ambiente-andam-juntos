/**
 * AGROFUTURO 2026 - INTEGRAÇÃO DE COMPONENTES INTERATIVOS E ACESSIBILIDADE VIA API NATIVA
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. GERENCIADOR DO COMPONENTE ACCORDION
    // ==========================================
    const headersAccordion = document.querySelectorAll('.accordion-header');

    headersAccordion.forEach(header => {
        header.addEventListener('click', () => {
            const painel = document.getElementById(header.getAttribute('aria-controls'));
            const estaExpandido = header.getAttribute('aria-expanded') === 'true';

            // Alterna o estado do cabeçalho
            header.setAttribute('aria-expanded', !estaExpandido);
            
            // Alterna visibilidade do painel interno
            if (painel) {
                painel.hidden = estaExpandido;
                if (!estaExpandido) {
                    painel.style.animation = 'fadeIn 0.3s ease';
                }
            }
        });
    });

    // ==========================================
    // 2. FORMULÁRIO DE INSCRIÇÃO LATERAL
    // ==========================================
    const formInscricao = document.getElementById('form-inscricao');
    const msgSucessoForm = document.getElementById('mensagem-sucesso-form');

    formInscricao.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulação assíncrona de envio corporativo
        msgSucessoForm.hidden = false;
        formInscricao.reset();

        setTimeout(() => {
            msgSucessoForm.hidden = true;
        }, 6000);
    });

    // ==========================================
    // 3. ÁREA DE COMENTÁRIOS (INTERATIVIDADE)
    // ==========================================
    const formComentario = document.getElementById('form-comentario');
    const txtComentario = document.getElementById('txt-comentario');
    const listaComentarios = document.getElementById('lista-comentarios');

    formComentario.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const texto = txtComentario.value.trim();
        if (!texto) return;

        // Construindo novo elemento de comentário semanticamente correto
        const itemComentario = document.createElement('div');
        itemComentario.className = 'comentario-item';
        
        itemComentario.innerHTML = `
            <div class="comentario-meta">
                <strong>Leitor Conectado</strong> 
                <span>• Agora mesmo</span>
            </div>
            <p>${escaparHTML(texto)}</p>
        `;

        // Insere no topo da lista
        listaComentarios.insertBefore(itemComentario, listaComentarios.firstChild);
        txtComentario.value = '';
    });

    // Função de segurança básica para sanitizar o input de comentários
    function escaparHTML(string) {
        return string.replace(/&/g, '&amp;')
                     .replace(/</g, '&lt;')
                     .replace(/>/g, '&gt;')
                     .replace(/"/g, '&quot;')
                     .replace(/'/g, '&#039;');
    }

    // ==========================================
    // 4. MECANISMO ROBUSTO DE ACESSIBILIDADE
    // ==========================================
    
    // Controle de Tamanho de Fontes (Escala Relativa)
    let multiplicadorFonte = 1.0;
    const btnAumentar = document.getElementById('btn-aumentar-fonte');
    const btnDiminuir = document.getElementById('btn-diminuir-fonte');

    btnAumentar.addEventListener('click', () => {
        if (multiplicadorFonte < 1.3) {
            multiplicadorFonte += 0.05;
            document.documentElement.style.fontSize = `${multiplicadorFonte * 16}px`;
        }
    });

    document.getElementById('btn-diminuir-fonte').addEventListener('click', () => {
        if (multiplicadorFonte > 0.85) {
            multiplicadorFonte -= 0.05;
            document.documentElement.style.fontSize = `${multiplicadorFonte * 16}px`;
        }
    });

    // Alternador de Contraste (Modo Claro vs Dark Mode Premium)
    const btnContraste = document.getElementById('btn-alternar-contraste');
    btnContraste.addEventListener('click', () => {
        document.body.classList.toggle('modo-claro');
    });

    // ==================================================================
    // 5. MOTOR DE LEITURA POR VOZ (SpeechSynthesis API)
    // ==================================================================
    const btnFalar = document.getElementById('btn-falar');
    const btnPararFala = document.getElementById('btn-parar-fala');
    let utenteFala = null;

    btnFalar.addEventListener('click', () => {
        // Cancela qualquer fala residual que possa estar rodando no sistema
        window.speechSynthesis.cancel();

        // Captura seletiva de texto: Apenas o conteúdo principal da página
        const containerTextoPrincipal = document.querySelector('.secao-texto');
        if (!containerTextoPrincipal) return;

        // Extrai o texto limpo, pulando códigos ou elementos ocultos
        const textoParaLer = containerTextoPrincipal.innerText;

        // Cria a instância de fala nativa
        utenteFala = new SpeechSynthesisUtterance(textoParaLer);
        utenteFala.lang = 'pt-BR';
        utenteFala.rate = 1.05; // Velocidade natural corporativa

        // Gerenciamento de estado dos botões da UI
        utenteFala.onstart = () => {
            btnFalar.innerText = "🗣️ Lendo...";
            btnFalar.disabled = true;
            btnPararFala.disabled = false;
        };

        utenteFala.onend = () => {
            redefinirBotoesVoz();
        };

        utenteFala.onerror = () => {
            redefinirBotoesVoz();
        };

        // Dispara a conversão nativa de texto em áudio
        window.speechSynthesis.speak(utenteFala);
    });

    btnPararFala.addEventListener('click', () => {
        window.speechSynthesis.cancel();
        redefinirBotoesVoz();
    });

    function redefinirBotoesVoz() {
        btnFalar.innerText = "▶ Ouvir";
        btnFalar.disabled = false;
        btnPararFala.disabled = true;
    }

    // Garante que a fala pare imediatamente se o usuário fechar a página ou aba
    window.addEventListener('beforeunload', () => {
        window.speechSynthesis.cancel();
    });
});