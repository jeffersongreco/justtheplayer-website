<!--
  Minimal fixture for axe-core a11y auditing.
  Renders only the AttentionRequester component with a single interactive child.
  No styling, no layout, no extra markup — just the component's actual DOM footprint.
-->
<script lang="ts">
  import AttentionRequesterModifier from "../../lib/AttentionRequesterModifier.svelte";
</script>

<AttentionRequesterModifier>
  {#snippet children({ isAnimating })}
    <button type="button">Attention target</button>
  {/snippet}
</AttentionRequesterModifier>
