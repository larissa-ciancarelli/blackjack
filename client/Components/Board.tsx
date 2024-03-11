
import { useState, useEffect } from 'react';

import CardContainer from './CardContainer';

import { Deck, CardsResponse } from './types'

const faceCards = {
  'JACK': true,
  'QUEEN': true,
  'KING': true
};

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
  const [houseCards, setHouseCards] = useState([]);
  const [playerCards, setPlayerCards] = useState([]);
  const [hasAce, setHasAce] = useState(false);

  //lifecycle methods
  // request a new shuffled deck when the board initially loads
  useEffect(() => {
    shuffleCards()
  }, []);

  //Functions
  const shuffleCards = (): void => {
    fetch('/cards')
      .then(response => response.json())
      .then((data: Deck) => setDeck(data))
      .catch(err => console.log(err))
  };

  const drawCards = (): void => {

    fetch(`/cards/${deck.deck_id}?count=4`)
      .then(response => response.json())
      .then((data: CardsResponse) => {
        setDeck({...deck, remaining: deck.remaining});
        setHouseCards([data.cards[0], data.cards[1]]);
        setPlayerCards([data.cards[2], data.cards[3]]);

        const cardValues: number[] = [];
        data.cards.forEach((card, i) => {
          if (faceCards.hasOwnProperty(card.value)){
            cardValues.push(10);
          } else if (card.value === 'ACE') { 
            cardValues.push(11);
            // condition to make sure hasAce will not be set to true for House cards
            if (i > 1) setHasAce(true)
          } else cardValues.push(Number(card.value));
        });

        let houseScore = cardValues[0] + cardValues[1];
        // check to see if the house's cards contain two Aces
        if (houseScore > 21) houseScore -= 10;
        let playerScore = cardValues[2] + cardValues[3];
        setScore({ house: houseScore, player: playerScore });
      })
      .catch(err => console.log(err));
  };

  const handleHitClick = (): void => {

    fetch(`/cards/${deck.deck_id}`)
      .then(response => response.json())
      .then((data: CardsResponse) => {
        setDeck({ ...deck, remaining: data.remaining });
        setPlayerCards([...playerCards, data.cards[0]]);
     
        let cardVal = 0;
        if (faceCards.hasOwnProperty(data.cards[0].value)) cardVal = 10;
        else if (data.cards[0].value === 'ACE') {
          score.player <= 10 ? cardVal = 11: cardVal = 1;
          setHasAce(true);
        } else cardVal = Number(data.cards[0].value);

        let totalScore = cardVal + score.player;
        if (hasAce && totalScore > 21) {
          totalScore -= 10;
          setHasAce(false);
        };
          
        setScore({ ...score, player: totalScore});
      })
      .catch(err => console.log(err));
  };

  const handleStandClick = (): void => {};

  return(
    <div>Board
      <button onClick={() => drawCards()}>Start Game</button>
      <CardContainer score={score.house} cards={houseCards} />
      <CardContainer score={score.player} cards={playerCards}/>
      <button onClick={() => handleHitClick()}>Hit</button>
      <button>Stand</button>
    </div>
  );
};

export default Board;
