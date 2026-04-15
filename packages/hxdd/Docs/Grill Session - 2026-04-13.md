# Grill Session — HXDD Design
**Date:** 2026-04-13
**Subject:** `packages/hxdd/Idea.md`

---

**Question 1 of N — Scope of HXDD**

HXDD is described from the author's perspective ("o autor descreve", "o agente faz"). But it's unclear whether this is a **solo methodology** (Greco uses it alone) or a **team methodology** (multiple people could run it).

This matters because:
- Solo → the grilling agent can assume full context of the author's domain
- Team → the grill must surface assumptions that the team may not share; documentation must be more explicit; the "shared understanding" goal changes shape

**My recommendation:** Solo first. Design it for one author + one agent. Team use is a future extension. This keeps the methodology lean and avoids over-engineering consensus mechanisms you don't need yet.

**Question:** Is HXDD intended as a solo methodology, or does it need to support multi-author or team scenarios from day one?

**Answer:** Mesmo em um time, somente uma pessoa irá interagir com o agente e a mediação do time será feita antes disso, para o agente não faz diferença quando ao processo. Mas, os documentos escritos devem seguir boas práticas de clareza, precisão, detalhamento que times requerem, considerando que mesmo em solo, o dev do futuro não tem memória perfeita e é, por isso, uma pessoa nova.

---

**Question 2 of N — Runtime vs. Build-time split**

Step 2 always produces two idea docs: `Idea - Product User.md` (runtime) and `Idea - Developer User.md` (build-time). But whether that split is always meaningful depends on what's being built.

For a self-contained product feature (e.g., a UI behavior that users interact with directly), there may be no external developer integrating anything — no "developer user" in the P0' sense. For a package/library (e.g., `movable`), the split is fundamental.

**My recommendation:** The split is conditional. If the raw idea has no build-time surface (no API, no integration point, no developer-facing interface), Step 2 only produces `Idea - Product User.md`. The agent should detect this and skip the developer doc rather than forcing an artificial developer perspective.

**Question:** Is the runtime/build-time split always present in HXDD, or should the methodology be conditional — producing `Idea - Developer User.md` only when the raw idea has a build-time surface?

**Answer:**
1. Esses passos são a nível de pacote (seja app, biblioteca, etc.) e em seu início, não são destinados a serem executados no início de uma feature desse pacote.
2. O split é sim condicional, mas o que pode acontecer é não ter runtime, não há caso em que não há build-time porque o próprio autor já é um usuário desenvolvedor (ele conta).

---

**Question 3 of N — What counts as "behavioral" for build-time?**

The grilling notes say scope is "behavioral — what and when, not technical how." For runtime this is clear: user actions, states, transitions, feedback. But for the developer user at build-time, the "what" bleeds directly into technical shape — API names, parameter order, import paths, configuration ergonomics.

Example: "what does the developer do to configure the package?" leads immediately to "does it take an options object or positional args?" That's behavioral from the developer's perspective (their interaction with the surface) but looks technical.

The P0' principle treats this correctly — build-time surface is still a "surface of use" and the developer's interaction with it has the same normative weight. But it means "behavioral" for a developer user inherently includes API ergonomics, naming, and shape — things that feel technical.

**My recommendation:** Keep the scope as "what the developer does, not how the implementation achieves it." So API shape (parameters, naming, call sequence) is in scope — it's the developer's experience. Internal implementation details (data structures, algorithms, module internals) are out of scope. The line is: "can the developer user observe or interact with this?" If yes, it's behavioral.

**Question:** For the build-time grilling, where exactly does "behavioral" end? Is API shape (naming, parameters, configuration ergonomics) in scope, or is that already "technical how" and therefore deferred to Step 4?

**Answer:** É o comportamento que deve ser possibilitado pela implementação. A especificação terá o necessário para embasar a decisão da forma da API, do naming, dos parâmetros. e.g., o modelo mental do que o dev que baseará o naming para evitar a necessidade de "tradução mental" entre o idioma da ação/comportamento esperados e o idioma da API.

---

