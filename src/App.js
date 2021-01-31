import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import React from 'react';
import ListPokemon from "./ListPokemon";
import DetailPokemon from "./DetailPokemon";
import MyPokemon from "./MyPokemon";

const App = () => {    
  document.title = "Pokemon List Card | Pokemon";

  return (    
    <Router>
      <div className="container">
        <nav>
          <ul>
            <li>
              <Link exact={true} to="/" className="nav-item">Pokemon List Card</Link>
            </li>
            <li>
              <Link to="/my" className="nav-item">My Pokemon Card</Link>
            </li>
          </ul>
        </nav><br/>
        <div className="content">
          <Route exact={true} path="/" component={ListPokemon}/>          
          <Route path="/my" component={MyPokemon}/>
          <Route path="/pokemon/:pokemonName" component={DetailPokemon}/>          
        </div>
      </div>
  </Router>
  );
}

export default App;
