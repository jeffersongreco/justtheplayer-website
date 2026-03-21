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

- **Sempre** antes de qualquer alteração — criar a branch **antes** do primeiro commit
- **Opcional** para mudanças exclusivamente de documentação em `dev`
- **Nunca commitar diretamente em `main`** — sempre via PR de `dev`

### Branch protection (GitHub)

- Require PR review antes de merge (`dev` e `main`)
- Require status checks (CI) para merge
- Desabilitar force-push em `main` e `dev`
- Require linear history (rebase merge) — necessário para versionamento por contagem de commits

### Estratégia de merge: Rebase (nunca squash)

PRs são sempre merged via **rebase merge**. Cada commit da branch é replayed individualmente no topo da branch alvo. Isso significa:

- **Múltiplos commits por PR são normais e esperados** — um commit por fronteira lógica
- **Squash é proibido** — destrói a granularidade do histórico e quebra a contagem de commits para versionamento CalVer
- **Reset/force-push é proibido** em `dev` e `main` — histórico é append-only
- **Se um commit precisa ser corrigido**, faça um novo commit de fix, nunca amend ou rebase interativo em branches já pushed
- A única exceção para rebase local é **antes do primeiro push** de uma branch nova, para manter commits limpos

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

Processo completo documentado em [Release (§16)](Release.md).

Workflow resumido:

1. Verificar CI verde no `dev`
2. Gerar `version.ts` via `bun run version`
3. Gerar/atualizar `CHANGELOG.md` do pacote via `bun run changelog:<pacote>`
4. Atualizar `STATUS.yaml`
5. Commitar artefatos de release
6. Criar PR `dev` → `main` e aguardar CI + review
7. Merge via rebase
8. Criar tag: `<pacote>@<versão>`
9. (Futuro) Atualizar `registry.json` para consumidores shadcn
