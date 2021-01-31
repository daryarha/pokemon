import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CapitalizeWord from './Capitalize.js';
import Swal from 'sweetalert2';

const gqlQuery = `query pokemon($name: String!) {
    pokemon(name: $name) {
      id
      name
      weight
      height
      base_experience
      sprites {
        front_default
      }      
    	abilities {
        ability {
          name
        }
      }
      moves {
        move {
          name
        }
      }
      types {
        type {
          name
        }
      }
    }
  }`;
  let gqlVariables;

  
  const Attribute = ({ title, value }) => {
    return (
      <div className="attribute">
        <div className="card-attribute-title">
          {title}
        </div>
        <div className="card-attribute-value">
          {value}
        </div>
      </div>
    );
  }
  
  const DetailPokemon = () => {
    const [dataDetail, setDataDetail] = useState([]);
    const [dataMyPokemon, setMyPokemon] = useState(
      JSON.parse(localStorage.getItem('myPokemon')) || []
    );
    const pokemonName = useParams().pokemonName;
    // console.log(JSON.parse(dataMyPokemon));

    gqlVariables =  {
        "name": pokemonName
    };

    useEffect(() => {
      try {
        localStorage.setItem('myPokemon', JSON.stringify(dataMyPokemon));
      } catch (error) {
        console.log(error);
      }
    }, [dataMyPokemon]);

    const savePokemon = name => {
      const oldData = dataMyPokemon;
      const dataStore = {
        nickname: name,
        id: id,
        name: pokemonName,
        image: image
      }
      if(oldData) {
        setMyPokemon(oldData.concat(dataStore));
      } else {
        setMyPokemon(dataStore);
      }
    }

    function catchPokemon() {
      const result = Math.random() < 0.5;
      const icon = result ? 'success' : 'error';
      const main_text = result ? `You catch the ${namePoke}!` : `The ${namePoke} run away!`;
      const sub_text = result ? 'Give your new pokemon a name!' : '';
      const type_input = result ? 'text' : false;
      Swal.fire({
        title: main_text,
        text: sub_text,
        input: type_input,
        icon: icon,
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (!value) {
              resolve('You need to give a name!')
            } else {              
              dataMyPokemon.map(dt => {
                if(dt.nickname===value && dt.id===id){                  
                  resolve('Name already exist! <br/> Give another name')
                }
              });
              resolve()
            }
          })
        },
        showCancelButton: true,
        showConfirmButton: result,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Save pokemon!'
      }).then((result) => {
        if (result.isConfirmed) {
          savePokemon(result.value);
          Swal.fire(
            'New pokemon has been saved!',
            'Go to my pokemon page for detail!',
            'success'
          )
        }
      });
    }

    useEffect(() => {
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
            .then((res) => setDataDetail(res.data.pokemon));
    }, []);
    
    const namePoke = CapitalizeWord(pokemonName);
    let id;
    if(dataDetail.id){
      id = dataDetail.id;
    }
    let image;
    if(dataDetail.sprites){
      image = dataDetail.sprites.front_default;
    }
    document.title = `${namePoke} | Pokemon`;
    return (
      <div className="base-detail">
        <br/>
        {namePoke} <span className="number">#{dataDetail.id}</span>
        <div className="container-detail">
            <div className="slot-image">
              {/* <amp-img layout="responsive" height="200" width="200" src={dataDetail.sprites && dataDetail.sprites.front_default} alt={namePoke}> */}
              {/* </amp-img> */}
              <img width="100%" src={dataDetail.sprites && dataDetail.sprites.front_default} alt={namePoke}/>
            </div>
            <div className="slot-detail">
              <div className="card-attribute">                 
                <Attribute title={"Height"} value={`${dataDetail.height*10} cm`} />                              
                <Attribute title={"Weight"} value={`${dataDetail.weight/10} kg`} />                
                <Attribute title={"Base Experience"} value={dataDetail.base_experience} />                
                <Attribute title={"Type"} 
                  value={dataDetail.types && dataDetail.types.map(tp =>
                    <div key={tp.type.name}>{CapitalizeWord(tp.type.name.replace('-', ' '))}</div>
                  )} 
                />                
                <Attribute title={"Abilities"} 
                  value={dataDetail.abilities && dataDetail.abilities.map(ab =>
                    <div key={ab.ability.name}>{CapitalizeWord(ab.ability.name.replace('-', ' '))}</div>
                  )}
                />
                             
              </div>
              <button className="btn-catch" onClick={catchPokemon}>
                Catch Pokemon 
                <amp-img height="28" width="28" class="img-pokeball" src="/favicon2.ico" alt="pokeball"></amp-img>
              </button>
            </div>
        </div>
        <div className="card-moves">
          List of {namePoke} Moves
          <div className="list-moves">                        
            {dataDetail.moves && dataDetail.moves.map(mv =>
              <div className="btn-move" key={mv.move.name}>
                {CapitalizeWord(mv.move.name.replace('-', ' '))}
              </div>
            )}   
          </div>     
        </div>
      </div>
    );
  }

  export default DetailPokemon
  
  
  
  