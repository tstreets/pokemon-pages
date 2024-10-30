"use client";
import usePokemonApi from "@/hooks/usePokemonApi";
import PokemonCard from "@/components/Pokemon/PokemonCard";
import styles from "@/app/favorites/favorites.module.css";

export default function FavoritesPage() {
  const pokeApi = usePokemonApi();

  return (
    <div className={styles.searchContainer}>
      <h1>My Favorite Pokémon</h1>
      
      <div className={styles.pokemonGrid}>
        {pokeApi.favorites.map(pokemon => (
          <PokemonCard 
            key={pokemon.id}
            id={pokemon.id}
            name={pokemon.name}
            img={pokemon.img} // Use the directly stored image URL
            types={pokemon.types || []}
            isFavorite={true}
            onFavoriteClick={() => pokeApi.toggleFavorite(pokemon)}
          />
        ))}
      </div>
      
      {pokeApi.favorites.length === 0 && (
        <p>No favorites selected yet. Go to the Search page to add some!</p>
      )}
    </div>
  );
}