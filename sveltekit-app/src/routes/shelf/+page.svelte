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
