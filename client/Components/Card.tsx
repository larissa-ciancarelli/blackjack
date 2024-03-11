interface CardProps {
  img: string
}

const Card = ({ img }: CardProps): JSX.Element => {
  return (
    <img src={img} />
  );
};

export default Card;