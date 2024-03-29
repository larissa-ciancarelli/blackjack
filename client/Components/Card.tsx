/**
 * ************************************
 *
 * @module Card
 * @description renders individual card image
 *
 * ************************************
 */

interface CardProps {
  img: string
}

const Card = ({ img }: CardProps): JSX.Element => {
  return (
    <img className="playingcard" src={img} />
  );
};

export default Card;
