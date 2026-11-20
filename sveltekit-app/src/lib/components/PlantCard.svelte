<script lang="ts">
  import {
    ArrowRight,
    Sprout,
    Droplet,
    Leaf,
    House,
  } from "lucide-svelte";

  type Plant = {
    id?: string;
    _id?: string;
    name: string;
    species: string;
    imageUrl?: string | null;
    imageLicense?: string | null;
    imageLicenseUrl?: string | null;
    image?: { url?: string | null } | null;
    default_image?: { regular_url?: string | null } | null;
    careLevel?: string | number | null;
    waterNeeds?: string | number | null;
    growthSpeed?: string | number | null;
    room?: string | null;
    tags?: string[];
    ownerId?: string;
    ownerName?: string;
    isDemo?: boolean;
    swapped?: boolean;
  };

  let { plant, deletable = false, showLink = true }: { plant: Plant; deletable?: boolean; showLink?: boolean } = $props();

  // Convert text values into positions on a 0–100 scale
  function toScore(value: string | number | null | undefined): number | null {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    if (typeof value === "number") {
      return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : null;
    }

    const scores: Record<string, number> = {
      low: 20,
      minimum: 20,
      easy: 20,
      slow: 20,
      "partial shade": 35,
      medium: 50,
      moderate: 50,
      average: 50,
      bright: 85,
      high: 85,
      difficult: 85,
      fast: 85,
    };

    return scores[String(value).toLowerCase().trim()] ?? null;
  }

  function formatTag(tag: string): string {
    const labels: Record<string, string> = {
      "easy-care": "Easy care",
      "pet-safe": "Pet-friendly",
      "low-water": "Low watering",
      "fast-growing": "Fast growing",
    };

    return (
      labels[tag] ??
      tag.replaceAll("-", " ").replace(/^./, (s) => s.toUpperCase())
    );
  }

  // Use the saved image URL, if one exists
  let imageUrl = $derived(
    plant.imageUrl ||
      plant.image?.url ||
      plant.default_image?.regular_url ||
      null,
  );

  // Only show metrics where plant data is available
  let metrics = $derived(
    [
      {
        id: "care",
        label: "Care level",
        raw: plant.careLevel,
        score: toScore(plant.careLevel),
        icon: Sprout,
      },
      {
        id: "water",
        label: "Water needs",
        raw: plant.waterNeeds,
        score: toScore(plant.waterNeeds),
        icon: Droplet,
      },
      {
        id: "growth",
        label: "Growth speed",
        raw: plant.growthSpeed,
        score: toScore(plant.growthSpeed),
        icon: Leaf,
      },
    ].filter((metric) => metric.score !== null),
  );

  let tags = $derived(Array.isArray(plant.tags) ? plant.tags.slice(0, 3) : []);

  let plantId = $derived(plant.id ?? plant._id);
  let failedImage = $state<string | null>(null);
</script>

