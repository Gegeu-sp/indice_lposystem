/**
 * UI Controller
 * Gerencia interação do usuário e atualizações do DOM
 */

// Global toggle for Auth Modal
window.toggleAuthModal = (show) => {
    const modal = document.getElementById('authModal');
    const content = document.getElementById('authModalContent');
    
    if (show) {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }, 10);
        document.getElementById('authPass').focus();
    } else {
        modal.classList.add('opacity-0');
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Referências DOM
    const els = {
        inputs: {
            peso: document.getElementById('pesoCorporal'),
            arr: document.getElementById('prArranco'),
            rem: document.getElementById('prArremesso'),
            costas: document.getElementById('prCostas')
        },
        display: {
            bars: {
                arr: document.getElementById('barArranco'),
                rem: document.getElementById('barArremesso')
            },
            text: {
                arr: document.getElementById('percArranco'),
                rem: document.getElementById('percArremesso')
            },
            progress: {
                arr: document.getElementById('arrProgress'),
                rem: document.getElementById('remProgress')
            },
            fr: {
                arr: document.getElementById('frArr'),
                rem: document.getElementById('frRem'),
                costas: document.getElementById('frCostas')
            },
            bubbles: {
                min: { node: document.getElementById('bubbleMin'), stem: document.getElementById('stemMin') },
                cur: { node: document.getElementById('bubbleAtual'), stem: document.getElementById('stemAtual') },
                max: { node: document.getElementById('bubbleMax'), stem: document.getElementById('stemMax') }
            }
        },
        auth: {
            modal: document.getElementById('authModal'),
            input: document.getElementById('authPass'),
            btn: document.getElementById('authBtn'),
            error: document.getElementById('authError')
        },
        secure: {
            overlay: document.querySelector('#resultsOverlay > .absolute'),
            containers: [
                document.getElementById('resultsContainer'),
                document.getElementById('diagnosticContainer')
            ]
        }
    };

    const formatters = {
        int: new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }),
        float: new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    };

    // --- Segurança: Bloqueio de Teclas ---
    
    // Bloquear Teclas de Inspeção e Menu de Contexto
    document.addEventListener('keydown', function(e) {
        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
            (e.ctrlKey && e.key === 'U')) {
            e.preventDefault();
        }
    });

    document.addEventListener('contextmenu', event => event.preventDefault());
    
    // Bloquear Setas nos Inputs (Evitar probing de valores)
    document.querySelectorAll('input[type=number]').forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
            }
        });
    });

    // --- Autenticação ---
    
    const unlockUI = () => {
        // Remove blur and overlay
        if (els.secure.overlay) els.secure.overlay.classList.add('hidden');
        els.secure.containers.forEach(el => {
            if(el) {
                el.classList.remove('blur-sm', 'filter');
                // Ensure interactivity is restored if it was blocked by pointer-events (optional)
            }
        });
        
        // Hide login button if desired, or change icon to unlock
        const loginBtn = document.getElementById('loginBtn');
        if(loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-unlock text-green-500 text-xl"></i>';
            loginBtn.title = "Sistema Desbloqueado";
            loginBtn.onclick = null; // Remove click handler
        }

        // Trigger update to show real values
        updateUI();
    };

    const tryLogin = () => {
        const pass = els.auth.input.value;
        if (!window._LPOSecure) {
            console.error("Core não carregado");
            return;
        }

        if (window._LPOSecure.i(pass)) {
            // Sucesso
            window.toggleAuthModal(false);
            unlockUI();
        } else {
            // Falha
            els.auth.error.classList.remove('hidden');
            els.auth.input.classList.add('border-red-500');
        }
    };

    els.auth.btn.addEventListener('click', tryLogin);
    els.auth.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') tryLogin();
    });

    // --- Aplicação Principal ---

    function initApp() {
        // Bind Inputs
        Object.values(els.inputs).forEach(inp => {
            inp.addEventListener('input', updateUI);
        });
        
        // Initial state: Locked (UI handles visual state via CSS classes in HTML)
        // We allow inputs to work immediately, but updateUI will handle whether to show real data.
    }

    function updateUI() {
        // Coletar dados
        const data = {
            arr: els.inputs.arr.value,
            rem: els.inputs.rem.value,
            costas: els.inputs.costas.value
        };

        const peso = parseFloat(els.inputs.peso.value) || 0;

        // SE ESTIVER BLOQUEADO (Core retorna null ou dummy safe), não mostrar resultados
        // Mas o Core só retorna algo se estiver autenticado.
        // Se não autenticado, window._LPOSecure.c(data) retorna null.
        
        const result = window._LPOSecure.c(data);
        
        // Cálculos de Força Relativa (Simples - Permitido visualizar? O usuário disse "impeça visualização de valores sensíveis")
        // Assumindo que FR é cálculo simples (divisão), talvez ok mostrar?
        // O Prompt diz "impeça a visualização de valores sensíveis".
        // Vamos bloquear tudo que é output.
        
        if (!result) {
            // Modo Bloqueado: Mostra zeros ou placeholders
            // Os inputs funcionam ("realizar cadastros"), mas os gráficos ficam travados.
            return; 
        }

        // Modo Desbloqueado: Atualiza tudo
        const metrics = result.metrics;

        // 1. Atualizar Termômetros
        updateThermometer(els.display.bars.arr, els.display.text.arr, els.display.progress.arr, metrics.eff_arr);
        updateThermometer(els.display.bars.rem, els.display.text.rem, els.display.progress.rem, metrics.eff_rem);
        
        // Atualizar Setas Dinâmicas
        updateDynamicArrow('arrowArranco', 'iconArranco', 'tooltipArranco', metrics.eff_arr);
        updateDynamicArrow('arrowArremesso', 'iconArremesso', 'tooltipArremesso', metrics.eff_rem);

        // 2. Atualizar Força Relativa
        if (peso > 0) {
            els.display.fr.arr.innerText = formatters.float.format(data.arr / peso);
            els.display.fr.rem.innerText = formatters.float.format(data.rem / peso);
            els.display.fr.costas.innerText = formatters.float.format(data.costas / peso);
        } else {
            ['arr', 'rem', 'costas'].forEach(k => els.display.fr[k].innerText = '0.00');
        }

        // 3. Atualizar Bolhas
        updateBubbles(metrics.proj_min, metrics.proj_max, parseFloat(data.costas));

        // 4. Diagnóstico
        // Agora recebemos os dados prontos do Secure Core
        if (result.diagnostics) {
            updateDiagnostics(result.diagnostics);
        }
    }
    
    function updateDiagnostics(diag) {
         const updateArrow = (id, txtId, data) => {
             const arrow = document.getElementById(id);
             const txt = document.getElementById(txtId);
             if(!arrow || !txt) return;
             
             // Mapeamento de cores
             const colorMap = {
                 'green': 'text-green-600',
                 'yellow': 'text-yellow-500',
                 'red': 'text-red-500',
                 'slate': 'text-slate-300'
             };
             
             const arrowColor = colorMap[data.color] || 'text-slate-300';
             // Texto usa mesma cor, mas talvez um tom mais escuro ou igual? Vamos usar igual para simplicidade
             // Ou conforme original: arrow-green, arrow-yellow, arrow-red
             
             arrow.innerText = data.icon;
             arrow.className = `arrow-icon ${arrowColor}`;
             
             txt.innerText = data.label;
             // Badge style text?
             // Original: text-xs font-bold uppercase ${color}
             txt.className = `text-base font-bold w-28 text-right ${arrowColor.replace('text-', 'text-')}`;
         };
         
         updateArrow('arrowArr', 'txtArr', diag.arr);
         updateArrow('arrowRem', 'txtRem', diag.rem);
         updateArrow('arrowCostas', 'txtCostas', diag.costas);
    }

    function updateThermometer(bar, text, progress, val) {
        const v = Math.min(val, 100);
        const s = `${formatters.int.format(v)}%`;
        bar.style.height = `${v}%`;
        text.innerText = s;
        progress.style.width = `${v}%`;
    }

    function updateBubbles(min, max, current) {
        const b = els.display.bubbles;
        
        b.min.node.innerText = formatters.int.format(min);
        b.max.node.innerText = formatters.int.format(max);
        b.cur.node.innerText = formatters.int.format(current);

        if (max === 0) return;

        // Escala
        const values = [min, max, current];
        const minY = Math.min(...values) * 0.95;
        const maxY = Math.max(...values) * 1.05;
        const range = maxY - minY;

        const getH = (val) => range === 0 ? 0 : ((val - minY) / range) * 100;

        const setPos = (el, val) => {
            const h = `${getH(val)}%`;
            el.node.style.bottom = h;
            el.stem.style.height = h;
        };

        setPos(b.min, min);
        setPos(b.max, max);
        setPos(b.cur, current);
    }
    
    function updateDynamicArrow(arrowId, iconId, tooltipId, percentage) {
        const arrowEl = document.getElementById(arrowId);
        const iconEl = document.getElementById(iconId);
        const tooltipEl = document.getElementById(tooltipId);
        
        if (!arrowEl || !iconEl || !tooltipEl) return;
        
        const clampedPct = Math.max(0, Math.min(100, percentage));
        arrowEl.style.top = `${100 - clampedPct}%`;
        tooltipEl.innerText = `${formatters.int.format(clampedPct)}%`;
        
        let colorClass = 'text-yellow-500';
        let bgClass = 'bg-yellow-500';

        if (arrowId.includes('Arranco')) {
             if (clampedPct >= 60 && clampedPct <= 70) { 
                  colorClass = 'text-green-600'; bgClass = 'bg-green-600';
             } else if (clampedPct > 70) {
                  colorClass = 'text-red-500'; bgClass = 'bg-red-500';
             }
         } else { 
             if (clampedPct >= 80) {
                  colorClass = 'text-green-600'; bgClass = 'bg-green-600';
             }
         }
        
        iconEl.className = `arrow-indicator fas fa-caret-left ${colorClass}`;
        tooltipEl.className = `absolute left-full ml-2 top-1/2 -translate-y-1/2 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${bgClass}`;
    }

    initApp();
});
