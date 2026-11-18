<script lang="ts">
  import "../../style.css";
  import favicon from "#lib/assets/favicon.svg";
  import Sidebar from "#lib/components/sidebar.svelte";
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Sidebar />

<div class="page-content">
  {@render children()}
</div>

<style>
  .page-content {
    min-height: 100vh;
    margin-left: var(--sidebar-width);
    padding: var(--space-4) var(--space-5);
    box-sizing: border-box;
    container-type: inline-size;
  }

  @media (max-width: 640px) {
    .page-content {
      margin-left: 0;
      padding: 1rem;
    }
  }
</style>