**Question 4 of N — Step 5 (unnamed)**

Step 5 is described as "the specification that will be the source of truth for tests and implementations." Every prior step feeds into it. But it's unnamed and undefined — no format, no structure, no examples.

This is the most critical gap in the methodology, because:
- Steps 3 and 4 are only meaningful relative to what Step 5 consumes
- The testing and implementation work flows directly from Step 5
- Its format determines how much of the prior work is usable vs. needs transformation

The behavioral spec (Step 3) + technical constraints (Step 4) presumably combine in Step 5, but how? Options:
- **A.** Step 5 annotates the behavioral spec with constraints ("this behavior, constrained by X, becomes Y")
- **B.** Step 5 is a separate document that synthesizes both into implementation-ready rules
- **C.** Step 5 is structured as acceptance criteria or test cases derived from the behavioral spec within the constraints
- **D.** Something else

**My recommendation:** Option B — a synthesis document structured as implementation-ready behavioral rules, where each rule either survives from the ideal spec unchanged or carries a visible "constrained by X" annotation showing the delta from ideal. This makes the P0' principle operational: the delta between "best" and "best possible" is explicit and traceable.

**Question:** What is Step 5? What does it look like, what does it produce, and how does it relate to the behavioral spec (Step 3) and constraints (Step 4)?

**Answer:** A anotação do delta deve estar no Passo 4. O documento do Passo 5 deve ser limpo, contendo só o necessário para guiar a escrita dos testes e depois as implementações, e contendo de forma que serve como "regras", mas ainda escrito e estruturado em seções no mesmo padrão do Passo 3 (não usamos PRD ou Specs tradicionais, usamos o padrão criado para o Passo 3).

---

**Question 5 of N — Does Step 3 produce one document or two?**

Step 2 produces two idea docs — one per user type (runtime + build-time). But Step 3 ("User-story maps / Behavioral Specification") references only the movable and attention-requester examples, which are both runtime-facing (end-user drag behavior, attention states).

For a package that has both a runtime surface (end-user behavior) and a build-time surface (developer integration behavior), Step 3 could produce:
- **A.** One unified behavioral spec covering both user types
- **B.** Two behavioral specs — one per user type, mirroring the Step 2 split
- **C.** Only the runtime behavioral spec — the developer user's behavioral grounding from Step 2 feeds directly into later steps without its own story-map format

**My recommendation:** Option B — one spec per user type, mirroring the Step 2 split. The runtime spec covers user actions and states. The developer spec covers developer workflows: configure, integrate, extend, debug. Both follow the same format. This keeps each document focused on a single user and makes Step 5 a clean synthesis of two constrained specs.

**Question:** Does Step 3 produce one behavioral spec or one per user type? And if two, do they later merge into a single Step 5 document or remain separate?

**Answer (part 1):** B

**Follow-up:** And the second half — in Step 5, do those two behavioral specs stay separate (two final docs, one per user) or merge into one?

**Answer (part 2):** 2 arquivos separados

---

**Question 6 of N — Step 3 format: what's the "robust pattern"?**

The idea says to take the NNGroup story mapping logic and combine it with the P0' principle goal to create a "robust pattern" for writing behavioral specs. But the current examples (`movable`, `attention-requester`) already have a format — numbered sections, behavioral rules in prose, state-driven structure.

The NNGroup story map has a specific structure:
- **Backbone:** the user's high-level activities in narrative sequence
- **Walking skeleton:** the minimal path through the full experience
- **Tasks:** specific actions under each activity
- **Prioritization slices:** what goes in each release

The tension: story maps are designed for backlog planning. The behavioral spec as used in `movable` looks more like a state machine described in plain English — idle state, lifecycle, boundary behavior, etc. These aren't the same thing.

**My recommendation:** Adopt the story map's **backbone** concept (user activities in narrative sequence as the organizing structure) but not its backlog/slicing machinery. The behavioral spec sections become: one section per user activity in the order the user performs them. Under each, the specific behaviors and states. This enforces P0' structurally — you're forced to organize around what the user does, not around system components or implementation concerns.

