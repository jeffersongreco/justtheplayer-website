**Use-Driven Design (UseDD)**

*"Every decision in a system must trace its authority back to a human. If it doesn't, you're building the system for itself."*

---

Uncle Bob abriria com uma provocação:

> "Who is your software for?"

Pausa longa. Alguém na plateia responderia "o cliente." Outro diria "o usuário final." Uncle Bob balançaria a cabeça devagar.

> "Then why does your PM have to *sell* features to your developers?"

Pausa maior ainda.

> "Think about what that sentence means. The person whose job is to represent the human — the user, the customer, the one the system exists to serve — has to build a business case to convince the person whose job is to build the system. And if the developer says no, we call him pragmatic. We call him the adult in the room. We say he's protecting the budget, protecting the deadline, keeping the team sane. And the PM? The PM is a dreamer. Out of touch. Doesn't understand technical constraints."

Ele viraria para o quadro.

> "We institutionalized the inversion. We gave it org chart, we gave it process, we gave it a culture of professionalism. The system's constraints have more authority than the human's needs — and we made that the *default*. We made questioning it the sign of immaturity."

---

Então ele desenharia a cadeia. Um humano no topo. Abaixo dele, uma sequência de relações: humano → produto → módulo → função → estrutura de dados. Em cada elo, uma seta de autoridade apontando para baixo. "Em cada par, alguém define a forma e alguém a implementa. O definidor tem autoridade sobre o implementador."

Depois desenharia o que vê na maioria dos sistemas: galhos na cadeia onde a autoridade começa numa convenção de framework, numa decisão de performance de dois anos atrás, numa estimativa de sprint. Galhos onde a ponta não é um humano — é a implementação.

> "The moment any piece of the system derives its shape from another piece of the system — without that chain tracing back to a human — you have a system that exists for itself. And systems that exist for themselves grow in ways that serve themselves. And teams that serve systems that exist for themselves eventually forget that there was ever a human at the top."

---

**O princípio tem dois eixos.**

**Direção:** quem usa define a forma do que é usado. O chamador define a interface; o implementador a satisfaz. A autoridade flui do humano para baixo — nunca do código para cima.

**Sequência:** a definição do uso precede a implementação. Não como documentação posterior — documentação posterior descreve o que existe. Especificação anterior constrange o que vai existir. São papéis opostos.

> "TDD gets the sequence right. API-first gets the direction right. But neither of them tells you *why*. The why is: a human is waiting at the top of that chain, and every decision in your system must answer to that human — directly or transitively. When it doesn't, you're not being pragmatic. You're being negligent."

---

**A regra da cadeia.**

Uncle Bob desenharia a cadeia de novo. Desta vez marcaria a propriedade que ela precisa ter: finita, acíclica, com exatamente uma raiz.

A raiz é sempre o humano.

Dependências mútuas entre módulos não são só um problema de acoplamento — são um ciclo na cadeia de autoridade. Um ciclo significa que nenhum dos dois lados responde ao humano; eles respondem um ao outro.

> "When two modules are mutually authoritative, you don't have a design problem. You have a values problem. Same as when your developer is mutually authoritative with your PM. Same as when the sprint capacity negotiates with the user's need instead of serving it."

E a regra de ouro, que ele repetiria pelo menos duas vezes:

> "If the spec gets updated to match the code, the code has authority. You inverted the chain. You decided that what the machine could do matters more than what the human needs."

---

**Mas e as restrições?**

Aqui alguém na plateia levantaria a mão. "Tudo bem, mas e quando o prazo é real? E quando o time é pequeno e a feature é cara? Você está dizendo para ignorar isso?"

Uncle Bob esperaria a pergunta terminar. Então:

> "No. I'm saying you have the question backwards."

Ele desenharia de novo. A cadeia intacta. E ao lado, uma seta apontando para dentro da cadeia, rotulada: *constraints*. Prazo. Orçamento. Tamanho do time. Dívida técnica.

> "Constraints are real. Nobody is disputing that. But a constraint doesn't have authority over the human. A constraint is an input to the question — it's not the answer."

