<!--
  Minimal fixture for axe-core a11y auditing.
  Renders only the AttentionRequester attach action with a single interactive child.
  No styling, no layout, no extra markup — just the component's actual DOM footprint.
-->
<script lang="ts">
  import { AttentionRequester } from "../../lib/index";

  const attention = AttentionRequester();
</script>

<div {@attach attention.modifier}>
  <button type="button">Attention target</button>
</div>
