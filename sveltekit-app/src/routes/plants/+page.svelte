<script lang="ts">
	import PlantCard from '#lib/components/PlantCard.svelte';
	import '#lib/plant-grid.css';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<main>
	<h1>Plants</h1>
	<p>Browse the plants shared with the community.</p>

	<section class="plant-grid">
		{#each data.plants as plant (plant.id)}
			<PlantCard {plant} />
		{:else}
			<p>No plants have been shared yet.</p>
		{/each}
	</section>
</main>
