import { Request, Response, Application, NextFunction } from 'express';

import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { getBooks } from '../utilities/mock-data.utility';

import BaseApiRoute from './base-api.route';

export class BooksRoute extends BaseApiRoute {
  constructor(express: Application) {
    super();
    this.register(express);
  }

  public register(app: Application): void {
    app.use('/api', this.router);

    this.router.get('/books', this.getBooks);
    this.router.get('/books/:id', this.getBookById);
    this.router.post('/books/:id', this.createBookById);
    this.router.put('/books/:id', this.updateBookById);
    this.router.delete('/books/:id', this.deleteBookById);
  }

  private getBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const response = getBooks();
      res.status(StatusCodes.OK).send({
        status: ReasonPhrases.OK,
        data: response
      });
    } catch (error) {
      next(error);
    }
  }

  private getBookById(req: Request, res: Response, next: NextFunction) {
    try {
      const books = getBooks();
      const id = Number(req.params.id);
      const response = books.find((book) => book.id === id);
      res.status(StatusCodes.OK).send({
        status: ReasonPhrases.OK,
        data: response
      });
    } catch (error) {
      next(error);
    }
  }

  private createBookById(req: Request, res: Response, next: NextFunction) {
    try {
      // Create a new book
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { name } = req.body;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { author } = req.body;
      res.status(StatusCodes.CREATED).send({
        status: ReasonPhrases.CREATED,
        data: {}
      });
    } catch (error) {
      next(error);
    }
  }

  private updateBookById(req: Request, res: Response, next: NextFunction) {
    try {
      // Update a particular book
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { name } = req.body;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { author } = req.body;
      res.status(StatusCodes.OK).send({
        status: ReasonPhrases.OK,
        data: {}
      });
    } catch (error) {
      next(error);
    }
  }

  private deleteBookById(req: Request, res: Response, next: NextFunction) {
    try {
      // Delete a particular book
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { name } = req.body;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { author } = req.body;
      res.status(StatusCodes.NO_CONTENT).send({
        status: ReasonPhrases.NO_CONTENT,
        data: {}
      });
    } catch (error) {
      next(error);
    }
  }
}

export default BooksRoute;
