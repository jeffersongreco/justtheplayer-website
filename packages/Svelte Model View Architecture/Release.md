# Release (§16)

> Parte da [Svelte Model View Architecture](Architecture.md).
> Consulte também: [Git Conventions](Git%20Conventions.md) (§15) para branches, commits e versionamento.

---

## Pré-requisitos

- Branch `dev` com todos os testes passando e CI verde
- Nenhum PR aberto bloqueando release
- `git-cliff` instalado (`brew install git-cliff`)

---

## Checklist de Release

### 1. Verificar CI no `dev`

```bash
gh run list --branch dev --limit 5
```

Todos os workflows devem estar verdes.

### 2. Calcular versão do pacote

```bash
# Attention Requester
git rev-list --count HEAD -- packages/attention-requester/
# Movable
git rev-list --count HEAD -- packages/movable/
```

A versão segue CalVer: `YYYY.MM.<contagem>` (ex: `2026.03.047`).

### 3. Gerar version.ts

```bash
bun run version
```

Isso roda `scripts/generate-version.ts` para cada pacote e gera `src/lib/version.ts`.

### 4. Gerar CHANGELOG

```bash
bun run changelog:ar
bun run changelog:movable
```

Revise os changelogs gerados para garantir que estão corretos.

### 5. Atualizar STATUS.yaml

Em cada pacote que está sendo liberado, atualize o campo `version` no `STATUS.yaml`.

### 6. Commitar artefatos de release

```bash
git add packages/attention-requester/CHANGELOG.md packages/movable/CHANGELOG.md
git add packages/attention-requester/STATUS.yaml packages/movable/STATUS.yaml
git commit -m "chore(ci): prepare release <pacote>@<versão>"
```

### 7. Criar PR de release

```bash
gh pr create --base main --head dev \
  --title "Release <pacote>@<versão>" \
  --body "## Release

- **Pacote:** <nome>
- **Versão:** <versão>

### Changelog
<cole os itens relevantes do CHANGELOG>
"
```

### 8. Review e merge

- Aguarde CI passar no PR
- Solicite review (se aplicável)
- Merge via **rebase** (único método permitido)

### 9. Criar tag

```bash
git checkout main
git pull
git tag "<pacote>@<versão>"
git push origin "<pacote>@<versão>"
```

Formato da tag: `attention-requester@2026.03.047` ou `movable@2026.03.012`.

### 10. Voltar para dev

```bash
git checkout dev
git pull
```

---

## Multi-pacote

Quando liberando múltiplos pacotes na mesma release:

1. Calcule versão e gere changelog para **cada** pacote separadamente
2. Crie **um único PR** listando todos os pacotes e suas versões
3. Após merge, crie **uma tag por pacote**

---

## Rollback

Se precisar reverter uma release:

```bash
git revert <commit-do-merge>
gh pr create --base main --head dev --title "Revert: <pacote>@<versão>"
```

Nunca use `git reset --hard` ou force-push em `main`.
