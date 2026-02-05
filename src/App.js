import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import CharacterCard from './components/CharacterCard';
import './styles/App.scss';
import './styles/Global.scss';
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  const [characters, setCharacters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [houseFilter, setHouseFilter] = useState('');
  const [patronusFilter, setPatronusFilter] = useState('');
  const [actorFilter, setActorFilter] = useState('');
  const [birthFilter, setBirthFilter] = useState('');
  const [aliveFilter, setAliveFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const normalizeText = value =>
    value
      ?.toString()
      ?.normalize('NFD')
      ?.replace(/\p{Diacritic}/gu, '')
      ?.toLowerCase()
      ?.trim()
      ?.replace(/\s+/g, ' ') ?? '';

  const includesAllTokens = (value, query) => {
    if (!query) {
      return true;
    }

    const tokens = query.split(' ').filter(Boolean);
    return tokens.every(token => value.includes(token));
  };

  useEffect(() => {
    axios
      .get('https://hp-api.onrender.com/api/characters')
      .then(response => {
        setCharacters(response.data);
        setHasError(false);
      })
      .catch(error => {
        console.error('Erro ao buscar personagens:', error);
        setHasError(true);
      })
      .finally(() => setIsLoading(false));
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
    const normalizedSearch = normalizeText(searchTerm);
    const normalizedPatronus = normalizeText(patronusFilter);
    const normalizedActor = normalizeText(actorFilter);
    const normalizedBirth = normalizeText(birthFilter);
    const normalizedHouse = normalizeText(houseFilter);

    return characters.filter(character => {
      const name = normalizeText(character.name);
      const actor = normalizeText(character.actor);
      const patronus = normalizeText(character.patronus);
      const house = normalizeText(character.house);
      const birth = normalizeText(character.dateOfBirth);

      const matchesSearch = normalizedSearch
        ? [name, actor, patronus, house].some(field => includesAllTokens(field, normalizedSearch))
        : true;
      const matchesHouse = normalizedHouse ? house === normalizedHouse : true;
      const matchesPatronus = normalizedPatronus ? includesAllTokens(patronus, normalizedPatronus) : true;
      const matchesActor = normalizedActor ? includesAllTokens(actor, normalizedActor) : true;
      const matchesBirth = normalizedBirth ? includesAllTokens(birth, normalizedBirth) : true;
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

  const handleResetFilters = () => {
    setSearchTerm('');
    setHouseFilter('');
    setPatronusFilter('');
    setActorFilter('');
    setBirthFilter('');
    setAliveFilter('');
  };

  const activeFiltersCount = [
    searchTerm,
    houseFilter,
    patronusFilter,
    actorFilter,
    birthFilter,
    aliveFilter,
  ].filter(Boolean).length;

  const aliveCount = filteredCharacters.filter(character => character.alive === true).length;
  const deceasedCount = filteredCharacters.filter(character => character.alive === false).length;

  return (
    <div className="app">
      <header className="header">
        <div className="header__content">
          <p className="header__eyebrow">Wizarding Directory</p>
          <h1>Personagens de Harry Potter</h1>
          <p className="header__subtitle">
            Uma experiência elegante para explorar personagens, casas e patronos com filtros instantâneos.
          </p>
        </div>

        <div className="header__stats" aria-label="Resumo da busca">
          <article>
            <span>Resultado</span>
            <strong>{isLoading ? '...' : filteredCharacters.length}</strong>
          </article>
          <article>
            <span>Vivos</span>
            <strong>{isLoading ? '...' : aliveCount}</strong>
          </article>
          <article>
            <span>Falecidos</span>
            <strong>{isLoading ? '...' : deceasedCount}</strong>
          </article>
        </div>
      </header>

      <section className="filters" aria-label="Filtros de personagens">
        <div className="filters__topbar">
          <p>
            {isLoading
              ? 'Carregando elenco mágico...'
              : `${filteredCharacters.length} personagem(ns) encontrado(s)`}
          </p>
          {activeFiltersCount > 0 && <span className="filters__badge">{activeFiltersCount} filtro(s) ativo(s)</span>}
        </div>

        <div className="filters__search">
          <label htmlFor="search">Busca inteligente</label>
          <div className="filters__search-wrap">
            <input
              id="search"
              type="text"
              placeholder="Nome, casa, patrono ou ator"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
            />
            <button type="button" className="filters__reset" onClick={handleResetFilters}>
              Limpar
            </button>
          </div>
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
            Status
            <select value={aliveFilter} onChange={event => setAliveFilter(event.target.value)}>
              <option value="">Todos</option>
              <option value="true">Vivo</option>
              <option value="false">Falecido</option>
            </select>
          </label>
        </div>
      </section>

      {hasError && <p className="feedback feedback--error">Não foi possível carregar os personagens agora.</p>}
      {!hasError && isLoading && <p className="feedback feedback--loading">Abrindo o grimório...</p>}
      {!hasError && !isLoading && filteredCharacters.length === 0 && (
        <p className="feedback">Nenhum personagem combina com os filtros selecionados.</p>
      )}

      <main className="character-list">
        {filteredCharacters.map(character => (
          <CharacterCard key={`${character.name}-${character.actor}`} character={character} />
        ))}
      </main>

      <SpeedInsights />
    </div>
  );
}

export default App;