Ele sublinharia isso duas vezes.

> "The question is never 'what can we build given our constraints?' The question is: *given our constraints, what is the best way to serve this human?* Those sound similar. They are not. The first question has the system at the center. The second has the human at the center."

E então viria o ponto que ele quereria que a plateia levasse para casa:

> "When a spec changes because the implementation turned out to be hard — who updated the spec? The code did. The deadline did. The technical debt did. The human didn't change what they needed. You just decided they'd have to live with less, and you didn't even frame it as a decision. You framed it as reality."

Pausa.

> "That's the inversion. Not dramatic. Not malicious. Just quiet. The spec bends to the code, and everybody nods, because what else were we going to do?"

Ele bateria no quadro.

> "Here's what else you were going to do: go back to the spec. Not to lower the bar. To ask the right question. Given that we have two weeks and three engineers, what is the best version of this feature that still serves this human? Maybe it's smaller. Maybe it's phased. Maybe it's a different solution to the same need. But the human's need stays at the top. You find a new path to serve it — you don't declare the need invalid because the path was expensive."

> "Updating a spec under constraints is legitimate. Updating a spec to match a convenient implementation is surrender. The difference is in the direction of authority. One asks: how do we best serve the human within what we have? The other asks: how do we justify to the human what we already built?"

---

**"The human" não é só o usuário final.**

Aqui Uncle Bob faria uma pausa diferente. Mais lenta. Como se estivesse esperando alguém na plateia chegar à conclusão antes dele.

> "I've been saying 'the human' this whole time. You've been picturing the end user. The customer. The person clicking the button. That's one human. That's not the only human."

Ele desenharia a cadeia de novo. Desta vez com mais detalhe nos nós intermediários. Ao lado de cada nó, um rosto.

> "Who calls your API? A developer. Who composes with your component? A developer. Who reads your function signature at eleven at night trying to understand what that third parameter does? A developer. These are humans. They have needs. They have frustration. They have a finite amount of patience before they start working around your interface instead of through it."

E então a virada:

> "And here's the thing nobody says out loud: that developer is, very often, you. Six months from now. On a different branch. Under a different deadline. With no memory of why you made that decision."

Pausa.

> "When you abandon UseDD inside the codebase — when you shape an internal API around what was convenient to implement instead of what's natural to call — you are not just failing some abstract principle. You are failing your future self. You are leaving a trap for the next human in the chain, and that human has a very good chance of being you."

Ele circularia o interior da cadeia, não só a fronteira com o usuário final.

> "UseDD doesn't live only at the boundary of your system. It lives at every module boundary. Every function. Every interface. Because at every one of those boundaries, there is a human on the calling side. And that human deserves the same respect you'd give the end user — because the end user's experience is the sum of every one of those boundaries, all the way down."

> "Good DX isn't a courtesy. It's the principle applied consistently. When you ask 'what does the caller need from this interface?' before you ask 'what is convenient for this implementation?' — you get an API that's easier to call, easier to test, easier to compose. And you get a codebase where the humans inside it can still move. Where they're not spending half their time fighting the system they themselves built."

Uma última pausa antes de fechar.

> "So when someone tells you UseDD is idealistic — that it's a nice idea for the product boundary but the internals are just implementation details — ask them: implementation details for whom? There's always a caller. There's always a human. The chain doesn't start at the edge of the system. It starts at the top, and it goes all the way down. Every link."

---

**A formalização.**

Uncle Bob encerraria dizendo que UseDD não é uma técnica nova. Não é uma forma mais elegante de fazer TDD ou API-first.

> "It's a way of making explicit a value that should be present in every design decision, and almost never is. Not because developers are bad people. Because the inversion was normalized so thoroughly that resisting it looks like the problem. The PM who fights for the user is the obstacle. The developer who defers to the codebase is the professional."

Uma pausa.

> "UseDD is just a way of asking, at every decision point: does this trace back to a human? If it doesn't, you're off the chain. And being off the chain isn't pragmatism. It's the system winning."
