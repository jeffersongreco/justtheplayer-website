# Memorando Técnico
**Assunto:** Uso de `$state.snapshot()` no Svelte 5 — quando é necessário e quando é regra  
**Contexto:** Leitura de propriedades aninhadas em objetos reativos (ex.: `animation.intent`)  
**Referência:** Documentação oficial Svelte 5 — `$state`, Runtime Warnings

---

## 1. O Problema: `$state` cria um Proxy, não um objeto comum

Quando um objeto é declarado com `$state` no Svelte 5, o resultado **não é o objeto original** — é um **Proxy reativo** que envolve o objeto:

```js
let animation = $state({ intent: 'enter', duration: 300 });
// `animation` agora é um Proxy, não o objeto literal original
```

Esse Proxy intercepta leituras e escritas em cada propriedade para que o Svelte possa rastrear dependências e disparar atualizações granulares na UI. Isso é o coração do sistema de reatividadede runes.

O problema surge quando esse Proxy é passado para código que **não espera um Proxy** — bibliotecas externas, APIs nativas do browser, funções de serialização, ou qualquer código que inspecione o objeto de forma não-padrão. Nesses contextos, o comportamento pode ser surpreendente: propriedades podem aparecer como `undefined`, clonagem pode falhar, e comparações de identidade sempre retornam `false`.

---

## 2. O que `$state.snapshot()` faz

A documentação oficial define com precisão:

> *"To take a static snapshot of a deeply reactive `$state` proxy, use `$state.snapshot`. This is handy when you want to pass some state to an external library or API that doesn't expect a proxy, such as `structuredClone`."*  
> — [svelte.dev/docs/svelte/$state](https://svelte.dev/docs/svelte/$state)

`$state.snapshot()` retorna uma **cópia estática e plana** do estado — um objeto JavaScript comum, sem rastros do sistema reativo. **Não é o objeto original** (a comparação `===` retorna `false`), mas sim um clone com os valores atuais no momento da chamada.

```js
let counter = $state({ count: 0 });

// ❌ Passa o Proxy — pode falhar em contextos externos
handleCounter(counter);

// ✅ Passa um objeto comum com os valores atuais
handleCounter($state.snapshot(counter));
```

---

## 3. Por que `animation.intent` retornava `undefined` sem o snapshot

O caso citado — leitura de `animation.intent` retornando `undefined` — é um sintoma clássico de **passagem de Proxy para um contexto que não sabe lidar com ele**.

Há dois cenários comuns que explicam esse comportamento:

**Cenário A — Código externo inspecionando o objeto de forma não-padrão**  
Algumas bibliotecas, ao receber um Proxy, tentam inspecionar suas propriedades por meios que não ativam os `get traps` do Proxy corretamente (ex.: via `Object.keys`, serialização, clonagem nativa). O resultado é que propriedades que existem no Proxy podem aparecer como `undefined` ou simplesmente não serem encontradas.

**Cenário B — Código rodando fora do contexto reativo do Svelte**  
Dentro de `$effect` ou do template, o Svelte mantém um contexto de rastreamento ativo. Fora desse contexto (em callbacks assíncronos, event listeners externos, funções de pacotes de terceiros), o Proxy ainda existe, mas certas leituras podem não se comportar como esperado dependendo de como o código externo percorre o objeto.

O `$state.snapshot()` resolve ambos os casos porque elimina o Proxy completamente, entregando um POJO (_Plain Old JavaScript Object_) com os valores no momento da chamada.

---

## 4. Regra ou gambiarra? — Resposta oficial

**É uma ferramenta com uso bem definido, não uma gambiarra.**

A documentação e os avisos de runtime do Svelte 5 são explícitos sobre isso. O próprio sistema de warnings do Svelte detecta quando um Proxy é passado inadvertidamente para `console.log` e recomenda ativamente o uso de `$state.snapshot()`:

> *"Your `console.method` contained `$state` proxies. Consider using `$inspect(...)` or `$state.snapshot(...)` instead."*  
> — [svelte.dev/docs/svelte/runtime-warnings](https://svelte.dev/docs/svelte/runtime-warnings)

No entanto, **não é uma regra que deve ser usada sempre**. O guia é simples:

| Contexto | Usar snapshot? |
|---|---|
| Leitura reativa no template ou `$effect` | ❌ Não — o Proxy funciona perfeitamente |
| Derivações com `$derived` | ❌ Não — o Proxy é o que torna a derivação reativa |
| Passagem para biblioteca externa | ✅ Sim — se a lib não espera Proxy |
| `structuredClone`, `JSON.stringify` em classes | ✅ Sim — o Proxy pode falhar |
| IndexedDB, Web Workers, serialização | ✅ Sim — APIs nativas não aceitam Proxy |
| `console.log` para debug | ✅ Recomendado (ou usar `$inspect`) |
| Comparação de identidade com `===` | ✅ Necessário — Proxy e objeto original são identidades diferentes |

---

## 5. Quando **não** usar `$state.snapshot()`

Usar `$state.snapshot()` dentro de contextos reativos **quebra a reatividade**:

```js
// ❌ ERRADO — o snapshot é estático, $derived nunca vai reatualizar
let intent = $derived($state.snapshot(animation).intent);

// ✅ CORRETO — lê diretamente do Proxy; reativo
let intent = $derived(animation.intent);
```

O snapshot congela os valores no momento da chamada. Se usado onde a reatividade é desejada, o sistema de atualização da UI deixa de funcionar.

---

## 6. Resumo executivo

O uso de `$state.snapshot()` no pacote **não foi uma gambiarra** — foi a solução correta para um problema estrutural do Svelte 5: objetos declarados com `$state` são Proxies, e Proxies não se comportam como objetos comuns em todos os contextos.

A regra prática é:

> **Use `$state.snapshot()` sempre que precisar passar estado reativo para fora do contexto reativo do Svelte** — seja para bibliotecas externas, APIs do browser, funções de serialização, ou qualquer código que não espere um Proxy.

> **Não use `$state.snapshot()` dentro de derivações, effects ou do template** — nesses contextos o Proxy é o mecanismo de reatividade e deve ser lido diretamente.

---

*Elaborado com base na documentação oficial do Svelte 5 (`svelte.dev/docs/svelte/$state`, `svelte.dev/docs/svelte/runtime-warnings`) e discussões abertas no repositório `sveltejs/svelte`.*
