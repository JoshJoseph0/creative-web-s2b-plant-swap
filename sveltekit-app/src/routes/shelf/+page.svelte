<script>
 let name = $state("");
 let species = $state("");
 let lightneeds = $state("medium");
 let plants = $state([]);

 function addPlant() {
   plants = [
     ...plants,
     { name: name, species: species, lightneeds: lightneeds }
   ];
   name = "";
   species = "";
   lightneeds = "medium";
 }

</script>

<main>
    <h1>Plant Shelf</h1>
    
    <form on:submit|preventDefault={addPlant}>
        <label for="name">Name:</label>
        <input id="name" bind:value={name} required />
    
        <label for="species">Species:</label>
        <input id="species" bind:value={species} required />
    
        <label for="lightneeds">Light Needs:</label>
        <select id="lightneeds" bind:value={lightneeds}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        </select>
    
        <button type="submit">Add Plant</button>
    </form>
    
    {#if plants.length > 0}
        <h2>My Plants</h2>
        <ul>
        {#each plants as plant}
            <li>{plant.name} ({plant.species}) - Light Needs: {plant.lightneeds}</li>
        {/each}
        </ul>
    {:else}
        <p>No plants added yet.</p>
    {/if}
</main>
