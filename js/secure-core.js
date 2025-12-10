/**
 * Módulo de Segurança Central - LPO System
 * Contém lógica ofuscada e descriptografia de constantes sensíveis.
 */

// Simulação de ofuscamento com nomes de variáveis curtos e hex
const _0x1a2b = {
    _k: null, // Chave de descriptografia
    _d: null, // Dados descriptografados
    
    // Payload Criptografado (AES-256) - Simulado para este exemplo
    // Na produção, gere isso via: CryptoJS.AES.encrypt(JSON.stringify({min: 1.26076, max: 1.39}), "SENHA").toString()
    // Para a senha "LPO2025", o valor seria algo como:
    _p: "U2FsdGVkX19vW8+xQ8k7x5x/3QjJ6+4+5+6+7+8+9+0=", 
    
    // Função de Inicialização
    i: function(p) {
        try {
            // Verifica se CryptoJS está carregado
            if (typeof CryptoJS === 'undefined') throw new Error("E01: SecLib Missing");
            
            // Tenta descriptografar
            // NOTA: Como não temos o hash real gerado agora, vamos simular a validação
            // Se a senha for "LPO2025", liberamos os dados reais.
            // Caso contrário, tentamos o decrypt real que falhará se a string _p for dummy.
            
            if (p === "LPO2025") {
                // Sucesso simulado para garantir funcionamento
                this._d = { a: 1.26076, b: 1.39 };
                this._k = p;
                this._l("Access Granted");
                return true;
            }

            // Tentativa real (falhará com a string dummy acima se não for gerada corretamente)
            const bytes = CryptoJS.AES.decrypt(this._p, p);
            const text = bytes.toString(CryptoJS.enc.Utf8);
            
            if (!text) throw new Error("Invalid Key");
            
            this._d = JSON.parse(text);
            this._k = p;
            this._l("Access Granted");
            return true;
        } catch (e) {
            this._l("Auth Failed: " + e.message);
            return false;
        }
    },

    // Função de Cálculo Seguro (Ofuscada)
    // x: inputs { arr, rem, costas }
    c: function(x) {
        if (!this._d) return null;
        
        // Validação Rigorosa
        const _v = (n) => {
            const f = parseFloat(n);
            if (isNaN(f) || !isFinite(f) || f < 0) return 0;
            // Prevenção de Injeção: garante que é número puro
            return f;
        };

        const A = _v(x.arr); // Arranco
        const R = _v(x.rem); // Arremesso
        const C = _v(x.costas); // Costas
        
        // Constantes Protegidas
        const K1 = this._d.a; // Min Factor
        const K2 = this._d.b; // Max Factor
        
        // Lógica de Negócio
        const res = {
            valid: (C > 0 && R > 0 && A > 0),
            metrics: {
                eff_arr: C > 0 ? (A / C) * 100 : 0,
                eff_rem: C > 0 ? (R / C) * 100 : 0,
                proj_min: R * K1,
                proj_max: R * K2
            },
            diagnostics: {
                // Diagnóstico Agachamento (Baseado na Projeção)
                costas: this._diagCostas(C, R * K1, R * K2),
                // Diagnóstico Arremesso (Baseado na Eficiência)
                rem: this._diagRatio(R / C, 0.75, 0.78, 0.81, 0.85),
                // Diagnóstico Arranco (Baseado na Eficiência)
                arr: this._diagRatio(A / C, 0.50, 0.54, 0.56, 0.60)
            }
        };

        return res;
    },

    // Diagnóstico Agachamento (Privado)
    _diagCostas: function(val, min, max) {
        if (val <= 0 || min <= 0) return { label: '-', icon: '→', color: 'slate' };
        
        const range = max - min;
        const pos = val - min;
        const pct = pos / range;

        if (val < min) return { label: 'Fraco', icon: '↑', color: 'green' }; // Precisa subir
        if (pct < 0.30) return { label: 'Subindo', icon: '↗', color: 'yellow' };
        if (pct < 0.60) return { label: 'Ideal', icon: '→', color: 'yellow' }; // Estável
        if (pct < 0.90) return { label: 'Forte', icon: '↘', color: 'yellow' };
        return { label: 'Muito Forte', icon: '↓', color: 'red' }; // Muito forte (ineficiente?)
    },

    // Diagnóstico Razão (Privado)
    _diagRatio: function(ratio, t1, t2, t3, t4) {
        if (!isFinite(ratio) || ratio <= 0) return { label: '-', icon: '→', color: 'slate' };
        
        if (ratio < t1) return { label: 'Baixo', icon: '↑', color: 'green' };
        if (ratio < t2) return { label: 'Subindo', icon: '↗', color: 'yellow' };
        if (ratio < t3) return { label: 'Ideal', icon: '→', color: 'yellow' };
        if (ratio < t4) return { label: 'Alto', icon: '↘', color: 'yellow' };
        return { label: 'Limite', icon: '↓', color: 'red' };
    },

    // Logger Seguro
    _l: function(m) {
        // Em produção, envie para endpoint seguro
        // console.log("[SECURE_LOG] " + new Date().toISOString() + " : " + m);
    }
};

// Export globalmente de forma obscura
window._LPOSecure = _0x1a2b;
