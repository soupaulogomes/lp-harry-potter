import React, { useEffect } from 'react';
import image from '../images/sem-foto.jpg';

function CharacterModal({ character, onClose }) {
  useEffect(() => {
    const handleEsc = event => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!character) {
    return null;
  }

  const statusLabel =
    character.alive === true ? 'Vivo' : character.alive === false ? 'Falecido' : 'Sem informação';

  const wand = character.wand
    ? [character.wand.wood, character.wand.core, character.wand.length && `${character.wand.length}"`]
        .filter(Boolean)
        .join(' • ')
    : '';

  const fields = [
    ['Nome original', character.alternate_names?.join(', ') || 'Sem registro'],
    ['Espécie', character.species || 'Sem registro'],
    ['Gênero', character.gender || 'Sem registro'],
    ['Casa', character.house || 'Sem registro'],
    ['Nascimento', character.dateOfBirth || 'Sem registro'],
    ['Ano de nascimento', character.yearOfBirth || 'Sem registro'],
    ['Patrono', character.patronus || 'Sem registro'],
    ['Bruxo', character.wizard ? 'Sim' : 'Não'],
    ['Aluno de Hogwarts', character.hogwartsStudent ? 'Sim' : 'Não'],
    ['Professor de Hogwarts', character.hogwartsStaff ? 'Sim' : 'Não'],
    ['Ator/Atriz', character.actor || 'Sem registro'],
    ['Olhos', character.eyeColour || 'Sem registro'],
    ['Cabelo', character.hairColour || 'Sem registro'],
    ['Varinha', wand || 'Sem registro'],
  ];

  return (
    <div className="character-modal" role="dialog" aria-modal="true" aria-label={`Detalhes de ${character.name}`}>
      <div className="character-modal__overlay" onClick={onClose} />
      <div className="character-modal__content">
        <button type="button" className="character-modal__close" onClick={onClose}>
          ✕
        </button>

        <div className="character-modal__header">
          <img src={character.image || image} alt={character.name} />
          <div>
            <h3>{character.name}</h3>
            <p>{statusLabel}</p>
          </div>
        </div>

        <dl className="character-modal__grid">
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default CharacterModal;
