"use client";
import { createContext, useContext, useState } from "react";

const PokemonContext = createContext();

export function PokemonProvider({ children }) {
  const [pokemonState, setPokemonState] = useState({
    totalPokemonCount: 0,
    randomPokemon: [],
  });

  async function getNumberOfPokemon() {
    const pokeResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/?limit=1`
    );
    const { count: pokemonCount } = await pokeResponse.json();
    setPokemonState({ ...pokemonState, totalPokemonCount: 1000 });
  }

  /**
   * Get 5 random unique ids to fetch pokemon
   **/
  async function getRandomPokemon(limit = 5) {
    if (!pokemonState.totalPokemonCount) return [];
    const pokemonIds = {};
    let pokeIndex = 0;
    while (pokeIndex < limit) {
      const randId = parseInt(Math.random() * pokemonState.totalPokemonCount);
      if (!pokemonIds[randId]) {
        const pokeRequest = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${randId}`
        );
        pokemonIds[randId] = await pokeRequest.json();
        pokeIndex++;
      }
    }

    setPokemonState({
      ...pokemonState,
      randomPokemon: Object.values(pokemonIds),
    });
  }

  function getImageFromPokemonData(pokemonData) {
    const pokemonImage = pokemonData.sprites.front_default;
    return pokemonImage;
  }

  // modified
  const pokemonValues = {
    ...pokemonState,
    getNumberOfPokemon,
    getRandomPokemon,
    getImageFromPokemonData,
  };

  return (
    <PokemonContext.Provider value={pokemonValues}>
      {children}
    </PokemonContext.Provider>
  );
}

export default function usePokemonApi() {
  return useContext(PokemonContext);
}
