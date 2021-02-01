import React, { useState, useEffect } from 'react';
import CardGeneral from './CardGeneral';
import CapitalizeWord from './Capitalize.js';
import Swal from 'sweetalert2';
import logo from './favicon2.ico';
   
  
  const MyPokemon = () => {
    const [myPokemon, setMyPokemon] = useState(
      JSON.parse(localStorage.getItem('myPokemon')) || []
    );
  
    document.title = "My Pokemon Card | Pokemon";

    
    useEffect(() => {
        try {
          localStorage.setItem('myPokemon', JSON.stringify(myPokemon));
        } catch (error) {
          console.log(error);
        }
      }, [myPokemon]);


    const releasePokemon = (idx, name, nickname) => {        
      Swal.fire({
        title: 'You are about to <br/> release a pokemon',
        html: `Pokemon you are going to release is <br/> <b>${nickname}</b> the <b>${name}</b> <br/> Are you sure about this?`,
        icon: 'warning',
        showCancelButton: true,
        showDenyButton: true,
        showConfirmButton: false,
        denyButtonText: 'Release pokemon!'
      }).then((result) => {
        if (result.isDenied) {
          setMyPokemon(myPokemon.slice(0, idx).concat(myPokemon.slice(idx+1, myPokemon.length)))
          Swal.fire(
            'A pokemon has been released!',
            'Go catch a new pokemon in list page',
            'success'
          )
        }
      });
    }

    if(!myPokemon.length){
        Swal.fire({
          title: 'You dont have any pokemon at the moment',
          html: `Catch the pokemon in the list page`,
          icon: 'info',
        });
    }     
    return (
        <div className="cards">
        {
            myPokemon.map((pokemon, index) => 
            <CardGeneral 
                key={pokemon.nickname+pokemon.id}
                header={
                    <React.Fragment>
                    {CapitalizeWord(pokemon.name)} #{pokemon.id}
                    <br/>
                    Nickname: {pokemon.nickname}
                    </React.Fragment>
                }
                description={
                    <button className="btn-catch" onClick={() => releasePokemon(index, pokemon.name, pokemon.nickname)}>
                      Release 
                      <amp-img class="img-pokeball" src={logo} alt="pokeball" height="15" width="15"></amp-img>
                    </button>
                }
                name={pokemon.name}
                image={pokemon.image}/>
            )
        }
        </div>
    );

  }

  export default MyPokemon
  
  
  
  