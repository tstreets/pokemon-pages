"use client";
import PokemonCard from './PokemonCard';
import styles from './PokemonCard.module.css';

export default function PokemonGrid({ pokemon, favorites, onFavoriteClick }) {
  return (
    <div className={styles.grid}>
      {pokemon.map((poke) => (
        <PokemonCard
          key={poke.id}
          id={poke.id}
          name={poke.name}
          img={poke.sprites.front_default}
          types={poke.types}
          isFavorite={favorites.includes(poke.id)}
          onFavoriteClick={() => onFavoriteClick(poke.id)}
        />
      ))}
    </div>
  );
}