/**
 * ************************************
 *
 * @module Board
 * @description Renders card containers for house and player
 *
 * ************************************
 */ 

// imports
import { useState, useEffect } from 'react';

// components
import CardContainer from './CardContainer';

// types
import { Deck, CardsResponse } from './types'

const faceCards = {
  'JACK': true,
  'QUEEN': true,
  'KING': true
};

const Board = (): JSX.Element => {

  /**
   * ===================
   *        STATE
   * ===================
  */
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
  const [stand, setStand] = useState(false);
  const [deckStatus, setDeckStatus] = useState('')

  //lifecycle methods
  // request a new shuffled deck when the board initially loads
  useEffect(() => {
    shuffleCards()
  }, []);

  useEffect(() => {
    checkForWin();
  }, [playerCards, stand]);

  /**
   * ===================
   *     FUNCTIONS
   * ===================
  */

  /**
   * @name shuffleCards
   * @description resets the deck when there are no cards remaining from the previous deck
   *  or loads a deck on initial render
   */
  const shuffleCards = (): void => {
    // disables user from trying to hit or stand while deck is loading
    setDeckStatus('paused');

    fetch('/cards')
      .then(response => response.json())
      .then((data: Deck) => setDeck(data))
      .catch(err => console.log(err))

    setDeckStatus('ready');
  };

  /**
   * @name drawCards
   * @description resets the game and starts a new game from the same deck
   *  sends request to the server for 4 new cards and iterates through results
   *  to create initial scores for the house and player
   */
  const drawCards = (): void => {
    if (hasAce) setHasAce(false);
    if (stand) setStand(false);
    setDeckStatus('ready');

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

  /**
   * @name handleHitClick
   * @description sends request to the server when a player requests another card
   *  updates the player score 
   */
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

  /**
   * @name checkForWin
   * @description runs each time the player score updates and when a player requests to stand
  */
  const checkForWin = (): void => {
    if (score.player > 21 || 
      stand && score.player <= score.house ||
      score.house === 21){
        setDeckStatus('paused');
        alert('you lose :(');
    } else if (score.player === 21 && score.house !== 21 ||
      stand && score.player > score.house){
        setDeckStatus('paused');
        alert('you win :)');
    };
  }

  const handleStandClick = (): void => {
    setStand(true);
    setDeckStatus('pause')
  };

  if (deck.remaining === 0){
    shuffleCards();
  }

  /**
   * ===================
   *  READY FOR RENDER
   * ===================
  */
  return(
    <div id="board">Board
      <button id="startButton" onClick={() => drawCards()}>Start Game</button>
      <div id="cardContainer">
      <CardContainer id="house" score={score.house} cards={houseCards} />
      <CardContainer id="player" score={score.player} cards={playerCards}/>
      </div>
      <div id="buttonContainer">
      <button className="standOrHit" disabled={deckStatus==='paused'} onClick={() => handleStandClick()}>Stand</button>
      <button className="standOrHit" disabled={deckStatus === 'paused'} onClick={(() => handleHitClick())}>Hit</button>   
      </div>
    </div>
  );
};

export default Board;
