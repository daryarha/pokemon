import React, { useState, useEffect } from 'react';
import CardGeneral from './CardGeneral';
import CapitalizeWord from './Capitalize.js';

const gqlQuery = `query pokemons($limit: Int, $offset: Int) {
    pokemons(limit: $limit, offset: $offset) {
      results {
        id
        url
        name
        image
      }
    }
  }`;
  
  const gqlVariables = {};
    
  
  const ListPokemon = () => {
    const [data, setData] = useState([]);
    const myPokemon = JSON.parse(localStorage.getItem('myPokemon')) || [];
    const pokeIds = JSON.parse(localStorage.getItem('pokemonId')) || [];
    const countOwns = JSON.parse(localStorage.getItem('countOwned')) || [];

    useEffect(() => {
      let dataId = [];
      let dataOwned = [];
      myPokemon.forEach((pokemon, index) => {
        if(dataId.findIndex((element) => element===pokemon.id) >= 0) {
          const idx = dataId.findIndex(element => element===pokemon.id);
          dataOwned[idx] += 1;
        } else {
          dataId.push(pokemon.id);
          dataOwned.push(1);
        }
      });
      localStorage.setItem('pokemonId', JSON.stringify(dataId));
      localStorage.setItem('countOwned', JSON.stringify(dataOwned));
      
      fetch('https://graphql-pokeapi.vercel.app/api/graphql', {
          credentials: 'omit',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: gqlQuery,
            variables: gqlVariables,
          }),
          method: 'POST',
        })
          .then((res) => res.json())
          .then((res) => setData(res.data.pokemons.results));
    }, []);
  
    document.title = "Pokemon List Card | Pokemon";

    const checkOwned = (pokemonId) => {
      if(pokeIds.findIndex(element => element===pokemonId) >= 0) {
        const idx = pokeIds.findIndex(element => element===pokemonId);
        const dataOwn = countOwns[idx];
        return (
          <React.Fragment>
          Total owned: {dataOwn}
          </React.Fragment>
          )
      } else {
        return (
          <React.Fragment>
          Total owned: 0
          </React.Fragment>
          )
      }
    }

    return (
        <div className="cards">
        {
            data.map((pokemon) => 
            <CardGeneral 
                key={pokemon.name}
                header={
                  <React.Fragment>
                  {CapitalizeWord(pokemon.name)} #{pokemon.id}
                  </React.Fragment>
                }
                description={
                  checkOwned(pokemon.id)
                }
                name={pokemon.name}
                image={pokemon.image}/>
            )
        }
        </div>
    );
  }

  export default ListPokemon
  
  
  
  