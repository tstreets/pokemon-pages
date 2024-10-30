"use client";
import styles from './PokemonCard.module.css';

export default function PokemonCard({ id, name, img, types, habitat, eggGroups, isFavorite, onFavoriteClick }) {
  return (
    <div className={styles.card}>
      <img src={img} alt={name} />
      <h3>{name}</h3>
      <div className={styles.types}>
        {types.map(type => (
          <span key={type.type.name} className={styles[type.type.name]}>
            {type.type.name}
          </span>
        ))}
      </div>
      {habitat && <p>Habitat: {habitat}</p>}
      {eggGroups && eggGroups.length > 0 && (
        <p>Egg Groups: {eggGroups.join(', ')}</p>
      )}
      <button 
        onClick={onFavoriteClick}
        className={styles.favoriteButton}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
    </div>
  );
} 