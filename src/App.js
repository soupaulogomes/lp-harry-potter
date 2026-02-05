import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import CharacterCard from './components/CharacterCard';
import CharacterModal from './components/CharacterModal';
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
  const [selectedCharacter, setSelectedCharacter] = useState(null);

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


  useEffect(() => {
    document.body.style.overflow = selectedCharacter ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCharacter]);

  const houseOptions = useMemo(() => {
    const houses = characters
      .map(character => character.house)
      .filter(Boolean)
      .map(house => house.trim())
      .filter(house => house.length > 0);

    return Array.from(new Set(houses)).sort();
  }, [characters]);

  const patronusOptions = useMemo(() => {
    const patronus = characters
      .map(character => character.patronus)
      .filter(Boolean)
      .map(value => value.trim())
      .filter(value => value.length > 0);

    return Array.from(new Set(patronus)).sort();
  }, [characters]);

  const actorOptions = useMemo(() => {
    const actors = characters
      .map(character => character.actor)
      .filter(Boolean)
      .map(value => value.trim())
      .filter(value => value.length > 0);

    return Array.from(new Set(actors)).sort();
  }, [characters]);

  const birthOptions = useMemo(() => {
    const births = characters
      .map(character => character.dateOfBirth)
      .filter(Boolean)
      .map(value => value.trim())
      .filter(value => value.length > 0);

    return Array.from(new Set(births)).sort((a, b) => a.localeCompare(b, 'pt-BR'));
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
      const matchesPatronus = normalizedPatronus ? patronus === normalizedPatronus : true;
      const matchesActor = normalizedActor ? actor === normalizedActor : true;
      const matchesBirth = normalizedBirth ? birth === normalizedBirth : true;
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

  return (
    <div className="app">
      <header className="header">
        <div className="header__content">
          <p className="header__eyebrow">Wizarding Directory</p>
          <h1>Personagens de Harry Potter</h1>
          <p className="header__subtitle">
            Busca no topo e filtros rápidos na lateral para uma navegação mais limpa e eficiente.
          </p>
        </div>
      </header>

      <section className="searchbar" aria-label="Busca de personagens">
        <label htmlFor="search">Buscar personagem</label>
        <div className="searchbar__wrap">
          <input
            id="search"
            type="text"
            placeholder="Nome, casa, patrono ou ator"
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
          />
          <button type="button" className="filters__reset" onClick={handleResetFilters}>
            Limpar tudo
          </button>
        </div>
      </section>

      <section className="content" aria-label="Filtros e resultados">
        <aside className="filters-sidebar" aria-label="Filtros avançados">
          <div className="filters__topbar">
            <p>Refine os resultados</p>
            {activeFiltersCount > 0 && <span className="filters__badge">{activeFiltersCount} ativo(s)</span>}
          </div>

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
            <select value={patronusFilter} onChange={event => setPatronusFilter(event.target.value)}>
              <option value="">Todos</option>
              {patronusOptions.map(patronus => (
                <option key={patronus} value={patronus}>
                  {patronus}
                </option>
              ))}
            </select>
          </label>

          <label>
            Ator
            <select value={actorFilter} onChange={event => setActorFilter(event.target.value)}>
              <option value="">Todos</option>
              {actorOptions.map(actor => (
                <option key={actor} value={actor}>
                  {actor}
                </option>
              ))}
            </select>
          </label>

          <label>
            Data de nascimento
            <select value={birthFilter} onChange={event => setBirthFilter(event.target.value)}>
              <option value="">Todas</option>
              {birthOptions.map(birth => (
                <option key={birth} value={birth}>
                  {birth}
                </option>
              ))}
            </select>
          </label>

          <label>
            Status
            <select value={aliveFilter} onChange={event => setAliveFilter(event.target.value)}>
              <option value="">Todos</option>
              <option value="true">Vivo</option>
              <option value="false">Falecido</option>
            </select>
          </label>
        </aside>

        <div className="results">
          <div className="results__summary">
            <p>
              {isLoading ? 'Carregando elenco mágico...' : `${filteredCharacters.length} personagem(ns) encontrado(s)`}
            </p>
          </div>

          {hasError && <p className="feedback feedback--error">Não foi possível carregar os personagens agora.</p>}
          {!hasError && isLoading && <p className="feedback feedback--loading">Abrindo o grimório...</p>}
          {!hasError && !isLoading && filteredCharacters.length === 0 && (
            <p className="feedback">Nenhum personagem combina com os filtros selecionados.</p>
          )}

          <main className="character-list">
            {filteredCharacters.map(character => (
              <CharacterCard
                key={`${character.name}-${character.actor}`}
                character={character}
                onOpenDetails={setSelectedCharacter}
              />
            ))}
          </main>
        </div>
      </section>

      {selectedCharacter && (
        <CharacterModal character={selectedCharacter} onClose={() => setSelectedCharacter(null)} />
      )}

      <SpeedInsights />
    </div>
  );
}

export default App;
