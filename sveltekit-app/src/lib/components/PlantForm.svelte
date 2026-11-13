<script>
  import TagPicker from './tagpicker.svelte';

  const id = $props.id();
</script>

<div class="plant-form">
  <form method="POST" action="/api/plants">
    <label for={`${id}-name`}>Name</label>
    <input
      id={`${id}-name`}
      name="name"
      placeholder="e.g. My monstera"
      required
    />

    <label for={`${id}-species`}>Species</label>
    <input
      id={`${id}-species`}
      name="species"
      placeholder="e.g. Monstera deliciosa"
      required
    />

    <TagPicker />

    <label for={`${id}-lightNeeds`}>Light needs</label>
    <select id={`${id}-lightNeeds`} name="lightNeeds">
      <option value="low">Low</option>
      <option value="medium" selected>Medium</option>
      <option value="bright">Bright</option>
    </select>

    <button type="submit">Add Plant</button>
  </form>
</div>

<style>
  .plant-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-weight: bold;
  }

  input,
  select {
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid #ccc;
    font-size: 1rem;
  }

  button[type="submit"] {
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 1rem;
  }

  button[type="submit"]:hover {
    background-color: #45a049;
  }
</style>
