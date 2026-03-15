# Memorando Técnico
**Assunto:** `will-change` ao usar WAAPI — adicionar/remover imperativamente ou não fazer nada?  
**Referências:** MDN Web Docs, CSS-Tricks, Motion (ex-Framer Motion), Telerik Blog, Lisi Linhart  

---

## 1. O que `will-change` faz e por que ele existia com CSS

`will-change` é uma **dica de otimização** para o browser. Ele informa antecipadamente quais propriedades de um elemento estão prestes a mudar, dando tempo ao browser de criar uma camada de composição (compositing layer) dedicada para aquele elemento antes que a animação comece.

Sem o `will-change`, o browser promove o elemento para sua própria camada somente no momento em que a animação começa — podendo causar um micro-travamento no primeiro frame. Com `will-change: transform`, o browser pode fazer essa promoção durante o tempo ocioso da página, garantindo que o primeiro frame da animação já seja suave.

O problema é que essa promoção tem custo: cada layer ocupa memória GPU. Por isso, a MDN é enfática:

> `will-change` é destinado ao uso como **último recurso**, para lidar com problemas de performance já existentes. **Não deve ser usado para antecipar** problemas de performance. O uso excessivo resultará em consumo excessivo de memória.
> — MDN Web Docs

A prática recomendada historicamente com CSS era: adicionar `will-change` pouco antes da animação começar (via JavaScript, num `mouseenter` por exemplo) e **removê-lo logo após o término**, para liberar os recursos.

---

## 2. Como o WAAPI muda essa equação

Esse é o ponto central: **ao usar WAAPI com `element.animate()`, o browser já sabe — com antecedência — que o elemento vai ser animado**, porque você está usando a API de animação nativa que ele mesmo fornece.

A consequência direta foi descrita por Lisi Linhart, especialista em WAAPI:

> "Com o WAAPI dizemos ao browser: 'Ei, estou animando este elemento com a API que você mesmo fornece — pode otimizar com o que tiver disponível?' (...) O problema com bibliotecas externas é que o browser às vezes não reconhece que um elemento está sendo animado e não o promove para sua própria camada nem o renderiza via GPU. Com o WAAPI isso não acontece."

Isso é confirmado pela documentação da Motion (biblioteca construída sobre WAAPI):

> "Porque a Motion é construída sobre a Web Animations API, os browsers são inteligentes o suficiente para automaticamente colocar elementos que animam `transform` e `opacity` em uma nova camada gráfica."

E pelo CSS-Tricks:

> "Se a animação tem um `delay` positivo, você nem mesmo precisa de `will-change`, pois o browser faz a promoção de camada no início do delay — e quando a animação começa, já está pronto."

---

## 3. Resposta direta: o que fazer na prática

**Não adicione nem remova `will-change` imperativamente ao usar WAAPI.**

O browser gerencia a promoção de camada automaticamente quando você usa `element.animate()` com propriedades de composição (`transform`, `opacity`). Fazer isso manualmente seria redundante e poderia até gerar overhead desnecessário.

A tabela abaixo resume os cenários:

| Situação | Recomendação |
|---|---|
| WAAPI com `transform` / `opacity` | ✅ Não faça nada — o browser promove automaticamente |
| WAAPI com `filter`, `clip-path` | ✅ Não faça nada — suporte crescente nos browsers modernos |
| CSS Transition com hover ou evento JS | ⚠️ `will-change` pode ajudar se houver jank no primeiro frame |
| Animação contínua de longa duração em CSS | ⚠️ `will-change` no CSS estático pode ser útil |
| `requestAnimationFrame` + modificação direta de estilo | ⚠️ Avaliar com profiling — o browser não sabe que vai animar |
| Qualquer cenário sem problema de performance medido | ❌ Não use `will-change` — é otimização prematura |

---

## 4. A única exceção relevante com WAAPI

Há um cenário onde adicionar `will-change` ainda pode ter valor com WAAPI: quando a animação tem **duração zero ou delay zero** e o elemento é muito pesado visualmente. Nesse caso, o browser não tem tempo de fazer a promoção antes do primeiro frame.

Mas mesmo assim, a abordagem correta seria adicionar `will-change` via CSS estático (na regra da classe que o elemento sempre tem), não imperativamente via JavaScript antes de cada animação. O custo de memória constante é aceitável para elementos que animam com frequência.

```css
/* Aceitável para elementos que animam constantemente */
.modal-overlay {
  will-change: transform, opacity;
}
```

```js
// ❌ Desnecessário com WAAPI — o browser gerencia sozinho
element.style.willChange = 'transform';
element.animate([{ opacity: 0 }, { opacity: 1 }], 300);
element.style.willChange = 'auto'; // remover ao final
```

---

## 5. O que realmente importa para performance com WAAPI

O ganho de performance com WAAPI não vem de `will-change` — vem da **escolha das propriedades animadas**. As regras são bem estabelecidas:

`transform` e `opacity` pulam inteiramente as etapas de layout e paint, indo direto para a composição via GPU. Qualquer animação WAAPI nessas propriedades será hardware-accelerated automaticamente, independente de `will-change`.

`width`, `height`, `top`, `left`, `margin` disparam recálculo de layout a cada frame — são caras independente de qual API você usa. WAAPI não muda isso.

`filter`, `clip-path`, `background-color` ficam em uma zona intermediária: o suporte ao compositor está crescendo nos browsers modernos (Chrome e Firefox já tratam `filter` inteiramente no compositor), mas ainda deve ser validado com profiling em dispositivos reais.

---

## 6. Resumo executivo

Usar WAAPI dispensa o gerenciamento imperativo de `will-change`. Ao chamar `element.animate()`, você está usando a própria API de animação do browser — ele reconhece a intenção, promove a camada automaticamente e aplica aceleração de hardware para propriedades de composição.

Adicionar e remover `will-change` no entorno de cada `element.animate()` é trabalho desnecessário que não traz benefício e pode gerar overhead de memória se feito incorretamente.

A regra prática é:

> **Com WAAPI: não faça nada com `will-change`.** Foque em animar `transform` e `opacity`. Se houver problema de performance medido e o elemento animar com alta frequência, considere `will-change` em CSS estático — não via JavaScript imperativo.

---

*Elaborado com base em MDN Web Docs (`will-change`, Web Animations API Concepts), CSS-Tricks ("CSS Animations vs Web Animations API"), Motion Performance Guide, e Lisi Linhart ("Advantages of the Web Animations API").*
