<script lang="ts">
  import PlantCard from '#lib/components/PlantCard.svelte';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.plant.name} | Plant Swap</title>
</svelte:head>

<main>
  <a href={data.plant.ownerId === 'you' ? '/shelf' : '/plants'}>← Back to plants</a>
  <h1>{data.plant.name}</h1>
  <PlantCard plant={data.plant} showLink={false} />
  <p>Light needs: {data.plant.lightNeeds}</p>
  {#if form?.error}<p role="alert">{form.error}</p>{/if}
  {#if data.plant.isDemo && data.plant.ownerId !== 'you' && !data.plant.swapped}
    <h2>Swap with {data.plant.ownerName}</h2>
    <p>This is a demo swap. Choose one of your plants to exchange immediately.</p>
    {#if data.myPlants.length}
      <form method="POST" action="?/swap">
        <label for="offered-plant">Your plant to swap</label>
        <select id="offered-plant" name="offeredPlantId" required>
          <option value="">Choose a plant</option>
          {#each data.myPlants as plant (plant.id)}
            <option value={plant.id}>{plant.name} — {plant.species}</option>
          {/each}
        </select>
        <button type="submit">Swap plants</button>
      </form>
    {:else}
      <p><a href="/shelf/add">Add a plant to your shelf</a> to try a swap.</p>
    {/if}
  {/if}
</main>

<style>
  main {
    max-width: 36rem;
  }
  form { display: flex; flex-direction: column; gap: 12px; }
  select, button { padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); }
  select { background: var(--color-surface); color: var(--color-text); }
  button { background: var(--color-primary); color: white; cursor: pointer; }
</style>
