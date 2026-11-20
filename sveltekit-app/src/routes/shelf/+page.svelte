<script lang="ts">
  import PlantCard from "#lib/components/PlantCard.svelte";
  import "#lib/plant-grid.css";

  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<main>
  <section class="plant-cards">
    <div class="shelf-heading">
      <h2>Your plants ({data.plants.length})</h2>
    </div>
    {#if data.swapComplete}
      <p role="status">Swap complete. Your new plant is on your shelf.</p>
    {/if}

    <nav class="light-filters" aria-label="Filter plants by light needs">
      {#each [
        { label: 'All', value: 'all', href: '/shelf' },
        { label: 'Low', value: 'low', href: '/shelf?light=low' },
        { label: 'Medium', value: 'medium', href: '/shelf?light=medium' },
        { label: 'Bright', value: 'bright', href: '/shelf?light=bright' }
      ] as option (option.value)}
        <a href={option.href} data-sveltekit-reload aria-current={data.selectedLight === option.value ? 'page' : undefined}>
          {option.label}
        </a>
      {/each}
    </nav>

    <div class="plant-grid">
      {#each data.plants as plant (plant.id)}
        <PlantCard {plant} deletable />
      {:else}
        <p>No plants yet. Add your first one!</p>
      {/each}
    </div>
  </section>

</main>

<style>
  .light-filters { display: flex; flex-wrap: wrap; gap: 8px; }
  .light-filters a { padding: 8px 14px; border: 1px solid var(--color-border); border-radius: 999px; text-decoration: none; color: var(--color-text); background: var(--color-surface); }
  .light-filters a[aria-current="page"] { background: var(--color-primary); color: white; }
  .light-filters a:focus-visible { outline: 3px solid var(--color-primary); outline-offset: 2px; }
  .plant-cards {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .shelf-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .shelf-heading h2 {
    margin: 0;
  }

</style>
