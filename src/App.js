import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import CharacterCard from './components/CharacterCard';
import './styles/App.scss';
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
  const [characters, setCharacters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [houseFilter, setHouseFilter] = useState('');
  const [patronusFilter, setPatronusFilter] = useState('');
  const [actorFilter, setActorFilter] = useState('');
  const [birthFilter, setBirthFilter] = useState('');
  const [aliveFilter, setAliveFilter] = useState('');

  useEffect(() => {
    axios.get('https://hp-api.onrender.com/api/characters')
      .then(response => setCharacters(response.data))
      .catch(error => console.error('Erro ao buscar personagens:', error));
  }, []);

  const houseOptions = useMemo(() => {
    const houses = characters
      .map(character => character.house)
      .filter(Boolean)
      .map(house => house.trim())
      .filter(house => house.length > 0);
    return Array.from(new Set(houses)).sort();
  }, [characters]);

  const filteredCharacters = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const normalizedPatronus = patronusFilter.trim().toLowerCase();
    const normalizedActor = actorFilter.trim().toLowerCase();
    const normalizedBirth = birthFilter.trim().toLowerCase();
    const normalizedHouse = houseFilter.trim().toLowerCase();

    return characters.filter(character => {
      const name = character.name?.toLowerCase() ?? '';
      const actor = character.actor?.toLowerCase() ?? '';
      const patronus = character.patronus?.toLowerCase() ?? '';
      const house = character.house?.toLowerCase() ?? '';
      const birth = character.dateOfBirth?.toLowerCase() ?? '';

      const matchesSearch = normalizedSearch
        ? [name, actor, patronus, house].some(field => field.includes(normalizedSearch))
        : true;
      const matchesHouse = normalizedHouse ? house === normalizedHouse : true;
      const matchesPatronus = normalizedPatronus ? patronus.includes(normalizedPatronus) : true;
      const matchesActor = normalizedActor ? actor.includes(normalizedActor) : true;
      const matchesBirth = normalizedBirth ? birth.includes(normalizedBirth) : true;
      const matchesAlive =
        aliveFilter === ''
          ? true
          : aliveFilter === 'true'
          ? character.alive === true
          : character.alive === false;

      return (
        matchesSearch &&
        matchesHouse &&
        matchesPatronus &&
        matchesActor &&
        matchesBirth &&
        matchesAlive
      );
    });
  }, [characters, searchTerm, houseFilter, patronusFilter, actorFilter, birthFilter, aliveFilter]);

  return (
    <div className="app">
      <header className="header">
        <h1>Personagens de Harry Potter</h1>
      </header>
      <section className="filters">
        <div className="filters__search">
          <label htmlFor="search">Busca</label>
          <input
            id="search"
            type="text"
            placeholder="Nome, casa, patrono ou ator"
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
          />
        </div>
        <div className="filters__grid">
          <label>
            Casa
            <select value={houseFilter} onChange={event => setHouseFilter(event.target.value)}>
              <option value="">Todas</option>
              {houseOptions.map(house => (
                <option key={house} value={house}>
                  {house}
                </option>
              ))}
            </select>
          </label>
          <label>
            Patrono
            <input
              type="text"
              placeholder="Ex: cervo"
              value={patronusFilter}
              onChange={event => setPatronusFilter(event.target.value)}
            />
          </label>
          <label>
            Ator
            <input
              type="text"
              placeholder="Nome do ator"
              value={actorFilter}
              onChange={event => setActorFilter(event.target.value)}
            />
          </label>
          <label>
            Data de nascimento
            <input
              type="text"
              placeholder="Ex: 31-07-1980"
              value={birthFilter}
              onChange={event => setBirthFilter(event.target.value)}
            />
          </label>
          <label>
            Vivo
            <select value={aliveFilter} onChange={event => setAliveFilter(event.target.value)}>
              <option value="">Todos</option>
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          </label>
        </div>
      </section>
      <main className="character-list">
        {filteredCharacters.map(character => (
          <CharacterCard key={character.name} character={character} />
        ))}
      </main>
      <SpeedInsights />
    </div>
  );
}

export default App;
