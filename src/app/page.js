"use client";
import usePokemonApi from "@/hooks/usePokemonApi";
import { useEffect } from "react";

export default function Home() {
  const pokeData = usePokemonApi();

  useEffect(() => {
    if (pokeData.totalPokemonCount === 0) {
      pokeData.getNumberOfPokemon();
    }
    if (!pokeData.randomPokemon.length) pokeData.getRandomPokemon();
  }, [pokeData]);

  const pokemonImages = pokeData.randomPokemon.map(function (pokemonData) {
    const imgUrl = pokeData.getImageFromPokemonData(pokemonData);
    return <img key={`pokemon-image-${imgUrl}`} src={imgUrl} />;
  });
  return (
    <main>
      <h1>Home</h1>
      {pokemonImages}
    </main>
  );
}
