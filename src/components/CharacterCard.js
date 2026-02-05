import React from 'react';
import image from '../images/sem-foto.jpg';
import './CharacterCard.scss';

function CharacterCard({ character }) {
  const statusConfig =
    character.alive === true
      ? { label: 'Vivo', variant: 'vivo' }
      : character.alive === false
        ? { label: 'Falecido', variant: 'falecido' }
        : { label: 'Sem informação', variant: 'sem-informacao' };

  return (
    <article className="character-card">
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

      <div className="character-details">
        <h2>{character.name}</h2>
        <p>
          <strong>Data de Nascimento:</strong> {character.dateOfBirth || 'Desconhecido'}
        </p>
        <p>
          <strong>Casa:</strong> {character.house || 'Desconhecido'}
        </p>
        <p>
          <strong>Patrono:</strong> {character.patronus || 'Desconhecido'}
        </p>
        <p>
          <strong>Ator:</strong> {character.actor || 'Desconhecido'}
        </p>
      </div>
    </article>
  );
}

export default CharacterCard;
