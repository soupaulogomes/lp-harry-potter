import React from 'react';
import image from '../images/sem-foto.jpg'
import './CharacterCard.scss';

function CharacterCard({ character }) {
  return (
    <div className="character-card">
      <div className="character-image">
      <img src={character.image ? character.image : image} alt={character.name} />
      </div>
      <div className="character-details">
        <h2>{character.name}</h2>
        <p><strong>Data de Nascimento:</strong> {character.dateOfBirth || 'Desconhecido'}</p>
        <p><strong>Casa:</strong> {character.house || 'Desconhecido'}</p>
        <p><strong>Patrono:</strong> {character.patronus || 'Desconhecido'}</p>
        <p><strong>Ator:</strong> {character.actor || 'Desconhecido'}</p>
        <p><strong>Vivo:</strong> {character.alive ? 'Sim' : 'Não'}</p>
      </div>
    </div>
  );
}

export default CharacterCard;
