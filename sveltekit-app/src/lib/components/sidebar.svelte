<script lang="ts">
  import { Library, Sprout, UserRound } from "@lucide/svelte";
  import { page } from "$app/state";

  let shelfActive = $derived(
    page.url.pathname === "/shelf" || page.url.pathname.startsWith("/shelf/"),
  );
  let plantsActive = $derived(page.url.pathname === "/plants");
  let profileActive = $derived(page.url.pathname === "/about");
</script>

<aside class="sidebar">
  <div>
    <div id="logo-container">
      <div class="logo" aria-hidden="true"></div>
      <h2>Josh</h2>
    </div>
    <nav>
      <ul id="nav-links">
        <li>
          <a href="/shelf" aria-current={shelfActive ? "page" : undefined}
            ><Library size={18} aria-hidden="true" />Your Shelf</a
          >
          {#if shelfActive}
            <ul class="submenu">
              <li>
                <a
                  href="/shelf/add"
                  aria-current={page.url.pathname === "/shelf/add"
                    ? "page"
                    : undefined}>Add plant</a
                >
              </li>
            </ul>
          {/if}
        </li>
        <li>
          <a href="/plants" aria-current={plantsActive ? "page" : undefined}
            ><Sprout size={18} aria-hidden="true" />Plants</a
          >
        </li>
        <li>
          <a href="/about" aria-current={profileActive ? "page" : undefined}
            ><UserRound size={18} aria-hidden="true" />Your Profile</a
          >
        </li>
      </ul>
    </nav>
  </div>
</aside>

<style>
  h2 {
    font-size: 1.7rem;
    margin: 0;
    font-family: var(--font-body);
  }
  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    font-family: var(--font-body);
  }
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: var(--sidebar-width);
    box-sizing: border-box;
    height: 100%;
    background-color: var(--color-surface);
    border-right: 1px solid var(--color-border);
    padding: var(--space-3);
    overflow-y: auto;
  }
  #logo-container {
    align-items: center;
    gap: 12px;
    padding-bottom: 12px;
    display: flex;
    padding-left: 16px;
  }
  .logo {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 50%;
    background-color: var(--color-sage);
  }
  #nav-links {
    list-style: none;
    margin: 0;
    padding-left: 16px;
    margin-top: 4px;
  }
  #nav-links a {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0 0.5rem;
    height: 44px;
    border-radius: 0.5rem;
    color: inherit;
    text-decoration: none;
  }
  #nav-links a:hover {
    background-color: var(--color-surface-soft);
  }

  #nav-links a[aria-current="page"] {
    background-color: var(--color-surface-soft);
    color: var(--color-primary);
    font-weight: 600;
  }

  .submenu {
    list-style: none;
    padding-left: 30px;
    font-size: 0.9rem;
  }

  .submenu a[aria-current="page"] {
    background-color: var(--color-surface-soft);
  }

  @media (max-width: 640px) {
    .sidebar {
      position: static;
      width: 100%;
      height: auto;
      border-right: 0;
      border-bottom: 1px solid var(--color-border);
    }
  }
</style>
