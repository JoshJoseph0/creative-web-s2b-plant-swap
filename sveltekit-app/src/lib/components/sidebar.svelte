<script lang="ts">
  import { Library, Sprout, UserRound } from "@lucide/svelte";
  import { page } from "$app/state";

  let shelfActive = $derived(page.url.pathname === '/shelf' || page.url.pathname.startsWith('/shelf/'));
</script>

<aside class="sidebar">
  <div>
    <div id="logo-container">
      <div class="logo" aria-hidden="true"></div>
      <h2>Josh Joseph</h2>
    </div>
    <nav>
      <h3>menu</h3>
      <ul id="nav-links">
        <li>
          <a href="/shelf"
            ><Library size={18} aria-hidden="true" />Your Shelf</a
          >
          {#if shelfActive}
            <ul class="submenu">
              <li><a href="/shelf/add" aria-current={page.url.pathname === '/shelf/add' ? 'page' : undefined}>Add plant</a></li>
            </ul>
          {/if}
        </li>
        <li><a href="/"><Sprout size={18} aria-hidden="true" />Plants</a></li>
        <li>
          <a href="/about"
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
    font-family: "Arial", sans-serif, light;
  }
  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    font-family: "Arial", sans-serif, light;
  }
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 250px;
    box-sizing: border-box;
    height: 100%;
    background-color: #f8f9fa;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    padding: 1rem;
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
    background-color: #9ca3af;
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
    height: 44px;
    border-radius: 0.5rem;
    color: inherit;
    text-decoration: none;
  }
  #nav-links a:hover {
    background-color: #e9ecef;
  }

  .submenu {
    list-style: none;
    padding-left: 30px;
    font-size: 0.9rem;
  }

  .submenu a[aria-current="page"] {
    background-color: #e9ecef;
  }
</style>
