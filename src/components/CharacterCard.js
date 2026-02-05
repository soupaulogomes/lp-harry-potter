import React from 'react';
import image from '../images/sem-foto.jpg';
import './CharacterCard.scss';

function CharacterCard({ character, onOpenDetails }) {
  const statusConfig =
    character.alive === true
      ? { label: 'Vivo', variant: 'vivo' }
      : character.alive === false
        ? { label: 'Falecido', variant: 'falecido' }
        : { label: 'Sem informação', variant: 'sem-informacao' };

  return (
    <button type="button" className="character-card" onClick={() => onOpenDetails(character)}>
      <div className="character-image">
        <img
          src={character.image || image}
          alt={character.name}
          loading="lazy"
          className={statusConfig.variant === 'falecido' ? 'character-image__photo--falecido' : ''}
        />
        <span className={`character-card__status character-card__status--${statusConfig.variant}`}>
          {statusConfig.label}
        </span>
      </div>

      <div className="character-summary">
        <h2>{character.name}</h2>
      </div>
    </button>
  );
}

export default CharacterCard;
