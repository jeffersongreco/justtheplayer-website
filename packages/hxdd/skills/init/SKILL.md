---
name: init
description: Initialize a new HXDD project.
---

## Arguments

```
/hxdd:init [--path <package-path>] [--name <package-name>] [--lang <language>] [<raw idea text>]
```

All args optional.

- `--path <value>` — package path
- `--name <value>` — package name
- `--lang <value>` — document language
- remaining text — raw idea

## Execution

Parse args into four values: `workingDir`, `name`, `lang`, `rawIdea`. Any may be empty string.

Spawn `groundskeeper` agent with exact prompt:

```
WORKING_DIR: <workingDir or empty>
NAME: <name or empty>
LANG: <lang or empty>
RAW_IDEA: <rawIdea or empty>
```
