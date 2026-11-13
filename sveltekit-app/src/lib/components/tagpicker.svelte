<script lang="ts">
  let { selected = $bindable([]) }: { selected?: string[] } = $props();
  const id = $props.id();

  const availableTags = [
    { id: "easy-care", label: "Easy care" },
    { id: "indoor", label: "Indoor" },
    { id: "pet-safe", label: "Pet-friendly" },
    { id: "tropical", label: "Tropical" },
    { id: "fast-growing", label: "Fast growing" },
    { id: "low-water", label: "Low watering" },
    { id: "rare", label: "Rare" },
    { id: "beginner-friendly", label: "Beginner-friendly" },
  ];

  function toggleTag(id: string) {
    if (selected.includes(id)) {
      selected = selected.filter((tag) => tag !== id);
    } else {
      selected = [...selected, id];
    }
  }
</script>

<div class="tag-picker">
  <span id={`${id}-tag-label`}>Plant tags</span>

  <div class="tag-list" role="group" aria-labelledby={`${id}-tag-label`}>
    {#each availableTags as tag (tag.id)}
      <button
        type="button"
        class:selected={selected.includes(tag.id)}
        aria-pressed={selected.includes(tag.id)}
        onclick={() => toggleTag(tag.id)}
      >
        {selected.includes(tag.id) ? "✓" : "+"}
        {tag.label}
      </button>
    {/each}
  </div>

  <input type="hidden" name="tags" value={JSON.stringify(selected)} />
</div>

<style>
  .tag-picker {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  button {
    border: 1px solid #e8e5ed;
    border-radius: 100px;
    padding: 8px 14px;
    background: #f5f3f8;
    color: #38343f;
    cursor: pointer;
    font: inherit;
    font-size: 14px;
  }

  button.selected {
    background: #e8deff;
    border-color: #bca1ff;
    color: #4f20c6;
  }
</style>
