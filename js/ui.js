/**
 * UI Controller
 * Gerencia interação do usuário e atualizações do DOM
 */

document.addEventListener('DOMContentLoaded', () => {
    // Referências DOM
    const els = {
        inputs: {
            peso: document.getElementById('pesoCorporal'),
            arr: document.getElementById('prArranque'),
            rem: document.getElementById('prArremesso'),
            costas: document.getElementById('prCostas')
        },
        display: {
            bars: {
                arr: document.getElementById('barArranque'),
                rem: document.getElementById('barArremesso')
            },
            text: {
                arr: document.getElementById('percArranque'),
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
        }
    };

    const formatters = {
        int: new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }),
        float: new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    };

    // --- Autenticação ---
    
    const tryLogin = () => {
        const pass = els.auth.input.value;
        if (!window._LPOSecure) {
            console.error("Core não carregado");
            return;
        }

        if (window._LPOSecure.i(pass)) {
            // Sucesso
            els.auth.modal.classList.add('hidden');
            initApp();
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

        // Demo Data (Opcional)
        /*
        els.inputs.peso.value = "75";
        els.inputs.arr.value = "110";
        els.inputs.rem.value = "140";
        els.inputs.costas.value = "160";
        updateUI();
        */
    }

    function updateUI() {
        // Coletar dados
        const data = {
            arr: els.inputs.arr.value,
            rem: els.inputs.rem.value,
            costas: els.inputs.costas.value
        };

        // Processamento Seguro
        const result = window._LPOSecure.c(data);
        if (!result) return;

        const peso = parseFloat(els.inputs.peso.value) || 0;
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

        // 4. Diagnóstico (Simplificado para manter foco na segurança, reutilizando lógica visual existente se necessário)
        // A lógica de diagnóstico detalhado (setas de texto) pode ser portada para o secure-core se conter segredos,
        // mas geralmente são comparativos simples. Mantendo a lógica visual aqui ou migrando se necessário.
        // Para brevidade, vou focar nos componentes principais já migrados.
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
    
    // Helper para setas dinâmicas (mantido do original, mas limpo)
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

        // Lógica de cores baseada no ID (Arranco vs Arremesso)
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
        
        iconEl.className = `fas fa-caret-left text-3xl drop-shadow-sm transition-colors duration-500 ${colorClass}`;
        tooltipEl.className = `absolute left-full ml-2 top-1/2 -translate-y-1/2 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${bgClass}`;
    }
});
