import Card from './Card';
import { Cards } from './types'

interface CardContainerProps {
  score: number,
  cards: Cards[]
};

// will need to display score and cards
const CardContainer = ({ score, cards }: CardContainerProps): JSX.Element => {
  
  return(
    <div>
      <h2>Score: {score}</h2>
      {cards.map((el) => <Card key={el.code} img={el.images.png} />)}
    </div>
  );
};

export default CardContainer;