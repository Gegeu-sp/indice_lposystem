# Sistema de Controle de Índice de Carga LPO System

Esta ferramenta implementa a metodologia **LPO System**, desenvolvida pelo **Prof. Edmilson Dantas**, utilizando como base os registros históricos compilados ao longo de sua destacada carreira esportiva.

## 🏅 Sobre o Prof. Edmilson Dantas

Os dados que fundamentam este sistema representam o trabalho meticuloso de documentação realizado pelo Prof. Edmilson Dantas, cuja trajetória esportiva é notável:

-   🌍 Participação em **5 edições dos Jogos Olímpicos**.
-   🏆 Competição no **Campeonato Mundial Máster**.
-   🥇 Conquista de **5 medalhas em Jogos Pan-Americanos**.
-   🌎 Obtenção de **12 medalhas em Campeonatos Sul-Americanos**.
-   🎖️ Premiação no programa **Brasil Olímpico em 4 temporadas distintas**.

Este projeto é uma ferramenta web interativa desenvolvida para auxiliar treinadores e atletas de Levantamento de Peso Olímpico (LPO) na análise e controle de cargas de treino, baseando-se nesses dados históricos de alto rendimento.

## 🏋️ Sobre a Metodologia LPO System

O **LPO System** é uma metodologia inovadora para o Levantamento de Peso Olímpico, desenvolvida pelo **Prof. Edmilson Dantas**.

### Fundamentos e Diferenciais
A metodologia se distingue pela integração de **análise biomecânica** com **métricas de força relativa**, estabelecendo um sistema de feedback em tempo real que permite:
-   **Diagnóstico Preciso:** Identificação imediata de desequilíbrios entre força bruta e eficiência técnica.
-   **Individualização:** Adaptação das cargas baseada na resposta fisiológica e técnica de cada atleta, não apenas em tabelas genéricas.
-   **Segurança:** Monitoramento de zonas de risco para prevenção de lesões por sobrecarga técnica.

### Benefícios Comprovados
A aplicação do LPO System tem demonstrado resultados consistentes na:
-   Otimização da curva de aprendizado técnico.
-   Maximização da transferência de força para potência específica.
-   Redução significativa da incidência de lesões em períodos pré-competitivos.

### Aplicação Prática
O sistema é utilizado com sucesso em diversos contextos, desde a **iniciação esportiva** até o **alto rendimento**, abrangendo modalidades como CrossFit, Atletismo e o próprio Halterofilismo competitivo.

## �� Objetivos

- **Diagnosticar Eficiência Técnica:** Avaliar a relação entre os levantamentos olímpicos (Arranco e Arremesso) e a força básica (Agachamento Costas).
- **Projetar Cargas Ideais:** Estimar os valores ideais de força no agachamento com base no desempenho atual no arremesso.
- **Visualização Intuitiva:** Transformar dados numéricos complexos em gráficos visuais (termômetros e gráfico de bolhas) para fácil interpretação.

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estrutura semântica.
- **Tailwind CSS:** Estilização moderna, responsiva e utilitária.
- **JavaScript (ES6+):** Lógica de cálculo em tempo real e manipulação do DOM.
- **FontAwesome:** Ícones vetoriais para interface.

## 📊 Metodologia de Cálculo

O sistema utiliza índices percentuais estabelecidos na literatura de alto rendimento para determinar as zonas de eficiência:

### 1. Eficiência Técnica (Termômetros)
Calculada pela razão entre o peso do movimento olímpico e o agachamento costas:
- **Arranco (Snatch):** Ideal entre **60% e 69%** do Agachamento.
- **Arremesso (C&J):** Ideal entre **80% e 89%** do Agachamento.

### 2. Projeção de Força (Gráfico de Bolhas)
Estima a faixa ideal de força no Agachamento Costas necessária para sustentar o Arremesso atual:
- **Fator Mínimo:** 1.26x o peso do Arremesso.
- **Fator Máximo:** 1.39x o peso do Arremesso.

## 🚀 Como Usar

1.  **Entrada de Dados:** Insira os valores atuais de 1RM (Repetição Máxima) para:
    - Peso Corporal (kg)
    - Arranco (kg)
    - Arremesso (kg)
    - Agachamento Costas (kg)
2.  **Análise Instantânea:** O sistema calcula automaticamente:
    - Percentuais de eficiência.
    - Diagnósticos qualitativos (Fraco, Ideal, Forte, etc.).
    - Gráficos visuais de feedback.
3.  **Interpretação:**
    - **Termômetros:** Verifique se as setas estão na zona verde. Amarelo indica necessidade de ajuste técnico ou ganho de força.
    - **Bolhas:** Veja se sua força de agachamento (Azul) está dentro da faixa esperada (entre Verde/Mín e Vermelho/Máx) para seu nível técnico.

## 🎨 Padrões Visuais

- **🟢 Verde:** Zona Ideal / Eficiência Alta.
- **🟡 Amarelo:** Zona de Atenção / Transição.
- **🔴 Vermelho:** Zona de Alerta / Desequilíbrio Excessivo.

## 📄 Licença

Desenvolvido para fins educacionais e de suporte ao treinamento esportivo.

---
*Desenvolvido com foco em performance, acessibilidade e usabilidade.*
