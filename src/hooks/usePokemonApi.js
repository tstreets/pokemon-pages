"use client";
import { createContext, useContext, useState, useEffect } from "react";

const PokemonContext = createContext();

export function PokemonProvider({ children }) {
  const [pokemonState, setPokemonState] = useState({
    totalPokemonCount: 0,
    randomPokemon: [],
    favorites: [], 
  });

  
  async function getNumberOfPokemon() {
    const pokeResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/?limit=1`
    );
    const { count: pokemonCount } = await pokeResponse.json();
    setPokemonState({ ...pokemonState, totalPokemonCount: pokemonCount });
  }

  async function getRandomPokemon(limit = 5) {
    if (!pokemonState.totalPokemonCount) return [];
    const pokemonIds = {};
    let pokeIndex = 0;

    while (pokeIndex < limit) {
      const randId =
        parseInt(Math.random() * pokemonState.totalPokemonCount) + 1;

      if (!pokemonIds[randId]) {
        let idToUse = randId;
        if (idToUse > 1000) {
          idToUse = "10" + String(idToUse).slice(1);
        }
        const pokeRequest = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${idToUse}`
        );
        const pokeData = await pokeRequest.json();
        pokemonIds[randId] = pokeData;
        pokeIndex++;
      }
    }

    setPokemonState({
      ...pokemonState,
      randomPokemon: Object.values(pokemonIds),
    });
  }

  function getPokemonQuickInfo(pokeData) {
    return {
      name: pokeData.name,
      id: pokeData.id,
      img: pokeData.sprites?.front_default,
      types: pokeData.types || [],
    };
  }

  useEffect(() => {
    const savedFavorites = localStorage.getItem('pokemonFavorites');
    if (savedFavorites) {
      setPokemonState(prev => ({
        ...prev,
        favorites: JSON.parse(savedFavorites)
      }));
    }
  }, []);

  function isFavorite(pokemonId) {
    return pokemonState.favorites.some(fav => fav.id === pokemonId);
  }

  function toggleFavorite(pokemon) {
    setPokemonState(prev => {
      const isFav = isFavorite(pokemon.id);
      const newFavorites = isFav
        ? prev.favorites.filter(fav => fav.id !== pokemon.id)
        : [...prev.favorites, {
            id: pokemon.id,
            name: pokemon.name,
            img: pokemon.sprites?.front_default, // Store the image URL directly
            types: pokemon.types || []
          }];
      
          localStorage.setItem('pokemonFavorites', JSON.stringify(newFavorites));
      
      return {
        ...prev,
        favorites: newFavorites
      };
    });
  }

  const pokemonValues = {
    ...pokemonState,
    getNumberOfPokemon,
    getRandomPokemon,
    getPokemonQuickInfo,
    toggleFavorite, 
    isFavorite,
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