// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CharacterCard from './components/CharacterCard';
import './styles/App.scss';

function App() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    axios.get('https://hp-api.onrender.com/api/characters')
      .then(response => setCharacters(response.data))
      .catch(error => console.error('Erro ao buscar personagens:', error));
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>Personagens de Harry Potter</h1>
      </header>
      <main className="character-list">
        {characters.map(character => (
          <CharacterCard key={character.name} character={character} />
        ))}
      </main>
    </div>
  );
}

export default App;
