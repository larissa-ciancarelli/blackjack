
import { useState, useEffect } from 'react';

import CardContainer from './CardContainer';

const Board = (): JSX.Element => {
  //state
  const [score, setScore] = useState({
    house: 0,
    player: 0
  });
  const [deck, setDeck] = useState({
    success: false,
    deck_id: '',
    shuffled: false,
    remaining: 1
  });

  //lifecycle methods
  // request a new shuffled deck when the board initially loads
  useEffect(() => {
    shuffleCards()
  }, []);

  //Functions
  const shuffleCards = (): void => {
    fetch('/cards')
      .then(response => response.json())
      .then(data => setDeck(data))
      .catch(err => console.log(err))
  };

  const drawCards = (): void => {
    fetch(`/cards/${deck.deck_id}?count=4`)
      .then(response => response.json())
      .then(data => {
        setDeck({...deck, remaining: deck.remaining})
      })
      .catch(err => console.log(err));
  };

  const handleHitClick = (): void => {};

  const handleStandClick = (): void => {};

  return(
    <div>Board
      <button onClick={() => drawCards()}>Start Game</button>
      <CardContainer score={1} cards={['1', '2']} />
      <CardContainer score={2} cards={['3', '4']}/>
      <button>Hit</button>
      <button>Stand</button>
    </div>
  );
};

export default Board;
