"use client";
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import usePokemonApi from '@/hooks/usePokemonApi';

export default function PokemonPage({ params }) {
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const pokeApi = usePokemonApi();

  useEffect(() => {
    async function fetchPokemonData() {
      try {
        
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
        const pokemonData = await response.json();
        setPokemon(pokemonData);

        
        const speciesResponse = await fetch(pokemonData.species.url);
        const speciesData = await speciesResponse.json();
        setSpecies(speciesData);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
      }
    }

    fetchPokemonData();
  }, [params.id]);

  if (!pokemon || !species) {
    return <div>Loading...</div>;
  }

  const description = species.flavor_text_entries.find(
    entry => entry.language.name === 'en'
  )?.flavor_text.replace(/\f/g, ' ');

  return (
    <div className={styles.container}>
      <div className={styles.pokemonCard}>
        <h1>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
        
        <div className={styles.imageContainer}>
          <img 
            src={pokemon.sprites.front_default} 
            alt={pokemon.name}
            className={styles.mainImage}
          />
          <img 
            src={pokemon.sprites.back_default} 
            alt={`${pokemon.name} back view`}
            className={styles.mainImage}
          />
        </div>

        <div className={styles.info}>
          <div className={styles.types}>
            {pokemon.types.map(type => (
              <span 
                key={type.type.name}
                className={`${styles.typeTag} ${styles[type.type.name]}`}
              >
                {type.type.name}
              </span>
            ))}
          </div>

          <div className={styles.description}>
            <p>{description}</p>
          </div>

          <div className={styles.measurements}>
            <p>Height: {pokemon.height / 10}m</p>
            <p>Weight: {pokemon.weight / 10}kg</p>
          </div>

          <div className={styles.abilities}>
            {pokemon.abilities.map(ability => (
              <span key={ability.ability.name} className={styles.ability}>
                {ability.ability.name.replace('-', ' ')}
              </span>
            ))}
          </div>

          <div className={styles.stats}>
            {pokemon.stats.map(stat => (
              <div key={stat.stat.name} className={styles.statBar}>
                <span className={styles.statName}>{stat.stat.name}</span>
                <span className={styles.statValue}>{stat.base_stat}</span>
                <div 
                  className={styles.statFill}
                  style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                />
              </div>
            ))}
          </div>

          <button 
            className={styles.favoriteButton}
            onClick={() => pokeApi.toggleFavorite(pokemon)}
          >
            {pokeApi.isFavorite(pokemon.id) ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
        </div>
      </div>
    </div>
  );
}