<article class="plant-card">
  <!-- PLANT PHOTO -->
  <div class="photo">
    {#if imageUrl && failedImage !== imageUrl}
      <img src={imageUrl} alt={plant.species || plant.name} loading="lazy" onerror={() => failedImage = imageUrl} />
    {:else}
      <div class="photo-placeholder">
        <Leaf size={54} strokeWidth={1.2} />
        <span>No photo yet</span>
      </div>
    {/if}
  </div>

  <!-- PLANT INFORMATION -->
  <div class="content">
    <div class="heading">
      <div class="plant-title">
        <h2>{plant.species}</h2>
        <p>{plant.name}</p>
        {#if plant.ownerId && plant.ownerId !== 'you'}
          <p>Shared by {plant.ownerName}{plant.isDemo ? ' · Demo plant' : ''}</p>
        {/if}
        <p class="swap-status">{plant.swapped ? 'Swapped' : 'Available'}</p>
      </div>
      {#if imageUrl && (plant.imageLicense || plant.imageLicenseUrl)}
        <p class="photo-credit">Photo via <a href="https://perenual.com" target="_blank" rel="noreferrer">Perenual</a>{#if plant.imageLicenseUrl} · <a href={plant.imageLicenseUrl} target="_blank" rel="noreferrer">{plant.imageLicense || 'Photo licence'}</a>{:else} · {plant.imageLicense}{/if}</p>
      {/if}

      <!-- LOCATION AND TAGS -->
      {#if plant.room || tags.length > 0}
        <div class="chips">
          {#if plant.room}
            <span class="location-chip">
              <House size={14} strokeWidth={1.8} />
              {plant.room}
            </span>
          {/if}

          {#each tags as tag (tag)}
            <span class="tag-chip">
              {formatTag(tag)}
            </span>
          {/each}
        </div>
      {/if}

      <!-- PLANT CHARACTERISTICS -->
      {#if metrics.length > 0}
        <div class="metrics">
          {#each metrics as metric (metric.id)}
            <div class="metric-row">
              <div class="metric-icon">
                <metric.icon size={20} strokeWidth={1.7} />
              </div>

              <span class="metric-label">
                {metric.label}
              </span>

              <span class="metric-value">{metric.raw}</span>
            </div>
          {/each}
        </div>
      {/if}

      <!-- VIEW BUTTON -->
      {#if plantId && showLink}
        <a href={`/shelf/${plantId}`} class="view-button">
          <span>View plant</span>
          <ArrowRight size={20} strokeWidth={2} />
        </a>
      {/if}
      {#if plantId && deletable}
        <form method="POST" action="/shelf?/setStatus">
          <input type="hidden" name="id" value={plantId} />
          <input type="hidden" name="swapped" value={plant.swapped ? 'false' : 'true'} />
          <button type="submit" class="status-button">{plant.swapped ? 'Mark available' : 'Mark swapped'}</button>
        </form>
        <form method="POST" action="/shelf?/delete">
          <input type="hidden" name="id" value={plantId} />
          <button type="submit" aria-label={`Delete ${plant.name}`}>Delete plant</button>
        </form>
      {/if}
    </div>
  </div>
</article>

<style>
  .photo-credit { margin: 0; font-size: 11px; color: var(--color-text-secondary); }
  .photo-credit a { color: inherit; }
  .plant-card {
    min-width: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    padding: 16px;
    border: 1px solid var(--color-border);
    border-radius: 28px;
    background: var(--color-surface);
    box-shadow:
      0 16px 36px rgb(35 25 61 / 7%),
      0 2px 8px rgb(35 25 61 / 3%);
    color: var(--color-text);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  .plant-card:hover {
    transform: translateY(-3px);
    box-shadow:
      0 22px 44px rgb(35 25 61 / 10%),
      0 3px 10px rgb(35 25 61 / 4%);
  }

  /* Photo */

  .photo {
    width: 100%;
    aspect-ratio: 1.65;
    border-radius: 20px;
    overflow: hidden;
    background: #e8e4ed;
  }

  .photo img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    transition: transform 0.35s ease;
  }

  .plant-card:hover .photo img {
    transform: scale(1.035);
  }

  .photo-placeholder {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #a39ab4;
    background: linear-gradient(145deg, #efedf4, #e4e0ec);
  }

  .photo-placeholder span {
    font-size: 12px;
  }

  /* Content */

  .content {
    padding: 20px 4px 4px;
    display: flex;
    flex: 1;
  }

  .heading {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }

  .plant-title {
    min-width: 0;
  }

  h2 {
    margin: 0;
    font-size: 23px;
    line-height: 1.2;
    font-weight: 700;
    letter-spacing: -0.7px;
    overflow-wrap: anywhere;
  }

  .plant-title p {
    margin: 7px 0 0;
    color: var(--color-text-secondary);
    font-size: 14px;
    line-height: 1.4;
  }

  /* Tags */

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
  }

  .location-chip,
  .tag-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 10px;
    border-radius: 100px;
    background: #eceaf0;
    color: #4d4959;
    font-size: 12px;
    font-weight: 500;
  }

  .tag-chip {
    background: #f0eafb;
    color: #6948a8;
  }

  /* Trait scales */

  .metrics {
    width: 100%;
  }

  .metric-row {
    display: grid;
    grid-template-columns: 36px minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    min-height: 65px;
    border-bottom: 1px solid #ebe7f1;
  }

  .metric-row:last-child {
    border-bottom: none;
  }

  .metric-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 11px;
    background: var(--color-surface-soft);
    color: var(--color-primary);
  }

  .metric-label {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: -0.2px;
  }

  .metric-value {
    color: #5b536b;
    font-size: 13px;
    text-align: right;
  }

  .swap-status { font-size: 13px; font-weight: 600; }
  .status-button { color: var(--color-primary); font-weight: 600; }
  .status-button:hover { text-decoration: underline; }

  /* Bottom button */

  .view-button {
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 15px 20px;
    border-radius: 15px;
    background: var(--color-primary);
    color: white;
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
    transition:
      background 0.2s ease,
      transform 0.2s ease;
  }

  .view-button:hover {
    background: var(--color-primary-hover);
  }

  button {
    border: 0;
    padding: 4px 0;
    background: transparent;
    color: #a12828;
    cursor: pointer;
  }

  .view-button:active {
    transform: scale(0.99);
  }

  .view-button:focus-visible {
    outline: 3px solid #bfa9ff;
    outline-offset: 3px;
  }

  /* Smaller cards and screens */

  @media (max-width: 420px) {
    .plant-card {
      padding: 12px;
      border-radius: 22px;
    }

    .content {
      padding: 18px 4px 4px;
    }

    h2 {
      font-size: 20px;
    }

    .metric-row {
      grid-template-columns: 32px minmax(0, 1fr) auto;
      gap: 7px;
    }

    .metric-icon {
      width: 32px;
      height: 32px;
    }

    .metric-label {
      font-size: 11px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .plant-card,
    .photo img,
    .view-button {
      transition: none;
    }

    .plant-card:hover,
    .plant-card:hover .photo img {
      transform: none;
    }
  }
</style>
