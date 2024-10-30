"use client";
import { useState, useEffect } from 'react';
import usePokemonApi from "@/hooks/usePokemonApi";
import PokemonCard from "@/components/Pokemon/PokemonCard";
import styles from "./search.module.css";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [allPokemon, setAllPokemon] = useState([]);
  const [displayedPokemon, setDisplayedPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const pokeApi = usePokemonApi();

  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            const pokemonData = await res.json();
            
            
            const speciesRes = await fetch(pokemonData.species.url);
            const speciesData = await speciesRes.json();
            
            return {
              ...pokemonData,
              habitat: speciesData.habitat ? speciesData.habitat.name : null,
              egg_groups: speciesData.egg_groups.map(group => group.name)
            };
          })
        );
        
        setAllPokemon(pokemonDetails);
        setDisplayedPokemon(pokemonDetails); 
        setLoading(false);
        console.log("Fetched Pokemon:", pokemonDetails);
      } catch (err) {
        setError('Failed to load Pokémon');
        setLoading(false);
        console.error("Error fetching Pokemon:", err);
      }
    };

    fetchAllPokemon();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search triggered");
    const searchTermLower = searchTerm.toLowerCase();

    const filtered = allPokemon.filter(pokemon => {
      switch (searchType) {
        case 'name':
          return pokemon.name.toLowerCase().includes(searchTermLower);
        case 'egg-group':
          return pokemon.egg_groups && pokemon.egg_groups.some(group => 
            group.toLowerCase().includes(searchTermLower)
          );
        case 'habitat':
          return pokemon.habitat && pokemon.habitat.toLowerCase().includes(searchTermLower);
        default:
          return true; 
      }
    });

    console.log("Filtered Pokemon:", filtered);
    setDisplayedPokemon(filtered);
  };

  if (loading) return <div className={styles.searchContainer}>Loading...</div>;
  if (error) return <div className={styles.searchContainer}>{error}</div>;

  return (
    <div className={styles.searchContainer}>
      <h1>Search Pokémon</h1>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter search term..."
          className={styles.searchInput}
        />
        <select 
          value={searchType} 
          onChange={(e) => setSearchType(e.target.value)}
          className={styles.searchSelect}
        >
          <option value="name">Name</option>
          <option value="egg-group">Egg Group</option>
          <option value="habitat">Habitat</option>
        </select>
        <button type="submit" className={styles.searchButton}>Search</button>
      </form>

      <div className={styles.pokemonGrid}>
        {displayedPokemon.map(pokemon => (
          <PokemonCard 
            key={pokemon.id}
            id={pokemon.id}
            name={pokemon.name}
            img={pokemon.sprites.front_default}
            types={pokemon.types}
            habitat={pokemon.habitat}
            eggGroups={pokemon.egg_groups}
            isFavorite={pokeApi.isFavorite(pokemon.id)}
            onFavoriteClick={() => pokeApi.toggleFavorite(pokemon)}
          />
        ))}
      </div>
    </div>
  );
}