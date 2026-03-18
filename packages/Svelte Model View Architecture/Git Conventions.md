# Git Conventions (§15)

> Parte da [Svelte Model View Architecture](Architecture.md).

---

## Branches

| Branch | Propósito | Merge de | Merge para |
|--------|-----------|----------|------------|
| `main` | Releases de produção | `dev` (via PR) | — |
| `dev` | Integração | `feat/*`, `fix/*`, `chore/*` | `main` |
| `feat/<pacote>/<descrição>` | Funcionalidade nova | — | `dev` |
| `fix/<pacote>/<descrição>` | Correção de bug | — | `dev` |
| `chore/<descrição>` | Não-funcional (CI, docs, tooling) | — | `dev` |

### Quando criar branch

- **Sempre** para trabalho que toca código-fonte de pacotes (`packages/*/src/`)
- **Opcional** para mudanças exclusivamente de documentação em `dev`
- **Nunca commitar diretamente em `main`** — sempre via PR de `dev`

### Branch protection (GitHub)

- Require PR review antes de merge (`dev` e `main`)
- Require status checks (CI) para merge
- Desabilitar force-push em `main` e `dev`
- Require linear history (rebase merge) — necessário para versionamento por contagem de commits

---

## Commits

### Formato da mensagem

```
<type>(<scope>): <descrição em inglês>
```

**Types:**
| Type | Quando usar |
|------|-------------|
| `feat` | Funcionalidade nova (comportamento que não existia) |
| `fix` | Correção de bug |
| `refactor` | Reestruturação sem mudança de comportamento |
| `test` | Adição ou alteração de testes |
| `docs` | Documentação (specs, memos, architecture docs) |
| `chore` | Tooling, CI, configs, dependências |
| `perf` | Otimização de performance |
| `a11y` | Acessibilidade |

**Scopes:**
| Scope | Quando |
|-------|--------|
| `attention-requester` | Pacote Attention Requester |
| `movable` | Pacote Movable |
| `arch` | Architecture docs (`packages/Svelte Model View Architecture/`) |
| `ci` | CI/CD, hooks, GitHub Actions |
| Novo pacote → novo scope | Sempre `kebab-case` do nome do pacote |

**Exemplos:**
```
feat(attention-requester): add prefers-reduced-motion support
fix(movable): clamp position on container resize
chore(ci): add GitHub Actions lint workflow
docs(arch): add Git Conventions doc
test(attention-requester): add interrupt resolution edge cases
```

### Quando commitar

- Em cada **fronteira lógica**: um comportamento implementado + testes passando
- Após o ciclo completo de review: testes → smoke test → CodeRabbit → tudo limpo
- **Nunca** no meio da implementação — commits "WIP" são proibidos

### O que o lefthook valida automaticamente

| Hook | Jobs | Bloqueante |
|------|------|------------|
| `pre-commit` | lint, check, test (scoped a `packages/*`) | Sim — commit falha se qualquer job falhar |
| `pre-push` | build (scoped a `packages/*`) | Sim — push falha se build quebrar |

---

## Versionamento

### Esquema: CalVer + contagem de commits

```
YYYY.MM.<contagem-de-commits-no-pacote>
```

Exemplo: `2026.03.047` — liberado em março de 2026, 47º commit que tocou o pacote.

**Por que CalVer e não SemVer:** Os pacotes serão distribuídos via shadcn (consumidor recebe cópia do código, não dependência npm). SemVer implica promessas de compatibilidade de API que não se aplicam quando o consumidor já fez fork. CalVer comunica frescor — "quão velha é minha cópia?" — que é o que importa nesse modelo.

**Como calcular:**
```bash
git rev-list --count HEAD -- packages/attention-requester/
```

**Versionamento independente:** Cada pacote versiona separadamente. Attention Requester pode estar na v47 enquanto Movable está na v12.

### Tags

Formato: `<pacote>@<versão>`

```
attention-requester@2026.03.047
movable@2026.03.012
```

Tags são criadas apenas em releases (merge `dev` → `main`).

---

## Release

%% Será detalhado quando Phase 3 do CI for implementada. %%

Workflow resumido:

1. Calcular versão via contagem de commits
2. Gerar/atualizar `CHANGELOG.md` do pacote
3. Atualizar `STATUS.yaml`
4. Criar tag: `<pacote>@<versão>`
5. Merge `dev` → `main` via PR
6. (Futuro) Atualizar `registry.json` para consumidores shadcn
