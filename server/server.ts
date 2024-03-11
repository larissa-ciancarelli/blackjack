import express, { Request, Response, NextFunction } from 'express';

import CardController from './CardController';

const app = express();

interface ServerError {
  log: string,
  status: number,
  message: {
    err: string
  };
};

app.use(express.json());

/**
  * ==================================
  *    routes for client requests
  * ==================================
*/

app.get('/cards', CardController.getNewDeck, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.newDeck);
});

app.get('/cards/:deckId', CardController.drawCards, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.newCards);
});

/**
  * ==================================
  *          error handlers
  * ==================================
*/

app.use('*', (req: Request, res: Response) => {
  return res.status(404).send('page not found :(');
});

app.use('/', (err: ServerError, req: Request, res: Response, next: NextFunction) => {
  const defaultErr: ServerError = {
    log: 'Express global error handler caught unknown error',
    status: 500,
    message: { err: 'An error occurred' }
  };
  const errObj = Object.assign({}, defaultErr, err);
  console.log(errObj.log);
  return res.status(errObj.status).json(errObj.message);
});

app.listen(3000, () => console.log('server is listening on port 3000'));
