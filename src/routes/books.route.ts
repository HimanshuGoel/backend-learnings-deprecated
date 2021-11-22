import { Request, Response, Router } from 'express';

export class Books {
  private books = [
    { id: 1, name: 'The Lord of the Rings' },
    { id: 2, name: 'The Hobbit' }
  ];

  public routes(app: Router): void {
    // Received the express instance from app.ts file
    app.route('/books').get((req: Request, res: Response) => {
      res.status(200).send(this.books);
    });

    app.route('/books/:id').get((req: Request, res: Response) => {
      // Show info about a specific book
      const id = Number(req.params.id);

      const selectedBook = this.books.find((book) => book.id === id);
      res.status(200).send(selectedBook);
    });

    app.route('/books/:id').post((req: Request, res: Response) => {
      // Create a new book, then redirect somewhere
      const name = req.body.name;
      const attack = req.body.attack;
    });

    app.route('/books/:id').put((req: Request, res: Response) => {
      // Update a particular book and redirect somewhere
    });

    app.route('/books/:id').delete((req: Request, res: Response) => {
      // Delete a particular book and redirect somewhere
    });
  }
}
