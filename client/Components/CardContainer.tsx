/**
 * ************************************
 *
 * @module CardContainer
 * @description Renders house or player cards and displays score
 *
 * ************************************
 */

// components
import Card from './Card';

// types
import { Cards } from './types'

interface CardContainerProps {
  id: string,
  score: number,
  cards: Cards[]
};

const CardContainer = ({ id, score, cards }: CardContainerProps): JSX.Element => {
  
  return(
    <div>
      <h2>{id === 'house' ? 'House ': 'Your '}Score: {score}</h2>
      {cards.map((el) => <Card key={el.code} img={el.images.png} />)}
    </div>
  );
};

export default CardContainer;