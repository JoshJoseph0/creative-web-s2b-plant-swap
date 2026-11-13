<script lang="ts">
  import PlantCard from "#lib/components/PlantCard.svelte";
  import "#lib/plant-grid.css";

  import type { PageProps } from "./$types";

  let { data, form }: PageProps = $props();
</script>

<main>
  <section class="plant-cards">
    <h2>Your plants ({data.plants.length})</h2>
    {#if form?.error}
      <p role="alert">{form.error}</p>
    {/if}

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
  .plant-cards {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

</style>
