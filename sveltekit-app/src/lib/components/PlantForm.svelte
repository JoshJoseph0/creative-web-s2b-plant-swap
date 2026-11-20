<script lang="ts">
  import TagPicker from './tagpicker.svelte';

  const id = $props.id();
  type SearchPlant = {
    id: number;
    name: string;
    scientificName: string;
    image: string | null;
    imageLicense: string | null;
    imageLicenseUrl: string | null;
    lightNeeds: string | null;
    tags: string[];
  };

  let query = $state('');
  let results = $state<SearchPlant[] | null>(null);
  let searching = $state(false);
  let selecting = $state(false);
  let message = $state('');
  let selectedId = $state<number | null>(null);
  let name = $state('');
  let species = $state('');
  let lightNeeds = $state('medium');
  let tags = $state<string[]>([]);
  let imageUrl = $state('');
  let imageLicense = $state('');
  let imageLicenseUrl = $state('');
  let failedImage = $state('');
  let searchRequest = 0;
  let selectionRequest = 0;

  async function search(event: SubmitEvent) {
    event.preventDefault();
    const request = ++searchRequest;
    searching = true;
    message = '';
    results = null;
    try {
      const response = await fetch(`/api/plant-search?q=${encodeURIComponent(query.trim())}`);
      const data = await response.json();
      if (request !== searchRequest) return;
      if (!response.ok) throw new Error(data.error);
      results = data;
    } catch (error) {
      if (request === searchRequest) message = error instanceof Error ? error.message : 'Unable to search plants.';
    } finally {
      if (request === searchRequest) searching = false;
    }
  }

  async function selectPlant(plant: SearchPlant) {
    const request = ++selectionRequest;
    selectedId = plant.id;
    name = plant.name;
    species = plant.scientificName || plant.name;
    imageUrl = plant.image || '';
    imageLicense = plant.imageLicense || '';
    imageLicenseUrl = plant.imageLicenseUrl || '';
    failedImage = '';
    lightNeeds = plant.lightNeeds || 'medium';
    tags = [...plant.tags];
    message = '';
    selecting = true;
    try {
      const response = await fetch(`/api/plant-search?id=${plant.id}`);
      const data: SearchPlant & { error?: string } = await response.json();
      if (request !== selectionRequest) return;
      if (!response.ok) throw new Error(data.error);
      if (data.lightNeeds) lightNeeds = data.lightNeeds;
      tags = [...data.tags];
      if (data.image) {
        imageUrl = data.image;
        imageLicense = data.imageLicense || '';
        imageLicenseUrl = data.imageLicenseUrl || '';
      }
      message = 'Plant details filled in. Check them below before adding your plant.';
    } catch {
      if (request === selectionRequest) message = 'Name, species and any available photo filled in. Care details are unavailable; choose the light needs and tags below.';
    } finally {
      if (request === selectionRequest) selecting = false;
    }
  }
</script>

<div class="plant-form">
  <form onsubmit={search} aria-label="Search for a plant">
    <label for={`${id}-search`}>Find your plant</label>
    <div class="search-row">
      <input id={`${id}-search`} type="search" bind:value={query} minlength="2" maxlength="100" placeholder="e.g. Monstera" required />
      <button type="submit" disabled={searching}>{searching ? 'Searching…' : 'Search'}</button>
    </div>
  </form>

  {#if results !== null}
    <ul class="search-results" aria-label="Plant search results">
      {#each results as plant (plant.id)}
        <li>
          <button type="button" class="plant-result" aria-pressed={selectedId === plant.id} onclick={() => selectPlant(plant)}>
            <span><strong>{plant.name}</strong><small>{plant.scientificName}</small></span>
            <span>{selectedId === plant.id ? 'Selected' : 'Choose'}</span>
          </button>
        </li>
      {/each}
    </ul>
    {#if results.length === 0}<p role="status">No plants found. Try another name or fill in the form below.</p>{/if}
  {/if}
  <p class="search-status" role="status" aria-live="polite">{selecting ? 'Loading plant details…' : message}</p>

  {#if imageUrl}
    <figure>
      {#if failedImage !== imageUrl}
        <img class="plant-preview" src={imageUrl} alt={species || name} onerror={() => failedImage = imageUrl} />
      {:else}
        <p>Photo unavailable.</p>
      {/if}
      <button type="button" onclick={() => { imageUrl = ''; imageLicense = ''; imageLicenseUrl = ''; }}>Remove photo</button>
      <figcaption>Photo via <a href="https://perenual.com" target="_blank" rel="noreferrer">Perenual</a>{#if imageLicenseUrl} · <a href={imageLicenseUrl} target="_blank" rel="noreferrer">{imageLicense || 'Photo licence'}</a>{:else if imageLicense} · {imageLicense}{/if}</figcaption>
    </figure>
  {/if}

  <form method="POST" action="/api/plants">
    <input type="hidden" name="imageUrl" value={imageUrl} />
    <input type="hidden" name="imageLicense" value={imageLicense} />
    <input type="hidden" name="imageLicenseUrl" value={imageLicenseUrl} />
    <fieldset disabled={selecting}>
    <label for={`${id}-name`}>Name</label>
    <input
      id={`${id}-name`}
      name="name"
      bind:value={name}
      placeholder="e.g. My monstera"
      required
    />

    <label for={`${id}-species`}>Species</label>
    <input
      id={`${id}-species`}
      name="species"
      bind:value={species}
      placeholder="e.g. Monstera deliciosa"
      required
    />

    <TagPicker bind:selected={tags} />

    <label for={`${id}-lightNeeds`}>Light needs</label>
    <select id={`${id}-lightNeeds`} name="lightNeeds" bind:value={lightNeeds}>
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="bright">Bright</option>
    </select>

    <button type="submit">Add Plant</button>
    </fieldset>
  </form>
</div>

<style>
  .plant-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  form, fieldset {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  fieldset { border: 0; margin: 0; padding: 0; min-width: 0; }
  .search-row { display: flex; align-items: stretch; gap: 8px; }
  .search-row input { min-width: 0; }
  .search-row button { margin: 0; }
  .search-results { list-style: none; margin: 0; padding: 0; max-height: 20rem; overflow-y: auto; border: 1px solid var(--color-border); border-radius: var(--radius-sm); }
  .plant-result { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px; text-align: left; border: 0; border-bottom: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text); cursor: pointer; }
  .plant-result:hover, .plant-result[aria-pressed="true"] { background: var(--color-surface-soft); }
  small { display: block; color: var(--color-text-secondary); }
  .search-status { margin: 0; }
  .search-status:empty { display: none; }
  figure { margin: 0; }
  .plant-preview { display: block; width: 100%; max-height: 16rem; object-fit: cover; border-radius: var(--radius-md); }
  figcaption { font-size: 0.8rem; color: var(--color-text-secondary); margin-top: 8px; }
  button:disabled { opacity: 0.6; cursor: wait; }

  label {
    font-weight: bold;
  }

  input,
  select {
    box-sizing: border-box;
    width: 100%;
    padding: 0.75rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text);
    font-size: 1rem;
  }

  button[type="submit"] {
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-size: 1rem;
  }

  button[type="submit"]:hover {
    background-color: var(--color-primary-hover);
  }
</style>