**Question:** What exactly should be borrowed from the NNGroup story mapping approach? Is it the narrative sequence structure (backbone), the task decomposition, the prioritization slices, or something else? And how explicitly should the resulting format differ from the existing `movable`/`attention-requester` examples?

**Answer:** Trazer o conceito do mapa que organiza as coisas baseado do que o usuário faz e não baseado nos componentes do sistema. A tensão não existe realmente, a diferença é que um é do ponto de vista do usuário (recebendo input do sistema) e o nosso é do ponto de vista do sistema (recebendo input do usuário). Não trazemos Prioritization slices, aqui é só definição de produto, não definição de projeto.

---

**Question 7 of N — Who authors Steps 3–5?**

Steps 1 and 2 are clearly agent-driven: the agent writes the raw idea verbatim, then conducts the grill and documents the fuller picture. But Steps 3, 4, and 5 are less clear.

Options per step:
- **Agent drafts, author reviews** — agent produces a full draft from the grilling output; author corrects/approves
- **Author drafts, agent structures/validates** — author writes the content; agent enforces the format and flags P0' violations
- **Collaborative** — agent proposes, author iterates

This matters especially for Step 3, because writing a good behavioral spec requires judgment about what behaviors to surface and how to organize them. If the agent drafts it, it needs enough behavioral grounding from the Step 2 grill to do this faithfully. If the author drafts it, the format constraint is the main contribution of the methodology.

**My recommendation:** Agent drafts all three steps. The grill in Step 2 exists precisely to give the agent enough grounding to draft faithfully. Having the author draft would make the methodology just a "format guide" rather than a structured thinking aid. The agent's drafts also externalize the agent's understanding, which the author can then correct — surfacing misalignments early.

**Question:** In Steps 3, 4, and 5, who produces the content — the agent, the author, or is it collaborative?

**Answer:** Sua recomendação. (Agent drafts all three. Author reviews and corrects.)

---

**Question 8 of N — Step 4 structure and delta annotation format**

Step 4 carries the delta between ideal (Step 3) and constrained (Step 5). But what does that annotation look like in practice?

