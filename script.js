const d = document,
      $main = d.querySelector("main"),
      $links = d.querySelector(".links");

let pokeAPI = "https://pokeapi.co/api/v2/pokemon/";

async function loadPokemon(url) {
  try {
    $main.innerHTML = `<img class="loader" src="./assets/loader.svg" alt="Loading...">`;

    let res = await fetch(url),
      json = await res.json(),
      $template = "",
      $prevLink,
      $nextLink;

    if (!res.ok) throw { status: res.status, statusText: res.statusText }

    for (let i = 0; i < json.results.length; i++) {
      try {
        let res = await fetch(json.results[i].url),
          pokemon = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText }

        $template += `
          <figure>
          <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
          <figcaption><small>#0${pokemon.game_indices[6].game_index}</small></figcaption>
          <figcaption>${pokemon.name}</figcaption>
          <figcaption class="type"><small>${pokemon.types[0].type.name}</small></figcaption>
          </figure>
          `;
        
      } catch (err) {
        let msg = err.statusText || "Ocurrió un error";
        err = `Error ${err.status}: ${msg}`;
      }
    }

    $main.innerHTML = $template;

    $nextLink = json.next ? `<a href="${json.next}">&#10095</a>` : "";
    $prevLink = json.previous ? `<a href="${json.previous}">&#10094</a>` : "";
    $links.innerHTML = $prevLink + " " + $nextLink;
  } catch (err) {
    let msg = err.statusText || "An error has ocurred";
    err = `Error ${err.status}: ${msg}`;
  }
};
d.addEventListener("DOMContentLoaded", e => loadPokemon(pokeAPI));
d.addEventListener("click", e => {
  if (e.target.matches(".links a")) {
    e.preventDefault();
    loadPokemon(e.target.getAttribute("href"));
  }
});