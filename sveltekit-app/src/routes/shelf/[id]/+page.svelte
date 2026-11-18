<script lang="ts">
  import PlantCard from '#lib/components/PlantCard.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.plant.name} | Plant Swap</title>
</svelte:head>

<main>
  <a href="/shelf">← Back to your shelf</a>
  <h1>{data.plant.name}</h1>
  <PlantCard plant={data.plant} showLink={false} />
  <p>Light needs: {data.plant.lightNeeds}</p>
</main>

<style>
  main {
    max-width: 36rem;
  }
</style>
