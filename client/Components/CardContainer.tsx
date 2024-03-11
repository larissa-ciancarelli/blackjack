import Card from './Card';

interface CardContainerProps {
  score: number,
  cards: string[]
};

// will need to display score and cards
const CardContainer = ({ score, cards }: CardContainerProps): JSX.Element => {
  
  return(
    <div>
      <h2>Score: {score}</h2>
      {cards.map((el) => <Card img={el} />)}
    </div>
  );
};

export default CardContainer;