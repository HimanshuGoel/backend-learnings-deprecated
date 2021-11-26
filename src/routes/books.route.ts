import { Request, Response, Router } from 'express';

import { getBooks } from '../utilities/mock-data.utility';

export class Books {
  private books = getBooks();

  public routes(app: Router): void {
    app.route('/books').get((req: Request, res: Response) => {
      res.status(200).send(this.books);
    });

    app.route('/books/:id').get((req: Request, res: Response) => {
      const id = Number(req.params.id);

      const selectedBook = this.books.find((book) => book.id === id);
      res.status(200).send(selectedBook);
    });

    app.route('/books/:id').post((req: Request, res: Response) => {
      // Create a new book
      const name = req.body.name;
      const attack = req.body.attack;
    });

    app.route('/books/:id').put((req: Request, res: Response) => {
      // Update a particular book
    });

    app.route('/books/:id').delete((req: Request, res: Response) => {
      // Delete a particular book
    });
  }
}
