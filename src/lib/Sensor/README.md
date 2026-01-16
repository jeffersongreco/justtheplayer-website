# Draggable System

## 📂 Arquitetura de Arquivos

| Arquivo | Responsabilidade |
| :--- | :--- |
| `DragModel.svelte.ts` | **Spatial Model**. Gerencia coordenadas x/y, eventos de pointer, colisão e física. |
| `TutorialModel.svelte.ts` | **Orchestration Model**. Gerencia o estado do tutorial, timers e decide *qual* animação tocar. |
| `Draggable.svelte` | **View**. Componente visual "burro". Apenas renderiza o estado e injeta variáveis CSS. |
| `Motion.css` | **Design Tokens**. Contém as curvas de física e keyframes globais. |

---

## 🚀 Guia de Uso

### 1. Setup Básico

Para criar uma interação de arrastar e soltar com sensor:

```svelte
<script lang="ts">
  import { DragModel } from "$lib/logic/DragModel.svelte";
  import Draggable from "$lib/ui/Draggable.svelte";

  // 1. Instancie o Modelo (Pode usar px ou %)
  // O modelo calcula a posição relativa ao pai automaticamente.
  const model = new DragModel("50%", "50%");
</script>

<div class="boundary">
  
  <div use:model.target class="sensor">
    {model.isIntersecting ? 'Dentro!' : 'Fora'}
  </div>

  <Draggable {model} class="my-item">
    Arraste-me
  </Draggable>

</div>

<style>
  .boundary {
    position: relative;
    width: 500px;
    height: 500px;
  }
  /* Estilize seus componentes como quiser */
</style>
```
