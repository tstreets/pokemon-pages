"use client";
import styles from './pokemonCard.module.css';
import Link from 'next/link';

export default function PokemonCard({ 
  id, 
  name, 
  img, 
  types, 
  habitat, 
  eggGroups, 
  isFavorite, 
  onFavoriteClick 
}) {

  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div className={styles.card}>
      <Link href={`/pokemon1/${id}`} className={styles.cardLink}>
        <div className={styles.cardContent}>
          <div className={styles.imageContainer}>
            <img src={img} alt={name} className={styles.pokemonImage} />
          </div>
          
          <div className={styles.cardInfo}>
            <h3 className={styles.pokemonName}>{capitalizedName}</h3>
            
            <div className={styles.types}>
              {types.map(type => (
                <span 
                  key={type.type.name} 
                  className={`${styles.typeTag} ${styles[type.type.name]}`}
                >
                  {type.type.name}
                </span>
              ))}
            </div>

            {habitat && (
              <div className={styles.habitat}>
                <span>Habitat: {habitat}</span>
              </div>
            )}

            {eggGroups && eggGroups.length > 0 && (
              <div className={styles.eggGroups}>
                <span>Egg Groups: {eggGroups.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      <button 
        onClick={(e) => {
          e.preventDefault(); 
          onFavoriteClick();
        }}
        className={styles.favoriteButton}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
    </div>
  );
}