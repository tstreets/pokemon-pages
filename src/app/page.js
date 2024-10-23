"use client";
import usePokemonApi from "@/hooks/usePokemonApi";
import { useEffect } from "react";

export default function Home() {
  const pokeData = usePokemonApi();

  useEffect(() => {
    if (pokeData.totalPokemonCount === 0) {
      pokeData.getNumberOfPokemon();
    }
  }, [pokeData]);

  console.log(pokeData);
  return (
    <main>
      <h1>Home</h1>
    </main>
  );
}
