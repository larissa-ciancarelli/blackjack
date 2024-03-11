import { Request, Response, NextFunction, RequestHandler } from 'express';

interface CardControllerTypes {
  getNewDeck: RequestHandler,
  drawCards: RequestHandler
}

const CardController: CardControllerTypes = {
  getNewDeck: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let deck = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/');
      deck = await deck.json();
      
      res.locals.newDeck = deck;
      return next();
    } catch (err) {
      return next({
        log: 'error occurred in CardController.getNewDeck middleware ', err,
        message: 'an error occurred while shuffling a new deck'
      });
    };
  },

  drawCards: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { deckId } = req.params;
      let count = 1;
      if (req.query.cound) count = Number(req.query.count);

      let cards = await fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`);
      cards = await cards.json();

      res.locals.newCards = cards;
      return next();
    } catch (err) {
      return next({
        log: 'an error occurred in CardController.drawCards middleware ', err,
        message: 'an error occurred while drawing cards'
      });
    };
  }

};

export default CardController;