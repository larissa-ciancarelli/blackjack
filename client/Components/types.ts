export interface Deck {
  success: boolean,
  deck_id: string,
  shuffled: boolean,
  remaining: number
};

export interface Cards {
  code: string, 
  image: string, 
  images: {png: string, svg: string},
  value: string, 
  suit: string
};

export interface CardsResponse {
  success: boolean,
  deck_id: string,
  cards: Cards[],
  remaining: number
};
