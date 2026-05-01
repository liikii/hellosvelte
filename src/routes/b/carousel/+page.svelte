<script lang="ts">
   import dogimg from "$lib/assets/dog.png";
   import catimg from "$lib/assets/cat.png";
   import chickimg from "$lib/assets/chick.png";
</script>


<div id="carouselExampleRide" class="carousel slide h-50" data-bs-ride="true">
  <div class="carousel-inner h-100" >
    <div class="carousel-item active w-100 h-100" >
      <img src={dogimg} class="w-100 h-100" style="object-fit: contain;" alt="...">
    </div>
    <div class="carousel-item">
      <img src={catimg} class="" style="object-fit: contain;" alt="...">
    </div>
    <div class="carousel-item">    
      <img src={chickimg} class="" style="object-fit: fill;" alt="...">  
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>

<h1>Carousel</h1>