Two distinct things belong in Step 4:
1. **Constraints themselves** — platform, framework, real (outside author's control) vs. declared (author chose and justified)
2. **Delta annotations** — for each constraint, what specific Step 3 behaviors it affects and how

The delta is the P0'-critical piece: it's where the author is forced to see what was sacrificed and why. Without explicit cross-reference to Step 3 behaviors, it's just a list of constraints with no connection to experience impact.

**My recommendation:** Step 4 has two sections. First: the constraint inventory (real vs. declared, with justification for declared ones). Second: impact mapping — for each constraint, which Step 3 behaviors it modifies, what the modified behavior becomes, and the reason (pointing back to the specific constraint). Step 5 then contains only the modified behaviors — the delta disappears from view but is traceable through Step 4.

**Question:** How should Step 4 structure the delta annotations? Should they cross-reference Step 3 by section? Should the format be prose, table, or something else? And should constraints that don't affect any Step 3 behavior still be recorded?

**Answer:** Sua recomendação. (Confirmed: two-section structure — constraint inventory + impact mapping with cross-references.)

---

**Question 9 of N — What is `packages/hxdd`?**

The methodology lives in `packages/hxdd`. But what does this package actually produce?

Options:
- **A.** Documentation only — a written spec of the methodology, used as reference when manually running the process
- **B.** A Claude skill — a `/hxdd` slash command that implements the steps programmatically
- **C.** Both — documentation as the canonical definition, plus a skill that executes it
- **D.** A template — a folder structure with stub documents that the author fills in, plus written guides per step

**My recommendation:** C — documentation as the canonical spec of the methodology, plus a skill that executes each step. The documentation is the ground truth (reviewable, auditable, independent of Claude's behavior). The skill operationalizes it. This mirrors how the best tools work: the spec and the implementation are separate artifacts.

**Question:** What does `packages/hxdd` produce — docs, a skill, both, or something else?

**Answer:** C. Mas não uma Skill, uma estrutura completa de harness com skills especialistas nas etapas/tarefas específicas, agentes onde couber, etc.

---

**Question 10 of N — File naming and location conventions**

The harness needs to know where to read and write files at each step. The methodology produces up to 8 documents (2 per user type × steps 2, 3, 5, plus step 1 and step 4). These need canonical paths.

Options for location:
- **A.** `Docs/` inside each package that runs HXDD — documents live alongside the package they describe
- **B.** A top-level `hxdd/` folder per package — isolated from other docs
- **C.** Configurable — the harness takes a target path as input

**My recommendation for location:** A — `Docs/` inside the target package. This keeps specs next to what they describe, consistent with how `movable/docs/` and `attention-requester/docs/` already work.

**My recommendation for naming:**
- `Docs/Raw Idea.md`
- `Docs/Idea - Product User.md` / `Docs/Idea - Developer User.md`
- `Docs/Behavioral Spec - Product User.md` / `Docs/Behavioral Spec - Developer User.md`
- `Docs/Technical Constraints.md`
- `Docs/Spec - Product User.md` / `Docs/Spec - Developer User.md`

**Question:** Where do HXDD documents live within a package, and what are the canonical file names?

**Answer:** Opção A. Mas não coloque os nomes como definidos ainda. (Location confirmed: `Docs/`. Names deferred.)

---

**Question 11 of N — How does the grill end?**

The Step 2 grill is described as interviewing "until reaching shared understanding." But there's no explicit termination condition. Without one, the agent either stops too early (misses gaps) or grills indefinitely (becomes friction).

The grill has two phases (runtime, then build-time). Each needs a stopping point.

Options for termination:
- **A.** Author signals explicitly ("I'm satisfied" / "continue to the next step")
- **B.** Agent judges when it has enough to draft the Idea doc faithfully, then proposes to stop
- **C.** Agent runs through a fixed set of concern categories (intent, scope, edge cases, success criteria, blind spots) and stops when all are resolved
- **D.** Hybrid — agent runs through concern categories (C), but author can extend or cut short

**My recommendation:** D. The agent has a mental checklist of concern categories derived from the user type (what they need, when, edge cases, failure states, success criteria, known blind spots in this type of product). It works through these one question at a time. When it judges all categories resolved, it says so explicitly and asks to proceed. Author can say "continue" to push further or "proceed" to advance.

**Question:** What's the termination condition for the Step 2 grill — author-controlled, agent-controlled, or hybrid?

**Answer:** Sua recomendação. Mas o agente deve reconhecer se ele já tem o suficiente ou não, para dizer ao autor se o corte está sendo solicitado cedo demais ou se estava já em perguntas de ajuste fino, etc. Ainda assim o agente deve induzir o autor a completar o grill até todas as categorias estarem resolvidas. A interrupção do autor deve ser caso para a situação de alucinação, redundância, ..., erro do agente e somente esse caso.

---

**Question 12 of N — Harness entry point and orchestration**

The harness has multiple specialist skills. But how does a user start HXDD and advance through steps?

Options:
- **A.** Single entry skill `/hxdd` that orchestrates everything, advancing steps internally, pausing for author input between steps
- **B.** Per-step skills — user manually invokes `/hxdd-step1`, `/hxdd-step2`, etc.
- **C.** A top-level orchestrator skill that reads current state from existing docs and resumes from where the process left off — "smart resume"
- **D.** Per-step skills invoked by a top-level skill — the top-level entry routes to the correct step skill automatically based on what docs already exist

**My recommendation:** D. A single entry point (`/hxdd`) reads the current state of `Docs/` to determine which step to run next, then delegates to the appropriate specialist skill. This means the author never has to remember where they are — they just invoke `/hxdd` and the harness picks up from the right place. Each specialist skill runs its step, writes its output to `Docs/`, and returns. The top-level skill then pauses and waits for the next invocation.

**Question:** How does the author interact with the harness — single entry point, per-step invocation, or something else?

**Answer:** Sua recomendação. (D confirmed.)

---

**Question 13 of N — Document language**

The `Idea.md` for HXDD is written in Portuguese. The existing behavioral specs (`movable`, `attention-requester`) are in English. The global `CLAUDE.md` says: match the language of files being edited, but write code, commits, and docs in English — unless project-level instructions say otherwise.

HXDD documents will be read by the author (you), future-self, and potentially team members. The content is behavioral and normative — not code.

**My recommendation:** English. It keeps HXDD-generated documents consistent with the existing `movable` and `attention-requester` behavioral specs, avoids a split convention in the same `docs/` folder, and respects the global preference. The harness itself (skills, agents) would also be in English.

**Question:** Should the documents HXDD produces be written in English or Portuguese?

**Answer:** Inglês por padrão, configurável pelo autor.

---

**Question 14 of N — How is Step 5 derived from Step 3?**

Step 5 is the clean final spec — same format as Step 3, but reflecting the constraints from Step 4. The question is how the agent produces it.

Two approaches:
- **A.** Derive: agent takes Step 3, applies each delta from Step 4, and outputs the modified version. Unchanged behaviors carry over directly. Only constrained behaviors are rewritten.
- **B.** Rewrite: agent drafts Step 5 from scratch using the grilling output + constraints as inputs, not by editing Step 3.

**My recommendation:** A — derive from Step 3. This keeps the process traceable (a reviewer can compare Step 3 and Step 5 to see exactly what changed), reduces agent hallucination risk (changes are bounded to what Step 4 explicitly annotates), and respects the principle that Step 5 should be the constrained version of the ideal — not a new document.

Additionally, if there are no constraints affecting a user track, Step 5 for that track is identical to Step 3. The harness should detect this case and say so explicitly rather than producing a redundant copy.

**Question:** Is Step 5 derived from Step 3 (apply Step 4 deltas) or independently rewritten? And what happens when no constraints affect a user track?

**Answer:** A

---

**Question 15 of N — Harness state detection**

When `/hxdd` is invoked, it needs to determine which step to run next. The most natural mechanism: check which files exist in `Docs/` and infer state from presence/absence.

But there's an edge case: what if the author has partially completed a step — e.g., Step 3 only has the runtime behavioral spec but not the build-time one? The harness must distinguish "step completed" from "step partially completed."

Options:
- **A.** Presence of specific files signals step completion — each step has a defined set of required output files; the harness checks all are present before advancing
- **B.** A manifest file (`Docs/hxdd.json` or similar) tracks explicit step status — the harness writes a record after each step completes
- **C.** The harness inspects file content for completeness signals, not just presence

**My recommendation:** B — a lightweight manifest file. File presence alone can't distinguish "authored by HXDD" from "manually created," and content inspection is fragile. A manifest is explicit, inspectable, and easy for the harness to write and read. It also stores the language configuration and any other per-package HXDD settings.

**Question:** How should `/hxdd` detect current state — file presence, a manifest, content inspection, or something else?

**Answer:** B. E o agente pergunta para o autor se pode marcar o Passo como concluído, ou se há ainda alguma insegurança.

---

**Question 16 of N — Track sequencing within steps**

Steps 2, 3, and 5 each produce two documents (one per user track: runtime and build-time). The question is whether the harness handles them sequentially or simultaneously within a step.

For Step 2 (grill): the two grills must be sequential — grilling runtime and build-time simultaneously would produce confused context. The question is which comes first.

For Steps 3 and 5 (agent drafts): the agent could draft both documents in sequence within a single step invocation, or treat each track as its own sub-step with separate sign-offs.

**My recommendation:**
- **Step 2:** Runtime first (if it exists), then build-time. Runtime is the most visible surface and tends to reveal the core purpose; build-time grilling benefits from that clarity.
- **Steps 3 and 5:** Each track is a separate sub-step with its own sign-off. The author reviews and approves the runtime spec before the agent drafts the build-time spec. This prevents the second draft from inheriting unreviewed assumptions from the first.

**Question:** Within a step that produces two documents, does the harness handle tracks sequentially (runtime → build-time) with per-track sign-offs, or does it produce both in one pass?

**Answer:** Por passo, primeiro run, depois build, então avança o Passo e sempre primeiro run. (Runtime first within each step; sign-off is per step after both tracks are done.)

---

**Question 17 of N — Step 3 internal section structure**

The behavioral spec is organized by user activities (not system components). But what goes inside each section?

Looking at `movable`: each section covers a user activity (e.g., "Drag Lifecycle") and contains:
- Subsections for phases of that activity (Begin, Move, End)
- Bulleted behavioral rules — what happens when the user does X

This is already close to the right shape. But "user activity" sections can vary: some activities are momentary (a single action), some are lifecycle phases, some are states the user navigates between.

**My recommendation:** Each section follows this structure:
1. **Section title** = the user activity (named from the user's perspective, not the system's)
2. **Subsections** (optional) = phases or sub-activities, only when the activity has distinct internal stages
3. **Behavioral rules** = bulleted prose statements of the form "When the user does X, the system does Y" — always causally ordered (user action → system response), always observable, never referencing internal implementation

The key constraint: every rule must be expressible as a test. If it can't be tested (observed from the outside), it doesn't belong in the behavioral spec.

**Question:** What should the internal structure of each behavioral spec section look like — and is "expressible as a test" a valid quality criterion for behavioral rules?

**Answer:** Sobre a estrutura, se inspirar no NNGroup story mapping. Sobre "expressible as a test", sim, é uma regra e teste deve ser entendido tanto como testes automatizados quanto QA — o Passo futuro de testes irá definir como cada item pode ser testado, mas todos devem ser testáveis de alguma forma.

---

**Question 18 of N — Is there a Step 6?**

You mentioned "o Passo futuro de testes" — a future testing step that will define how each behavioral item is tested. The original `Idea.md` has 5 steps, with Step 5 being the final spec that "tests and implementations will follow."

This implies at least one more step: defining how each behavioral rule in Step 5 is tested. Possibly also an implementation step.

Options:
- **A.** HXDD ends at Step 5. Testing and implementation are outside HXDD — they consume the Step 5 spec but are separate processes.
- **B.** HXDD has additional steps (6 = test specification, 7 = implementation spec), making it a complete development methodology end-to-end.
- **C.** HXDD ends at Step 5, but the harness includes companion tools (test spec generator, implementation guide) that aren't steps in the methodology proper.

**My recommendation:** B — complete end-to-end. If Step 5 is the "source of truth for tests and implementations," then the methodology should include the steps that actually produce those tests and implementations. Stopping at Step 5 leaves the hardest translation work (spec → tests → code) to the author without structured support.

**Question:** Does HXDD end at Step 5, or does it extend into testing and implementation specification?

**Answer:** Será end-to-end. Mas o escopo agora são só os 5 Passos atuais.

---

**Question 19 of N — Step revision and re-running**

Once the harness has advanced past a step and later steps are generated, the author may need to go back — e.g., the Step 3 behavioral spec reveals a gap that requires re-grilling in Step 2, or Step 4 constraints invalidate a large portion of Step 3 and the author wants to re-examine the ideal spec.

This is the lifecycle question: can steps be re-run, and if so, what happens to downstream documents?

Options:
- **A.** Steps are immutable once signed off. To revise, the author manually edits files and re-runs from that step forward.
- **B.** The harness supports explicit "restart from step N" — it marks downstream steps as invalidated in the manifest and re-runs from N.
- **C.** No formal re-run mechanism — the manifest is updated manually, and the harness resumes from wherever the manifest says.

**My recommendation:** B — explicit restart from step N. When the author triggers a restart, the harness marks downstream steps as `invalidated` in the manifest, archives the previous output (so nothing is lost), and re-runs from the specified step. This preserves history, makes invalidation explicit, and prevents stale downstream docs from being used as if they were current.

**Question:** Should the harness support formal step re-running with downstream invalidation, or is manual file editing + manifest update sufficient?

**Answer:** Opção B. E com inteligência de, por exemplo, num re-grill não refazer todas as perguntas, somente o necessário. Deve ser um processo de atualização (downstream) a partir de um ponto, não um processo de refação total.

---

**Question 20 of N — Grill concern categories**

The grill in Step 2 terminates when all concern categories are resolved. But what are those categories? Without defining them, the agent can't know when it's done or when an author's early cutoff is legitimate vs. premature.

For the **runtime (product user) grill**, proposed categories:
1. Core intent — what the user is trying to accomplish
2. Triggering conditions — when and how the user arrives at this interaction
3. Success states — what the user experiences when things go well
4. Failure/edge states — what the user experiences when things go wrong or are unexpected
5. Mental model — what the user expects to be true about the product
6. Blind spots — what the user might need that the author hasn't considered yet

For the **build-time (developer user) grill**, proposed categories:
1. Integration intent — what the developer is trying to do with this package
2. Workflow — the sequence of steps the developer takes to configure, use, and extend it
3. Mental model — what concepts the developer needs to understand to use it correctly
4. Failure/debugging — what the developer does when something doesn't work
5. Expectations — what behaviors the developer assumes the package provides
6. Blind spots — developer pain points the author hasn't considered yet

**Question:** Are these the right concern categories for each user type, or should they be different? Should they be fixed per user type, or adaptable per package domain?

**Answer:** O agente deve saber categorias universais de boas práticas de engenharia e experiência do usuário e do desenvolvedor, mas definidas categoricamente, não especificamente. Então propor as categorias com descrições mais específicas ao domínio do pacote e mostrar para o Autor antes de começar o grill, para ele validar.

---

**Question 21 of N — How does the author provide the Raw Idea?**

Step 1 is described as the author describing what they intend to build. But the mechanism isn't defined: does the author write a file first and then invoke `/hxdd`? Or does `/hxdd` prompt the author inline and capture the description?

Options:
- **A.** Author pre-writes the raw idea in a file (free-form, any location), then passes it to `/hxdd` which archives it as `Docs/Raw Idea.md`
- **B.** `/hxdd` prompts the author to describe the idea inline in the conversation, then writes the response verbatim to `Docs/Raw Idea.md`
- **C.** Both — `/hxdd` checks if a raw idea file already exists and uses it; if not, it prompts the author

**My recommendation:** C — check first, prompt if absent. This handles the common case where the author already has notes or a rough writeup. The author can prepare in advance or describe in the moment. The harness adapts to both workflows without forcing either.

**Question:** How does the author provide the raw idea — pre-written file, inline conversation, or whichever exists?

**Answer:** C. E se o autor já chamar `/hxdd <descrição da ideia>` não procura o arquivo. (Input priority: CLI arg → existing file → prompt inline.)

---

**Question 22 of N — Runtime track detection**

Build-time is always present. Runtime is conditional. The harness needs to determine, for a given package, whether a runtime track exists. Two options:

- **A.** Agent infers from the Raw Idea — if the description mentions end-users, non-developer interaction, or a product surface, the runtime track is active. Agent states its inference explicitly and asks the author to confirm.
- **B.** Author declares explicitly — the harness always asks "does this package have an end-user-facing surface?" as the first question before grilling.

**My recommendation:** A — agent infers and confirms. The agent should be able to identify runtime signals in the raw idea ("users will see", "the player will", "when someone visits") and state its interpretation. Asking as a blanket first question before grilling is friction for experienced authors; inference with explicit confirmation is smarter.

**Question:** Does the harness infer runtime track existence from the raw idea, or does the author declare it explicitly?

**Answer:** A. Mas sabendo que uma biblioteca de componentes tem runtime, mesmo o pacote sendo usado por outros devs, o "produto" será rodado. (Runtime = the package runs and is experienced by end-users, even if the immediate consumer is a developer. Component libraries have runtime.)

---

**Question 23 of N — Settings and config mechanism**

Language is configurable per package. Other settings may emerge (e.g., which tracks are active). The manifest (`hxdd.json`) is already the state file — settings could live there, or in a separate config.

**My recommendation:** Settings live in `hxdd.json` alongside step state. The manifest is both the state file and the config. The author sets language at first invocation (or `/hxdd` asks if absent), stored in the manifest. The harness reads it on every invocation. This keeps a single source of truth per package.

One question I haven't asked but have a view on: at a high level, do you see any important design decisions for HXDD that I haven't raised in this grill — anything you were expecting me to challenge you on that I didn't?

**Answer:** Arquivos separados. (`hxdd.config.json` for settings, `hxdd.state.json` for step state — separate files.)

---

**Question 24 of N — Step 5 when no constraints apply**

If Step 4 finds that no technical constraints affect a given user track, Step 5 for that track would be identical to Step 3. Two options:

- **A.** Step 5 is still generated as a separate file, identical to Step 3 — keeping the pipeline consistent regardless of constraints
- **B.** The harness detects the identity, skips generation, and records in the manifest that Step 5 for that track = Step 3 (avoids redundant files)

**My recommendation:** B — skip generation, record the equivalence. Having two identical files in `Docs/` is confusing: a future reader can't tell if they're intentionally identical or if one failed to update. A manifest note is explicit: "Step 5 (Product User) = Step 3 (Product User) — no constraints applied." The harness still marks the step complete.

**Question:** When Step 5 would be identical to Step 3, should the harness generate the file anyway or skip it and record the equivalence in the manifest?

**Answer:** Registrar a equivalência e gerar o arquivo. A geração não deve gastar tokens escrevendo, deve ser um comando bash de cópia e renomeação.

---

## Decisions Locked

1. **Scope:** Package-level inception, not feature-level. Future steps (testing, implementation) out of scope for now — but HXDD will be end-to-end.
2. **User tracks:** Build-time always present (author = developer user). Runtime conditional — but component libraries have runtime even if the immediate consumer is a developer.
3. **"Behavioral" for build-time:** Actions and mental model of the developer — the spec grounds API/naming decisions, not the other way around. No API shape in the behavioral spec itself.
4. **Track ordering within each step:** Runtime first → build-time. Sign-off per step (not per track) after both tracks are done.
5. **Runtime track detection:** Agent infers from Raw Idea, states inference explicitly, author confirms.
6. **Grill design:** Agent-driven. Universal concern categories (UX/DX best practices) → domain-specific instantiation → author validates → grill begins. Agent pushes back on early cuts. Author interruption reserved for agent errors only.
7. **Step 3 format:** Two specs (one per user type). Sections organized by user activities (NNGroup backbone concept). All behavioral rules must be testable (automated or QA).
8. **Step 4 structure:** Two sections — constraint inventory (real vs. declared, with justification) + impact mapping (per constraint: which Step 3 behaviors affected, how modified, why).
9. **Step 5 derivation:** Derived from Step 3 via Step 4 deltas. Clean — no delta commentary. Same format as Step 3. If no constraints apply: `cp` from Step 3 + record equivalence in manifest.
10. **Authorship:** Agent drafts Steps 3, 4, 5. Author reviews and corrects.
11. **Harness architecture:** D model — single `/hxdd` entry, reads `hxdd.state.json`, routes to appropriate specialist skill. Full harness with specialist skills per step/task, agents where appropriate.
12. **State and config:** `hxdd.state.json` (step state, manifest) and `hxdd.config.json` (language and other settings) — separate files.
13. **Sign-off:** Per step. Agent asks author to confirm before marking step complete in manifest.
14. **Re-running:** Explicit restart from step N. Delta-aware smart update — only affected downstream content is updated, not total redo. Previous output archived.
15. **Language:** English by default, configurable in `hxdd.config.json`.
16. **Documents location:** `Docs/` inside the target package. File names deferred.
17. **Raw idea input:** Priority — CLI arg to `/hxdd` → existing file in `Docs/` → inline prompt.
18. **Step 5 = Step 3 edge case:** Bash `cp` + rename. Record equivalence in `hxdd.state.json`. No LLM token spend.
